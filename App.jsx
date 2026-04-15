import { useEffect, useMemo, useState } from 'react';
import {
  Baby,
  Moon,
  Milk,
  Clock3,
  Plus,
  Trash2,
  Filter,
  BarChart3,
  Heart,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { hasSupabaseEnv, supabase } from './lib/supabase';

const entryTypes = [
  { value: 'breastfeeding', label: 'Amning' },
  { value: 'pumped', label: 'Brystpumpet mælk' },
  { value: 'formula', label: 'Modermælkserstatning' },
  { value: 'sleep', label: 'Søvn' },
];

const todayString = () => new Date().toISOString().slice(0, 10);
const currentTimeString = () => new Date().toTimeString().slice(0, 5);

const emptyForm = () => ({
  date: todayString(),
  time: currentTimeString(),
  type: 'breastfeeding',
  amount: '',
  duration: '',
  side: 'Venstre',
  note: '',
});

function formatType(type) {
  return entryTypes.find((item) => item.value === type)?.label || type;
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => {
    const aValue = new Date(`${a.date}T${a.time}:00`).getTime();
    const bValue = new Date(`${b.date}T${b.time}:00`).getTime();
    return bValue - aValue;
  });
}

function SetupCard() {
  return (
    <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-neutral-200">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Setup mangler</p>
          <h1 className="text-2xl font-semibold tracking-tight">Tilføj Supabase miljøvariabler</h1>
        </div>
      </div>

      <p className="mt-6 text-sm leading-7 text-neutral-600">
        Appen er klar til login og synkronisering, men mangler Supabase forbindelse.
        Udfyld <code>.env</code> med projektets URL og publishable key, og deploy derefter igen.
      </p>

      <div className="mt-6 rounded-3xl bg-neutral-100 p-5 font-mono text-sm text-neutral-800">
        <div>VITE_SUPABASE_URL=https://your-project-ref.supabase.co</div>
        <div>VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key</div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          'Login med email og password',
          'Synkronisering mellem telefoner',
          'Sikret med Row Level Security',
        ].map((item) => (
          <div key={item} className="rounded-2xl bg-neutral-100 px-4 py-4 text-sm text-neutral-700">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const action = mode === 'login'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password });

    const { error: authError } = await action;

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (mode === 'signup') {
      setMessage('Konto oprettet. Hvis email-bekræftelse er slået til i Supabase, skal du bekræfte mailen først.');
    } else {
      onAuth?.();
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-10">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-neutral-200">
        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
          <Smartphone className="h-4 w-4" />
          PWA med cloud sync
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          BabyCare Tracker som rigtig delt app.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
          Log ind på flere enheder og hold styr på amning, brystpumpet mælk,
          modermælkserstatning og søvn med samme data på tværs af telefoner.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            'Samme konto på begge telefoner',
            'Data gemmes i Supabase',
            'PWA kan installeres på startskærmen',
          ].map((item) => (
            <div key={item} className="rounded-3xl bg-neutral-100 p-4 text-sm text-neutral-700">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-neutral-200">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Adgang</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          {mode === 'login' ? 'Log ind' : 'Opret konto'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
            />
          </div>

          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Arbejder...' : mode === 'login' ? 'Log ind' : 'Opret konto'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((current) => (current === 'login' ? 'signup' : 'login'));
            setError('');
            setMessage('');
          }}
          className="mt-4 text-sm font-medium text-neutral-700 underline underline-offset-4"
        >
          {mode === 'login' ? 'Har du ikke en konto? Opret en' : 'Har du allerede en konto? Log ind'}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasSupabaseEnv || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id || !supabase) {
      setEntries([]);
      return;
    }

    let ignore = false;

    async function loadEntries() {
      setLoading(true);
      setError('');
      const { data, error: loadError } = await supabase
        .from('entries')
        .select('*')
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (ignore) return;

      if (loadError) {
        setError(loadError.message);
      } else {
        setEntries(sortEntries(data || []));
      }
      setLoading(false);
    }

    loadEntries();

    const channel = supabase
      .channel(`entries-${session.user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entries', filter: `user_id=eq.${session.user.id}` },
        () => {
          loadEntries();
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const visibleEntries = useMemo(() => {
    return sortEntries(
      entries.filter((entry) => {
        const matchesType = filter === 'all' ? true : entry.type === filter;
        const matchesDate = selectedDate ? entry.date === selectedDate : true;
        return matchesType && matchesDate;
      })
    );
  }, [entries, filter, selectedDate]);

  const todayEntries = useMemo(() => entries.filter((entry) => entry.date === todayString()), [entries]);

  const stats = useMemo(() => {
    const feedingsToday = todayEntries.filter((entry) => entry.type !== 'sleep').length;
    const sleepMinutes = todayEntries
      .filter((entry) => entry.type === 'sleep')
      .reduce((sum, entry) => sum + Number(entry.duration || 0), 0);
    const pumpedMl = todayEntries
      .filter((entry) => entry.type === 'pumped')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const formulaMl = todayEntries
      .filter((entry) => entry.type === 'formula')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const lastBreastfeeding = sortEntries(todayEntries.filter((entry) => entry.type === 'breastfeeding'))[0];

    return [
      { label: 'Mælk i dag', value: String(feedingsToday), icon: Milk },
      { label: 'Søvn i dag', value: `${Math.floor(sleepMinutes / 60)} t ${sleepMinutes % 60} min`, icon: Moon },
      { label: 'Pumpet mælk', value: `${pumpedMl} ml`, icon: BarChart3 },
      { label: 'Erstatning', value: `${formulaMl} ml`, icon: Clock3 },
      { label: 'Sidste amning', value: lastBreastfeeding ? lastBreastfeeding.time : '—', icon: Heart },
    ];
  }, [todayEntries]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm());
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!session?.user?.id || !supabase) return;

    setSaving(true);
    setError('');

    const payload = {
      user_id: session.user.id,
      date: form.date,
      time: form.time,
      type: form.type,
      amount: form.type === 'sleep' || form.type === 'breastfeeding' ? null : Number(form.amount || 0),
      duration: form.type === 'sleep' || form.type === 'breastfeeding' ? Number(form.duration || 0) : null,
      side: form.type === 'breastfeeding' ? form.side : null,
      note: form.note || '',
    };

    const { error: insertError } = await supabase.from('entries').insert(payload);

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSelectedDate(form.date);
    resetForm();
  }

  async function deleteEntry(id) {
    if (!supabase) return;
    const { error: deleteError } = await supabase.from('entries').delete().eq('id', id);
    if (deleteError) setError(deleteError.message);
  }

  async function clearAll() {
    if (!supabase || !session?.user?.id) return;
    const confirmed = window.confirm('Vil du slette alle dine registreringer?');
    if (!confirmed) return;
    const { error: deleteError } = await supabase.from('entries').delete().eq('user_id', session.user.id);
    if (deleteError) setError(deleteError.message);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  if (!hasSupabaseEnv) {
    return (
      <div className="min-h-screen bg-neutral-100 px-4 py-10 md:px-6">
        <SetupCard />
      </div>
    );
  }

  if (loading && !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <div className="rounded-3xl bg-white px-6 py-5 text-sm text-neutral-700 shadow-sm ring-1 ring-neutral-200">
          Forbinder til Supabase...
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-white">
              <Baby className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Privat PWA med cloud sync</p>
              <h1 className="text-lg font-semibold tracking-tight">BabyCare Tracker</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-2xl bg-neutral-100 px-4 py-2 text-sm text-neutral-700 md:block">
              {session.user.email}
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              <LogOut className="h-4 w-4" /> Log ud
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-neutral-200 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
              <Heart className="h-4 w-4" />
              Synkroniseret mellem enheder
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Track mælk, søvn og amning ét sted.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
              Log ind med samme konto på begge telefoner for at dele data.
              Registreringer gemmes i Supabase og vises på tværs af enheder.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-3xl bg-neutral-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-neutral-500">{item.label}</p>
                      <Icon className="h-4 w-4 text-neutral-500" />
                    </div>
                    <p className="mt-3 text-xl font-semibold tracking-tight">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-[28px] bg-neutral-900 p-5 text-white md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Seneste aktiviteter</p>
                  <h3 className="mt-1 text-xl font-semibold">Dagens hurtige overblik</h3>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-neutral-800 px-3 py-2 text-sm text-neutral-200 transition hover:bg-neutral-700"
                >
                  <RefreshCw className="h-4 w-4" /> Opdatér
                </button>
              </div>

              <div className="space-y-3">
                {entries.length === 0 ? (
                  <div className="rounded-2xl bg-neutral-800 p-4 text-sm text-neutral-300">
                    Ingen registreringer endnu.
                  </div>
                ) : (
                  sortEntries(entries).slice(0, 4).map((entry) => (
                    <div key={entry.id} className="rounded-2xl bg-neutral-800 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{formatType(entry.type)}</p>
                          <p className="text-sm text-neutral-400">{entry.date} · {entry.note || 'Ingen note'}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p>{entry.time}</p>
                          <p className="text-neutral-400">
                            {entry.type === 'sleep' || entry.type === 'breastfeeding'
                              ? `${entry.duration || 0} min${entry.side ? ` · ${entry.side}` : ''}`
                              : `${entry.amount || 0} ml`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-neutral-200 md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Ny registrering</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight">Tilføj aktivitet</h3>
              </div>
              <div className="rounded-2xl bg-neutral-100 p-3 text-neutral-700">
                <Plus className="h-5 w-5" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {entryTypes.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => updateField('type', item.value)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                        form.type === item.value
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-300 bg-neutral-50 text-neutral-800 hover:bg-neutral-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Dato</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Tidspunkt</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => updateField('time', e.target.value)}
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              {(form.type === 'formula' || form.type === 'pumped') && (
                <div>
                  <label className="mb-2 block text-sm font-medium">Mængde (ml)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={(e) => updateField('amount', e.target.value)}
                    placeholder="fx 120"
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                  />
                </div>
              )}

              {(form.type === 'sleep' || form.type === 'breastfeeding') && (
                <div>
                  <label className="mb-2 block text-sm font-medium">Varighed (minutter)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.duration}
                    onChange={(e) => updateField('duration', e.target.value)}
                    placeholder="fx 18"
                    className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                  />
                </div>
              )}

              {form.type === 'breastfeeding' && (
                <div>
                  <label className="mb-2 block text-sm font-medium">Side</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Venstre', 'Højre', 'Begge'].map((side) => (
                      <button
                        key={side}
                        type="button"
                        onClick={() => updateField('side', side)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                          form.side === side
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-300 bg-neutral-50 text-neutral-800 hover:bg-neutral-100'
                        }`}
                      >
                        {side}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">Note</label>
                <textarea
                  rows={4}
                  value={form.note}
                  onChange={(e) => updateField('note', e.target.value)}
                  placeholder="fx sov hurtigt, urolig, drak det hele"
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? 'Gemmer...' : 'Gem registrering'}
              </button>
            </form>
          </div>
        </section>

        <section className="mt-6 rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-neutral-200 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Historik</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">Se og filtrér registreringer</h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 md:min-w-[540px]">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium"><Filter className="h-4 w-4" /> Type</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="all">Alle</option>
                  {entryTypes.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Dato</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilter('all');
                    setSelectedDate('');
                  }}
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
                >
                  Fjern filtre
                </button>
              </div>
            </div>
          </div>

          {error ? <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <div className="mt-6 space-y-3">
            {loading ? (
              <div className="rounded-2xl bg-neutral-100 p-5 text-sm text-neutral-600">Henter registreringer...</div>
            ) : visibleEntries.length === 0 ? (
              <div className="rounded-2xl bg-neutral-100 p-5 text-sm text-neutral-600">
                Ingen registreringer matcher filtrene.
              </div>
            ) : (
              visibleEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-4 rounded-3xl bg-neutral-100 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700 ring-1 ring-neutral-200">
                        {formatType(entry.type)}
                      </span>
                      <span className="text-sm text-neutral-500">{entry.date}</span>
                      <span className="text-sm text-neutral-500">{entry.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-700">{entry.note || 'Ingen note'}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-neutral-200">
                      {entry.type === 'sleep' || entry.type === 'breastfeeding'
                        ? `${entry.duration || 0} min${entry.side ? ` · ${entry.side}` : ''}`
                        : `${entry.amount || 0} ml`}
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="rounded-2xl border border-neutral-300 bg-white p-3 text-neutral-700 transition hover:bg-neutral-50"
                      aria-label="Slet registrering"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <div className="mb-3 flex items-center gap-2">
              <Milk className="h-5 w-5" />
              <h4 className="text-lg font-semibold">Mælketyper</h4>
            </div>
            <div className="space-y-2 text-sm text-neutral-700">
              <div className="rounded-2xl bg-neutral-100 px-4 py-3">Amning med valg af venstre, højre eller begge</div>
              <div className="rounded-2xl bg-neutral-100 px-4 py-3">Brystpumpet mælk med antal ml</div>
              <div className="rounded-2xl bg-neutral-100 px-4 py-3">Modermælkserstatning med antal ml</div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <div className="mb-3 flex items-center gap-2">
              <Moon className="h-5 w-5" />
              <h4 className="text-lg font-semibold">Søvn</h4>
            </div>
            <div className="space-y-2 text-sm text-neutral-700">
              <div className="rounded-2xl bg-neutral-100 px-4 py-3">Registrér søvn med dato, tidspunkt og minutter</div>
              <div className="rounded-2xl bg-neutral-100 px-4 py-3">Få samlet søvntid for dagen øverst på siden</div>
              <div className="rounded-2xl bg-neutral-100 px-4 py-3">Filtrér historik på en bestemt dato</div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <h4 className="text-lg font-semibold">Cloud og sikkerhed</h4>
            </div>
            <div className="space-y-3 text-sm text-neutral-700">
              <div className="rounded-2xl bg-neutral-100 px-4 py-3">Data gemmes i Supabase</div>
              <div className="rounded-2xl bg-neutral-100 px-4 py-3">RLS begrænser hver bruger til egne rækker</div>
              <div className="rounded-2xl bg-neutral-100 px-4 py-3">Brug samme login på begge enheder for delt visning</div>
              <button
                onClick={clearAll}
                className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left font-medium text-red-700 transition hover:bg-red-100"
              >
                Slet alle data
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
