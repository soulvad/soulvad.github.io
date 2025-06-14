export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  duration: string;
  rating?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Review {
  id: string;
  tourId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
  userName: string;
} 