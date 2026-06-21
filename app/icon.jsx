import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// App Icon dimensions
export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #f4f3ff, #fdf2f8)',
          borderRadius: 120,
          border: '12px solid rgba(79, 70, 229, 0.2)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="280"
          height="280"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#logo-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#4F46E5" offset="0%" />
              <stop stopColor="#DB2777" offset="100%" />
            </linearGradient>
          </defs>
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          <path d="M20 3v4" />
          <path d="M22 5h-4" />
          <path d="M4 17v2" />
          <path d="M5 18H3" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
