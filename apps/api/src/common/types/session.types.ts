import 'express-session';
import 'express';

// Extend express-session module to add custom session properties
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
    email?: string;
  }
}

// Extend Express Request to include session
declare module 'express' {
  interface Request {
    session: any;
  }
}
