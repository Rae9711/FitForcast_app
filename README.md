# 🏋️ FitForecast

> **Personal Behavioral Pattern Analyzer** – Discover your unique fitness patterns through data-driven insights

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

FitForecast is a personalized fitness tracking application that helps users discover **their own patterns**—not through generic advice, but through data-driven insights derived from their unique baseline. Log workouts and meals in natural language, capture how you felt before and after, and receive explainable insights tied to your personal trends.

---

## 🚀 Quick Start (2 Minutes)

Want to explore the app immediately? We have 3 demo accounts ready to go:

### Prerequisites
- Node.js 18+ and PostgreSQL 14+
- Clone this repository

### Setup & Run
```bash
# 1. Backend Setup
cd stream-1-backend
npm install
cp .env.example .env  # Configure DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npm run seed  # Creates 3 demo users with 95+ entries each
npm run dev  # Starts on http://localhost:3000

# 2. Frontend Setup (in a new terminal)
cd stream-2-frontend
npm install
npm run dev  # Starts on http://localhost:5174
```

### Demo Accounts (All use password: `password123`)

| Account | Email | Profile |
|---------|-------|---------|
| **Athena** | athena@example.com | Consistent improver - morning exerciser showing steady progress |
| **Boris** | boris@example.com | Stressed inconsistent - night owl struggling with patterns |
| **Cora** | cora@example.com | Peak performer - optimized evening athlete |

📖 **Full walkthrough**: See [DEMO_WALKTHROUGH_GUIDE.md](DEMO_WALKTHROUGH_GUIDE.md) for detailed exploration of all three personas.

---

## ✨ Features

### ✅ Implemented (MVP Complete)

- **🔐 Authentication System**
  - JWT-based authentication with secure password hashing
  - Sign up, login, logout, and session management
  - Protected routes and automatic token refresh
  - User data isolation

- **📝 Natural Language Logging**
  - Log workouts and meals in plain text
  - Capture pre/post feelings (mood, energy, stress) on 1-5 scales
  - Track timing and context for each activity

- **📊 Personalized Baselines**
  - Per-user, per-category baseline calculations
  - Rolling windows (14 and 30 days)
  - Automatic recomputation as new data arrives
  - Compare current performance to your own history

- **🧠 AI-Powered Insights**
  - Personalized recommendations based on your patterns
  - Explainable insights with supporting statistics
  - Adaptive tone: encouragement, intervention, or optimization
  - Context-aware suggestions (timing, consistency, recovery)

- **📈 Trend Visualization**
  - Interactive charts showing progress over time
  - Energy, stress, and mood trends
  - Compare baselines to recent activity
  - Identify what's working (and what's not)

- **👤 Demo Personas**
  - 3 distinct user types with realistic 6-month history
  - 95+ entries per user (285 total)
  - Showcases different patterns and AI adaptations
  - Perfect for testing and demonstrations

### 🚧 Planned Features

- Advanced analytics and correlation analysis
- Wearable device integrations
- Meal nutrition database
- Social features and challenges
- Mobile app (iOS/Android)
- Export and data portability

---

## 🏗️ Project Structure

```
FitForcast_app/
├── stream-1-backend/          # Node.js/Express API + PostgreSQL
│   ├── src/
│   │   ├── api/              # REST endpoints (auth, entries, insights, trends)
│   │   ├── db/               # Prisma schema and migrations
│   │   ├── services/         # Business logic (baselines, insights)
│   │   ├── middleware/       # Auth and validation
│   │   └── utils/            # Logging and helpers
│   ├── seeds/                # Demo data generation
│   ├── tests/                # Unit and integration tests
│   └── docs/                 # OpenAPI spec
│
├── stream-2-frontend/         # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages (Login, Dashboard, Trends, etc.)
│   │   ├── context/          # State management (AuthContext)
│   │   ├── api/              # API client and mocks
│   │   └── types/            # TypeScript type definitions
│   └── public/               # Static assets
│
├── stream-3-analytics/        # Python notebooks for insight validation
│   ├── notebooks/            # Jupyter notebooks for testing rules
│   ├── src/                  # Python metrics and rule evaluators
│   └── tests/                # Python unit tests
│
├── stream-4-integration/      # LLM parsing and scenarios
│   ├── llm/                  # Natural language parsing (TypeScript)
│   └── scenarios/            # Test personas and edge cases
│
└── docs/                      # Architecture and planning docs
    ├── INTEGRATION_CONTRACT.md
    ├── TECHNICAL_PLAN.md
    └── USER_JOURNEY.md
```

---

## 📖 Documentation

### Getting Started
- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide with demo accounts
- **[DEMO_WALKTHROUGH_GUIDE.md](DEMO_WALKTHROUGH_GUIDE.md)** - Detailed end-to-end exploration of all 3 personas

### Technical Documentation
- **[AUTH_SYSTEM_DOCS.md](AUTH_SYSTEM_DOCS.md)** - Authentication implementation details
- **[DEMO_PERSONAS.md](DEMO_PERSONAS.md)** - User persona profiles and data patterns
- **[UPDATE_COMPLETE.md](UPDATE_COMPLETE.md)** - Latest feature summary
- **[TECHNICAL_PLAN.md](docs/TECHNICAL_PLAN.md)** - Architecture and design decisions
- **[INTEGRATION_CONTRACT.md](docs/INTEGRATION_CONTRACT.md)** - API contracts between streams
- **[USER_JOURNEY.md](docs/USER_JOURNEY.md)** - User experience flow

### Stream-Specific READMEs
- [Backend README](stream-1-backend/README.md)
- [Frontend README](stream-2-frontend/README.md)
- [Analytics README](stream-3-analytics/README.md)
- [Integration README](stream-4-integration/README.md)

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Testing**: Jest + Supertest
- **API Documentation**: OpenAPI 3.0

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Context API

### Analytics
- **Language**: Python 3.9+
- **Notebooks**: Jupyter
- **Libraries**: pandas, numpy, matplotlib

### DevOps
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Database Migrations**: Prisma Migrate
- **Environment**: dotenv

---

## 🔧 Detailed Setup

### Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
3. **Git** - [Download](https://git-scm.com/)

### Backend Setup

```bash
cd stream-1-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set:
# - DATABASE_URL="postgresql://user:password@localhost:5432/fitforecast"
# - JWT_SECRET="your-secret-key-here"

# Run database migrations
npx prisma migrate dev

# Seed demo data (3 users with 95+ entries each)
npm run seed

# Start development server
npm run dev  # Runs on http://localhost:3000

# Run tests
npm test
```

### Frontend Setup

```bash
cd stream-2-frontend

# Install dependencies
npm install

# Configure environment (optional - defaults work)
# Create .env if you need to override API URL:
# VITE_API_URL=http://localhost:3000

# Start development server
npm run dev  # Runs on http://localhost:5174

# Build for production
npm run build
```

### Analytics Setup (Optional)

```bash
cd stream-3-analytics

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run notebooks
jupyter notebook
# Open notebooks/ directory
```

---

## 🎯 Product Philosophy

### Personalization-First

Every insight is **personal to the user**:
- Baselines are per-user, per-category (workouts vs. meals)
- Insights surface *deviations from your baseline*, not population norms
- Rules are explainable: "Your energy is +1.2 higher after morning runs vs. your average"
- Users see *trends relative to themselves*, enabling self-discovery

### What We Track

**Activities:**
- Workouts (any type, described in natural language)
- Meals (timing and general description)

**Feelings (Pre & Post-activity):**
- **Valence** (Mood): 1 (low) to 5 (high)
- **Energy**: 1 (exhausted) to 5 (energized)
- **Stress**: 1 (calm) to 5 (very stressed)

### What We DON'T Do (MVP Scope)

- ❌ Coaching plans or medical advice
- ❌ Calorie counting or macro tracking
- ❌ Body composition predictions
- ❌ Social feeds or leaderboards
- ❌ Wearable integrations (yet)
- ❌ Detailed nutrition database

We focus on **pattern discovery**, not prescription.

---

## 🧪 Testing

### Backend Tests
```bash
cd stream-1-backend
npm test                     # Run all tests
npm test -- --coverage       # With coverage report
npm test -- entries.test.ts  # Specific test file
```

**Test Coverage:**
- Unit tests for services (baselines, insights)
- Integration tests for API endpoints
- Authentication flow tests
- Database migration tests

### Frontend Tests
```bash
cd stream-2-frontend
npm test
```

### Analytics Validation
```bash
cd stream-3-analytics
pytest tests/
```

---

## 📊 Sample Insights (Based on Demo Data)

### Athena (Consistent Improver)
> "Your consistency is paying off! Your energy levels have improved 33% over the past 3 months. You've maintained an 85% activity consistency rate. Keep up your morning routine—it's working!"

### Boris (Stressed Inconsistent)
> ⚠️ "Late workouts may be disrupting your sleep. 80% of your evening workouts (after 9 PM) correlate with low next-day energy. Consider trying morning or lunch break workouts instead."

### Cora (Peak Performer)
> ✨ "You've found your optimal routine! Your metrics are consistently high (avg 3.7/5 energy, 3.8/5 mood). 90% workout consistency is excellent. Evening timing aligns with your natural energy peaks."

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run tests**: `npm test` (backend/frontend)
5. **Commit**: `git commit -m 'feat: Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring
- `style:` Formatting changes
- `chore:` Maintenance tasks

### Code Style

- **Backend**: ESLint + Prettier (auto-formatted)
- **Frontend**: ESLint + Prettier (auto-formatted)
- **Python**: Black + flake8

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ COMPLETE
- [x] Authentication system
- [x] Natural language entry logging
- [x] Pre/post feelings capture
- [x] Per-user baseline calculations
- [x] Personalized insights engine
- [x] Trend visualization
- [x] Demo personas with realistic data

### Phase 2: Advanced Analytics (In Progress)
- [ ] Correlation analysis between variables
- [ ] Predictive insights (e.g., "Tomorrow might be tough")
- [ ] Pattern detection (weekly/monthly cycles)
- [ ] Goal setting and tracking

### Phase 3: Enhanced UX
- [ ] Mobile-responsive design improvements
- [ ] Dark mode
- [ ] Advanced filtering and search
- [ ] Export data (CSV, JSON)
- [ ] Customizable dashboard

### Phase 4: Integrations
- [ ] Apple Health / Google Fit
- [ ] Fitness wearables (Fitbit, Garmin, etc.)
- [ ] Calendar integration
- [ ] Third-party nutrition APIs

### Phase 5: Social & Community
- [ ] Share insights with friends/coaches
- [ ] Anonymous benchmarking (opt-in)
- [ ] Community challenges
- [ ] Coach/trainer access mode

---

## 🐛 Known Issues & Limitations

### Current Limitations
- **Data requirement**: Insights improve with 14+ days of data
- **Manual logging**: No automatic activity detection yet
- **Desktop-first**: Mobile UX needs optimization
- **English only**: No internationalization yet

### Known Bugs
- No known critical bugs currently
- See [GitHub Issues](https://github.com/Rae9711/FitForcast_app/issues) for minor issues

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team & Acknowledgments

**Created by**: Rae

**Special Thanks**:
- All contributors and testers
- Open source community for amazing tools
- Early users providing valuable feedback

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Rae9711/FitForcast_app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Rae9711/FitForcast_app/discussions)
- **Email**: [Your contact email]

---

## 🌟 Star This Repo!

If you find FitForecast useful, please consider giving it a ⭐ on GitHub!

---

**Built with ❤️ for everyone on their fitness journey**

![FitForecast Demo](https://via.placeholder.com/800x400?text=FitForecast+Demo+Screenshot)

---

## Quick Links

- 📖 [Full Demo Walkthrough](DEMO_WALKTHROUGH_GUIDE.md)
- 🚀 [Quick Start Guide](QUICK_START.md)
- 🔐 [Authentication Docs](AUTH_SYSTEM_DOCS.md)
- 👤 [Demo Personas](DEMO_PERSONAS.md)
- 🏗️ [Technical Architecture](docs/TECHNICAL_PLAN.md)
- 🔌 [API Documentation](stream-1-backend/docs/openapi.yaml)
