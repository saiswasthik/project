import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// User Profile Management
export const createUserProfile = async (user) => {
  try {
    console.log('Creating user profile for:', user.uid);
    const userRef = doc(db, 'users', user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      display_name: user.displayName || user.email?.split('@')[0] || 'User',
      photo_url: user.photoURL || null,
      provider: user.providerData?.[0]?.providerId || 'email',
      created_at: serverTimestamp(),
      last_login: serverTimestamp()
    };

    console.log('User data to save:', userData);
    await setDoc(userRef, userData);
    console.log('User profile created successfully');
    return userData;
  } catch (error) {
    console.error('Error creating user profile:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
};

export const updateUserProfile = async (uid, updates) => {
  try {
    console.log('Updating user profile for:', uid);
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      last_login: serverTimestamp()
    });
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  try {
    console.log('Getting user profile for:', uid);
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      console.log('User profile found:', userSnap.data());
      return userSnap.data();
    } else {
      console.log('No user profile found for:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
};

// Watchlist Management
export const addToWatchlist = async (uid, stockData) => {
  try {
    console.log('Adding to watchlist for user:', uid, 'Stock:', stockData);
    const watchlistRef = collection(db, 'watchlists');
    const watchlistData = {
      user_id: uid,
      symbol: stockData.symbol,
      name: stockData.name,
      price: stockData.price,
      change: stockData.change,
      added_at: serverTimestamp()
    };

    console.log('Watchlist data to save:', watchlistData);

    // Check if stock already exists in user's watchlist
    const q = query(
      watchlistRef, 
      where('user_id', '==', uid), 
      where('symbol', '==', stockData.symbol)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      const docRef = await addDoc(watchlistRef, watchlistData);
      console.log('Stock added to watchlist successfully, doc ID:', docRef.id);
      return true;
    } else {
      console.log('Stock already in watchlist');
      return false;
    }
  } catch (error) {
    // Handle permission errors gracefully
    if (error.code === 'permission-denied') {
      console.log('Firebase permission denied - using localStorage fallback');
      throw new Error('firebase-permission-denied');
    }
    console.error('Error adding to watchlist:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
};

export const removeFromWatchlist = async (uid, symbol) => {
  try {
    console.log('Removing from watchlist for user:', uid, 'Symbol:', symbol);
    const watchlistRef = collection(db, 'watchlists');
    const q = query(
      watchlistRef, 
      where('user_id', '==', uid), 
      where('symbol', '==', symbol)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'watchlists', querySnapshot.docs[0].id);
      await deleteDoc(docRef);
      console.log('Stock removed from watchlist successfully');
      return true;
    } else {
      console.log('Stock not found in watchlist');
      return false;
    }
  } catch (error) {
    // Handle permission errors gracefully
    if (error.code === 'permission-denied') {
      console.log('Firebase permission denied - using localStorage fallback');
      throw new Error('firebase-permission-denied');
    }
    console.error('Error removing from watchlist:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
};

export const getUserWatchlist = async (uid) => {
  try {
    console.log('Getting watchlist for user:', uid);
    const watchlistRef = collection(db, 'watchlists');
    const q = query(watchlistRef, where('user_id', '==', uid));
    const querySnapshot = await getDocs(q);
    
    const watchlist = [];
    querySnapshot.forEach((doc) => {
      watchlist.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('Watchlist loaded:', watchlist);
    return watchlist;
  } catch (error) {
    // Handle permission errors gracefully for new users
    if (error.code === 'permission-denied') {
      console.log('Firebase permission denied - user may need to sign in or watchlist not set up yet');
      return []; // Return empty watchlist instead of throwing error
    }
    console.error('Error getting user watchlist:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
};

export const updateWatchlistItem = async (uid, symbol, updates) => {
  try {
    console.log('Updating watchlist item for user:', uid, 'Symbol:', symbol);
    const watchlistRef = collection(db, 'watchlists');
    const q = query(
      watchlistRef, 
      where('user_id', '==', uid), 
      where('symbol', '==', symbol)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'watchlists', querySnapshot.docs[0].id);
      await updateDoc(docRef, updates);
      console.log('Watchlist item updated successfully');
      return true;
    } else {
      console.log('Watchlist item not found');
      return false;
    }
  } catch (error) {
    console.error('Error updating watchlist item:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
}; 