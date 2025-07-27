// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import axios from 'axios';
// import CalculateProbability from '../src/ProbabilityCalc';
// // Mock axios
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// // Mock framer-motion to avoid animation issues in tests
// jest.mock('framer-motion', () => ({
//   motion: {
//     div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
//   },
//   AnimatePresence: ({ children }: any) => <>{children}</>,
// }));

// describe('CalculateProbability Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('Initial Render', () => {
//     it('renders all form elements correctly', () => {
//       render(<CalculateProbability />);
      
//       expect(screen.getByText('Choose calculation:')).toBeInTheDocument();
//       expect(screen.getByLabelText('Either')).toBeInTheDocument();
//       expect(screen.getByLabelText('CombinedWith')).toBeInTheDocument();
//       expect(screen.getByLabelText('Value 1 (0–1):')).toBeInTheDocument();
//       expect(screen.getByLabelText('Value 2 (0–1):')).toBeInTheDocument();
//       expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
//     });

//     it('has "Either" operation selected by default', () => {
//       render(<CalculateProbability />);
      
//       const eitherRadio = screen.getByLabelText('Either') as HTMLInputElement;
//       const combinedWithRadio = screen.getByLabelText('CombinedWith') as HTMLInputElement;
      
//       expect(eitherRadio.checked).toBe(true);
//       expect(combinedWithRadio.checked).toBe(false);
//     });

//     it('has submit button disabled initially', () => {
//       render(<CalculateProbability />);
      
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
//       expect(submitButton).toBeDisabled();
//     });
//   });

//   describe('Form Validation', () => {
//     it('shows validation errors for empty required fields', async () => {
//       const user = userEvent.setup();
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
      
//       // Focus and blur to trigger validation
//       await user.click(value1Input);
//       await user.click(value2Input);
//       await user.click(document.body);
      
//       await waitFor(() => {
//         expect(screen.getByText('Value 1 is required')).toBeInTheDocument();
//         expect(screen.getByText('Value 2 is required')).toBeInTheDocument();
//       });
//     });

//     it('shows validation error for non-numeric input', async () => {
//       const user = userEvent.setup();
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
      
//       await user.type(value1Input, 'abc');
//       await user.click(document.body);
      
//       await waitFor(() => {
//         expect(screen.getByText('Value 1 must be a number')).toBeInTheDocument();
//       });
//     });

//     it('shows validation error for values below 0', async () => {
//       const user = userEvent.setup();
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
      
//       await user.type(value1Input, '-0.1');
//       await user.click(document.body);
      
//       await waitFor(() => {
//         expect(screen.getByText('Value 1 must be at least 0')).toBeInTheDocument();
//       });
//     });

//     it('shows validation error for values above 1', async () => {
//       const user = userEvent.setup();
//       render(<CalculateProbability />);
      
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
      
//       await user.type(value2Input, '1.1');
//       await user.click(document.body);
      
//       await waitFor(() => {
//         expect(screen.getByText('Value 2 must be at most 1')).toBeInTheDocument();
//       });
//     });

//     it('enables submit button when form is valid', async () => {
//       const user = userEvent.setup();
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       await user.type(value1Input, '0.5');
//       await user.type(value2Input, '0.3');
      
//       await waitFor(() => {
//         expect(submitButton).toBeEnabled();
//       });
//     });
//   });

//   describe('Radio Button Selection', () => {
//     it('allows switching between operation types', async () => {
//       const user = userEvent.setup();
//       render(<CalculateProbability />);
      
//       const eitherRadio = screen.getByLabelText('Either') as HTMLInputElement;
//       const combinedWithRadio = screen.getByLabelText('CombinedWith') as HTMLInputElement;
      
//       // Initially Either should be selected
//       expect(eitherRadio.checked).toBe(true);
//       expect(combinedWithRadio.checked).toBe(false);
      
//       // Click CombinedWith
//       await user.click(combinedWithRadio);
      
//       expect(eitherRadio.checked).toBe(false);
//       expect(combinedWithRadio.checked).toBe(true);
      
//       // Click Either again
//       await user.click(eitherRadio);
      
//       expect(eitherRadio.checked).toBe(true);
//       expect(combinedWithRadio.checked).toBe(false);
//     });
//   });

//   describe('API Integration', () => {
//     it('makes correct API call for Either operation', async () => {
//       const user = userEvent.setup();
//       const mockResponse = {
//         data: {
//           result: 0.65,
//           success: true,
//           validationFailureMessage: null,
//         },
//       };
      
//       mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       await user.type(value1Input, '0.5');
//       await user.type(value2Input, '0.3');
//       await user.click(submitButton);
      
//       expect(mockedAxios.get).toHaveBeenCalledWith(
//         'http://localhost:5050/Either?probabilityA=0.5&probabilityB=0.3'
//       );
//     });

//     it('makes correct API call for CombinedWith operation', async () => {
//       const user = userEvent.setup();
//       const mockResponse = {
//         data: {
//           result: 0.15,
//           success: true,
//           validationFailureMessage: null,
//         },
//       };
      
//       mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
//       render(<CalculateProbability />);
      
//       const combinedWithRadio = screen.getByLabelText('CombinedWith');
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       await user.click(combinedWithRadio);
//       await user.type(value1Input, '0.5');
//       await user.type(value2Input, '0.3');
//       await user.click(submitButton);
      
//       expect(mockedAxios.get).toHaveBeenCalledWith(
//         'http://localhost:5050/CombinedWith?probabilityA=0.5&probabilityB=0.3'
//       );
//     });

//     it('displays successful response', async () => {
//       const user = userEvent.setup();
//       const mockResponse = {
//         data: {
//           result: 0.65,
//           success: true,
//           validationFailureMessage: null,
//         },
//       };
      
//       mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       await user.type(value1Input, '0.5');
//       await user.type(value2Input, '0.3');
//       await user.click(submitButton);
      
//       await waitFor(() => {
//         expect(screen.getByText('Result: 0.65')).toBeInTheDocument();
//       });
//     });

//     it('displays validation failure message', async () => {
//       const user = userEvent.setup();
//       const mockResponse = {
//         data: {
//           result: 0,
//           success: false,
//           validationFailureMessage: 'Invalid probability values',
//         },
//       };
      
//       mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       await user.type(value1Input, '0.5');
//       await user.type(value2Input, '0.3');
//       await user.click(submitButton);
      
//       await waitFor(() => {
//         expect(screen.getByText('Validation failed: Invalid probability values')).toBeInTheDocument();
//       });
//     });

//     it('handles API error responses', async () => {
//       const user = userEvent.setup();
//       const errorResponse = {
//         response: {
//           data: {
//             message: 'Server error occurred',
//           },
//         },
//       };
      
//       mockedAxios.get.mockRejectedValueOnce(errorResponse);
      
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       await user.type(value1Input, '0.5');
//       await user.type(value2Input, '0.3');
//       await user.click(submitButton);
      
//       await waitFor(() => {
//         expect(screen.getByText('Error: Server error occurred')).toBeInTheDocument();
//       });
//     });

//     it('handles network errors', async () => {
//       const user = userEvent.setup();
//       const networkError = new Error('Network Error');
      
//       mockedAxios.get.mockRejectedValueOnce(networkError);
      
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       await user.type(value1Input, '0.5');
//       await user.type(value2Input, '0.3');
//       await user.click(submitButton);
      
//       await waitFor(() => {
//         expect(screen.getByText('Error: Network Error')).toBeInTheDocument();
//       });
//     });
//   });

//   describe('Form Reset Behavior', () => {
//     it('resets form values after successful submission but keeps operation selection', async () => {
//       const user = userEvent.setup();
//       const mockResponse = {
//         data: {
//           result: 0.65,
//           success: true,
//           validationFailureMessage: null,
//         },
//       };
      
//       mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
//       render(<CalculateProbability />);
      
//       const combinedWithRadio = screen.getByLabelText('CombinedWith');
//       const value1Input = screen.getByLabelText('Value 1 (0–1):') as HTMLInputElement;
//       const value2Input = screen.getByLabelText('Value 2 (0–1):') as HTMLInputElement;
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       // Select CombinedWith and enter values
//       await user.click(combinedWithRadio);
//       await user.type(value1Input, '0.5');
//       await user.type(value2Input, '0.3');
//       await user.click(submitButton);
      
//       await waitFor(() => {
//         expect(screen.getByText('Result: 0.65')).toBeInTheDocument();
//       });
      
//       // Check that values are reset but operation is preserved
//       expect(value1Input.value).toBe('');
//       expect(value2Input.value).toBe('');
//       expect((combinedWithRadio as HTMLInputElement).checked).toBe(true);
//     });
//   });

//   describe('Loading State', () => {
//     it('shows loading state during API call', async () => {
//       const user = userEvent.setup();
      
//       // Create a promise that we can control
//       let resolvePromise: (value: any) => void;
//       const mockPromise = new Promise((resolve) => {
//         resolvePromise = resolve;
//       });
      
//       mockedAxios.get.mockReturnValueOnce(mockPromise);
      
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       await user.type(value1Input, '0.5');
//       await user.type(value2Input, '0.3');
//       await user.click(submitButton);
      
//       // Check loading state
//       expect(screen.getByText('Submitting...')).toBeInTheDocument();
//       expect(submitButton).toBeDisabled();
      
//       // Resolve the promise
//       resolvePromise!({
//         data: {
//           result: 0.65,
//           success: true,
//           validationFailureMessage: null,
//         },
//       });
      
//       // Check that loading state is gone
//       await waitFor(() => {
//         expect(screen.getByText('Submit')).toBeInTheDocument();
//         expect(submitButton).toBeEnabled();
//       });
//     });
//   });

//   describe('Edge Cases', () => {
//     it('handles response with success false and no validation message', async () => {
//       const user = userEvent.setup();
//       const mockResponse = {
//         data: {
//           result: 0,
//           success: false,
//           validationFailureMessage: null,
//         },
//       };
      
//       mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       await user.type(value1Input, '0.5');
//       await user.type(value2Input, '0.3');
//       await user.click(submitButton);
      
//       await waitFor(() => {
//         expect(screen.getByText('Validation failed: Unknown error')).toBeInTheDocument();
//       });
//     });

//     it('handles decimal precision correctly in API calls', async () => {
//       const user = userEvent.setup();
//       const mockResponse = {
//         data: {
//           result: 0.123,
//           success: true,
//           validationFailureMessage: null,
//         },
//       };
      
//       mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
//       render(<CalculateProbability />);
      
//       const value1Input = screen.getByLabelText('Value 1 (0–1):');
//       const value2Input = screen.getByLabelText('Value 2 (0–1):');
//       const submitButton = screen.getByRole('button', { name: 'Submit' });
      
//       await user.type(value1Input, '0.12345');
//       await user.type(value2Input, '0.67890');
//       await user.click(submitButton);
      
//       expect(mockedAxios.get).toHaveBeenCalledWith(
//         'http://localhost:5050/Either?probabilityA=0.1&probabilityB=0.7'
//       );
//     });
//   });
// });