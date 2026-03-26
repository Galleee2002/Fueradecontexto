'use client'

const COLOR_HEX: Record<string, string> = {
  Negro: '#1A1A1A',
  Blanco: '#F5F5F5',
  Camel: '#C19A6B',
  Fucsia: '#E91E8C',
  Marengo: '#4A4E54',
  Rojo: '#D32F2F',
  Verde: '#388E3C',
  Azul: '#1565C0',
  Gris: '#757575',
}

interface ColorSelectorProps {
  colors: string[]
  selected: string | null
  onChange: (color: string) => void
}

export function ColorSelector({ colors, selected, onChange }: ColorSelectorProps) {
  if (colors.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        Color{selected ? <> — <span className="text-foreground">{selected}</span></> : null}
      </p>
      <div className="flex items-center gap-3">
        {colors.map((name) => (
          <button
            key={name}
            onClick={() => onChange(name)}
            aria-label={`Color ${name}`}
            className={`w-7 h-7 rounded-full transition-all duration-150 focus:outline-none ${
              selected === name
                ? 'ring-2 ring-offset-2 ring-foreground'
                : 'ring-1 ring-transparent hover:ring-border'
            }`}
            style={{ backgroundColor: COLOR_HEX[name] ?? '#ccc' }}
          />
        ))}
      </div>
    </div>
  )
}
