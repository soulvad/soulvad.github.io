import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TourCard from './components/TourCard';
import Map from './components/Map';
import ContactForm from './components/ContactForm';
import Popup from './components/Popup';
import ConfirmationPopup from './components/ConfirmationPopup';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.header`
  background-color: #37475a;
  padding: 0;
  margin-bottom: 2rem;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`;

const Nav = styled.nav`
  width: 100%;
  background: #37475a;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  
  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    gap: 100px;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  li {
    display: inline-block;
  }
  
  a {
    color: #fff;
    text-decoration: none;
    font-size: 1.4rem;
    transition: color 0.2s;
    
    &:hover {
      color: #ffeb3b;
    }
  }
`;

const Section = styled.section`
  margin: 3rem 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const ToursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const BookingsContainer = styled.div`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
`;

const BookingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CancelAllButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const ContactSection = styled.div`
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: flex-start;
  margin-top: 30px;
  flex-wrap: wrap;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 30px;
    align-items: stretch;
  }
`;

const ContactMap = styled.div`
  flex: 1 1 350px;
  max-width: 500px;
  min-width: 300px;
  
  iframe {
    width: 100%;
    height: 350px;
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  @media (max-width: 900px) {
    max-width: 100%;
  }
`;

const Footer = styled.footer`
  background-color: #37475a;
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: 50px;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`;

const SortButton = styled.button`
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
  margin-left: auto;
  display: block;
  transition: background-color 0.3s;
  &:hover {
    background-color: #1769aa;
  }
`;

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

// Sample tour data
const initialTours = [
  {
    id: 1,
    title: "Відпочинок в Карпатах",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    duration: "7 днів",
    price: "15000 грн",
    location: { lat: 48.6208, lng: 22.2879 },
    description: "Чудовий відпочинок в Карпатах з проживанням в гірському готелі"
  },
  {
    id: 2,
    title: "Морський круїз по Чорному морю",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    duration: "5 днів",
    price: "20000 грн",
    location: { lat: 44.6166, lng: 33.5254 },
    description: "Незвичайний круїз по Чорному морю з відвідуванням найкращих курортів"
  },
  {
    id: 3,
    title: "Екскурсія по Львову",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    duration: "3 дні",
    price: "8000 грн",
    location: { lat: 49.8397, lng: 24.0297 },
    description: "Ознайомча екскурсія по найкращих місцях Львова"
  }
];

interface PopupState {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

const App: React.FC = () => {
  const [tours, setTours] = useState(initialTours);
  const [bookings, setBookings] = useState<number[]>([]);
  const [popup, setPopup] = useState<PopupState>({
    message: '',
    type: 'info',
    isVisible: false
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sortedTours, setSortedTours] = useState<Tour[] | null>(null);

  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const showPopup = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setPopup({
      message,
      type,
      isVisible: true
    });
  };

  const hidePopup = () => {
    setPopup(prev => ({ ...prev, isVisible: false }));
  };

  const handleBook = (id: number) => {
    if (!bookings.includes(id)) {
      setBookings([...bookings, id]);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      showPopup('Тур успішно заброньовано!', 'success');
    }
  };

  const handleCancel = (id: number) => {
    setBookings(bookings.filter(bookingId => bookingId !== id));
    localStorage.setItem('bookings', JSON.stringify(bookings));
    showPopup('Бронювання скасовано', 'info');
  };

  const handleCancelAll = () => {
    setShowConfirmation(true);
  };

  const confirmCancelAll = () => {
    setBookings([]);
    localStorage.removeItem('bookings');
    showPopup('Всі бронювання скасовано', 'info');
    setShowConfirmation(false);
  };

  const cancelCancelAll = () => {
    setShowConfirmation(false);
  };

  const handleSortByPrice = () => {
    const toursToSort = [...tours];
    toursToSort.sort((a, b) => {
      // Витягуємо число з ціни (наприклад, '8000 грн' -> 8000)
      const priceA = parseInt(a.price?.replace(/[^\d]/g, '') || '0', 10);
      const priceB = parseInt(b.price?.replace(/[^\d]/g, '') || '0', 10);
      return priceA - priceB;
    });
    setSortedTours(toursToSort);
  };

  // Сторінки
  const ToursPage = () => (
    <>
      <Section>
        <Map tours={tours} onBook={handleBook} bookings={bookings} />
      </Section>
      <Section id="hot-tours">
        <SectionTitle>Доступні тури</SectionTitle>
        <SortButton onClick={handleSortByPrice}>Сортувати за ціною</SortButton>
        <ToursGrid>
          {(sortedTours || tours).map(tour => (
            <TourCard
              key={tour.id}
              tour={tour}
              isBooking={bookings.includes(tour.id)}
              onBook={() => handleBook(tour.id)}
              onCancel={() => handleCancel(tour.id)}
            />
          ))}
        </ToursGrid>
      </Section>
    </>
  );

  const BookingsPage = () => (
    <Section id="my-bookings">
      <SectionTitle>Мої бронювання</SectionTitle>
      {bookings.length > 0 ? (
        <BookingsContainer>
          <BookingsHeader>
            <h3>Заброньовані тури</h3>
            <CancelAllButton onClick={handleCancelAll}>
              Скасувати всі
            </CancelAllButton>
          </BookingsHeader>
          <ToursGrid>
            {tours
              .filter(tour => bookings.includes(tour.id))
              .map(tour => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  isBooking={true}
                  onBook={() => handleBook(tour.id)}
                  onCancel={() => handleCancel(tour.id)}
                />
              ))}
          </ToursGrid>
        </BookingsContainer>
      ) : (
        <p>У вас немає активних бронювань</p>
      )}
    </Section>
  );

  const ContactsPage = () => (
    <Section id="contacts">
      <SectionTitle>Контакти</SectionTitle>
      <ContactSection>
        <ContactForm onShowPopup={showPopup} />
        <ContactMap>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.827853398542!2d30.5193563!3d50.4483823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce56b2456d3b%3A0xd062ae171b57e947!2z0YPQuy4g0JrRgNC10LzQu9GM0L3QtdC90LAsIDIsINCa0LjRl9Cy!5e0!3m2!1suk!2sua!4v1647881234567!5m2!1suk!2sua"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </ContactMap>
      </ContactSection>
    </Section>
  );

  return (
    <Router>
      <AppContainer>
        {popup.isVisible && (
          <Popup
            message={popup.message}
            type={popup.type}
            onClose={hidePopup}
          />
        )}
        {showConfirmation && (
          <ConfirmationPopup
            message="Ви впевнені, що хочете скасувати всі бронювання?"
            onConfirm={confirmCancelAll}
            onCancel={cancelCancelAll}
          />
        )}
        <Header>
          <Nav>
            <ul>
              <li><Link to="/">Гарячі тури</Link></li>
              <li><Link to="/bookings">Мої бронювання</Link></li>
              <li><Link to="/contacts">Контакти</Link></li>
            </ul>
          </Nav>
        </Header>
        <main>
          <Routes>
            <Route path="/" element={<ToursPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
          </Routes>
        </main>
        <Footer>
          <p>&copy; 2025 Туристична платформа. Всі права захищені.</p>
        </Footer>
      </AppContainer>
    </Router>
  );
};

export default App;
