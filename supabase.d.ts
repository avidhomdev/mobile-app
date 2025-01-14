export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      business_appointment_profiles: {
        Row: {
          appointment_id: number
          business_id: string
          created_at: string
          id: number
          profile_id: string
        }
        Insert: {
          appointment_id: number
          business_id: string
          created_at?: string
          id?: number
          profile_id: string
        }
        Update: {
          appointment_id?: number
          business_id?: string
          created_at?: string
          id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_appointment_profiles_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "business_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_appointment_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_appointment_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_appointments: {
        Row: {
          business_id: string
          created_at: string
          customer_id: number | null
          end_datetime: string
          id: number
          job_id: number | null
          location_id: number | null
          name: string | null
          start_datetime: string
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_id?: number | null
          end_datetime: string
          id?: number
          job_id?: number | null
          location_id?: number | null
          name?: string | null
          start_datetime: string
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_id?: number | null
          end_datetime?: string
          id?: number
          job_id?: number | null
          location_id?: number | null
          name?: string | null
          start_datetime?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "business_location_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_appointments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "business_location_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_appointments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_custom_fields: {
        Row: {
          business_id: string
          created_at: string
          id: number
          label: string
          model: Database["public"]["Enums"]["custom_field_models"]
          type: Database["public"]["Enums"]["custom_field_types"]
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: number
          label: string
          model: Database["public"]["Enums"]["custom_field_models"]
          type: Database["public"]["Enums"]["custom_field_types"]
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: number
          label?: string
          model?: Database["public"]["Enums"]["custom_field_models"]
          type?: Database["public"]["Enums"]["custom_field_types"]
        }
        Relationships: [
          {
            foreignKeyName: "business_custom_fields_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_location_customers: {
        Row: {
          address: string | null
          business_id: string
          city: string | null
          closer_id: string | null
          created_at: string
          creator_id: string | null
          disposition_status: string | null
          email: string
          full_name: string
          id: number
          lead_source: string | null
          location_id: number
          notes: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
        }
        Insert: {
          address?: string | null
          business_id: string
          city?: string | null
          closer_id?: string | null
          created_at?: string
          creator_id?: string | null
          disposition_status?: string | null
          email: string
          full_name: string
          id?: number
          lead_source?: string | null
          location_id: number
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
        }
        Update: {
          address?: string | null
          business_id?: string
          city?: string | null
          closer_id?: string | null
          created_at?: string
          creator_id?: string | null
          disposition_status?: string | null
          email?: string
          full_name?: string
          id?: number
          lead_source?: string | null
          location_id?: number
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_location_customers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_customers_closer_id_fkey"
            columns: ["closer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_customers_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_customers_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_location_job_appointment_profiles: {
        Row: {
          appointment_id: number
          business_id: string
          created_at: string
          id: number
          job_id: number
          location_id: number
          profile_id: string
        }
        Insert: {
          appointment_id: number
          business_id: string
          created_at?: string
          id?: number
          job_id: number
          location_id: number
          profile_id: string
        }
        Update: {
          appointment_id?: number
          business_id?: string
          created_at?: string
          id?: number
          job_id?: number
          location_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_location_job_appointment_profiles_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "business_location_job_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_appointment_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_appointment_profiles_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "business_location_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_appointment_profiles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_appointment_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_location_job_appointments: {
        Row: {
          business_id: string
          created_at: string
          end_datetime: string
          id: number
          job_id: number
          location_id: number
          start_datetime: string
          type: string
        }
        Insert: {
          business_id: string
          created_at?: string
          end_datetime: string
          id?: number
          job_id: number
          location_id: number
          start_datetime: string
          type: string
        }
        Update: {
          business_id?: string
          created_at?: string
          end_datetime?: string
          id?: number
          job_id?: number
          location_id?: number
          start_datetime?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_location_job_appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_appointments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "business_location_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_appointments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_location_job_media: {
        Row: {
          business_id: string
          created_at: string
          id: number
          job_id: number
          location_id: number
          name: string
          path: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: number
          job_id: number
          location_id: number
          name: string
          path: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: number
          job_id?: number
          location_id?: number
          name?: string
          path?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_location_job_media_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_media_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "business_location_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_media_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_location_job_messages: {
        Row: {
          author_id: string
          business_id: string
          created_at: string
          id: number
          job_id: number
          location_id: number
          message: string
        }
        Insert: {
          author_id: string
          business_id: string
          created_at?: string
          id?: number
          job_id: number
          location_id: number
          message: string
        }
        Update: {
          author_id?: string
          business_id?: string
          created_at?: string
          id?: number
          job_id?: number
          location_id?: number
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_location_job_messages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_messages_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "business_location_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_messages_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_location_job_products: {
        Row: {
          business_id: string
          created_at: string
          id: number
          job_id: number
          lead_price: number | null
          location_id: number
          number_of_units: number
          product_id: number
          total_price: number | null
          unit_price: number | null
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: number
          job_id: number
          lead_price?: number | null
          location_id: number
          number_of_units?: number
          product_id: number
          total_price?: number | null
          unit_price?: number | null
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: number
          job_id?: number
          lead_price?: number | null
          location_id?: number
          number_of_units?: number
          product_id?: number
          total_price?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_location_job_products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_products_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "business_location_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_products_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "business_products"
            referencedColumns: ["id"]
          },
        ]
      }
      business_location_job_profiles: {
        Row: {
          business_id: string
          created_at: string
          id: number
          job_id: number
          location_id: number
          profile_id: string
          role: Database["public"]["Enums"]["job_roles"]
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: number
          job_id: number
          location_id: number
          profile_id: string
          role?: Database["public"]["Enums"]["job_roles"]
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: number
          job_id?: number
          location_id?: number
          profile_id?: string
          role?: Database["public"]["Enums"]["job_roles"]
        }
        Relationships: [
          {
            foreignKeyName: "business_location_job_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_profiles_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "business_location_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_profiles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_location_job_timesheets: {
        Row: {
          business_id: string
          created_at: string
          end_datetime: string | null
          id: number
          job_id: number
          location_id: number
          paid: boolean
          profile_id: string
          start_datetime: string
        }
        Insert: {
          business_id: string
          created_at?: string
          end_datetime?: string | null
          id?: number
          job_id: number
          location_id: number
          paid?: boolean
          profile_id: string
          start_datetime: string
        }
        Update: {
          business_id?: string
          created_at?: string
          end_datetime?: string | null
          id?: number
          job_id?: number
          location_id?: number
          paid?: boolean
          profile_id?: string
          start_datetime?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_location_job_timesheets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_timesheets_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "business_location_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_timesheets_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_job_timesheets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_location_jobs: {
        Row: {
          address: string | null
          business_id: string
          business_location_id: number
          city: string | null
          commission: number
          created_at: string
          creator_id: string
          customer_id: number | null
          down_payment_collected: number | null
          email: string | null
          estimated_end_date: string | null
          estimated_start_date: string | null
          full_name: string
          has_water_rebate: boolean
          hoa_approval_required: boolean
          hoa_contact_email: string | null
          hoa_contact_name: string | null
          hoa_contact_phone: string | null
          id: number
          lead_type: string
          payment_type: Database["public"]["Enums"]["job_payment_types"]
          phone: string | null
          postal_code: string | null
          state: string | null
          status: Database["public"]["Enums"]["location_job_status"]
          water_rebate_company: string | null
        }
        Insert: {
          address?: string | null
          business_id: string
          business_location_id: number
          city?: string | null
          commission?: number
          created_at?: string
          creator_id: string
          customer_id?: number | null
          down_payment_collected?: number | null
          email?: string | null
          estimated_end_date?: string | null
          estimated_start_date?: string | null
          full_name: string
          has_water_rebate?: boolean
          hoa_approval_required?: boolean
          hoa_contact_email?: string | null
          hoa_contact_name?: string | null
          hoa_contact_phone?: string | null
          id?: number
          lead_type?: string
          payment_type?: Database["public"]["Enums"]["job_payment_types"]
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["location_job_status"]
          water_rebate_company?: string | null
        }
        Update: {
          address?: string | null
          business_id?: string
          business_location_id?: number
          city?: string | null
          commission?: number
          created_at?: string
          creator_id?: string
          customer_id?: number | null
          down_payment_collected?: number | null
          email?: string | null
          estimated_end_date?: string | null
          estimated_start_date?: string | null
          full_name?: string
          has_water_rebate?: boolean
          hoa_approval_required?: boolean
          hoa_contact_email?: string | null
          hoa_contact_name?: string | null
          hoa_contact_phone?: string | null
          id?: number
          lead_type?: string
          payment_type?: Database["public"]["Enums"]["job_payment_types"]
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["location_job_status"]
          water_rebate_company?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_location_jobs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_jobs_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "business_location_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_jobs_location_id_fkey"
            columns: ["business_location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_location_profiles: {
        Row: {
          business_id: string
          commission_rate: number | null
          created_at: string
          is_closer: boolean
          is_setter: boolean
          location_id: number
          profile_id: string
          referrer_profile_id: string | null
          role: Database["public"]["Enums"]["location_profile_roles"]
        }
        Insert: {
          business_id: string
          commission_rate?: number | null
          created_at?: string
          is_closer?: boolean
          is_setter?: boolean
          location_id: number
          profile_id: string
          referrer_profile_id?: string | null
          role?: Database["public"]["Enums"]["location_profile_roles"]
        }
        Update: {
          business_id?: string
          commission_rate?: number | null
          created_at?: string
          is_closer?: boolean
          is_setter?: boolean
          location_id?: number
          profile_id?: string
          referrer_profile_id?: string | null
          role?: Database["public"]["Enums"]["location_profile_roles"]
        }
        Relationships: [
          {
            foreignKeyName: "business_location_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_location_profiles_referrer_profile_id_fkey"
            columns: ["referrer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_profiles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_locations: {
        Row: {
          address: string | null
          address2: string | null
          business_id: string
          city: string | null
          created_at: string
          id: number
          name: string
          postal_code: string | null
          state: string | null
        }
        Insert: {
          address?: string | null
          address2?: string | null
          business_id: string
          city?: string | null
          created_at?: string
          id?: number
          name: string
          postal_code?: string | null
          state?: string | null
        }
        Update: {
          address?: string | null
          address2?: string | null
          business_id?: string
          city?: string | null
          created_at?: string
          id?: number
          name?: string
          postal_code?: string | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_locations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_logs: {
        Row: {
          business_id: string
          created_at: string
          id: number
          message: string
          profile_id: string
          record_id: string
          record_table_name: string
          snapshot: Json | null
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: number
          message: string
          profile_id: string
          record_id: string
          record_table_name: string
          snapshot?: Json | null
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: number
          message?: string
          profile_id?: string
          record_id?: string
          record_table_name?: string
          snapshot?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "business_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_products: {
        Row: {
          business_id: string
          created_at: string
          id: number
          image: string | null
          lead_price: number
          name: string
          unit: string | null
          unit_price: number | null
          units_in_stock: number | null
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: number
          image?: string | null
          lead_price?: number
          name: string
          unit?: string | null
          unit_price?: number | null
          units_in_stock?: number | null
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: number
          image?: string | null
          lead_price?: number
          name?: string
          unit?: string | null
          unit_price?: number | null
          units_in_stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          business_id: string
          created_at: string
          profile_id: string
          role: Database["public"]["Enums"]["business_roles"]
        }
        Insert: {
          business_id: string
          created_at?: string
          profile_id: string
          role?: Database["public"]["Enums"]["business_roles"]
        }
        Update: {
          business_id?: string
          created_at?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["business_roles"]
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_tokens: {
        Row: {
          business_id: string
          created_at: string
          id: number
          service: string
          token: string
          token_type: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: number
          service: string
          token: string
          token_type: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: number
          service?: string
          token?: string
          token_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_tokens_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          created_at: string
          id: string
          logo: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
        }
        Relationships: []
      }
      global_admins: {
        Row: {
          created_at: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          profile_id: string
        }
        Update: {
          created_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "global_admins_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      business_profile_has_role: {
        Args: {
          bid: string
          r: string
        }
        Returns: boolean
      }
      get_user_id_by_email: {
        Args: {
          email: string
        }
        Returns: {
          id: string
        }[]
      }
      has_business_profile: {
        Args: {
          bid: string
        }
        Returns: boolean
      }
      has_job_profile: {
        Args: {
          jid: number
        }
        Returns: boolean
      }
      has_location_profile: {
        Args: {
          lid: number
        }
        Returns: boolean
      }
      has_role_at_any_business_location: {
        Args: {
          r: string
          bid: string
        }
        Returns: boolean
      }
      is_business_profile: {
        Args: {
          biz_id: string
        }
        Returns: boolean
      }
      is_global_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_job_employee: {
        Args: {
          jobid: number
        }
        Returns: boolean
      }
      is_location_manager_or_admin: {
        Args: {
          locationid: number
        }
        Returns: boolean
      }
      is_location_profile: {
        Args: {
          location_id: number
        }
        Returns: boolean
      }
      location_profile_has_role: {
        Args: {
          lid: number
          r: string
        }
        Returns: boolean
      }
      ordered_employees: {
        Args: {
          lid: number
        }
        Returns: {
          profile_id: string
          full_name: string
          latest_appointment: string
        }[]
      }
    }
    Enums: {
      business_roles: "admin" | "manager" | "base"
      custom_field_models: "leads" | "jobs"
      custom_field_types: "text" | "date" | "number" | "select"
      job_payment_types: "cash" | "credit" | "finance"
      job_roles:
        | "setter"
        | "installer"
        | "closer"
        | "project_manager"
        | "crew_lead"
      location_job_status:
        | "new"
        | "scheduled"
        | "pending"
        | "approved"
        | "billed"
        | "canceled"
        | "complete"
      location_profile_roles: "admin" | "manager" | "base"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

