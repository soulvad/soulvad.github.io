import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Review } from '../types';

interface ReviewFormProps {
  tourId: string;
  onSubmit: (review: Review) => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StarButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.active ? '#ffd700' : '#ccc'};
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #ffd700;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ReviewForm: React.FC<ReviewFormProps> = ({ tourId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && rating && comment) {
      const newReview: Review = {
        id: Date.now().toString(),
        tourId,
        userId: currentUser.uid,
        rating,
        comment,
        date: new Date().toISOString(),
        userName: currentUser.email || 'Анонімний користувач'
      };
      onSubmit(newReview);
      setRating(0);
      setComment('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <RatingContainer>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarButton
            key={star}
            type="button"
            active={rating >= star}
            onClick={() => setRating(star)}
          >
            ★
          </StarButton>
        ))}
      </RatingContainer>
      <TextArea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Напишіть ваш відгук..."
        required
      />
      <SubmitButton
        type="submit"
        disabled={!currentUser || !rating || !comment}
      >
        Надіслати відгук
      </SubmitButton>
    </Form>
  );
};

export default ReviewForm; 