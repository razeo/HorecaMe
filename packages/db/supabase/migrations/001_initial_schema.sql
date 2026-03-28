-- HorecaMe Database Schema
-- Run this in Supabase SQL Editor or via supabase CLI

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- COMPANIES
-- =============================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  company_type TEXT NOT NULL CHECK (company_type IN ('buyer', 'supplier', 'both')),
  tax_id TEXT,
  registration_number TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'ME',
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- PROFILES (linked to auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  phone TEXT,
  avatar_url TEXT,
  preferred_lang TEXT DEFAULT 'me' CHECK (preferred_lang IN ('me', 'en')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- CATEGORIES (hierarchical)
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INT DEFAULT 0,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS category_translations (
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  lang TEXT CHECK (lang IN ('me', 'en')),
  name TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (category_id, lang)
);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sku TEXT,
  slug TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kom',
  base_price NUMERIC(12,2),
  currency TEXT DEFAULT 'EUR',
  moq NUMERIC(10,2) DEFAULT 1,
  stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock', 'on_order')),
  images JSONB DEFAULT '[]',
  attributes JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, slug)
);

CREATE TABLE IF NOT EXISTS product_translations (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  lang TEXT CHECK (lang IN ('me', 'en')),
  name TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (product_id, lang)
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT,
  variant_name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  moq NUMERIC(10,2) DEFAULT 1,
  stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock', 'on_order')),
  attributes JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS tiered_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  min_quantity NUMERIC(10,2) NOT NULL,
  max_quantity NUMERIC(10,2),
  price NUMERIC(12,2) NOT NULL,
  CHECK (
    (product_id IS NOT NULL AND variant_id IS NULL) OR
    (product_id IS NULL AND variant_id IS NOT NULL)
  )
);

-- =============================================
-- TAX RULES
-- =============================================
CREATE TABLE IF NOT EXISTS tax_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rate NUMERIC(5,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  is_default BOOLEAN DEFAULT false,
  country TEXT DEFAULT 'ME',
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE
);

-- =============================================
-- INQUIRY ENGINE
-- =============================================
CREATE TABLE IF NOT EXISTS inquiry_baskets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES companies(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'partially_responded', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  basket_id UUID NOT NULL REFERENCES inquiry_baskets(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  supplier_id UUID NOT NULL REFERENCES companies(id),
  quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS supplier_rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  basket_id UUID NOT NULL REFERENCES inquiry_baskets(id),
  supplier_id UUID NOT NULL REFERENCES companies(id),
  buyer_id UUID NOT NULL REFERENCES companies(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'quoted', 'accepted', 'rejected', 'expired')),
  total_amount NUMERIC(12,2),
  valid_until TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rfq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES supplier_rfqs(id) ON DELETE CASCADE,
  inquiry_item_id UUID NOT NULL REFERENCES inquiry_items(id),
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  requested_qty NUMERIC(10,2) NOT NULL,
  quoted_price NUMERIC(12,2),
  quoted_qty NUMERIC(10,2),
  lead_time_days INT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'rejected', 'partial')),
  supplier_notes TEXT
);

-- =============================================
-- CONTENT HUB
-- =============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id),
  post_type TEXT NOT NULL CHECK (post_type IN ('blog', 'news')),
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT,
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  reading_time_min INT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_translations (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  lang TEXT CHECK (lang IN ('me', 'en')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  PRIMARY KEY (post_id, lang)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_company ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_product_translations_name ON product_translations USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_inquiry_items_basket ON inquiry_items(basket_id);
CREATE INDEX ON inquiry_items(supplier_id);
CREATE INDEX ON supplier_rfqs(supplier_id);
CREATE INDEX ON supplier_rfqs(buyer_id);
CREATE INDEX ON supplier_rfqs(status);
CREATE INDEX ON rfq_items(rfq_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiered_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_baskets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rules ENABLE ROW LEVEL SECURITY;

-- Companies: public read, authenticated edit own
CREATE POLICY "Public can view companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Users can update own company" ON companies FOR UPDATE USING (
  id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- Profiles: users read own, company members read each other
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Products: public read active, suppliers CRUD own
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Suppliers can manage own products" ON products FOR ALL USING (
  company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- Product translations: follow product policies
CREATE POLICY "Public can view product translations" ON product_translations FOR SELECT USING (true);
CREATE POLICY "Suppliers can manage own product translations" ON product_translations FOR ALL USING (
  product_id IN (
    SELECT id FROM products WHERE company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  )
);

-- Product variants: follow product policies
CREATE POLICY "Public can view product variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Suppliers can manage own product variants" ON product_variants FOR ALL USING (
  product_id IN (
    SELECT id FROM products WHERE company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  )
);

-- Tiered pricing: follow product policies
CREATE POLICY "Public can view tiered pricing" ON tiered_pricing FOR SELECT USING (true);
CREATE POLICY "Suppliers can manage own tiered pricing" ON tiered_pricing FOR ALL USING (
  product_id IN (
    SELECT id FROM products WHERE company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  )
);

-- Inquiry baskets: buyer manages own
CREATE POLICY "Buyers can manage own baskets" ON inquiry_baskets FOR ALL USING (
  buyer_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- Inquiry items: follow basket policies
CREATE POLICY "Buyers can manage own inquiry items" ON inquiry_items FOR ALL USING (
  basket_id IN (
    SELECT id FROM inquiry_baskets WHERE buyer_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  )
);

-- Supplier RFQs: supplier reads own, buyer reads own
CREATE POLICY "Suppliers can view own RFQs" ON supplier_rfqs FOR SELECT USING (
  supplier_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Buyers can view own RFQs" ON supplier_rfqs FOR SELECT USING (
  buyer_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Suppliers can update own RFQs" ON supplier_rfqs FOR UPDATE USING (
  supplier_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- RFQ items: follow RFQ policies
CREATE POLICY "Users can view related rfq items" ON rfq_items FOR SELECT USING (
  rfq_id IN (
    SELECT id FROM supplier_rfqs
    WHERE supplier_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
       OR buyer_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  )
);
CREATE POLICY "Suppliers can update rfq items" ON rfq_items FOR UPDATE USING (
  rfq_id IN (
    SELECT id FROM supplier_rfqs WHERE supplier_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
  )
);

-- Categories: public read
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view category translations" ON category_translations FOR SELECT USING (true);

-- Tax rules: public read
CREATE POLICY "Public can view tax rules" ON tax_rules FOR SELECT USING (true);

-- Posts: public read published
CREATE POLICY "Public can view published posts" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view post translations" ON post_translations FOR SELECT USING (true);

-- =============================================
-- FUNCTIONS
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, preferred_lang)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'), 'me');

  -- Create company if company_name is provided
  IF NEW.raw_user_meta_data->>'company_name' IS NOT NULL THEN
    INSERT INTO companies (name, slug, company_type)
    VALUES (
      NEW.raw_user_meta_data->>'company_name',
      LOWER(REPLACE(NEW.raw_user_meta_data->>'company_name', ' ', '-')) || '-' || SUBSTRING(NEW.id::text, 1, 8),
      COALESCE(NEW.raw_user_meta_data->>'company_type', 'buyer')
    );

    UPDATE profiles
    SET company_id = (SELECT id FROM companies WHERE slug = LOWER(REPLACE(NEW.raw_user_meta_data->>'company_name', ' ', '-')) || '-' || SUBSTRING(NEW.id::text, 1, 8) LIMIT 1)
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_inquiry_baskets_updated_at ON inquiry_baskets;
CREATE TRIGGER update_inquiry_baskets_updated_at BEFORE UPDATE ON inquiry_baskets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
