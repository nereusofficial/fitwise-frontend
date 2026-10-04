import type { LegalDocumentData } from './termsContent'

interface LegalDocumentProps {
  document: LegalDocumentData
}

export function LegalDocument({ document }: LegalDocumentProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
          {document.title}
        </h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Effective date: {document.effectiveDate}
        </p>
      </div>
      {document.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold tracking-wide text-ink-900 dark:text-ink-100">
            {section.heading}
          </h2>
          {section.paragraphs?.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              {paragraph}
            </p>
          ))}
          {section.list && (
            <ul className="flex flex-col gap-2 pl-4">
              {section.list.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
