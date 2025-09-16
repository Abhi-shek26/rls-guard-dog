# RLS Guard Dog 

A secure, full-stack **school management application** built with **Next.js** and **Supabase**, showcasing advanced **Row-Level Security (RLS)** for **multi-role access control**.  
This project manages students, teachers, headteachers, classrooms, and progress records with fine-grained, database-level permissions.


---

➡️ **View the live Vercel demo here:** **[Live Demo](https://rls-guard-dog-one.vercel.app/)**

---

➡️ **View the live NetlifyCLI demo here:** **[Live Demo](https://melodic-lollipop-878b9b.netlify.app/)**

---

➡️ **Demo Video:**

https://github.com/user-attachments/assets/1ac0ae9e-134e-4841-8a5c-7909a729a34f


### 🔑 Sample Login Credentials

| Name         | Email                 | Password  |
|--------------|-----------------------|-----------|
| Student1      | student@gmail.com    | 123456789 |
| Student2     | student1@gmail.com    | 123456789 |
| Teacher1     | teacher@gmail.com     | 123456789 |
| Teacher2     | teacher1@gmail.com    | 123456789 |
| Head Teacher | headteacher@test.com  | 123456789 |

#### Note:
These credentials is used to check the functionality as this project is just a robust version which do not include auto selection for a student, teacher or head teacher role. One need to manually set the role of an user from the supabase then its credentials and other details can be fetched.

## 🏫 Introduction

RLS Guard Dog is a demonstration of building a **robust, secure, and scalable application** using the **Next.js App Router** with **Supabase**.  

It features:  
- User authentication.  
- Multi-role access control.  
- Dynamic classroom routing.  
- Real-time updates for student progress.  
- Strict database-level security via **RLS policies** and **Postgres functions**.
- Added an Edge Function that calculates class averages and saves them to MongoDB.

Perfect for learning **full-stack development with security-first principles**, including database design, TypeScript typing, and deployment best practices.

---

## ✨ Features

- **Authentication**: Secure login/signup with Supabase Auth.  
- **Role-Based Access Control**:  
  - **Students** → View their own classroom progress.  
  - **Teachers** → View & update progress in assigned classrooms.  
  - **Headteachers** → View all classrooms in their school.  
- **Dynamic Routing**: Classroom-specific pages (`/teacher/[classId]`).  
- **Realtime Updates**: Automatic UI refresh on data changes.  
- **Secure Database**: RLS + SECURITY DEFINER functions prevent leaks.  
- **Responsive UI**: Styled with Tailwind CSS.  
- **Deployment-Ready**: Configured for **Vercel** with Turbopack and also on **Netlify**

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS.  
- **Backend/DB**: Supabase (Postgres, Auth, Realtime, RLS).  
- **Deployment**: Vercel (Turbopack builds) + Netlify (Preferred for Next.js) 
- **Tooling**: ESLint (TypeScript rules), Git for versioning.  

---

## 📋 Prerequisites

- Node.js **18+**  
- Supabase account (free tier works)  
- Git installed  

---

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```
    git clone [YOUR_GITHUB_REPO_LINK_HERE]
    ```
2.  **Navigate to the project directory:**
    ```
    cd rls-guard-dog
    ```
3.  **Install dependencies:**
    ```
    npm install
    ```
4. **SetEnvironment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_ROLE_KEY
   ``` 
---

## 🛠️Supabase Setup

1. Create a Supabase project.

2. Run SQL scripts from /supabase (creates tables, policies, triggers).

3. Enable RLS on relevant tables.

4. Enable Realtime on progress.

### SQL Code Sample 
```sql
-- Create schools table
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- Create profiles table with roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'head_teacher')),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE
);

-- Create classrooms table
CREATE TABLE IF NOT EXISTS public.classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE
);

-- Create many-to-many join table: teacher assignments
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  UNIQUE (teacher_id, classroom_id)
);

-- Create progress table
CREATE TABLE IF NOT EXISTS public.progress (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Sample RLS policy for profiles
CREATE POLICY "Allow authenticated users to access own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Sample RLS policy for classrooms
CREATE POLICY "Allow teachers and headteachers to select classrooms in their school" ON public.classrooms
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.school_id = classrooms.school_id AND p.role IN ('teacher', 'head_teacher')
    )
  );

-- Sample RLS policy for teacher_assignments
CREATE POLICY "Allow teachers and headteachers to select their assigned classrooms" ON public.teacher_assignments
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.id = teacher_assignments.teacher_id AND p.role IN ('teacher', 'head_teacher')
    )
  );

-- Sample RLS policy for progress
CREATE POLICY "Allow students, teachers, and headteachers to select relevant progress" ON public.progress
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND (
        (p.role = 'student' AND progress.student_id = p.id) OR
        (p.role IN ('teacher', 'head_teacher') AND EXISTS (
          SELECT 1 FROM public.teacher_assignments ta WHERE ta.teacher_id = p.id AND ta.classroom_id = progress.classroom_id
        ))
      )
    )
  );

-- Insert default school
INSERT INTO public.schools (name) VALUES ('Supabase School') ON CONFLICT DO NOTHING;

-- Trigger to create profile on new user signup
CREATE FUNCTION public.user_profile_insert() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, school_id)
  VALUES (NEW.id, 'student', (SELECT id FROM public.schools LIMIT 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.user_profile_insert();
```

---

## ▶️Start Dev Server
   ```
   npm run dev
   # or
   yarn dev
   ```
---

## Visit: http://localhost:3000  🚀
 
---
## ▶️ Usage

1. **Sign Up / Log In**: via `/signup` or `/login`.  
   - After signup, update your role in the `profiles` table.  

2. **Dashboards**:  
   - **Teacher** → Assigned classrooms, edit progress.  
   - **Headteacher** → View all classrooms in school.  
   - **Student** → View their own progress.  

3. **Admin Tasks (via Supabase)**:  
   - Manage teacher-classroom assignments.  
   - Insert/update progress records.  

---

## 🗄️ Database Schema

- **profiles** → user info (`id`, `role`, `school_id`)  
- **schools** → school entities  
- **classrooms** → per-school classes  
- **progress** → student scores, notes  
- **teacher_assignments** → many-to-many teacher-classroom  

🔐 **RLS ensures isolation** (e.g., teachers see only their classes).

---

## 🔧 Configuration

- **Auth Triggers** → Create `profiles` automatically on signup.  
- **RLS Policies** → Define access per role.  
- **SECURITY DEFINER Functions** → Allow safe RPC access.  
- **Realtime** → Enable on `progress` for instant updates.  

---

## 🚀 Deployment on Vercel

1. Push repo to GitHub.  
2. Import project into Vercel.  
3. Add `.env.local` vars in Vercel settings.  
4. Set build command:
    ```
    next build --turbopack
    ```

##🐛 Troubleshooting

1. 403 Forbidden → Likely an RLS policy issue. Check policies and roles.

2. Realtime not working → Confirm Supabase Realtime enabled for progress.

3. Profile missing on signup → Ensure triggers are set up.

4. Build fails on Vercel → Ensure Node.js 18+ and correct NEXT_PUBLIC_* vars.
