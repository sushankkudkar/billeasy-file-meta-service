export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  authTokens?: AuthToken[];
}

export interface AuthToken {
  id: number;
  userId: number;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  user?: User;
}
