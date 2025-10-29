# Intelligent Timetable Management System

This is the frontend for the Intelligent Timetable Management System project. It is built with React, TypeScript, and Vite, and styled with Tailwind CSS.

## Project Overview

The application is designed to handle teacher absences in an educational institution by automating the process of finding and assigning substitute teachers, updating the timetable in real-time, and notifying all relevant parties.

### Features
- Role-based access for Admins, HODs, Teachers, and Students.
- A multi-step absence management dashboard with an HOD approval workflow.
- Real-time notifications for all stakeholders.
- A live timetable view that reflects substitute assignments.
- A teacher availability viewer.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A code editor like [Visual Studio Code](https://code.visualstudio.com/)

## Local Setup and Installation

1.  **Create a project folder** on your computer and copy all the provided files into it.

2.  **Open the project in VS Code**:
    ```bash
    cd path/to/your/project
    code .
    ```

3.  **Create an Environment File**:
    Create a new file named `.env` in the root of your project folder. This file will hold your Gemini API Key.
    ```
    .env
    ```
    Add your API key to this file like so:
    ```
    VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
    **Note**: The application is configured to read this specific variable.

4.  **Install Dependencies**:
    Open a terminal in VS Code (`Ctrl + \``) and run the following command to install all the necessary packages defined in `package.json`:
    ```bash
    npm install
    ```

5.  **Run the Development Server**:
    Once the installation is complete, start the Vite development server:
    ```bash
    npm run dev
    ```
    This will start the application, and you can view it in your browser at the local address provided in the terminal (usually `http://localhost:5173`).

## Connecting to a Backend (Node.js & MySQL)

This codebase represents the **frontend only**. The backend logic is currently *simulated* inside the `src/services/geminiService.ts` file for demonstration purposes.

To connect this frontend to your real Node.js and MySQL backend:

1.  **Build your API endpoints** in your Node.js application (e.g., `/login`, `/timetable`, `/absence-requests`).
2.  **Modify the service functions** in `src/services/geminiService.ts`.
3.  Replace the current mock logic (which uses `setTimeout` and in-memory arrays) with `fetch()` or `axios` calls to your actual API endpoints.

**Example of what to change:**

```typescript
// Current simulated function in geminiService.ts
export const apiLogin = async (email: string, pass: string): Promise<User | null> => {
    console.log(`API_SIM: Attempting login for ${email}...`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email && u.password === pass);
            resolve(user || null);
        }, 500);
    });
};

// --- BECOMES ---

// Future function connected to your real backend
export const apiLogin = async (email: string, pass: string): Promise<User | null> => {
    try {
        const response = await fetch('http://localhost:3000/api/login', { // Your backend URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            return null;
        }
        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error("Failed to login:", error);
        return null;
    }
};
```
