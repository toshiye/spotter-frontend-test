# ✈️ Spotter - Modern Flight Search Engine
Spotter is a high-performance flight search engine built with Next.js 15 and Tailwind CSS v4. It leverages the Amadeus Self-Service API to provide real-time flight data with an emphasis on intuitive UX, smooth motion, and data visualization.

# 🚀 Live Demo & Documentation
Live Site: https://spotter-frontend-test-ochre.vercel.app/

Loom Walkthrough: https://www.loom.com/share/ce0ebf5421474a6facbc3bb1f3eb3c02

# ✨ Key Features & UX Improvements
Interactive Price Distribution: A real-time Recharts graph that reflects current search results. Clicking a price point instantly filters the flight list, providing a bidirectional data experience.

"Best Value" Sorting: Implemented a custom algorithm that goes beyond the "cheapest" option, calculating the optimal price-to-duration ratio to find the most efficient flights.

Staggered Motion UI: Used Framer Motion to create staggered entry animations for flight cards, making the loading of results feel fast and fluid.

Smart Autocomplete: A custom-built airport search that handles IATA codes and state lifting for a seamless search experience.

Theme-Aware Design: Full Dark/Light mode support using Tailwind v4 semantic variables, ensuring high contrast and accessibility in any environment.

# 🧠 Engineering & Technical Decisions
1. Performance Optimization
To ensure the complex filtering (Airlines + Stops + Price) updates the UI at 60fps, I utilized useMemo hooks for data transformation. This prevents unnecessary recalculations of the flight list and price graph during rapid filter toggling.

2. Architecture: Client vs. Server
I maintained a strict separation between Server Components for SEO/Metadata and Client Components for interactivity. To enable page transitions, I implemented a ClientWrapper pattern, allowing the root layout to remain server-side while the content handles Framer Motion animations.

3. Robustness & Error Handling
Hydration Safety: Implemented defensive rendering to ignore injections from browser extensions (like Grammarly) that often break React hydration.

Data Integrity: Added safety checks for API data normalization, ensuring that flights with missing duration or price data do not crash the sorting algorithms or charts.

# 🛠️ Tech Stack
Framework: Next.js 15 (App Router)

Styling: Tailwind CSS v4

Animations: Framer Motion

Charts: Recharts

Icons: Lucide React / Custom SVG

API: Amadeus Self-Service (Test Environment)

# ⚙️ Local Development
Clone and Install:

```bash
git clone (https://github.com/toshiye/spotter-frontend-test)
npm install
Environment Variables: Create a .env.local file in the root and add your Amadeus credentials:
```

```snippet de código
AMADEUS_CLIENT_ID=your_id_here
AMADEUS_CLIENT_SECRET=your_secret_here
Run Dev:

```bash
npm run dev
```
