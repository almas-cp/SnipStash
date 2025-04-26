import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Check if we're in a serverless environment
export const isServerless = () => {
  return typeof window === 'undefined' && process.env.VERCEL === '1';
};

// Custom logger with better error formatting for serverless environments
export const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  },
  
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  },
  
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`);
    
    if (error) {
      if (error instanceof Error) {
        console.error(`- Message: ${error.message}`);
        console.error(`- Stack: ${error.stack}`);
      } else {
        console.error('- Details:', error);
      }
    }
  }
};

// Format errors for API responses
export const formatError = (error: unknown): { message: string, details?: any } => {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: {
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    };
  }
  
  return {
    message: 'An unknown error occurred',
    details: error
  };
};
