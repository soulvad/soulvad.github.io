import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

interface PopupProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const PopupContainer = styled.div<{ type: string }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: ${slideIn} 0.3s ease-out;
  
  &.closing {
    animation: ${slideOut} 0.3s ease-out;
  }
`;

const PopupContent = styled.div<{ type: string }>`
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#f44336';
      case 'info':
        return '#2196F3';
      default:
        return '#2196F3';
    }
  }};
`;

const Message = styled.span`
  color: #333;
  font-size: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Popup: React.FC<PopupProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const popup = document.querySelector('.popup-container') as HTMLElement;
      if (popup) {
        popup.classList.add('closing');
        setTimeout(onClose, 300);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    const popup = document.querySelector('.popup-container') as HTMLElement;
    if (popup) {
      popup.classList.add('closing');
      setTimeout(onClose, 300);
    }
  };

  return (
    <PopupContainer className="popup-container" type={type}>
      <PopupContent type={type}>
        <Message>{message}</Message>
        <CloseButton onClick={handleClose}>×</CloseButton>
      </PopupContent>
    </PopupContainer>
  );
};

export default Popup; 