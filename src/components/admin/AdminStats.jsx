import { useMemo } from 'react';
import { Inbox, Clock, Loader, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminStats = ({ queries = [] }) => {
  const stats = useMemo(() => {
    const total = queries.length;
    const pending = queries.filter((q) => q.status === 'pending').length;
    const inProgress = queries.filter((q) => q.status === 'in-progress').length;
    const completed = queries.filter((q) => q.status === 'completed').length;

    return [
      {
        id: 'total',
        label: 'Total Queries',
        count: total,
        icon: Inbox,
        iconColor: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
      },
      {
        id: 'pending',
        label: 'Pending',
        count: pending,
        icon: Clock,
        iconColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
      },
      {
        id: 'in-progress',
        label: 'In Progress',
        count: inProgress,
        icon: Loader,
        iconColor: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
      },
      {
        id: 'completed',
        label: 'Completed',
        count: completed,
        icon: CheckCircle,
        iconColor: 'text-green-400',
        bgColor: 'bg-green-500/10',
      },
    ];
  }, [queries]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="bg-navy-800/50 backdrop-blur-sm border border-navy-700/50 rounded-2xl p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-navy-300 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.count}</p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
            >
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;
