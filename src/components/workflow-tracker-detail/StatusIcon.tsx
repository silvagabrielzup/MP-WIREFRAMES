import { statusMeta, type StepStatus } from './utils'

export function StatusIcon({ status }: { status: StepStatus }) {
  const m = statusMeta[status]
  const Icon = m.icon
  return <Icon className={`h-4 w-4 ${m.color} ${status === 'running' ? 'animate-spin' : ''}`} />
}
