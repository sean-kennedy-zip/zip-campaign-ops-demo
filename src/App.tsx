import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Dashboard } from './pages/Dashboard';
import { CampaignForm } from './pages/CampaignForm';
import { ExecutionView } from './pages/ExecutionView';
import { Settings } from './pages/Settings';

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-zip-50 text-zip-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function DryRunIndicator() {
  const { dryRun } = useApp();
  if (!dryRun) return null;
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
      DRY RUN
    </span>
  );
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zip-600 flex items-center justify-center text-white text-xs font-bold">
                Z
              </div>
              <span className="font-semibold text-gray-900 text-sm">Campaign Ops</span>
            </NavLink>
            <div className="flex items-center gap-1">
              <NavItem to="/">Dashboard</NavItem>
              <NavItem to="/new">New Campaign</NavItem>
              <NavItem to="/settings">Settings</NavItem>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DryRunIndicator />
            <span className="text-xs text-gray-400">POC Demo v0.1</span>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<CampaignForm />} />
          <Route path="/campaign/:id" element={<ExecutionView />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout />
      </AppProvider>
    </BrowserRouter>
  );
}
