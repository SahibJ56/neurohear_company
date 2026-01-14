# NeuroHear 🧠👂 (Hackathon Winner)

**Live Demo:** [Click Here to Try NeuroHear](https://neurohear-company.vercel.app/)

## Overview
NeuroHear is a React-based cognitive auditory training application designed to assist in aural rehabilitation. It won [$1.5K] at [Hack the World].

The application challenges users to process speech in progressively difficult "speech-in-noise" environments, simulating real-world conditions like busy cafes or quiet rooms.

## Key Technical Features

### 1. Web Audio API Integration 🔊
- Implemented a custom noise generation engine using the native browser `AudioContext`.
- Dynamically generates brown/white noise buffers to simulate environmental interference without external audio files.
- **Why:** Reduces load times and provides infinite, non-looping background noise for clinical accuracy.

### 2. Speech Synthesis & Recognition 🗣️
- Utilizes the `SpeechSynthesisUtterance` interface to generate dynamic test sentences.
- Features a custom "faint speech" algorithm that modulates gain nodes to test volume sensitivity threshold.

### 3. Dynamic State Management ⚛️
- Complex React `useEffect` hooks manage the game loop (Intro -> Screener -> Training -> Results).
- Real-time scoring and difficulty adjustment logic based on user performance.

## Tech Stack
- **Frontend:** React.js (Vite)
- **Styling:** Tailwind CSS (Custom Design System)
- **Audio:** Web Audio API
- **Icons:** Lucide React

## How to Run Locally
1. Clone the repo: `git clone https://github.com/SahibJ56/neurohear.git`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
