import bcrypt from "bcryptjs";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { loginBodySchema } from "../schema/login";
import { getUserByEmail } from "../data/user";

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedField = loginBodySchema.safeParse(credentials);
        if (validatedField.success) {
          const { email, password } = validatedField.data;

          const user = await getUserByEmail(email);
          console.log(user)
          
          if (!user || !user.password) return null;

          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (isPasswordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

export default authConfig;
