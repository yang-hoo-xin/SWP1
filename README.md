# AI Chat Assistant Frontend

A modern, responsive Vue.js application for interacting with AI models through a conversational interface. This project serves as the frontend for the AI Chat Assistant platform, providing user authentication, conversation management, and real-time chat capabilities.

##Contributors
xingyangccd（희건춘）
VikaKumaChR (배민웅)
yang-hoo-xin(양호신)
(정민직)
## 🚀 Technologies

- **Framework**: [Vue.js 3](https://vuejs.org/) with Composition API
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Library**: [Element Plus](https://element-plus.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **CSS Preprocessor**: [SASS](https://sass-lang.com/)
- **TypeScript**: For type safety
- **Markdown Rendering**: [Marked](https://marked.js.org/)
- **Code Highlighting**: [highlight.js](https://highlightjs.org/)
- **Visual Effects**: [vue3-particles](https://github.com/matteobruni/tsparticles)

## 📋 Features

- User authentication (login, registration)
- Real-time chat with AI models
- Conversation history management
- Markdown and code syntax highlighting
- Responsive design for all devices
- Light/Dark theme support
- Settings customization

## 🛠️ Project Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yang-hoo-xin/SWP1.git
cd ai-chat-assistant-frontend

# Install dependencies
npm install
# or
yarn install
```

### Configuration

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Adjust the API URL according to your backend configuration.

### Development

```bash
# Start development server with hot-reload
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` by default.

### Building for Production

```bash
# Build for production
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build
npm run preview
# or
yarn preview
```

## 🧪 Testing and Linting

```bash
# Type-check the project
npm run type-check
# or
yarn type-check

# Lint and fix files
npm run lint
# or
yarn lint

# Format code with Prettier
npm run format
# or
yarn format
```

## 📁 Project Structure

```
src/
├── api/          # API service integration
├── assets/       # Static assets (images, global CSS)
├── components/   # Reusable Vue components
├── router/       # Vue Router configuration
├── stores/       # Pinia state management
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
├── views/        # Page components
├── App.vue       # Root component
└── main.ts       # Application entry point
```

## 🔒 Authentication

The application uses JWT (JSON Web Token) for authentication. Tokens are stored in localStorage and automatically included in API requests. Protected routes require authentication.

## 🌐 API Integration

The frontend communicates with the backend through RESTful API endpoints. The base URL is configured in the `.env` file. API services are organized in the `src/api/` directory.

## 🚢 Deployment

### Docker

A Dockerfile is provided for containerization:

```bash
# Build the Docker image
docker build -t ai-chat-frontend .

# Run the container
docker run -p 80:80 ai-chat-frontend
```

### Nginx Configuration

The project includes an `nginx.conf` file for production deployment with Nginx.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
