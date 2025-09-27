# Firestore Database Setup Instructions

This guide will help you set up Firebase Firestore for your Smart Calendar application.

## Prerequisites

- A Google account
- Node.js and npm installed on your system

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "smart-calendar")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 3: Get Your Firebase Configuration

1. In your Firebase project console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon (</>) to add a web app
5. Enter your app nickname (e.g., "Smart Calendar Web")
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 4: Update Your Firebase Configuration

1. Open `src/config/firebase.js` in your project
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
};
```

## Step 5: Set Up Firestore Security Rules

1. In your Firebase console, go to "Firestore Database"
2. Click on the "Rules" tab
3. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Events can only be accessed by their owner
    match /events/{eventId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

4. Click "Publish"

## Step 6: Install Firebase Dependencies

The required Firebase dependencies are already included in your `package.json`:

```bash
npm install
```

## Step 7: Test Your Setup

1. Start your development server:

```bash
npm run dev
```

2. Try creating an event in your calendar
3. Check your Firestore console to see if the data is being saved

## Database Structure

Your Firestore database will have the following collections:

### Users Collection (`users`)

```javascript
{
  id: "user-id",
  email: "user@example.com",
  name: "User Name",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Events Collection (`events`)

```javascript
{
  id: "event-id",
  userId: "user-id",
  title: "Event Title",
  description: "Event Description",
  type: "birthday|anniversary|leave|other",
  startTime: "09:00",
  endTime: "10:00",
  date: timestamp,
  isRecurring: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Security Considerations

1. **Authentication**: Make sure to implement proper user authentication
2. **Data Validation**: Validate data on both client and server side
3. **Rate Limiting**: Consider implementing rate limiting for API calls
4. **Backup**: Set up regular backups of your Firestore database

## Troubleshooting

### Common Issues:

1. **Permission Denied**: Check your Firestore security rules
2. **Network Error**: Verify your Firebase configuration
3. **Data Not Saving**: Check browser console for errors

### Debug Mode:

To enable debug mode, add this to your `firebase.js`:

```javascript
import { connectFirestoreEmulator } from "firebase/firestore";

// Only in development
if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
}
```

## Next Steps

1. Set up Firebase Authentication for user management
2. Implement data synchronization between local and remote storage
3. Add offline support with Firestore's offline capabilities
4. Set up push notifications for event reminders

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)
