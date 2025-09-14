import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    id?: string;
    // add more optional fields only if actually used:
    // quizState?: unknown;
    // personalization?: { [k: string]: unknown };
  }
}
