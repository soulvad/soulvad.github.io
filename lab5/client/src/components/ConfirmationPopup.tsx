import React from 'react';
import styled from 'styled-components';

interface ConfirmationPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 300px;
  text-align: center;
`;

const Message = styled.p`
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #333;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled.button<{ variant: 'confirm' | 'cancel' }>`
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  
  ${props => props.variant === 'confirm' ? `
    background-color: #f44336;
    color: white;
    
    &:hover {
      background-color: #d32f2f;
    }
  ` : `
    background-color: #e0e0e0;
    color: #333;
    
    &:hover {
      background-color: #d5d5d5;
    }
  `}
`;

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  message,
  onConfirm,
  onCancel
}) => {
  return (
    <Overlay>
      <PopupContent>
        <Message>{message}</Message>
        <ButtonsContainer>
          <Button variant="confirm" onClick={onConfirm}>
            Так
          </Button>
          <Button variant="cancel" onClick={onCancel}>
            Ні
          </Button>
        </ButtonsContainer>
      </PopupContent>
    </Overlay>
  );
};

export default ConfirmationPopup; 