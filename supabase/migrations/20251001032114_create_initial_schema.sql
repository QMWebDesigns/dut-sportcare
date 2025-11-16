/*
  # DUT Student Athlete Injury Management System - Initial Schema

  ## Overview
  Creates the complete database schema for the DUT injury management platform with user roles,
  injury tracking, practitioner assignments, recovery logging, appointments, messaging, and file storage.

  ## New Tables

  ### 1. `users`
  - `id` (uuid, primary key) - Links to auth.users
  - `full_name` (text) - User's full name
  - `email` (text) - User's email address
  - `role` (text) - User role: 'student', 'practitioner', or 'admin'
  - `profile_pic_url` (text, nullable) - Profile picture URL
  - `sport` (text, nullable) - For students: their sport
  - `specialization` (text, nullable) - For practitioners: area of expertise
  - `phone` (text, nullable) - Contact phone number
  - `student_number` (text, nullable) - For students: their student ID
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `injuries`
  - `id` (uuid, primary key)
  - `student_id` (uuid) - References users table
  - `injury_type` (text) - Type of injury (sprain, fracture, etc.)
  - `body_part` (text) - Affected body part
  - `severity` (text) - Severity level: 'mild', 'moderate', or 'severe'
  - `description` (text) - Detailed injury description
  - `date_reported` (date) - When the injury was reported
  - `date_occurred` (date) - When the injury actually occurred
  - `status` (text) - Current status: 'reported', 'assigned', 'in_treatment', 'recovering', 'resolved'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `practitioner_assignments`
  - `id` (uuid, primary key)
  - `student_id` (uuid) - References users
  - `practitioner_id` (uuid) - References users
  - `injury_id` (uuid) - References injuries
  - `assigned_by` (uuid) - Admin who made the assignment
  - `assigned_at` (timestamptz) - Assignment timestamp
  - `active` (boolean) - Whether assignment is currently active
  - `notes` (text, nullable) - Assignment notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `recovery_logs`
  - `id` (uuid, primary key)
  - `assignment_id` (uuid) - References practitioner_assignments
  - `practitioner_id` (uuid) - References users
  - `notes` (text) - Recovery progress notes
  - `exercises` (text, nullable) - Prescribed exercises
  - `next_steps` (text, nullable) - Recommended next steps
  - `pain_level` (integer, nullable) - Pain rating 1-10
  - `mobility_level` (integer, nullable) - Mobility rating 1-10
  - `log_date` (date) - Date of this recovery log entry
  - `created_at` (timestamptz)

  ### 5. `appointments`
  - `id` (uuid, primary key)
  - `student_id` (uuid) - References users
  - `practitioner_id` (uuid) - References users
  - `assignment_id` (uuid, nullable) - References practitioner_assignments
  - `appointment_date` (timestamptz) - Date and time of appointment
  - `duration_minutes` (integer) - Appointment duration
  - `status` (text) - Status: 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
  - `location` (text, nullable) - Appointment location
  - `notes` (text, nullable) - Appointment notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `messages`
  - `id` (uuid, primary key)
  - `sender_id` (uuid) - References users
  - `receiver_id` (uuid) - References users
  - `assignment_id` (uuid, nullable) - Related assignment context
  - `message` (text) - Message content
  - `read` (boolean) - Whether message has been read
  - `read_at` (timestamptz, nullable) - When message was read
  - `sent_at` (timestamptz) - When message was sent

  ### 7. `files`
  - `id` (uuid, primary key)
  - `uploaded_by` (uuid) - References users
  - `injury_id` (uuid, nullable) - Related injury
  - `assignment_id` (uuid, nullable) - Related assignment
  - `file_name` (text) - Original file name
  - `file_path` (text) - Storage path in Supabase Storage
  - `file_type` (text) - MIME type
  - `file_size` (integer) - File size in bytes
  - `description` (text, nullable) - File description
  - `uploaded_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Students can only access their own data
  - Practitioners can access data for their assigned students
  - Admins have full access to all data
  - Proper authentication checks on all policies
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'practitioner', 'admin')),
  profile_pic_url text,
  sport text,
  specialization text,
  phone text,
  student_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create injuries table
CREATE TABLE IF NOT EXISTS injuries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  injury_type text NOT NULL,
  body_part text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  description text NOT NULL,
  date_reported date NOT NULL DEFAULT CURRENT_DATE,
  date_occurred date NOT NULL,
  status text NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'assigned', 'in_treatment', 'recovering', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create practitioner_assignments table
CREATE TABLE IF NOT EXISTS practitioner_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practitioner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  injury_id uuid NOT NULL REFERENCES injuries(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL REFERENCES users(id),
  assigned_at timestamptz DEFAULT now(),
  active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recovery_logs table
CREATE TABLE IF NOT EXISTS recovery_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES practitioner_assignments(id) ON DELETE CASCADE,
  practitioner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notes text NOT NULL,
  exercises text,
  next_steps text,
  pain_level integer CHECK (pain_level >= 1 AND pain_level <= 10),
  mobility_level integer CHECK (mobility_level >= 1 AND mobility_level <= 10),
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practitioner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES practitioner_assignments(id) ON DELETE SET NULL,
  appointment_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  location text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES practitioner_assignments(id) ON DELETE SET NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  read_at timestamptz,
  sent_at timestamptz DEFAULT now()
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  injury_id uuid REFERENCES injuries(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES practitioner_assignments(id) ON DELETE SET NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  description text,
  uploaded_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_injuries_student_id ON injuries(student_id);
CREATE INDEX IF NOT EXISTS idx_injuries_status ON injuries(status);
CREATE INDEX IF NOT EXISTS idx_practitioner_assignments_student ON practitioner_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_practitioner_assignments_practitioner ON practitioner_assignments(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_practitioner_assignments_active ON practitioner_assignments(active);
CREATE INDEX IF NOT EXISTS idx_recovery_logs_assignment ON recovery_logs(assignment_id);
CREATE INDEX IF NOT EXISTS idx_appointments_student ON appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_appointments_practitioner ON appointments(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_files_injury ON files(injury_id);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE injuries ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioner_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Practitioners can view assigned students"
  ON users FOR SELECT
  TO authenticated
  USING (
    role = 'student' AND EXISTS (
      SELECT 1 FROM practitioner_assignments
      WHERE practitioner_assignments.student_id = users.id
      AND practitioner_assignments.practitioner_id = auth.uid()
      AND practitioner_assignments.active = true
    )
  );

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for injuries table
CREATE POLICY "Students can view own injuries"
  ON injuries FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can create own injuries"
  ON injuries FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own injuries"
  ON injuries FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Practitioners can view assigned student injuries"
  ON injuries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioner_assignments
      WHERE practitioner_assignments.injury_id = injuries.id
      AND practitioner_assignments.practitioner_id = auth.uid()
      AND practitioner_assignments.active = true
    )
  );

CREATE POLICY "Practitioners can update assigned injuries"
  ON injuries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioner_assignments
      WHERE practitioner_assignments.injury_id = injuries.id
      AND practitioner_assignments.practitioner_id = auth.uid()
      AND practitioner_assignments.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM practitioner_assignments
      WHERE practitioner_assignments.injury_id = injuries.id
      AND practitioner_assignments.practitioner_id = auth.uid()
      AND practitioner_assignments.active = true
    )
  );

CREATE POLICY "Admins can view all injuries"
  ON injuries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all injuries"
  ON injuries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for practitioner_assignments table
CREATE POLICY "Students can view own assignments"
  ON practitioner_assignments FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Practitioners can view own assignments"
  ON practitioner_assignments FOR SELECT
  TO authenticated
  USING (practitioner_id = auth.uid());

CREATE POLICY "Admins can view all assignments"
  ON practitioner_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can create assignments"
  ON practitioner_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update assignments"
  ON practitioner_assignments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for recovery_logs table
CREATE POLICY "Students can view own recovery logs"
  ON recovery_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioner_assignments
      WHERE practitioner_assignments.id = recovery_logs.assignment_id
      AND practitioner_assignments.student_id = auth.uid()
    )
  );

CREATE POLICY "Practitioners can view own recovery logs"
  ON recovery_logs FOR SELECT
  TO authenticated
  USING (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can create recovery logs"
  ON recovery_logs FOR INSERT
  TO authenticated
  WITH CHECK (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can update own recovery logs"
  ON recovery_logs FOR UPDATE
  TO authenticated
  USING (practitioner_id = auth.uid())
  WITH CHECK (practitioner_id = auth.uid());

CREATE POLICY "Admins can view all recovery logs"
  ON recovery_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for appointments table
CREATE POLICY "Students can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Practitioners can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (practitioner_id = auth.uid())
  WITH CHECK (practitioner_id = auth.uid());

CREATE POLICY "Admins can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for messages table
CREATE POLICY "Users can view sent messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid());

CREATE POLICY "Users can view received messages"
  ON messages FOR SELECT
  TO authenticated
  USING (receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

CREATE POLICY "Admins can view all messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for files table
CREATE POLICY "Students can view own files"
  ON files FOR SELECT
  TO authenticated
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM injuries
      WHERE injuries.id = files.injury_id
      AND injuries.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can upload files"
  ON files FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Practitioners can view assigned student files"
  ON files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioner_assignments pa
      JOIN injuries i ON i.id = pa.injury_id
      WHERE (files.injury_id = i.id OR files.assignment_id = pa.id)
      AND pa.practitioner_id = auth.uid()
      AND pa.active = true
    )
  );

CREATE POLICY "Practitioners can upload files"
  ON files FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'practitioner'
    )
  );

CREATE POLICY "Admins can view all files"
  ON files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_injuries_updated_at
  BEFORE UPDATE ON injuries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practitioner_assignments_updated_at
  BEFORE UPDATE ON practitioner_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
