export interface TextBlock {
  id: number;
  text: string;
  type: string;
  order: number;
  docId: number;
  createdAt: string;
  updatedAt: string | null; // Allow null for updatedAt
} 