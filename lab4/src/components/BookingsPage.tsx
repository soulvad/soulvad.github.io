import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { tourService } from '../services/tourService';
import { Tour, Booking } from '../types';

const BookingsContainer = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h2`
  color: #37475a;
  margin-bottom: 2rem;
  text-align: center;
`;

const BookingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const BookingTitle = styled.h3`
  color: #37475a;
  margin: 0;
`;

const BookingStatus = styled.span<{ status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: ${({ status }) => {
    switch (status) {
      case 'confirmed':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }};
  color: white;
`;

const BookingDetails = styled.div`
  color: #666;
  font-size: 1rem;
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

const NoBookingsMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  margin: 2rem 0;
`;

interface BookingWithTour extends Booking {
  tour: Tour;
}

const BookingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<BookingWithTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) {
        return;
      }

      try {
        const userBookings = await tourService.getUserBookings(currentUser.uid);
        const bookingsWithTours = await Promise.all(
          userBookings.map(async (booking) => {
            const tour = await tourService.getTourById(booking.tourId);
            return { ...booking, tour: tour! } as BookingWithTour;
          })
        );
        setBookings(bookingsWithTours);
      } catch (err) {
        setError('Помилка завантаження бронювань');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  const handleCancel = async (bookingId: string) => {
    try {
      await tourService.cancelBooking(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (err) {
      setError('Помилка при скасуванні бронювання');
    }
  };

  if (loading) {
    return <LoadingMessage>Завантаження бронювань...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (bookings.length === 0) {
    return <NoBookingsMessage>У вас немає активних бронювань</NoBookingsMessage>;
  }

  return (
    <BookingsContainer>
      <Title>Мої бронювання</Title>
      <BookingsList>
        {bookings.map((booking) => (
          <BookingCard key={booking.id}>
            <BookingHeader>
              <BookingTitle>{booking.tour.title}</BookingTitle>
              <BookingStatus status={booking.status}>
                {booking.status === 'confirmed' && 'Підтверджено'}
                {booking.status === 'pending' && 'В очікуванні'}
                {booking.status === 'cancelled' && 'Скасовано'}
              </BookingStatus>
            </BookingHeader>
            <BookingDetails>
              <p>Дата: {new Date(booking.date).toLocaleDateString()}</p>
              <p>Локація: {booking.tour.location}</p>
              <p>Тривалість: {booking.tour.duration}</p>
              <p>Ціна: {booking.tour.price} грн</p>
              {booking.status === 'pending' && (
                <button onClick={() => handleCancel(booking.id)}>
                  Скасувати бронювання
                </button>
              )}
            </BookingDetails>
          </BookingCard>
        ))}
      </BookingsList>
    </BookingsContainer>
  );
};

export default BookingsPage; 