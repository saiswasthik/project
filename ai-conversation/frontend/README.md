# ConversationAI Frontend

A React application with Firebase authentication and user-specific data storage for AI-powered conversation generation.

## Features

- 🔐 Firebase Authentication (Email/Password & Google Sign-in)
- 💾 User-Specific Data Storage (Firestore)
- 💬 AI Conversation Generation
- 🎵 Audio Playback with Play/Stop/Restart Controls
- 📚 Personal Conversation History Library
- 📝 Conversation Summaries
- 🎨 Modern UI with Hover Effects
- 🔄 Cross-Device Data Sync

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google providers
3. Enable Firestore Database (Cloud Firestore)
4. Set up Firestore security rules for user data
5. Create a `.env` file in the root directory with your Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 3. Firestore Security Rules

Set up the following security rules in your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can access their own conversations
      match /conversations/{conversationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 4. Start the Development Server

```bash
npm start
```

## Authentication Features

- **Email/Password Sign Up & Sign In**
- **Google OAuth Sign In**
- **Password Reset Functionality**
- **Automatic Session Management**
- **Protected Routes**

## User Data Storage

### **Individual User Data:**
- **Personal Conversation History** - Each user sees only their own conversations
- **Topic Library** - User-specific topic collection
- **Conversation Summaries** - Individual summary storage
- **Audio Files** - User-specific audio storage
- **Cross-Device Sync** - Data accessible from any device

### **Data Structure:**
```
users/{userId}/
├── email: string
├── createdAt: timestamp
├── lastLogin: timestamp
├── topics: string[]
├── summaries: array
└── conversations/
    ├── {conversationId}/
    │   ├── topic: string
    │   ├── script: array
    │   ├── summary: string
    │   ├── audioUrl: string
    │   ├── createdAt: timestamp
    │   └── updatedAt: timestamp
```

## Usage

1. **Login/Signup**: Users can create accounts or sign in with email/password or Google
2. **Generate Conversations**: Enter any topic to generate AI conversations
3. **Personal Library**: Access your own conversation history
4. **Audio Playback**: Listen to generated conversations with play/stop/restart controls
5. **Data Persistence**: Your data is saved and synced across devices
6. **Summaries**: View conversation summaries and insights

## File Structure

```
src/
├── components/
│   ├── Login.js          # Authentication component
│   ├── NavBar.js         # Navigation with user info
│   ├── HeroSection.js    # Main input section
│   ├── LibrarySidebar.js # Personal conversation history
│   ├── ConversationView.js # Conversation display & audio controls
│   └── SummarySidebar.js # Summary display
├── services/
│   └── userDataService.js # User data storage operations
├── firebase.js           # Firebase configuration
└── App.js               # Main app with auth & data management
```

## Technologies Used

- React 19
- Firebase Authentication
- Firebase Firestore
- Tailwind CSS
- HTML5 Audio API

## Data Privacy

- **User Isolation**: Each user can only access their own data
- **Secure Storage**: Data is stored securely in Firebase Firestore
- **Privacy Protection**: No cross-user data sharing
- **Account Deletion**: Users can delete their accounts and data 