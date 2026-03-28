export type SupportedLang = 'me' | 'en';

export type CompanyType = 'buyer' | 'supplier' | 'both';

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order';

export type InquiryBasketStatus = 'draft' | 'submitted' | 'partially_responded' | 'completed' | 'cancelled';

export type RFQStatus = 'pending' | 'viewed' | 'quoted' | 'accepted' | 'rejected' | 'expired';

export type RFQItemStatus = 'pending' | 'quoted' | 'accepted' | 'rejected' | 'partial';

export type PostType = 'blog' | 'news';

export type PostStatus = 'draft' | 'published' | 'archived';

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  filters?: Record<string, unknown>;
}
