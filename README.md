# Math Sprint Trainer

A fast, responsive mental–math practice application built with **React**, **Vite**, and **Bootstrap**.  
The project focuses on clean structure, professional UI, accurate timing, and a smooth training experience across all devices.

## Features

- Timed sprints for focused math practice  
- Multiple chapters including Arithmetic, Algebra, Trigonometry, Percentages, Exponents, and more  
- Difficulty-based question generation with decimal support  
- Real‑time streak, accuracy, and scoring logic  
- Local leaderboard with persistent high scores  
- Keyboard‑first gameplay on desktops; touch‑friendly on mobile  
- Professional, minimal, exam‑style UI  
- Automatic pause with correct‑answer display on mistakes  

## Technology Stack

- **React** (Vite + JSX)
- **Bootstrap** for layout and UI structure  
- **JavaScript (ES Modules)**  
- **LocalStorage** for high‑score persistence  

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173/
```

## Project Structure

```
src/
  components/
    GameConfig.jsx
    GamePlay.jsx
    GameSummary.jsx
    Leaderboard.jsx
  hooks/
    useMathSprintEngine.js
  services/
    leaderboardService.js
```

This structure keeps logic, UI components, and services modular, scalable, and maintainable.

## Build for Production

```bash
npm run build
```

The optimized output will be generated inside the `dist` directory.

## Future Enhancements

- Chapter‑wise analytics  
- Training history and progress charts  
- Custom sprint presets  
- Adaptive difficulty engine  
- Export/import leaderboard  
- Voice‑assisted mode for accessibility  

## License

This project is open for personal and educational use.  
Feel free to modify and adapt it as needed.
