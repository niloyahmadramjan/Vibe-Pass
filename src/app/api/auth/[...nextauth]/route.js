import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    // 🟢 When a user logs in with Google or GitHub
    async signIn({ user, account }) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/social-login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account?.provider ?? 'social',
            }),
          }
        )

        const data = await res.json()

        // 🟢 save backend JWT (custom token) in user object
        if (data?.token) {
          user.backendToken = data.token
        }
      } catch (error) {
        console.error('❌ Failed to sync user with backend:', error)
      }

      return true
    },

    // 🟢 Store backend token inside JWT
    async jwt({ token, user }) {
      if (user?.backendToken) {
        token.accessToken = user.backendToken
      }
      return token
    },

    // 🟢 Make backend token available in session
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
