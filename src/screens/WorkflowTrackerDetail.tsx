import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuditTab } from '../components/workflow-tracker-detail/AuditTab'
import { BottomSheet } from '../components/workflow-tracker-detail/BottomSheet'
import { Breadcrumb } from '../components/workflow-tracker-detail/Breadcrumb'
import { Canvas } from '../components/workflow-tracker-detail/Canvas'
import { CostTab } from '../components/workflow-tracker-detail/CostTab'
import { DetailHeader } from '../components/workflow-tracker-detail/DetailHeader'
import { ReplayTab } from '../components/workflow-tracker-detail/ReplayTab'
import { SensorsTab } from '../components/workflow-tracker-detail/SensorsTab'
import { TabsNav } from '../components/workflow-tracker-detail/TabsNav'
import { ToolCallsTab } from '../components/workflow-tracker-detail/ToolCallsTab'
import {
  AGENTIC_STEP_ID,
  AGENTIC_TEMPLATE_STEP_ID,
  type ApprovalState,
  type TabKey,
} from '../components/workflow-tracker-detail/utils'
import { ExecutionTrackerView } from '../components/ExecutionTrackerView'
import { useWorkflows } from '../contexts/WorkflowsProvider'
import { migrationExecutionWorkflow } from '../data/database'

export default function WorkflowTrackerDetail() {
  const { id } = useParams<{ id: string }>()
  const { resolveAgenticItem, workflows: instances } = useWorkflows()
  const [tab, setTab] = useState<TabKey>('fluxo')
  const [selectedId, setSelectedId] = useState<string | null>(AGENTIC_STEP_ID)
  const [approval, setApproval] = useState<ApprovalState>('pending')

  const wfId = id ?? 'wf-abc123'

  const liveExecWorkflow =
    instances.find(
      (w) => w.id === id && w.templateId === migrationExecutionWorkflow.id,
    ) ?? null

  const handleApprove = () => {
    setApproval('accepted')
    resolveAgenticItem(wfId, AGENTIC_TEMPLATE_STEP_ID)
  }
  const handleDecline = () => {
    setApproval('declined')
    resolveAgenticItem(wfId, AGENTIC_TEMPLATE_STEP_ID)
  }

  return (
    <div className="space-y-5">
      <Breadcrumb wfId={wfId} />
      <DetailHeader wfId={wfId} />

      {liveExecWorkflow && <ExecutionTrackerView workflow={liveExecWorkflow} />}

      <TabsNav active={tab} onChange={setTab} />

      {tab === 'fluxo' && (
        <section className="space-y-4">
          <Canvas
            selectedId={selectedId}
            onSelect={setSelectedId}
            approval={approval}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
          {selectedId && (
            <BottomSheet
              stepId={selectedId}
              approval={approval}
              onApprove={handleApprove}
              onDecline={handleDecline}
              onClose={() => setSelectedId(null)}
            />
          )}
        </section>
      )}

      {tab === 'tools' && <ToolCallsTab />}
      {tab === 'sensors' && <SensorsTab />}
      {tab === 'audit' && <AuditTab />}
      {tab === 'replay' && <ReplayTab />}
      {tab === 'cost' && <CostTab />}
    </div>
  )
}
