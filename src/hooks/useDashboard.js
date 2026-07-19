import { useState, useEffect } from 'react';
import dashboardService from '../api/dashboardService';
import { toast } from 'react-toastify';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || 'Failed to load dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load statistics:', err);
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchDashboard(), fetchStats()]);
      toast.success('Dashboard refreshed');
    } catch (err) {
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  const clearCache = async () => {
    try {
      const response = await dashboardService.clearCache();
      if (response.success) {
        toast.success('Cache cleared successfully');
        await refreshDashboard();
      }
    } catch (err) {
      toast.error('Failed to clear cache');
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchStats();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboard();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return {
    dashboardData,
    stats,
    loading,
    error,
    refreshing,
    fetchDashboard,
    fetchStats,
    refreshDashboard,
    clearCache,
  };
};