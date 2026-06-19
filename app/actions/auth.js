'use server';

import { cookies } from 'next/headers';

export async function setSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set('session_jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function getSessionCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_jwt');
  return token?.value || null;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('session_jwt');
}
