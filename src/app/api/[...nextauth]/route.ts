import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"

const handler = NextAuth({
  providers: [
    EmailProvider({
      server: process.env.SMTP_SERVER,
      from: process.env.SMTP_FROM,
    })
  ]
})

export { handler as GET, handler as POST }
