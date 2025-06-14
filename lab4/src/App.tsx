import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TourCard from './components/TourCard';
import Map from './components/Map';
import ContactForm from './components/ContactForm';
import Popup from './components/Popup';
import ConfirmationPopup from './components/ConfirmationPopup';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import { tourService, Tour } from './services/tourService';
import ReviewSection from './components/ReviewSection';
import ToursPage from './components/ToursPage';
import BookingsPage from './components/BookingsPage';
import ContactsPage from './components/ContactsPage';
import HomePage from './components/HomePage';

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
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
  font-weight: 600;
`;

const ToursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
  align-items: stretch;
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
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 20px;
  margin-left: auto;
  display: block;
  transition: background-color 0.3s;
  font-size: 1rem;

  &:hover {
    background-color: #357abd;
  }
`;

const AuthLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.4rem;
  transition: color 0.2s;
  margin-left: 20px;
  
  &:hover {
    color: #ffeb3b;
  }
`;

const UserInfo = styled.div`
  color: #fff;
  font-size: 1.4rem;
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    background: none;
    border: 1px solid #fff;
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      background: #fff;
      color: #37475a;
    }
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: #ffeb3b;
  }
`;

const AuthLinks = () => {
  const { currentUser, logout } = useAuth();
  return (
    <>
      {currentUser ? (
        <UserInfo>
          <span>{currentUser.email}</span>
          <LogoutButton onClick={logout}>Вийти</LogoutButton>
        </UserInfo>
      ) : (
        <>
          <li><AuthLink to="/login">Увійти</AuthLink></li>
          <li><AuthLink to="/register">Реєстрація</AuthLink></li>
        </>
      )}
    </>
  );
};

const Navigation = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Nav>
      <ul>
        <li><Link to="/">Головна</Link></li>
        <li><Link to="/tours">Тури</Link></li>
        {currentUser ? (
          <>
            <li><Link to="/bookings">Мої бронювання</Link></li>
            <li><Link to="/contacts">Контакти</Link></li>
            <li>
              <UserInfo>
                {currentUser.email}
                <button onClick={() => logout()}>Вийти</button>
              </UserInfo>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Вхід</Link></li>
            <li><Link to="/register">Реєстрація</Link></li>
          </>
        )}
      </ul>
    </Nav>
  );
};

const AppContent: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error' | 'info'>('success');

  const showPopupMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
  };

  return (
    <Router>
      <AppContainer>
        <Header>
          <Navigation />
        </Header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        {showPopup && (
          <Popup
            message={popupMessage}
            type={popupType}
            onClose={() => setShowPopup(false)}
          />
        )}
      </AppContainer>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Header>
            <Navigation />
          </Header>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer>
            <p>&copy; 2025 Tourism Platform. Всі права захищені.</p>
          </Footer>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
};

const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterSection = styled.div`
  flex: 1 1 300px;
  min-width: 220px;
  margin-bottom: 20px;
`;

const FooterTitle = styled.h3`
  color: #ffeb3b;
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const FooterText = styled.p`
  color: #fff;
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.6;
`;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default App;
