import { useState, useMemo } from 'react';
import { Search, Eye, Trash2, Paperclip, Filter, Inbox } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending',
    classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
  'in-progress': {
    label: 'In Progress',
    classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-green-500/10 text-green-400 border border-green-500/20',
  },
};

const QueryTable = ({ queries = [], onUpdateStatus, onDelete, onViewDetail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredQueries = useMemo(() => {
    return queries.filter((query) => {
      // Status filter
      if (statusFilter !== 'all' && query.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        const matchesName = query.fullName?.toLowerCase().includes(search);
        const matchesEmail = query.email?.toLowerCase().includes(search);
        const matchesService = query.service?.toLowerCase().includes(search);
        const matchesMessage = query.message?.toLowerCase().includes(search);
        const matchesPhone = query.phone?.toLowerCase().includes(search);
        return matchesName || matchesEmail || matchesService || matchesMessage || matchesPhone;
      }

      return true;
    });
  }, [queries, searchTerm, statusFilter]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const date =
      timestamp?.toDate?.() || new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, service, or message..."
            className="w-full pl-10 pr-4 py-2.5 bg-navy-800/50 border border-navy-700 rounded-xl text-white text-sm placeholder-navy-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-navy-800/50 border border-navy-700 rounded-xl text-white text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all min-w-[160px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-navy-800/50 backdrop-blur-sm border border-navy-700/50 rounded-2xl overflow-hidden">
        {filteredQueries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy-800">
                  <th className="text-left px-6 py-4 text-navy-300 text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-navy-300 text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-navy-300 text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-navy-300 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">
                    Service
                  </th>
                  <th className="text-left px-6 py-4 text-navy-300 text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-navy-300 text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((query) => {
                  const status = statusConfig[query.status] || statusConfig.pending;
                  return (
                    <tr
                      key={query.id}
                      className="border-b border-navy-700/30 hover:bg-navy-700/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-navy-300 whitespace-nowrap">
                        {formatDate(query.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium">
                            {query.fullName || '—'}
                          </span>
                          {query.fileUrl && (
                            <Paperclip className="w-3.5 h-3.5 text-navy-400" title="Has attachment" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-navy-300 hidden md:table-cell">
                        {query.email || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-navy-300 hidden lg:table-cell">
                        {query.service || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={query.status || 'pending'}
                          onChange={(e) =>
                            onUpdateStatus?.(query.id, e.target.value)
                          }
                          className={`rounded-full px-3 py-1 text-xs font-medium appearance-none cursor-pointer bg-transparent ${status.classes} outline-none`}
                        >
                          <option value="pending" className="bg-navy-800 text-white">
                            Pending
                          </option>
                          <option value="in-progress" className="bg-navy-800 text-white">
                            In Progress
                          </option>
                          <option value="completed" className="bg-navy-800 text-white">
                            Completed
                          </option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewDetail?.(query)}
                            className="w-8 h-8 rounded-lg bg-navy-700/50 hover:bg-blue-500/20 flex items-center justify-center text-navy-300 hover:text-blue-400 transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete?.(query.id)}
                            className="w-8 h-8 rounded-lg bg-navy-700/50 hover:bg-red-500/20 flex items-center justify-center text-navy-300 hover:text-red-400 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-navy-700/30 flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-navy-500" />
            </div>
            <h3 className="text-white font-semibold mb-1">No queries found</h3>
            <p className="text-sm text-navy-400 text-center max-w-xs">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'When clients submit queries, they will appear here.'}
            </p>
          </div>
        )}
      </div>

      {/* Results count */}
      {queries.length > 0 && (
        <p className="text-xs text-navy-400 text-right">
          Showing {filteredQueries.length} of {queries.length} queries
        </p>
      )}
    </div>
  );
};

export default QueryTable;
