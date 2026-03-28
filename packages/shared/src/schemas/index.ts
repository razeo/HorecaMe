import { z } from 'zod';

export const SupportedLangSchema = z.enum(['me', 'en']);

export const CompanyTypeSchema = z.enum(['buyer', 'supplier', 'both']);

export const UserRoleSchema = z.enum(['owner', 'admin', 'member', 'viewer']);

export const StockStatusSchema = z.enum(['in_stock', 'low_stock', 'out_of_stock', 'on_order']);

export const InquiryBasketStatusSchema = z.enum([
  'draft',
  'submitted',
  'partially_responded',
  'completed',
  'cancelled',
]);

export const RFQStatusSchema = z.enum(['pending', 'viewed', 'quoted', 'accepted', 'rejected', 'expired']);

export const RFQItemStatusSchema = z.enum(['pending', 'quoted', 'accepted', 'rejected', 'partial']);

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(24),
});

export const SortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).default('asc'),
});

export const ProductCreateSchema = z.object({
  category_id: z.string().uuid().optional(),
  sku: z.string().optional(),
  slug: z.string().min(1).max(200),
  unit: z.string().default('kom'),
  base_price: z.number().positive().optional(),
  currency: z.string().default('EUR'),
  moq: z.number().positive().default(1),
  stock_status: StockStatusSchema.default('in_stock'),
  images: z.array(z.string().url()).default([]),
  attributes: z.record(z.unknown()).default({}),
  translations: z.object({
    me: z.object({ name: z.string().min(1), description: z.string().optional() }),
    en: z.object({ name: z.string().min(1), description: z.string().optional() }),
  }),
});

export const InquiryItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().optional(),
  quantity: z.number().positive(),
  notes: z.string().optional(),
});

export const RFQResponseItemSchema = z.object({
  rfq_item_id: z.string().uuid(),
  quoted_price: z.number().positive(),
  quoted_qty: z.number().positive(),
  lead_time_days: z.number().int().nonnegative().optional(),
  status: z.enum(['quoted', 'rejected', 'partial']),
  supplier_notes: z.string().optional(),
});

export const CSVProductRowSchema = z.object({
  name_me: z.string().min(1, 'Montenegrin name is required'),
  name_en: z.string().min(1, 'English name is required'),
  description_me: z.string().optional().default(''),
  description_en: z.string().optional().default(''),
  sku: z.string().optional().default(''),
  category_slug: z.string().optional().default(''),
  unit: z.string().default('kom'),
  base_price: z.coerce.number().positive('Price must be positive'),
  moq: z.coerce.number().positive().default(1),
  stock_status: StockStatusSchema.default('in_stock'),
});
