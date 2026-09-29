import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react'
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
import { TiltCard } from '../components/TiltCard'
import { EASE, fadeUp, scaleIn, stagger } from '../lib/animations'

const HERO_IMG =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'
const FEATURE_IMG_1 =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop'
const FEATURE_IMG_2 =
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop'
const FEATURE_IMG_3 =
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop'
const PLAN_IMG =
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop'

const features = [
  {
    icon: Calculator,
    title: 'Fitness calculators',
    description: 'BMI, BMR, TDEE, and macro calculators — instant, in your browser.',
    image: FEATURE_IMG_1,
  },
  {
    icon: Sparkles,
    title: 'AI workout & nutrition plans',
    description: 'Answer a few questions and get a personalized weekly plan in seconds.',
    image: FEATURE_IMG_2,
  },
  {
    icon: LineChart,
    title: 'Progress tracking',
    description: 'Log your weight over time and watch your progress with clear charts.',
    image: FEATURE_IMG_3,
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
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 })
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 })

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouse}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/70 to-ink-950" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(249,115,22,0.18) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(34,197,94,0.14) 0%, transparent 40%)',
          }}
        />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto max-w-6xl px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1.5 text-sm font-semibold text-brand-300 backdrop-blur"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          AI-powered fitness planning
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="mx-auto max-w-4xl font-display text-6xl font-bold leading-[1.05] tracking-wide text-white md:text-8xl"
        >
          Your body. Your goal.{' '}
          <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
            Your plan.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-ink-300 md:text-xl"
        >
          FitWise builds a personalized workout and nutrition plan from your body stats, then helps you track
          every step of your progress.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          style={{ transform: 'translateZ(60px)' }}
        >
          <motion.div style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }} className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4">
            {[
              { icon: Flame, value: '2150', label: 'kcal target' },
              { icon: Dumbbell, value: '5-day', label: 'workout split' },
              { icon: Utensils, value: '140g', label: 'protein' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{ transform: 'translateZ(40px)' }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
              >
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-brand-400" aria-hidden="true" />
                <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <Link to="/dashboard">
              <Button size="lg">
                Go to your dashboard
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-white/60" />
        </motion.div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="text-center"
      >
        <motion.h2 variants={fadeUp} className="font-display text-4xl font-bold tracking-wide text-ink-100 md:text-5xl">
          How it works
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-ink-400">
          Three steps between you and a plan built for your body.
        </motion.p>
      </motion.div>
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={i}
          >
            <TiltCard className="h-full rounded-3xl border border-ink-800 bg-ink-900 p-8">
              <span className="font-display text-7xl font-bold text-brand-500/20" aria-hidden="true">
                {step.number}
              </span>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-wide text-ink-100">
                {step.title}
              </h3>
              <p className="mt-2 text-ink-400">{step.description}</p>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2 variants={fadeUp} className="font-display text-4xl font-bold tracking-wide text-ink-100 md:text-5xl">
            Everything you need
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-ink-400">
            The tools to plan, track, and crush your fitness goals.
          </motion.p>
        </motion.div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={i}
            >
              <TiltCard className="group h-full overflow-hidden rounded-3xl border border-ink-800 bg-ink-900">
                <div className="relative h-44 overflow-hidden bg-ink-800">
                  <img
                    src={feature.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-wide text-ink-100">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-ink-400">{feature.description}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlanPreview() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-28">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-4 py-1.5 text-sm font-semibold text-accent-400"
          >
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            Sample plan
          </motion.span>
          <motion.h2 variants={fadeUp} className="font-display text-4xl font-bold tracking-wide text-ink-100 md:text-5xl">
            A plan that adapts to you
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-ink-400">
            Get daily calorie and macro targets plus a full weekly workout split — with rest days built in.
          </motion.p>
          <motion.ul variants={stagger} className="mt-8 flex flex-col gap-4">
            {[
              { icon: Flame, text: 'Daily calorie target based on your goal' },
              { icon: Utensils, text: 'Protein, carb, and fat targets in grams' },
              { icon: Dumbbell, text: 'A weekly workout split with sets and reps' },
              { icon: Target, text: 'Practical nutrition tips and guidance' },
            ].map((item, i) => (
              <motion.li key={item.text} variants={fadeUp} custom={i} className="flex items-center gap-3 text-ink-300">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15">
                  <item.icon className="h-5 w-5 text-brand-400" aria-hidden="true" />
                </span>
                {item.text}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={scaleIn}
        >
          <TiltCard intensity={6} className="overflow-hidden rounded-3xl border border-ink-800">
            <div className="relative h-52 bg-ink-800">
              <img src={PLAN_IMG} alt="" className="h-full w-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="font-display text-2xl font-semibold text-white">Weekly plan</p>
                  <p className="text-sm text-ink-300">Personalized to your stats</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1.5 text-sm font-bold text-brand-300 backdrop-blur">
                  <Flame className="h-4 w-4" aria-hidden="true" />
                  {planPreview.calories} kcal
                </span>
              </div>
            </div>
            <div className="bg-ink-900 p-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Protein', value: planPreview.protein, color: 'text-accent-400' },
                  { label: 'Carbs', value: planPreview.carbs, color: 'text-brand-400' },
                  { label: 'Fat', value: planPreview.fat, color: 'text-amber-400' },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-ink-800 p-3">
                    <p className={`font-display text-2xl font-bold ${m.color}`}>{m.value}g</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{m.label}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-4 divide-y divide-ink-800">
                {planPreview.days.map((d) => (
                  <li key={d.day} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${d.count > 0 ? 'bg-accent-500' : 'bg-ink-600'}`} aria-hidden="true" />
                      <span className="font-medium text-ink-200">{d.day}</span>
                    </div>
                    <span className="text-sm text-ink-400">
                      {d.count > 0 ? `${d.focus} · ${d.count} exercises` : 'Rest day'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="relative mx-auto max-w-3xl px-4 py-28">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className="text-center font-display text-4xl font-bold tracking-wide text-ink-100 md:text-5xl"
      >
        Frequently asked questions
      </motion.h2>
      <div className="mt-16 flex flex-col gap-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={faq.question}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            custom={i}
          >
            <details className="group rounded-2xl border border-ink-800 bg-ink-900 p-6 open:pb-6">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg font-semibold tracking-wide text-ink-100 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Activity className="h-5 w-5 shrink-0 text-brand-500 transition-transform group-open:rotate-90" aria-hidden="true" />
              </summary>
              <p className="mt-3 text-ink-400">{faq.answer}</p>
            </details>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function FinalCta() {
  const { user } = useAuth()
  return (
    <section className="mx-auto max-w-6xl px-4 py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={scaleIn}
        className="relative overflow-hidden rounded-3xl border border-ink-800 bg-ink-900 px-6 py-20 text-center md:px-16"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 20%, rgba(249,115,22,0.4) 0%, transparent 45%), radial-gradient(circle at 70% 80%, rgba(34,197,94,0.3) 0%, transparent 45%)',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <TrendingUp className="mx-auto mb-6 h-12 w-12 text-brand-400" aria-hidden="true" />
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-wide text-white md:text-5xl">
            Ready to start your fitness journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-300">
            Join FitWise today and get a plan built for your body and your goals.
          </p>
          <div className="mt-10">
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
