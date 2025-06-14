import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

interface Review {
  id: string;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ReviewSectionProps {
  tourId: string;
}

const ReviewSectionContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
`;

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const StarButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.active ? '#ffd700' : '#ccc'};
  transition: color 0.2s;

  &:hover {
    color: #ffd700;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  padding: 0.8rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReviewItem = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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

const ReviewSection: React.FC<ReviewSectionProps> = ({ tourId }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [tourId]);

  const loadReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('tourId', '==', tourId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(reviewsQuery);
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Review[];
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !rating || !comment) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        tourId,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        rating,
        comment,
        createdAt: new Date()
      });
      setRating(0);
      setComment('');
      loadReviews();
    } catch (error) {
      console.error('Error adding review:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (value: number) => {
    return '★'.repeat(value) + '☆'.repeat(5 - value);
  };

  return (
    <ReviewSectionContainer>
      <h3>Відгуки</h3>
      {currentUser ? (
        <ReviewForm onSubmit={handleSubmit}>
          <RatingContainer>
            <span>Оцінка:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarButton
                key={star}
                type="button"
                active={star <= rating}
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
          <SubmitButton type="submit" disabled={loading || !rating || !comment}>
            {loading ? 'Відправлення...' : 'Залишити відгук'}
          </SubmitButton>
        </ReviewForm>
      ) : (
        <p>Увійдіть, щоб залишити відгук</p>
      )}
      <ReviewsList>
        {reviews.map((review) => (
          <ReviewItem key={review.id}>
            <ReviewHeader>
              <div>
                <strong>{review.userEmail}</strong>
                <ReviewRating>{renderStars(review.rating)}</ReviewRating>
              </div>
              <ReviewDate>
                {review.createdAt.toLocaleDateString()}
              </ReviewDate>
            </ReviewHeader>
            <p>{review.comment}</p>
          </ReviewItem>
        ))}
      </ReviewsList>
    </ReviewSectionContainer>
  );
};

export default ReviewSection; 