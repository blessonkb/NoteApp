export interface Note {
  _id: string; // Changed from id: number
  title: string;
  content: string;
  categoryId: string; // Changed from category: string
  createdAt?: string; // Mongoose timestamp
  updatedAt?: string;
}

export interface Category {
  _id: string;
  categoryName: string;
  description?: string;
}
