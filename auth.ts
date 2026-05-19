import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
 
async function getUser(email: string): Promise<User | undefined> {
  // Initialize connection inside the call scope to handle Serverless lifecycles cleanly
  const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
  
  try {
    console.log('Attempting database query for email:', email);
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    console.log('Database response status. User found:', !!user[0]);
    return user[0];
  } catch (error) {
    console.error('CRITICAL DATABASE OPERATION FAILURE:', error);
    throw new Error('Failed to fetch user.');
  } finally {
    // End connection pool to avoid resource leaking on the serverless instance
    await sql.end();
  }
}
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) return user;
        }
 
        console.log('Credentials validation parsed incorrectly or match failed');
        return null;
      },
    }),
  ],
});