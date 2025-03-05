# Modern Todo List Application

A sleek, interactive Todo List application built with React 19, TypeScript, and modern web technologies.

## Features

- ✅ Create, edit, and delete tasks
- ✓ Mark tasks as completed/active
- 🔍 Filter tasks by status (All, Active, Completed)
- 🧹 Clear completed tasks with one click
- 💾 Local storage persistence for data retention
- 🎭 Smooth animations with Framer Motion
- 📱 Responsive design for all devices
- 🔒 Fully type-safe with TypeScript
- 🧪 Comprehensive test coverage with Vitest
- 🎨 Modern UI with TailwindCSS

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm

### Installation

Install the dependencies using pnpm:

```bash
pnpm install
```

### Development
Start the development server with hot reloading:
```bash
pnpm dev
```

Your application will be available at http://localhost:5173.

### Testing
Run the test suite:
```bash
# Run tests in watch mode
pnpm test

# Run tests with coverage
pnpm coverage
```

### Building for Production
Create a production build:
```bash
pnpm build
```

### Project Structure
```
todo-list/
├── app/                 # Application routes
├── components/          # React components
│   ├── todo-item/       # TodoItem component
│   ├── todo-list/       # TodoList component
│   └── ui/              # Reusable UI components
├── lib/                 # Utility functions
└── test/                # Test files
    └── components/      # Component tests
```

## Routes
- ```/``` - Home page
- ```/todos``` - Todo List application

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

## Technologies Used
- React 19
- TypeScript
- React Router
- TailwindCSS
- Framer Motion
- Vitest & Testing Library
- localStorage for data persistence

## License
MIT