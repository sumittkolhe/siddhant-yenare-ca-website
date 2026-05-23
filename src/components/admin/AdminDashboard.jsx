import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from './AdminSidebar';
import AdminStats from './AdminStats';
import QueryTable from './QueryTable';
import QueryDetail from './QueryDetail';
import { useAuth } from '../../contexts/AuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import LeadScoringPanel from './LeadScoringPanel';
import AdminAnalytics from './AdminAnalytics';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queries, setQueries] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();
  const { subscribeToQueries, updateQuery, deleteQuery } = useFirestore();

  // Subscribe to queries
  useEffect(() => {
    const unsubscribe = subscribeToQueries((data) => {
      setQueries(data);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToQueries]);

  // Handle status update
  const handleUpdateStatus = async (queryId, newStatus, notes) => {
    try {
      const updateData = { status: newStatus };
      if (notes !== undefined) {
        updateData.notes = notes;
      }
      await updateQuery(queryId, updateData);
      toast.success('Query updated successfully');
    } catch (error) {
      console.error('Error updating query:', error);
      toast.error('Failed to update query');
    }
  };

  // Handle delete
  const handleDelete = async (queryId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this query? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await deleteQuery(queryId);
      toast.success('Query deleted successfully');
      if (selectedQuery?.id === queryId) {
        setSelectedQuery(null);
      }
    } catch (error) {
      console.error('Error deleting query:', error);
      toast.error('Failed to delete query');
    }
  };

  // Handle view detail
  const handleViewDetail = (query) => {
    setSelectedQuery(query);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'queries':
        return 'Manage Queries';
      case 'leads':
        return 'AI Lead Scoring & Intelligence';
      case 'analytics':
        return 'Compliance SaaS Analytics';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen bg-navy-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-navy-300 hover:text-white transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-navy-400 mt-1">
                  Welcome back, {user?.email || 'Admin'}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-navy-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Online
            </div>
          </div>

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <AdminStats queries={queries} />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    Recent Queries
                  </h2>
                  <button
                    onClick={() => setActiveTab('queries')}
                    className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    View All →
                  </button>
                </div>
                <QueryTable
                  queries={queries.slice(0, 5)}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDelete}
                  onViewDetail={handleViewDetail}
                />
              </div>
            </div>
          )}

          {/* Queries View */}
          {activeTab === 'queries' && (
            <QueryTable
              queries={queries}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
              onViewDetail={handleViewDetail}
            />
          )}

          {/* AI Lead Scoring View */}
          {activeTab === 'leads' && (
            <LeadScoringPanel />
          )}

          {/* SaaS Analytics View */}
          {activeTab === 'analytics' && (
            <AdminAnalytics />
          )}


          {/* Settings View */}
          {activeTab === 'settings' && (
            <div className="bg-navy-800/50 backdrop-blur-sm border border-navy-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-display font-bold text-white mb-6">
                Settings
              </h2>

              <div className="space-y-6 max-w-lg">
                {/* Notification Settings */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Notifications
                  </h3>
                  <label className="flex items-center justify-between p-4 bg-navy-800/50 border border-navy-700/30 rounded-xl cursor-pointer hover:bg-navy-700/30 transition-colors">
                    <span className="text-sm text-navy-200">
                      Email notifications for new queries
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-navy-600 bg-navy-800 text-gold-500 focus:ring-gold-500/50 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Account Info */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Account
                  </h3>
                  <div className="p-4 bg-navy-800/50 border border-navy-700/30 rounded-xl">
                    <p className="text-sm text-navy-300">
                      Logged in as:{' '}
                      <span className="text-white font-medium">
                        {user?.email || 'admin@siddhantca.com'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Version */}
                <div className="pt-4 border-t border-navy-700/30">
                  <p className="text-xs text-navy-500">
                    Dashboard Version 1.0.0 · Siddhant Yenare & Co.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Query Detail Modal */}
      {selectedQuery && (
        <QueryDetail
          query={selectedQuery}
          onClose={() => setSelectedQuery(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
