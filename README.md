# 10SAT Frontend - SAT Learning Platform

## 🎯 Project Overview

**10SAT Frontend** là một ứng dụng web React hiện đại được thiết kế để hỗ trợ học sinh luyện thi SAT. Ứng dụng cung cấp các tính năng thi thử, quản lý từ vựng cá nhân và theo dõi tiến độ học tập một cách trực quan và hiệu quả.

## ✨ Key Features

### 🔐 Authentication & Security

- **JWT-based Authentication**: Secure login with token validation
- **Protected Routes**: Private/Public route guards
- **Auto Session Management**: Automatic logout on token expiration
- **User Profile**: Personal dashboard with user information

### 📝 Exam System

- **Multi-format Questions**:
  - Multiple Choice (TN)
  - Fill-in-the-blank (TLN)
- **Smart Navigation**: Interactive question navigator with status indicators
- **Auto-save Progress**: LocalStorage persistence for unfinished exams
- **Math Support**: LaTeX rendering for mathematical content
- **Real-time Timer**: Countdown with automatic submission
- **Sequential Exams**: Multiple exam progression system

### 📚 Vocabulary Manager

- **Personal Vocabulary Library**: Create and organize custom word collections
- **Smart Folders**: Categorize vocabulary by topics with color coding
- **Learning Status Tracking**:
  - Not Learned (Red)
  - Needs Review (Orange)
  - Learned (Green) - Permanent status with confirmation
- **Interactive Study Mode**: Hide/show meanings for self-testing
- **Search & Filter**: Real-time search across vocabulary collections
- **Status Protection**: Prevent accidental changes to mastered words

### 🔍 Course Discovery

- **Advanced Search**: Real-time search with 500ms debouncing
- **Course Catalog**: Grid layout with detailed course information
- **Price Display**: Vietnamese currency formatting
- **Responsive Design**: Optimized for all device sizes

### 🎨 Modern UI/UX

- **Material-UI Design System**: Consistent and professional interface
- **Responsive Layout**: Mobile-first approach with adaptive design
- **Smooth Animations**: Loading states and micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation support
- **Toast Notifications**: User-friendly feedback system

## 🏗️ Technical Stack

### Frontend Technologies

```
React 18.x
├── Material-UI (MUI) - UI Component Library
├── React Router v6 - Client-side Routing
├── JWT Decode - Authentication Management
├── Tailwind CSS - Utility-first Styling
├── React Toastify - Notification System
└── LaTeX Rendering - Mathematical Content
```

### Project Architecture

```
src/
├── components/               # Reusable UI Components
│   ├── Auth/                # Authentication components
│   ├── exam/                # Exam-related components
│   │   └── components/      # Question, Navigation, Timer
│   ├── vocabulary-manager/  # Vocabulary management
│   │   └── components/      # VocabularyCard, FolderCard, etc.
│   ├── exam-list/          # Course discovery components
│   ├── home/               # Dashboard components
│   └── Loading/            # Loading indicators
├── Pages/                  # Route-level pages
│   ├── ExamPage.js         # Main exam interface
│   ├── ExamListPage.js     # Course catalog
│   ├── VocabularyManagerPage.js # Vocabulary management
│   └── LoginPage.js        # Authentication
├── services/               # API service layer
│   ├── AuthService.js      # Authentication APIs
│   ├── ExamService.js      # Exam management
│   ├── VocabularyService.js # Vocabulary operations
│   └── AssessmentService.js # Course discovery
├── common/                 # Shared utilities
│   ├── apiClient.js        # HTTP client configuration
│   ├── decryption.js       # Data security utilities
│   └── Utils.js           # Helper functions
└── routes/                # Route protection
    ├── PrivateRoute.js    # Protected route wrapper
    └── PublicRoute.js     # Public route wrapper
```

## 🔄 User Workflows

### Authentication Flow

```
Login → JWT Validation → Dashboard Access → Feature Navigation
```

### Exam Taking Journey

```
Dashboard → Course Discovery → Search/Filter → Select Exam →
Take Exam → Navigate Questions → Submit → Results → Next Exam
```

### Vocabulary Management Flow

```
Vocabulary Manager → Create/Select Folder → Add Words →
Study Mode → Track Progress → Mark as Learned
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation & Running

```bash
# Clone repository
git clone [repository-url]
cd Webtest-10SAT-Frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Development Scripts

```json
{
  "start": "Development server on http://localhost:3000",
  "build": "Production build optimization",
  "test": "Run test suite",
  "eject": "Eject from Create React App (irreversible)"
}
```

## 🔧 Core Features Deep Dive

### Vocabulary Learning System

- **Folder Organization**: Color-coded folders with custom descriptions
- **Word Status Management**: Three-tier learning status system
- **Protection Mechanism**: Confirmation dialog for "learned" status
- **Visual Feedback**: Different styling for each learning stage
- **Search Functionality**: Real-time search across all vocabulary
- **Responsive Cards**: Mobile-optimized word cards with actions

### Exam Engine

- **State Persistence**: LocalStorage for exam progress
- **Navigation System**: Jump to any question with status indicators
- **Auto-submission**: Time-based automatic submission
- **Question Types**: Support for multiple question formats
- **Progress Tracking**: Visual progress indicators

### Authentication & Security

- **JWT Token Management**: Secure storage and validation
- **Route Protection**: Automatic redirection for unauthorized access
- **Session Handling**: Graceful session expiration management
- **User Context**: Global state management for user data

## 🎨 Design System

### Color Palette

- **Primary**: #1976d2 (Professional Blue)
- **Success**: #4caf50 (Learning Progress Green)
- **Warning**: #ff9800 (Review Orange)
- **Error**: #f44336 (Not Learned Red)
- **Background**: #f5f5f5 (Clean Light Gray)

### Typography & Spacing

- **Responsive Typography**: Adaptive font sizes
- **Consistent Spacing**: 8px base unit system
- **Material Design**: Following Google's design principles

## 📱 Responsive Design

### Breakpoint Strategy

```
Mobile: < 600px    - Single column, touch-optimized
Tablet: 600-960px  - Two columns, hybrid interaction
Desktop: > 960px   - Full grid layout, mouse-optimized
```

### Mobile Features

- Touch-friendly buttons and interactions
- Optimized navigation for small screens
- Gesture support for exam navigation
- Mobile-specific loading indicators

## 🚀 Performance Optimizations

### Code Optimization

- **Component Splitting**: Lazy loading for better performance
- **Debounced Search**: 500ms delay to reduce API calls
- **Memoized Components**: Preventing unnecessary re-renders
- **Bundle Optimization**: Tree shaking and code splitting

### Data Management

- **LocalStorage Caching**: Offline exam progress
- **API Response Caching**: Reduced server requests
- **Optimistic Updates**: Immediate UI feedback
- **Error Recovery**: Graceful fallback mechanisms

## 📊 Key Metrics

### Performance Targets

- **First Load**: < 2 seconds
- **Bundle Size**: < 1MB compressed
- **API Response**: < 500ms average
- **Mobile Score**: > 95% Lighthouse
- **Accessibility**: > 90% compliance

## 🔮 Future Roadmap

### Planned Enhancements

- **Analytics Dashboard**: Learning progress visualization
- **Offline Mode**: PWA capabilities for study anywhere
- **Collaborative Learning**: Study groups and shared folders
- **Advanced Analytics**: Detailed performance insights
- **AI-Powered Recommendations**: Personalized study suggestions

### Technical Improvements

- **State Management**: Redux Toolkit integration
- **Testing Coverage**: Comprehensive unit and integration tests
- **Internationalization**: Multi-language support
- **Performance Monitoring**: Real-time performance tracking

## 🤝 Contributing Guidelines

### Development Standards

- **Component-Based Architecture**: Reusable and maintainable components
- **TypeScript Integration**: (Planned) Type safety improvements
- **Code Quality**: ESLint and Prettier configuration
- **Git Workflow**: Feature branches with pull request reviews

### Code Style

- **Functional Components**: React Hooks pattern
- **Material-UI Consistency**: Following MUI design patterns
- **Responsive First**: Mobile-first development approach
- **Accessibility**: WCAG 2.1 compliance standards

## 📞 Support & Documentation

### Resources

- **Component Library**: Material-UI documentation
- **React Documentation**: Official React guides
- **Project Wiki**: Internal documentation (if available)
- **Issue Tracking**: GitHub Issues for bug reports and features

### Contact

For technical questions or contributions, please refer to the project maintainers or create an issue in the repository.

---

**10SAT Frontend** - Empowering students with modern, efficient SAT preparation tools. Built with React, designed for success. 🎓
