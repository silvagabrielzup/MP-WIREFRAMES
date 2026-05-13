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
  Wrench,
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
  { id: 'mcp', label: 'MCP Tools', icon: Wrench, count: 56 },
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
            <span>SAs</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Todas</span>
          </nav>
          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[24px] font-semibold tracking-tight">Catálogo</h1>
              <p className="mt-1 text-[12.5px] text-text-secondary">
                <span className="text-text-primary">{sas.length}</span> SAs ·{' '}
                <span className="text-success">{onPlatCount} ON-PLAT</span> ·{' '}
                <span className="text-text-muted">{sas.length - onPlatCount} off-plat</span> · IUConfia médio{' '}
                <span className="text-text-primary">{avgScore}</span>
              </p>
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
      </div>

      {/* Right sidebar */}
      <aside className="hidden w-[280px] flex-none xl:block">
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
