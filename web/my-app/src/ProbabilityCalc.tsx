// CalculateProbability.tsx - Refactored Component
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

type FormValues = {
  value1: number;
  value2: number;
  operation: 'Either' | 'CombinedWith';
};

type ApiResponse = {
  result: number;
  success: boolean;
  validationFailureMessage: string | null;
};

const schema = yup.object().shape({
  value1: yup
    .number()
    .typeError('Value 1 must be a number')
    .min(0, 'Value 1 must be at least 0')
    .max(1, 'Value 1 must be at most 1')
    .required('Value 1 is required'),
  value2: yup
    .number()
    .typeError('Value 2 must be a number')
    .min(0, 'Value 2 must be at least 0')
    .max(1, 'Value 2 must be at most 1')
    .required('Value 2 is required'),
  operation: yup
    .mixed<'Either' | 'CombinedWith'>()
    .oneOf(['Either', 'CombinedWith'], 'You must choose an operation')
    .required('Operation is required'),
});

const CalculateProbability: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      operation: 'Either',
    },
  });

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setResponse(null);

    const baseUrl = `http://localhost:5050/${data.operation}`;
    const url = `${baseUrl}?probabilityA=${data.value1.toFixed(1)}&probabilityB=${data.value2.toFixed(1)}`;

    try {
      const res = await axios.get<ApiResponse>(url);
      setResponse(res.data);
      reset({ operation: data.operation });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Request failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" role="form" aria-label="Calculate Probability">
        <fieldset>
          <legend className="block font-medium mb-1">Choose calculation:</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input 
                type="radio" 
                value="Either" 
                {...register('operation')}
                aria-describedby={errors.operation ? 'operation-error' : undefined}
              />
              Either
            </label>
            <label className="flex items-center gap-1">
              <input 
                type="radio" 
                value="CombinedWith" 
                {...register('operation')}
                aria-describedby={errors.operation ? 'operation-error' : undefined}
              />
              CombinedWith
            </label>
          </div>
          {errors.operation && (
            <p className="text-red-500 text-sm" id="operation-error" role="alert">
              {errors.operation.message}
            </p>
          )}
        </fieldset>

        <div>
          <label className="block font-medium" htmlFor="value1">
            Value 1 (0–1):
          </label>
          <input
            id="value1"
            type="number"
            step="0.01"
            {...register('value1')}
            className="w-full border px-2 py-1 rounded"
            aria-describedby={errors.value1 ? 'value1-error' : undefined}
          />
          {errors.value1 && (
            <p className="text-red-500 text-sm" id="value1-error" role="alert">
              {errors.value1.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium" htmlFor="value2">
            Value 2 (0–1):
          </label>
          <input
            id="value2"
            type="number"
            step="0.01"
            {...register('value2')}
            className="w-full border px-2 py-1 rounded"
            aria-describedby={errors.value2 ? 'value2-error' : undefined}
          />
          {errors.value2 && (
            <p className="text-red-500 text-sm" id="value2-error" role="alert">
              {errors.value2.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full px-4 py-2 rounded text-white ${
            !isValid || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          aria-describedby="submit-status"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <div id="submit-status" aria-live="polite" aria-atomic="true">
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-3 border rounded ${
                response.success ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
              role="status"
              aria-label={response.success ? 'Calculation result' : 'Validation error'}
            >
              {response.success ? (
                <p><strong>Result:</strong> {response.result}</p>
              ) : (
                <p><strong>Validation failed:</strong> {response.validationFailureMessage || 'Unknown error'}</p>
              )}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 border rounded bg-red-100 text-red-800"
              role="alert"
              aria-label="Request error"
            >
              <p><strong>Error:</strong> {error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalculateProbability;
