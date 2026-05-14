import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { WorkflowsProvider } from './contexts/WorkflowsProvider'
import Home from './screens/01-Home'
import WorkflowTrackerList from './screens/02-WorkflowTrackerList'
import WorkflowTrackerDetail from './screens/03-WorkflowTrackerDetail'
import ApplicationHub from './screens/04-ApplicationHub'
import ApplicationHubDetail from './screens/05-ApplicationHubDetail'
import AssetsCatalog from './screens/06-AssetsCatalog'
import SaDetail from './screens/07-SaDetail'
import './index.css'

export default function App() {
  return (
    <WorkflowsProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/workflows" element={<WorkflowTrackerList />} />
            <Route path="/workflows/:id" element={<WorkflowTrackerDetail />} />
            <Route path="/application-hub" element={<ApplicationHub />} />
            <Route path="/application-hub/:sa" element={<ApplicationHubDetail />} />
            <Route path="/assets" element={<AssetsCatalog />} />
            <Route path="/catalog" element={<AssetsCatalog />} />
            <Route path="/assets/:sa" element={<SaDetail />} />
            <Route path="/catalog/sa/:id" element={<SaDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WorkflowsProvider>
  )
}
