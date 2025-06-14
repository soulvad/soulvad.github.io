import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  const headerElement = screen.getByRole('banner');
  expect(headerElement).toBeInTheDocument();
});
