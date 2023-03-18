import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import {query as q} from 'faunadb'
import {fauna} from '../../../services/fauna'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: String(process.env.GITHUB_ID) ,
      clientSecret: String(process.env.GITHUB_SECRET) ,
      authorization: {params: {scope: 'read:user'}}
    })
    // ...add more providers here
  ],
  jwt: {
    secret: process.env.JWT_SIGNIN_KEY 
  },
  callbacks: {
    async signIn({user, account, profile}): Promise<boolean>{
      const {email} = user

      try{
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email!)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              {data: {email}}
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email!)
              )
            )
          )
        )

        return true
      }
      catch{
        return false

      }
    }
  }

})