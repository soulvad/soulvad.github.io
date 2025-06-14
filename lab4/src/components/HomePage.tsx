import React from 'react';
import styled from 'styled-components';

const HomeSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background: #f5f7fa;
`;

const HomeTitle = styled.h1`
  font-size: 2.8rem;
  color: #37475a;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const HomeSubtitle = styled.h2`
  font-size: 1.6rem;
  color: #4a90e2;
  margin-bottom: 1rem;
  text-align: center;
`;

const HomeText = styled.p`
  font-size: 1.2rem;
  color: #333;
  max-width: 700px;
  text-align: center;
  margin-bottom: 2rem;
`;

const HomeImages = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
`;

const HomeImg = styled.img`
  width: 320px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
`;

const HomeAdvantages = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
`;

const HomeAdvantage = styled.li`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 1.5rem 2rem;
  font-size: 1.1rem;
  color: #37475a;
  min-width: 220px;
  max-width: 320px;
  text-align: center;
`;

const HomePage: React.FC = () => (
  <HomeSection>
    <HomeTitle>Ласкаво просимо до AnVa Travel!</HomeTitle>
    <HomeSubtitle>Відкрийте світ разом з нами</HomeSubtitle>
    <HomeText>
      AnVa — це сучасне туристичне агентство, яке допомагає здійснювати мрії про подорожі. Ми пропонуємо найкращі тури по Україні та світу, індивідуальний підхід до кожного клієнта, професійний супровід та незабутні враження!
    </HomeText>
    <HomeImages>
      <HomeImg src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Гори" />
      <HomeImg src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca" alt="Море" />
      <HomeImg src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308" alt="Міста" />
    </HomeImages>
    <HomeSubtitle>Наші переваги</HomeSubtitle>
    <HomeAdvantages>
      <HomeAdvantage>Індивідуальний підбір турів під ваші побажання</HomeAdvantage>
      <HomeAdvantage>Підтримка 24/7 та професійні гіди</HomeAdvantage>
      <HomeAdvantage>Гарантія найкращої ціни та якості</HomeAdvantage>
      <HomeAdvantage>Ексклюзивні маршрути та авторські тури</HomeAdvantage>
      <HomeAdvantage>Безпечні подорожі та страхування</HomeAdvantage>
    </HomeAdvantages>
  </HomeSection>
);

export default HomePage; 