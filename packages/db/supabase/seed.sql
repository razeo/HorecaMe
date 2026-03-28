-- HorecaMe Seed Data
-- Run after 001_initial_schema.sql

-- =============================================
-- TAX RULES
-- =============================================
INSERT INTO tax_rules (name, rate, is_default, country) VALUES
  ('PDV Standard', 21.00, true, 'ME'),
  ('PDV Reduced', 7.00, false, 'ME')
ON CONFLICT DO NOTHING;

-- =============================================
-- CATEGORIES (Top-level)
-- =============================================
INSERT INTO categories (id, slug, sort_order, icon) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'food', 1, 'UtensilsCrossed'),
  ('a1000000-0000-0000-0000-000000000002', 'beverages', 2, 'Wine'),
  ('a1000000-0000-0000-0000-000000000003', 'equipment', 3, 'Refrigerator'),
  ('a1000000-0000-0000-0000-000000000004', 'disposables', 4, 'Package'),
  ('a1000000-0000-0000-0000-000000000005', 'furniture', 5, 'Armchair'),
  ('a1000000-0000-0000-0000-000000000006', 'cleaning', 6, 'SprayCan')
ON CONFLICT (slug) DO NOTHING;

-- Category translations - Montenegrin
INSERT INTO category_translations (category_id, lang, name, description) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'me', 'Hrana', 'Sveže meso, mlečni proizvodi, zamrznuta hrana i ostalo'),
  ('a1000000-0000-0000-0000-000000000002', 'me', 'Pića', 'Alkoholna i bezalkoholna pića, kafa, čajevi'),
  ('a1000000-0000-0000-0000-000000000003', 'me', 'Oprema', 'Kuhinjska oprema, bar oprema, rashladni uređaji'),
  ('a1000000-0000-0000-0000-000000000004', 'me', 'Potrošni materijal', 'Pakovanja, posuđe za jednokratnu upotrebu, higijena'),
  ('a1000000-0000-0000-0000-000000000005', 'me', 'Nameštaj', 'Stolice, stolovi, baštenski nameštaj, rasveta'),
  ('a1000000-0000-0000-0000-000000000006', 'me', 'Čišćenje', 'Deterdženti, sanitarni proizvodi, oprema za čišćenje')
ON CONFLICT (category_id, lang) DO NOTHING;

-- Category translations - English
INSERT INTO category_translations (category_id, lang, name, description) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'en', 'Food', 'Fresh produce, meat, dairy, frozen food and more'),
  ('a1000000-0000-0000-0000-000000000002', 'en', 'Beverages', 'Alcoholic and non-alcoholic drinks, coffee, teas'),
  ('a1000000-0000-0000-0000-000000000003', 'en', 'Equipment', 'Kitchen equipment, bar equipment, refrigeration'),
  ('a1000000-0000-0000-0000-000000000004', 'en', 'Disposables', 'Packaging, disposable tableware, hygiene products'),
  ('a1000000-0000-0000-0000-000000000005', 'en', 'Furniture', 'Chairs, tables, outdoor furniture, lighting'),
  ('a1000000-0000-0000-0000-000000000006', 'en', 'Cleaning', 'Detergents, sanitizers, cleaning equipment')
ON CONFLICT (category_id, lang) DO NOTHING;

-- =============================================
-- SUBCATEGORIES
-- =============================================
INSERT INTO categories (parent_id, slug, sort_order) VALUES
  -- Food subcategories
  ('a1000000-0000-0000-0000-000000000001', 'fresh-produce', 1),
  ('a1000000-0000-0000-0000-000000000001', 'meat-poultry', 2),
  ('a1000000-0000-0000-0000-000000000001', 'seafood', 3),
  ('a1000000-0000-0000-0000-000000000001', 'dairy', 4),
  ('a1000000-0000-0000-0000-000000000001', 'frozen', 5),
  ('a1000000-0000-0000-0000-000000000001', 'dry-goods', 6),
  ('a1000000-0000-0000-0000-000000000001', 'condiments-spices', 7),
  -- Beverages subcategories
  ('a1000000-0000-0000-0000-000000000002', 'alcoholic', 1),
  ('a1000000-0000-0000-0000-000000000002', 'non-alcoholic', 2),
  ('a1000000-0000-0000-0000-000000000002', 'coffee-tea', 3),
  ('a1000000-0000-0000-0000-000000000002', 'water-juice', 4),
  -- Equipment subcategories
  ('a1000000-0000-0000-0000-000000000003', 'kitchen-equipment', 1),
  ('a1000000-0000-0000-0000-000000000003', 'bar-equipment', 2),
  ('a1000000-0000-0000-0000-000000000003', 'refrigeration', 3),
  ('a1000000-0000-0000-0000-000000000003', 'ovens-grills', 4),
  ('a1000000-0000-0000-0000-000000000003', 'dishwashers', 5)
ON CONFLICT (slug) DO NOTHING;

-- Subcategory translations - Montenegrin
INSERT INTO category_translations (category_id, lang, name)
SELECT c.id, 'me', CASE c.slug
  WHEN 'fresh-produce' THEN 'Sveže voće i povrće'
  WHEN 'meat-poultry' THEN 'Meso i perad'
  WHEN 'seafood' THEN 'Plodovi mora'
  WHEN 'dairy' THEN 'Mlečni proizvodi'
  WHEN 'frozen' THEN 'Zamrznuta hrana'
  WHEN 'dry-goods' THEN 'Suvi proizvodi'
  WHEN 'condiments-spices' THEN 'Začini i dodaci'
  WHEN 'alcoholic' THEN 'Alkoholna pića'
  WHEN 'non-alcoholic' THEN 'Bezalkoholna pića'
  WHEN 'coffee-tea' THEN 'Kafa i čaj'
  WHEN 'water-juice' THEN 'Voda i sokovi'
  WHEN 'kitchen-equipment' THEN 'Kuhinjska oprema'
  WHEN 'bar-equipment' THEN 'Bar oprema'
  WHEN 'refrigeration' THEN 'Rashladni uređaji'
  WHEN 'ovens-grills' THEN 'Rerne i roštilji'
  WHEN 'dishwashers' THEN 'Mašine za pranje sudova'
END
FROM categories c
WHERE c.parent_id IS NOT NULL
ON CONFLICT (category_id, lang) DO NOTHING;

-- Subcategory translations - English
INSERT INTO category_translations (category_id, lang, name)
SELECT c.id, 'en', CASE c.slug
  WHEN 'fresh-produce' THEN 'Fresh Produce'
  WHEN 'meat-poultry' THEN 'Meat & Poultry'
  WHEN 'seafood' THEN 'Seafood'
  WHEN 'dairy' THEN 'Dairy'
  WHEN 'frozen' THEN 'Frozen Food'
  WHEN 'dry-goods' THEN 'Dry Goods'
  WHEN 'condiments-spices' THEN 'Condiments & Spices'
  WHEN 'alcoholic' THEN 'Alcoholic Beverages'
  WHEN 'non-alcoholic' THEN 'Non-Alcoholic Beverages'
  WHEN 'coffee-tea' THEN 'Coffee & Tea'
  WHEN 'water-juice' THEN 'Water & Juices'
  WHEN 'kitchen-equipment' THEN 'Kitchen Equipment'
  WHEN 'bar-equipment' THEN 'Bar Equipment'
  WHEN 'refrigeration' THEN 'Refrigeration'
  WHEN 'ovens-grills' THEN 'Ovens & Grills'
  WHEN 'dishwashers' THEN 'Dishwashers'
END
FROM categories c
WHERE c.parent_id IS NOT NULL
ON CONFLICT (category_id, lang) DO NOTHING;

-- =============================================
-- SAMPLE COMPANIES
-- =============================================
INSERT INTO companies (id, name, slug, company_type, city, country, is_verified, description) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'MonteFood d.o.o.', 'montefood', 'supplier', 'Podgorica', 'ME', true, 'Vodeći distributer hrane u Crnoj Gori'),
  ('b1000000-0000-0000-0000-000000000002', 'Adriatic Drinks', 'adriatic-drinks', 'supplier', 'Budva', 'ME', true, 'Premium alkoholna i bezalkoholna pića'),
  ('b1000000-0000-0000-0000-000000000003', 'GastroTech CG', 'gastrotech-cg', 'supplier', 'Podgorica', 'ME', false, 'Profesionalna kuhinjska oprema'),
  ('b1000000-0000-0000-0000-000000000004', 'Hotel Splendid', 'hotel-splendid', 'buyer', 'Budva', 'ME', true, 'Luksuzni hotel na budvanskoj rivijeri')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SAMPLE PRODUCTS
-- =============================================

-- MonteFood products
INSERT INTO products (id, company_id, category_id, slug, unit, base_price, moq, stock_status) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', (SELECT id FROM categories WHERE slug = 'olive-oil' LIMIT 1), 'ekstradevicansko-ulje-5l', 'kom', 45.00, 5, 'in_stock'),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', (SELECT id FROM categories WHERE slug = 'meat-poultry' LIMIT 1), 'pileci-file-10kg', 'kg', 8.50, 10, 'in_stock'),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', (SELECT id FROM categories WHERE slug = 'dairy' LIMIT 1), 'sir-mladenovac-1kg', 'kg', 12.00, 5, 'in_stock')
ON CONFLICT (company_id, slug) DO NOTHING;

-- Adriatic Drinks products
INSERT INTO products (id, company_id, category_id, slug, unit, base_price, moq, stock_status) VALUES
  ('c2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', (SELECT id FROM categories WHERE slug = 'alcoholic' LIMIT 1), 'vranac-pro-corde-0.75l', 'kom', 8.90, 12, 'in_stock'),
  ('c2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', (SELECT id FROM categories WHERE slug = 'alcoholic' LIMIT 1), 'niksicko-pivo-0.5l', 'kom', 1.20, 24, 'in_stock'),
  ('c2000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', (SELECT id FROM categories WHERE slug = 'water-juice' LIMIT 1), 'rosa-voda-1.5l', 'kom', 0.60, 24, 'in_stock')
ON CONFLICT (company_id, slug) DO NOTHING;

-- GastroTech products
INSERT INTO products (id, company_id, category_id, slug, unit, base_price, moq, stock_status) VALUES
  ('c3000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', (SELECT id FROM categories WHERE slug = 'kitchen-equipment' LIMIT 1), 'konvektomat-rational-6-1', 'kom', 12500.00, 1, 'on_order'),
  ('c3000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', (SELECT id FROM categories WHERE slug = 'refrigeration' LIMIT 1), 'hladnjak-gastro-400l', 'kom', 2800.00, 1, 'in_stock')
ON CONFLICT (company_id, slug) DO NOTHING;

-- Product translations - Montenegrin
INSERT INTO product_translations (product_id, lang, name, description) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'me', 'Ekstradjevičansko maslinovo ulje 5L', 'Visokokvalitetno crnogorsko maslinovo ulje iz Ulcinja'),
  ('c1000000-0000-0000-0000-000000000002', 'me', 'Pileći file 10kg', 'Svježi pileći file, pakovanje 10kg'),
  ('c1000000-0000-0000-0000-000000000003', 'me', 'Sir Mladenovac 1kg', 'Tradicionalni crnogorski sir'),
  ('c2000000-0000-0000-0000-000000000001', 'me', 'Vranac Pro Corde 0.75L', 'Vrhunsko crnogorsko crveno vino'),
  ('c2000000-0000-0000-0000-000000000002', 'me', 'Nikšićko pivo 0.5L', 'Nacionalno crnogorsko pivo'),
  ('c2000000-0000-0000-0000-000000000003', 'me', 'Rosa voda 1.5L', 'Prirodna mineralna voda'),
  ('c3000000-0000-0000-0000-000000000001', 'me', 'Konvektomat Rational iCombi 6-1/1', 'Profesionalni konvektomat za restorane'),
  ('c3000000-0000-0000-0000-000000000002', 'me', 'Gastro hladnjak 400L', 'Profesionalni hladnjak za ugostiteljstvo')
ON CONFLICT (product_id, lang) DO NOTHING;

-- Product translations - English
INSERT INTO product_translations (product_id, lang, name, description) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'en', 'Extra Virgin Olive Oil 5L', 'High quality Montenegrin olive oil from Ulcinj'),
  ('c1000000-0000-0000-0000-000000000002', 'en', 'Chicken Fillet 10kg', 'Fresh chicken fillet, 10kg pack'),
  ('c1000000-0000-0000-0000-000000000003', 'en', 'Mladenovac Cheese 1kg', 'Traditional Montenegrin cheese'),
  ('c2000000-0000-0000-0000-000000000001', 'en', 'Vranac Pro Corde 0.75L', 'Premium Montenegrin red wine'),
  ('c2000000-0000-0000-0000-000000000002', 'en', 'Nikšićko Beer 0.5L', 'National Montenegrin beer'),
  ('c2000000-0000-0000-0000-000000000003', 'en', 'Rosa Water 1.5L', 'Natural mineral water'),
  ('c3000000-0000-0000-0000-000000000001', 'en', 'Rational iCombi Convection Oven 6-1/1', 'Professional convection oven for restaurants'),
  ('c3000000-0000-0000-0000-000000000002', 'en', 'Gastro Refrigerator 400L', 'Professional refrigerator for hospitality')
ON CONFLICT (product_id, lang) DO NOTHING;

-- Tiered pricing
INSERT INTO tiered_pricing (product_id, min_quantity, max_quantity, price) VALUES
  ('c1000000-0000-0000-0000-000000000001', 5, 19, 45.00),
  ('c1000000-0000-0000-0000-000000000001', 20, 49, 42.00),
  ('c1000000-0000-0000-0000-000000000001', 50, NULL, 38.00),
  ('c2000000-0000-0000-0000-000000000001', 12, 23, 8.90),
  ('c2000000-0000-0000-0000-000000000001', 24, 47, 8.20),
  ('c2000000-0000-0000-0000-000000000001', 48, NULL, 7.50),
  ('c2000000-0000-0000-0000-000000000002', 24, 47, 1.20),
  ('c2000000-0000-0000-0000-000000000002', 48, 95, 1.10),
  ('c2000000-0000-0000-0000-000000000002', 96, NULL, 1.00)
ON CONFLICT DO NOTHING;
