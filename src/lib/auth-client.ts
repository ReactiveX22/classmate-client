import { UserStatus } from "@/types/auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? ""
      : process.env.API_URL || "http://backend:3000",
  basePath: "/api/v1/auth",
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
      status: {
        type: "string",
        defaultValue: UserStatus.Active,
        input: false,
      },
      organizationId: {
        type: "string",
        input: false,
        defaultValue: null,
      },
      organizationName: {
        type: "string",
        input: true,
        defaultValue: null,
      },
    },
  },
  session: {
    additionalFields: {
      impersonatedBy: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        status: { type: "string" },
        organizationId: { type: "string", required: false },
        organizationName: { type: "string", required: false },
        banned: { type: "boolean" },
        banReason: { type: "string", required: false },
        banExpires: { type: "date", required: false },
      },
      session: {
        impersonatedBy: { type: "string", required: false },
      },
    }),
    {
      id: "next-cookies-request",
      fetchPlugins: [
        {
          id: "next-cookies-request-plugin",
          name: "next-cookies-request-plugin",
          hooks: {
            async onRequest(ctx) {
              if (typeof window === "undefined") {
                const { cookies } = await import("next/headers");
                const headerList = await cookies();
                ctx.headers.set("cookie", headerList.toString());
              }
              return ctx;
            },
          },
        },
      ],
    },
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
