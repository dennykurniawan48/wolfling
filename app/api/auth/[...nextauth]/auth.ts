import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Account, AuthOptions, Session, SessionStrategy, User } from "next-auth";
import { prisma } from "@/app/util/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
const jwt = require("jsonwebtoken");
import CredentialsProvider from "next-auth/providers/credentials";
import { error } from "console";
const bcrypt = require("bcryptjs")

export const authOptions = {
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: "Email", type: "text", placeholder: "email@domain.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          const user = await prisma.user.findUnique({where:{email: credentials?.username}})
         
          if(user){
            const match = bcrypt.compareSync(credentials?.password, user.password)
            if(match){
              return user
            }
          }
  
          // Return null if user data could not be retrieved
          throw error("Wrong password")
        }
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async jwt(params:{ token: JWT, account: Account, user: User,trigger: any, session: any}) {
        let newToken = params.token
        if (params.trigger === "update" && params.session.username) {
          // Note, that `session` can be any arbitrary object, remember to validate it!
          newToken.username = params.session.username
        }
        // Persist the OAuth access_token and or the user id to the token right after signin
        return newToken
      },
      async session(params: { session: Session, token: JWT }): Promise<Session> {
      //   console.log(params)
        params.session.user = params.token
        return params.session
      },
      async redirect(params: { url: string, baseUrl: string }) {
        return "/"
      }
    },
    session: {
      strategy: "jwt" as SessionStrategy,
      maxAge: 60 * 60 * 24 * 30,
    },
    jwt: {
      async encode(params: {
        token: JWT;
        secret: string;
        maxAge: number;
      }): Promise<string> {
        // return a custom encoded JWT string
        const data = await prisma.user.findFirst({ where:{ id: params.token.sub as string }})
        
      //   const user = await prisma.user.findUnique({where:{email: params.token.email!}})
        return jwt.sign(
          {
            name: params.token.name,
            sub: params.token.sub,
            username: data?.username,
            picture: params.token.picture,
            exp: Math.floor(Date.now() / 1000) + params.maxAge,
            id: data?.id
          },
          params.secret
        );
       },
      async decode(params: {
        token: string;
        secret: string;
      }): Promise<JWT | null> {
        // return a `JWT` object, or `null` if decoding failed
        return new Promise((resolve, reject) => {
          try {
            const decoded = jwt.verify(params.token, params.secret);
            resolve(decoded);
          } catch (err) {
            resolve(null);
          }
        });
      },
    }
  };