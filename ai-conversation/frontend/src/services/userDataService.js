import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// User data structure
const createUserData = (userId, email) => ({
  userId,
  email,
  createdAt: serverTimestamp(),
  lastLogin: serverTimestamp(),
  conversations: [],
  topics: [],
  summaries: []
});

// Save new conversation data
export const saveConversation = async (userId, topic, script, summary, audioUrl) => {
  try {
    const conversationData = {
      id: Date.now().toString(),
      topic,
      script,
      summary,
      audioUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add to user's conversations collection
    const userConversationsRef = collection(db, 'users', userId, 'conversations');
    const docRef = await addDoc(userConversationsRef, conversationData);
    console.log('Conversation saved with ID:', docRef.id);

    // Update user's topics list
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const topics = userData.topics || [];
      
      // Add topic if it doesn't exist
      if (!topics.includes(topic)) {
        await updateDoc(userRef, {
          topics: [...topics, topic],
          lastLogin: serverTimestamp()
        });
        console.log('User topics updated');
      }
    }

    return conversationData;
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw new Error(`Failed to save conversation: ${error.message}`);
  }
};

// Get user's conversations
export const getUserConversations = async (userId) => {
  try {
    const userConversationsRef = collection(db, 'users', userId, 'conversations');
    const q = query(userConversationsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const conversations = [];
    querySnapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Retrieved ${conversations.length} conversations for user ${userId}`);
    return conversations;
  } catch (error) {
    console.error('Error getting user conversations:', error);
    throw new Error(`Failed to get user conversations: ${error.message}`);
  }
};

// Get user's topics
export const getUserTopics = async (userId) => {
  try {
    console.log('=== GETTING USER TOPICS ===');
    console.log('User ID:', userId);
    console.log('Firestore db object:', db);
    
    const userRef = doc(db, 'users', userId);
    console.log('User document reference created');
    
    const userDoc = await getDoc(userRef);
    console.log('User document retrieved, exists:', userDoc.exists());
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('User data retrieved:', userData);
      const topics = userData.topics || [];
      console.log(`Retrieved ${topics.length} topics for user ${userId}:`, topics);
      return topics;
    }
    
    console.log(`No user document found for ${userId}`);
    return [];
  } catch (error) {
    console.error('❌ ERROR GETTING USER TOPICS:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw new Error(`Failed to get user topics: ${error.message}`);
  }
};

// Get specific conversation by ID
export const getConversationById = async (userId, conversationId) => {
  try {
    const conversationRef = doc(db, 'users', userId, 'conversations', conversationId);
    const conversationDoc = await getDoc(conversationRef);
    
    if (conversationDoc.exists()) {
      return {
        id: conversationDoc.id,
        ...conversationDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw new Error(`Failed to get conversation: ${error.message}`);
  }
};

// Initialize or get user data
export const initializeUserData = async (userId, email) => {
  try {
    console.log('=== INITIALIZING USER DATA ===');
    console.log('User ID:', userId);
    console.log('User email:', email);
    
    const userRef = doc(db, 'users', userId);
    console.log('User document reference created');
    
    const userDoc = await getDoc(userRef);
    console.log('User document retrieved, exists:', userDoc.exists());
    
    if (!userDoc.exists()) {
      // Create new user data
      console.log('Creating new user document...');
      const userData = createUserData(userId, email);
      console.log('User data to create:', userData);
      
      await setDoc(userRef, userData);
      console.log(`✓ Created new user data for ${userId}`);
      return userData;
    } else {
      // Update last login
      console.log('Updating last login for existing user...');
      const existingData = userDoc.data();
      console.log('Existing user data:', existingData);
      
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
      console.log(`✓ Updated last login for user ${userId}`);
      return existingData;
    }
  } catch (error) {
    console.error('❌ ERROR INITIALIZING USER DATA:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw new Error(`Failed to initialize user data: ${error.message}`);
  }
};

// Update user's summary
export const updateUserSummary = async (userId, topic, summary) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const summaries = userData.summaries || [];
      
      // Update or add summary with regular Date objects instead of serverTimestamp
      const existingSummaryIndex = summaries.findIndex(s => s.topic === topic);
      if (existingSummaryIndex >= 0) {
        summaries[existingSummaryIndex] = { 
          topic, 
          summary, 
          updatedAt: new Date().toISOString() 
        };
      } else {
        summaries.push({ 
          topic, 
          summary, 
          createdAt: new Date().toISOString() 
        });
      }
      
      await updateDoc(userRef, {
        summaries,
        lastLogin: serverTimestamp()
      });
      console.log(`Updated summary for topic: ${topic}`);
    } else {
      throw new Error('User document not found');
    }
  } catch (error) {
    console.error('Error updating user summary:', error);
    throw new Error(`Failed to update user summary: ${error.message}`);
  }
};

// Get user's summaries
export const getUserSummaries = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const summaries = userDoc.data().summaries || [];
      console.log(`Retrieved ${summaries.length} summaries for user ${userId}`);
      return summaries;
    }
    console.log(`No user document found for ${userId}`);
    return [];
  } catch (error) {
    console.error('Error getting user summaries:', error);
    throw new Error(`Failed to get user summaries: ${error.message}`);
  }
}; 