import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating?: number;
  reviews?: Review[];
}

export interface Review {
  id?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  date: string;
  status: string;
}

export const tourService = {
  // Отримати всі тури
  async getAllTours(): Promise<Tour[]> {
    const toursCollection = collection(db, 'tours');
    const toursSnapshot = await getDocs(toursCollection);
    return toursSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tour));
  },

  // Отримати тур за ID
  async getTourById(id: string): Promise<Tour | null> {
    const tourDoc = await getDoc(doc(db, 'tours', id));
    if (tourDoc.exists()) {
      return {
        id: tourDoc.id,
        ...tourDoc.data()
      } as Tour;
    }
    return null;
  },

  // Додати новий тур
  async addTour(tour: Omit<Tour, 'id'>): Promise<string> {
    const toursCollection = collection(db, 'tours');
    const docRef = await addDoc(toursCollection, tour);
    return docRef.id;
  },

  // Оновити тур
  async updateTour(id: string, tour: Partial<Tour>): Promise<void> {
    const tourRef = doc(db, 'tours', id);
    await updateDoc(tourRef, tour);
  },

  // Видалити тур
  async deleteTour(id: string): Promise<void> {
    const tourRef = doc(db, 'tours', id);
    await deleteDoc(tourRef);
  },

  // Додати відгук до туру
  async addReview(tourId: string, review: Omit<Review, 'id'>): Promise<void> {
    const tourRef = doc(db, 'tours', tourId);
    const tourDoc = await getDoc(tourRef);
    
    if (tourDoc.exists()) {
      const tour = tourDoc.data() as Tour;
      const reviews = tour.reviews || [];
      reviews.push(review);
      
      // Оновлюємо середній рейтинг
      const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
      
      await updateDoc(tourRef, {
        reviews,
        rating: avgRating
      });
    }
  },

  // Отримати тури за місцем розташування
  async getToursByLocation(location: string): Promise<Tour[]> {
    const toursCollection = collection(db, 'tours');
    const q = query(toursCollection, where('location', '==', location));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tour));
  },

  // Додати бронювання
  async addBooking(tourId: string, userId: string): Promise<string> {
    const existingBookingsQuery = query(
      collection(db, 'bookings'),
      where('tourId', '==', tourId),
      where('userId', '==', userId)
    );
    const existingBookings = await getDocs(existingBookingsQuery);
    
    if (!existingBookings.empty) {
      throw new Error('Ви вже забронювали цей тур');
    }

    const bookingsCollection = collection(db, 'bookings');
    const booking = {
      tourId,
      userId,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    try {
      const docRef = await addDoc(bookingsCollection, booking);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Отримати бронювання користувача
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', userId)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      const bookings = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: doc.data().status as 'pending' | 'confirmed' | 'cancelled'
      } as Booking));
      
      return bookings;
    } catch (error) {
      throw error;
    }
  },

  // Скасувати бронювання
  async cancelBooking(bookingId: string): Promise<void> {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);
    } catch (error) {
      throw error;
    }
  }
}; 