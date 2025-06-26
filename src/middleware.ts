import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
    error: "/error",
  },
});

// 🔹 Exclude API routes from authentication checks
export const config = {
  matcher: ["/((?!api/).*)"], // This applies middleware to everything EXCEPT `/api/`
};
// 🔹 Exclude API routes from authentication checks