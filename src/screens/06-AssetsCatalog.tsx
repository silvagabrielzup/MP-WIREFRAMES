import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
  X,
  ChevronDown,
  Boxes,
  Cable,
  Container,
  Database,
  ListOrdered,
  GitBranch,
  Bot,
  Sparkles,
  ShieldCheck,
  Activity,
  Users,
  CheckCircle2,
  Workflow,
  Rocket,
  Clock3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PlusCircle,
  Radar,
  Hammer,
  Network,
  GitMerge,
  Plug,
  Zap,
  CircleDot,
} from 'lucide-react'

type AssetType =
  | 'sa'
  | 'api'
  | 'container'
  | 'dynamodb'
  | 'sqs'
  | 'monorepo'
  | 'agent'
  | 'skill'
  | 'mcp'
  | 'sensor'
  | 'policy'
  | 'workflow'
  | 'group'

const typeChips: { id: AssetType; label: string; icon: typeof Boxes; count: number }[] = [
  { id: 'sa', label: 'SAs', icon: Boxes, count: 312 },
  { id: 'api', label: 'APIs', icon: Cable, count: 1284 },
  { id: 'container', label: 'Containers', icon: Container, count: 487 },
  { id: 'dynamodb', label: 'DynamoDB', icon: Database, count: 226 },
  { id: 'sqs', label: 'SQS', icon: ListOrdered, count: 138 },
  { id: 'monorepo', label: 'MonoRepos', icon: GitBranch, count: 24 },
  { id: 'agent', label: 'Agentes', icon: Bot, count: 41 },
  { id: 'skill', label: 'Skills', icon: Sparkles, count: 92 },
  { id: 'mcp', label: 'MCP Tools', icon: Plug, count: 56 },
  { id: 'sensor', label: 'Sensores', icon: Radar, count: 64 },
  { id: 'policy', label: 'Policies', icon: ShieldCheck, count: 318 },
  { id: 'workflow', label: 'Workflows', icon: Workflow, count: 19 },
  { id: 'group', label: 'Groups', icon: Users, count: 48 },
]

type SA = {
  sa: string
  display: string
  onPlat: boolean
  squad: string
  tribo: string
  ownerInitials: string
  ownerColor: string
  iuconfia: number
  iuconfiaDelta: number
  workflows7d: number
  deploys7d: number
  lastDeploy: string
  lastDeployStatus: 'success' | 'failure' | 'awaiting'
  tags: string[]
}

const sas: SA[] = [
  {
    sa: 'ssa-pix-core',
    display: 'PIX Core Engine',
    onPlat: true,
    squad: 'squad-pix',
    tribo: 'Pagamentos Instantâneos',
    ownerInitials: 'MR',
    ownerColor: 'bg-info/20 text-info',
    iuconfia: 92,
    iuconfiaDelta: 2,
    workflows7d: 31,
    deploys7d: 14,
    lastDeploy: '4m',
    lastDeployStatus: 'success',
    tags: ['critical', 'pix', 'tier-0'],
  },
  {
    sa: 'ssa-conta-corrente',
    display: 'Conta Corrente Service',
    onPlat: true,
    squad: 'squad-cc',
    tribo: 'Contas',
    ownerInitials: 'LL',
    ownerColor: 'bg-accent/25 text-accent',
    iuconfia: 88,
    iuconfiaDelta: 1,
    workflows7d: 22,
    deploys7d: 9,
    lastDeploy: '12m',
    lastDeployStatus: 'success',
    tags: ['core-banking', 'tier-0'],
  },
  {
    sa: 'ssa-credito-prefixado',
    display: 'Crédito Prefixado',
    onPlat: true,
    squad: 'squad-credito',
    tribo: 'Crédito',
    ownerInitials: 'AC',
    ownerColor: 'bg-success/20 text-success',
    iuconfia: 71,
    iuconfiaDelta: -4,
    workflows7d: 18,
    deploys7d: 6,
    lastDeploy: '38m',
    lastDeployStatus: 'failure',
    tags: ['credito', 'tier-1'],
  },
  {
    sa: 'ssa-12345',
    display: 'Platform Sandbox',
    onPlat: true,
    squad: 'squad-platform',
    tribo: 'Plataforma',
    ownerInitials: 'TS',
    ownerColor: 'bg-warning/20 text-warning',
    iuconfia: 96,
    iuconfiaDelta: 0,
    workflows7d: 47,
    deploys7d: 22,
    lastDeploy: '1h 02m',
    lastDeployStatus: 'success',
    tags: ['playground', 'internal'],
  },
  {
    sa: 'ssa-investimentos',
    display: 'Investimentos Backend',
    onPlat: true,
    squad: 'squad-invest',
    tribo: 'Investimentos',
    ownerInitials: 'JS',
    ownerColor: 'bg-failure/20 text-failure',
    iuconfia: 64,
    iuconfiaDelta: -8,
    workflows7d: 14,
    deploys7d: 3,
    lastDeploy: '2h 18m',
    lastDeployStatus: 'failure',
    tags: ['investimentos', 'tier-1'],
  },
  {
    sa: 'ssa-cartoes-debito',
    display: 'Cartões Débito Core',
    onPlat: true,
    squad: 'squad-cartoes',
    tribo: 'Cartões',
    ownerInitials: 'PV',
    ownerColor: 'bg-info/20 text-info',
    iuconfia: 84,
    iuconfiaDelta: 3,
    workflows7d: 26,
    deploys7d: 11,
    lastDeploy: '3h 41m',
    lastDeployStatus: 'success',
    tags: ['cartoes', 'tier-0'],
  },
  {
    sa: 'ssa-open-finance',
    display: 'Open Finance Gateway',
    onPlat: true,
    squad: 'squad-openfin',
    tribo: 'Open Finance',
    ownerInitials: 'CR',
    ownerColor: 'bg-accent/25 text-accent',
    iuconfia: 90,
    iuconfiaDelta: 1,
    workflows7d: 19,
    deploys7d: 7,
    lastDeploy: '5h 12m',
    lastDeployStatus: 'success',
    tags: ['open-finance', 'regulado', 'tier-0'],
  },
  {
    sa: 'ssa-onboarding-pf',
    display: 'Onboarding Pessoa Física',
    onPlat: true,
    squad: 'squad-onboarding',
    tribo: 'Aquisição',
    ownerInitials: 'DM',
    ownerColor: 'bg-success/20 text-success',
    iuconfia: 78,
    iuconfiaDelta: -1,
    workflows7d: 12,
    deploys7d: 5,
    lastDeploy: '6h 04m',
    lastDeployStatus: 'awaiting',
    tags: ['aquisicao', 'tier-1'],
  },
  {
    sa: 'ssa-fraud-engine',
    display: 'Antifraude em Tempo Real',
    onPlat: true,
    squad: 'squad-antifraude',
    tribo: 'Risco',
    ownerInitials: 'FB',
    ownerColor: 'bg-info/20 text-info',
    iuconfia: 94,
    iuconfiaDelta: 4,
    workflows7d: 33,
    deploys7d: 13,
    lastDeploy: '7h 22m',
    lastDeployStatus: 'success',
    tags: ['risco', 'ml', 'tier-0'],
  },
  {
    sa: 'ssa-emprestimo-consignado',
    display: 'Empréstimo Consignado',
    onPlat: true,
    squad: 'squad-consignado',
    tribo: 'Crédito',
    ownerInitials: 'RG',
    ownerColor: 'bg-warning/20 text-warning',
    iuconfia: 76,
    iuconfiaDelta: 0,
    workflows7d: 8,
    deploys7d: 2,
    lastDeploy: '11h 47m',
    lastDeployStatus: 'success',
    tags: ['credito', 'tier-2'],
  },
  {
    sa: 'ssa-extrato-pdf',
    display: 'Geração de Extratos PDF',
    onPlat: true,
    squad: 'squad-cc',
    tribo: 'Contas',
    ownerInitials: 'LL',
    ownerColor: 'bg-accent/25 text-accent',
    iuconfia: 81,
    iuconfiaDelta: 2,
    workflows7d: 9,
    deploys7d: 3,
    lastDeploy: '14h 03m',
    lastDeployStatus: 'success',
    tags: ['batch', 'tier-2'],
  },
  {
    sa: 'ssa-notificacoes',
    display: 'Notificações Push & E-mail',
    onPlat: true,
    squad: 'squad-engajamento',
    tribo: 'Engajamento',
    ownerInitials: 'AL',
    ownerColor: 'bg-success/20 text-success',
    iuconfia: 87,
    iuconfiaDelta: 5,
    workflows7d: 21,
    deploys7d: 10,
    lastDeploy: '17h 28m',
    lastDeployStatus: 'success',
    tags: ['comms', 'tier-1'],
  },
  {
    sa: 'ssa-iam-tokens',
    display: 'IAM · Token Service',
    onPlat: true,
    squad: 'squad-iam',
    tribo: 'Segurança',
    ownerInitials: 'GH',
    ownerColor: 'bg-info/20 text-info',
    iuconfia: 95,
    iuconfiaDelta: 0,
    workflows7d: 16,
    deploys7d: 5,
    lastDeploy: '21h 15m',
    lastDeployStatus: 'success',
    tags: ['security', 'tier-0'],
  },
  {
    sa: 'ssa-bff-mobile',
    display: 'BFF Mobile Itaú',
    onPlat: true,
    squad: 'squad-mobile',
    tribo: 'Canais Digitais',
    ownerInitials: 'NK',
    ownerColor: 'bg-accent/25 text-accent',
    iuconfia: 73,
    iuconfiaDelta: -3,
    workflows7d: 28,
    deploys7d: 12,
    lastDeploy: '23h 09m',
    lastDeployStatus: 'success',
    tags: ['canais', 'tier-0'],
  },
  {
    sa: 'ssa-cobranca-boleto',
    display: 'Cobrança Boleto',
    onPlat: false,
    squad: 'squad-cobranca',
    tribo: 'Cobrança',
    ownerInitials: 'EM',
    ownerColor: 'bg-text-muted/20 text-text-secondary',
    iuconfia: 58,
    iuconfiaDelta: -2,
    workflows7d: 0,
    deploys7d: 1,
    lastDeploy: '2d 04h',
    lastDeployStatus: 'success',
    tags: ['legacy', 'cobranca'],
  },
  {
    sa: 'ssa-camara-compensacao',
    display: 'Câmara de Compensação',
    onPlat: false,
    squad: 'squad-compensacao',
    tribo: 'Pagamentos',
    ownerInitials: 'WT',
    ownerColor: 'bg-text-muted/20 text-text-secondary',
    iuconfia: 52,
    iuconfiaDelta: -6,
    workflows7d: 0,
    deploys7d: 0,
    lastDeploy: '4d 12h',
    lastDeployStatus: 'failure',
    tags: ['legacy', 'batch'],
  },
  {
    sa: 'ssa-cambio-corporate',
    display: 'Câmbio Corporate',
    onPlat: true,
    squad: 'squad-cambio',
    tribo: 'Corporate',
    ownerInitials: 'BV',
    ownerColor: 'bg-warning/20 text-warning',
    iuconfia: 82,
    iuconfiaDelta: 1,
    workflows7d: 6,
    deploys7d: 2,
    lastDeploy: '1d 03h',
    lastDeployStatus: 'success',
    tags: ['corporate', 'regulado'],
  },
  {
    sa: 'ssa-mesa-renda-fixa',
    display: 'Mesa de Renda Fixa',
    onPlat: true,
    squad: 'squad-mesa',
    tribo: 'Tesouraria',
    ownerInitials: 'IS',
    ownerColor: 'bg-info/20 text-info',
    iuconfia: 89,
    iuconfiaDelta: 2,
    workflows7d: 11,
    deploys7d: 4,
    lastDeploy: '1d 09h',
    lastDeployStatus: 'success',
    tags: ['tesouraria', 'tier-1'],
  },
  {
    sa: 'ssa-callcenter-cti',
    display: 'CallCenter CTI',
    onPlat: false,
    squad: 'squad-atendimento',
    tribo: 'Atendimento',
    ownerInitials: 'OP',
    ownerColor: 'bg-text-muted/20 text-text-secondary',
    iuconfia: 49,
    iuconfiaDelta: -1,
    workflows7d: 0,
    deploys7d: 0,
    lastDeploy: '11d 02h',
    lastDeployStatus: 'success',
    tags: ['legacy', 'atendimento'],
  },
  {
    sa: 'ssa-seguros-residencial',
    display: 'Seguros Residencial',
    onPlat: true,
    squad: 'squad-seguros',
    tribo: 'Seguros',
    ownerInitials: 'CN',
    ownerColor: 'bg-success/20 text-success',
    iuconfia: 79,
    iuconfiaDelta: 3,
    workflows7d: 7,
    deploys7d: 3,
    lastDeploy: '1d 16h',
    lastDeployStatus: 'success',
    tags: ['seguros', 'tier-2'],
  },
  {
    sa: 'ssa-pix-saque',
    display: 'PIX Saque',
    onPlat: true,
    squad: 'squad-pix',
    tribo: 'Pagamentos Instantâneos',
    ownerInitials: 'MR',
    ownerColor: 'bg-info/20 text-info',
    iuconfia: 86,
    iuconfiaDelta: 1,
    workflows7d: 13,
    deploys7d: 5,
    lastDeploy: '1d 22h',
    lastDeployStatus: 'success',
    tags: ['pix', 'tier-1'],
  },
  {
    sa: 'ssa-data-lakehouse',
    display: 'Data Lakehouse Itaú',
    onPlat: true,
    squad: 'squad-data',
    tribo: 'Dados',
    ownerInitials: 'HL',
    ownerColor: 'bg-accent/25 text-accent',
    iuconfia: 91,
    iuconfiaDelta: 0,
    workflows7d: 24,
    deploys7d: 8,
    lastDeploy: '2d 11h',
    lastDeployStatus: 'success',
    tags: ['data', 'tier-1', 'analytics'],
  },
]

const owners = Array.from(new Set(sas.map((s) => s.squad)))
const tribos = Array.from(new Set(sas.map((s) => s.tribo)))
const tagPool = Array.from(new Set(sas.flatMap((s) => s.tags))).sort()

function Donut({ value, delta }: { value: number; delta: number }) {
  const radius = 16
  const circ = 2 * Math.PI * radius
  const dash = (value / 100) * circ
  const color =
    value >= 85 ? '#22C55E' : value >= 70 ? '#EAB308' : '#EF4444'
  const trackColor = '#22232A'
  return (
    <div className="relative flex h-[46px] w-[46px] items-center justify-center">
      <svg viewBox="0 0 40 40" className="h-[46px] w-[46px] -rotate-90">
        <circle cx="20" cy="20" r={radius} stroke={trackColor} strokeWidth="3.5" fill="none" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={color}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-mono text-[12px] font-semibold text-text-primary">{value}</span>
        {delta !== 0 && (
          <span
            className={`mt-0.5 font-mono text-[8.5px] ${
              delta > 0 ? 'text-success' : 'text-failure'
            }`}
          >
            {delta > 0 ? '+' : ''}
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}

function deployStatusDot(s: SA['lastDeployStatus']) {
  if (s === 'success') return 'bg-success'
  if (s === 'failure') return 'bg-failure'
  return 'bg-warning'
}

export default function AssetsCatalog() {
  const [activeType, setActiveType] = useState<AssetType>('sa')
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [onPlatOnly, setOnPlatOnly] = useState(false)
  const [scoreMin, setScoreMin] = useState(0)
  const [selectedOwners, setSelectedOwners] = useState<string[]>([])
  const [selectedTribos, setSelectedTribos] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>(['tier-0'])
  const [search, setSearch] = useState('')
  const [ownerOpen, setOwnerOpen] = useState(false)
  const [triboOpen, setTriboOpen] = useState(false)

  const filtered = useMemo(() => {
    return sas.filter((s) => {
      if (onPlatOnly && !s.onPlat) return false
      if (s.iuconfia < scoreMin) return false
      if (selectedOwners.length && !selectedOwners.includes(s.squad)) return false
      if (selectedTribos.length && !selectedTribos.includes(s.tribo)) return false
      if (selectedTags.length && !selectedTags.some((t) => s.tags.includes(t))) return false
      if (
        search &&
        !s.sa.toLowerCase().includes(search.toLowerCase()) &&
        !s.display.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [onPlatOnly, scoreMin, selectedOwners, selectedTribos, selectedTags, search])

  const onPlatCount = sas.filter((s) => s.onPlat).length
  const avgScore = Math.round(sas.reduce((a, s) => a + s.iuconfia, 0) / sas.length)

  const appliedCount =
    (onPlatOnly ? 1 : 0) +
    (scoreMin > 0 ? 1 : 0) +
    selectedOwners.length +
    selectedTribos.length +
    selectedTags.length +
    (search ? 1 : 0)

  function toggle<T>(arr: T[], item: T, set: (v: T[]) => void) {
    set(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item])
  }

  function clearAll() {
    setOnPlatOnly(false)
    setScoreMin(0)
    setSelectedOwners([])
    setSelectedTribos([])
    setSelectedTags([])
    setSearch('')
  }

  return (
    <div className="flex gap-6">
      {/* Main column */}
      <div className="min-w-0 flex-1 space-y-5">
        {/* Header */}
        <div>
          <nav className="flex items-center gap-1 text-[12px] text-text-muted">
            <span className="text-text-secondary">Assets Catalog</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{typeChips.find((c) => c.id === activeType)?.label ?? 'SAs'}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Todos</span>
          </nav>
          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[24px] font-semibold tracking-tight">Catálogo</h1>
              {activeType === 'sa' ? (
                <p className="mt-1 text-[12.5px] text-text-secondary">
                  <span className="text-text-primary">{sas.length}</span> SAs ·{' '}
                  <span className="text-success">{onPlatCount} ON-PLAT</span> ·{' '}
                  <span className="text-text-muted">{sas.length - onPlatCount} off-plat</span> · IUConfia médio{' '}
                  <span className="text-text-primary">{avgScore}</span>
                </p>
              ) : (
                <p className="mt-1 text-[12.5px] text-text-secondary">
                  Listando{' '}
                  <span className="text-text-primary">
                    {typeChips.find((c) => c.id === activeType)?.label}
                  </span>{' '}
                  do catálogo · troque o tipo nos chips abaixo
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-[260px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar no catálogo…"
                  className="h-9 w-full rounded-md border border-border bg-surface pl-8 pr-3 text-[12.5px] placeholder:text-text-muted focus:border-border-strong focus:outline-none"
                />
              </div>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black transition hover:bg-accent-hover">
                <PlusCircle className="h-4 w-4" />
                Onboardar SA
              </button>
            </div>
          </div>
        </div>

        {/* Type chips */}
        <div className="-mx-1 flex flex-wrap gap-1.5">
          {typeChips.map((c) => {
            const Icon = c.icon
            const active = c.id === activeType
            return (
              <button
                key={c.id}
                onClick={() => setActiveType(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] transition ${
                  active
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{c.label}</span>
                <span
                  className={`font-mono text-[10.5px] ${
                    active ? 'text-accent/80' : 'text-text-muted'
                  }`}
                >
                  {c.count}
                </span>
              </button>
            )
          })}
        </div>

        {activeType !== 'sa' && (
          <AltListing
            type={activeType}
            search={search}
            view={view}
            setView={setView}
          />
        )}

        {activeType === 'sa' && (
        <>
        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-text-muted">
            <Filter className="h-3.5 w-3.5" />
            Filtros
          </div>

          <div className="mx-1 h-5 w-px bg-border" />

          {/* ON-PLAT toggle */}
          <button
            onClick={() => setOnPlatOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] transition ${
              onPlatOnly
                ? 'border-success/40 bg-success/10 text-success'
                : 'border-border bg-bg text-text-secondary hover:text-text-primary'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${onPlatOnly ? 'bg-success' : 'bg-text-muted'}`} />
            Apenas ON-PLAT
          </button>

          {/* Owner multi-select */}
          <div className="relative">
            <button
              onClick={() => {
                setOwnerOpen((v) => !v)
                setTriboOpen(false)
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-[12px] text-text-secondary hover:text-text-primary"
            >
              Owner
              {selectedOwners.length > 0 && (
                <span className="rounded-sm bg-accent/20 px-1 font-mono text-[10px] text-accent">
                  {selectedOwners.length}
                </span>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
            </button>
            {ownerOpen && (
              <div className="absolute left-0 top-full z-30 mt-1 max-h-[280px] w-[220px] overflow-auto rounded-md border border-border bg-surface p-1.5 shadow-xl">
                {owners.map((o) => {
                  const checked = selectedOwners.includes(o)
                  return (
                    <button
                      key={o}
                      onClick={() => toggle(selectedOwners, o, setSelectedOwners)}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12px] text-text-secondary hover:bg-bg hover:text-text-primary"
                    >
                      <span
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
                          checked
                            ? 'border-accent bg-accent/30'
                            : 'border-border bg-transparent'
                        }`}
                      >
                        {checked && <CheckCircle2 className="h-2.5 w-2.5 text-accent" />}
                      </span>
                      {o}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Tribo multi-select */}
          <div className="relative">
            <button
              onClick={() => {
                setTriboOpen((v) => !v)
                setOwnerOpen(false)
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-[12px] text-text-secondary hover:text-text-primary"
            >
              Tribo
              {selectedTribos.length > 0 && (
                <span className="rounded-sm bg-accent/20 px-1 font-mono text-[10px] text-accent">
                  {selectedTribos.length}
                </span>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
            </button>
            {triboOpen && (
              <div className="absolute left-0 top-full z-30 mt-1 max-h-[280px] w-[240px] overflow-auto rounded-md border border-border bg-surface p-1.5 shadow-xl">
                {tribos.map((t) => {
                  const checked = selectedTribos.includes(t)
                  return (
                    <button
                      key={t}
                      onClick={() => toggle(selectedTribos, t, setSelectedTribos)}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12px] text-text-secondary hover:bg-bg hover:text-text-primary"
                    >
                      <span
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
                          checked
                            ? 'border-accent bg-accent/30'
                            : 'border-border bg-transparent'
                        }`}
                      >
                        {checked && <CheckCircle2 className="h-2.5 w-2.5 text-accent" />}
                      </span>
                      {t}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Score IUConfia range */}
          <div className="flex items-center gap-2 rounded-md border border-border bg-bg px-2.5 py-1.5">
            <span className="text-[11.5px] text-text-secondary">IUConfia</span>
            <span className="font-mono text-[11px] text-text-muted">≥</span>
            <input
              type="range"
              min={0}
              max={100}
              value={scoreMin}
              onChange={(e) => setScoreMin(parseInt(e.target.value, 10))}
              className="h-1 w-[120px] cursor-pointer appearance-none rounded-full bg-[#22232A] accent-accent"
            />
            <span
              className={`w-[26px] text-right font-mono text-[12px] ${
                scoreMin > 0 ? 'text-accent' : 'text-text-muted'
              }`}
            >
              {scoreMin}
            </span>
          </div>

          <div className="mx-1 h-5 w-px bg-border" />

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11.5px] text-text-secondary">Tags</span>
            {tagPool.map((tag) => {
              const active = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggle(selectedTags, tag, setSelectedTags)}
                  className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] transition ${
                    active
                      ? 'border-accent/40 bg-accent/10 text-accent'
                      : 'border-border bg-bg text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button className="flex h-7 items-center gap-1 rounded border border-border bg-bg px-2 text-[11.5px] text-text-secondary hover:text-text-primary">
              <ArrowUpDown className="h-3 w-3" />
              IUConfia ↓
            </button>
            <div className="flex h-7 items-center overflow-hidden rounded border border-border bg-bg">
              <button
                onClick={() => setView('grid')}
                className={`flex h-7 w-7 items-center justify-center ${
                  view === 'grid' ? 'bg-surface text-text-primary' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setView('table')}
                className={`flex h-7 w-7 items-center justify-center ${
                  view === 'table' ? 'bg-surface text-text-primary' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between text-[12px] text-text-secondary">
          <div>
            Mostrando <span className="text-text-primary">{filtered.length}</span> de {sas.length} SAs
          </div>
          {appliedCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-[11.5px] text-text-muted hover:text-text-primary"
            >
              <X className="h-3 w-3" />
              limpar {appliedCount} filtros
            </button>
          )}
        </div>

        {/* Grid view */}
        {view === 'grid' && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((s) => (
              <Link
                key={s.sa}
                to={`/assets/${s.sa}`}
                className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-border-strong hover:bg-[#181A1F]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-mono text-[13px] font-medium text-text-primary group-hover:text-accent">
                        {s.sa}
                      </span>
                      {s.onPlat ? (
                        <span className="flex-none rounded border border-success/30 bg-success/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-success">
                          ON-PLAT
                        </span>
                      ) : (
                        <span className="flex-none rounded border border-border bg-bg px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-text-muted">
                          off-plat
                        </span>
                      )}
                    </div>
                    <div className="mt-1 truncate text-[12px] text-text-secondary">{s.display}</div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-text-muted">
                      <span
                        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-medium ${s.ownerColor}`}
                      >
                        {s.ownerInitials}
                      </span>
                      <span className="truncate text-text-secondary">{s.squad}</span>
                      <span>·</span>
                      <span className="truncate">{s.tribo}</span>
                    </div>
                  </div>
                  <Donut value={s.iuconfia} delta={s.iuconfiaDelta} />
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-md border border-border bg-bg px-3 py-2.5">
                  <div>
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-muted">
                      <Workflow className="h-3 w-3" />
                      Workflows 7d
                    </div>
                    <div className="mt-0.5 font-mono text-[13px] text-text-primary">{s.workflows7d}</div>
                  </div>
                  <div className="border-l border-border pl-2">
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-muted">
                      <Rocket className="h-3 w-3" />
                      Deploys 7d
                    </div>
                    <div className="mt-0.5 font-mono text-[13px] text-text-primary">{s.deploys7d}</div>
                  </div>
                  <div className="border-l border-border pl-2">
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-muted">
                      <Clock3 className="h-3 w-3" />
                      Último
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 font-mono text-[12.5px] text-text-primary">
                      <span className={`h-1.5 w-1.5 rounded-full ${deployStatusDot(s.lastDeployStatus)}`} />
                      {s.lastDeploy}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${
                        selectedTags.includes(t)
                          ? 'border-accent/40 bg-accent/10 text-accent'
                          : 'border-border bg-bg text-text-muted'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Table view */}
        {view === 'table' && filtered.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="grid grid-cols-[1.6fr_1fr_0.7fr_0.5fr_0.5fr_0.6fr_1.1fr] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
              <div>SA</div>
              <div>Owner / Tribo</div>
              <div>IUConfia</div>
              <div className="text-right">WF 7d</div>
              <div className="text-right">Dep 7d</div>
              <div>Último</div>
              <div>Tags</div>
            </div>
            {filtered.map((s) => (
              <Link
                key={s.sa}
                to={`/assets/${s.sa}`}
                className="group grid grid-cols-[1.6fr_1fr_0.7fr_0.5fr_0.5fr_0.6fr_1.1fr] items-center border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12.5px] text-text-primary group-hover:text-accent">
                    {s.sa}
                  </span>
                  {s.onPlat && (
                    <span className="rounded border border-success/30 bg-success/10 px-1 py-0.5 text-[9px] font-medium uppercase text-success">
                      ON
                    </span>
                  )}
                </div>
                <div className="text-[11.5px] text-text-secondary">
                  <span className="text-text-primary">{s.squad}</span>
                  <span className="text-text-muted"> · {s.tribo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      s.iuconfia >= 85 ? 'bg-success' : s.iuconfia >= 70 ? 'bg-warning' : 'bg-failure'
                    }`}
                  />
                  <span className="font-mono text-[12.5px] text-text-primary">{s.iuconfia}</span>
                  <span
                    className={`flex items-center font-mono text-[10.5px] ${
                      s.iuconfiaDelta > 0
                        ? 'text-success'
                        : s.iuconfiaDelta < 0
                        ? 'text-failure'
                        : 'text-text-muted'
                    }`}
                  >
                    {s.iuconfiaDelta > 0 ? (
                      <TrendingUp className="mr-0.5 h-2.5 w-2.5" />
                    ) : s.iuconfiaDelta < 0 ? (
                      <TrendingDown className="mr-0.5 h-2.5 w-2.5" />
                    ) : null}
                    {s.iuconfiaDelta !== 0 && (s.iuconfiaDelta > 0 ? '+' : '')}
                    {s.iuconfiaDelta || '—'}
                  </span>
                </div>
                <div className="text-right font-mono text-[12px] text-text-secondary">{s.workflows7d}</div>
                <div className="text-right font-mono text-[12px] text-text-secondary">{s.deploys7d}</div>
                <div className="flex items-center gap-1.5 font-mono text-[11.5px] text-text-secondary">
                  <span className={`h-1.5 w-1.5 rounded-full ${deployStatusDot(s.lastDeployStatus)}`} />
                  {s.lastDeploy}
                </div>
                <div className="flex flex-wrap gap-1 overflow-hidden">
                  {s.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded border border-border bg-bg px-1 py-0.5 font-mono text-[9.5px] text-text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface px-6 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg ring-1 ring-border">
              <Boxes className="h-5 w-5 text-text-muted" />
            </div>
            <div>
              <div className="text-[14px] font-medium text-text-primary">Nenhum asset corresponde</div>
              <div className="mt-1 text-[12px] text-text-secondary">
                Ajuste os filtros ou{' '}
                <button
                  onClick={clearAll}
                  className="text-accent underline-offset-2 hover:underline"
                >
                  limpe todos
                </button>{' '}
                pra ver o catálogo completo.
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>

      {/* Right sidebar */}
      <aside className="hidden w-[280px] flex-none xl:block">
        {activeType !== 'sa' ? (
          <AltSidebar type={activeType} />
        ) : (
        <div className="sticky top-[80px] space-y-4">
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-[12.5px] font-semibold tracking-tight">Filtros aplicados</h3>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10.5px] text-accent">
                {appliedCount}
              </span>
            </div>
            <div className="p-3">
              {appliedCount === 0 && (
                <p className="text-[11.5px] text-text-muted">
                  Nenhum filtro ativo. Você está vendo o catálogo completo.
                </p>
              )}
              <div className="flex flex-col gap-2">
                {search && (
                  <FilterChip label={`busca: "${search}"`} onRemove={() => setSearch('')} />
                )}
                {onPlatOnly && (
                  <FilterChip label="ON-PLAT apenas" onRemove={() => setOnPlatOnly(false)} />
                )}
                {scoreMin > 0 && (
                  <FilterChip label={`IUConfia ≥ ${scoreMin}`} onRemove={() => setScoreMin(0)} />
                )}
                {selectedOwners.map((o) => (
                  <FilterChip
                    key={o}
                    label={`owner: ${o}`}
                    onRemove={() => toggle(selectedOwners, o, setSelectedOwners)}
                  />
                ))}
                {selectedTribos.map((t) => (
                  <FilterChip
                    key={t}
                    label={`tribo: ${t}`}
                    onRemove={() => toggle(selectedTribos, t, setSelectedTribos)}
                  />
                ))}
                {selectedTags.map((t) => (
                  <FilterChip
                    key={t}
                    label={`#${t}`}
                    onRemove={() => toggle(selectedTags, t, setSelectedTags)}
                  />
                ))}
              </div>
            </div>
            <div className="border-t border-border px-4 py-3">
              <div className="text-[10.5px] uppercase tracking-wider text-text-muted">Resultados</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-[22px] font-semibold text-text-primary">
                  {filtered.length}
                </span>
                <span className="text-[11.5px] text-text-muted">de {sas.length} SAs</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#22232A]">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(filtered.length / sas.length) * 100}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded border border-border bg-bg px-2 py-1.5">
                  <div className="text-text-muted">ON-PLAT</div>
                  <div className="mt-0.5 font-mono text-[12.5px] text-success">
                    {filtered.filter((s) => s.onPlat).length}
                  </div>
                </div>
                <div className="rounded border border-border bg-bg px-2 py-1.5">
                  <div className="text-text-muted">IUConfia médio</div>
                  <div className="mt-0.5 font-mono text-[12.5px] text-text-primary">
                    {filtered.length
                      ? Math.round(
                          filtered.reduce((a, s) => a + s.iuconfia, 0) / filtered.length,
                        )
                      : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-[12.5px] font-semibold tracking-tight">Saúde do catálogo</h3>
            </div>
            <div className="p-3">
              <DistRow
                label="IUConfia ≥ 85"
                value={sas.filter((s) => s.iuconfia >= 85).length}
                total={sas.length}
                color="bg-success"
              />
              <DistRow
                label="70 ≤ IUConfia < 85"
                value={sas.filter((s) => s.iuconfia >= 70 && s.iuconfia < 85).length}
                total={sas.length}
                color="bg-warning"
              />
              <DistRow
                label="IUConfia < 70"
                value={sas.filter((s) => s.iuconfia < 70).length}
                total={sas.length}
                color="bg-failure"
              />
              <div className="mt-3 flex items-center gap-2 rounded-md border border-warning/30 bg-warning/5 px-2.5 py-2 text-[11.5px] text-warning">
                <AlertTriangle className="h-3.5 w-3.5 flex-none" />
                <span>3 SAs caíram de score em 7d</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-[12.5px] font-semibold tracking-tight">Atividade no catálogo</h3>
            </div>
            <ul className="text-[11.5px]">
              <ActivityRow
                icon={PlusCircle}
                tone="success"
                text="ssa-pix-saque onboardada"
                ago="2h"
              />
              <ActivityRow
                icon={Activity}
                tone="info"
                text="ssa-fraud-engine subiu IUConfia 90 → 94"
                ago="6h"
              />
              <ActivityRow
                icon={TrendingDown}
                tone="failure"
                text="ssa-investimentos caiu IUConfia 72 → 64"
                ago="1d"
              />
              <ActivityRow
                icon={CheckCircle2}
                tone="success"
                text="ssa-cambio-corporate concluiu migration"
                ago="2d"
              />
            </ul>
          </div>
        </div>
        )}
      </aside>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-bg px-2 py-1.5 text-[11.5px] text-text-secondary">
      <span className="truncate">{label}</span>
      <button
        onClick={onRemove}
        className="flex h-4 w-4 flex-none items-center justify-center rounded text-text-muted hover:bg-surface hover:text-text-primary"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

function DistRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-center justify-between text-[11.5px] text-text-secondary">
        <span>{label}</span>
        <span className="font-mono text-text-primary">
          {value} <span className="text-text-muted">({pct}%)</span>
        </span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#22232A]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function ActivityRow({
  icon: Icon,
  tone,
  text,
  ago,
}: {
  icon: typeof Activity
  tone: 'success' | 'failure' | 'info'
  text: string
  ago: string
}) {
  const color =
    tone === 'success' ? 'text-success bg-success/15' : tone === 'failure' ? 'text-failure bg-failure/15' : 'text-info bg-info/15'
  return (
    <li className="flex items-center gap-2.5 border-b border-border px-4 py-2.5 last:border-b-0">
      <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-md ${color}`}>
        <Icon className="h-3 w-3" />
      </span>
      <span className="min-w-0 flex-1 truncate text-text-secondary">{text}</span>
      <span className="flex-none font-mono text-[10.5px] text-text-muted">{ago}</span>
    </li>
  )
}

/* ──────────────────────────────────────────────────────────────
   Alt listings — Workflows, Skills, MCP Tools, Sensores
   ────────────────────────────────────────────────────────────── */

type WorkflowItem = {
  name: string
  type: 'onboarding' | 'build' | 'deploy' | 'rollout' | 'migration' | 'custom'
  engines: ('kaptain' | 'komply' | 'konstructor' | 'orkestra' | 'traffik' | 'pantheon' | 'migration')[]
  runs7d: number
  successRate: number
  p95: string
  saUsage: number
  owner: string
  lastStatus: 'success' | 'failure' | 'running' | 'awaiting'
  lastAt: string
  trend: number[]
  tags: string[]
}

const workflows: WorkflowItem[] = [
  { name: 'onboarding-vanilla-brownfield', type: 'onboarding', engines: ['konstructor', 'kaptain', 'komply', 'orkestra'], runs7d: 47, successRate: 94.1, p95: '6m 12s', saUsage: 22, owner: 'squad-platform', lastStatus: 'running', lastAt: 'agora', trend: [3,5,4,6,8,12,9], tags: ['vanilla', 'core'] },
  { name: 'rollout-canary', type: 'rollout', engines: ['kaptain', 'traffik', 'orkestra'], runs7d: 38, successRate: 96.8, p95: '11m 04s', saUsage: 18, owner: 'squad-platform', lastStatus: 'running', lastAt: 'agora', trend: [4,6,5,7,8,6,9], tags: ['canary'] },
  { name: 'migration-pix-to-pix2', type: 'migration', engines: ['migration', 'pantheon', 'komply'], runs7d: 12, successRate: 83.3, p95: '38m 41s', saUsage: 4, owner: 'squad-pix', lastStatus: 'awaiting', lastAt: '14m', trend: [1,2,2,3,1,4,2], tags: ['pix', 'data'] },
  { name: 'build-and-test', type: 'build', engines: ['konstructor'], runs7d: 184, successRate: 98.4, p95: '2m 11s', saUsage: 87, owner: 'squad-platform', lastStatus: 'success', lastAt: '1m', trend: [22,28,24,30,26,32,28], tags: ['ci'] },
  { name: 'deploy-blue-green', type: 'deploy', engines: ['kaptain', 'traffik'], runs7d: 21, successRate: 95.2, p95: '8m 47s', saUsage: 14, owner: 'squad-platform', lastStatus: 'success', lastAt: '12m', trend: [2,3,4,3,5,3,4], tags: ['production'] },
  { name: 'rollback', type: 'rollout', engines: ['kaptain', 'orkestra', 'pantheon'], runs7d: 3, successRate: 66.7, p95: '4m 22s', saUsage: 3, owner: 'squad-platform', lastStatus: 'failure', lastAt: '2h', trend: [0,1,0,0,1,0,1], tags: ['recovery'] },
  { name: 'onboarding-vanilla-greenfield', type: 'onboarding', engines: ['konstructor', 'kaptain', 'komply', 'orkestra', 'pantheon'], runs7d: 9, successRate: 88.9, p95: '14m 33s', saUsage: 9, owner: 'squad-platform', lastStatus: 'success', lastAt: '38m', trend: [1,2,1,2,1,1,1], tags: ['vanilla', 'novo'] },
  { name: 'policy-gate-komply', type: 'custom', engines: ['komply'], runs7d: 412, successRate: 99.7, p95: '0m 41s', saUsage: 142, owner: 'squad-seguranca', lastStatus: 'success', lastAt: '4s', trend: [56,62,58,64,60,68,66], tags: ['gate'] },
  { name: 'data-backfill-postgres', type: 'migration', engines: ['migration', 'pantheon'], runs7d: 6, successRate: 83.3, p95: '1h 12m', saUsage: 3, owner: 'squad-data', lastStatus: 'success', lastAt: '4h', trend: [1,0,1,1,1,1,1], tags: ['data', 'postgres'] },
  { name: 'shadow-traffic', type: 'rollout', engines: ['traffik', 'orkestra'], runs7d: 14, successRate: 100, p95: '3m 58s', saUsage: 8, owner: 'squad-platform', lastStatus: 'success', lastAt: '52m', trend: [1,2,3,2,3,2,1], tags: ['canary', 'shadow'] },
  { name: 'feature-flag-rollout', type: 'rollout', engines: ['kaptain', 'traffik'], runs7d: 26, successRate: 96.2, p95: '1m 18s', saUsage: 21, owner: 'squad-platform', lastStatus: 'success', lastAt: '8m', trend: [3,4,3,5,3,4,4], tags: ['flag'] },
  { name: 'security-scan-deps', type: 'custom', engines: ['komply', 'konstructor'], runs7d: 96, successRate: 92.7, p95: '5m 02s', saUsage: 87, owner: 'squad-seguranca', lastStatus: 'success', lastAt: '21m', trend: [12,16,14,16,14,12,12], tags: ['security'] },
  { name: 'sa-decommission', type: 'custom', engines: ['orkestra', 'kaptain', 'traffik'], runs7d: 2, successRate: 100, p95: '22m 14s', saUsage: 2, owner: 'squad-platform', lastStatus: 'success', lastAt: '1d', trend: [0,0,0,0,1,0,1], tags: ['lifecycle'] },
  { name: 'kafka-topic-migrate', type: 'migration', engines: ['pantheon'], runs7d: 7, successRate: 85.7, p95: '6m 47s', saUsage: 5, owner: 'squad-data', lastStatus: 'success', lastAt: '3h', trend: [1,1,2,1,0,1,1], tags: ['kafka'] },
  { name: 'dns-cutover', type: 'rollout', engines: ['traffik'], runs7d: 4, successRate: 100, p95: '0m 32s', saUsage: 4, owner: 'squad-platform', lastStatus: 'success', lastAt: '6h', trend: [0,1,0,1,1,0,1], tags: ['dns'] },
  { name: 'eks-node-rotation', type: 'custom', engines: ['orkestra', 'kaptain'], runs7d: 18, successRate: 94.4, p95: '12m 08s', saUsage: 87, owner: 'squad-sre', lastStatus: 'success', lastAt: '47m', trend: [2,3,2,3,3,2,3], tags: ['infra', 'k8s'] },
  { name: 'pr-review-agentic', type: 'custom', engines: ['komply', 'konstructor'], runs7d: 312, successRate: 97.4, p95: '1m 41s', saUsage: 142, owner: 'squad-platform', lastStatus: 'success', lastAt: '11s', trend: [42,48,44,52,48,54,50], tags: ['ai', 'review'] },
  { name: 'cost-report-weekly', type: 'custom', engines: ['kaptain'], runs7d: 1, successRate: 100, p95: '4m 18s', saUsage: 142, owner: 'squad-finops', lastStatus: 'success', lastAt: '4d', trend: [1,0,0,0,0,0,0], tags: ['finops'] },
]

const engineMeta: Record<string, { label: string; icon: typeof Rocket; color: string }> = {
  kaptain: { label: 'Kaptain', icon: Rocket, color: 'text-info' },
  komply: { label: 'Komply', icon: ShieldCheck, color: 'text-warning' },
  konstructor: { label: 'Konstructor', icon: Hammer, color: 'text-text-secondary' },
  orkestra: { label: 'Orkestra', icon: Boxes, color: 'text-success' },
  traffik: { label: 'Traffik', icon: Network, color: 'text-info' },
  pantheon: { label: 'Pantheon', icon: GitMerge, color: 'text-warning' },
  migration: { label: 'Migration', icon: Database, color: 'text-accent' },
}

type SkillItem = {
  name: string
  category: 'codegen' | 'review' | 'security' | 'observability' | 'infra' | 'data' | 'docs'
  description: string
  version: string
  status: 'stable' | 'beta' | 'deprecated'
  agents: number
  invocations7d: number
  successRate: number
  p95: string
  owner: string
  updatedAt: string
  tools: string[]
  tags: string[]
}

const skills: SkillItem[] = [
  { name: 'review-pr-comments', category: 'review', description: 'Gera comentários estruturados em PRs com base em diff', version: '2.4.1', status: 'stable', agents: 8, invocations7d: 412, successRate: 96.8, p95: '14s', owner: 'squad-platform', updatedAt: '2d', tools: ['github.read_pr', 'github.post_comment', 'komply.evaluate'], tags: ['review', 'core'] },
  { name: 'scaffold-vanilla-app', category: 'codegen', description: 'Cria estrutura inicial de SA Vanilla a partir do template Itaú', version: '1.7.0', status: 'stable', agents: 5, invocations7d: 47, successRate: 100, p95: '2m 18s', owner: 'squad-platform', updatedAt: '5d', tools: ['konstructor.scaffold', 'github.create_repo', 'jira.create_issue'], tags: ['onboarding'] },
  { name: 'detect-secrets', category: 'security', description: 'Varre repositório por credenciais expostas', version: '3.1.2', status: 'stable', agents: 12, invocations7d: 184, successRate: 99.5, p95: '38s', owner: 'squad-seguranca', updatedAt: '1d', tools: ['github.read_files', 'komply.evaluate'], tags: ['security'] },
  { name: 'trace-incident', category: 'observability', description: 'Correlaciona traces, logs e métricas durante incidente', version: '0.9.4', status: 'beta', agents: 3, invocations7d: 22, successRate: 81.8, p95: '47s', owner: 'squad-sre', updatedAt: '8h', tools: ['grafana.query', 'datadog.search', 'jira.create_issue'], tags: ['incident', 'sre'] },
  { name: 'plan-eks-rotation', category: 'infra', description: 'Planeja janela de rotação de node group EKS sem downtime', version: '1.2.0', status: 'stable', agents: 4, invocations7d: 14, successRate: 92.9, p95: '21s', owner: 'squad-sre', updatedAt: '4d', tools: ['orkestra.describe', 'kaptain.deploy'], tags: ['k8s', 'infra'] },
  { name: 'migrate-dynamodb-schema', category: 'data', description: 'Gera plano + script de migração de schema DynamoDB', version: '0.6.1', status: 'beta', agents: 2, invocations7d: 6, successRate: 83.3, p95: '1m 12s', owner: 'squad-data', updatedAt: '2d', tools: ['dynamodb.describe', 'migration.plan'], tags: ['data', 'dynamo'] },
  { name: 'generate-runbook', category: 'docs', description: 'Cria runbook em markdown a partir de execução de workflow', version: '1.0.4', status: 'stable', agents: 6, invocations7d: 41, successRate: 97.6, p95: '11s', owner: 'squad-platform', updatedAt: '3d', tools: ['workflow.read_history', 'github.commit_file'], tags: ['docs'] },
  { name: 'shadow-traffic-config', category: 'infra', description: 'Configura shadow traffic em rota de produção', version: '2.0.0', status: 'stable', agents: 3, invocations7d: 14, successRate: 100, p95: '8s', owner: 'squad-platform', updatedAt: '6d', tools: ['traffik.update_route', 'orkestra.scale'], tags: ['canary'] },
  { name: 'cve-triage', category: 'security', description: 'Triagem automática de CVE em dependências', version: '2.2.0', status: 'stable', agents: 7, invocations7d: 96, successRate: 91.7, p95: '24s', owner: 'squad-seguranca', updatedAt: '12h', tools: ['konstructor.deps', 'komply.evaluate', 'jira.create_issue'], tags: ['security', 'cve'] },
  { name: 'cost-anomaly-report', category: 'observability', description: 'Detecta anomalia de custo em SA e gera relatório', version: '0.4.0', status: 'beta', agents: 1, invocations7d: 7, successRate: 100, p95: '38s', owner: 'squad-finops', updatedAt: '4d', tools: ['kaptain.cost', 'grafana.query'], tags: ['finops'] },
  { name: 'kafka-topic-plan', category: 'data', description: 'Planeja criação/migração de tópico Kafka com retenção', version: '1.5.0', status: 'stable', agents: 2, invocations7d: 7, successRate: 85.7, p95: '18s', owner: 'squad-data', updatedAt: '7d', tools: ['pantheon.describe', 'pantheon.apply'], tags: ['kafka'] },
  { name: 'review-iac-terraform', category: 'review', description: 'Revisa diff de Terraform por drifts e violações de policy', version: '3.0.1', status: 'stable', agents: 9, invocations7d: 142, successRate: 95.8, p95: '32s', owner: 'squad-sre', updatedAt: '1d', tools: ['github.read_pr', 'komply.evaluate', 'orkestra.describe'], tags: ['iac', 'terraform'] },
  { name: 'autogen-unit-tests', category: 'codegen', description: 'Gera testes unitários a partir de cobertura faltante', version: '1.1.0', status: 'beta', agents: 4, invocations7d: 38, successRate: 89.5, p95: '47s', owner: 'squad-platform', updatedAt: '2d', tools: ['github.read_files', 'konstructor.run_tests'], tags: ['testing'] },
  { name: 'changelog-from-commits', category: 'docs', description: 'Gera changelog a partir de commits desde a última tag', version: '1.3.2', status: 'stable', agents: 4, invocations7d: 28, successRate: 100, p95: '9s', owner: 'squad-platform', updatedAt: '9d', tools: ['github.read_commits', 'github.create_release'], tags: ['release', 'docs'] },
  { name: 'dns-cutover-plan', category: 'infra', description: 'Planeja janela de cutover de DNS com fallback', version: '0.8.0', status: 'beta', agents: 2, invocations7d: 4, successRate: 100, p95: '14s', owner: 'squad-platform', updatedAt: '11d', tools: ['traffik.update_dns', 'kaptain.deploy'], tags: ['dns', 'cutover'] },
  { name: 'legacy-pii-detector', category: 'security', description: 'Detecta PII em logs e tabelas legadas', version: '1.4.0', status: 'deprecated', agents: 0, invocations7d: 0, successRate: 0, p95: '—', owner: 'squad-seguranca', updatedAt: '64d', tools: ['legacy.scan'], tags: ['pii', 'legacy'] },
]

const skillCategoryColor: Record<SkillItem['category'], string> = {
  codegen: 'border-info/30 bg-info/10 text-info',
  review: 'border-accent/30 bg-accent/10 text-accent',
  security: 'border-failure/30 bg-failure/10 text-failure',
  observability: 'border-warning/30 bg-warning/10 text-warning',
  infra: 'border-success/30 bg-success/10 text-success',
  data: 'border-info/30 bg-info/10 text-info',
  docs: 'border-border bg-bg text-text-secondary',
}

const skillStatusChip: Record<SkillItem['status'], string> = {
  stable: 'border-success/30 bg-success/10 text-success',
  beta: 'border-warning/30 bg-warning/10 text-warning',
  deprecated: 'border-border bg-bg text-text-muted',
}

type McpItem = {
  name: string
  server: string
  op: 'read-only' | 'mutating' | 'mixed'
  status: 'ok' | 'degraded' | 'offline'
  p95: string
  invocations7d: number
  successRate: number
  consumers: number
  scope: ('SA' | 'repo' | 'org')[]
  owner: string
  description: string
}

const mcpTools: McpItem[] = [
  { name: 'kaptain.deploy', server: 'kaptain-mcp', op: 'mutating', status: 'ok', p95: '1.2s', invocations7d: 412, successRate: 96.8, consumers: 8, scope: ['SA', 'repo'], owner: 'squad-platform', description: 'Aplica deploy de SA via Kaptain CD em ambiente alvo' },
  { name: 'kaptain.describe', server: 'kaptain-mcp', op: 'read-only', status: 'ok', p95: '142ms', invocations7d: 2814, successRate: 99.4, consumers: 12, scope: ['SA'], owner: 'squad-platform', description: 'Lê estado atual de deploy + recursos provisionados pelo Kaptain' },
  { name: 'kaptain.cost', server: 'kaptain-mcp', op: 'read-only', status: 'ok', p95: '388ms', invocations7d: 1284, successRate: 99.8, consumers: 4, scope: ['SA', 'org'], owner: 'squad-platform', description: 'Custo agregado por SA / período' },
  { name: 'komply.evaluate', server: 'komply-mcp', op: 'read-only', status: 'degraded', p95: '3.1s', invocations7d: 8417, successRate: 97.4, consumers: 18, scope: ['SA', 'repo'], owner: 'squad-seguranca', description: 'Avalia conjunto de policies contra diff/resource' },
  { name: 'komply.list_policies', server: 'komply-mcp', op: 'read-only', status: 'ok', p95: '88ms', invocations7d: 612, successRate: 100, consumers: 14, scope: ['org'], owner: 'squad-seguranca', description: 'Lista policies disponíveis e versões' },
  { name: 'orkestra.describe', server: 'orkestra-mcp', op: 'read-only', status: 'ok', p95: '241ms', invocations7d: 1842, successRate: 99.2, consumers: 11, scope: ['SA'], owner: 'squad-sre', description: 'Estado atual de workloads e nodes K8s da SA' },
  { name: 'orkestra.scale', server: 'orkestra-mcp', op: 'mutating', status: 'ok', p95: '1.8s', invocations7d: 184, successRate: 95.7, consumers: 5, scope: ['SA'], owner: 'squad-sre', description: 'Aplica scaling em workload da SA' },
  { name: 'traffik.update_route', server: 'traffik-mcp', op: 'mutating', status: 'ok', p95: '684ms', invocations7d: 312, successRate: 98.4, consumers: 6, scope: ['SA'], owner: 'squad-platform', description: 'Atualiza rota / peso de tráfego (canary, shadow)' },
  { name: 'traffik.update_dns', server: 'traffik-mcp', op: 'mutating', status: 'ok', p95: '1.4s', invocations7d: 38, successRate: 100, consumers: 2, scope: ['org'], owner: 'squad-platform', description: 'Aplica mudança de registro DNS' },
  { name: 'pantheon.describe', server: 'pantheon-mcp', op: 'read-only', status: 'ok', p95: '184ms', invocations7d: 412, successRate: 99.8, consumers: 6, scope: ['SA', 'org'], owner: 'squad-data', description: 'Inspeção de tópicos Kafka, lag e consumers' },
  { name: 'pantheon.apply', server: 'pantheon-mcp', op: 'mutating', status: 'degraded', p95: '4.7s', invocations7d: 7, successRate: 85.7, consumers: 2, scope: ['SA', 'org'], owner: 'squad-data', description: 'Cria / altera tópico Kafka com retenção' },
  { name: 'migration.plan', server: 'migration-mcp', op: 'read-only', status: 'ok', p95: '912ms', invocations7d: 18, successRate: 100, consumers: 3, scope: ['SA'], owner: 'squad-data', description: 'Gera plano de migração de schema/dado' },
  { name: 'migration.execute', server: 'migration-mcp', op: 'mutating', status: 'offline', p95: '—', invocations7d: 0, successRate: 0, consumers: 2, scope: ['SA'], owner: 'squad-data', description: 'Executa plano de migração aprovado' },
  { name: 'github.read_pr', server: 'github-mcp', op: 'read-only', status: 'ok', p95: '218ms', invocations7d: 4128, successRate: 99.7, consumers: 16, scope: ['repo'], owner: 'squad-platform', description: 'Lê diff, comentários e checks de um PR' },
  { name: 'github.post_comment', server: 'github-mcp', op: 'mutating', status: 'ok', p95: '342ms', invocations7d: 1812, successRate: 99.4, consumers: 9, scope: ['repo'], owner: 'squad-platform', description: 'Posta comentário em PR/issue' },
  { name: 'github.create_release', server: 'github-mcp', op: 'mutating', status: 'ok', p95: '784ms', invocations7d: 24, successRate: 100, consumers: 4, scope: ['repo'], owner: 'squad-platform', description: 'Cria release com tag e changelog' },
  { name: 'jira.create_issue', server: 'jira-mcp', op: 'mutating', status: 'ok', p95: '1.1s', invocations7d: 412, successRate: 98.8, consumers: 11, scope: ['org'], owner: 'squad-platform', description: 'Cria issue no Jira com link automático para o workflow' },
  { name: 'jira.search', server: 'jira-mcp', op: 'read-only', status: 'ok', p95: '288ms', invocations7d: 184, successRate: 99.5, consumers: 8, scope: ['org'], owner: 'squad-platform', description: 'Busca issues por JQL' },
  { name: 'grafana.query', server: 'observability-mcp', op: 'read-only', status: 'ok', p95: '482ms', invocations7d: 612, successRate: 98.7, consumers: 7, scope: ['SA', 'org'], owner: 'squad-sre', description: 'Consulta dashboards / métricas via Prometheus' },
  { name: 'datadog.search', server: 'observability-mcp', op: 'read-only', status: 'ok', p95: '512ms', invocations7d: 384, successRate: 98.2, consumers: 5, scope: ['SA'], owner: 'squad-sre', description: 'Busca traces e logs no Datadog' },
  { name: 'dynamodb.describe', server: 'data-mcp', op: 'read-only', status: 'ok', p95: '184ms', invocations7d: 142, successRate: 100, consumers: 5, scope: ['SA'], owner: 'squad-data', description: 'Descreve schema, índices e métricas de uma tabela' },
  { name: 'legacy.scan', server: 'legacy-mcp', op: 'read-only', status: 'offline', p95: '—', invocations7d: 0, successRate: 0, consumers: 0, scope: ['SA'], owner: 'squad-seguranca', description: 'Scanner legado de PII (descontinuado)' },
]

const mcpStatusDot: Record<McpItem['status'], string> = {
  ok: 'bg-success',
  degraded: 'bg-warning',
  offline: 'bg-failure',
}

const mcpOpChip: Record<McpItem['op'], string> = {
  'read-only': 'border-info/30 bg-info/10 text-info',
  mutating: 'border-warning/30 bg-warning/10 text-warning',
  mixed: 'border-accent/30 bg-accent/10 text-accent',
}

type SensorItem = {
  name: string
  category: 'security' | 'quality' | 'performance' | 'compliance'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  status: 'active' | 'muted' | 'deprecated'
  engine: 'Komply' | 'Konstructor' | 'Kaptain' | 'custom'
  saCount: number
  runs7d: number
  violations7d: number
  detectionRate: number
  lastStatus: 'success' | 'warn' | 'fail'
  lastAt: string
  trend: number[]
  owner: string
  description: string
  tags: string[]
}

const sensors: SensorItem[] = [
  { name: 'cve-scan-deps', category: 'security', severity: 'high', status: 'active', engine: 'Komply', saCount: 142, runs7d: 412, violations7d: 38, detectionRate: 96.4, lastStatus: 'fail', lastAt: '3m', trend: [4,8,6,12,8,14,9], owner: 'squad-seguranca', description: 'Varre dependências do build em busca de CVE conhecidos', tags: ['cve', 'deps'] },
  { name: 'pii-in-logs', category: 'security', severity: 'critical', status: 'active', engine: 'Komply', saCount: 87, runs7d: 612, violations7d: 4, detectionRate: 99.1, lastStatus: 'success', lastAt: '14m', trend: [0,1,0,2,1,0,0], owner: 'squad-seguranca', description: 'Detecta vazamento de PII em logs estruturados', tags: ['pii', 'logs'] },
  { name: 'secret-in-repo', category: 'security', severity: 'critical', status: 'active', engine: 'Komply', saCount: 142, runs7d: 184, violations7d: 2, detectionRate: 100, lastStatus: 'warn', lastAt: '38m', trend: [0,0,1,0,1,0,0], owner: 'squad-seguranca', description: 'Bloqueia PR com credenciais hardcoded', tags: ['security', 'pre-merge'] },
  { name: 'network-egress-policy', category: 'compliance', severity: 'high', status: 'active', engine: 'Komply', saCount: 142, runs7d: 8417, violations7d: 12, detectionRate: 98.7, lastStatus: 'success', lastAt: '4s', trend: [2,1,3,2,1,2,1], owner: 'squad-seguranca', description: 'Bloqueia tráfego de saída fora da allowlist regulatória', tags: ['network', 'policy'] },
  { name: 'data-classification-tag', category: 'compliance', severity: 'medium', status: 'active', engine: 'Komply', saCount: 142, runs7d: 412, violations7d: 18, detectionRate: 94.4, lastStatus: 'warn', lastAt: '11m', trend: [2,3,2,4,2,3,2], owner: 'squad-data-gov', description: 'Verifica classificação obrigatória em tabelas e tópicos', tags: ['classification'] },
  { name: 'p99-latency-api', category: 'performance', severity: 'high', status: 'active', engine: 'custom', saCount: 87, runs7d: 1248, violations7d: 24, detectionRate: 92.1, lastStatus: 'warn', lastAt: '42s', trend: [4,3,5,4,3,2,3], owner: 'squad-sre', description: 'Compara p99 contra SLO definido por API', tags: ['slo', 'latency'] },
  { name: 'error-rate-5xx', category: 'performance', severity: 'high', status: 'active', engine: 'custom', saCount: 87, runs7d: 1248, violations7d: 8, detectionRate: 96.7, lastStatus: 'success', lastAt: '22s', trend: [1,2,1,2,1,1,0], owner: 'squad-sre', description: 'Dispara alerta quando erro 5xx > 1% por 5min', tags: ['error', 'slo'] },
  { name: 'unused-iam-role', category: 'compliance', severity: 'low', status: 'active', engine: 'custom', saCount: 142, runs7d: 7, violations7d: 31, detectionRate: 100, lastStatus: 'warn', lastAt: '6h', trend: [4,5,4,4,5,5,4], owner: 'squad-seguranca', description: 'Roles IAM sem uso nos últimos 90d', tags: ['iam', 'cleanup'] },
  { name: 'coverage-below-80', category: 'quality', severity: 'medium', status: 'active', engine: 'Konstructor', saCount: 142, runs7d: 184, violations7d: 41, detectionRate: 100, lastStatus: 'success', lastAt: '11m', trend: [6,5,6,7,6,5,6], owner: 'squad-platform', description: 'Cobertura de testes abaixo de 80% no build', tags: ['testing', 'quality'] },
  { name: 'flaky-test-rate', category: 'quality', severity: 'medium', status: 'active', engine: 'Konstructor', saCount: 87, runs7d: 184, violations7d: 12, detectionRate: 89.2, lastStatus: 'warn', lastAt: '21m', trend: [2,1,2,2,1,2,2], owner: 'squad-platform', description: 'Detecta testes flaky com taxa > 5%', tags: ['testing', 'flaky'] },
  { name: 'lint-error-block', category: 'quality', severity: 'low', status: 'active', engine: 'Konstructor', saCount: 142, runs7d: 412, violations7d: 28, detectionRate: 100, lastStatus: 'success', lastAt: '4m', trend: [4,3,4,5,4,4,4], owner: 'squad-platform', description: 'Bloqueia merge em erro fatal de lint', tags: ['lint'] },
  { name: 'pod-restart-rate', category: 'performance', severity: 'medium', status: 'active', engine: 'custom', saCount: 87, runs7d: 612, violations7d: 6, detectionRate: 87.5, lastStatus: 'success', lastAt: '38s', trend: [1,0,1,1,0,1,2], owner: 'squad-sre', description: 'Pods reiniciando > 3x em 1h', tags: ['k8s'] },
  { name: 'cost-burst-anomaly', category: 'performance', severity: 'medium', status: 'active', engine: 'custom', saCount: 142, runs7d: 168, violations7d: 4, detectionRate: 75, lastStatus: 'warn', lastAt: '1h 12m', trend: [0,1,0,1,0,1,1], owner: 'squad-finops', description: 'Custo diário > 2σ acima da média 30d', tags: ['finops', 'cost'] },
  { name: 'kafka-consumer-lag', category: 'performance', severity: 'high', status: 'active', engine: 'custom', saCount: 38, runs7d: 8417, violations7d: 14, detectionRate: 94.3, lastStatus: 'success', lastAt: '8s', trend: [2,3,2,1,3,2,1], owner: 'squad-data', description: 'Lag de consumer Kafka > 30s', tags: ['kafka', 'lag'] },
  { name: 'tls-cert-expiry-30d', category: 'compliance', severity: 'high', status: 'active', engine: 'custom', saCount: 142, runs7d: 7, violations7d: 3, detectionRate: 100, lastStatus: 'warn', lastAt: '4h', trend: [0,1,0,0,1,0,1], owner: 'squad-seguranca', description: 'Certificado TLS expira em < 30d', tags: ['tls', 'security'] },
  { name: 'license-audit', category: 'compliance', severity: 'medium', status: 'active', engine: 'Komply', saCount: 142, runs7d: 184, violations7d: 22, detectionRate: 95.5, lastStatus: 'warn', lastAt: '2h', trend: [3,2,3,4,3,3,4], owner: 'squad-juridico', description: 'Valida licenças permitidas de dependências OSS', tags: ['license', 'oss'] },
  { name: 'shadow-traffic-success', category: 'quality', severity: 'high', status: 'active', engine: 'custom', saCount: 14, runs7d: 412, violations7d: 2, detectionRate: 98.5, lastStatus: 'success', lastAt: '1m', trend: [0,1,0,0,1,0,0], owner: 'squad-platform', description: 'Sucesso de shadow vs. produção em rollout-canary', tags: ['canary'] },
  { name: 'apdex-degradation', category: 'performance', severity: 'medium', status: 'active', engine: 'custom', saCount: 87, runs7d: 1248, violations7d: 18, detectionRate: 88.9, lastStatus: 'warn', lastAt: '12s', trend: [3,2,3,2,3,2,3], owner: 'squad-sre', description: 'Apdex score < 0.85 em janela de 15min', tags: ['apdex'] },
  { name: 'legacy-scan-pii-tables', category: 'security', severity: 'low', status: 'deprecated', engine: 'custom', saCount: 0, runs7d: 0, violations7d: 0, detectionRate: 0, lastStatus: 'success', lastAt: '64d', trend: [0,0,0,0,0,0,0], owner: 'squad-seguranca', description: 'Scanner legado (substituído por pii-in-logs)', tags: ['legacy', 'pii'] },
  { name: 'pix-policy-block', category: 'compliance', severity: 'critical', status: 'active', engine: 'Komply', saCount: 4, runs7d: 412, violations7d: 1, detectionRate: 100, lastStatus: 'warn', lastAt: '14m', trend: [0,0,1,0,0,0,0], owner: 'squad-pix', description: 'Bloqueio de chave PIX irregular conforme bacen', tags: ['pix', 'bacen'] },
]

const sensorCategoryColor: Record<SensorItem['category'], string> = {
  security: 'border-failure/30 bg-failure/10 text-failure',
  quality: 'border-info/30 bg-info/10 text-info',
  performance: 'border-warning/30 bg-warning/10 text-warning',
  compliance: 'border-accent/30 bg-accent/10 text-accent',
}

const sensorSeverityChip: Record<SensorItem['severity'], string> = {
  critical: 'border-failure/40 bg-failure/15 text-failure',
  high: 'border-failure/30 bg-failure/10 text-failure',
  medium: 'border-warning/30 bg-warning/10 text-warning',
  low: 'border-border bg-bg text-text-secondary',
  info: 'border-info/30 bg-info/10 text-info',
}

const sensorRunDot: Record<SensorItem['lastStatus'], string> = {
  success: 'bg-success',
  warn: 'bg-warning',
  fail: 'bg-failure',
}

function Sparkline({ data, color = '#22D3EE' }: { data: number[]; color?: string }) {
  if (!data.length) return null
  const w = 92
  const h = 22
  const max = Math.max(...data, 1)
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - (v / max) * (h - 2) - 1
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const area = `0,${h} ${points} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[22px] w-[92px]">
      <defs>
        <linearGradient id={`sp-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sp-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AltListing({
  type,
  search,
  view,
  setView,
}: {
  type: AssetType
  search: string
  view: 'grid' | 'table'
  setView: (v: 'grid' | 'table') => void
}) {
  if (type === 'workflow') return <WorkflowsListing search={search} view={view} setView={setView} />
  if (type === 'skill') return <SkillsListing search={search} view={view} setView={setView} />
  if (type === 'mcp') return <McpListing search={search} view={view} setView={setView} />
  if (type === 'sensor') return <SensorsListing search={search} view={view} setView={setView} />
  return <PlaceholderListing label={typeChips.find((c) => c.id === type)?.label ?? ''} />
}

function ViewToggle({
  view,
  setView,
  sortLabel,
}: {
  view: 'grid' | 'table'
  setView: (v: 'grid' | 'table') => void
  sortLabel: string
}) {
  return (
    <div className="ml-auto flex items-center gap-1.5">
      <button className="flex h-7 items-center gap-1 rounded border border-border bg-bg px-2 text-[11.5px] text-text-secondary hover:text-text-primary">
        <ArrowUpDown className="h-3 w-3" />
        {sortLabel}
      </button>
      <div className="flex h-7 items-center overflow-hidden rounded border border-border bg-bg">
        <button
          onClick={() => setView('grid')}
          className={`flex h-7 w-7 items-center justify-center ${
            view === 'grid' ? 'bg-surface text-text-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setView('table')}
          className={`flex h-7 w-7 items-center justify-center ${
            view === 'table' ? 'bg-surface text-text-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <List className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function PlaceholderListing({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg ring-1 ring-border">
        <Boxes className="h-5 w-5 text-text-muted" />
      </div>
      <div>
        <div className="text-[14px] font-medium text-text-primary">Listagem de {label} em construção</div>
        <div className="mt-1 text-[12px] text-text-secondary">
          Por enquanto só SAs, Workflows, Skills, MCP Tools e Sensores têm listagem dedicada.
        </div>
      </div>
    </div>
  )
}

function WorkflowsListing({
  search,
  view,
  setView,
}: {
  search: string
  view: 'grid' | 'table'
  setView: (v: 'grid' | 'table') => void
}) {
  const [typeFilter, setTypeFilter] = useState<WorkflowItem['type'] | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'failing'>('all')

  const filtered = workflows.filter((w) => {
    if (typeFilter !== 'all' && w.type !== typeFilter) return false
    if (statusFilter === 'active' && (w.lastStatus === 'failure' || w.lastStatus === 'awaiting')) return false
    if (statusFilter === 'failing' && w.lastStatus !== 'failure') return false
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-text-muted">
          <Filter className="h-3.5 w-3.5" />
          Filtros
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11.5px] text-text-secondary">Tipo</span>
          {(['all', 'onboarding', 'build', 'deploy', 'rollout', 'migration', 'custom'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] capitalize transition ${
                typeFilter === t
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-muted hover:text-text-secondary'
              }`}
            >
              {t === 'all' ? 'todos' : t}
            </button>
          ))}
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11.5px] text-text-secondary">Status</span>
          {(['all', 'active', 'failing'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] capitalize transition ${
                statusFilter === s
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-muted hover:text-text-secondary'
              }`}
            >
              {s === 'all' ? 'todos' : s}
            </button>
          ))}
        </div>
        <ViewToggle view={view} setView={setView} sortLabel="execuções 7d ↓" />
      </div>

      <div className="flex items-center justify-between text-[12px] text-text-secondary">
        <div>
          Mostrando <span className="text-text-primary">{filtered.length}</span> de {workflows.length} workflows
        </div>
      </div>

      {filtered.length === 0 ? (
        <PlaceholderListing label="workflows" />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((w) => (
            <Link
              key={w.name}
              to={`/workflows/${w.name}`}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-border-strong hover:bg-[#181A1F]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-3.5 w-3.5 flex-none text-text-muted" />
                    <span className="truncate font-mono text-[12.5px] font-medium text-text-primary group-hover:text-accent">
                      {w.name}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                    <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-text-secondary">
                      {w.type}
                    </span>
                    <span
                      className={`flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider ${
                        w.lastStatus === 'running'
                          ? 'border-live/30 bg-live/10 text-live'
                          : w.lastStatus === 'awaiting'
                          ? 'border-warning/30 bg-warning/10 text-warning'
                          : w.lastStatus === 'failure'
                          ? 'border-failure/30 bg-failure/10 text-failure'
                          : 'border-success/30 bg-success/10 text-success'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          w.lastStatus === 'running'
                            ? 'bg-live animate-pulse-live'
                            : w.lastStatus === 'awaiting'
                            ? 'bg-warning'
                            : w.lastStatus === 'failure'
                            ? 'bg-failure'
                            : 'bg-success'
                        }`}
                      />
                      {w.lastStatus}
                    </span>
                  </div>
                </div>
                <Sparkline data={w.trend} color={w.lastStatus === 'failure' ? '#EF4444' : '#22D3EE'} />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {w.engines.map((eng) => {
                  const meta = engineMeta[eng]
                  const Icon = meta.icon
                  return (
                    <span
                      key={eng}
                      className={`inline-flex items-center gap-1 rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] ${meta.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      {meta.label}
                    </span>
                  )
                })}
              </div>

              <div className="grid grid-cols-4 gap-2 rounded-md border border-border bg-bg px-3 py-2">
                <div>
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Runs 7d</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{w.runs7d}</div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Sucesso</div>
                  <div
                    className={`font-mono text-[12.5px] ${
                      w.successRate >= 95
                        ? 'text-success'
                        : w.successRate >= 85
                        ? 'text-warning'
                        : 'text-failure'
                    }`}
                  >
                    {w.successRate.toFixed(1)}%
                  </div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">p95</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{w.p95}</div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">SAs</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{w.saUsage}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span className="truncate">
                  <span className="text-text-secondary">{w.owner}</span> · última há {w.lastAt}
                </span>
                <div className="flex flex-none gap-1">
                  {w.tags.map((t) => (
                    <span key={t} className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[9.5px] text-text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-[2fr_1fr_0.6fr_0.7fr_0.7fr_0.5fr_0.8fr] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
            <div>Workflow</div>
            <div>Motores</div>
            <div className="text-right">Runs 7d</div>
            <div className="text-right">Sucesso</div>
            <div className="text-right">p95</div>
            <div className="text-right">SAs</div>
            <div>Último</div>
          </div>
          {filtered.map((w) => (
            <Link
              key={w.name}
              to={`/workflows/${w.name}`}
              className="group grid grid-cols-[2fr_1fr_0.6fr_0.7fr_0.7fr_0.5fr_0.8fr] items-center border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]"
            >
              <div className="flex items-center gap-2">
                <Workflow className="h-3.5 w-3.5 text-text-muted" />
                <span className="truncate font-mono text-[12.5px] text-text-primary group-hover:text-accent">{w.name}</span>
                <span className="rounded border border-border bg-bg px-1 py-0.5 font-mono text-[9px] uppercase text-text-muted">{w.type}</span>
              </div>
              <div className="flex flex-wrap gap-0.5">
                {w.engines.slice(0, 4).map((eng) => {
                  const meta = engineMeta[eng]
                  const Icon = meta.icon
                  return <Icon key={eng} className={`h-3 w-3 ${meta.color}`} />
                })}
                {w.engines.length > 4 && (
                  <span className="font-mono text-[10px] text-text-muted">+{w.engines.length - 4}</span>
                )}
              </div>
              <div className="text-right font-mono text-[12px] text-text-secondary">{w.runs7d}</div>
              <div
                className={`text-right font-mono text-[12px] ${
                  w.successRate >= 95 ? 'text-success' : w.successRate >= 85 ? 'text-warning' : 'text-failure'
                }`}
              >
                {w.successRate.toFixed(1)}%
              </div>
              <div className="text-right font-mono text-[12px] text-text-secondary">{w.p95}</div>
              <div className="text-right font-mono text-[12px] text-text-secondary">{w.saUsage}</div>
              <div className="flex items-center gap-1.5 font-mono text-[11.5px] text-text-secondary">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    w.lastStatus === 'running'
                      ? 'bg-live animate-pulse-live'
                      : w.lastStatus === 'awaiting'
                      ? 'bg-warning'
                      : w.lastStatus === 'failure'
                      ? 'bg-failure'
                      : 'bg-success'
                  }`}
                />
                {w.lastAt}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

function SkillsListing({
  search,
  view,
  setView,
}: {
  search: string
  view: 'grid' | 'table'
  setView: (v: 'grid' | 'table') => void
}) {
  const [category, setCategory] = useState<SkillItem['category'] | 'all'>('all')
  const [status, setStatus] = useState<SkillItem['status'] | 'all'>('all')

  const filtered = skills.filter((s) => {
    if (category !== 'all' && s.category !== category) return false
    if (status !== 'all' && s.status !== status) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-text-muted">
          <Filter className="h-3.5 w-3.5" />
          Filtros
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11.5px] text-text-secondary">Categoria</span>
          {(['all', 'codegen', 'review', 'security', 'observability', 'infra', 'data', 'docs'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] capitalize transition ${
                category === c
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-muted hover:text-text-secondary'
              }`}
            >
              {c === 'all' ? 'todas' : c}
            </button>
          ))}
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11.5px] text-text-secondary">Versão</span>
          {(['all', 'stable', 'beta', 'deprecated'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] capitalize transition ${
                status === s
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-muted hover:text-text-secondary'
              }`}
            >
              {s === 'all' ? 'todas' : s}
            </button>
          ))}
        </div>
        <ViewToggle view={view} setView={setView} sortLabel="invocações ↓" />
      </div>

      <div className="flex items-center justify-between text-[12px] text-text-secondary">
        <div>
          Mostrando <span className="text-text-primary">{filtered.length}</span> de {skills.length} skills
        </div>
      </div>

      {filtered.length === 0 ? (
        <PlaceholderListing label="skills" />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <Link
              key={s.name}
              to={`/skills/${s.name}`}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-border-strong hover:bg-[#181A1F]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 flex-none text-accent" />
                    <span className="truncate font-mono text-[12.5px] font-medium text-text-primary group-hover:text-accent">
                      {s.name}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                    <span className={`rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider ${skillCategoryColor[s.category]}`}>
                      {s.category}
                    </span>
                    <span className={`rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider ${skillStatusChip[s.status]}`}>
                      {s.status}
                    </span>
                    <span className="font-mono text-[10.5px] text-text-muted">v{s.version}</span>
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-text-secondary">{s.description}</p>

              <div className="grid grid-cols-4 gap-2 rounded-md border border-border bg-bg px-3 py-2">
                <div>
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Agentes</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{s.agents}</div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Invok 7d</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{s.invocations7d}</div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Sucesso</div>
                  <div
                    className={`font-mono text-[12.5px] ${
                      s.successRate >= 95 ? 'text-success' : s.successRate >= 85 ? 'text-warning' : 'text-failure'
                    }`}
                  >
                    {s.successRate.toFixed(1)}%
                  </div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">p95</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{s.p95}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1 text-[10.5px]">
                <Plug className="h-3 w-3 text-text-muted" />
                <span className="text-text-muted">tools:</span>
                {s.tools.slice(0, 3).map((t) => (
                  <span key={t} className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-text-secondary">
                    {t}
                  </span>
                ))}
                {s.tools.length > 3 && (
                  <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-text-muted">+{s.tools.length - 3}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span className="truncate">
                  <span className="text-text-secondary">{s.owner}</span> · atualizado há {s.updatedAt}
                </span>
                <div className="flex flex-none gap-1">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[9.5px] text-text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-[1.8fr_0.7fr_0.6fr_0.6fr_0.6fr_0.7fr_0.7fr] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
            <div>Skill</div>
            <div>Categoria</div>
            <div>Versão</div>
            <div className="text-right">Agentes</div>
            <div className="text-right">Sucesso</div>
            <div className="text-right">p95</div>
            <div>Owner</div>
          </div>
          {filtered.map((s) => (
            <Link
              key={s.name}
              to={`/skills/${s.name}`}
              className="group grid grid-cols-[1.8fr_0.7fr_0.6fr_0.6fr_0.6fr_0.7fr_0.7fr] items-center border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span className="truncate font-mono text-[12.5px] text-text-primary group-hover:text-accent">{s.name}</span>
              </div>
              <div>
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase ${skillCategoryColor[s.category]}`}>
                  {s.category}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`rounded border px-1 py-0.5 font-mono text-[9px] uppercase ${skillStatusChip[s.status]}`}>{s.status}</span>
                <span className="font-mono text-[10.5px] text-text-muted">v{s.version}</span>
              </div>
              <div className="text-right font-mono text-[12px] text-text-secondary">{s.agents}</div>
              <div
                className={`text-right font-mono text-[12px] ${
                  s.successRate >= 95 ? 'text-success' : s.successRate >= 85 ? 'text-warning' : 'text-failure'
                }`}
              >
                {s.successRate.toFixed(1)}%
              </div>
              <div className="text-right font-mono text-[12px] text-text-secondary">{s.p95}</div>
              <div className="truncate text-[11.5px] text-text-secondary">{s.owner}</div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

function McpListing({
  search,
  view,
  setView,
}: {
  search: string
  view: 'grid' | 'table'
  setView: (v: 'grid' | 'table') => void
}) {
  const [op, setOp] = useState<McpItem['op'] | 'all'>('all')
  const [status, setStatus] = useState<McpItem['status'] | 'all'>('all')
  const servers = Array.from(new Set(mcpTools.map((t) => t.server)))
  const [selectedServer, setSelectedServer] = useState<string | 'all'>('all')

  const filtered = mcpTools.filter((t) => {
    if (op !== 'all' && t.op !== op) return false
    if (status !== 'all' && t.status !== status) return false
    if (selectedServer !== 'all' && t.server !== selectedServer) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-text-muted">
          <Filter className="h-3.5 w-3.5" />
          Filtros
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11.5px] text-text-secondary">Operação</span>
          {(['all', 'read-only', 'mutating', 'mixed'] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] transition ${
                op === o
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-muted hover:text-text-secondary'
              }`}
            >
              {o === 'all' ? 'todas' : o}
            </button>
          ))}
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11.5px] text-text-secondary">Status</span>
          {(['all', 'ok', 'degraded', 'offline'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] transition ${
                status === s
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-muted hover:text-text-secondary'
              }`}
            >
              {s === 'all' ? 'todos' : s}
            </button>
          ))}
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11.5px] text-text-secondary">Server</span>
          <button
            onClick={() => setSelectedServer('all')}
            className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] transition ${
              selectedServer === 'all'
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-bg text-text-muted hover:text-text-secondary'
            }`}
          >
            todos
          </button>
          {servers.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedServer(s)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] transition ${
                selectedServer === s
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-muted hover:text-text-secondary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <ViewToggle view={view} setView={setView} sortLabel="invocações ↓" />
      </div>

      <div className="flex items-center justify-between text-[12px] text-text-secondary">
        <div>
          Mostrando <span className="text-text-primary">{filtered.length}</span> de {mcpTools.length} tools
        </div>
      </div>

      {filtered.length === 0 ? (
        <PlaceholderListing label="MCP tools" />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <Link
              key={t.name}
              to={`/mcp-tools/${t.name}`}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-border-strong hover:bg-[#181A1F]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Plug className="h-3.5 w-3.5 flex-none text-text-muted" />
                    <span className="truncate font-mono text-[12.5px] font-medium text-text-primary group-hover:text-accent">
                      {t.name}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10.5px]">
                    <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-text-secondary">
                      {t.server}
                    </span>
                    <span className={`rounded border px-1.5 py-0.5 font-mono uppercase tracking-wider ${mcpOpChip[t.op]}`}>
                      {t.op}
                    </span>
                  </div>
                </div>
                <span className="flex flex-none items-center gap-1.5 text-[11px]">
                  <span className={`h-1.5 w-1.5 rounded-full ${mcpStatusDot[t.status]} ${t.status === 'degraded' ? 'animate-pulse-live' : ''}`} />
                  <span
                    className={
                      t.status === 'ok'
                        ? 'text-success'
                        : t.status === 'degraded'
                        ? 'text-warning'
                        : 'text-failure'
                    }
                  >
                    {t.status}
                  </span>
                </span>
              </div>

              <p className="text-[12px] text-text-secondary">{t.description}</p>

              <div className="grid grid-cols-4 gap-2 rounded-md border border-border bg-bg px-3 py-2">
                <div>
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">p95</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{t.p95}</div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Invok 7d</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{t.invocations7d}</div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Sucesso</div>
                  <div
                    className={`font-mono text-[12.5px] ${
                      t.successRate >= 95 ? 'text-success' : t.successRate >= 85 ? 'text-warning' : 'text-failure'
                    }`}
                  >
                    {t.successRate ? `${t.successRate.toFixed(1)}%` : '—'}
                  </div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Cons.</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{t.consumers}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10.5px]">
                <div className="flex items-center gap-1">
                  <span className="text-text-muted">escopo:</span>
                  {t.scope.map((sc) => (
                    <span key={sc} className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-text-secondary">
                      {sc}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-text-muted">{t.owner}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-[1.8fr_0.9fr_0.6fr_0.5fr_0.5fr_0.6fr_0.5fr_0.5fr] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
            <div>Tool</div>
            <div>Server</div>
            <div>Op</div>
            <div>Status</div>
            <div className="text-right">p95</div>
            <div className="text-right">Invok 7d</div>
            <div className="text-right">Sucesso</div>
            <div className="text-right">Cons.</div>
          </div>
          {filtered.map((t) => (
            <Link
              key={t.name}
              to={`/mcp-tools/${t.name}`}
              className="group grid grid-cols-[1.8fr_0.9fr_0.6fr_0.5fr_0.5fr_0.6fr_0.5fr_0.5fr] items-center border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]"
            >
              <div className="flex items-center gap-2">
                <Plug className="h-3.5 w-3.5 text-text-muted" />
                <span className="truncate font-mono text-[12.5px] text-text-primary group-hover:text-accent">{t.name}</span>
              </div>
              <div className="font-mono text-[11.5px] text-text-secondary">{t.server}</div>
              <div>
                <span className={`rounded border px-1 py-0.5 font-mono text-[9px] uppercase ${mcpOpChip[t.op]}`}>{t.op}</span>
              </div>
              <div className="flex items-center gap-1 text-[11.5px]">
                <span className={`h-1.5 w-1.5 rounded-full ${mcpStatusDot[t.status]}`} />
                <span className={t.status === 'ok' ? 'text-success' : t.status === 'degraded' ? 'text-warning' : 'text-failure'}>{t.status}</span>
              </div>
              <div className="text-right font-mono text-[12px] text-text-secondary">{t.p95}</div>
              <div className="text-right font-mono text-[12px] text-text-secondary">{t.invocations7d}</div>
              <div
                className={`text-right font-mono text-[12px] ${
                  t.successRate >= 95 ? 'text-success' : t.successRate >= 85 ? 'text-warning' : 'text-failure'
                }`}
              >
                {t.successRate ? `${t.successRate.toFixed(1)}%` : '—'}
              </div>
              <div className="text-right font-mono text-[12px] text-text-secondary">{t.consumers}</div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

function SensorsListing({
  search,
  view,
  setView,
}: {
  search: string
  view: 'grid' | 'table'
  setView: (v: 'grid' | 'table') => void
}) {
  const [category, setCategory] = useState<SensorItem['category'] | 'all'>('all')
  const [severity, setSeverity] = useState<SensorItem['severity'] | 'all'>('all')
  const [status, setStatus] = useState<SensorItem['status'] | 'all'>('all')

  const filtered = sensors.filter((s) => {
    if (category !== 'all' && s.category !== category) return false
    if (severity !== 'all' && s.severity !== severity) return false
    if (status !== 'all' && s.status !== status) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-text-muted">
          <Filter className="h-3.5 w-3.5" />
          Filtros
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11.5px] text-text-secondary">Categoria</span>
          {(['all', 'security', 'quality', 'performance', 'compliance'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] transition ${
                category === c
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-muted hover:text-text-secondary'
              }`}
            >
              {c === 'all' ? 'todas' : c}
            </button>
          ))}
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11.5px] text-text-secondary">Severity</span>
          {(['all', 'critical', 'high', 'medium', 'low', 'info'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] transition ${
                severity === s
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-muted hover:text-text-secondary'
              }`}
            >
              {s === 'all' ? 'todas' : s}
            </button>
          ))}
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11.5px] text-text-secondary">Status</span>
          {(['all', 'active', 'muted', 'deprecated'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] transition ${
                status === s
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-muted hover:text-text-secondary'
              }`}
            >
              {s === 'all' ? 'todos' : s}
            </button>
          ))}
        </div>
        <ViewToggle view={view} setView={setView} sortLabel="violações ↓" />
      </div>

      <div className="flex items-center justify-between text-[12px] text-text-secondary">
        <div>
          Mostrando <span className="text-text-primary">{filtered.length}</span> de {sensors.length} sensores
        </div>
      </div>

      {filtered.length === 0 ? (
        <PlaceholderListing label="sensores" />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <Link
              key={s.name}
              to={`/sensors/${s.name}`}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-border-strong hover:bg-[#181A1F]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Radar className="h-3.5 w-3.5 flex-none text-text-muted" />
                    <span className="truncate font-mono text-[12.5px] font-medium text-text-primary group-hover:text-accent">
                      {s.name}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10.5px]">
                    <span className={`rounded border px-1.5 py-0.5 font-mono uppercase tracking-wider ${sensorCategoryColor[s.category]}`}>
                      {s.category}
                    </span>
                    <span className={`rounded border px-1.5 py-0.5 font-mono uppercase tracking-wider ${sensorSeverityChip[s.severity]}`}>
                      {s.severity}
                    </span>
                    {s.status !== 'active' && (
                      <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono uppercase tracking-wider text-text-muted">
                        {s.status}
                      </span>
                    )}
                  </div>
                </div>
                <Sparkline data={s.trend} color={s.violations7d > 10 ? '#EF4444' : '#EAB308'} />
              </div>

              <p className="text-[12px] text-text-secondary">{s.description}</p>

              <div className="grid grid-cols-4 gap-2 rounded-md border border-border bg-bg px-3 py-2">
                <div>
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">SAs</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{s.saCount}</div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Runs 7d</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{s.runs7d}</div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Viol. 7d</div>
                  <div
                    className={`font-mono text-[12.5px] ${
                      s.violations7d === 0 ? 'text-success' : s.violations7d > 20 ? 'text-failure' : 'text-warning'
                    }`}
                  >
                    {s.violations7d}
                  </div>
                </div>
                <div className="border-l border-border pl-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">Detec.</div>
                  <div className="font-mono text-[12.5px] text-text-primary">{s.detectionRate ? `${s.detectionRate.toFixed(0)}%` : '—'}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${sensorRunDot[s.lastStatus]}`} />
                    <span className="font-mono">há {s.lastAt}</span>
                  </span>
                  <span>·</span>
                  <span className="font-mono">{s.engine}</span>
                </div>
                <div className="flex flex-none gap-1">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[9.5px] text-text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-[1.8fr_0.7fr_0.6fr_0.5fr_0.5fr_0.5fr_0.6fr_0.6fr] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
            <div>Sensor</div>
            <div>Categoria</div>
            <div>Severity</div>
            <div className="text-right">SAs</div>
            <div className="text-right">Runs 7d</div>
            <div className="text-right">Viol. 7d</div>
            <div className="text-right">Detec.</div>
            <div>Último</div>
          </div>
          {filtered.map((s) => (
            <Link
              key={s.name}
              to={`/sensors/${s.name}`}
              className="group grid grid-cols-[1.8fr_0.7fr_0.6fr_0.5fr_0.5fr_0.5fr_0.6fr_0.6fr] items-center border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]"
            >
              <div className="flex items-center gap-2">
                <Radar className="h-3.5 w-3.5 text-text-muted" />
                <span className="truncate font-mono text-[12.5px] text-text-primary group-hover:text-accent">{s.name}</span>
              </div>
              <div>
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase ${sensorCategoryColor[s.category]}`}>
                  {s.category}
                </span>
              </div>
              <div>
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase ${sensorSeverityChip[s.severity]}`}>
                  {s.severity}
                </span>
              </div>
              <div className="text-right font-mono text-[12px] text-text-secondary">{s.saCount}</div>
              <div className="text-right font-mono text-[12px] text-text-secondary">{s.runs7d}</div>
              <div
                className={`text-right font-mono text-[12px] ${
                  s.violations7d === 0 ? 'text-success' : s.violations7d > 20 ? 'text-failure' : 'text-warning'
                }`}
              >
                {s.violations7d}
              </div>
              <div className="text-right font-mono text-[12px] text-text-secondary">
                {s.detectionRate ? `${s.detectionRate.toFixed(0)}%` : '—'}
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11.5px] text-text-secondary">
                <span className={`h-1.5 w-1.5 rounded-full ${sensorRunDot[s.lastStatus]}`} />
                {s.lastAt}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

function AltSidebar({ type }: { type: AssetType }) {
  if (type === 'workflow') return <WorkflowSidebar />
  if (type === 'skill') return <SkillSidebar />
  if (type === 'mcp') return <McpSidebar />
  if (type === 'sensor') return <SensorSidebar />
  return (
    <div className="sticky top-[80px]">
      <div className="rounded-lg border border-border bg-surface p-4 text-[12px] text-text-muted">
        Sidebar dedicada não implementada pra esse tipo ainda.
      </div>
    </div>
  )
}

function StatCard({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: 'success' | 'warning' | 'failure' | 'info' | 'accent' }) {
  const color =
    tone === 'success'
      ? 'text-success'
      : tone === 'warning'
      ? 'text-warning'
      : tone === 'failure'
      ? 'text-failure'
      : tone === 'info'
      ? 'text-info'
      : tone === 'accent'
      ? 'text-accent'
      : 'text-text-primary'
  return (
    <div className="rounded border border-border bg-bg px-2.5 py-1.5">
      <div className="text-[10.5px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`mt-0.5 font-mono text-[14px] ${color}`}>{value}</div>
      {hint && <div className="text-[10.5px] text-text-muted">{hint}</div>}
    </div>
  )
}

function WorkflowSidebar() {
  const totalRuns = workflows.reduce((a, w) => a + w.runs7d, 0)
  const running = workflows.filter((w) => w.lastStatus === 'running').length
  const awaiting = workflows.filter((w) => w.lastStatus === 'awaiting').length
  const failing = workflows.filter((w) => w.lastStatus === 'failure').length
  const top = [...workflows].sort((a, b) => b.runs7d - a.runs7d).slice(0, 5)
  return (
    <div className="sticky top-[80px] space-y-4">
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-[12.5px] font-semibold tracking-tight">Resumo de workflows</h3>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10.5px] text-accent">
            {workflows.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <StatCard label="Runs 7d" value={totalRuns.toLocaleString('pt-BR')} tone="info" />
          <StatCard label="Em execução" value={`${running}`} tone="info" />
          <StatCard label="Aguardando" value={`${awaiting}`} tone="warning" />
          <StatCard label="Com falha" value={`${failing}`} tone="failure" />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-[12.5px] font-semibold tracking-tight">Mais usados nos últimos 7d</h3>
        </div>
        <ul>
          {top.map((w, i) => (
            <li key={w.name} className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-[11.5px] last:border-b-0">
              <span className="font-mono text-text-muted">{(i + 1).toString().padStart(2, '0')}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-text-primary">{w.name}</span>
              <span className="flex-none font-mono text-text-secondary">{w.runs7d}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-[12.5px] font-semibold tracking-tight">Atividade do catálogo</h3>
        </div>
        <ul className="text-[11.5px]">
          <ActivityRow icon={Zap} tone="info" text="rollout-canary disparado em 3 SAs" ago="2m" />
          <ActivityRow icon={CheckCircle2} tone="success" text="build-and-test atingiu 98.4% sucesso 7d" ago="1h" />
          <ActivityRow icon={AlertTriangle} tone="failure" text="rollback falhou em ssa-investimentos" ago="2h" />
        </ul>
      </div>
    </div>
  )
}

function SkillSidebar() {
  const stable = skills.filter((s) => s.status === 'stable').length
  const beta = skills.filter((s) => s.status === 'beta').length
  const dep = skills.filter((s) => s.status === 'deprecated').length
  const top = [...skills].sort((a, b) => b.invocations7d - a.invocations7d).slice(0, 5)
  return (
    <div className="sticky top-[80px] space-y-4">
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-[12.5px] font-semibold tracking-tight">Resumo de skills</h3>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10.5px] text-accent">
            {skills.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          <StatCard label="Stable" value={`${stable}`} tone="success" />
          <StatCard label="Beta" value={`${beta}`} tone="warning" />
          <StatCard label="Deprecated" value={`${dep}`} />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-[12.5px] font-semibold tracking-tight">Mais invocadas em 7d</h3>
        </div>
        <ul>
          {top.map((s, i) => (
            <li key={s.name} className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-[11.5px] last:border-b-0">
              <span className="font-mono text-text-muted">{(i + 1).toString().padStart(2, '0')}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-text-primary">{s.name}</span>
              <span className="flex-none font-mono text-text-secondary">{s.invocations7d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function McpSidebar() {
  const okCount = mcpTools.filter((t) => t.status === 'ok').length
  const deg = mcpTools.filter((t) => t.status === 'degraded').length
  const off = mcpTools.filter((t) => t.status === 'offline').length
  const totalInvok = mcpTools.reduce((a, t) => a + t.invocations7d, 0)
  return (
    <div className="sticky top-[80px] space-y-4">
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-[12.5px] font-semibold tracking-tight">Saúde do MCP fleet</h3>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10.5px] text-accent">
            {mcpTools.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          <StatCard label="OK" value={`${okCount}`} tone="success" />
          <StatCard label="Degraded" value={`${deg}`} tone="warning" />
          <StatCard label="Offline" value={`${off}`} tone="failure" />
        </div>
        <div className="border-t border-border px-4 py-3">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">Invocações 7d</div>
          <div className="mt-1 font-mono text-[18px] text-text-primary">{totalInvok.toLocaleString('pt-BR')}</div>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-[12.5px] font-semibold tracking-tight">Servidores</h3>
        </div>
        <ul>
          {Array.from(new Set(mcpTools.map((t) => t.server))).map((srv) => {
            const tools = mcpTools.filter((t) => t.server === srv)
            const degraded = tools.some((t) => t.status === 'degraded' || t.status === 'offline')
            return (
              <li key={srv} className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-[11.5px] last:border-b-0">
                <span className={`h-1.5 w-1.5 rounded-full ${degraded ? 'bg-warning' : 'bg-success'}`} />
                <span className="min-w-0 flex-1 truncate font-mono text-text-primary">{srv}</span>
                <span className="flex-none font-mono text-text-secondary">{tools.length}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function SensorSidebar() {
  const violations = sensors.reduce((a, s) => a + s.violations7d, 0)
  const active = sensors.filter((s) => s.status === 'active').length
  const critical = sensors.filter((s) => s.severity === 'critical').length
  return (
    <div className="sticky top-[80px] space-y-4">
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-[12.5px] font-semibold tracking-tight">Saúde da malha de sensores</h3>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10.5px] text-accent">
            {sensors.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <StatCard label="Ativos" value={`${active}`} tone="success" />
          <StatCard label="Críticos" value={`${critical}`} tone="failure" />
          <StatCard label="Violações 7d" value={`${violations}`} tone="warning" />
          <StatCard label="Detecção média" value={`${Math.round(sensors.reduce((a, s) => a + s.detectionRate, 0) / sensors.length)}%`} tone="info" />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-[12.5px] font-semibold tracking-tight">Categorias</h3>
        </div>
        <div className="p-3">
          {(['security', 'compliance', 'quality', 'performance'] as const).map((cat) => {
            const subset = sensors.filter((s) => s.category === cat)
            const totalViol = subset.reduce((a, s) => a + s.violations7d, 0)
            return (
              <DistRow
                key={cat}
                label={cat}
                value={totalViol}
                total={violations}
                color={
                  cat === 'security'
                    ? 'bg-failure'
                    : cat === 'compliance'
                    ? 'bg-accent'
                    : cat === 'quality'
                    ? 'bg-info'
                    : 'bg-warning'
                }
              />
            )
          })}
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-[12.5px] font-semibold tracking-tight">Últimas violações</h3>
        </div>
        <ul className="text-[11.5px]">
          <ActivityRow icon={CircleDot} tone="failure" text="cve-scan-deps falhou em ssa-credito-prefixado" ago="3m" />
          <ActivityRow icon={AlertTriangle} tone="failure" text="pix-policy-block · ssa-pix-core" ago="14m" />
          <ActivityRow icon={AlertTriangle} tone="failure" text="tls-cert-expiry-30d · ssa-callcenter-cti" ago="4h" />
        </ul>
      </div>
    </div>
  )
}
