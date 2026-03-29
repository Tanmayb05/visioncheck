# VisionCheck

A web-based eye health screening app that guides users through 8 vision tests with voice guidance and AI-powered result analysis.

## Features

- **8 Vision Tests** — Visual Acuity, Color Vision, Astigmatism, Contrast Sensitivity, Near Vision, Peripheral Vision, Amsler Grid, and Symptoms Check
- **Voice Guidance** — Audio instructions throughout each test
- **AI Analysis** — Gemini API interprets results and provides a health summary
- **PDF Report** — Download your results as a PDF
- **Results Dashboard** — Visual summary of all test outcomes

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

1. Clone or download the repository and navigate to the project folder:

   ```bash
   cd eye-app/visioncheck
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add your Gemini API key to `.env.local` in the `visioncheck/` directory:

   ```env
   REACT_APP_GEMINI_KEY=your_api_key_here
   ```

   A `.env.example` template is included for reference. The `.env.local` file is gitignored and will never be committed.

4. Start the development server:

   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm test` | Runs the test suite |

## Tech Stack

- **React 19** — UI framework
- **Google Generative AI SDK** — Gemini API integration
- **html2canvas + jsPDF** — PDF report generation
- **Create React App** — Build tooling
