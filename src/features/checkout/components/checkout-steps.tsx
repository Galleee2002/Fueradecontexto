'use client'

import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { StepId } from '../types'

const STEPS: { id: StepId; label: string }[] = [
  { id: 1, label: 'Contacto' },
  { id: 2, label: 'Envío' },
  { id: 3, label: 'Pago' },
]

interface CheckoutStepsProps {
  currentStep: StepId
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="mb-10 flex items-start rounded-[1.35rem] border border-border bg-surface px-4 py-5 sm:px-6">
      {STEPS.map((step, index) => {
        const isCompleted = step.id < currentStep
        const isActive = step.id === currentStep
        const isLast = index === STEPS.length - 1

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200',
                  isCompleted && 'bg-foreground text-primary-foreground',
                  isActive && 'bg-primary text-primary-foreground',
                  !isCompleted && !isActive && 'border border-border bg-background text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-[11px] uppercase tracking-[0.22em]',
                  isActive && 'text-primary font-medium',
                  isCompleted && 'text-foreground',
                  !isCompleted && !isActive && 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  'flex-1 h-px mx-4 mb-6 transition-colors duration-300',
                  isCompleted ? 'bg-foreground' : 'bg-border'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
