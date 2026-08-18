#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="$(basename "$SCRIPT_DIR")"

# Check prerequisites
check_prerequisites() {
  if ! command -v npx >/dev/null 2>&1; then
    echo "Error: npx is not installed. Please install Node.js/npm."
    exit 1
  fi
}

# Initialize project with npm create
init_project() {
  echo "Initializing React project: $PROJECT_NAME"
  
  # Create project directory
  mkdir -p "$PROJECT_NAME"
  cd "$PROJECT_NAME"
  
  # Initialize npm project
  npm init -y
  
  # Install React and dependencies
  npm install react react-dom vite typescript
  
  # Install shadcn/ui components
  npx shadcn-ui@latest add button card input label separator dialog
  
  # Install development dependencies
  npm install -D vite @vitejs/plugin-react typescript
  
  # Create basic project structure
  mkdir -p src components
  
  # Create basic React files
  cat > package.json << 'EOF'
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext .ts,.tsx",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^4.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "@eslint/js": "^0.0.0"
  }
}
EOF
  
  # Create TypeScript config
  cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "ES2020"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolutionStrategy": "node",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitAny": true
  }
}
EOF
  
  # Create Vite config
  cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'src/main.jsx',
      }
    }
  }
});
EOF
  
  # Create App component
  mkdir -p src
  cat > src/App.jsx << 'EOF'
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>React App</h1>
      <p>Hello, World!</p>
    </div>
  );
}

export default App;
EOF
  
  # Create App CSS
  cat > src/App.css << 'EOF'
.App {
  text-align: center;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #333;
}
EOF
  
  # Create main entry point
  cat > src/main.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
  
  # Create index.html
  mkdir -p public
  cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF
  
  echo "Project initialized successfully in ./$PROJECT_NAME"
}

# Main execution
main() {
  check_prerequisites
  init_project
}

main
