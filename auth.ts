import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: 'DkG5voGOok+dVWVVt40aYPFkBQWlX6CGEXcRtxatZtQ=',
  providers: [],
});