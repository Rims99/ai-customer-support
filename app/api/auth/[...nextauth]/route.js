import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Dummy user authentication for demonstration
        if (credentials.email === 'user@example.com' && credentials.password === 'password') {
          return { id: 1, name: 'User', email: credentials.email };
        }
        return null; // Return null if authentication fails
      }
    }),
  ],
  pages: {
    signIn: '/login', // Specify the sign-in page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
