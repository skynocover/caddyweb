import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (
          credentials.email === (process.env.NEXTAUTH_USER || '') &&
          credentials.password === (process.env.NEXTAUTH_PASSWORD || '')
        ) {
          const user = {
            name: process.env.USER,
            email: process.env.USER + '@gmail.com',
          };

          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: { jwt: true },
});
