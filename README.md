# AI Pitch Writer

A modern web application that generates compelling business pitches using AI technology. Built with Next.js 14, Supabase, MongoDB, and n8n integration, this platform helps entrepreneurs and business professionals create professional-quality pitches effortlessly.

## ✨ Features

- 🚀 **Modern UI with Animations**
  - Responsive design for all devices
  - Beautiful transitions using Framer Motion
  - Dark mode support for better accessibility
  - Real-time form validation and feedback

- 🔐 **Secure Authentication**
  - Passwordless login with magic links
  - Secure session management
  - Protected routes and API endpoints
  - User profile management

- 🤖 **AI-Powered Pitch Generation**
  - Customizable pitch styles and tones
  - Industry-specific templates
  - Real-time processing
  - Edit and regenerate capabilities

- 📝 **Advanced Form Handling**
  - Dynamic form with real-time validation
  - Rich text editing capabilities
  - Progress saving
  - Error handling and feedback

- 🗄️ **Data Management**
  - Secure data storage with MongoDB
  - User authentication via Supabase
  - Efficient data retrieval and caching
  - Automated backups

- 🔄 **Seamless n8n Integration**
  - Custom AI workflow automation
  - Webhook integration
  - Error handling and retries
  - Performance monitoring

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 14 with App Router
  - React 19.1.0 with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - React Hook Form + Zod for validation
  - Lucide Icons for UI elements

- **Backend & Data**
  - Next.js API Routes
  - Supabase Auth
  - MongoDB with Mongoose
  - n8n for AI workflow automation

- **DevOps**
  - Vercel for hosting and CI/CD
  - Environment management
  - Automated testing and deployment

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/ai-pitch-writer.git
   cd ai-pitch-writer
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # MongoDB Configuration
   MONGODB_URI=your_mongodb_uri
   
   # n8n Configuration
   N8N_WEBHOOK_URL=your_n8n_webhook_url
   
   # App Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Database Setup**
   - Create a MongoDB database
   - Set up Supabase project and enable Email auth
   - Configure database access and security rules

4. **n8n Setup**
   - Create a new n8n workflow
   - Add Webhook node as trigger
   - Configure AI processing nodes
   - Set up error handling
   - Deploy and copy webhook URL

5. **Development**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── generate-pitch/# Pitch generation endpoint
│   │   └── pitches/      # Pitch management endpoints
│   ├── auth/             # Auth-related pages
│   ├── dashboard/        # User dashboard
│   ├── create/           # Pitch creation
│   └── pitch/           # Individual pitch view
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   └── forms/           # Form components
├── lib/                 # Utility functions
│   ├── models/          # MongoDB models
│   ├── utils/           # Helper functions
│   └── validation/      # Form validation
└── types/              # TypeScript types
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Enable Email provider in Auth settings
3. Configure redirect URLs
4. Copy project URL and anon key

### MongoDB Setup
1. Create a new MongoDB cluster
2. Set up database user
3. Configure network access
4. Get connection string

### n8n Configuration
1. Create new workflow
2. Configure webhook trigger
3. Add AI processing nodes
4. Set up error handling
5. Deploy workflow

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for authentication
- MongoDB team for the database
- n8n for workflow automation
- All contributors and users
