export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author: string
          content: string
          created_at: string
          id: string
          name: string
          post_id: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          id?: string
          name: string
          post_id: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          id?: string
          name?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      pages: {
        Row: {
          id: string
          slug: string
          title: string
          content: string | null
          last_updated: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content?: string | null
          last_updated?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string | null
          last_updated?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string | null
          published: boolean | null
          date: string | null
          author: string
          image: string | null
          category_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          published?: boolean | null
          date?: string | null
          author: string
          image?: string | null
          category_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          published?: boolean | null
          date?: string | null
          author?: string
          image?: string | null
          category_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]