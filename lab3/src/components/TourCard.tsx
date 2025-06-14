import React from 'react';
import styled from 'styled-components';

interface Tour {
  id: number;
  title: string;
  image: string;
  duration: string;
  price: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
}

interface TourCardProps {
  tour: Tour;
  isBooking?: boolean;
  onBook?: (id: number) => void;
  onCancel?: (id: number) => void;
}

const Card = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  
  &.enlarged {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 1;
  }
`;

const TourImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const TourInfo = styled.div`
  padding: 15px;
`;

const TourTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const TourDetail = styled.p`
  color: #666;
  margin: 10px 0;
  font-size: 0.9rem;
`;

const Button = styled.button<{ variant?: 'book' | 'cancel' }>`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-top: 15px;
  
  ${props => props.variant === 'book' ? `
    background-color: #4CAF50;
    color: white;
    
    &:hover {
      background-color: #45a049;
    }
  ` : props.variant === 'cancel' ? `
    background-color: #f44336;
    color: white;
    
    &:hover {
      background-color: #d32f2f;
    }
  ` : ''}
`;

const TourCard: React.FC<TourCardProps> = ({ tour, isBooking, onBook, onCancel }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      const card = e.currentTarget;
      card.classList.toggle('enlarged');
    }
  };

  return (
    <Card onClick={handleClick}>
      <TourImage src={tour.image} alt={tour.title} />
      <TourInfo>
        <TourTitle>{tour.title}</TourTitle>
        <TourDetail>Тривалість: {tour.duration}</TourDetail>
        <TourDetail>{tour.price}</TourDetail>
        <TourDetail>{tour.description}</TourDetail>
        {isBooking ? (
          <Button variant="cancel" onClick={() => onCancel?.(tour.id)}>
            Скасувати бронювання
          </Button>
        ) : (
          <Button variant="book" onClick={() => onBook?.(tour.id)}>
            Забронювати
          </Button>
        )}
      </TourInfo>
    </Card>
  );
};

export default TourCard; 