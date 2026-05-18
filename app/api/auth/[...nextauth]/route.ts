import { NextResponse, NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    return undefined;
  }
}

const { handlers } = NextAuth({
  ...authConfig,
  secret: 'DkG5voGOok+dVWVVt40aYPFkBQWlX6CGEXcRtxatZtQ=',
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await getUser(credentials.email as string);
        if (!user) return null;
        
        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (passwordsMatch) return user;
        
        return null;
      },
    }),
  ],
});

export async function POST(req: NextRequest) {
  try {
    return await handlers.POST(req);
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export const GET = handlers.GET;