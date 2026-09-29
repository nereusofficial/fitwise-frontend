import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import {
  Activity,
  ArrowRight,
  Calculator,
  ClipboardList,
  Dumbbell,
  Flame,
  LineChart,
  Sparkles,
  Target,
  TrendingUp,
  Utensils,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EASE, fadeUp, scaleIn, stagger } from '../lib/animations'

const features = [
  {
    icon: Calculator,
    title: 'Fitness calculators',
    description: 'BMI, BMR, TDEE, and macro calculators — instant, in your browser.',
  },
  {
    icon: Sparkles,
    title: 'AI workout & nutrition plans',
    description: 'Answer a few questions and get a personalized weekly plan in seconds.',
  },
  {
    icon: LineChart,
    title: 'Progress tracking',
    description: 'Log your weight over time and watch your progress with clear charts.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Tell us about you',
    description: 'Answer a few questions about your goals, habits, and lifestyle.',
  },
  {
    number: '02',
    title: 'Get your plan',
    description: 'Our AI builds a workout and nutrition plan matched to your body and goals.',
  },
  {
    number: '03',
    title: 'Track & improve',
    description: 'Follow your plan, log your weight, and generate a fresh plan as you progress.',
  },
]

const faqs = [
  {
    question: 'How is my AI plan generated?',
    answer: 'Your answers and stats are sent to our AI service, which returns a personalized workout and nutrition plan. You can save each plan to your history and regenerate it any time.',
  },
  {
    question: 'Do I need an account?',
    answer: 'Yes — your profile, plans, and progress are saved to your account so you can pick up where you left off on any device.',
  },
  {
    question: 'Is this medical advice?',
    answer: 'No. FitWise provides general fitness and nutrition guidance. Always consult a healthcare professional before starting a new diet or exercise program.',
  },
  {
    question: 'What happens to my data?',
    answer: 'Your profile and plans are stored securely and are only visible to you. Stats entered to generate a plan are sent to an AI service solely to produce that plan.',
  },
]

const planPreview = {
  calories: 2150,
  protein: 140,
  carbs: 240,
  fat: 72,
  days: [
    { day: 'Monday', focus: 'Upper body strength', count: 5 },
    { day: 'Tuesday', focus: 'Lower body strength', count: 5 },
    { day: 'Wednesday', focus: 'Active recovery', count: 2 },
    { day: 'Thursday', focus: 'Full body strength', count: 5 },
    { day: 'Friday', focus: 'Core & conditioning', count: 4 },
    { day: 'Saturday', focus: 'Rest', count: 0 },
    { day: 'Sunday', focus: 'Rest', count: 0 },
  ],
}

function Hero() {
  const { user } = useAuth()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink-950 text-white">
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #f97316 0%, transparent 40%), radial-gradient(circle at 80% 70%, #22c55e 0%, transparent 40%)',
          opacity: 0.2,
        }}
        aria-hidden="true"
      />
      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-6xl px-4 py-28 text-center md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1.5 text-sm font-semibold text-brand-300"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          AI-powered fitness planning
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="mx-auto max-w-3xl font-display text-5xl font-bold leading-tight tracking-wide md:text-7xl"
        >
          Your body. Your goal. <span className="text-brand-400">Your plan.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-ink-300 md:text-xl"
        >
          FitWise builds a personalized workout and nutrition plan from your body stats, then helps you track
          every step of your progress.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Go to your dashboard
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get started free
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full border-white/30 text-white hover:border-brand-400 hover:text-brand-400 sm:w-auto">
                  Log in
                </Button>
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="text-center"
      >
        <motion.h2 variants={fadeUp} className="font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
          How it works
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-ink-500 dark:text-ink-400">
          Three steps between you and a plan built for your body.
        </motion.p>
      </motion.div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={i}
          >
            <Card className="relative h-full overflow-hidden">
              <span className="font-display text-6xl font-bold text-brand-500/15" aria-hidden="true">
                {step.number}
              </span>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-wide text-ink-900 dark:text-ink-100">
                {step.title}
              </h3>
              <p className="mt-2 text-ink-500 dark:text-ink-400">{step.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="bg-ink-50 py-24 dark:bg-ink-900">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2 variants={fadeUp} className="font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
            Everything you need
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-ink-500 dark:text-ink-400">
            The tools to plan, track, and crush your fitness goals.
          </motion.p>
        </motion.div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={i}
            >
              <Card className="h-full text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                  <feature.icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-wide text-ink-900 dark:text-ink-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-ink-500 dark:text-ink-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlanPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-100 px-4 py-1.5 text-sm font-semibold text-accent-700 dark:bg-accent-950 dark:text-accent-300"
          >
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            Sample plan
          </motion.span>
          <motion.h2 variants={fadeUp} className="font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
            A plan that adapts to you
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-ink-500 dark:text-ink-400">
            Get daily calorie and macro targets plus a full weekly workout split — with rest days built in.
          </motion.p>
          <motion.ul variants={stagger} className="mt-6 flex flex-col gap-3">
            {[
              { icon: Flame, text: 'Daily calorie target based on your goal' },
              { icon: Utensils, text: 'Protein, carb, and fat targets in grams' },
              { icon: Dumbbell, text: 'A weekly workout split with sets and reps' },
              { icon: Target, text: 'Practical nutrition tips and guidance' },
            ].map((item, i) => (
              <motion.li key={item.text} variants={fadeUp} custom={i} className="flex items-center gap-3 text-ink-700 dark:text-ink-300">
                <item.icon className="h-5 w-5 text-brand-500" aria-hidden="true" />
                {item.text}
              </motion.li>
            ))}
          </motion.ul>
          <motion.div variants={fadeUp} className="mt-8">
            <Link to="/signup">
              <Button size="lg">
                Build my plan
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={scaleIn}
        >
          <Card className="p-0">
            <div className="border-b border-ink-200 p-6 dark:border-ink-800">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-semibold tracking-wide text-ink-900 dark:text-ink-100">
                  Weekly plan
                </h3>
                <span className="flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  <Flame className="h-4 w-4" aria-hidden="true" />
                  {planPreview.calories} kcal
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Protein', value: planPreview.protein, color: 'text-accent-600' },
                  { label: 'Carbs', value: planPreview.carbs, color: 'text-brand-600' },
                  { label: 'Fat', value: planPreview.fat, color: 'text-amber-600' },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-ink-50 p-3 dark:bg-ink-800">
                    <p className={`font-display text-2xl font-bold ${m.color}`}>{m.value}g</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <ul className="divide-y divide-ink-100 dark:divide-ink-800">
              {planPreview.days.map((d) => (
                <li key={d.day} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${d.count > 0 ? 'bg-accent-500' : 'bg-ink-300 dark:bg-ink-600'}`} aria-hidden="true" />
                    <span className="font-semibold text-ink-800 dark:text-ink-200">{d.day}</span>
                  </div>
                  <span className="text-sm text-ink-500 dark:text-ink-400">
                    {d.count > 0 ? `${d.focus} · ${d.count} exercises` : 'Rest day'}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="bg-ink-50 py-24 dark:bg-ink-900">
      <div className="mx-auto max-w-3xl px-4">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="text-center font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100"
        >
          Frequently asked questions
        </motion.h2>
        <div className="mt-12 flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.question}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              custom={i}
            >
              <details className="group rounded-2xl border border-ink-200 bg-white p-5 open:pb-6 dark:border-ink-800 dark:bg-ink-950">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg font-semibold tracking-wide text-ink-900 dark:text-ink-100 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <Activity className="h-5 w-5 shrink-0 text-brand-500 transition-transform group-open:rotate-90" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-ink-500 dark:text-ink-400">{faq.answer}</p>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  const { user } = useAuth()
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={scaleIn}
        className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-16 text-center text-white md:px-16"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 20%, #f97316 0%, transparent 45%), radial-gradient(circle at 70% 80%, #22c55e 0%, transparent 45%)',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <TrendingUp className="mx-auto mb-6 h-12 w-12 text-brand-400" aria-hidden="true" />
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-wide md:text-5xl">
            Ready to start your fitness journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-300">
            Join FitWise today and get a plan built for your body and your goals.
          </p>
          <div className="mt-8">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg">
                  Go to your dashboard
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="lg">
                  Get started free
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <PlanPreview />
      <Faq />
      <FinalCta />
    </>
  )
}
