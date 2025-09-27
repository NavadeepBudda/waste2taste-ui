import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/services/api';
import { AnalyzeFoodDataResponse, GetRecommendationsResponse } from '@/types/api';

interface WasteDataState {
  dashboardData: AnalyzeFoodDataResponse | null;
  recommendationsData: GetRecommendationsResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useWasteData = (enablePolling = false, pollInterval = 30000) => {
  const [state, setState] = useState<WasteDataState>({
    dashboardData: null,
    recommendationsData: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await api.analyzeFoodDataAuto(24, 50);
      
      // Ensure data structure is valid
      if (data && data.most_disliked_foods) {
        setState(prev => ({ 
          ...prev, 
          dashboardData: data, 
          isLoading: false,
          lastUpdated: new Date()
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: 'Invalid data structure received from API',
          isLoading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
        isLoading: false 
      }));
    }
  }, []);

  const fetchRecommendationsData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await api.getRecommendations(50); // Get more recommendations
      
      // Ensure data structure is valid
      if (data && data.most_disliked_foods) {
        setState(prev => ({ 
          ...prev, 
          recommendationsData: data, 
          isLoading: false,
          lastUpdated: new Date()
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: 'Invalid data structure received from recommendations API',
          isLoading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch recommendations data',
        isLoading: false 
      }));
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    await Promise.all([fetchDashboardData(), fetchRecommendationsData()]);
  }, [fetchDashboardData, fetchRecommendationsData]);

  useEffect(() => {
    fetchAllData();

    if (enablePolling) {
      pollingRef.current = setInterval(() => {
        // Fetch smaller dataset for live updates (last hour)
        api.analyzeFoodDataAuto(1, 10).then((data) => {
          setState(prev => ({ 
            ...prev, 
            dashboardData: data,
            lastUpdated: new Date()
          }));
        }).catch(() => {
          // Silently fail on polling errors to avoid disrupting UX
        });
      }, pollInterval);

      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [fetchAllData, enablePolling, pollInterval]);

  return {
    dashboardData: state.dashboardData,
    recommendationsData: state.recommendationsData,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    refetch: fetchAllData,
    fetchDashboardData,
    fetchRecommendationsData,
  };
};