import { Landmark, LayoutDashboard, MessageSquare, Settings, LogOut, TrendingUp, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'queries', icon: MessageSquare, label: 'Inbox Queries' },
  { id: 'leads', icon: TrendingUp, label: 'AI Lead Scoring' },
  { id: 'analytics', icon: BarChart3, label: 'SaaS Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-navy-900 border-r border-navy-800 p-6 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
          <Landmark className="w-5 h-5 text-navy-950" />
        </div>
        <div>
          <div className="font-semibold text-white text-sm leading-tight">
            Siddhant Yenare
          </div>
          <div className="text-xs text-gold-500 leading-tight">
            Compliance Suite
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white border border-transparent'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-navy-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer"
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
