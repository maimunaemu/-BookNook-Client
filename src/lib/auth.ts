import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const mongoUri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const mongoClient = new MongoClient(mongoUri);
const database = mongoClient.db(process.env.MONGODB_DB ?? "booknook");
const authSecret = process.env.BETTER_AUTH_SECRET?.trim();

if (process.env.NODE_ENV === "production" && (!authSecret || authSecret.length < 32)) {
  throw new Error("BETTER_AUTH_SECRET must be configured with at least 32 characters in production.");
}

const socialProviders = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  ? {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    }
  : {};

export const auth = betterAuth({
  appName: "BookNook",
  baseURL: process.env.BETTER_AUTH_URL || "https://book-nook-client-psi.vercel.app",
  basePath: "/api/auth",
  secret: authSecret,
  database: mongodbAdapter(database),
  socialProviders,
  plugins: [jwt()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_AUTH_URL || "https://book-nook-client-psi.vercel.app",
  ],
  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (context.path !== "/sign-up/email") return;
      const password = context.body.password;
      if (
        typeof password !== "string" ||
        password.length < 6 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password)
      ) {
        throw APIError.from("BAD_REQUEST", {
          code: "INVALID_PASSWORD",
          message: "Password must be at least 6 characters and include uppercase and lowercase letters.",
        });
      }
    }),
  },
});
