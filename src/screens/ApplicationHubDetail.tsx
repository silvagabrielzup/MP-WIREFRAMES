import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApisTab } from '../components/application-hub-detail/ApisTab'
import { Breadcrumb } from '../components/application-hub-detail/Breadcrumb'
import { DetailHeader } from '../components/application-hub-detail/DetailHeader'
import { HistoryTab } from '../components/application-hub-detail/HistoryTab'
import { InfraTab } from '../components/application-hub-detail/InfraTab'
import { ObservabilityTab } from '../components/application-hub-detail/ObservabilityTab'
import { Overview } from '../components/application-hub-detail/Overview'
import { ReposTab } from '../components/application-hub-detail/ReposTab'
import { TabsNav } from '../components/application-hub-detail/TabsNav'
import { mock, type AppDetail, type TabKey } from '../components/application-hub-detail/utils'

export default function ApplicationHubDetail() {
  const { sa } = useParams<{ sa: string }>()
  const app: AppDetail = { ...mock, sa: sa ?? mock.sa }
  const [tab, setTab] = useState<TabKey>('overview')

  return (
    <div className="space-y-6">
      <Breadcrumb sa={app.sa} />
      <DetailHeader app={app} />
      <TabsNav active={tab} onChange={setTab} />

      {tab === 'overview' && <Overview app={app} />}
      {tab === 'infra' && <InfraTab />}
      {tab === 'apis' && <ApisTab />}
      {tab === 'observability' && <ObservabilityTab />}
      {tab === 'repos' && <ReposTab />}
      {tab === 'history' && <HistoryTab />}
    </div>
  )
}
