export const DEFAULT_LOCALE = 'me' as const;

export const SUPPORTED_LOCALES = ['me', 'en'] as const;

export const LOCALE_NAMES: Record<string, string> = {
  me: 'Crnogorski',
  en: 'English',
};

export const DEFAULT_CURRENCY = 'EUR';

export const TAX_RATES = {
  standard: 21,
  reduced: 7,
} as const;

export const HORECA_CATEGORIES = [
  {
    slug: 'food',
    icon: 'UtensilsCrossed',
    children: ['fresh-produce', 'meat-poultry', 'seafood', 'dairy', 'frozen', 'dry-goods', 'condiments-spices'],
  },
  {
    slug: 'beverages',
    icon: 'Wine',
    children: ['alcoholic', 'non-alcoholic', 'coffee-tea', 'water-juice'],
  },
  {
    slug: 'equipment',
    icon: 'Refrigerator',
    children: ['kitchen-equipment', 'bar-equipment', 'refrigeration', 'ovens-grills', 'dishwashers'],
  },
  {
    slug: 'disposables',
    icon: 'Package',
    children: ['packaging', 'tableware', 'cleaning-supplies', 'hygiene'],
  },
  {
    slug: 'furniture',
    icon: 'Armchair',
    children: ['tables', 'chairs', 'outdoor', 'bar-furniture', 'lighting'],
  },
  {
    slug: 'cleaning',
    icon: 'SprayCan',
    children: ['detergents', 'sanitizers', 'equipment-cleaning', 'waste-management'],
  },
] as const;

export const UNITS = [
  { value: 'kom', label: 'piece' },
  { value: 'kg', label: 'kilogram' },
  { value: 'l', label: 'liter' },
  { value: 'pak', label: 'package' },
  { value: 'kut', label: 'box' },
  { value: 'g', label: 'gram' },
  { value: 'ml', label: 'milliliter' },
  { value: 'kom_set', label: 'set' },
] as const;

export const DEFAULT_MOQ = 1;

export const RFQ_VALID_DAYS = 7;

export const MAX_UPLOAD_SIZE_MB = 10;

export const PRODUCTS_PER_PAGE = 24;

export const INQUIRIES_PER_PAGE = 20;
