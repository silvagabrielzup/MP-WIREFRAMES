import {
  Activity,
  CloudOff,
  Code2,
  Database,
  GitBranch,
  HelpCircle,
  KeyRound,
  Layers,
  PlugZap,
  Repeat,
  Rocket,
  Search,
  Server,
  Settings as SettingsIcon,
  ShieldCheck,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { Workflow } from '../../contexts/WorkflowsProvider'
import { workflows as workflowTemplates } from '../../data/database'
import type { RepoKind, TreeAction } from '../../types/models'

export type IconCmp = ComponentType<{ className?: string }>

// Mapa de nomes vindos do `database.json` (campo `iconName`) para os
// componentes do `lucide-react`. Adicionar uma entrada aqui sempre que uma
// nova entidade usar um ícone que ainda não está mapeado.
export const ICON_MAP: Record<string, IconCmp> = {
  Activity,
  CloudOff,
  Database,
  GitBranch,
  KeyRound,
  Layers,
  PlugZap,
  Repeat,
  Rocket,
  Search,
  ShieldCheck,
  Terminal,
  Wrench,
  Zap,
}

export const resolveIcon = (name: string): IconCmp => ICON_MAP[name] ?? HelpCircle

export const MIGRATION_TEMPLATE_SLUG = 'wf-migration-vanilla'

export const HOME_SUBTITLE = {
  idle: 'Sem workflows ativos no momento — escolha um workflow no Assets Catalog para começar.',
  completed: 'Migração concluída. Sua SA está ON-PLAT.',
} as const

export const REPO_KIND_META: Record<RepoKind, { label: string; tone: string }> = {
  code: { label: 'código', tone: 'border-info/30 bg-info/10 text-info' },
  'ci-cd': { label: 'ci/cd', tone: 'border-accent/30 bg-accent/10 text-accent' },
  infra: { label: 'infra', tone: 'border-warning/30 bg-warning/10 text-warning' },
  db: { label: 'banco', tone: 'border-success/30 bg-success/10 text-success' },
  config: { label: 'config', tone: 'border-border bg-bg text-text-secondary' },
}

export const REPO_KIND_ICONS: Record<RepoKind, IconCmp> = {
  code: Code2,
  'ci-cd': Wrench,
  infra: Server,
  db: Database,
  config: SettingsIcon,
}

export const ACTION_LABEL: Record<TreeAction, string> = { moved: 'mov', added: 'novo', removed: 'remov' }

export function formatRelativeAgo(iso: string): string {
  const elapsedMs = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(elapsedMs) || elapsedMs < 5_000) return 'agora'
  const sec = Math.floor(elapsedMs / 1000)
  if (sec < 60) return `há ${sec}s`
  const min = Math.floor(sec / 60)
  if (min < 60) return `há ${min}min`
  const hr = Math.floor(min / 60)
  return `há ${hr}h`
}

export function isFreshSince(iso: string, windowMs = 60_000): boolean {
  return Date.now() - new Date(iso).getTime() < windowMs
}

export function resolveSaName(workflow: Workflow | null): string {
  if (!workflow) return 'ssa-pix-core'
  const template = workflowTemplates.find((t) => t.id === workflow.templateId)
  return template?.inputs.find((i) => i.name === 'sa_id')?.default ?? 'ssa-pix-core'
}
