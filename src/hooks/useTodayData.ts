import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { AnalyzeFoodDataResponse } from '@/types/api';

interface TodayDataState {
  todayData: AnalyzeFoodDataResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useTodayData = () => {
  const [state, setState] = useState<TodayDataState>({
    todayData: null,
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchTodayData = async () => {
      if (!isMounted) return;

      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // Use the 24-hour analysis endpoint for "Today" data
        console.log('Fetching today\'s food analysis data...');
        const data = await api.analyzeFoodDataAuto(24, 50); // Last 24 hours, up to 50 items
        
        if (!isMounted) return;
        
        if (data && data.most_disliked_foods && data.most_disliked_foods.length > 0) {
          console.log(`Loaded ${data.most_disliked_foods.length} food items from last 24 hours`);
          setState({
            todayData: data,
            isLoading: false,
            error: null,
            lastUpdated: new Date()
          });
        } else {
          setState({
            todayData: null,
            isLoading: false,
            error: 'No disposal data available from the last 24 hours',
            lastUpdated: new Date()
          });
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Error fetching today\'s data:', error);
        setState({
          todayData: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch today\'s data',
          lastUpdated: new Date()
        });
      }
    };

    fetchTodayData();

    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  const refetch = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await api.analyzeFoodDataAuto(24, 50);
      
      if (data && data.most_disliked_foods && data.most_disliked_foods.length > 0) {
        setState({
          todayData: data,
          isLoading: false,
          error: null,
          lastUpdated: new Date()
        });
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No disposal data available from the last 24 hours'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch today\'s data'
      }));
    }
  };

  return {
    todayData: state.todayData,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    refetch,
  };
};