import {
  AlertTriangle,
  ArrowRight,
  ArrowRightLeft,
  Check,
  CheckCircle2,
  ExternalLink,
  Info,
  Minus,
  Plus,
  Search,
  Terminal,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAvailableSas } from '../../hooks/useAvailableSas'
import { useCliAdvantages } from '../../hooks/useCliAdvantages'
import { useMigrationTreeDiff } from '../../hooks/useMigrationTreeDiff'
import { useMigrationVerbs } from '../../hooks/useMigrationVerbs'
import { useMigrationViabilityChecks } from '../../hooks/useMigrationViabilityChecks'
import { useSaRepositories } from '../../hooks/useSaRepositories'
import type { OnboardingChecklistContent } from '../../types/models'
import { CommandBlock, EmptyState, InlineSpinner, LucideIcon, TreeNodeView } from './atoms'
import { REPO_KIND_ICONS, REPO_KIND_META } from './utils'

// ============================================================================
// Step 01 — Instalação de CLI
// ============================================================================

export function SetupCliDetails({ content }: { content: OnboardingChecklistContent }) {
  const { data: advantages, isLoading } = useCliAdvantages()

  return (
    <div className="space-y-3">
      <CommandBlock command={content.clipboardCommand} />

      <div className="rounded-md border border-accent/30 bg-accent/[0.04] p-3">
        <div className="mb-2 flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-accent" />
          <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">Por que CLI?</h4>
        </div>
        {isLoading ? (
          <InlineSpinner label="Carregando vantagens da CLI..." />
        ) : advantages.length === 0 ? (
          <EmptyState icon={Info} title="Nenhuma vantagem cadastrada" hint="A lista de vantagens está vazia no momento." />
        ) : (
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {advantages.map((adv) => (
              <li key={adv.id} className="flex items-start gap-2 rounded border border-border bg-bg p-2">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded bg-accent/15 text-accent">
                  <LucideIcon name={adv.iconName} className="h-3 w-3" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-medium text-text-primary">{adv.title}</div>
                  <div className="text-[10.5px] text-text-muted">{adv.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {content.recommendedVersion && (
        <div className="flex items-center gap-2 text-[11px]">
          <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-text-muted">
            Versão recomendada: {content.recommendedVersion}
          </span>
          <a
            href="#release-notes"
            className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
          >
            Ver release notes <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Step 02 — Login
// ============================================================================

export function LoginDetails({ content }: { content: OnboardingChecklistContent }) {
  const session = content.sessionStatus ?? 'não autenticado'
  const authenticated = !session.toLowerCase().startsWith('não')
  const sessionTone = authenticated
    ? 'border-success/40 bg-success/10 text-success'
    : 'border-warning/40 bg-warning/10 text-warning'

  return (
    <div className="space-y-3">
      <CommandBlock command={content.clipboardCommand} />

      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10.5px] ${sessionTone}`}>
          {authenticated ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
          {authenticated ? `Autenticado como ${session}` : 'Não autenticado'}
        </span>
        {content.realm && (
          <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[10.5px] text-text-muted">
            realm: {content.realm}
          </span>
        )}
        {content.tokenValidity && (
          <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[10.5px] text-text-muted">
            validade: {content.tokenValidity}
          </span>
        )}
      </div>

      <a
        href="#sso"
        className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
      >
        Abrir SSO <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  )
}

// ============================================================================
// Step 03 — Seleção de SA
// ============================================================================

export function SelectSaDetails({ content }: { content: OnboardingChecklistContent }) {
  const defaultSaId = content.defaultSaId ?? 'ssa-pix-core'
  const [query, setQuery] = useState('')
  const [selectedSa, setSelectedSa] = useState<string>(defaultSaId)
  const [selectedRepoIds, setSelectedRepoIds] = useState<Set<string> | null>(null)

  const { data: availableSas, isLoading: loadingSas } = useAvailableSas()
  const { data: repos, isLoading: loadingRepos } = useSaRepositories(selectedSa)
  const { data: treeDiff, isLoading: loadingDiff } = useMigrationTreeDiff(selectedSa)

  const filteredSas = availableSas.filter(
    (s) =>
      s.id.toLowerCase().includes(query.toLowerCase())
      || s.name.toLowerCase().includes(query.toLowerCase()),
  )
  const saPreview = availableSas.find((s) => s.id === selectedSa) ?? null

  const effectiveSelected = selectedRepoIds ?? new Set(repos.map((r) => r.id))
  const toggleRepo = (id: string) => {
    setSelectedRepoIds((prev) => {
      const base = prev ?? new Set(repos.map((r) => r.id))
      const next = new Set(base)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedRepos = repos.filter((r) => effectiveSelected.has(r.id))

  const dynamicCommand = [
    `stackspot context use --sa ${selectedSa}`,
    ...selectedRepos.map((r) => `--repo ${r.name}`),
  ].join(' ')

  return (
    <div className="space-y-3">
      <p className="text-[11.5px] text-text-secondary">
        Uma SA traz consigo uma família de repos hoje espalhados (código, ci/cd, infra, db, config). A Migração Vanilla
        consolida tudo em um único mono-repo. Escolha quais repos entram na primeira leva.
      </p>

      {/* a) Busca + preview da SA */}
      <div>
        <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Buscar SA</h4>
        <div className="flex items-center gap-2 rounded-md border border-border bg-bg px-2.5 py-1.5 focus-within:border-accent">
          <Search className="h-3.5 w-3.5 flex-none text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ssa-<servico>"
            className="flex-1 bg-transparent font-mono text-[11.5px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        {loadingSas && query.length > 0 && <div className="mt-1.5"><InlineSpinner label="Buscando SAs..." /></div>}
        {!loadingSas && query.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {filteredSas.length === 0 && (
              <li className="rounded border border-border bg-bg px-3 py-2 text-[11px] text-text-muted">
                Nenhum SA encontrado pra &quot;{query}&quot;.
              </li>
            )}
            {filteredSas.map((sa) => {
              const active = sa.id === selectedSa
              return (
                <li key={sa.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedSa(sa.id)}
                    className={`flex w-full items-center justify-between rounded border px-3 py-1.5 text-left transition ${
                      active ? 'border-accent/40 bg-accent/10' : 'border-border bg-bg hover:border-border-strong'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-mono text-[11.5px] text-text-primary">{sa.id}</div>
                      <div className="truncate text-[10.5px] text-text-muted">{sa.name} · {sa.squad}</div>
                    </div>
                    {active && <Check className="h-3.5 w-3.5 flex-none text-accent" />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {saPreview && (
          <div className="mt-2 rounded border border-border bg-bg p-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[11.5px] text-text-primary">{saPreview.id}</span>
              <span className="rounded-full border border-border bg-surface px-1.5 py-0 font-mono text-[9.5px] text-text-muted">
                {saPreview.squad}
              </span>
            </div>
            <div className="mt-0.5 text-[10.5px] text-text-muted">{saPreview.name} · {repos.length} repos na família</div>
          </div>
        )}
      </div>

      {/* b) Lista de repositórios da família com checkboxes */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Repositórios da família ({repos.length})
          </h4>
          <span className="font-mono text-[10.5px] text-text-muted">
            {selectedRepos.length} de {repos.length}
          </span>
        </div>
        {loadingRepos ? (
          <InlineSpinner label="Carregando repositórios..." />
        ) : repos.length === 0 ? (
          <EmptyState
            icon={Info}
            title="Nenhum repositório nesta SA"
            hint="Esta SA ainda não tem repositórios cadastrados no Assets Catalog."
          />
        ) : (
          <ul className="space-y-1">
            {repos.map((r) => {
              const KindIcon = REPO_KIND_ICONS[r.kind]
              const kind = REPO_KIND_META[r.kind]
              const checked = effectiveSelected.has(r.id)
              return (
                <li
                  key={r.id}
                  className={`flex items-start gap-2 rounded border px-2.5 py-1.5 ${
                    checked ? 'border-border bg-bg' : 'border-border bg-bg/40 opacity-60'
                  }`}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={`${checked ? 'Desmarcar' : 'Marcar'} repo ${r.name}`}
                    onClick={() => toggleRepo(r.id)}
                    className={`mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded border transition ${
                      checked
                        ? 'border-accent/40 bg-accent/10 text-accent'
                        : 'border-border bg-bg text-transparent hover:border-border-strong'
                    }`}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </button>
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded border border-border bg-surface">
                    <KindIcon className="h-3 w-3 text-text-secondary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="truncate font-mono text-[11.5px] text-text-primary">{r.name}</span>
                      <span className={`flex-none rounded-full border px-1.5 py-0 text-[9px] font-medium uppercase tracking-wider ${kind.tone}`}>
                        {kind.label}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[10.5px] text-text-muted">{r.stack} · {r.size}</div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* c) Comando CLI dinâmico */}
      <div>
        <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Comando CLI equivalente
        </h4>
        <CommandBlock command={dynamicCommand} />
        <p className="mt-1 text-[10.5px] text-text-muted">
          {selectedRepos.length} de {repos.length} repos selecionados.
        </p>
      </div>

      {/* d) Diff Antes/Depois — multi-repo → mono-repo */}
      <div>
        <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Antes · multi-repo → Depois · mono-repo Vanilla
        </h4>
        {loadingDiff ? (
          <InlineSpinner label="Carregando árvores do monorepo..." />
        ) : !treeDiff ? (
          <EmptyState
            icon={Info}
            title="Sem diff cadastrado pra esta SA"
            hint="O diff de árvores ainda não foi gerado pra ssa-* selecionado."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded border border-border bg-bg p-2">
                <div className="mb-1 flex items-center justify-between">
                  <h5 className="text-[10.5px] font-semibold tracking-tight text-text-primary">Antes · multi-repo</h5>
                  <span className="font-mono text-[9.5px] text-text-muted">{treeDiff.before.length} repos</span>
                </div>
                <div className="max-h-[180px] space-y-1.5 overflow-y-auto pr-1">
                  {treeDiff.before.map((tree) => (
                    <div key={tree.name} className="rounded border border-border/60 bg-surface/40 p-1">
                      <TreeNodeView node={tree} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded border border-accent/30 bg-accent/[0.04] p-2">
                <div className="mb-1 flex items-center justify-between">
                  <h5 className="text-[10.5px] font-semibold tracking-tight text-text-primary">Depois · mono-repo</h5>
                  <span className="font-mono text-[9.5px] text-text-muted">unificado</span>
                </div>
                <div className="max-h-[180px] space-y-0.5 overflow-y-auto pr-1">
                  <TreeNodeView node={treeDiff.after} />
                </div>
              </div>
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-[9.5px] text-text-muted">
              <span className="flex items-center gap-1"><ArrowRightLeft className="h-2.5 w-2.5 text-info" /> movido</span>
              <span className="flex items-center gap-1"><Plus className="h-2.5 w-2.5 text-success" /> adicionado</span>
              <span className="flex items-center gap-1"><Minus className="h-2.5 w-2.5 text-failure" /> removido</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Step 04 — Checar viabilidade
// ============================================================================

export function ViabilityCheckDetails({ content }: { content: OnboardingChecklistContent }) {
  const { data: checks, isLoading } = useMigrationViabilityChecks()

  const passes = checks.filter((c) => c.status === 'pass').length
  const warns = checks.filter((c) => c.status === 'warn').length
  const fails = checks.filter((c) => c.status === 'fail').length

  return (
    <div className="space-y-3">
      <CommandBlock command={content.clipboardCommand} />

      {!isLoading && (
        <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
          <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-success">
            {passes} ok
          </span>
          <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 font-mono text-warning">
            {warns} aviso
          </span>
          <span className="rounded-full border border-failure/30 bg-failure/10 px-2 py-0.5 font-mono text-failure">
            {fails} bloqueio
          </span>
        </div>
      )}

      {isLoading ? (
        <InlineSpinner label="Executando pre-flight..." />
      ) : checks.length === 0 ? (
        <EmptyState
          icon={Info}
          title="Nenhum check executado"
          hint="A pré-validação ainda não foi cadastrada para esta SA."
        />
      ) : (
        <ul className="space-y-1">
          {checks.map((c) => {
            const tone =
              c.status === 'pass'
                ? { border: 'border-success/30', bg: 'bg-success/[0.04]', icon: CheckCircle2, iconTone: 'text-success', label: 'OK' }
                : c.status === 'warn'
                  ? { border: 'border-warning/30', bg: 'bg-warning/[0.06]', icon: AlertTriangle, iconTone: 'text-warning', label: 'AVISO' }
                  : { border: 'border-failure/30', bg: 'bg-failure/[0.06]', icon: XCircle, iconTone: 'text-failure', label: 'BLOQUEIO' }
            const Icon = tone.icon
            return (
              <li key={c.id} className={`flex items-start gap-2 rounded border ${tone.border} ${tone.bg} px-2.5 py-1.5`}>
                <Icon className={`mt-0.5 h-3.5 w-3.5 flex-none ${tone.iconTone}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11.5px] text-text-primary">{c.engine}</span>
                    <span className={`rounded-full border ${tone.border} px-1.5 py-0 text-[9px] font-medium uppercase tracking-wider ${tone.iconTone}`}>
                      {tone.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-text-muted">{c.detail}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <a
        href="#viability-report"
        className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
      >
        Ver relatório completo <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  )
}

// ============================================================================
// Step 05 — Acompanhar Status da Migration
// ============================================================================

export function WatchMigrationDetails({ content }: { content: OnboardingChecklistContent }) {
  const { data: verbs, isLoading } = useMigrationVerbs()
  const [startCmd, watchCmd] = content.clipboardCommand.split('&&').map((s) => s.trim())

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        {startCmd && <CommandBlock command={startCmd} />}
        {watchCmd && <CommandBlock command={watchCmd} />}
      </div>

      <div className="rounded-md border border-border bg-surface px-3 py-2">
        <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Verbos da Operação Vanilla
        </h4>
        {isLoading ? (
          <InlineSpinner label="Carregando verbos..." />
        ) : verbs.length === 0 ? (
          <EmptyState icon={Info} title="Sem verbos cadastrados" hint="A lista de verbos está vazia." />
        ) : (
          <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {verbs.map((v) => (
              <li key={v.id} className="flex items-center gap-2 rounded border border-border bg-bg p-2">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-md border border-border bg-surface">
                  <LucideIcon name={v.iconName} className="h-3 w-3 text-text-secondary" />
                </span>
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-text-primary">{v.label}</div>
                  <div className="text-[9.5px] uppercase tracking-wider text-text-muted">{v.status}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        to="/workflows-trackers"
        className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
      >
        Abrir Workflow Tracker <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}

// ============================================================================
// Dispatcher por stepId
// ============================================================================

export function StepDetails({ stepId, content }: { stepId: string; content: OnboardingChecklistContent }) {
  switch (stepId) {
    case 'step-01-setup-cli': return <SetupCliDetails content={content} />
    case 'step-02-login': return <LoginDetails content={content} />
    case 'step-03-select-sa': return <SelectSaDetails content={content} />
    case 'step-04-migration-overview': return <ViabilityCheckDetails content={content} />
    case 'step-05-watch-tracker': return <WatchMigrationDetails content={content} />
    default: return null
  }
}
