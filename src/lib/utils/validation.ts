import { FormValidationRules } from '@/lib/types'

// Common validation rules for React Hook Form
export const validationRules = {
  required: (fieldName: string) => ({
    required: `${fieldName} is required`
  }),
  
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  },
  
  password: {
    required: 'Password is required',
    min: {
      value: 8,
      message: 'Password must be at least 8 characters'
    }
  },
  
  name: {
    required: 'Name is required',
    min: {
      value: 2,
      message: 'Name must be at least 2 characters'
    },
    max: {
      value: 50,
      message: 'Name must be less than 50 characters'
    }
  },
  
  saisScale: {
    required: 'Please select a rating',
    min: {
      value: 1,
      message: 'Rating must be between 1 and 5'
    },
    max: {
      value: 5,
      message: 'Rating must be between 1 and 5'
    }
  }
}

// Helper function to create custom validation rules
export const createValidationRule = (
  fieldName: string,
  rules: Partial<FormValidationRules>
): FormValidationRules => {
  return {
    required: rules.required === true ? `${fieldName} is required` : rules.required,
    min: rules.min,
    max: rules.max,
    pattern: rules.pattern
  }
}

// Utility to validate SAIS 5-point scale responses
export const validateSaisResponse = (value: number): boolean => {
  return Number.isInteger(value) && value >= 1 && value <= 5
}

// Utility to validate assessment completion
export const validateAssessmentCompletion = (responses: any[]): boolean => {
  return responses.length > 0 && responses.every(response => 
    response.questionId && 
    typeof response.score === 'number' &&
    response.timestamp instanceof Date
  )
}

