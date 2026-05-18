import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Fingerprint,
  Globe2,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from 'lucide-react'

type Env = 'sandbox' | 'hml' | 'prod'

const ENV_META: Record<Env, { label: string; tone: string; hint: string }> = {
  sandbox: {
    label: 'sandbox',
    tone: 'border-info/30 bg-info/10 text-info',
    hint: 'dados sintéticos · sem impacto em prod',
  },
  hml: {
    label: 'homologação',
    tone: 'border-warning/30 bg-warning/10 text-warning',
    hint: 'pré-prod · espelho de produção',
  },
  prod: {
    label: 'produção',
    tone: 'border-success/30 bg-success/10 text-success',
    hint: 'tráfego real · ações auditadas',
  },
}

const ENGINES: Array<{ name: string; status: 'ok' | 'warn'; latency: string }> = [
  { name: 'Kaptain', status: 'ok', latency: 'p99 142ms' },
  { name: 'Komply', status: 'ok', latency: 'p99 88ms' },
  { name: 'Konstructor', status: 'ok', latency: 'p99 312ms' },
  { name: 'Orkestra', status: 'warn', latency: 'p99 901ms' },
  { name: 'Traffik', status: 'ok', latency: 'p99 64ms' },
  { name: 'Pantheon', status: 'ok', latency: 'p99 156ms' },
  { name: 'Migration', status: 'ok', latency: 'p99 240ms' },
]

const TICKER: Array<{ kind: 'build' | 'deploy' | 'rollout' | 'migration'; sa: string; detail: string; ago: string }> = [
  { kind: 'deploy', sa: 'ssa-pix-core', detail: 'canário 25% → 50% em prod', ago: 'há 12s' },
  { kind: 'build', sa: 'ssa-conta-corrente', detail: 'Konstructor #4821 success', ago: 'há 38s' },
  { kind: 'rollout', sa: 'ssa-cartoes-credito', detail: 'aguardando aprovação humana', ago: 'há 1min' },
  { kind: 'migration', sa: 'ssa-investimentos', detail: 'dual-write janela 12/14', ago: 'há 2min' },
  { kind: 'deploy', sa: 'ssa-emprestimo-pf', detail: 'rollback automático · SLO violado', ago: 'há 3min' },
  { kind: 'build', sa: 'ssa-cambio-corporate', detail: 'Komply bloqueou: imagem base não aprovada', ago: 'há 4min' },
]

const TICKER_TONE: Record<(typeof TICKER)[number]['kind'], string> = {
  build: 'text-info',
  deploy: 'text-accent',
  rollout: 'text-warning',
  migration: 'text-success',
}

const RECENT_LOGINS: Array<{ user: string; method: 'sso' | 'token' | 'matrícula'; at: string }> = [
  { user: 'luigi.maranzato', method: 'sso', at: 'há 4min' },
  { user: 'patricia.alves', method: 'sso', at: 'há 11min' },
  { user: 'ci-bot@konstructor', method: 'token', at: 'há 17min' },
]

export default function Login() {
  const navigate = useNavigate()
  const [env, setEnv] = useState<Env>('hml')
  const [envOpen, setEnvOpen] = useState(false)
  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState<'sso' | 'creds' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tickerIdx, setTickerIdx] = useState(0)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => {
      setTickerIdx((i) => (i + 1) % TICKER.length)
      setNow(new Date())
    }, 2400)
    return () => clearInterval(id)
  }, [])

  const visibleTicker = useMemo(() => {
    const out: typeof TICKER = []
    for (let i = 0; i < 4; i++) {
      out.push(TICKER[(tickerIdx + i) % TICKER.length])
    }
    return out
  }, [tickerIdx])

  const enginesOk = ENGINES.filter((e) => e.status === 'ok').length

  const isMatriculaValid = /^[tfc]-?\d{5,7}$/i.test(user.trim())
  const canSubmit = isMatriculaValid && pwd.length >= 6 && !loading

  const handleSso = () => {
    setError(null)
    setLoading('sso')
    setTimeout(() => {
      setLoading(null)
      navigate('/')
    }, 1200)
  }

  const handleCreds = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setLoading('creds')
    setTimeout(() => {
      if (pwd === 'fail') {
        setError('Credenciais inválidas ou MFA não confirmado.')
        setLoading(null)
        return
      }
      setLoading(null)
      navigate('/')
    }, 1400)
  }

  const envBadge = ENV_META[env]
  const buildHash = 'a7570b5'
  const region = 'sa-east-1'
  const hhmm = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="relative flex min-h-screen w-full bg-bg text-text-primary">
      {/* sutil background grid */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
      >
        <defs>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#FF6B2C" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Lado esquerdo — painel de marca + telemetria da plataforma */}
      <aside className="relative z-10 hidden w-[520px] flex-col justify-between border-r border-border bg-[#0C0D10] px-10 py-10 lg:flex">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/15 ring-1 ring-accent/40">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="leading-tight">
              <div className="text-[14px] font-semibold tracking-tight">StackSpot</div>
              <div className="text-[11.5px] text-text-secondary">Management Plane · Itaú</div>
            </div>
          </div>

          <h1 className="mt-10 text-[24px] font-semibold leading-tight tracking-tight">
            Operação Vanilla sem fricção:
            <br />
            <span className="text-accent">build · deploy · migration · rollout.</span>
          </h1>
          <p className="mt-3 max-w-[400px] text-[13px] leading-relaxed text-text-secondary">
            O portal interno sobre os 7 motores deterministas. Onboarde uma SA, dispare workflows
            agênticos e acompanhe a saúde das aplicações on-platform — tudo em pt-BR.
          </p>

          {/* Status dos motores */}
          <div className="mt-8 rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
                </span>
                <span className="text-[12px] font-medium">7 motores deterministas</span>
              </div>
              <span className="font-mono text-[10.5px] text-text-muted">
                {enginesOk}/{ENGINES.length} ok
              </span>
            </div>
            <ul className="grid grid-cols-2 gap-0">
              {ENGINES.map((e, i) => (
                <li
                  key={e.name}
                  className={`flex items-center justify-between gap-2 border-border px-3 py-2 ${
                    i % 2 === 0 ? 'border-r' : ''
                  } ${i < ENGINES.length - 2 ? 'border-b' : ''} ${
                    i === ENGINES.length - 1 && ENGINES.length % 2 !== 0 ? 'col-span-2' : ''
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 flex-none rounded-full ${
                        e.status === 'ok' ? 'bg-success' : 'bg-warning'
                      }`}
                    />
                    <span className="truncate text-[11.5px] text-text-primary">{e.name}</span>
                  </div>
                  <span className="flex-none font-mono text-[10px] text-text-muted">{e.latency}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ticker de plataforma */}
          <div className="mt-4 rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-accent" />
                <span className="text-[12px] font-medium">Atividade ao vivo</span>
              </div>
              <span className="font-mono text-[10.5px] text-text-muted">{hhmm} BRT</span>
            </div>
            <ul className="divide-y divide-border">
              {visibleTicker.map((t, i) => (
                <li
                  key={`${tickerIdx}-${i}`}
                  className="flex items-center gap-2.5 px-3 py-2"
                >
                  <span
                    className={`flex-none rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider ${TICKER_TONE[t.kind]}`}
                  >
                    {t.kind}
                  </span>
                  <span className="truncate font-mono text-[11px] text-text-secondary">{t.sa}</span>
                  <span className="min-w-0 flex-1 truncate text-[11px] text-text-muted">
                    {t.detail}
                  </span>
                  <span className="flex-none font-mono text-[10.5px] text-text-muted">{t.ago}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10.5px] text-text-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-success" />
            <span>acesso auditado · LGPD · ISO 27001</span>
          </div>
          <span className="font-mono">© Itaú Unibanco · v2.4.1</span>
        </div>
      </aside>

      {/* Lado direito — formulário */}
      <main className="relative z-10 flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          {/* Header mobile (substitui o painel esquerdo no <lg) */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/15 ring-1 ring-accent/40">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="leading-tight">
              <div className="text-[14px] font-semibold tracking-tight">StackSpot</div>
              <div className="text-[11.5px] text-text-secondary">Management Plane · Itaú</div>
            </div>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
              acesso restrito
            </span>
          </div>
          <h2 className="text-[22px] font-semibold tracking-tight">Acessar Management Plane</h2>
          <p className="mt-1.5 text-[12.5px] text-text-secondary">
            Use SSO Itaú para entrar com sua matrícula corporativa. Tokens de serviço (CI/CD) devem
            usar a aba <span className="font-mono text-text-primary">matrícula</span> com a chave
            rotacionada pelo Vault.
          </p>

          {/* Seletor de ambiente */}
          <div className="mt-6">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-text-muted">
              ambiente
            </label>
            <div className="relative mt-1.5">
              <button
                type="button"
                onClick={() => setEnvOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-left text-[12.5px] transition hover:border-border-strong"
              >
                <div className="flex items-center gap-2">
                  <Globe2 className="h-3.5 w-3.5 text-text-secondary" />
                  <span
                    className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${envBadge.tone}`}
                  >
                    {envBadge.label}
                  </span>
                  <span className="text-text-secondary">{envBadge.hint}</span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 flex-none text-text-muted transition ${
                    envOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {envOpen && (
                <ul className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-border bg-surface shadow-xl">
                  {(['sandbox', 'hml', 'prod'] as Env[]).map((e) => {
                    const meta = ENV_META[e]
                    return (
                      <li key={e}>
                        <button
                          type="button"
                          onClick={() => {
                            setEnv(e)
                            setEnvOpen(false)
                          }}
                          className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[12px] hover:bg-bg ${
                            env === e ? 'bg-bg' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider ${meta.tone}`}
                            >
                              {meta.label}
                            </span>
                            <span className="text-text-secondary">{meta.hint}</span>
                          </div>
                          {env === e && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* SSO primário */}
          <button
            type="button"
            onClick={handleSso}
            disabled={loading !== null}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-[13px] font-semibold text-black transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === 'sso' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecionando para SSO Itaú…
              </>
            ) : (
              <>
                <Fingerprint className="h-4 w-4" />
                Continuar com SSO Itaú
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10.5px] uppercase tracking-wider text-text-muted">
              ou usar matrícula
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Form de credenciais */}
          <form onSubmit={handleCreds} className="space-y-3" noValidate>
            <div>
              <label
                htmlFor="user"
                className="block text-[11px] font-medium uppercase tracking-wider text-text-muted"
              >
                matrícula
              </label>
              <div
                className={`mt-1.5 flex items-center gap-2 rounded-md border bg-surface px-3 py-2 transition focus-within:border-accent ${
                  user && !isMatriculaValid ? 'border-failure/60' : 'border-border'
                }`}
              >
                <KeyRound className="h-3.5 w-3.5 flex-none text-text-muted" />
                <input
                  id="user"
                  type="text"
                  autoComplete="username"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="t-123456"
                  className="flex-1 bg-transparent font-mono text-[12.5px] text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                {user && (
                  <span
                    className={`flex-none rounded px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider ${
                      isMatriculaValid
                        ? 'border border-success/30 bg-success/10 text-success'
                        : 'border border-failure/30 bg-failure/10 text-failure'
                    }`}
                  >
                    {isMatriculaValid ? 'ok' : 'inválida'}
                  </span>
                )}
              </div>
              <div className="mt-1 text-[10.5px] text-text-muted">
                formato <span className="font-mono">t-XXXXXX</span> (colaborador),{' '}
                <span className="font-mono">f-XXXXXX</span> (terceiro) ou{' '}
                <span className="font-mono">c-XXXXXX</span> (consultor).
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="pwd"
                  className="block text-[11px] font-medium uppercase tracking-wider text-text-muted"
                >
                  senha
                </label>
                <button
                  type="button"
                  className="text-[10.5px] text-accent hover:text-accent-hover"
                  onClick={(e) => e.preventDefault()}
                >
                  esqueci minha senha
                </button>
              </div>
              <div className="mt-1.5 flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 focus-within:border-accent">
                <Lock className="h-3.5 w-3.5 flex-none text-text-muted" />
                <input
                  id="pwd"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-[12.5px] text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={showPwd ? 'ocultar senha' : 'mostrar senha'}
                  onClick={() => setShowPwd((v) => !v)}
                  className="flex h-5 w-5 flex-none items-center justify-center rounded text-text-muted hover:bg-bg hover:text-text-primary"
                >
                  {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 pt-1 text-[11.5px] text-text-secondary">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border bg-bg accent-accent"
              />
              Manter conectado neste dispositivo por 8h
            </label>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-failure/40 bg-failure/10 px-3 py-2 text-[11.5px] text-failure">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-[13px] font-semibold text-text-primary transition hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === 'creds' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Autenticando…
                </>
              ) : (
                <>
                  <TerminalSquare className="h-4 w-4" />
                  Entrar com matrícula
                </>
              )}
            </button>
          </form>

          {/* Acessos recentes deste dispositivo */}
          <div className="mt-7 rounded-md border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                acessos recentes neste dispositivo
              </span>
              <button
                type="button"
                className="text-[10.5px] text-accent hover:text-accent-hover"
                onClick={(e) => e.preventDefault()}
              >
                limpar
              </button>
            </div>
            <ul>
              {RECENT_LOGINS.map((r) => (
                <li
                  key={r.user}
                  className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 last:border-b-0"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-bg text-[10px] font-medium text-text-secondary">
                      {r.user.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="truncate font-mono text-[11.5px] text-text-primary">
                      {r.user}
                    </span>
                    <span className="flex-none rounded border border-border bg-bg px-1.5 py-0.5 text-[9.5px] uppercase tracking-wider text-text-muted">
                      {r.method}
                    </span>
                  </div>
                  <span className="flex-none font-mono text-[10.5px] text-text-muted">{r.at}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer técnico */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-text-muted">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-success opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              <span>plataforma operacional</span>
              <span>·</span>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="hover:text-text-primary"
              >
                status.itau-mp.internal
              </a>
            </div>
            <div className="font-mono">
              build <span className="text-text-secondary">{buildHash}</span> · {region}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
