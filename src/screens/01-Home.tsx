import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Loader2,
  MoreHorizontal,
  Check,
  Sparkles,
  Boxes,
  X,
  Search,
  GitBranch,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  ArrowRightLeft,
  Activity,
  Lock,
  Server,
  Code2,
  Database,
  Settings as SettingsIcon,
  Wrench,
  PartyPopper,
  LayoutGrid,
  Trophy,
} from 'lucide-react'
import { useWorkflows } from '../contexts/WorkflowsProvider'
import { executionTemplateIds, workflows as workflowTemplates } from '../data/database'

type StepStatus = 'done' | 'in-progress' | 'not-started'

type OnboardingStep = {
  id: number
  stepId: string
  title: string
  description: string
  ctaLabel: string
  completedOnClick: boolean
  status: StepStatus
  finalStep: boolean
}

function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof CheckCircle2
  title: string
  hint: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Icon className="h-4 w-4 text-text-muted" />
      </span>
      <div className="text-[13px] font-medium text-text-secondary">{title}</div>
      <div className="max-w-[280px] text-[11.5px] text-text-muted">{hint}</div>
    </div>
  )
}

function StepCheckbox({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-success/40 bg-success/10">
        <Check className="h-3.5 w-3.5 text-success" />
      </span>
    )
  }
  if (status === 'in-progress') {
    return (
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-accent bg-accent/10">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
      </span>
    )
  }
  return <span className="h-6 w-6 flex-none rounded-full border border-border bg-bg" />
}

function OnboardingStepRow({
  step,
  attenuated,
  onActivate,
}: {
  step: OnboardingStep
  attenuated: boolean
  onActivate: (step: OnboardingStep) => void
}) {
  const isDone = step.status === 'done'
  const isInProgress = step.status === 'in-progress'

  if (isDone) {
    return (
      <li className="flex items-center gap-3 border-b border-border px-4 py-2.5 opacity-60 last:border-b-0">
        <StepCheckbox status="done" />
        <span className="flex-1 truncate text-[12.5px] text-text-muted line-through">
          {step.title}
        </span>
      </li>
    )
  }

  const canComplete = isInProgress && step.completedOnClick
  const handleActivate = () => onActivate(step)

  return (
    <li
      onClick={handleActivate}
      className={`flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-[#181A1F] ${
        isInProgress ? 'border-l-2 border-l-accent bg-accent/5' : ''
      } ${attenuated ? 'opacity-80' : ''}`}
    >
      <StepCheckbox status={step.status} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[12.5px] font-medium text-text-primary">{step.title}</span>
          {isInProgress && (
            <span className="flex-none rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
              em curso
            </span>
          )}
        </div>
        <div className="mt-0.5 truncate text-[11.5px] text-text-muted">{step.description}</div>
      </div>
      <div className="flex flex-none items-center gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleActivate()
          }}
          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11.5px] font-medium transition ${
            canComplete
              ? 'border-accent/40 bg-accent/10 text-accent hover:bg-accent/20'
              : 'border-border bg-bg text-text-secondary hover:border-border-strong hover:text-text-primary'
          }`}
        >
          {step.ctaLabel}
          <ArrowRight className="h-3 w-3" />
        </button>
        <button
          type="button"
          aria-label="opções"
          title="dispensar · marcar como feito · lembrar depois"
          onClick={(e) => e.stopPropagation()}
          className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:bg-bg hover:text-text-primary"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  )
}

type RepoKind = 'code' | 'ci-cd' | 'infra' | 'db' | 'config'

const REPO_KIND_META: Record<
  RepoKind,
  { label: string; tone: string }
> = {
  'code': { label: 'código', tone: 'border-info/30 bg-info/10 text-info' },
  'ci-cd': { label: 'ci/cd', tone: 'border-accent/30 bg-accent/10 text-accent' },
  'infra': { label: 'infra', tone: 'border-warning/30 bg-warning/10 text-warning' },
  'db': { label: 'banco', tone: 'border-success/30 bg-success/10 text-success' },
  'config': { label: 'config', tone: 'border-border bg-bg text-text-secondary' },
}

type ServiceRepo = {
  name: string
  kind: RepoKind
  stack: string
  size: string
  lastCommit: string
}

const MOCK_SERVICE = {
  sa: 'ssa-pix-core',
  name: 'Pix Core',
  description:
    'Serviço de pagamentos instantâneos Pix — gestão de chaves, transações, idempotência e webhooks.',
  squad: 'squad-pix',
  org: 'itau-applications',
  repos: [
    {
      name: 'pix-core',
      kind: 'code' as RepoKind,
      stack: 'Java 17 · Spring Boot 3.2',
      size: '184 MB · 2.418 arquivos',
      lastCommit: 'há 2h · feat(payment): retry com backoff exponencial',
    },
    {
      name: 'pix-core-pipeline',
      kind: 'ci-cd' as RepoKind,
      stack: 'Groovy · Jenkins shared lib',
      size: '4.2 MB · 38 arquivos',
      lastCommit: 'há 1d · chore: bump jenkins-shared-library v4.2',
    },
    {
      name: 'pix-core-infra',
      kind: 'infra' as RepoKind,
      stack: 'Terraform 1.5 · AWS modules',
      size: '18 MB · 142 arquivos',
      lastCommit: 'há 3d · feat(network): private endpoint pra Aurora',
    },
    {
      name: 'pix-core-db',
      kind: 'db' as RepoKind,
      stack: 'Liquibase · SQL Aurora',
      size: '2.8 MB · 96 arquivos',
      lastCommit: 'há 5d · feat: índice composto em transacao_idem',
    },
    {
      name: 'pix-core-config',
      kind: 'config' as RepoKind,
      stack: 'YAML · K8s manifests',
      size: '780 KB · 24 arquivos',
      lastCommit: 'há 6h · chore: refresh config map pra hml',
    },
  ] satisfies ServiceRepo[],
}

type TreeAction = 'moved' | 'added' | 'removed'
type TreeNode = {
  name: string
  type: 'dir' | 'file'
  action?: TreeAction
  defaultOpen?: boolean
  children?: TreeNode[]
}

const BEFORE_TREES: TreeNode[] = [
  {
    name: 'pix-core',
    type: 'dir',
    defaultOpen: true,
    children: [
      {
        name: 'src',
        type: 'dir',
        defaultOpen: true,
        children: [
          {
            name: 'main',
            type: 'dir',
            children: [
              {
                name: 'java',
                type: 'dir',
                children: [
                  {
                    name: 'com.itau.pix',
                    type: 'dir',
                    children: [
                      { name: 'Application.java', type: 'file' },
                      { name: 'PaymentService.java', type: 'file' },
                      { name: 'PixController.java', type: 'file' },
                    ],
                  },
                ],
              },
              {
                name: 'resources',
                type: 'dir',
                children: [
                  { name: 'application.yaml', type: 'file' },
                  { name: 'logback.xml', type: 'file' },
                ],
              },
            ],
          },
          { name: 'test', type: 'dir', children: [{ name: 'java', type: 'dir' }] },
        ],
      },
      { name: 'pom.xml', type: 'file' },
      { name: 'Dockerfile', type: 'file' },
      { name: 'README.md', type: 'file' },
    ],
  },
  {
    name: 'pix-core-pipeline',
    type: 'dir',
    defaultOpen: true,
    children: [
      { name: 'Jenkinsfile', type: 'file' },
      {
        name: 'shared',
        type: 'dir',
        children: [
          { name: 'build.groovy', type: 'file' },
          { name: 'deploy.groovy', type: 'file' },
          { name: 'rollback.groovy', type: 'file' },
        ],
      },
      { name: 'README.md', type: 'file' },
    ],
  },
  {
    name: 'pix-core-infra',
    type: 'dir',
    children: [
      {
        name: 'modules',
        type: 'dir',
        children: [
          { name: 'eks', type: 'dir' },
          { name: 'aurora', type: 'dir' },
          { name: 'msk', type: 'dir' },
        ],
      },
      {
        name: 'envs',
        type: 'dir',
        children: [
          { name: 'dev', type: 'dir' },
          { name: 'hml', type: 'dir' },
          { name: 'prod', type: 'dir' },
        ],
      },
    ],
  },
  {
    name: 'pix-core-db',
    type: 'dir',
    children: [
      {
        name: 'changelog',
        type: 'dir',
        children: [{ name: 'db.changelog-master.xml', type: 'file' }],
      },
      {
        name: 'migrations',
        type: 'dir',
        children: [
          { name: '001-create-transacao.sql', type: 'file' },
          { name: '002-add-idem-key.sql', type: 'file' },
        ],
      },
    ],
  },
  {
    name: 'pix-core-config',
    type: 'dir',
    children: [
      {
        name: 'k8s',
        type: 'dir',
        children: [
          { name: 'dev.yaml', type: 'file' },
          { name: 'hml.yaml', type: 'file' },
          { name: 'prod.yaml', type: 'file' },
        ],
      },
    ],
  },
]

const AFTER_TREE: TreeNode = {
  name: 'vanilla-monorepo',
  type: 'dir',
  defaultOpen: true,
  children: [
    {
      name: 'apps',
      type: 'dir',
      defaultOpen: true,
      children: [
        {
          name: 'ssa-pix-core',
          type: 'dir',
          defaultOpen: true,
          action: 'added',
          children: [
            {
              name: 'src',
              type: 'dir',
              action: 'moved',
              children: [
                {
                  name: 'main',
                  type: 'dir',
                  children: [
                    {
                      name: 'java',
                      type: 'dir',
                      children: [
                        {
                          name: 'com.itau.pix',
                          type: 'dir',
                          children: [
                            { name: 'Application.java', type: 'file' },
                            { name: 'PaymentService.java', type: 'file' },
                            { name: 'PixController.java', type: 'file' },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'resources',
                      type: 'dir',
                      children: [
                        { name: 'application.yaml', type: 'file' },
                        { name: 'logback.xml', type: 'file' },
                      ],
                    },
                  ],
                },
                { name: 'test', type: 'dir', children: [{ name: 'java', type: 'dir' }] },
              ],
            },
            { name: 'pom.xml', type: 'file', action: 'moved' },
            { name: 'Dockerfile', type: 'file', action: 'moved' },
            {
              name: 'ci',
              type: 'dir',
              action: 'moved',
              children: [
                { name: 'kaptain.yaml', type: 'file', action: 'added' },
                {
                  name: 'steps',
                  type: 'dir',
                  children: [
                    { name: 'build.groovy', type: 'file' },
                    { name: 'deploy.groovy', type: 'file' },
                    { name: 'rollback.groovy', type: 'file' },
                  ],
                },
              ],
            },
            {
              name: 'infra',
              type: 'dir',
              action: 'moved',
              children: [
                {
                  name: 'modules',
                  type: 'dir',
                  children: [
                    { name: 'eks', type: 'dir' },
                    { name: 'aurora', type: 'dir' },
                    { name: 'msk', type: 'dir' },
                  ],
                },
                {
                  name: 'envs',
                  type: 'dir',
                  children: [
                    { name: 'dev', type: 'dir' },
                    { name: 'hml', type: 'dir' },
                    { name: 'prod', type: 'dir' },
                  ],
                },
              ],
            },
            {
              name: 'db',
              type: 'dir',
              action: 'moved',
              children: [
                {
                  name: 'changelog',
                  type: 'dir',
                  children: [{ name: 'db.changelog-master.xml', type: 'file' }],
                },
                {
                  name: 'migrations',
                  type: 'dir',
                  children: [
                    { name: '001-create-transacao.sql', type: 'file' },
                    { name: '002-add-idem-key.sql', type: 'file' },
                  ],
                },
              ],
            },
            {
              name: 'config',
              type: 'dir',
              action: 'moved',
              children: [
                { name: 'dev.yaml', type: 'file' },
                { name: 'hml.yaml', type: 'file' },
                { name: 'prod.yaml', type: 'file' },
              ],
            },
            { name: 'komply.yaml', type: 'file', action: 'added' },
            { name: 'orkestra.yaml', type: 'file', action: 'added' },
          ],
        },
      ],
    },
    {
      name: 'tooling',
      type: 'dir',
      defaultOpen: true,
      action: 'added',
      children: [{ name: 'vanilla.lock', type: 'file', action: 'added' }],
    },
  ],
}

type TechDebtItem = {
  icon: 'GitBranch' | 'Lock' | 'AlertTriangle' | 'Server' | 'Activity' | 'ShieldCheck'
  title: string
  impact: string
  resolution: string
}

const TECH_DEBT: TechDebtItem[] = [
  {
    icon: 'GitBranch',
    title: 'Pipeline Jenkins free-form',
    impact:
      'Pipeline declarado via DSL Groovy livre, sem audit trail estruturado; difícil de versionar e replicar entre SAs.',
    resolution:
      'Substituído por Kaptain declarativo em YAML, com snapshot de cada execução e SLO observado.',
  },
  {
    icon: 'Lock',
    title: 'Secrets versionados em repo de config',
    impact:
      'Strings base64 de credenciais HML/PROD commitadas em k8s/*.yaml — viola Komply data-classification.',
    resolution:
      'Migrado pra Vault-backed via SecretProviderClass; Komply bloqueia commits com `kind: Secret` literal.',
  },
  {
    icon: 'AlertTriangle',
    title: 'Auto-rollback ausente em deploy',
    impact:
      'Rollback de prod só manual via approval Jenkins. MTTR médio 23min nos últimos 90d.',
    resolution:
      'Traffik observa p99/erro contra SLO; rollback automático se janela de 5min viola threshold.',
  },
  {
    icon: 'Server',
    title: 'Imagens base sem scan de CVE',
    impact:
      'Dockerfile usa `openjdk:8` plano; última build trouxe 14 CVEs HIGH não tratadas.',
    resolution:
      'Komply força imagem base aprovada (`itau-jdk-21:lts`) + scan obrigatório no Konstructor.',
  },
  {
    icon: 'Activity',
    title: 'Sem dashboards padronizados',
    impact:
      'Cada SA monta seu Datadog dashboard; comparar saúde entre apps é impossível.',
    resolution:
      'Orkestra injeta dashboards padrão (p99, erro %, saturação CPU/mem) na primeira subida.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Versionamento de schema manual',
    impact:
      'Equipe roda `psql` em prod via bastion; auditoria precária e drift HML/PROD.',
    resolution:
      'Liquibase no motor de Migration; cada PR de DB gera changeset versionado aplicado via dual-write.',
  },
]

const ACTION_LABEL: Record<TreeAction, string> = {
  moved: 'mov',
  added: 'novo',
  removed: 'remov',
}

function TreeNodeView({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(node.defaultOpen ?? false)
  const isDir = node.type === 'dir'
  const indent = depth * 14 + 6

  const rowTone =
    node.action === 'added'
      ? 'border-success/25 bg-success/[0.04]'
      : node.action === 'removed'
      ? 'border-failure/25 bg-failure/[0.04]'
      : node.action === 'moved'
      ? 'border-info/25 bg-info/[0.04]'
      : 'border-transparent hover:bg-bg/60'

  const nameTone =
    node.action === 'removed'
      ? 'text-failure line-through'
      : node.action === 'added'
      ? 'text-success'
      : node.action === 'moved'
      ? 'text-info'
      : 'text-text-secondary'

  const badgeTone =
    node.action === 'added'
      ? 'bg-success/15 text-success'
      : node.action === 'removed'
      ? 'bg-failure/15 text-failure'
      : 'bg-info/15 text-info'

  return (
    <>
      <div
        role={isDir ? 'button' : undefined}
        aria-expanded={isDir ? open : undefined}
        onClick={isDir ? () => setOpen((v) => !v) : undefined}
        style={{ paddingLeft: `${indent}px` }}
        className={`flex items-center gap-1.5 rounded border py-0.5 pr-1.5 font-mono text-[11px] ${
          isDir ? 'cursor-pointer' : 'cursor-default'
        } ${rowTone}`}
      >
        {isDir ? (
          open ? (
            <ChevronDown className="h-3 w-3 flex-none text-text-muted" />
          ) : (
            <ChevronRight className="h-3 w-3 flex-none text-text-muted" />
          )
        ) : (
          <span className="h-3 w-3 flex-none" />
        )}
        {isDir ? (
          open ? (
            <FolderOpen className="h-3.5 w-3.5 flex-none text-accent" />
          ) : (
            <Folder className="h-3.5 w-3.5 flex-none text-text-secondary" />
          )
        ) : (
          <FileCode2 className="h-3 w-3 flex-none text-text-muted" />
        )}
        <span className={`flex-1 truncate ${nameTone}`}>
          {node.name}
          {isDir ? '/' : ''}
        </span>
        {node.action && (
          <span
            className={`flex-none rounded px-1 text-[9.5px] font-medium uppercase tracking-wider ${badgeTone}`}
          >
            {ACTION_LABEL[node.action]}
          </span>
        )}
      </div>
      {isDir && open && node.children?.map((c) => (
        <TreeNodeView key={c.name} node={c} depth={depth + 1} />
      ))}
    </>
  )
}

type ModalStep = 1 | 2 | 3

const STEP_LABELS: Record<ModalStep, string> = {
  1: 'Buscar Serviço',
  2: 'Estrutura mono-repo',
  3: 'Débitos técnicos resolvidos',
}

const TECH_DEBT_ICONS = {
  GitBranch,
  Lock,
  AlertTriangle,
  Server,
  Activity,
  ShieldCheck,
} as const

const REPO_KIND_ICONS: Record<RepoKind, typeof Code2> = {
  'code': Code2,
  'ci-cd': Wrench,
  'infra': Server,
  'db': Database,
  'config': SettingsIcon,
}

function RepoPickerModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const [step, setStep] = useState<ModalStep>(1)
  const [serviceQuery, setServiceQuery] = useState(MOCK_SERVICE.sa)
  const [searched, setSearched] = useState(false)

  if (!open) return null

  const reset = () => {
    setStep(1)
    setSearched(false)
    setServiceQuery(MOCK_SERVICE.sa)
  }
  const handleClose = () => {
    reset()
    onClose()
  }
  const handleConfirm = () => {
    reset()
    onConfirm()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[760px] overflow-hidden rounded-lg border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-accent" />
              <h2 className="text-[15px] font-semibold tracking-tight">
                Selecionar repositório pra migração
              </h2>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
              {([1, 2, 3] as ModalStep[]).map((n, i) => (
                <span key={n} className="flex items-center gap-2">
                  {i > 0 && <ArrowRight className="h-3 w-3 text-text-muted" />}
                  <span
                    className={`flex h-5 items-center gap-1.5 rounded-full border px-2 ${
                      step === n
                        ? 'border-accent/40 bg-accent/10 text-accent'
                        : 'border-border bg-bg text-text-muted'
                    }`}
                  >
                    <span className="font-mono">{n}</span> {STEP_LABELS[n]}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            aria-label="fechar"
            onClick={handleClose}
            className="flex h-7 w-7 flex-none items-center justify-center rounded text-text-muted hover:bg-bg hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {step === 1 && (
          <section className="space-y-4 px-5 py-5">
            <div>
              <label className="block text-[12px] font-medium text-text-secondary">
                Busca por Serviço de Aplicação
              </label>
              <p className="mt-0.5 text-[11.5px] text-text-muted">
                Informe a SA do serviço. A arquitetura do mono-repo Vanilla traz junto todos os
                repositórios da família (código, ci/cd, infra, db, config) — todos vão ser
                migrados como uma unidade.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-bg px-3 py-2 focus-within:border-accent">
                  <Search className="h-3.5 w-3.5 flex-none text-text-muted" />
                  <input
                    type="text"
                    value={serviceQuery}
                    onChange={(e) => {
                      setServiceQuery(e.target.value)
                      setSearched(false)
                    }}
                    placeholder="ssa-<servico>"
                    className="flex-1 bg-transparent font-mono text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearched(true)}
                  disabled={!serviceQuery.trim()}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Search className="h-3.5 w-3.5" />
                  Buscar
                </button>
              </div>
            </div>

            {searched && (
              <div className="space-y-3">
                <div className="rounded-md border border-border bg-bg px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-success/15 text-success">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="font-mono text-[12.5px] text-text-primary">
                          {MOCK_SERVICE.org}/{MOCK_SERVICE.sa}
                        </div>
                        <div className="text-[11px] text-text-muted">{MOCK_SERVICE.name} · {MOCK_SERVICE.squad}</div>
                      </div>
                    </div>
                    <span className="flex-none rounded border border-success/30 bg-success/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-success">
                      {MOCK_SERVICE.repos.length} repos
                    </span>
                  </div>
                  <div className="mt-2 text-[11.5px] text-text-secondary">
                    {MOCK_SERVICE.description}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="px-1 text-[10.5px] uppercase tracking-wider text-text-muted">
                    Repositórios da família ({MOCK_SERVICE.repos.length})
                  </div>
                  {MOCK_SERVICE.repos.map((r) => {
                    const KindIcon = REPO_KIND_ICONS[r.kind]
                    const kind = REPO_KIND_META[r.kind]
                    return (
                      <div
                        key={r.name}
                        className="flex items-center gap-3 rounded-md border border-border bg-bg px-3 py-2"
                      >
                        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md border border-border bg-surface">
                          <KindIcon className="h-3.5 w-3.5 text-text-secondary" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-mono text-[12px] text-text-primary">
                              {r.name}
                            </span>
                            <span
                              className={`flex-none rounded-full border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider ${kind.tone}`}
                            >
                              {kind.label}
                            </span>
                          </div>
                          <div className="mt-0.5 truncate text-[11px] text-text-muted">
                            {r.stack} · {r.size}
                          </div>
                        </div>
                        <span className="hidden flex-none font-mono text-[10.5px] text-text-muted sm:block">
                          {r.lastCommit}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="space-y-3 px-5 py-5">
            <div className="text-[12px] text-text-secondary">
              Cada repositório da família vira uma pasta dentro de{' '}
              <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-[11px] text-accent">
                apps/ssa-pix-core/
              </code>{' '}
              — código no root, e <code className="font-mono text-[11px] text-accent">ci/</code>,{' '}
              <code className="font-mono text-[11px] text-accent">infra/</code>,{' '}
              <code className="font-mono text-[11px] text-accent">db/</code> e{' '}
              <code className="font-mono text-[11px] text-accent">config/</code> como sub-pastas.
              A tooling Vanilla (Komply, Kaptain, Orkestra) é injetada no caminho do app.
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-border bg-bg p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
                    Antes · multi-repo
                  </h4>
                  <span className="font-mono text-[10.5px] text-text-muted">
                    {BEFORE_TREES.length} repos
                  </span>
                </div>
                <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
                  {BEFORE_TREES.map((tree) => (
                    <div
                      key={tree.name}
                      className="rounded border border-border/60 bg-surface/40 p-2"
                    >
                      <div className="space-y-0.5">
                        <TreeNodeView node={tree} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/[0.04] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
                    Depois · mono-repo Vanilla
                  </h4>
                  <span className="font-mono text-[10.5px] text-text-muted">unificado</span>
                </div>
                <div className="max-h-[400px] space-y-0.5 overflow-y-auto pr-1">
                  <TreeNodeView node={AFTER_TREE} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10.5px] text-text-muted">
              <span className="flex items-center gap-1">
                <ArrowRightLeft className="h-3 w-3 text-info" /> movido
              </span>
              <span className="flex items-center gap-1">
                <Plus className="h-3 w-3 text-success" /> adicionado
              </span>
              <span className="flex items-center gap-1">
                <Minus className="h-3 w-3 text-failure" /> removido
              </span>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-3 px-5 py-5">
            <div className="text-[12px] text-text-secondary">
              A migração resolve débitos técnicos acumulados nos repositórios da família —
              especialmente em infra, observabilidade e segurança. Cada item abaixo é fechado
              automaticamente pelo template Vanilla.
            </div>
            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {TECH_DEBT.map((d) => {
                const Icon = TECH_DEBT_ICONS[d.icon]
                return (
                  <div
                    key={d.title}
                    className="rounded-md border border-border bg-bg p-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-warning/15 text-warning">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-[12.5px] font-semibold text-text-primary">
                            {d.title}
                          </h5>
                          <span className="flex-none rounded-full border border-failure/30 bg-failure/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-failure">
                            débito
                          </span>
                        </div>
                        <div className="mt-1 text-[11.5px] text-text-secondary">
                          <span className="text-text-muted">Hoje:</span> {d.impact}
                        </div>
                        <div className="mt-1 text-[11.5px] text-success">
                          <span className="text-text-muted">Pós-migração:</span> {d.resolution}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="rounded-md border border-success/30 bg-success/[0.06] px-3 py-2 text-[11.5px] text-success">
              {TECH_DEBT.length} débitos técnicos serão resolvidos automaticamente ao confirmar
              a migração.
            </div>
          </section>
        )}

        <footer className="flex items-center justify-between border-t border-border bg-bg/50 px-5 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="text-[12px] text-text-secondary hover:text-text-primary"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
                className="inline-flex h-9 items-center rounded-md border border-border bg-bg px-3 text-[12px] text-text-secondary hover:border-border-strong hover:text-text-primary"
              >
                Voltar
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s === 1 ? 2 : 3))}
                disabled={step === 1 && !searched}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próximo
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black transition hover:bg-accent-hover"
              >
                <Check className="h-3.5 w-3.5" />
                Confirmar migração
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}

function OnboardingPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Boxes className="h-5 w-5 text-text-muted" />
      </span>
      <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">
        Nada para fazer agora
      </h3>
      <p className="max-w-[420px] text-[12.5px] text-text-secondary">
        Você ainda não tem uma jornada de onboarding ativa. Escolha um workflow no Assets Catalog
        para que os próximos passos apareçam aqui.
      </p>
      <Link
        to="/catalog"
        className="mt-2 inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-[12.5px] font-medium text-black transition hover:bg-accent-hover"
      >
        <Boxes className="h-4 w-4" />
        Ir para o Assets Catalog
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

function CongratsAlert({
  workflowName,
  saName,
  totalSteps,
}: {
  workflowName: string
  saName: string
  totalSteps: number
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-success/40 bg-gradient-to-br from-success/15 via-accent/10 to-bg">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 28 }).map((_, i) => {
          const cx = (i * 53) % 400
          const cy = (i * 37) % 200
          const r = (i % 3) + 1.5
          const palette = ['#22c55e', '#FF6B2C', '#22D3EE', '#facc15']
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={palette[i % palette.length]}
              opacity={0.45}
            />
          )
        })}
      </svg>

      <div className="relative px-6 py-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-success/40 bg-success/15 shadow-[0_0_0_6px_rgba(34,197,94,0.06)]">
          <PartyPopper className="h-7 w-7 text-success" />
        </div>
        <h2 className="mt-4 text-[22px] font-semibold tracking-tight text-text-primary">
          Parabéns, Luigi! <span aria-hidden>🎉</span>
        </h2>
        <p className="mx-auto mt-2 max-w-[520px] text-[13px] text-text-secondary">
          O fluxo <span className="font-mono text-text-primary">{workflowName}</span> para a SA{' '}
          <span className="font-mono text-text-primary">{saName}</span> foi concluído com sucesso.
          Sua aplicação está <span className="text-success">on-platform</span> e saudável em HML.
        </p>

        <div className="mx-auto mt-4 flex max-w-[520px] items-center justify-center gap-2 text-[11px] text-text-muted">
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-success">
            <Check className="h-3 w-3" />
            {totalSteps} passos
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-success">
            <Check className="h-3 w-3" />
            pipeline executado
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-success">
            <Check className="h-3 w-3" />
            canário 100%
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Link
            to={`/application-hub/${saName}`}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-[12.5px] font-medium text-black transition hover:bg-accent-hover"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Ver Application Hub
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/workflows"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-bg px-4 text-[12.5px] text-text-secondary transition hover:border-border-strong hover:text-text-primary"
          >
            <Trophy className="h-3.5 w-3.5" />
            Workflow Tracker
          </Link>
        </div>
      </div>
    </div>
  )
}

function OnboardingCard({
  steps,
  contextLabel,
  onActivate,
}: {
  steps: OnboardingStep[]
  contextLabel?: string
  onActivate: (step: OnboardingStep) => void
}) {
  if (steps.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <h3 className="text-[14px] font-semibold tracking-tight">Próximos passos</h3>
          </div>
        </div>
        <OnboardingPlaceholder />
      </div>
    )
  }

  const regularSteps = steps.filter((s) => !s.finalStep)
  const finalSteps = steps.filter((s) => s.finalStep)
  const finalStep = finalSteps[0]
  const total = regularSteps.length || steps.length
  const doneCount = regularSteps.filter((s) => s.status === 'done').length
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0
  const inProgressIdx = regularSteps.findIndex((s) => s.status === 'in-progress')
  const allRegularDone = doneCount === total

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <h3 className="text-[14px] font-semibold tracking-tight">Próximos passos</h3>
          {contextLabel && (
            <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary">
              {contextLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11.5px] text-text-secondary">
            <span className="font-mono text-text-primary">{doneCount}</span> de{' '}
            <span className="font-mono text-text-primary">{total}</span> passos ·{' '}
            <span className="font-mono text-text-primary">{pct}%</span> completo
          </span>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-bg">
            <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <ul>
        {regularSteps.map((s, i) => {
          const attenuated =
            s.status === 'not-started' && inProgressIdx >= 0 && i > inProgressIdx
          return (
            <OnboardingStepRow
              key={s.id}
              step={s}
              attenuated={attenuated}
              onActivate={onActivate}
            />
          )
        })}
      </ul>

      {finalStep && (
        <div
          className={`border-t border-border px-4 py-3 ${
            allRegularDone ? 'bg-accent/[0.06]' : 'opacity-60'
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full border border-accent/40 bg-accent/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
              último passo
            </span>
            {allRegularDone && (
              <span className="text-[10.5px] uppercase tracking-wider text-success">
                fluxo 100% completo
              </span>
            )}
          </div>
          <OnboardingStepRow
            step={finalStep}
            attenuated={!allRegularDone}
            onActivate={onActivate}
          />
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const { workflows: instances, advanceStep, addWorkflow, appHubAlerts } = useWorkflows()
  const primaryInstance = [...instances]
    .reverse()
    .find((inst) => !executionTemplateIds.has(inst.templateId))
  const lastWorkflow =
    primaryInstance ?? (instances.length > 0 ? instances[instances.length - 1] : null)
  const [repoModalOpen, setRepoModalOpen] = useState(false)

  const onboardingSteps: OnboardingStep[] = lastWorkflow
    ? (() => {
        const template = workflowTemplates.find((t) => t.id === lastWorkflow.templateId)
        return lastWorkflow.steps.map((s, i) => {
          const tmplStep = template?.onboardingSteps.find((ts) => ts.id === s.id)
          const status: StepStatus =
            s.status === 'in-progress'
              ? 'in-progress'
              : s.status === 'done'
              ? 'done'
              : 'not-started'
          return {
            id: i + 1,
            stepId: s.id,
            title: s.title,
            description: tmplStep?.description ?? '',
            ctaLabel: tmplStep?.ctaLabel ?? 'Abrir',
            completedOnClick: tmplStep?.completedOnClick ?? false,
            status,
            finalStep: tmplStep?.finalStep ?? false,
          }
        })
      })()
    : []

  const handleStepActivate = (step: OnboardingStep) => {
    if (!lastWorkflow) return
    if (step.status !== 'in-progress') return
    if (step.stepId === 'step-03-select-repos') {
      setRepoModalOpen(true)
      return
    }
    if (!step.completedOnClick) return
    advanceStep(lastWorkflow.id)

    const template = workflowTemplates.find((t) => t.id === lastWorkflow.templateId)
    const tmplStep = template?.onboardingSteps.find((s) => s.id === step.stepId)
    if (tmplStep?.triggers) {
      const alreadyTriggered = instances.some(
        (inst) => inst.templateId === tmplStep.triggers!.id,
      )
      if (!alreadyTriggered) addWorkflow(tmplStep.triggers)
    }

  }

  const handleRepoConfirm = () => {
    if (lastWorkflow) advanceStep(lastWorkflow.id)
    setRepoModalOpen(false)
  }

  const pendingAgenticItems = instances.flatMap((wf) =>
    wf.pendingAgenticFlow.map((item) => ({
      ...item,
      workflowInstanceId: wf.id,
      workflowName: wf.templateName,
    })),
  )

  const formatRelativeAgo = (iso: string): string => {
    const elapsedMs = Date.now() - new Date(iso).getTime()
    if (Number.isNaN(elapsedMs) || elapsedMs < 5000) return 'agora'
    const sec = Math.floor(elapsedMs / 1000)
    if (sec < 60) return `há ${sec}s`
    const min = Math.floor(sec / 60)
    if (min < 60) return `há ${min}min`
    const hr = Math.floor(min / 60)
    return `há ${hr}h`
  }

  return (
    <div className="space-y-10">
      {/* Section 1 — Hero compacto */}
      <section>
        <h1 className="text-[26px] font-semibold tracking-tight">Bom dia, Luigi</h1>
        <p className="mt-1.5 text-[13.5px] text-text-secondary">
          Sem workflows ativos no momento — comece onboardando uma SA ou escolhendo um workflow no catálogo.
        </p>
      </section>

      {/* Section 2 — Onboarding card (ou alert de congrats se 100%) + Fluxos pendentes (50/50) */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {lastWorkflow?.status === 'completed' ? (
          <CongratsAlert
            workflowName={lastWorkflow.templateName}
            saName={(() => {
              const tmpl = workflowTemplates.find((t) => t.id === lastWorkflow.templateId)
              return (
                tmpl?.inputs.find((i) => i.name === 'sa_id')?.default ?? 'ssa-pix-core'
              )
            })()}
            totalSteps={lastWorkflow.steps.length}
          />
        ) : (
          <OnboardingCard
            steps={onboardingSteps}
            contextLabel={lastWorkflow?.templateName}
            onActivate={handleStepActivate}
          />
        )}

        <div className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <h3 className="text-[13.5px] font-semibold tracking-tight">
                Fluxos agênticos pendentes aprovação
              </h3>
            </div>
            {pendingAgenticItems.length > 0 && (
              <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
                {pendingAgenticItems.length} aguardando
              </span>
            )}
          </div>
          {pendingAgenticItems.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Nenhuma aprovação pendente"
              hint="Quando um workflow agêntico precisar de input humano, ele aparece aqui."
            />
          ) : (
            <ul>
              {pendingAgenticItems.map((p) => {
                const ago = formatRelativeAgo(p.createdAt)
                const isFresh = Date.now() - new Date(p.createdAt).getTime() < 60000
                return (
                  <Link
                    key={`${p.workflowInstanceId}-${p.stepId}`}
                    to={`/workflows/${p.workflowInstanceId}`}
                    className="group flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-[#181A1F]"
                  >
                    <span className="relative mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-accent/15 text-accent">
                      <Sparkles className="h-3.5 w-3.5" />
                      {isFresh && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
                        </span>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[12.5px] font-medium text-text-primary">
                          {p.stepTitle}
                        </span>
                        <span className="flex-none rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
                          agêntico
                        </span>
                        <span className="flex-none text-[10.5px] text-text-muted">{ago}</span>
                      </div>
                      <div className="mt-0.5 truncate font-mono text-[11.5px] text-text-secondary">
                        {p.prTitle}
                      </div>
                      <div className="mt-0.5 line-clamp-2 text-[11px] text-text-muted">
                        {p.prSummary}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-text-muted">
                        <span className="font-mono">{p.prAuthor}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-2.5 w-2.5" />
                          <span className="font-mono">{p.filesChanged}</span> arquivos
                        </span>
                        <span>·</span>
                        <span className="font-mono text-success">+{p.linesAdded}</span>
                        <span className="font-mono text-failure">−{p.linesRemoved}</span>
                        <span>·</span>
                        <span className="font-mono">{p.workflowName}</span>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-3.5 w-3.5 flex-none text-text-muted opacity-0 transition group-hover:opacity-100" />
                  </Link>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Section 3 — Alertas da Application Hub */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight">Pontos de atenção</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-text-muted" />
                <h3 className="text-[13.5px] font-semibold tracking-tight">Alertas da Application Hub</h3>
              </div>
              {appHubAlerts.length > 0 && (
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
                  {appHubAlerts.length} itens
                </span>
              )}
            </div>
            {appHubAlerts.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Tudo sob controle"
                hint="Nenhuma aprovação pendente, falha recente ou violação de policy."
              />
            ) : (
              <ul>
                {appHubAlerts.map((a) => {
                  const Icon =
                    a.kind === 'approval' ? Clock3 : a.kind === 'failure' ? AlertTriangle : ShieldCheck
                  const color =
                    a.kind === 'approval'
                      ? 'text-warning bg-warning/15'
                      : a.kind === 'failure'
                      ? 'text-failure bg-failure/15'
                      : 'text-info bg-info/15'
                  return (
                    <li
                      key={a.id}
                      className="group flex cursor-pointer items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]"
                    >
                      <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-md ${color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] text-text-primary">{a.title}</div>
                        <div className="truncate text-[11.5px] text-text-muted">{a.detail}</div>
                      </div>
                      <span className="font-mono text-[11px] text-text-muted">{a.ago}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-text-muted opacity-0 transition group-hover:opacity-100" />
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      <RepoPickerModal
        open={repoModalOpen}
        onClose={() => setRepoModalOpen(false)}
        onConfirm={handleRepoConfirm}
      />
    </div>
  )
}
