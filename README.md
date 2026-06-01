# 🎨 Draw-App

A real-time collaborative whiteboard application that allows multiple users to draw and interact on a shared canvas simultaneously. The application uses WebSockets for live synchronization, ensuring all connected users see updates instantly.

## 🚀 Features

- Real-time collaborative drawing
- Live canvas synchronization using WebSockets
- Multi-user collaboration
- Authentication and protected access
- Undo and redo functionality
- Eraser tool
- Responsive user interface
- Persistent data storage with PostgreSQL
- Monorepo architecture using Turborepo

## 🛠️ Tech Stack

### Frontend
- Next.js
- TypeScript
- HTML Canvas API
- ShadCN UI

### Backend
- Node.js
- Express.js
- WebSockets

### Database
- PostgreSQL
- Prisma ORM

### Monorepo
- Turborepo


## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/draw-app.git
cd draw-app
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_postgresql_connection_string"
```

### Run Database Migrations

```bash
npx prisma migrate dev
```

### Start the Development Server

```bash
npm run dev
```

## 🖌️ How It Works

The application follows a client-server architecture:

1. Users authenticate and join a shared drawing room.
2. Drawing actions are captured using the HTML Canvas API.
3. Events are transmitted through WebSockets.
4. Connected clients receive updates in real time.
5. Drawing data is persisted using PostgreSQL and Prisma.

## Current Limitations

- Synchronization of previously drawn events for newly joined users is still being improved.
- Minor edge cases may occur during real-time synchronization under certain collaboration scenarios.

## Future Improvements

- Enhanced canvas state recovery for new participants.
- Improved synchronization consistency across clients.
- Performance optimizations for large drawing sessions.
- Export canvas as image or PDF


