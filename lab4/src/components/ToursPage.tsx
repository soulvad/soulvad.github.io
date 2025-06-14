import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Tour } from '../types';
import TourCard from './TourCard';
import { useAuth } from '../context/AuthContext';
import { tourService } from '../services/tourService';
import Map from './Map';

const ToursContainer = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h2`
  color: #37475a;
  margin-bottom: 2rem;
  text-align: center;
`;

const ToursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  margin: 2rem 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #dc3545;
  font-size: 1.2rem;
  margin: 2rem 0;
`;

const SortButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 20px;
  margin-left: auto;
  display: block;
  transition: background-color 0.3s;
  font-size: 1rem;

  &:hover {
    background-color: #357abd;
  }
`;

const ToursPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sorted, setSorted] = useState(false);
  const { currentUser } = useAuth();

  const fetchData = async () => {
    try {
      const [toursList, userBookings] = await Promise.all([
        tourService.getAllTours(),
        currentUser ? tourService.getUserBookings(currentUser.uid) : []
      ]);
      
      setTours(toursList);
      setBookings(userBookings.map(booking => booking.tourId));
    } catch (err) {
      setError('Помилка завантаження даних');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleBook = async (tourId: string) => {
    if (!currentUser) {
      setError('Будь ласка, увійдіть в систему для бронювання');
      return;
    }

    try {
      if (bookings.includes(tourId)) {
        // Якщо тур вже заброньований, скасовуємо бронювання
        const userBookings = await tourService.getUserBookings(currentUser.uid);
        const bookingToCancel = userBookings.find(booking => booking.tourId === tourId);
        if (bookingToCancel) {
          await tourService.cancelBooking(bookingToCancel.id);
        }
      } else {
        // Якщо тур не заброньований, створюємо нове бронювання
        await tourService.addBooking(tourId, currentUser.uid);
      }
      await fetchData();
    } catch (err) {
      setError('Помилка при бронюванні туру');
    }
  };

  const handleSortByPrice = () => {
    setTours(prev => {
      const sortedTours = [...prev].sort((a, b) => a.price - b.price);
      return sortedTours;
    });
    setSorted(true);
  };

  if (loading) {
    return <LoadingMessage>Завантаження турів...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <ToursContainer>
      <Title>Доступні тури</Title>
      <Map tours={tours} onBook={handleBook} bookings={bookings} />
      <SortButton onClick={handleSortByPrice}>Сортувати за ціною</SortButton>
      <ToursGrid>
        {tours.map((tour) => (
          <TourCard
            key={tour.id}
            {...tour}
            onBook={handleBook}
            isBooking={bookings.includes(tour.id)}
            isBookedView={bookings.includes(tour.id)}
          />
        ))}
      </ToursGrid>
    </ToursContainer>
  );
};

export default ToursPage; 