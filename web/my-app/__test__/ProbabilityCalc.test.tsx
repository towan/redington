import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axios from 'axios';
import CalculateProbability from '../src/ProbabilityCalc';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('CalculateProbability Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders the form with all required elements', () => {
      render(<CalculateProbability />);

      // Check form exists
      expect(screen.getByRole('form', { name: /calculate probability/i })).toBeInTheDocument();

      // Check fieldset and radio buttons
      expect(screen.getByRole('group', { name: /choose calculation/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /either/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /combinedwith/i })).toBeInTheDocument();

      // Check number inputs
      expect(screen.getByRole('spinbutton', { name: /value 1/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /value 2/i })).toBeInTheDocument();

      // Check submit button
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    })

    it('has submit button disabled initially', () => {
      render(<CalculateProbability />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });
  });

   describe('Form Validation', () => {
   
    it('shows error for value1 out of range', async () => {
      const user = userEvent.setup();
      render(<CalculateProbability />);

      const value1Input = screen.getByRole('spinbutton', { name: /value 1/i });
      
      await user.clear(value1Input);
      await user.type(value1Input, '2');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/value 1 must be at most 1/i);
      });
    });

    it('shows error for negative value2', async () => {
      const user = userEvent.setup();
      render(<CalculateProbability />);

      const value2Input = screen.getByRole('spinbutton', { name: /value 2/i });
      
      await user.clear(value2Input);
      await user.type(value2Input, '-0.1');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/value 2 must be at least 0/i);
      });
    });
  })
});

  describe('API Integration', () => {

  it('displays result on success', async () => {
    const user = userEvent.setup();
    const mockResponse = { result: 0.85, success: true, validationFailureMessage: null };
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    render(<CalculateProbability />);

    const value1Input = screen.getByRole('spinbutton', { name: /value 1/i });
    const value2Input = screen.getByRole('spinbutton', { name: /value 2/i });

    await user.clear(value1Input);
    await user.type(value1Input, '0.5');
    await user.clear(value2Input);
    await user.type(value2Input, '0.7');

    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled());
  
    await user.click(screen.getByRole('button', { name: /submit/i }));

    const resultText = await screen.findByText(/result/i, {}, { timeout: 5000 });
    expect(resultText).toBeInTheDocument();
});

it('displays validation failure message', async () => {
      const user = userEvent.setup();
      const mockResponse = { 
        result: 0, 
        success: false, 
        validationFailureMessage: 'Invalid probability values' 
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      render(<CalculateProbability />);

      const value1Input = screen.getByRole('spinbutton', { name: /value 1/i });
      const value2Input = screen.getByRole('spinbutton', { name: /value 2/i });

      await user.clear(value1Input);
      await user.type(value1Input, '0.5');
      await user.clear(value2Input);
      await user.type(value2Input, '0.7');

      await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled());
      
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Invalid probability values')).toBeInTheDocument();
   });
});
