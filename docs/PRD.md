# Product Requirements Document (PRD)

## Project Overview

AI Pitch Writer is a modern web application that helps entrepreneurs and business professionals create compelling business pitches using AI technology. The platform combines the power of AI with a user-friendly interface to generate customized, professional-quality pitches based on user inputs.

### Goals
- Simplify the pitch creation process for entrepreneurs
- Provide high-quality, AI-generated business pitches
- Ensure secure and seamless user experience
- Enable pitch customization and management

## Features
- [x] Authentication with magic link (email login)
  - Secure, passwordless authentication
  - Session management and protection
  - User profile handling
- [x] AI feature via n8n logic
  - Custom pitch generation based on user inputs
  - Multiple pitch styles and tones
  - Real-time processing and response
- [x] Supabase + MongoDB integration
  - User data management in Supabase
  - Pitch storage and retrieval in MongoDB
  - Secure data handling and backups
- [x] Deployed with CI/CD on Vercel
  - Automated deployment pipeline
  - Environment management
  - Performance monitoring

## User Stories
- As a user, I want to sign in with my email so that I can access my dashboard securely
- As a user, I want to generate AI-powered business pitches by providing business details
- As a user, I want to customize the tone and style of my pitch to match my audience
- As a user, I want to save and manage my generated pitches
- As a user, I want to edit and regenerate parts of my pitch as needed
- As an admin, I want to manage users and monitor pitch generation activity
- As an admin, I want to ensure system stability and performance

## Milestones
| Milestone                | Date   | Push to                   | Status |
|--------------------------|--------|---------------------------|---------|
| PRD + wireframes         | Day 15 | /grand-project/docs/      | ✅ Done |
| Backend & DB setup       | Day 18 | /grand-project/api/       | ✅ Done |
| Frontend UI             | Day 21 | /grand-project/app/       | ✅ Done |
| AI logic + testing      | Day 24 | /grand-project/ai/        | ✅ Done |
| Public demo live        | Day 27 | —                         | ✅ Done |
| Docs + Loom walkthrough | Day 29 | README.md                 | ✅ Done |

## Technical Stack
- Frontend
  - Next.js 14 with App Router
  - React with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
- Backend
  - Next.js API Routes
  - Supabase Auth for authentication
  - MongoDB with Mongoose for data storage
- AI Integration
  - n8n for workflow automation
  - Custom AI logic implementation
- DevOps
  - Vercel for hosting and CI/CD
  - Environment management
  - Automated testing

## Acceptance Criteria
- [x] Authentication system fully functional with email magic links
- [x] AI pitch generation working with customizable options
- [x] User dashboard implemented with pitch management features
- [x] Database integration complete with proper data models
- [x] Responsive UI with dark mode support
- [x] n8n workflows configured and tested
- [x] CI/CD pipeline established
- [x] Documentation and walkthrough complete 