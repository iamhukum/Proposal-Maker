# ProposalAI

AI-powered proposal generation platform for agencies, freelancers, and consultants. Transforms client briefs into professional, luxury-designed proposals with PDF export.

## Tech Stack

- **Frontend:** React, TailwindCSS, React Router
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **AI:** OpenAI API (GPT-4o-mini)
- **PDF:** Puppeteer (HTML → PDF)
- **Auth:** JWT

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL
- OpenAI API key

### 1. Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Initialize Database

```bash
cd server && npm run db:init
```

### 4. Run Development

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
/client
  /src
    /components    - Reusable UI components
    /pages         - Route pages
    /services      - API service layer
    /context       - Auth context

/server
  /routes          - Express route definitions
  /controllers     - Request handlers
  /services        - Business logic (AI, PDF)
  /middleware       - Auth, error handling
  /config          - Database config
  /utils           - Validators
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get profile |
| GET | /api/proposals | List proposals |
| POST | /api/proposals | Create proposal |
| GET | /api/proposals/:id | Get proposal |
| PUT | /api/proposals/:id | Update proposal |
| DELETE | /api/proposals/:id | Delete proposal |
| POST | /api/ai/generate-proposal | Generate proposal content |
| POST | /api/ai/generate-pricing | Generate pricing tiers |
| POST | /api/ai/generate-timeline | Generate timeline |
| POST | /api/ai/regenerate-section | Regenerate a section |
| POST | /api/export/pdf | Export proposal as PDF |

## Workflow

1. Register / Login
2. Create new proposal (client name + project title)
3. Input project brief details
4. AI generates proposal content
5. Edit sections, regenerate as needed
6. Generate pricing tiers
7. Generate project timeline
8. Preview luxury proposal design
9. Export as PDF
