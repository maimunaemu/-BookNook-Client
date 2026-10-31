export const bookCategories = ["Fiction", "Science", "History", "Kids", "Others"] as const;
export type BookCategory = (typeof bookCategories)[number];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  description: string;
  coverImage: string;
  totalCopies: number;
  availableCopies: number;
  ownerId?: string;
  ownerName: string;
  ownerEmail?: string;
  addedAt: string;
  createdAt: string;
}

export interface Borrow {
  id: string;
  bookId: string;
  borrowedAt: string;
  dueAt: string;
  book: Book | null;
}
