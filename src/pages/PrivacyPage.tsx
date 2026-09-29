import { Card, CardHeader, CardTitle } from '../components/Card'

const sections = [
  {
    title: 'Overview',
    body: 'This page is a placeholder for FitWise\'s Privacy Policy and Terms of Service. The final legal text will be added here before launch.',
  },
  {
    title: 'Data we collect',
    body: 'We store the profile stats you enter (age, height, weight, gender, activity level, goal), your weight measurements, and the AI plans you generate. This data is stored securely and is only visible to you.',
  },
  {
    title: 'How your data is used',
    body: 'Your stats are sent to an AI service solely to generate your personalized workout and nutrition plan. They are not shared with third parties or used for advertising.',
  },
  {
    title: 'Your rights',
    body: 'You can view and delete your saved plans and weight entries at any time from the History and Progress pages. You can also sign out of your account from the navigation menu.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
        Privacy &amp; Terms
      </h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <p className="text-ink-600 dark:text-ink-300">{section.body}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
