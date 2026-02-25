# ArtForge | Modern Art Gallery

The Premier Institutional Digital Art Sanctuary for Rare Sovereign Assets. This application is a modern art gallery platform featuring curated exhibitions, an auction house, and an AI-powered gallery guide.

## 🚀 Features

- **Curated Exhibitions**: Explore thematic landscapes and conceptual explorations.
- **Auction House**: Real-time bidding for rare digital assets.
- **AI Gallery Guide**: Interactive AI assistant powered by Gemini API to help you explore the collection.
- **Virtual Tour**: Immersive experience of the gallery space.
- **Dashboards**: Specialized views for Artists, Curators, Admins, and Visitors.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
- **Charts**: Recharts
- **Icons**: Lucide React (standard icons)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/artforge.git
   cd artforge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Gemini API key to `.env.local`:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     ```

### Running the App

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 💻 Visual Studio Code Setup

This project is optimized for VS Code. When you open the project, you should be prompted to install the recommended extensions:

- **Tailwind CSS IntelliSense**: For CSS utility class autocompletion.
- **ESLint & Prettier**: For code linting and formatting.
- **Path IntelliSense**: For easier file path imports.

Settings are pre-configured in `.vscode/settings.json` to enable **Format on Save**.

## 📤 Pushing to GitHub

1. Create a new repository on GitHub.
2. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add the remote and push:
   ```bash
   git remote add origin https://github.com/your-username/artforge.git
   git branch -M main
   git push -u origin main
   ```

---

*Built with passion for the digital art community.*
