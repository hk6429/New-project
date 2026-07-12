export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      classroom_sessions: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          owner_id: string
          settings: Json
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          owner_id: string
          settings?: Json
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          owner_id?: string
          settings?: Json
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          id: string
          joined_at: string
          nickname: string
          session_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          nickname: string
          session_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          nickname?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "classroom_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_reviews: {
        Row: {
          created_at: string
          id: string
          note: string
          question_id: string
          reviewer_id: string
          verdict: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string
          question_id: string
          reviewer_id: string
          verdict: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          question_id?: string
          reviewer_id?: string
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_reviews_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          context: string
          correct_answers: Json
          created_at: string
          difficulty: string
          grade: number[]
          id: string
          metonym: string
          options: Json
          prompt: string
          rationale: string
          referent: string
          relation: string
          review_count: number
          source: Json | null
          status: string
          type: string
          updated_at: string
          version: number
        }
        Insert: {
          context: string
          correct_answers: Json
          created_at?: string
          difficulty: string
          grade: number[]
          id: string
          metonym: string
          options: Json
          prompt: string
          rationale: string
          referent: string
          relation: string
          review_count?: number
          source?: Json | null
          status?: string
          type: string
          updated_at?: string
          version?: number
        }
        Update: {
          context?: string
          correct_answers?: Json
          created_at?: string
          difficulty?: string
          grade?: number[]
          id?: string
          metonym?: string
          options?: Json
          prompt?: string
          rationale?: string
          referent?: string
          relation?: string
          review_count?: number
          source?: Json | null
          status?: string
          type?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      responses: {
        Row: {
          answer: Json
          duration_ms: number
          id: string
          is_correct: boolean
          participant_id: string
          question_id: string
          session_id: string
          submitted_at: string
        }
        Insert: {
          answer: Json
          duration_ms: number
          id?: string
          is_correct: boolean
          participant_id: string
          question_id: string
          session_id: string
          submitted_at?: string
        }
        Update: {
          answer?: Json
          duration_ms?: number
          id?: string
          is_correct?: boolean
          participant_id?: string
          question_id?: string
          session_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "classroom_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_profiles: {
        Row: {
          created_at: string
          display_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_classroom_question: {
        Args: { requested_position: number; requested_session_id: string }
        Returns: {
          context: string
          difficulty: string
          options: Json
          prompt: string
          question_id: string
          question_position: number
          question_type: string
          total: number
        }[]
      }
      submit_classroom_answer: {
        Args: {
          requested_question_id: string
          requested_session_id: string
          submitted_answer: string
          submitted_duration_ms?: number
        }
        Returns: {
          answered_count: number
          correct_answer: string
          is_correct: boolean
          rationale: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
