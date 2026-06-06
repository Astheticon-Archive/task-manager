# Task Manager

A clean, responsive task management app built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Create, edit, and delete tasks
- Set priority (Low / Medium / High) and status (To Do / In Progress / Done)
- Filter tasks by status and priority
- Due date tracking with overdue detection
- Persistent storage via localStorage
- Responsive design — works on mobile and desktop

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Persistence:** localStorage
- **Icons:** lucide-react

## Getting Started

npm install
npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

app/             → Next.js app router pages
components/
  tasks/         → TaskCard, TaskForm, TaskList, TaskFilters
  ui/            → shadcn/ui components
lib/
  store.ts       → Zustand store with localStorage persistence
  types.ts       → Task type definitions
  utils.ts       → Helper functions
