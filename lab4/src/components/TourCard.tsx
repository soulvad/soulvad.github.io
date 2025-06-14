import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { Link } from 'react-router-dom';
import { Review } from '../types';

interface TourCardProps {
  id: string;
  title: string;
  image: string;
  duration: string;
  price: number;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  onBook: (id: string) => void;
  isBooking?: boolean;
  isBookedView?: boolean;
}

const Card = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.4rem;
  line-height: 1.3;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #666;
  font-size: 1.1rem;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`;

const Description = styled.p`
  color: #444;
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 1rem;
  flex-grow: 1;
`;

const DetailsButton = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 15px;
  font-size: 1rem;
  text-align: left;
  transition: color 0.2s;

  &:hover {
    color: #357abd;
    text-decoration: underline;
  }
`;

const ExpandedContent = styled.div`
  padding: 20px;
  border-top: 1px solid #eee;
  margin: 0 -20px;
  background: #f9f9f9;
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-top: auto;

  &:hover {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const TourCard: React.FC<TourCardProps> = ({
  id,
  title,
  image,
  duration,
  price,
  location,
  coordinates,
  description,
  onBook,
  isBooking = false,
  isBookedView = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { currentUser } = useAuth();

  const handleReviewSubmit = (review: Review) => {
    setReviews(prevReviews => [...prevReviews, review]);
  };

  return (
    <Card>
      <Image src={image} alt={title} />
      <Content>
        <Title>{title}</Title>
        <Info>
          <span>{duration}</span>
          <span>{price}</span>
        </Info>
        <Description>
          {isExpanded ? description : `${description.slice(0, 100)}...`}
        </Description>
        <DetailsButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Згорнути' : 'Відкрити відгуки'}
        </DetailsButton>
        {isExpanded && (
          <ExpandedContent>
            <ReviewList reviews={reviews} />
            <ReviewForm tourId={id} onSubmit={handleReviewSubmit} />
          </ExpandedContent>
        )}
        {isBookedView ? (
          <Button disabled style={{ backgroundColor: '#ccc', color: '#666', cursor: 'not-allowed' }}>
            Тур вже заброньовано
          </Button>
        ) : (
          <Button
            onClick={() => onBook(id)}
            disabled={!currentUser && !isBooking}
            title={!currentUser && !isBooking ? 'Увійдіть, щоб забронювати тур' : ''}
          >
            {isBooking ? 'Скасувати бронювання' : (currentUser ? 'Забронювати' : 'Увійдіть для бронювання')}
          </Button>
        )}
      </Content>
    </Card>
  );
};

export default TourCard; 