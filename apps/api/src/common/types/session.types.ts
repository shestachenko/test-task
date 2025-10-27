export interface SessionData {
  userId: string;
  username: string;
  email: string;
}

declare module 'express-session' {
  interface SessionData {
    userId: string;
    username: string;
    email: string;
  }
}
