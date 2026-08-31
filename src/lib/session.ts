// Oturum tipi tanımı
export interface AdminSession {
  userId: number;
  email: string;
  name: string;
  role: string;
  isLoggedIn: boolean;
}

export const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET ?? 'classauto-session-secret-min-32-chars-required',
  cookieName: 'classauto_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 8, // 8 saat
  },
};
