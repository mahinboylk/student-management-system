# Student Management System

### T/Abhayapura Primary School

A web-based student management system for a primary school: student records, daily attendance, grades, and administrative reporting — backed by Supabase.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)

## Overview

This application gives school office staff a single place to manage day-to-day student administration:

- Register and maintain student and guardian details
- Mark daily attendance
- Record term grades with automatic letter-grade calculation
- Review enrollment and attendance summaries

The UI is a responsive React single-page app. All data is stored in Supabase (PostgreSQL) and accessed through the Supabase JavaScript client.

## Features

- **Dashboard** — Live totals for enrolled students, with a gender breakdown and quick links.
- **Student records** — Create, edit, delete, and search students, including guardian contact and admission details.
- **Attendance** — Mark students as Present, Absent, Late, or Excused for any date. Records are unique per student per day.
- **Grades** — Enter marks per student, term, and subject; letter grades are calculated automatically.
- **Reports** — Enrollment and attendance summary cards plus an overview of available administrative report categories.
- **Responsive layout** — Sidebar navigation designed for tablet and desktop use.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Routing | React Router 7 |
| Forms | React Hook Form |
| Database | Supabase (PostgreSQL) |
| Deployment | Netlify |

## Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm
- A [Supabase](https://supabase.com) project

### 1. Clone the repository

```bash
git clone https://github.com/mahinboylk/student-management-system.git
cd student-management-system
```

### 2. Set up the database

Open your Supabase project's **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates the `students`, `attendance`, and `grades` tables, the `updated_at` trigger, and row-level security policies.

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Both values are available in your Supabase dashboard under **Project Settings → API**. See [`.env.example`](.env.example) for the template.

### 4. Install and run

```bash
npm install
npm run dev
```

Vite starts the app at the URL printed in the terminal (usually `http://localhost:5173`).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check and build the production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

## Database Schema

| Table | Purpose |
| --- | --- |
| `students` | Student and guardian details. `admission_number` is unique. |
| `attendance` | Attendance status per student per date; enforced unique by `(student_id, date)`. |
| `grades` | Marks per student, term, and subject, with an optional letter grade. |

Foreign keys cascade on student deletion, and a trigger keeps `students.updated_at` current.

## Project Structure

```text
src/
├── components/
│   └── Layout.tsx        # Sidebar, header, and routed page shell
├── lib/
│   └── supabase.ts       # Supabase client initialization
├── pages/
│   ├── Dashboard.tsx     # Enrollment statistics and quick actions
│   ├── Students.tsx      # Student CRUD and search
│   ├── Attendance.tsx    # Daily attendance entry
│   ├── Grades.tsx        # Grade entry and listing
│   └── Reports.tsx       # Administrative summaries
├── types/
│   └── index.ts          # Student, Attendance, and Grade types
├── App.tsx               # Routes
├── main.tsx              # App entry point
└── index.css             # Tailwind entry and base styles
supabase/
└── schema.sql            # Database schema and RLS policies
public/
└── _redirects            # SPA fallback for Netlify
```

## Deployment

The project is configured for Netlify:

1. Push the repository to GitHub.
2. In Netlify, import the repository and use:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Site settings → Environment variables**.
4. Deploy. The included `public/_redirects` file handles client-side routing.

## Security Note

The included schema enables Row Level Security but grants the `anon` role full CRUD access to the three tables to support this client-only MVP. Before storing real student data in production, enable Supabase Auth and replace these permissive policies with authenticated, role-based access. Never commit your `.env` file.
