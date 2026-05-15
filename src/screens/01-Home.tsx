import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Workflow as WorkflowIcon,
  Loader2,
  MoreHorizontal,
  Check,
  Sparkles,
  Boxes,
  X,
  Search,
  GitBranch,
  FileCode2,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  ArrowRightLeft,
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
}

const pendingApprovals: {
  workflow: string
  action: string
  sa: string
  requester: { initials: string; color: string }
  ago: string
  blocking: boolean
}[] = []

const appHubAlerts: {
  kind: 'approval' | 'failure' | 'policy'
  title: string
  detail: string
  ago: string
}[] = []

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

const MOCK_REPO = {
  url: 'git@itau.gitlab.com:apps/pix-core.git',
  name: 'pix-core',
  org: 'itau-applications',
  defaultBranch: 'main',
  language: 'Java 17 · Spring Boot 3.2',
  contributors: 14,
  lastCommit: 'há 2h · feat(payment): retry com backoff exponencial',
  size: '184 MB',
  filesCount: '2.418 arquivos',
  lastTag: 'v3.14.2',
}

type TreeAction = 'moved' | 'added' | 'removed'
type TreeNode = {
  name: string
  type: 'dir' | 'file'
  action?: TreeAction
  defaultOpen?: boolean
  children?: TreeNode[]
}

const CURRENT_TREE: TreeNode = {
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
          defaultOpen: true,
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
    {
      name: 'helm',
      type: 'dir',
      children: [
        { name: 'values.yaml', type: 'file' },
        { name: 'Chart.yaml', type: 'file' },
      ],
    },
    { name: 'pom.xml', type: 'file' },
    { name: 'Dockerfile', type: 'file' },
    { name: 'README.md', type: 'file' },
    { name: '.gitlab-ci.yml', type: 'file', action: 'removed' },
  ],
}

const MONOREPO_TREE: TreeNode = {
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
              defaultOpen: true,
              action: 'moved',
              children: [
                {
                  name: 'main',
                  type: 'dir',
                  action: 'moved',
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
                { name: 'test', type: 'dir', action: 'moved', children: [{ name: 'java', type: 'dir' }] },
              ],
            },
            {
              name: 'helm',
              type: 'dir',
              action: 'moved',
              children: [
                { name: 'values.yaml', type: 'file' },
                { name: 'Chart.yaml', type: 'file' },
              ],
            },
            { name: 'pom.xml', type: 'file', action: 'moved' },
            { name: 'Dockerfile', type: 'file', action: 'moved' },
            { name: 'README.md', type: 'file', action: 'moved' },
            { name: 'komply.yaml', type: 'file', action: 'added' },
            { name: 'kaptain.yaml', type: 'file', action: 'added' },
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

function RepoPickerModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [repoUrl, setRepoUrl] = useState(MOCK_REPO.url)
  const [searched, setSearched] = useState(false)

  if (!open) return null

  const reset = () => {
    setStep(1)
    setSearched(false)
    setRepoUrl(MOCK_REPO.url)
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
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              <span
                className={`flex h-5 items-center gap-1.5 rounded-full border px-2 ${
                  step === 1
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-border bg-bg text-text-muted'
                }`}
              >
                <span className="font-mono">1</span> Buscar repo
              </span>
              <ArrowRight className="h-3 w-3 text-text-muted" />
              <span
                className={`flex h-5 items-center gap-1.5 rounded-full border px-2 ${
                  step === 2
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-border bg-bg text-text-muted'
                }`}
              >
                <span className="font-mono">2</span> Estrutura mono-repo
              </span>
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

        {step === 1 ? (
          <section className="space-y-4 px-5 py-5">
            <div>
              <label className="block text-[12px] font-medium text-text-secondary">
                URL do repositório
              </label>
              <p className="mt-0.5 text-[11.5px] text-text-muted">
                Cole o link do repositório (GitLab ou GitHub Itaú) que será migrado pra estrutura
                mono-repo Vanilla.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-bg px-3 py-2 focus-within:border-accent">
                  <GitBranch className="h-3.5 w-3.5 flex-none text-text-muted" />
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => {
                      setRepoUrl(e.target.value)
                      setSearched(false)
                    }}
                    placeholder="git@itau.gitlab.com:apps/<repo>.git"
                    className="flex-1 bg-transparent font-mono text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearched(true)}
                  disabled={!repoUrl.trim()}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Search className="h-3.5 w-3.5" />
                  Buscar
                </button>
              </div>
            </div>

            {searched && (
              <div className="rounded-md border border-border bg-bg px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-success/15 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-mono text-[12.5px] text-text-primary">
                        {MOCK_REPO.org}/{MOCK_REPO.name}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        repositório encontrado · default branch {MOCK_REPO.defaultBranch}
                      </div>
                    </div>
                  </div>
                  <span className="rounded border border-success/30 bg-success/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-success">
                    pronto
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11.5px]">
                  <div>
                    <dt className="text-text-muted">Linguagem</dt>
                    <dd className="text-text-primary">{MOCK_REPO.language}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Contribuidores</dt>
                    <dd className="font-mono text-text-primary">{MOCK_REPO.contributors}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Tamanho</dt>
                    <dd className="font-mono text-text-primary">
                      {MOCK_REPO.size} · {MOCK_REPO.filesCount}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Última tag</dt>
                    <dd className="font-mono text-text-primary">{MOCK_REPO.lastTag}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-text-muted">Último commit</dt>
                    <dd className="font-mono text-text-primary">{MOCK_REPO.lastCommit}</dd>
                  </div>
                </dl>
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-3 px-5 py-5">
            <div className="text-[12px] text-text-secondary">
              Os arquivos abaixo vão ser movidos pra dentro de{' '}
              <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-[11px] text-accent">
                apps/ssa-pix-core/
              </code>{' '}
              e a tooling Vanilla (Komply, Kaptain, Orkestra) será injetada no caminho do app.
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-border bg-bg p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
                    Antes
                  </h4>
                  <span className="font-mono text-[10.5px] text-text-muted">repo standalone</span>
                </div>
                <div className="max-h-[340px] space-y-0.5 overflow-y-auto pr-1">
                  <TreeNodeView node={CURRENT_TREE} />
                </div>
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/[0.04] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
                    Depois
                  </h4>
                  <span className="font-mono text-[10.5px] text-text-muted">
                    mono-repo Vanilla
                  </span>
                </div>
                <div className="max-h-[340px] space-y-0.5 overflow-y-auto pr-1">
                  <TreeNodeView node={MONOREPO_TREE} />
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

        <footer className="flex items-center justify-between border-t border-border bg-bg/50 px-5 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="text-[12px] text-text-secondary hover:text-text-primary"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex h-9 items-center rounded-md border border-border bg-bg px-3 text-[12px] text-text-secondary hover:border-border-strong hover:text-text-primary"
              >
                Voltar
              </button>
            )}
            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!searched}
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

  const total = steps.length
  const doneCount = steps.filter((s) => s.status === 'done').length
  const pct = Math.round((doneCount / total) * 100)
  const inProgressIdx = steps.findIndex((s) => s.status === 'in-progress')

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
        {steps.map((s, i) => {
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
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { workflows: instances, advanceStep, addWorkflow } = useWorkflows()
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

    if (step.stepId === 'step-08-setup-observability') {
      navigate('/application-hub')
    }
  }

  const handleRepoConfirm = () => {
    if (lastWorkflow) advanceStep(lastWorkflow.id)
    setRepoModalOpen(false)
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

      {/* Section 2 — Onboarding card */}
      <section>
        <OnboardingCard
          steps={onboardingSteps}
          contextLabel={lastWorkflow?.templateName}
          onActivate={handleStepActivate}
        />
      </section>

      {/* Section 3 — Resumo de pontos de atenção */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight">Pontos de atenção</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <WorkflowIcon className="h-3.5 w-3.5 text-text-muted" />
                <h3 className="text-[13.5px] font-semibold tracking-tight">
                  Fluxos agênticos pendentes aprovação
                </h3>
              </div>
              {pendingApprovals.length > 0 && (
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
                  {pendingApprovals.length} aguardando
                </span>
              )}
            </div>
            {pendingApprovals.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Nenhuma aprovação pendente"
                hint="Quando um workflow agêntico precisar de input humano, ele aparece aqui."
              />
            ) : (
              <ul>
                {pendingApprovals.map((p) => (
                  <li
                    key={p.workflow + p.sa + p.ago}
                    className="group flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-[#181A1F]"
                  >
                    <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-warning/15 text-warning">
                      <Clock3 className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-mono text-[12.5px] text-text-primary">
                          {p.workflow}
                        </span>
                        {p.blocking && (
                          <span className="flex-none rounded border border-failure/30 bg-failure/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-failure">
                            blocking
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 truncate text-[12px] text-text-secondary">{p.action}</div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-text-muted">
                        <span className="font-mono">{p.sa}</span>
                        <span>·</span>
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[9.5px] font-medium ${p.requester.color}`}
                        >
                          {p.requester.initials}
                        </span>
                        <span className="font-mono">há {p.ago}</span>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-3.5 w-3.5 flex-none text-text-muted opacity-0 transition group-hover:opacity-100" />
                  </li>
                ))}
              </ul>
            )}
          </div>

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
                {appHubAlerts.map((a, i) => {
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
                      key={i}
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
