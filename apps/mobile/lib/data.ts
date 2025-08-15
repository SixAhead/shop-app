export const CATEGORIES = [
  { slug: 'books', name: 'Books', parent: null },
  { slug: 'crystals', name: 'Crystals', parent: null },
  { slug: 'fiction', name: 'Fiction', parent: 'books' },
  { slug: 'non-fiction', name: 'Non-Fiction', parent: 'books' },
  { slug: 'healing', name: 'Healing Crystals', parent: 'crystals' },
  { slug: 'decor', name: 'Crystal Decor', parent: 'crystals' },
];

export const PRODUCTS = [
  { id: '1', title: 'The Hobbit', priceCents: 1299, category: 'fiction' },
  { id: '2', title: 'Atomic Habits', priceCents: 1599, category: 'non-fiction' },
  { id: '3', title: 'Rose Quartz', priceCents: 799, category: 'healing' },
  { id: '4', title: 'Amethyst Geode', priceCents: 4599, category: 'decor' },
];

export const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;
