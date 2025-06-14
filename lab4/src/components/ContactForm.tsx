import React, { useState } from 'react';
import styled from 'styled-components';

interface ContactFormProps {
  onShowPopup: (message: string, type: 'success' | 'error' | 'info') => void;
}

const FormContainer = styled.div`
  flex: 1 1 350px;
  max-width: 450px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const SubmitButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ContactForm: React.FC<ContactFormProps> = ({ onShowPopup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onShowPopup('Повідомлення успішно надіслано!', 'success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      onShowPopup('Помилка при надсиланні повідомлення. Спробуйте ще раз.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <h3>Зв'язатися з нами</h3>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Ваше ім'я"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextArea
          name="message"
          placeholder="Ваше повідомлення"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Надсилання...' : 'Надіслати'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default ContactForm; 