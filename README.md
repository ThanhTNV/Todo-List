# Modern Todo List Application

A sleek, interactive Todo List application built with React Router and modern web technologies.

## Features

- ✅ Create, toggle, and delete tasks
- 🔍 Filter tasks by status (All, Active, Completed)
- 🌓 Dark mode support
- 💾 Local storage persistence
- 🎭 Smooth animations with Framer Motion
- 📱 Responsive design
- 🚀 Server-side rendering with React Router
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔒 TypeScript by default
- 🎨 TailwindCSS for styling

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development
Start the development server with HMR:
```bash
npm run dev
```

Your application will be available at http://localhost:5173.

### Building for Production
Create a production build:
```bash
npm run build
```

## Deployment
Docker Deployment
This template includes three Dockerfiles optimized for different package managers:

Dockerfile - for npm
Dockerfile.pnpm - for pnpm
Dockerfile.bun - for bun
To build and run using Docker:
```bash
# For npm
docker build -t todo-list-app .

# For pnpm
docker build -f Dockerfile.pnpm -t todo-list-app .

# For bun
docker build -f Dockerfile.bun -t todo-list-app .

# Run the container
docker run -p 3000:3000 todo-list-app
```
## Routes
- ```/``` - Home page
- ```/todos``` - Todo List application

## Technologies Used
- React
- React Router
- TypeScript
- TailwindCSS
- Framer Motion
- localStorage for data persistence