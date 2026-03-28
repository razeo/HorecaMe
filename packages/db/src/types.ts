export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          company_type: 'buyer' | 'supplier' | 'both';
          tax_id: string | null;
          registration_number: string | null;
          address: string | null;
          city: string | null;
          country: string;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          description: string | null;
          is_verified: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          company_id: string | null;
          full_name: string;
          role: 'owner' | 'admin' | 'member' | 'viewer';
          phone: string | null;
          avatar_url: string | null;
          preferred_lang: 'me' | 'en';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          slug: string;
          sort_order: number;
          icon: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      category_translations: {
        Row: {
          category_id: string;
          lang: 'me' | 'en';
          name: string;
          description: string | null;
        };
        Insert: Database['public']['Tables']['category_translations']['Row'];
        Update: Partial<Database['public']['Tables']['category_translations']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          company_id: string;
          category_id: string | null;
          sku: string | null;
          slug: string;
          unit: string;
          base_price: number | null;
          currency: string;
          moq: number;
          stock_status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order';
          images: Json;
          attributes: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      product_translations: {
        Row: {
          product_id: string;
          lang: 'me' | 'en';
          name: string;
          description: string | null;
        };
        Insert: Database['public']['Tables']['product_translations']['Row'];
        Update: Partial<Database['public']['Tables']['product_translations']['Insert']>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string | null;
          variant_name: string;
          price: number;
          moq: number;
          stock_status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order';
          attributes: Json;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>;
      };
      tiered_pricing: {
        Row: {
          id: string;
          product_id: string | null;
          variant_id: string | null;
          min_quantity: number;
          max_quantity: number | null;
          price: number;
        };
        Insert: Omit<Database['public']['Tables']['tiered_pricing']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['tiered_pricing']['Insert']>;
      };
      tax_rules: {
        Row: {
          id: string;
          name: string;
          rate: number;
          category_id: string | null;
          is_default: boolean;
          country: string;
          effective_from: string;
          effective_to: string | null;
        };
        Insert: Omit<Database['public']['Tables']['tax_rules']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['tax_rules']['Insert']>;
      };
      inquiry_baskets: {
        Row: {
          id: string;
          buyer_id: string;
          status: 'draft' | 'submitted' | 'partially_responded' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['inquiry_baskets']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['inquiry_baskets']['Insert']>;
      };
      inquiry_items: {
        Row: {
          id: string;
          basket_id: string;
          product_id: string;
          variant_id: string | null;
          supplier_id: string;
          quantity: number;
          unit_price: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['inquiry_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['inquiry_items']['Insert']>;
      };
      supplier_rfqs: {
        Row: {
          id: string;
          basket_id: string;
          supplier_id: string;
          buyer_id: string;
          status: 'pending' | 'viewed' | 'quoted' | 'accepted' | 'rejected' | 'expired';
          total_amount: number | null;
          valid_until: string | null;
          responded_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['supplier_rfqs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['supplier_rfqs']['Insert']>;
      };
      rfq_items: {
        Row: {
          id: string;
          rfq_id: string;
          inquiry_item_id: string;
          product_id: string;
          variant_id: string | null;
          requested_qty: number;
          quoted_price: number | null;
          quoted_qty: number | null;
          lead_time_days: number | null;
          status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'partial';
          supplier_notes: string | null;
        };
        Insert: Omit<Database['public']['Tables']['rfq_items']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['rfq_items']['Insert']>;
      };
      posts: {
        Row: {
          id: string;
          author_id: string | null;
          post_type: 'blog' | 'news';
          slug: string;
          cover_image: string | null;
          category_id: string | null;
          status: 'draft' | 'published' | 'archived';
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[] | null;
          reading_time_min: number | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
      };
      post_translations: {
        Row: {
          post_id: string;
          lang: 'me' | 'en';
          title: string;
          excerpt: string | null;
          content: string;
        };
        Insert: Database['public']['Tables']['post_translations']['Row'];
        Update: Partial<Database['public']['Tables']['post_translations']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
