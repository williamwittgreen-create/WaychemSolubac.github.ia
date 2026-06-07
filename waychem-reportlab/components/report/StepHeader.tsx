import { cn } from '@/lib/utils'

interface Step {
  title: string
  description: string
}

interface Props {
  steps: Step[]
  currentStep: number
}

export function StepHeader({ steps, currentStep }: Props) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
        {steps.map((step, i) => {
          const n = i + 1
          const isDone = n < currentStep
          const isCurrent = n === currentStep
          return (
            <div key={n} className="flex items-center">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  isDone ? 'bg-way-verde text-white' : isCurrent ? 'bg-way-petroleo text-white' : 'bg-way-gris text-gray-500'
                )}
              >
                {isDone ? '✓' : n}
              </div>
              {i < steps.length - 1 && (
                <div className={cn('w-8 h-0.5 mx-1 shrink-0', isDone ? 'bg-way-verde' : 'bg-way-gris')} />
              )}
            </div>
          )
        })}
      </div>
      <div>
        <h2 className="text-xl font-bold font-display text-way-petroleo">
          Paso {currentStep}: {steps[currentStep - 1]?.title}
        </h2>
        <p className="text-sm text-gray-500">{steps[currentStep - 1]?.description}</p>
      </div>
    </div>
  )
}
