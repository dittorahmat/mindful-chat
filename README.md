# Mindful Chat - AI Mental Health Companion

This is a Next.js application built within Firebase Studio, designed to provide supportive and personalized feedback through an AI chat interface.

## Overview

Mindful Chat acts as a personal AI mental health companion. Users can engage in a conversation, and the AI assistant analyzes the chat history to offer insights and coping strategies, formatted for easy readability. The chat history is stored locally in the browser's localStorage.

## Features

-   **AI-Powered Feedback:** Utilizes Genkit and Google AI (Gemini Flash) to analyze chat messages and provide relevant feedback.
-   **Chat Interface:** A simple and clean chat interface built with ShadCN UI components and Tailwind CSS.
-   **Local Storage:** Chat messages are saved in the browser's local storage, allowing users to continue their conversations across sessions.
-   **Clear Chat:** Option to clear the entire chat history.
-   **Responsive Design:** Adapts to different screen sizes.

## Tech Stack

-   **Framework:** Next.js (App Router)
-   **AI/GenAI:** Google Genkit, Google AI (Gemini Flash)
-   **UI:** React, TypeScript, ShadCN UI, Tailwind CSS
-   **State Management:** React Hooks (`useState`, `useEffect`), Custom `useLocalStorage` hook
-   **Styling:** Tailwind CSS, CSS Variables

## Getting Started

### Prerequisites

-   Node.js (version specified in `package.json` or higher)
-   npm or yarn
-   Google AI API Key

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your Google AI API key:
    ```env
    GOOGLE_GENAI_API_KEY=YOUR_API_KEY_HERE
    ```

### Running the Application

You need to run two processes concurrently: the Next.js development server and the Genkit development server.

1.  **Run the Genkit Dev Server:**
    Open a terminal and run:
    ```bash
    npm run genkit:dev
    # or use watch mode for automatic restarts on changes
    # npm run genkit:watch
    ```
    This starts the Genkit server, typically on port 3400, and makes the AI flow available.

2.  **Run the Next.js Dev Server:**
    Open another terminal and run:
    ```bash
    npm run dev
    ```
    This starts the Next.js application, typically on port 9002.

3.  **Access the application:**
    Open your browser and navigate to `http://localhost:9002`.

## Project Structure

-   `src/app/`: Main application pages and layout (Next.js App Router).
    -   `page.tsx`: The main chat interface component.
    -   `layout.tsx`: Root layout for the application.
    -   `globals.css`: Global styles and Tailwind CSS configuration.
-   `src/ai/`: Genkit AI configuration and flows.
    -   `ai-instance.ts`: Genkit initialization and configuration.
    -   `dev.ts`: Entry point for the Genkit development server.
    -   `flows/provide-ai-feedback.ts`: The Genkit flow responsible for generating AI feedback.
-   `src/components/ui/`: Reusable UI components from ShadCN.
-   `src/hooks/`: Custom React hooks.
    -   `use-local-storage.ts`: Hook for managing state persistence in local storage.
    -   `use-mobile.tsx`: Hook to detect mobile viewports.
    -   `use-toast.ts`: Hook for displaying toast notifications.
-   `src/lib/`: Utility functions.
    -   `utils.ts`: General utility functions (e.g., `cn` for class names).
-   `public/`: Static assets.
-   `next.config.ts`: Next.js configuration.
-   `tailwind.config.ts`: Tailwind CSS configuration.
-   `tsconfig.json`: TypeScript configuration.
-   `components.json`: ShadCN UI configuration.
