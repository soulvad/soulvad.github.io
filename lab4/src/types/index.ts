export interface Review {
  id: string;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
} 