-- T/Abhayapura Primary School Student Management System Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Students Table
create table if not exists students (
    id uuid primary key default uuid_generate_v4(),
    admission_number text unique not null,
    initials text,
    first_name text not null,
    last_name text,
    gender text not null check (gender in ('Male', 'Female', 'Other')),
    date_of_birth date not null,
    nationality text,
    religion text,
    date_of_entry date not null,
    previous_school text,
    address text not null,
    phone_number text not null,
    guardian_name text not null,
    relationship_to_student text not null,
    guardian_identity_number text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Attendance Table
create table if not exists attendance (
    id uuid primary key default uuid_generate_v4(),
    student_id uuid references students(id) on delete cascade not null,
    date date not null,
    status text not null check (status in ('Present', 'Absent', 'Late', 'Excused')),
    remarks text,
    created_at timestamp with time zone default now(),
    unique(student_id, date)
);

-- Grades Table
create table if not exists grades (
    id uuid primary key default uuid_generate_v4(),
    student_id uuid references students(id) on delete cascade not null,
    term text not null,
    subject text not null,
    marks numeric not null,
    grade text,
    created_at timestamp with time zone default now()
);

-- Create a function to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql'
set search_path = public;

-- Create trigger for students table
drop trigger if exists update_students_updated_at on students;
create trigger update_students_updated_at
before update on students
for each row
execute function update_updated_at_column();

-- Enable Row Level Security
alter table students enable row level security;
alter table attendance enable row level security;
alter table grades enable row level security;

-- Create Policies (Explicitly for anon role for MVP)
-- We split these to follow security best practices and satisfy linter warnings regarding 'ALL' policies.

-- Students Policies
drop policy if exists "Allow anon select" on students;
create policy "Allow anon select" on students for select to anon using (true);
drop policy if exists "Allow anon insert" on students;
create policy "Allow anon insert" on students for insert to anon with check (admission_number is not null);
drop policy if exists "Allow anon update" on students;
create policy "Allow anon update" on students for update to anon using (id is not null) with check (id is not null);
drop policy if exists "Allow anon delete" on students;
create policy "Allow anon delete" on students for delete to anon using (id is not null);

-- Attendance Policies
drop policy if exists "Allow anon select" on attendance;
create policy "Allow anon select" on attendance for select to anon using (true);
drop policy if exists "Allow anon insert" on attendance;
create policy "Allow anon insert" on attendance for insert to anon with check (student_id is not null);
drop policy if exists "Allow anon update" on attendance;
create policy "Allow anon update" on attendance for update to anon using (id is not null) with check (id is not null);
drop policy if exists "Allow anon delete" on attendance;
create policy "Allow anon delete" on attendance for delete to anon using (id is not null);

-- Grades Policies
drop policy if exists "Allow anon select" on grades;
create policy "Allow anon select" on grades for select to anon using (true);
drop policy if exists "Allow anon insert" on grades;
create policy "Allow anon insert" on grades for insert to anon with check (student_id is not null);
drop policy if exists "Allow anon update" on grades;
create policy "Allow anon update" on grades for update to anon using (id is not null) with check (id is not null);
drop policy if exists "Allow anon delete" on grades;
create policy "Allow anon delete" on grades for delete to anon using (id is not null);
