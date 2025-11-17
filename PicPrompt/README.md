PicPrompt - AI Image Generation Platform
PicPrompt is a full-stack AI image generation platform that allows users to create stunning visuals from text prompts. I'll provide you with a comprehensive overview of the project.
🚀 Key Features
Free Trial System: New users can generate 5 images for free before login (increased from the previous limit of 2)
User Registration: 10 free credits upon registration
Credit-Based Generation: Costs 2-6 credits per image depending on model quality
Multiple AI Models:
DALL-E 3 (6 credits) - Highest quality, photorealistic
FLUX.1 dev (5 credits) - Premium quality
FLUX.1 schnell (3 credits) - Fast generation
Stable Diffusion XL (4 credits)
Stable Diffusion v1.5 (2 credits)
Smart Prompt Enhancement: Auto-optimizes user prompts for better results
Premium Plans: $15 (30 credits), $50 (150 credits), $120 (450 credits)
Real-time Credit Tracking and JWT-based authentication
🏗 Project Structure
PicPrompt/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components (e.g., Navbar, PaymentForm)
│   │   ├── pages/         # Page-level components (Home, Dashboard, etc.)
│   │   ├── context/       # Appcontext.jsx for global state via React Context
│   │   ├── utils/         # api.js, payment.js, helpers.js
│   │   └── assets/        # Static files
│   └── vite.config.js     # Vite configuration
│
├── server/                # Node.js backend
│   ├── models/           # User.js and other Mongoose schemas
│   ├── routes/           # API endpoints (auth, image, payment, user)
│   ├── middleware/       # auth.js for JWT verification
│   ├── config/           # database.js for MongoDB connection
│   └── server.js         # Express entry point
│
└── README.md             # Comprehensive project documentation
🛠 Technology Stack
Frontend
React 19.1.1: UI framework
Vite 7.1.2: Build tool and dev server
Tailwind CSS: Utility-first CSS framework
React Router: Client-side routing
React Context API: State management
Backend
Node.js: Runtime environment
Express.js: Web framework
MongoDB Atlas: Database
Mongoose: ODM for MongoDB
JWT: Authentication
bcryptjs: Password hashing
⚙ Environment Configuration
Required environment variables in .env file (server directory):
env
MONGODB_URI=mongodb+srv://Enrich:Enrich@cluster0.mdqd2xf.mongodb.net/picprompt?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
DEFAULT_CREDITS=10
Running commands:
Backend: cd server && npm run dev
Frontend: cd client && npm run dev
Server runs on http://localhost:5000, client on http://localhost:5173
🎨 How It Works
For Anonymous Users
Users can generate up to 5 images for free without logging in
The system tracks usage with IP-based caching (1-hour TTL)
After 5 generations, users are prompted to sign up
For Registered Users
New users receive 10 free credits upon registration
Each image generation costs 2-6 credits based on model quality
Users can purchase additional credits through premium plans
Users can view their generation history
AI Model Selection
Users can choose from multiple AI models with different quality levels
Higher quality models cost more credits
Smart prompt enhancement automatically optimizes user prompts
🔧 Implementation Details
Anonymous Generation Tracking
Anonymous user generation counts are tracked using NodeCache with IP-based storage
1-hour TTL to enforce the 5-image free limit without requiring authentication
Rate limiting prevents abuse (10 requests per minute per IP)
Authentication
JWT-based authentication system
Secure password hashing with bcryptjs
Token validation middleware for protected routes
State Management
React Context API for managing global state
User authentication status and credit information
Free generation tracking for anonymous users
Payment System
Simplified payment form for demonstration purposes
Accepts any card details (for demo only)
Multiple subscription tiers with different credit packages
UI/UX Features
Responsive design that works on desktop and mobile
Real-time credit tracking
Generation history
Image download and sharing capabilities
Model selection interface with quality indicators
🚀 Getting Started
Install Dependencies:
bash
cd server && npm install
cd client && npm install
Configure Environment:
Create .env files in both client and server directories
Add required environment variables
Run the Application:
bash
# Start backend server
cd server && npm run dev

# Start frontend (in a new terminal)
cd client && npm run dev
📱 User Flow
Anonymous Usage:
Visit website
Generate up to 5 free images
Sign up prompt appears after limit
User Registration:
Sign up with email/password
Automatically receive 10 free credits
Generate images (2-6 credits each)
Premium Upgrade:
Credits depleted → Purchase prompt
Choose from 3 pricing tiers
Continue generating with purchased credits
