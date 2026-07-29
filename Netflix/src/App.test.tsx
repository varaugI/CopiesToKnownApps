import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('opens the browse experience after choosing a profile', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: "Who's watching?" })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Gaurav/i }));

  expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
  expect(screen.getAllByText('The Last Horizon').length).toBeGreaterThan(0);
});

test('filters titles using search', () => {
  localStorage.setItem('netflix-copy-profile', 'gaurav');
  render(<App />);

  const search = screen.getByLabelText('Search titles, people and genres');
  fireEvent.change(search, { target: { value: 'Nature' } });

  expect(screen.getByText(/Explore titles related to:/)).toBeInTheDocument();
  expect(screen.getAllByText('Wild North').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Deep Blue').length).toBeGreaterThan(0);
});
