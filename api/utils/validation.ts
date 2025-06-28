// API request validation utilities

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const field of requiredFields) {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      errors.push({
        field,
        message: `${field} is required`,
      });
    }
  }
  
  return errors;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validatePrice(price: string | number): boolean {
  if (typeof price === 'number') {
    return price > 0;
  }
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum > 0;
}

export function validateRequest(
  data: Record<string, any>,
  requiredFields: string[],
  customValidators?: {
    [field: string]: (value: any) => ValidationError | null;
  }
): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = validateRequired(data, requiredFields);
  
  // Run custom validators if provided
  if (customValidators) {
    for (const [field, validator] of Object.entries(customValidators)) {
      if (data[field] !== undefined && data[field] !== null) {
        const validationResult = validator(data[field]);
        if (validationResult) {
          errors.push(validationResult);
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
