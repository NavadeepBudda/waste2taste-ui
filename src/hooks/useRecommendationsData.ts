import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { AnalyzeFoodDataResponse } from '@/types/api';

interface RecommendationsDataState {
  recommendationsData: AnalyzeFoodDataResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useRecommendationsData = () => {
  const [state, setState] = useState<RecommendationsDataState>({
    recommendationsData: null,
    isLoading: true, // Start with loading true
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts

    const fetchRecommendationsData = async () => {
      if (!isMounted) return;

      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // Use the auto-fetch endpoint to get real food data from Supabase
        console.log('Fetching recommendations data from Supabase...');
        const data = await api.analyzeFoodDataAuto(168, 20); // Get last week's data, up to 20 recommendations
        
        if (!isMounted) return; // Check again before state update
        
        // Ensure data structure is valid
        if (data && data.most_disliked_foods && data.most_disliked_foods.length > 0) {
          console.log(`Loaded ${data.most_disliked_foods.length} food recommendations`);
          setState({
            recommendationsData: data,
            isLoading: false,
            error: null,
            lastUpdated: new Date()
          });
        } else {
          setState({
            recommendationsData: null,
            isLoading: false,
            error: 'No recommendations data available',
            lastUpdated: new Date()
          });
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Error fetching recommendations data:', error);
        setState({
          recommendationsData: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch recommendations data',
          lastUpdated: new Date()
        });
      }
    };

    fetchRecommendationsData();

    return () => {
      isMounted = false; // Cleanup flag
    };
  }, []); // Empty dependency array - only run once on mount

  const refetch = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await api.analyzeFoodDataAuto(168, 20);
      
      if (data && data.most_disliked_foods && data.most_disliked_foods.length > 0) {
        setState({
          recommendationsData: data,
          isLoading: false,
          error: null,
          lastUpdated: new Date()
        });
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No recommendations data available'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recommendations data'
      }));
    }
  };

  return {
    recommendationsData: state.recommendationsData,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    refetch,
  };
};