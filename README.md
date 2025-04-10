## React Todo App with TypeScript and Vite

A modern React application built with TypeScript, Vite, and Vitest for testing.

### Clone the project

```bash
git clone https://github.com/Ibaslogic/simple-todo-app
```

### Installation

Once you have the project files, switch to the project directory and run:

```bash
npm install
```

This will install all the necessary dependencies in the local `node_modules` folder.

### Development

To start the development server:

```bash
npm start
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### Testing

This project uses Vitest for testing. The following commands are available:

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run coverage
```

#### Testing Setup

The project includes:

- **Vitest**: Fast Vite-native testing framework
- **@testing-library/react**: React testing utilities
- **@testing-library/jest-dom**: Custom jest matchers for DOM testing
- **jsdom**: DOM environment for testing

### Building for Production

To create a production build:

```bash
npm run build
```

### Technologies Used

- React 18
- TypeScript
- Vite
- Vitest
- React Testing Library
- TailwindCSS
- Redux Toolkit
- React Router DOM
- React DnD
