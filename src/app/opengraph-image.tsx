import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          background: '#0f0f10',
          color: '#f5f5f4',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 8, textTransform: 'uppercase', opacity: 0.85 }}>
          Fueradecontexto
        </div>
        <div style={{ marginTop: 22, fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          Indumentaria &amp; Accesorios
        </div>
        <div style={{ marginTop: 24, fontSize: 32, opacity: 0.82 }}>
          Minimalismo elevado
        </div>
      </div>
    ),
    size,
  )
}
