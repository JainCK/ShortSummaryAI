# ShortSummaryAI Frontend

The frontend for ShortSummaryAI is built with Next.js, providing a modern and responsive user interface for text processing and management.

## Features

- Clean and intuitive user interface
- User authentication
- Text summarization
- Bullet point generation
- View and manage processing history
- Responsive design for all devices

## Tech Stack

- **Next.js**: React framework for production
- **TypeScript**: Typed JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Component library built on Radix UI
- **Axios**: Promise-based HTTP client
- **Lucide React**: Icon library
- **React Hook Form**: Form validation

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/                # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/             # Dashboard page
│   └── page.tsx               # Home page
├── components/
│   ├── auth/                  # Authentication components
│   ├── dashboard/             # Dashboard components
│   ├── layout/                # Layout components
│   └── ui/                    # UI components
├── lib/
│   ├── api/                   # API client
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── styles/                    # Global styles
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies and scripts
```

## Pages

- `/`: Landing page with features and call-to-action
- `/login`: User login page
- `/register`: User registration page
- `/dashboard`: Main application dashboard

## Components

- **Auth**: Login and registration forms
- **Dashboard**: Text input, result display, and history management
- **Layout**: Page layout components
- **UI**: Reusable UI components (buttons, inputs, etc.)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Docker

Build and run the frontend with Docker:

```bash
docker build -t shortsummaryai-frontend .
docker run -p 3000:3000 shortsummaryai-frontend
```

## Customization

### Theme

The application uses a dark theme by default. You can customize the theme by editing the `tailwind.config.js` file.

### Components

UI components are built with Shadcn/UI and can be customized according to your needs.
