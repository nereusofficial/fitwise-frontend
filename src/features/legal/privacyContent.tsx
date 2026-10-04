// TODO(owner): draft based on the app's current behavior. Review every statement and fill in the TODO placeholders before launch.
import type { LegalDocumentData } from './termsContent'

export const privacyContent: LegalDocumentData = {
  title: 'Privacy Policy',
  effectiveDate: '2026-10-03',
  sections: [
    {
      heading: '1. Information We Collect',
      paragraphs: [
        'We collect information you provide directly to us and information we receive from third parties:',
      ],
      list: [
        'Name and email address (received from Google when you sign in)',
        'Profile and fitness data: age, height, weight, gender, activity level, and goal',
        'Weight log entries you record',
        'Generated plans and plan history',
        'The date you accepted these documents',
      ],
    },
    {
      heading: '2. How We Use Your Information',
      paragraphs: ['We use the information we collect to:'],
      list: [
        'Provide and personalize your workout and nutrition plans',
        'Generate AI-powered recommendations based on your stats and goals',
        'Provide the chat assistant with your profile and latest plan as context',
        'Track your progress over time',
        'Maintain and improve the service',
      ],
    },
    {
      heading: '3. AI and Data Sharing',
      paragraphs: [
        'To generate plans and chat replies, your stats or messages are sent to an AI provider (Google\'s Gemini API).',
        'The landing page assistant receives only the messages typed there; visitors are told not to share personal details.',
        'The signed-in coach also receives your profile and latest plan as context to provide personalized responses.',
        'Chat messages are not stored on our servers. The recent conversation is kept in your browser session until the tab is closed.',
      ],
    },
    {
      heading: '4. Data Storage',
      paragraphs: [
        'Your data is stored with our database and authentication provider, Supabase.',
        'Login uses the browser\'s local storage for the session; we do not use advertising cookies. [TODO: confirm no analytics.]',
      ],
    },
    {
      heading: '5. Data Sharing',
      paragraphs: [
        'We do not sell your personal data.',
        'We may share data with service providers who help us operate the application, subject to confidentiality obligations.',
      ],
    },
    {
      heading: '6. Your Rights',
      paragraphs: [
        'You may request access to, correction of, or deletion of your personal data.',
        'You can ask for your account and data to be deleted by contacting us.',
        '[TODO: contact email for questions, access, and deletion requests.]',
      ],
    },
    {
      heading: '7. Data Security',
      paragraphs: [
        'We use reasonable technical and organizational measures to protect your data. However, no method of transmission or storage is completely secure.',
      ],
    },
    {
      heading: '8. Children\'s Privacy',
      paragraphs: [
        'FitWise is not intended for children under 13. [TODO: confirm minimum age.] We do not knowingly collect personal information from children under 13.',
      ],
    },
    {
      heading: '9. Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. When we do, users will be asked to accept the updated version before continuing to use the service.',
      ],
    },
  ],
}
