import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { WorkflowsProvider } from './contexts/WorkflowsProvider'
import Home from './screens/Home'
import WorkflowTrackerList from './screens/WorkflowTrackerList'
import WorkflowTrackerDetail from './screens/WorkflowTrackerDetail'
import ApplicationHub from './screens/ApplicationHub'
import ApplicationHubDetail from './screens/ApplicationHubDetail'
import AssetsCatalog from './screens/AssetsCatalog'
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
            <Route path="/assets-catalogs" element={<AssetsCatalog />} />
            <Route path="/catalog" element={<AssetsCatalog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WorkflowsProvider>
  )
}
