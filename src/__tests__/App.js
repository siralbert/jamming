import { render, screen } from '@testing-library/react';
import App from '../components/App/App';

//    getByText(): find the element by its textContent value
//    getByRole(): by its role attribute value
//    getByLabelText(): by its label attribute value
//    getByPlaceholderText(): by its placeholder attribute value
//    getByAltText(): by its alt attribute value
//    getByDisplayValue(): by its value attribute, usually for <input> elements
//    getByTitle(): by its title attribute value
//
//NOTE: Only use as a last resort.  getByTestId() method, which allows you to find an element by its data-testid attribute:

//import { render, screen } from '@testing-library/react';

//render(<div data-testid="custom-element" />);
//const element = screen.getByTestId('custom-element');

test('renders App with all the initial visual elements', () => {
  render(<App />);

  const Playlist = screen.getByDisplayValue(/New Playlist/i);
  const SearchResults = screen.getByText(/Results/i);
  const SearchBar = screen.getByPlaceholderText(/Enter A Song, Album, or Artist/i);
  const searchButtonElement = screen.getByText(/SEARCH/i);
  const saveButtonElement = screen.getByText(/SAVE TO SPOTIFY/i);


  expect(searchButtonElement).toBeInTheDocument();
  expect(SearchBar).toBeInTheDocument();
  expect(SearchResults).toBeInTheDocument();
  expect(Playlist).toBeInTheDocument();
  expect(saveButtonElement).toBeInTheDocument();
  
});

