import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { userService } from "@/web/container";
import { loginSchema } from "@/core/validators/user-validator";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials
          const { email, password } = loginSchema.parse(credentials);

          // Authenticate user
          const user = await userService.authenticate({ email, password });

          if (!user) {
            throw new Error("Credenciales inválidas");
          }

          // Return user object (will be stored in session)
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatarUrl,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error("Datos inválidos");
          }
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
