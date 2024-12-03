# SyncPad

SyncPad is a real-time collaborative document editing platform, similar to Google Docs. It allows multiple users to work on the same document simultaneously with features like group chat, a notification system, and seamless updates using WebSockets.

## Features

### 📝 Real-Time Collaboration
- Multiple users can edit the same document at the same time.
- Edits are synced instantly across all connected users using **WebSockets**.

### 💬 Group Chat
- Built-in chat feature for users to communicate while working on a document.
- Supports live messaging with instant delivery.

### 🔔 Notification System
- Get notified when new users join or leave the document.
- Notifications for document edits and chat messages to ensure no update is missed.

### 🔒 Secure and Reliable
- Ensures secure connections and maintains the integrity of the document.
- Auto-save functionality prevents data loss.

## Tech Stack

- **Frontend:** React, Typescript
- **Backend:** Node.js with Express.js
- **Real-Time Communication:** WebSocket (Socket.IO)
- **Database:** MongoDB
- **Authentication:** JWT(JsonWebToken)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nischalshakya787/SyncPad.git
   cd SyncPad
2. **Install dependencies:**
   ```bash
   npm install
3. **Configure environment variables:**
   ```bash
   JWT_SECRET= your-jwt-secret
   MONGO_URL=your-mongo-url
4. **Run the Application:**
   1. First start the server:
       ```bash
       cd server
       nodemon index
      ```
     Verify that the database is connected.
  2. Then run the client side:
       ```bash
       cd client
       npm run dev
       ```
### Usage:
1. Sign up 
2. Log in to your account.
3. Create a new document or open an existing one.
4. Share the document link with collaborators.
5. Start editing and chatting in real-time!
6. Comment on the document.

### Demmo
<video controls width="600">
  <source src="./image/demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>



   
