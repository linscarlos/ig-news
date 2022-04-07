import { query as q } from "faunadb";

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from "../../../services/fauna";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      const userEmail = user.email

      try {
        await fauna.query(

          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(userEmail),
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { userEmail }}
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(userEmail),
              )
            )
            ),
        )
          return true

      } catch(err) {
        console.log(err)
        return false;
      }
    }
      
    },
})