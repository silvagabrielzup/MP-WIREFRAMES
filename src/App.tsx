import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './screens/01-Home'
import WorkflowTrackerList from './screens/02-WorkflowTrackerList'
import WorkflowTrackerDetail from './screens/03-WorkflowTrackerDetail'
import ControlPlanesDashboard from './screens/04-ControlPlanesDashboard'
import ControlPlaneDetail from './screens/05-ControlPlaneDetail'
import AssetsCatalog from './screens/06-AssetsCatalog'
import SaDetail from './screens/07-SaDetail'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workflows" element={<WorkflowTrackerList />} />
          <Route path="/workflows/:id" element={<WorkflowTrackerDetail />} />
          <Route path="/control-planes" element={<ControlPlanesDashboard />} />
          <Route path="/control-planes/:id" element={<ControlPlaneDetail />} />
          <Route path="/assets" element={<AssetsCatalog />} />
          <Route path="/catalog" element={<AssetsCatalog />} />
          <Route path="/assets/:sa" element={<SaDetail />} />
          <Route path="/catalog/sa/:id" element={<SaDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
