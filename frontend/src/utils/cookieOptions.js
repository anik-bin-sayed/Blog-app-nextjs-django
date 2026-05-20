/** Client-readable cookies must not use secure on local HTTP. */
export const clientCookieOptions = {
  path: "/",
  sameSite: "Lax",
  secure: process.env.NODE_ENV === "production",
};
