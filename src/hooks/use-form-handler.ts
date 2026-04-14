import { useState } from 'react';
import { toast } from 'sonner';
import { mapServerErrors } from '@/lib/utils/form-errors';

export function useFormErrorHandler() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalErrors, setGlobalErrors] = useState<{ message: string }[]>([]);

  const handleError = (error: any, formValues: Record<string, any>) => {
    setFieldErrors({});
    setGlobalErrors([]);
    
    const result = mapServerErrors(error, formValues);
    
    if (result.type === 'field') {
      const newFieldErrors: Record<string, string> = {};
      result.errors.forEach(e => { 
        if (e.field) newFieldErrors[e.field] = e.message; 
      });
      setFieldErrors(newFieldErrors);
      
      // If the API provided a main message but also field errors, 
      // we only show the global message if it's not redundant.
      // For now, let's keep it simple: field errors only show inline.
    } else {
      setGlobalErrors([{ message: result.message }]);
      toast.error(result.message);
    }
  };

  return { fieldErrors, globalErrors, handleError, setFieldErrors, setGlobalErrors };
}
