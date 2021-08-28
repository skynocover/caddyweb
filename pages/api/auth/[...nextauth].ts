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
        if (credentials.email === 'admin' && credentials.password === '1qaz#EDC5tgb') {
          const user = {
            name: 'admin',
            email: 'admin@gmail.com',
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
