'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Container } from '@/shared/ui/layout/container'
import { cn } from '@/shared/lib/cn'

const FAQ_ITEMS = [
  {
    question: '¿Cómo hago un pedido personalizado?',
    answer:
      'Podés contactarnos a través de nuestro formulario web, WhatsApp o redes sociales. Contanos qué producto querés, la cantidad, el talle y la idea de diseño. Te asesoramos y te enviamos una propuesta antes de avanzar.',
  },
  {
    question: '¿Hay un mínimo de compra?',
    answer:
      'Sí. El mínimo depende del tipo de producto y de la técnica de estampado. En pedidos personalizados solemos trabajar desde unidades individuales, aunque por cantidad ofrecemos mejores precios.',
  },
  {
    question: '¿Qué tipo de estampado utilizan?',
    answer:
      'Trabajamos con distintas técnicas según el diseño y la prenda: serigrafía, vinilo textil y DTF. Te recomendamos la mejor opción en cada caso para asegurar calidad y durabilidad.',
  },
  {
    question: '¿Cuánto demora la producción?',
    answer:
      'El tiempo de producción varía según la cantidad y la complejidad del pedido. En promedio, los encargos se entregan entre 5 y 10 días hábiles desde la confirmación del diseño.',
  },
  {
    question: '¿Se pueden hacer cambios o devoluciones?',
    answer:
      'Al tratarse de productos personalizados, no realizamos cambios ni devoluciones por errores en el diseño aprobado. Sí respondemos ante fallas de fabricación o errores de nuestra parte.',
  },
] as const

export function FaqSection() {
  const [openItem, setOpenItem] = useState(-1)
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const timeoutsRef = useRef<number[]>([])

  const visibleSet = useMemo(() => new Set(visibleItems), [visibleItems])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => {
      mediaQuery.removeEventListener('change', updatePreference)
    }
  }, [])

  useEffect(() => {
    const observers = itemRefs.current

    if (prefersReducedMotion) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const target = entry.target as HTMLElement
          const index = Number(target.dataset.index)

          if (Number.isNaN(index)) return

          const timeoutId = window.setTimeout(() => {
            setVisibleItems((current) => (current.includes(index) ? current : [...current, index]))
          }, index * 140)

          timeoutsRef.current.push(timeoutId)
          observer.unobserve(target)
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )

    observers.forEach((item) => {
      if (item) observer.observe(item)
    })

    return () => {
      observer.disconnect()
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
      timeoutsRef.current = []
    }
  }, [prefersReducedMotion])

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="brand-panel px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="space-y-8 sm:space-y-10">
            <div className="max-w-3xl space-y-4">
              <p className="brand-kicker">
                Preguntas frecuentes
              </p>
              <div className="space-y-2">
                <h2 className="text-3xl font-medium tracking-[-0.05em] text-foreground sm:text-4xl lg:text-5xl">
                  Todo lo que necesitás saber antes de pedir.
                </h2>
              </div>
            </div>

            <div className="border-y border-border">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openItem === index
                const isVisible = visibleSet.has(index)
                const answerId = `faq-answer-${index}`
                const triggerId = `faq-trigger-${index}`

                return (
                  <article
                    key={item.question}
                    ref={(node) => {
                      itemRefs.current[index] = node
                    }}
                    data-index={index}
                    className={cn(
                      'border-b border-foreground/[0.1] last:border-b-0 transition-[opacity,transform,filter] duration-700 ease-out',
                      isVisible || prefersReducedMotion
                        ? 'translate-y-0 opacity-100 blur-0'
                        : 'translate-y-8 opacity-0 blur-[2px]',
                    )}
                    style={{
                      transitionDelay: prefersReducedMotion ? '0ms' : `${index * 40}ms`,
                    }}
                  >
                    <h3>
                      <button
                        id={triggerId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => setOpenItem((current) => (current === index ? -1 : index))}
                        className="flex min-h-[76px] w-full items-center justify-between gap-5 py-5 text-left sm:min-h-[84px] sm:py-6"
                      >
                        <span className="flex items-start gap-4 sm:gap-5">
                          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="max-w-2xl text-base leading-snug text-foreground sm:text-lg">
                            {item.question}
                          </span>
                        </span>

                        <span
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-[transform,background-color,border-color] duration-300',
                            isOpen && 'scale-[0.96] border-foreground bg-foreground text-background',
                          )}
                          aria-hidden="true"
                        >
                          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </span>
                      </button>
                    </h3>

                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={triggerId}
                      className={cn(
                        'grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out',
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-6 pl-9 pr-14 text-sm leading-relaxed text-foreground/72 sm:pb-8 sm:pl-10 sm:text-base">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
