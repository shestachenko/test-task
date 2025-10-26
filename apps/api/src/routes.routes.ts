/**
 * API Routes Documentation
 * Base URL: http://localhost:3000/api
 */

export const API_ROUTES = {
  // Root
  root: '/',
  
  // Authentication Module
  auth: {
    base: '/auth',
    register: '/auth/register',
    login: '/auth/login',
  },
  
  // Reservations Module
  reservations: {
    base: '/reservations',
    byDay: '/reservations/by-day',
    byUser: '/reservations/by-user',
  },
  
  // CSV Parser Module
  csvParser: {
    base: '/csv-parser',
    parse: '/csv-parser/parse',
  },
};

