import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          avatar: string | null;
          phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: string;
          avatar?: string | null;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          avatar?: string | null;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image: string | null;
          is_active: boolean;
          preparation_time: number;
          ingredients: string[];
          allergens: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image?: string | null;
          is_active?: boolean;
          preparation_time: number;
          ingredients: string[];
          allergens: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          image?: string | null;
          is_active?: boolean;
          preparation_time?: number;
          ingredients?: string[];
          allergens?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          number: string;
          type: string;
          status: string;
          table_id: string | null;
          customer_id: string | null;
          waiter_id: string | null;
          subtotal: number;
          discount: number;
          tax: number;
          total: number;
          payment_method: string | null;
          payment_status: string;
          notes: string | null;
          estimated_time: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          type: string;
          status: string;
          table_id?: string | null;
          customer_id?: string | null;
          waiter_id?: string | null;
          subtotal: number;
          discount: number;
          tax: number;
          total: number;
          payment_method?: string | null;
          payment_status: string;
          notes?: string | null;
          estimated_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          type?: string;
          status?: string;
          table_id?: string | null;
          customer_id?: string | null;
          waiter_id?: string | null;
          subtotal?: number;
          discount?: number;
          tax?: number;
          total?: number;
          payment_method?: string | null;
          payment_status?: string;
          notes?: string | null;
          estimated_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};