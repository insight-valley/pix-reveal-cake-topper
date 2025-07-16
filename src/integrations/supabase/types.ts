export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      captures: {
        Row: {
          captured_at: string | null
          id: number
          is_shiny: boolean | null
          level: number | null
          nickname: string | null
          pokemon_id: number | null
          trainer_id: number | null
        }
        Insert: {
          captured_at?: string | null
          id?: number
          is_shiny?: boolean | null
          level?: number | null
          nickname?: string | null
          pokemon_id?: number | null
          trainer_id?: number | null
        }
        Update: {
          captured_at?: string | null
          id?: number
          is_shiny?: boolean | null
          level?: number | null
          nickname?: string | null
          pokemon_id?: number | null
          trainer_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "captures_pokemon_id_fkey"
            columns: ["pokemon_id"]
            isOneToOne: false
            referencedRelation: "pokemon"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "captures_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      pokemon: {
        Row: {
          attack: number
          created_at: string | null
          defense: number
          generation: number
          hp: number
          id: number
          is_legendary: boolean | null
          name: string
          speed: number
          type1: string
          type2: string | null
        }
        Insert: {
          attack: number
          created_at?: string | null
          defense: number
          generation: number
          hp: number
          id?: number
          is_legendary?: boolean | null
          name: string
          speed: number
          type1: string
          type2?: string | null
        }
        Update: {
          attack?: number
          created_at?: string | null
          defense?: number
          generation?: number
          hp?: number
          id?: number
          is_legendary?: boolean | null
          name?: string
          speed?: number
          type1?: string
          type2?: string | null
        }
        Relationships: []
      }
      query_history: {
        Row: {
          artifact_html: string | null
          created_at: string | null
          error_message: string | null
          executed_data: Json | null
          execution_method: string | null
          execution_time_ms: number | null
          generated_sql: string
          id: string
          project_id: string
          user_query: string
        }
        Insert: {
          artifact_html?: string | null
          created_at?: string | null
          error_message?: string | null
          executed_data?: Json | null
          execution_method?: string | null
          execution_time_ms?: number | null
          generated_sql: string
          id?: string
          project_id: string
          user_query: string
        }
        Update: {
          artifact_html?: string | null
          created_at?: string | null
          error_message?: string | null
          executed_data?: Json | null
          execution_method?: string | null
          execution_time_ms?: number | null
          generated_sql?: string
          id?: string
          project_id?: string
          user_query?: string
        }
        Relationships: []
      }
      schema_cache_config: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          setting_name: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          setting_name: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          setting_name?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trainers: {
        Row: {
          age: number
          badges: number | null
          city: string
          created_at: string | null
          favorite_type: string | null
          id: number
          name: string
        }
        Insert: {
          age: number
          badges?: number | null
          city: string
          created_at?: string | null
          favorite_type?: string | null
          id?: number
          name: string
        }
        Update: {
          age?: number
          badges?: number | null
          city?: string
          created_at?: string | null
          favorite_type?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      mv_schema_context: {
        Row: {
          context_hash: string | null
          key_columns: Json | null
          refresh_type: string | null
          refreshed_at: string | null
          sample_data: Json | null
          schema_text: string | null
          table_name: string | null
          table_schema: string | null
          total_records: number | null
        }
        Relationships: []
      }
      schema_context_view: {
        Row: {
          schema_text: string | null
          table_name: unknown | null
          table_schema: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_schema_context_universal: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_schema: string
          table_name: string
          schema_text: string
          sample_data: Json
          total_records: number
          key_columns: Json
          refreshed_at: string
          refresh_type: string
          context_hash: string
        }[]
      }
      get_cache_config: {
        Args: { config_name: string; default_value?: string }
        Returns: string
      }
      get_table_sample_data_universal: {
        Args: { schema_name: string; table_name: string; sample_limit?: number }
        Returns: Json
      }
      refresh_schema_context_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      test_schema_context_view: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_schema: string
          table_name: string
          schema_text: string
        }[]
      }
      test_schema_view: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_schema: string
          table_name: string
          first_chars: string
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
