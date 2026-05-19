# pip install yfinance pandas numpy matplotlib mplfinance ta

import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import mplfinance as mpf
from datetime import datetime
import time


# ══════════════════════════════════════════════════════════════════
# 1. FETCH STOCK DATA
# ══════════════════════════════════════════════════════════════════

def fetch_data(ticker, period="3mo", interval="1d"):
    """
    Fetch OHLCV data using yfinance.
    
    ticker   : NSE → "SERVOTECH.NS"  |  BSE → "535002.BO"  |  US → "AAPL"
    period   : "1d", "5d", "1mo", "3mo", "6mo", "1y"
    interval : "1m","5m","15m","30m","1h","1d","1wk"
    
    Note: Intraday intervals (1m–1h) only work for recent periods.
    """
    print(f"Fetching {ticker} | period={period} | interval={interval}")
    df = yf.download(ticker, period=period, interval=interval, progress=False)
    df.dropna(inplace=True)
    print(f"  → {len(df)} candles loaded. Last: {df.index[-1]}")
    return df


# ══════════════════════════════════════════════════════════════════
# 2. TECHNICAL INDICATORS
# ══════════════════════════════════════════════════════════════════

def add_indicators(df):
    """Add common indicators to the DataFrame."""
    close = df["Close"].squeeze()
    high  = df["High"].squeeze()
    low   = df["Low"].squeeze()
    vol   = df["Volume"].squeeze()

    # ── Moving Averages ──────────────────────────────────────────
    df["EMA_9"]  = close.ewm(span=9,  adjust=False).mean()
    df["EMA_21"] = close.ewm(span=21, adjust=False).mean()
    df["SMA_50"] = close.rolling(50).mean()
    df["SMA_200"]= close.rolling(200).mean()

    # ── RSI (14) ─────────────────────────────────────────────────
    delta = close.diff()
    gain  = delta.clip(lower=0)
    loss  = -delta.clip(upper=0)
    avg_gain = gain.ewm(com=13, adjust=False).mean()
    avg_loss = loss.ewm(com=13, adjust=False).mean()
    rs = avg_gain / avg_loss
    df["RSI"] = 100 - (100 / (1 + rs))

    # ── MACD ─────────────────────────────────────────────────────
    ema12 = close.ewm(span=12, adjust=False).mean()
    ema26 = close.ewm(span=26, adjust=False).mean()
    df["MACD"]        = ema12 - ema26
    df["MACD_Signal"] = df["MACD"].ewm(span=9, adjust=False).mean()
    df["MACD_Hist"]   = df["MACD"] - df["MACD_Signal"]

    # ── Bollinger Bands (20, 2σ) ──────────────────────────────────
    sma20 = close.rolling(20).mean()
    std20 = close.rolling(20).std()
    df["BB_Mid"]   = sma20
    df["BB_Upper"] = sma20 + 2 * std20
    df["BB_Lower"] = sma20 - 2 * std20
    df["BB_Width"] = (df["BB_Upper"] - df["BB_Lower"]) / df["BB_Mid"]

    # ── ATR (14) — volatility / stop-loss sizing ──────────────────
    tr = pd.concat([
        high - low,
        (high - close.shift()).abs(),
        (low  - close.shift()).abs()
    ], axis=1).max(axis=1)
    df["ATR"] = tr.ewm(span=14, adjust=False).mean()

    # ── VWAP (resets daily for intraday use) ─────────────────────
    typical_price = (high + low + close) / 3
    df["VWAP"] = (typical_price * vol).cumsum() / vol.cumsum()

    # ── Volume SMA ────────────────────────────────────────────────
    df["Vol_SMA20"] = vol.rolling(20).mean()

    return df


# ══════════════════════════════════════════════════════════════════
# 3. SIGNAL GENERATION
# ══════════════════════════════════════════════════════════════════

def generate_signals(df):
    """
    Simple rule-based buy/sell signals.
    Returns the DataFrame with a 'Signal' column: 1=BUY, -1=SELL, 0=HOLD
    """
    df = df.copy()
    df["Signal"] = 0

    close = df["Close"].squeeze()

    for i in range(1, len(df)):
        # Extract scalar values using iloc (positional indexing)
        prev_ema9 = df["EMA_9"].iloc[i - 1]
        prev_ema21 = df["EMA_21"].iloc[i - 1]
        curr_ema9 = df["EMA_9"].iloc[i]
        curr_ema21 = df["EMA_21"].iloc[i]
        curr_rsi = df["RSI"].iloc[i]
        curr_close = df["Close"].iloc[i]
        curr_sma50 = df["SMA_50"].iloc[i]
        curr_bb_mid = df["BB_Mid"].iloc[i]

        # BUY conditions (all must be true)
        buy = (
            prev_ema9 <= prev_ema21 and  # crossover happening
            curr_ema9 > curr_ema21  and  # EMA 9 crosses above 21
            curr_rsi < 65           and  # not overbought
            curr_close > curr_sma50 and  # above 50 SMA trend
            curr_close > curr_bb_mid     # above BB midline
        )

        # SELL conditions (any one triggers)
        sell = (
            (prev_ema9 >= prev_ema21 and curr_ema9 < curr_ema21) or  # EMA death cross
            curr_rsi > 75                                             # overbought
        )

        if buy:
            df.loc[df.index[i], "Signal"] = 1
        elif sell:
            df.loc[df.index[i], "Signal"] = -1

    return df


# ══════════════════════════════════════════════════════════════════
# 4. BASIC BACKTEST
# ══════════════════════════════════════════════════════════════════

def simple_backtest(df, initial_capital=100000):
    """
    Walk through signals. Buy on BUY signal, sell on SELL signal.
    Returns a summary dict and trades list.
    """
    capital = initial_capital
    shares  = 0
    trades  = []
    entry_price = 0

    for i, row in df.iterrows():
        close = row["Close"].item() if hasattr(row["Close"], 'item') else row["Close"]
        sig   = int(row["Signal"].item() if hasattr(row["Signal"], 'item') else row["Signal"])

        if sig == 1 and shares == 0:          # BUY
            shares = int(capital // close)
            cost   = shares * close
            capital -= cost
            entry_price = close
            trades.append({"date": i, "action": "BUY", "price": close, "shares": shares})

        elif sig == -1 and shares > 0:         # SELL
            proceeds = shares * close
            capital += proceeds
            pnl = (close - entry_price) * shares
            trades.append({"date": i, "action": "SELL", "price": close, "shares": shares, "pnl": pnl})
            shares = 0

    # Final portfolio value
    final_value = capital + shares * df["Close"].iloc[-1]
    total_return = (final_value - initial_capital) / initial_capital * 100

    summary = {
        "initial_capital": initial_capital,
        "final_value": round(final_value, 2),
        "total_return_pct": round(total_return, 2),
        "total_trades": len(trades),
        "buy_hold_return": round(
            (df["Close"].iloc[-1] - df["Close"].iloc[0])
            / df["Close"].iloc[0] * 100, 2
        )
    }
    return summary, trades


# ══════════════════════════════════════════════════════════════════
# 5. PLOT CHART (static — good for daily/swing analysis)
# ══════════════════════════════════════════════════════════════════

def plot_chart(df, ticker="Stock"):
    """Plot candlestick + indicators using mplfinance."""
    plot_df = df[["Open", "High", "Low", "Close", "Volume"]].copy()
    plot_df.columns = ["Open", "High", "Low", "Close", "Volume"]

    # Overlay lines
    ema9  = mpf.make_addplot(df["EMA_9"],  color="blue",   width=1.2)
    ema21 = mpf.make_addplot(df["EMA_21"], color="orange",  width=1.2)
    bb_u  = mpf.make_addplot(df["BB_Upper"], color="grey", linestyle="--", width=0.8)
    bb_l  = mpf.make_addplot(df["BB_Lower"], color="grey", linestyle="--", width=0.8)
    rsi   = mpf.make_addplot(df["RSI"], panel=1, color="purple", ylabel="RSI")
    macd  = mpf.make_addplot(df["MACD"], panel=2, color="green", ylabel="MACD")
    macd_s= mpf.make_addplot(df["MACD_Signal"], panel=2, color="red")

    mpf.plot(
        plot_df,
        type="candle",
        style="charles",
        title=f"\n{ticker} — Candlestick + EMA9/21 + BB + RSI + MACD",
        addplot=[ema9, ema21, bb_u, bb_l, rsi, macd, macd_s],
        volume=True,
        figsize=(14, 9),
        panel_ratios=(4, 1.5, 1.5),
        tight_layout=True
    )


# ══════════════════════════════════════════════════════════════════
# 6. LIVE REFRESH LOOP (simulated — polls every N seconds)
# ══════════════════════════════════════════════════════════════════

def live_monitor(ticker, interval="5m", refresh_sec=60, max_loops=5):
    """
    Refreshes data every refresh_sec seconds.
    Prints latest indicator values — acts as a live terminal dashboard.
    
    For true real-time streaming, use a WebSocket broker API
    (Zerodha Kite Connect, Upstox, Angel One SmartAPI, etc.)
    """
    print(f"\n{'─'*55}")
    print(f"  LIVE MONITOR: {ticker}  |  Refresh: {refresh_sec}s")
    print(f"{'─'*55}\n")

    for loop in range(max_loops):
        df = fetch_data(ticker, period="1d", interval=interval)
        df = add_indicators(df)
        df = generate_signals(df)

        last        = df.iloc[-1]
        close       = float(last["Close"])
        rsi         = round(float(last["RSI"]), 1)
        macd_val    = round(float(last["MACD"]), 4)
        signal      = int(last["Signal"])
        atr         = round(float(last["ATR"]), 2)

        sig_label = {1: "🟢 BUY", -1: "🔴 SELL", 0: "⚪ HOLD"}.get(signal, "—")
        rsi_label = "OVERBOUGHT" if rsi > 70 else "OVERSOLD" if rsi < 30 else "NEUTRAL"

        print(f"[{datetime.now().strftime('%H:%M:%S')}]  {ticker}")
        print(f"  Close  : ₹{close:.2f}")
        print(f"  EMA9   : {round(float(last['EMA_9']), 2)}  |  EMA21: {round(float(last['EMA_21']), 2)}")
        print(f"  RSI    : {rsi}  ({rsi_label})")
        print(f"  MACD   : {macd_val}  |  Signal line: {round(float(last['MACD_Signal']), 4)}")
        print(f"  ATR    : {atr}  (volatility/stop reference)")
        print(f"  VWAP   : {round(float(last['VWAP']), 2)}")
        print(f"  Signal : {sig_label}")
        print(f"{'·'*45}")

        if loop < max_loops - 1:
            print(f"  Next refresh in {refresh_sec}s...\n")
            time.sleep(refresh_sec)

    print("\nMonitor complete.")


# ══════════════════════════════════════════════════════════════════
# 7. QUICK SUMMARY PRINT
# ══════════════════════════════════════════════════════════════════

def print_summary(df, ticker):
    last  = df.iloc[-1]
    close = last["Close"].item() if hasattr(last["Close"], 'item') else last["Close"]
    print(f"\n{'═'*45}")
    print(f"  SUMMARY: {ticker}")
    print(f"{'═'*45}")
    print(f"  Last Close   : {close:.2f}")
    print(f"  EMA 9 / 21   : {last['EMA_9'].item():.2f} / {last['EMA_21'].item():.2f}")
    print(f"  SMA 50 / 200 : {last['SMA_50'].item():.2f} / {last['SMA_200'].item():.2f}")
    print(f"  RSI (14)     : {last['RSI'].item():.1f}")
    print(f"  MACD         : {last['MACD'].item():.4f}")
    print(f"  BB Upper/Lower: {last['BB_Upper'].item():.2f} / {last['BB_Lower'].item():.2f}")
    print(f"  ATR (14)     : {last['ATR'].item():.2f}")
    print(f"  VWAP         : {last['VWAP'].item():.2f}")
    buy_signals  = (df["Signal"] == 1).sum()
    sell_signals = (df["Signal"] == -1).sum()
    print(f"  BUY signals  : {buy_signals}")
    print(f"  SELL signals : {sell_signals}")
    print(f"{'═'*45}\n")


# ══════════════════════════════════════════════════════════════════
# MAIN — Run Everything
# ══════════════════════════════════════════════════════════════════

if __name__ == "__main__":

    TICKER = "SERVOTECH.NS"   # ← Change to any NSE ticker (append .NS)
                               #   BSE: append .BO  |  US: just ticker (e.g. AAPL)

    # Step 1: Fetch
    df = fetch_data(TICKER, period="6mo", interval="1d")

    # Step 2: Indicators
    df = add_indicators(df)

    # Step 3: Signals
    df = generate_signals(df)

    # Step 4: Summary
    print_summary(df, TICKER)

    # Step 5: Backtest
    summary, trades = simple_backtest(df)
    print("BACKTEST RESULTS:")
    for k, v in summary.items():
        print(f"  {k}: {v}")
    print(f"\nTrades taken: {len(trades)}")
    for t in trades[-6:]:    # show last 6 trades
        print(f"  {t}")

    # Step 6: Plot chart
    plot_chart(df, TICKER)

    # Step 7 (optional): Live monitor — uncomment to run
    # live_monitor(TICKER, interval="5m", refresh_sec=60, max_loops=5)