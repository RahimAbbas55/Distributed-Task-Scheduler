"use client";
import { useState } from "react";
import {
  Briefcase,
  Activity,
  Clock,
  TrendingUp,
  Users,
  Zap,
  AlertCircle,
  Plus,
  X,
  Calendar,
  Hash,
  FileText,
} from "lucide-react";
import JobTable from "./components/JobTable";
import { getJobs } from "./lib/api";

const createJob = async (jobData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, id: Date.now() };
};

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    payload: "{}",
    priority: 0,
    max_retries: 3,
    scheduled_at: new Date().toISOString().slice(0, 16),
    failed_reason: "",
  });

  // Simulate data loading
  useState(() => {
    const loadData = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate real-time stats from actual job data
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter((job) => job.status === "completed").length;
  const pendingJobs = jobs.filter((job) => job.status === "pending").length;
  const inProgressJobs = jobs.filter(
    (job) => job.status === "in_progress"
  ).length;
  const failedJobs = jobs.filter((job) => job.status === "failed").length;
  const cancelledJobs = jobs.filter((job) => job.status === "cancelled").length;

  const stats = [
    {
      label: "Total Jobs",
      value: totalJobs.toString(),
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Completed",
      value: completedJobs.toString(),
      icon: TrendingUp,
      color: "from-emerald-500 to-green-500",
    },
    {
      label: "Pending",
      value: pendingJobs.toString(),
      icon: Clock,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "In Progress",
      value: inProgressJobs.toString(),
      icon: Activity,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      JSON.parse(formData.payload);

      await createJob(formData);

      // Reset form and close modal
      setFormData({
        type: "",
        payload: "{}",
        priority: 0,
        max_retries: 3,
        scheduled_at: new Date().toISOString().slice(0, 16),
        failed_reason: "",
      });
      setShowModal(false);

      // Refresh jobs list
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error("Error creating job:", err);
      alert("Error creating job: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-2xl">
                  <Briefcase className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-2">
                  Job Dashboard
                </h1>
                <p className="text-xl text-purple-200">
                  Monitor • Manage • Optimize
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">
                {error ? "System Error" : "System Online"}
              </span>
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse ml-4"></div>
              {error && (
                <div className="ml-4 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  API Error
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden opacity-0 animate-pulse"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                ></div>

                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white/60" />
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-white mb-1 group-hover:text-purple-100 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    {stat.label}
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Stats Row */}
          {!error && (failedJobs > 0 || cancelledJobs > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {failedJobs > 0 && (
                <div className="group relative overflow-hidden">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 shadow-lg">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      {failedJobs}
                    </div>
                    <div className="text-sm text-red-300">Failed Jobs</div>
                  </div>
                </div>
              )}

              {cancelledJobs > 0 && (
                <div className="group relative overflow-hidden">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-gray-500/30 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-400 mb-1">
                      {cancelledJobs}
                    </div>
                    <div className="text-sm text-gray-300">Cancelled Jobs</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Main Content Area */}
          <div className="relative">
            {/* Add Job Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg shadow transition"
              >
                <Plus className="w-4 h-4" />
                Add Job
              </button>
            </div>
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Create New Job
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <input
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Payload (JSON)
                      </label>
                      <textarea
                        name="payload"
                        value={formData.payload}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <input
                          name="priority"
                          type="number"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Max Retries
                        </label>
                        <input
                          name="max_retries"
                          type="number"
                          value={formData.max_retries}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Schedule Time
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduled_at"
                        value={formData.scheduled_at}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                    >
                      {submitting ? "Creating..." : "Create Job"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            <JobTable />
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
              <span className="text-white/60 text-sm">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
