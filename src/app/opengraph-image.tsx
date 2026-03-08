import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'ClassMate';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#09090b', // zinc-950
        letterSpacing: '-.02em',
        fontWeight: 700,
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#09090b',
          backgroundImage: 'linear-gradient(to bottom right, #09090b, #18181b)',
          border: '2px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
        }}
      >
        {/* Top border highlight mimicking primary color */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundImage: 'linear-gradient(90deg, #d946ef, #a855f7)',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            backgroundColor: '#18181b', // zinc-900
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 32,
            marginBottom: 48,
            boxShadow: '0 8px 32px rgba(217, 70, 239, 0.15)', // fuchsia glow
          }}
        >
          <svg
            width='64'
            height='64'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#d946ef' // fuchsia-500
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M22 10v6M2 10l10-5 10 5-10 5z' />
            <path d='M6 12v5c3 3 9 3 12 0v-5' />
          </svg>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 80,
            fontWeight: 800,
            color: 'white',
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          ClassMate
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontWeight: 500,
            color: '#a1a1aa', // zinc-400
            lineHeight: 1.4,
            textAlign: 'center',
            // maxWidth: 800,
          }}
        >
          The Operating System for Modern Education
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
