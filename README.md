<div align="center">
  <br />
  <h1>🗓️ Daywise</h1>
  <p><strong>Know the day. Without checking.</strong></p>
  <p>An interactive, gamified mental math platform to master John Conway's Doomsday Rule and calculate the day of the week for any date in history entirely in your head.</p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-how-it-works">How It Works</a> •
    <a href="#-training-modes">Training Modes</a> •
    <a href="#-keyboard-shortcuts">Hotkeys</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-tech-stack">Tech Stack</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-black?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-black?style=flat-square&logo=tailwindcss" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Tests-Vitest%20Passed-emerald?style=flat-square&logo=vitest" alt="Vitest" />
    <img src="https://img.shields.io/badge/Storage-100%25%20Offline-blue?style=flat-square" alt="Offline" />
    <img src="https://img.shields.io/badge/License-MIT-purple?style=flat-square" alt="License" />
  </p>
</div>

---

## 🧠 What is Daywise?

**Daywise** transforms the famous **Doomsday Algorithm**—invented by mathematician **John Horton Conway** in 1973—into a structured, gamified training suite. 

Instead of memorizing thousands of dates, Conway's method relies on memorable anchor dates that always fall on the exact same weekday across all 12 months. With 4 simple mental steps, you can calculate the weekday of any date (past, present, or future) in seconds.

---

## ✨ Features

- **Interactive 5-Stage Curriculum**: Step-by-step interactive lessons with visual math aids, reference tables, and checkpoint quizzes.
- **Live Mental Math Simulator**: Try historical date calculations with instant 4-step Doomsday mathematical proofs.
- **4 Dedicated Training Arenas**:
  - **Relaxed Sandbox**: Unlimited dates, zero countdown pressure, instant mathematical proofs on mistakes.
  - **Timed Sprint**: Standard 10-date deck scored by answer velocity, difficulty multiplier, and streaks.
  - **Countdown Speed Run**: High-intensity 30s, 60s, or 120s survival sprints against the clock.
  - **Accuracy Classic**: Strict 10-question sequence penalizing streaks for precision training.
- **Global Seeded Daily Challenge**: Deterministic 10-date deck generated fresh every 24 hours. Compete with identical seeds globally.
- **Real-Time Step Proofs**: Automatic step-by-step arithmetic breakdowns (Century Anchor &rarr; Year Offset &rarr; Month Key &rarr; Day Offset) on every answer.
- **Cognitive Velocity & Offline Analytics**: Track your solve speed latency curves, accuracy trends, and high scores powered by Recharts.
- **Full Keyboard Navigation**: Lightning-fast hotkeys (`[1]` to `[7]` for Mon–Sun, `[1]` to `[4]` for simulation choices, and `[Enter]` to advance).
- **100% Client-Side & Offline First**: Zero login required. All XP, streaks, levels, and attempt histories persist securely in `localStorage` with Zustand.
- **Modern Dark UI Design**: Glassmorphic HUDs, high-contrast typography (Neue Machina & Manrope), fine hairline borders, and fluid Framer Motion micro-interactions.

---

## 📐 How It Works

```
Target Date: July 20, 1969 (Apollo 11 Moon Landing)
```

1. **Century Anchor (1900s)**: Baseline anchor is **Wednesday** (Code 3).
2. **Year Offset ('69)**: 
   - $69 \div 12 = 5$ with remainder $9$
   - Leap years in remainder: $9 \div 4 = 2$
   - Sum: $(5 + 9 + 2) \pmod 7 = +2\text{ days}$
   - Year Doomsday: $\text{Wednesday} + 2 = \text{\textbf{Friday}}$.
3. **Month Anchor (July)**: July 11 (7/11) is always a Doomsday (**Friday**).
4. **Day Offset**: July 20 is 9 days after July 11 ($9 \pmod 7 = +2\text{ days}$).
   - $\text{Friday} + 2\text{ days} = \text{\textbf{Sunday}}$.

---

## 🎮 Keyboard Shortcuts

| Key | Action |
|:---:|:---|
| <kbd>1</kbd> | Select **Monday** |
| <kbd>2</kbd> | Select **Tuesday** |
| <kbd>3</kbd> | Select **Wednesday** |
| <kbd>4</kbd> | Select **Thursday** |
| <kbd>5</kbd> | Select **Friday** |
| <kbd>6</kbd> | Select **Saturday** |
| <kbd>7</kbd> | Select **Sunday** |
| <kbd>Enter</kbd> | Advance to Next Question |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **State & Persistence**: [Zustand](https://github.com/pmndrs/zustand) (with `persist` middleware)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Typography**: Neue Machina (Headings) & Manrope (Body)

---

## 📁 Directory Structure

```
daywise/
├── app/                      # Next.js App Router routes & layouts
│   ├── about/                # Method primer and algorithm reference tables
│   ├── daily/                # Seeded daily challenge route
│   ├── leaderboard/          # Offline leaderboard and trainee rankings
│   ├── learn/                # Curriculum overview and individual lessons
│   ├── practice/             # Practice arena selector and mode launcher
│   ├── profile/              # User statistics, XP levels, and personal bests
│   ├── settings/             # User preferences, audio, and accessibility
│   ├── globals.css           # Design tokens, variables, and typography rules
│   └── layout.js             # Root layout and font configurations
├── components/
│   ├── charts/               # Recharts latency and accuracy visualizations
│   ├── game/                 # Game HUD, keyboard, Apollo simulation, daily challenge
│   ├── home/                 # Landing page sections and methodology preview
│   ├── learning/             # Lesson slide decks and checkpoint quizzes
│   ├── navigation/           # Sticky Navbar, footer, and mobile navigation bar
│   ├── practice/             # Arena cards and difficulty selector
│   ├── profile/              # User profile card and badge achievements
│   ├── settings/             # Settings and data reset controls
│   └── ui/                   # Reusable Button, Card, Container, SectionBadge
├── data/                     # Lesson curriculum, sample dates, and achievements
├── lib/
│   ├── game/                 # Date calculation math, Doomsday rules, scoring, streaks
│   └── storage/              # LocalStorage helpers and schema migrations
├── public/fonts/             # Local font binaries (Neue Machina & Manrope)
└── stores/                   # Zustand stores (game, profile, daily, settings)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- pnpm (recommended), npm, or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zaid0091/Daywise.git
   cd Daywise
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the local development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run automated unit tests**:
   ```bash
   pnpm test
   ```

---

## 🧪 Testing

The mathematical calendar engine, leap century rules (1600, 2000, 2400), common century exceptions (1800, 1900, 2100), scoring multipliers, and level progressions are thoroughly tested with deterministic unit test suites:

```bash
pnpm test
```

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">
  <sub>Created in honor of mathematician <strong>John Horton Conway (1937–2020)</strong>.</sub>
</div>
