import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import App from '../components/App/App';

test("Test SEARCH button", () => {
  render(<App />);
  const searchButtonElement = screen.getByText(/SEARCH/i);
   
//https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent
	// BEFORE component is rendered
  userEvent.setup()

  userEvent.click(searchButtonElement);
  expect(searchButtonElement).toHaveTextContent(/SEARCH/i);
});
