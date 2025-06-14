import React from 'react';
import styled from 'styled-components';
import Map from './Map';

const ContactsContainer = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h2`
  color: #37475a;
  margin-bottom: 2rem;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  gap: 2rem;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactItem = styled.div`
  margin-bottom: 1.5rem;
`;

const ContactLabel = styled.h3`
  color: #37475a;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
`;

const ContactText = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin: 0;
`;

const MapContainer = styled.div`
  flex: 1;
  min-height: 400px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
`;

const ContactsPage: React.FC = () => {
  return (
    <ContactsContainer>
      <Title>Контакти</Title>
      <Content>
        <ContactInfo>
          <ContactItem>
            <ContactLabel>Адреса</ContactLabel>
            <ContactText>
              м. Львів, вул. Шевченка, 1
            </ContactText>
          </ContactItem>
          <ContactItem>
            <ContactLabel>Телефон</ContactLabel>
            <ContactText>
              +380 (32) 123-45-67
            </ContactText>
          </ContactItem>
          <ContactItem>
            <ContactLabel>Email</ContactLabel>
            <ContactText>
              info@tourism-platform.com
            </ContactText>
          </ContactItem>
          <ContactItem>
            <ContactLabel>Графік роботи</ContactLabel>
            <ContactText>
              Пн-Пт: 9:00 - 18:00<br />
              Сб-Нд: 10:00 - 16:00
            </ContactText>
          </ContactItem>
        </ContactInfo>
        <MapContainer>
          <Map
            tours={[{
              id: 'contacts-marker',
              title: 'Офіс AnVa Travel',
              image: '',
              duration: '',
              price: 0,
              location: 'Львів',
              coordinates: { lat: 49.834980, lng: 24.006529 }, // вул. Степана Бандери, 30
              description: 'вул. Степана Бандери, 30, Львів'
            }]}
          />
        </MapContainer>
      </Content>
    </ContactsContainer>
  );
};

export default ContactsPage; 