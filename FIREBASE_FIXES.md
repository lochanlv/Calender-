# Firebase Setup Fixes

This document provides step-by-step instructions to fix the Firebase/Firestore issues you're experiencing.

## Issues Fixed

1. **Firestore Security Rules** - Missing or insufficient permissions
2. **Firestore Index Requirements** - Composite index needed for queries
3. **Holidays API 401 Error** - Demo API key limitations

## Step 1: Update Firestore Security Rules

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `smart-calendar-c33c1`
3. Go to "Firestore Database" → "Rules" tab
4. Replace the existing rules with the following:

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
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

5. Click "Publish" to save the rules

## Step 2: Create Firestore Indexes (Optional)

The code has been updated to avoid the composite index requirement by sorting in JavaScript instead of Firestore. However, if you want to use Firestore sorting, you can create the index:

1. Go to [Firestore Indexes](https://console.firebase.google.com/v1/r/project/smart-calendar-c33c1/firestore/indexes)
2. Click "Create Index"
3. Use the provided link from the error message

## Step 3: Test the Application

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Try to:
   - Sign up/Login with a new account
   - Create an event
   - Check if events are saved to Firestore

## Step 4: Verify Firestore Data

1. Go to your Firebase Console
2. Navigate to "Firestore Database" → "Data" tab
3. You should see:
   - `events` collection with your events
   - `users` collection with user data

## Step 5: Holidays API Fix

The holidays API is now using fallback data when the demo API fails. To use a real API:

1. Go to [Calendarific](https://calendarific.com/)
2. Sign up for a free account
3. Get your API key
4. Replace the demo key in `src/App.jsx` line 147:

```javascript
const API_KEY = "your-actual-api-key"; // Replace with your actual API key
```

## Troubleshooting

### If you still get permission errors:

1. Make sure you're logged in to the app
2. Check that the user is authenticated before trying to save events
3. Verify the Firestore rules are published

### If events still don't save:

1. Check the browser console for errors
2. Verify your Firebase configuration in `src/config/firebase.js`
3. Make sure the user is properly authenticated

### If you get network errors:

1. Check your internet connection
2. Verify your Firebase project is active
3. Check if there are any billing issues with your Firebase project

## Code Changes Made

1. **Fixed Firestore Security Rules** - Added proper authentication checks
2. **Removed Composite Index Requirement** - Changed to JavaScript sorting
3. **Improved Holidays API Error Handling** - Added fallback data
4. **Better Error Messages** - More descriptive error handling

## Next Steps

1. Test the application thoroughly
2. Consider upgrading to a paid Calendarific plan for better holiday data
3. Set up proper user authentication flows
4. Add data validation on the client side

## Support

If you continue to have issues:

1. Check the browser console for specific error messages
2. Verify your Firebase project settings
3. Ensure all dependencies are installed: `npm install`
