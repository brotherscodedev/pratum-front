import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import apiCall from "./api-call";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          label: "E-Mail",
          type: "email",
          placeholder: "seuemail@email.com",
        },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const res = await apiCall({
            uri: "auth/login",
            method: "POST",
            data: {
              email: credentials?.email,
              password: credentials?.password,
            },
          });
          const resJson = await res.json();

          if (res.status !== 200) {
            Promise.reject(resJson.message);
            return null;
          }

          const resUser = await apiCall({
            uri: "api/v1/usuario",
            token: resJson.token,
          });

          const resUserJson = await resUser.json();

          if (!!resUserJson) {
            const user = {
              id: resUserJson.ID,
              ...resUserJson,
              token: resJson.token,
            };
            // Any object returned will be saved in `user` property of the JWT
            return user;
          }

          Promise.reject(resJson.message);
        } catch (error) {
          console.error('1',error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/", //sigin page
  },
  callbacks: {
    async jwt({ token, user }: any) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.type = user.type;
        token.id = user.id;
        token.apiToken = user.token;
      }
      return token;
    },
    session({ session, token }: any) {
      /* Step 2: update the session.user based on the token object */
      if (token && session.user) {
        session.user = {
          ...session.user,
          type: token.type,
          id: token.id,
          apiToken: token.apiToken,
        };
      }
      return session;
    },
  },
};
