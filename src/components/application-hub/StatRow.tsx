import type { ApplicationHub } from '../../data/database'
import { Stat } from './atoms'

// 4 stats agregadas — `aplication-hub.md` §StatRow.
export function StatRow({ apps }: { apps: ApplicationHub[] }) {
  const healthy = apps.filter((a) => a.health === 'healthy').length
  const warn = apps.filter((a) => a.health === 'warn').length
  const fail = apps.filter((a) => a.health === 'fail').length
  const onPlat = apps.filter((a) => a.onPlat).length
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="Aplicações" value={apps.length.toString()} hint={`${onPlat} on-plat`} />
      <Stat label="Healthy" value={healthy.toString()} hint="último 5min" color="success" />
      <Stat label="Warn" value={warn.toString()} hint="último 5min" color="warning" />
      <Stat label="Fail" value={fail.toString()} hint="último 5min" color="failure" />
    </div>
  )
}
