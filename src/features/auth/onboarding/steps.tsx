import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { EASE, fadeUp, stagger } from '../../../lib/animations'
import type { Option } from './options'

interface OptionGridProps {
  options: Option[]
  selected: string[]
  onToggle: (value: string, multi: boolean) => void
  multi?: boolean
}

export function OptionGrid({ options, selected, onToggle, multi = true }: OptionGridProps) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-3 sm:grid-cols-2">
      {options.map((option, i) => {
        const isSelected = selected.includes(option.value)
        return (
          <motion.button
            key={option.value}
            type="button"
            variants={fadeUp}
            custom={i}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={() => onToggle(option.value, multi)}
            aria-pressed={isSelected}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 ${
              isSelected
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40'
                : 'border-ink-200 bg-white hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-ink-600'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isSelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-300 dark:border-ink-600'
              }`}
              aria-hidden="true"
            >
              {isSelected && <Check className="h-4 w-4" />}
            </span>
            <span>
              <span className="block font-semibold text-ink-900 dark:text-ink-100">{option.label}</span>
              {option.description && (
                <span className="block text-sm text-ink-500 dark:text-ink-400">{option.description}</span>
              )}
            </span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
