import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Sparkles, RotateCcw } from 'lucide-react';
import type { Preferences } from '@/lib/recommend';
import { EMPTY_PREFERENCES } from '@/lib/recommend';
import { CATEGORIES, THEMES } from '@/lib/types';
import type { AssetCategory, AssetTheme } from '@/lib/types';
import { COLOR_OPTIONS } from '@/lib/recommend';

interface Props {
  onComplete: (prefs: Preferences) => void;
  initial: Preferences;
}

const STEPS = [
  'categories',
  'themes',
  'colors',
  'price',
  'detail',
] as const;
type StepKey = (typeof STEPS)[number];

export function QuizView({ onComplete, initial }: Props) {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<Preferences>(initial);

  const stepKey = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const toggle = <K extends keyof Preferences>(key: K, value: Preferences[K] extends Array<infer U> ? U : never) => {
    setPrefs((p) => {
      const arr = p[key] as unknown[];
      const exists = arr.includes(value);
      return {
        ...p,
        [key]: exists
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      } as Preferences;
    });
  };

  const next = () => {
    if (isLast) {
      onComplete(prefs);
    } else {
      setStep((s) => s + 1);
    }
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const canProceed = (() => {
    if (stepKey === 'categories') return prefs.categories.length > 0;
    if (stepKey === 'themes') return prefs.themes.length > 0;
    return true;
  })();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center gap-2 chip bg-brand-500/15 text-brand-300 border border-brand-500/30">
          <Sparkles className="h-3.5 w-3.5" /> Preference Quiz
        </div>
        <h1 className="font-display text-3xl font-bold">Discover your style</h1>
        <p className="mt-2 text-ink-300">
          Answer a few questions and we'll recommend assets that fit your taste.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-brand-400' : 'bg-ink-700'
            }`}
          />
        ))}
      </div>

      <div className="card-surface p-6 md:p-8 animate-fadeIn" key={step}>
        {stepKey === 'categories' && (
          <Step
            title="What kind of assets do you need?"
            hint="Select all that apply"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <SelectCard
                  key={c.value}
                  label={c.label}
                  selected={prefs.categories.includes(c.value)}
                  onClick={() => toggle('categories', c.value as AssetCategory)}
                />
              ))}
            </div>
          </Step>
        )}

        {stepKey === 'themes' && (
          <Step
            title="Which themes excite you?"
            hint="Pick the worlds you build in"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {THEMES.map((t) => (
                <SelectCard
                  key={t}
                  label={t}
                  selected={prefs.themes.includes(t)}
                  onClick={() => toggle('themes', t as AssetTheme)}
                />
              ))}
            </div>
          </Step>
        )}

        {stepKey === 'colors' && (
          <Step
            title="What's your color palette?"
            hint="Choose colors that fit your project's mood"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => toggle('colors', c.name)}
                  className={`group flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    prefs.colors.includes(c.name)
                      ? 'border-brand-400 bg-brand-900/30 shadow-glow'
                      : 'border-ink-600/40 bg-ink-800/50 hover:border-ink-500'
                  }`}
                >
                  <span
                    className="h-8 w-8 rounded-full ring-2 ring-ink-900"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-sm font-medium text-ink-100">{c.name}</span>
                  {prefs.colors.includes(c.name) && (
                    <Check className="ml-auto h-4 w-4 text-brand-400" />
                  )}
                </button>
              ))}
            </div>
          </Step>
        )}

        {stepKey === 'price' && (
          <Step title="What's your budget?" hint="We'll prioritize deals in your range">
            <div className="grid gap-3">
              {(
                [
                  ['free', 'Free assets only', 'Show me what I can grab for free'],
                  ['under25', 'Under $25', 'Budget-friendly picks'],
                  ['under50', 'Under $50', 'Mid-range quality assets'],
                  ['any', 'No limit', 'Show me everything'],
                ] as const
              ).map(([value, title, desc]) => (
                <RadioCard
                  key={value}
                  title={title}
                  desc={desc}
                  selected={prefs.priceRange === value}
                  onClick={() => setPrefs((p) => ({ ...p, priceRange: value }))}
                />
              ))}
            </div>
          </Step>
        )}

        {stepKey === 'detail' && (
          <Step title="How detailed should they be?" hint="Polygon density matters for performance">
            <div className="grid gap-3">
              {(
                [
                  ['low', 'Low-poly', 'Optimized for mobile & web'],
                  ['medium', 'Medium', 'Balanced for most games'],
                  ['high', 'High-detail', 'Cinematic & AAA quality'],
                  ['any', 'Any detail level', 'Surprise me'],
                ] as const
              ).map(([value, title, desc]) => (
                <RadioCard
                  key={value}
                  title={title}
                  desc={desc}
                  selected={prefs.detail === value}
                  onClick={() => setPrefs((p) => ({ ...p, detail: value }))}
                />
              ))}
            </div>
          </Step>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="btn-ghost disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrefs(EMPTY_PREFERENCES)}
              className="btn-ghost text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
            <button onClick={next} disabled={!canProceed} className="btn-primary">
              {isLast ? (
                <>
                  See recommendations <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continue <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink-400">
        Step {step + 1} of {STEPS.length}
      </p>
    </div>
  );
}

function Step({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mb-5 text-sm text-ink-400">{hint}</p>
      {children}
    </div>
  );
}

function SelectCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
        selected
          ? 'border-brand-400 bg-brand-900/30 shadow-glow'
          : 'border-ink-600/40 bg-ink-800/50 hover:border-ink-500 hover:bg-ink-800'
      }`}
    >
      <span className="font-medium text-ink-100">{label}</span>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
          selected ? 'border-brand-400 bg-brand-500' : 'border-ink-500'
        }`}
      >
        {selected && <Check className="h-3.5 w-3.5 text-white" />}
      </span>
    </button>
  );
}

function RadioCard({
  title,
  desc,
  selected,
  onClick,
}: {
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
        selected
          ? 'border-brand-400 bg-brand-900/30 shadow-glow'
          : 'border-ink-600/40 bg-ink-800/50 hover:border-ink-500 hover:bg-ink-800'
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
          selected ? 'border-brand-400' : 'border-ink-500'
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />}
      </span>
      <div>
        <p className="font-medium text-ink-100">{title}</p>
        <p className="text-xs text-ink-400">{desc}</p>
      </div>
    </button>
  );
}
