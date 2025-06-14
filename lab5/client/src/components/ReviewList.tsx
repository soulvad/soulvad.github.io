import React from 'react';
import styled from 'styled-components';
import { Review } from '../types';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewsContainer = styled.div`
  margin-top: 1rem;
`;

const ReviewItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ReviewRating = styled.div`
  color: #ffd700;
  font-size: 1.2rem;
`;

const ReviewDate = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const renderStars = (value: number) => {
    return '★'.repeat(value) + '☆'.repeat(5 - value);
  };

  return (
    <ReviewsContainer>
      {reviews.map((review) => (
        <ReviewItem key={review.id}>
          <ReviewHeader>
            <div>
              <strong>{review.userName}</strong>
              <ReviewRating>{renderStars(review.rating)}</ReviewRating>
            </div>
            <ReviewDate>
              {new Date(review.date).toLocaleDateString()}
            </ReviewDate>
          </ReviewHeader>
          <p>{review.comment}</p>
        </ReviewItem>
      ))}
    </ReviewsContainer>
  );
};

export default ReviewList; 