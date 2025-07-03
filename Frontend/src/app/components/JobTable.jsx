"use client";
import { useEffect, useState } from "react";
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Pause, Play, Trash2 } from "lucide-react";
import { getJobs , cancelJob } from "../lib/api";

// // Mock API functions for demo
// const getJobs = async () => {
//   await new Promise(resolve => setTimeout(resolve, 1500));
//   return [
//     { id: 1, type: "Data Processing", status: "completed", priority: "High", scheduled_at: "2024-12-01T10:30:00Z" },
//     { id: 2, type: "Email Campaign", status: "in_progress", priority: "Medium", scheduled_at: "2024-12-01T14:15:00Z" },
//     { id: 3, type: "Database Backup", status: "pending", priority: "Low", scheduled_at: "2024-12-01T18:00:00Z" },
//     { id: 4, type: "Report Generation", status: "failed", priority: "High", scheduled_at: "2024-12-01T09:45:00Z" },
//     { id: 5, type: "Image Processing", status: "cancelled", priority: "Medium", scheduled_at: "2024-12-01T16:20:00Z" },
//     { id: 6, type: "API Sync", status: "pending", priority: "High", scheduled_at: "2024-12-01T20:30:00Z" },
//   ];
// };

// const cancelJob = async (id) => {
//   await new Promise(resolve => setTimeout(resolve, 500));
//   return { success: true };
// };

export default function JobTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingIds, setCancellingIds] = useState(new Set());

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    setCancellingIds(prev => new Set(prev).add(id));
    try {
      await cancelJob(id);
      fetchJobs();
    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setCancellingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "failed": return <XCircle className="w-4 h-4" />;
      case "in_progress": return <Play className="w-4 h-4" />;
      case "cancelled": return <Pause className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed": return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25";
      case "failed": return "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25";
      case "in_progress": return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25";
      case "cancelled": return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/25";
      default: return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High": return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200";
      case "Medium": return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200";
      case "Low": return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200";
      default: return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200";
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer h-16 rounded-xl"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Job Dashboard
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Monitor and manage your background jobs</p>
        </div>

        {/* Main Table Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Active Jobs</h2>
              <button 
                onClick={fetchJobs}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8">
              <LoadingSkeleton />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Scheduled</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full">
                            <Briefcase className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-lg">No jobs found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job, index) => (
                      <tr 
                        key={job.id} 
                        className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group hover:shadow-lg"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          animation: "fadeInUp 0.6s ease-out forwards"
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                            {job.type}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 ${getStatusStyle(job.status)}`}>
                            {getStatusIcon(job.status)}
                            {job.status.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 ${getPriorityStyle(job.priority)}`}>
                            {job.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {new Date(job.scheduled_at).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {job.status === "pending" && (
                            <button
                              onClick={() => handleCancel(job.id)}
                              disabled={cancellingIds.has(job.id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                              {cancellingIds.has(job.id) ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              {cancellingIds.has(job.id) ? "Cancelling..." : "Cancel"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}