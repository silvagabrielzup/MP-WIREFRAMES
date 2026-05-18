import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ShieldCheck,
  KeyRound,
  Terminal,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Lock,
  ChevronDown,
  Activity,
  Boxes,
  GitBranch,
  Zap,
  Info,
} from 'lucide-react'

type MotorStatus = 'ok' | 'warn' | 'fail'

const MOTORES: { name: string; role: string; status: MotorStatus; latency: string }[] = [
  { name: 'Kaptain', role: 'CD · AWS', status: 'ok', latency: '142 ms' },
  { name: 'Komply', role: 'policies', status: 'ok', latency: '88 ms' },
  { name: 'Konstructor', role: 'build', status: 'ok', latency: '210 ms' },
  { name: 'Orkestra', role: 'K8s', status: 'warn', latency: '512 ms' },
  { name: 'Traffik', role: 'routing · DNS', status: 'ok', latency: '64 ms' },
  { name: 'Pantheon', role: 'Kafka', status: 'ok', latency: '102 ms' },
  { name: 'Migration', role: 'data', status: 'ok', latency: '178 ms' },
]

const STATUS_DOT: Record<MotorStatus, string> = {
  ok: 'bg-success',
  warn: 'bg-warning',
  fail: 'bg-failure',
}

const STATUS_LABEL: Record<MotorStatus, string> = {
  ok: 'ok',
  warn: 'degradado',
  fail: 'falha',
}

const RECENT_ACTIVITY = [
  { id: 'wf-8421', sa: 'ssa-pix-core', verb: 'deploy', state: 'success', when: '2s' },
  { id: 'wf-8420', sa: 'ssa-conta-corrente', verb: 'migration', state: 'running', when: '14s' },
  { id: 'wf-8419', sa: 'ssa-cartoes-credito', verb: 'build', state: 'success', when: '47s' },
  { id: 'wf-8418', sa: 'ssa-investimentos', verb: 'rollout', state: 'awaiting', when: '1m 12s' },
  { id: 'wf-8417', sa: 'ssa-pix-core', verb: 'build', state: 'success', when: '2m 04s' },
]

const STATE_TONE: Record<string, string> = {
  success: 'text-success',
  running: 'text-live',
  awaiting: 'text-warning',
  failed: 'text-failure',
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [env, setEnv] = useState<'prod' | 'staging' | 'dev'>('prod')
  const [envOpen, setEnvOpen] = useState(false)

  function handleSso() {
    setLoading(true)
    setTimeout(() => navigate('/'), 900)
  }

  return (
    <div className="flex min-h-screen w-full bg-bg text-text-primary">
      {/* Left panel — branding + live platform status */}
      <aside className="relative hidden w-[58%] flex-col justify-between overflow-hidden border-r border-border bg-[#0C0D10] px-12 py-10 lg:flex">
        {/* faint gradient accent */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-accent/[0.07] blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-[360px] w-[360px] rounded-full bg-info/[0.05] blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/15 ring-1 ring-accent/40">
              <Sparkles className="h-4.5 w-4.5 text-accent" />
            </div>
            <div className="leading-tight">
              <div className="text-[14px] font-semibold tracking-tight">StackSpot</div>
              <div className="text-[11.5px] text-text-secondary">Management Plane · Itaú</div>
            </div>
          </div>

          <div className="mt-14 max-w-[520px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-2.5 py-1 text-[11px] text-text-secondary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
              </span>
              plataforma operando · 1.842 SAs ON-PLAT
            </div>
            <h1 className="mt-4 text-[34px] font-semibold leading-[1.1] tracking-tight">
              A interface humana sobre a plataforma{' '}
              <span className="text-accent">agêntica</span>.
            </h1>
            <p className="mt-3 text-[13.5px] leading-relaxed text-text-secondary">
              Observabilidade em tempo real dos workflows do Claude Code, dos 7 motores
              deterministas, e do inventário de SAs migradas. Governável, auditável,
              consumível por humanos e agentes.
            </p>
          </div>
        </div>

        {/* live platform status panel */}
        <div className="relative grid grid-cols-12 gap-4">
          {/* motores grid */}
          <div className="col-span-7 rounded-lg border border-border bg-surface/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-text-secondary" />
                <span className="text-[11.5px] font-medium text-text-secondary">
                  7 motores deterministas
                </span>
              </div>
              <span className="font-mono text-[10.5px] text-text-muted">
                upd. 2s · /status
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {MOTORES.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between gap-2 rounded-md border border-border/70 bg-bg/40 px-2.5 py-1.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[m.status]}`} />
                    <div className="min-w-0">
                      <div className="truncate text-[11.5px] font-medium text-text-primary">
                        {m.name}
                      </div>
                      <div className="truncate text-[10px] text-text-muted">{m.role}</div>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-text-secondary">
                    {m.latency}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-md border border-warning/30 bg-warning/[0.06] px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-warning" />
                  <span className="text-[10.5px] text-warning">
                    Orkestra · {STATUS_LABEL.warn}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-text-muted">P95</span>
              </div>
            </div>
          </div>

          {/* kpis + activity */}
          <div className="col-span-5 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Kpi
                icon={Zap}
                label="workflows ativos"
                value="142"
                delta="+12"
                tone="text-live"
              />
              <Kpi
                icon={GitBranch}
                label="deploys hoje"
                value="318"
                delta="+8%"
                tone="text-success"
              />
              <Kpi
                icon={Boxes}
                label="SAs ON-PLAT"
                value="1.842"
                delta="+24"
                tone="text-text-secondary"
              />
              <Kpi
                icon={ShieldCheck}
                label="IUConfia médio"
                value="92"
                delta="+1.4"
                tone="text-success"
              />
            </div>

            <div className="flex-1 rounded-lg border border-border bg-surface/70 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-medium text-text-secondary">
                  últimas execuções
                </span>
                <span className="font-mono text-[10px] text-text-muted">live</span>
              </div>
              <ul className="space-y-1.5">
                {RECENT_ACTIVITY.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-2 text-[11px]"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          row.state === 'running'
                            ? 'bg-live animate-pulse-live'
                            : row.state === 'awaiting'
                              ? 'bg-warning'
                              : row.state === 'failed'
                                ? 'bg-failure'
                                : 'bg-success'
                        }`}
                      />
                      <span className="font-mono text-text-secondary">{row.id}</span>
                      <span className="truncate font-mono text-text-muted">{row.sa}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className={`uppercase tracking-wide text-[9.5px] ${STATE_TONE[row.state]}`}>
                        {row.verb}
                      </span>
                      <span className="font-mono text-[10px] text-text-muted">{row.when}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-between text-[10.5px] text-text-muted">
          <div className="flex items-center gap-3">
            <span>v0.1.0 · proto</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>build 2026.05.18</span>
          </div>
          <a className="hover:text-text-secondary" href="#">
            status.stackspot.itau →
          </a>
        </div>
      </aside>

      {/* Right panel — login */}
      <main className="flex w-full flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border px-6 lg:px-10">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 ring-1 ring-accent/40">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-[12.5px] font-semibold tracking-tight">
              StackSpot · MP
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setEnvOpen((v) => !v)}
                className="flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-[11.5px] text-text-secondary hover:border-border-strong"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    env === 'prod'
                      ? 'bg-success'
                      : env === 'staging'
                        ? 'bg-warning'
                        : 'bg-info'
                  }`}
                />
                <span className="font-mono uppercase">{env}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {envOpen && (
                <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-md border border-border bg-surface-2 text-[11.5px] shadow-lg">
                  {(['prod', 'staging', 'dev'] as const).map((e) => (
                    <button
                      key={e}
                      onClick={() => {
                        setEnv(e)
                        setEnvOpen(false)
                      }}
                      className="flex w-full items-center justify-between px-3 py-1.5 text-text-secondary hover:bg-surface hover:text-text-primary"
                    >
                      <span className="font-mono uppercase">{e}</span>
                      {env === e && <CheckCircle2 className="h-3 w-3 text-accent" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a
              href="#"
              className="hidden h-8 items-center rounded-md border border-border bg-surface px-2.5 text-[11.5px] text-text-secondary hover:border-border-strong sm:flex"
            >
              docs ↗
            </a>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-10">
          <div className="w-full max-w-[400px]">
            <div className="mb-7">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-2 py-0.5 text-[10.5px] text-text-secondary">
                <Lock className="h-2.5 w-2.5" />
                acesso restrito · funcionários Itaú
              </div>
              <h2 className="mt-3 text-[24px] font-semibold tracking-tight">Entrar</h2>
              <p className="mt-1 text-[12.5px] text-text-secondary">
                Use seu e-mail corporativo. A autenticação acontece via SSO Itaú.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[11px] font-medium text-text-secondary"
                >
                  E-mail corporativo
                </label>
                <div className="flex items-center rounded-md border border-border bg-surface px-3 py-2 focus-within:border-border-strong">
                  <Fingerprint className="mr-2 h-3.5 w-3.5 text-text-muted" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="luiz.almeida@itau-unibanco.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10.5px] text-text-muted">
                  <Info className="h-2.5 w-2.5" />
                  domínios aceitos: @itau-unibanco.com.br, @itau.com.br, @zup.com.br
                </div>
              </div>

              <button
                onClick={handleSso}
                disabled={loading}
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent text-[13px] font-medium text-bg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-bg opacity-80" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-bg" />
                    </span>
                    Redirecionando para SSO Itaú…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Entrar com SSO Itaú
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 py-1 text-[10.5px] uppercase tracking-wider text-text-muted">
                <span className="h-px flex-1 bg-border" />
                ou
                <span className="h-px flex-1 bg-border" />
              </div>

              <button className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-surface px-3 text-[12.5px] text-text-primary transition hover:border-border-strong">
                <span className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-text-secondary" />
                  Token de acesso (MFA hardware)
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
              </button>

              <button className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-surface px-3 text-[12.5px] text-text-primary transition hover:border-border-strong">
                <span className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-text-secondary" />
                  Vinculei a sessão a partir da CLI
                </span>
                <span className="font-mono text-[10.5px] text-text-muted">stk login</span>
              </button>
            </div>

            <div className="mt-6 rounded-md border border-info/25 bg-info/[0.06] p-3">
              <div className="flex gap-2.5">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
                <div className="text-[11.5px] leading-relaxed text-text-secondary">
                  <span className="font-medium text-text-primary">
                    Primeiro acesso?
                  </span>{' '}
                  Solicite habilitação no portal{' '}
                  <span className="font-mono text-info">acesso.itau</span> com o perfil{' '}
                  <span className="font-mono text-info">stackspot-mp.user</span>. Aprovação
                  típica em ~2h úteis.
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-text-muted">
              <span>
                ao entrar, você aceita a{' '}
                <a href="#" className="text-text-secondary hover:text-text-primary">
                  política de uso aceitável
                </a>
                .
              </span>
              <span className="flex items-center gap-3">
                <a href="#" className="hover:text-text-secondary">
                  ajuda
                </a>
                <a href="#" className="hover:text-text-secondary">
                  status
                </a>
                <a href="#" className="hover:text-text-secondary">
                  suporte
                </a>
              </span>
            </div>
          </div>
        </div>

        <footer className="flex h-10 items-center justify-between border-t border-border px-6 text-[10.5px] text-text-muted lg:px-10">
          <span>© Itaú Unibanco · uso interno</span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
            </span>
            sso.itau · online
          </span>
        </footer>
      </main>
    </div>
  )
}

function Kpi({
  icon: Icon,
  label,
  value,
  delta,
  tone,
}: {
  icon: typeof Activity
  label: string
  value: string
  delta: string
  tone: string
}) {
  return (
    <div className="rounded-lg border border-border bg-surface/70 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <Icon className="h-3 w-3 text-text-muted" />
        <span className={`font-mono text-[10px] ${tone}`}>{delta}</span>
      </div>
      <div className="mt-1.5 text-[18px] font-semibold tracking-tight text-text-primary">
        {value}
      </div>
      <div className="text-[10.5px] text-text-muted">{label}</div>
    </div>
  )
}
