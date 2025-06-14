import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FirebaseError } from 'firebase/app';

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #37475a;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #37475a;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  background-color: #37475a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2c3e50;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1rem;

  a {
    color: #37475a;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Початок реєстрації...');

    if (password !== confirmPassword) {
      console.log('Паролі не співпадають');
      return setError('Паролі не співпадають');
    }

    if (password.length < 6) {
      console.log('Пароль занадто короткий');
      return setError('Пароль повинен містити щонайменше 6 символів');
    }

    if (!email.includes('@')) {
      console.log('Невірний формат email');
      return setError('Будь ласка, введіть валідний email');
    }

    try {
      console.log('Спроба реєстрації з email:', email);
      setError('');
      setLoading(true);
      await register(email, password);
      console.log('Реєстрація успішна');
      navigate('/');
    } catch (err) {
      console.error('Помилка реєстрації:', err);
      const firebaseError = err as FirebaseError;
      console.log('Код помилки Firebase:', firebaseError.code);
      
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          setError('Цей email вже використовується');
          break;
        case 'auth/invalid-email':
          setError('Невірний формат email');
          break;
        case 'auth/operation-not-allowed':
          setError('Реєстрація тимчасово недоступна. Перевірте налаштування Firebase.');
          break;
        case 'auth/weak-password':
          setError('Пароль занадто слабкий');
          break;
        default:
          setError(`Помилка реєстрації: ${firebaseError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <Title>Реєстрація</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Пароль (мінімум 6 символів)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <Input
          type="password"
          placeholder="Підтвердіть пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Завантаження...' : 'Зареєструватися'}
        </Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <LoginLink>
        Вже маєте обліковий запис? <Link to="/login">Увійти</Link>
      </LoginLink>
    </RegisterContainer>
  );
};

export default Register; 