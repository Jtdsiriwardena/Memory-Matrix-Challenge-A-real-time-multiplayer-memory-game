# 🧠 Memory Matrix Challenge

A real-time multiplayer memory game where players memorize and reproduce colored patterns on a grid — competing for the fastest, most accurate response.

> Built with React, NestJS, Socket.IO, and Redis for a seamless live multiplayer experience.

---

![Image Alt](https://github.com/Jtdsiriwardena/Memory-Matrix-Challenge-A-real-time-multiplayer-memory-game/blob/f6b8df68093ec659434b92a813e1ae761336aa22/home_page.png) 

## 🎯 Project Overview

Memory Matrix Challenge emphasizes:

- **Real-time competition** between players in shared rooms
- **Accurate scoring** based on reaction time and accuracy
- **Multiplayer matchmaking** with auto-assigned rooms
- **Live leaderboard** updates after every round
- **Optional pattern review** after each submission

---

## 🚀 Features

### 🎮 Core Gameplay

- **Grid-based memory challenge**
  - Default grid size: `4×4` (expandable to `6×6`)
  - Pattern flashes briefly — controlled server-side
  - Player reproduces the pattern from memory

- **Scoring System**
  ```
  score = (correct - wrong × 0.5) × timeMultiplier
  ```
  - Faster completion yields a higher multiplier
  - All scores are non-negative
  - Leaderboard updates in real-time

- **Rounds**
  - Players submit their answers independently
  - Round completes once all players have submitted
  - Optional **Pattern Review**: correct pattern revealed after submission

### 🌐 Multiplayer & Real-Time

- **Matchmaking**
  - Players click *Find Match* → auto-assigned to a room
  - Room size is configurable (default: 2 players)

- **Ready System**
  - Players click *Ready* when prepared
  - Countdown begins once all players in the room are ready
  - Game starts simultaneously for all players

- **Live Leaderboard**
  - Updated after each round submission
  - Displays all players' scores within the room

- **Play Again**
  - Any player can trigger a rematch
  - One click resets the game for all players in the room

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + TypeScript | Component-based UI |
| Redux Toolkit | State management (game state, timer, leaderboard) |
| Socket.IO Client | Real-time WebSocket communication |
| Tailwind CSS | Styling |
| Framer Motion | Animations (pattern flash, transitions) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + NestJS | Server framework |
| NestJS WebSocketGateway | Real-time WebSocket server |
| Socket.IO Server | Room management & event handling |
| GameService | Pattern generation & scoring logic |
| LeaderboardService | Room-based leaderboard management |

### Data Storage
| Technology | Purpose |
|---|---|
| Redis | Live game state, leaderboard, matchmaking queue |

---

## 📸 Screenshots

### Matchmaking
**Finding a Match**
![Matchmaking](https://github.com/Jtdsiriwardena/Memory-Matrix-Challenge-A-real-time-multiplayer-memory-game/blob/2c9bd5350a19c131d06a2259546c6c6aa105762d/matchmaking_2.png)

### Pattern Challenge
**Pattern Flash**
![Pattern Flash](https://github.com/Jtdsiriwardena/Memory-Matrix-Challenge-A-real-time-multiplayer-memory-game/blob/2c9bd5350a19c131d06a2259546c6c6aa105762d/pattern.png)

### Leaderboard
**Live Leaderboard**
![Leaderboard](https://github.com/Jtdsiriwardena/Memory-Matrix-Challenge-A-real-time-multiplayer-memory-game/blob/2c9bd5350a19c131d06a2259546c6c6aa105762d/leaderboard.png)

---

## 🏗 System Architecture

```
     Client (React + Redux)
            │
    Socket.IO WebSocket
            │
            ▼
    NestJS WebSocketGateway
            │
     ┌──────┴──────┐
     ▼             ▼
 GameService  LeaderboardService
     │             │
     └──────┬──────┘
            ▼
          Redis
  (game state / leaderboard
    / matchmaking queue)
```

---

## ⚙️ Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/memory-matrix-challenge.git
```

**2. Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

**3. Start Redis**

```bash
redis-server

```

---

## 🔑 Environment Variables



## ▶️ Running the Application

**Start the backend**

```bash
cd backend
npm run start:dev
```

**Start the frontend**

```bash
cd frontend
npm run dev

```

---

## 🎲 Game Flow

```
Player joins → Matchmaking → Room assigned
        │
        ▼
  All players Ready → Countdown
        │
        ▼
  Pattern flashes on grid
        │
        ▼
  Players reproduce pattern
        │
        ▼
  All submit → Scores calculated
        │
        ▼
  Leaderboard updates → Optional pattern review
        │
        ▼
      Play Again?
```

---
