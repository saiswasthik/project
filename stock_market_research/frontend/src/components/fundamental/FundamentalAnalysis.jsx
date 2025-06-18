import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, AlertTriangle, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react';

const FundamentalAnalysis = ({ stockSymbol }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  
  const [isFinancialHealthOpen, setIsFinancialHealthOpen] = useState(true);
  const [isValuationRatiosOpen, setIsValuationRatiosOpen] = useState(true);
  const [isGrowthFactorsOpen, setIsGrowthFactorsOpen] = useState(true);
  const [isRiskAssessmentOpen, setIsRiskAssessmentOpen] = useState(true);
  const [isNewsCatalystsOpen, setIsNewsCatalystsOpen] = useState(true);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    if (!stockSymbol) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setData(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/fundamental-analysis/${stockSymbol}`, { signal });
        
        if (!response.ok) {
          if (response.status === 500) {
            const errorBody = await response.json();
            if (errorBody && errorBody.error && errorBody.raw_response) {
                 throw new Error(`Backend Error: ${errorBody.error}. Raw response from LLM: ${errorBody.raw_response}`);
            } else {
                 throw new Error(`HTTP error! status: ${response.status}`);
            }
          } else {
               throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        
        const result = await response.json();
        console.log('Received data:', result);

        if (!signal.aborted) {
           if (result && result.error) {
               setError(`Backend Error: ${result.error}. ${result.raw_response ? 'Check backend logs for details.' : ''}`);
               setData(null);
           } else {
               setData(result);
           }
        }

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        console.error('Error fetching data:', err);
        if (!signal.aborted) {
           setError(err.message);
           setData(null);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [stockSymbol]);

  const renderMetricCard = (title, value, change, icon = null) => {
    const isPositive = change?.startsWith('+');
    const Icon = icon;
    
    const displayValue = data ? value : '-';
    const displayChange = data ? change : '';
    const DisplayIcon = data ? Icon : null;

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-600 text-sm font-medium">{title}</span>
          {DisplayIcon && <DisplayIcon className="h-4 w-4 text-gray-400" />}
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold text-gray-900">{displayValue}</span>
          {displayChange && (
            <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {displayChange}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderCollapsibleSection = (title, isOpen, setIsOpen, content) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        className="flex justify-between items-center w-full px-4 py-3 text-left font-semibold text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-200">
          {content}
        </div>
      )}
    </div>
  );

  const renderRatioGroup = (title, ratios) => {
     const displayRatios = data ? ratios : Array.from({ length: 3 }).map((_, i) => ({ metric: `Ratio ${i + 1}`, value: '-' }));

     return (
         <div className="space-y-2">
             <h4 className="text-md font-semibold text-gray-800 mb-2">{title}</h4>
             <div className="space-y-1">
                 {displayRatios.map((ratio, index) => (
                     <div key={index} className="flex justify-between items-center text-sm text-gray-700">
                         <span>{ratio.metric}</span>
                         <span className="font-medium text-gray-900">{data ? ratio.value : '-'}</span>
                     </div>
                 ))}
             </div>
         </div>
     );
  };

  const renderListSection = (title, items, icon = null, iconColorClass = 'text-gray-400') => {
    const Icon = icon;
    const displayItems = data ? items : [];

    return (
       <div className="space-y-2">
          <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
            {Icon && <Icon className={`h-4 w-4 mr-2 ${iconColorClass}`} />}
            {title}
          </h4>
          {displayItems.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {displayItems.map((item, index) => (
                 <li key={index}>
                    {item ? (
                       typeof item === 'object' && item !== null ? (
                          <div className="flex justify-between items-center w-full">
                             <span className="text-gray-800">{item.event || 'Upcoming Event'}</span>
                             <span className="font-medium text-gray-900">{item.date || 'N/A'}</span>
                          </div>
                       ) : (
                          <span className="text-gray-800">{item || 'Placeholder Item'}</span>
                       )
                    ) : (
                       <span className="text-gray-700">{title === 'Upcoming Catalysts' ? 'Upcoming Event: N/A' : 'Placeholder Item'}</span>
                    )}
                 </li>
              ))}
            </ul>
          ) : (
             data ? <div className="text-sm text-gray-500">No data available.</div> : null
          )}
       </div>
    );
  };

  if (loading) {
     return (
       <div className="flex items-center justify-center h-64">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
       </div>
     );
   }

   if (error) {
     return (
       <div className="text-red-500 p-4 text-center">
         Error loading data: {error}
       </div>
     );
   }

  return (
    <div className="space-y-6 p-6 bg-gray-100 rounded-lg">

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
           <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderMetricCard('Revenue (TTM)', data?.basic_metrics?.revenue_ttm?.value, data?.basic_metrics?.revenue_ttm?.change)}
                {renderMetricCard('EPS (TTM)', data?.basic_metrics?.eps_ttm?.value, data?.basic_metrics?.eps_ttm?.change)}
                {renderMetricCard('P/E Ratio', data?.basic_metrics?.pe_ratio?.value, data?.basic_metrics?.pe_ratio?.change)}
                {renderMetricCard('Market Cap', data?.basic_metrics?.market_cap?.value, data?.basic_metrics?.market_cap?.change)}
            </div>
       </div>

      {renderCollapsibleSection(
        'Financial Health & Performance',
        isFinancialHealthOpen,
        setIsFinancialHealthOpen,
        (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderMetricCard('Gross Margin', data?.financial_health?.gross_margin?.value, data?.financial_health?.gross_margin?.change, Percent)}
            {renderMetricCard('Net Margin', data?.financial_health?.net_margin?.value, data?.financial_health?.net_margin?.change, Percent)}
            {renderMetricCard('ROE', data?.financial_health?.roe?.value, data?.financial_health?.roe?.change, Percent)}
            {renderMetricCard('Total Debt', data?.financial_health?.total_debt?.value, data?.financial_health?.total_debt?.change)}
          </div>
        )
      )}

       {renderCollapsibleSection(
         'Valuation Ratios',
         isValuationRatiosOpen,
         setIsValuationRatiosOpen,
         (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {renderRatioGroup('Price Ratios', data?.valuation_ratios?.price_ratios)}
               {renderRatioGroup('Enterprise Ratios', data?.valuation_ratios?.enterprise_ratios)}
               {renderRatioGroup('Yield Metrics', data?.valuation_ratios?.yield_metrics)}
           </div>
         )
       )}

       {renderCollapsibleSection(
         'Growth Factors',
         isGrowthFactorsOpen,
         setIsGrowthFactorsOpen,
         (
            <div className="space-y-2">
              <h4 className="text-md font-medium text-gray-700 mb-2">Revenue Growth (YoY)</h4>
              {data?.growth_factors?.revenue_growth?.length > 0 ? (
                 <div className="space-y-1">
                   {data.growth_factors.revenue_growth.map((growth, index) => (
                     <div key={index} className="flex justify-between items-center text-sm text-gray-600">
                       <span>{growth.period}</span>
                       <span className={`font-medium ${growth.value?.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                         {growth.value}
                       </span>
                     </div>
                   ))}
                 </div>
              ) : (
                  data ? <div className="text-sm text-gray-500">No revenue growth data available.</div> : null
              )}
            </div>
         )
       )}

       {renderCollapsibleSection(
         'Risk Assessment',
         isRiskAssessmentOpen,
         setIsRiskAssessmentOpen,
         (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {renderListSection('Moderate Risks', data?.risk_assessment?.moderate_risks, AlertTriangle, 'text-yellow-600')}
               {renderListSection('Strengths', data?.risk_assessment?.strengths, TrendingUp, 'text-green-500')}
           </div>
         )
       )}

       {renderCollapsibleSection(
         'News Catalysts & Bull/Bear Case',
         isNewsCatalystsOpen,
         setIsNewsCatalystsOpen,
         (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderListSection('Bull Case', data?.news_catalysts?.bull_case, TrendingUp, 'text-green-500')}
                {renderListSection('Bear Case', data?.news_catalysts?.bear_case, TrendingDown, 'text-red-500')}
                {renderListSection('Upcoming Catalysts', data?.news_catalysts?.upcoming_catalysts)}
            </div>
         )
       )}

    </div>
  );
};

export default FundamentalAnalysis;
 