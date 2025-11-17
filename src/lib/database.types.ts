export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'student' | 'practitioner' | 'admin'
          profile_pic_url: string | null
          sport: string | null
          specialization: string | null
          phone: string | null
          student_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role: 'student' | 'practitioner' | 'admin'
          profile_pic_url?: string | null
          sport?: string | null
          specialization?: string | null
          phone?: string | null
          student_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'student' | 'practitioner' | 'admin'
          profile_pic_url?: string | null
          sport?: string | null
          specialization?: string | null
          phone?: string | null
          student_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      injuries: {
        Row: {
          id: string
          student_id: string
          injury_type: string
          body_part: string
          severity: 'mild' | 'moderate' | 'severe'
          description: string
          date_reported: string
          date_occurred: string
          status: 'reported' | 'assigned' | 'in_treatment' | 'recovering' | 'resolved'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          injury_type: string
          body_part: string
          severity: 'mild' | 'moderate' | 'severe'
          description: string
          date_reported?: string
          date_occurred: string
          status?: 'reported' | 'assigned' | 'in_treatment' | 'recovering' | 'resolved'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          injury_type?: string
          body_part?: string
          severity?: 'mild' | 'moderate' | 'severe'
          description?: string
          date_reported?: string
          date_occurred?: string
          status?: 'reported' | 'assigned' | 'in_treatment' | 'recovering' | 'resolved'
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables as needed...
    }
  }
}