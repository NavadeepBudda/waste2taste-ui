import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { AnalyzeFoodDataResponse } from '@/types/api';

interface DataContextType {
  todayData: AnalyzeFoodDataResponse | null;
  isTodayLoading: boolean;
  todayError: string | null;
  todayLastUpdated: Date | null;
  recommendationsData: AnalyzeFoodDataResponse | null;
  isRecommendationsLoading: boolean;
  recommendationsError: string | null;
  recommendationsLastUpdated: Date | null;
  refetchTodayData: () => Promise<void>;
  refetchRecommendationsData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [todayData, setTodayData] = useState<AnalyzeFoodDataResponse | null>(null);
  const [isTodayLoading, setIsTodayLoading] = useState(false);
  const [todayError, setTodayError] = useState<string | null>(null);
  const [todayLastUpdated, setTodayLastUpdated] = useState<Date | null>(null);

  const [recommendationsData, setRecommendationsData] = useState<AnalyzeFoodDataResponse | null>(null);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
  const [recommendationsLastUpdated, setRecommendationsLastUpdated] = useState<Date | null>(null);

  const shouldRefetchData = (lastUpdated: Date | null) => {
    if (!lastUpdated) return true;
    return Date.now() - lastUpdated.getTime() > CACHE_DURATION;
  };

  const refetchTodayData = useCallback(async () => {
    if (!shouldRefetchData(todayLastUpdated) && todayData) {
      return;
    }

    setIsTodayLoading(true);
    setTodayError(null);
    
    try {
      console.log('Fetching today\'s food analysis data...');
      const data = await api.analyzeFoodDataAuto(24, 50);
      
      if (data && data.most_disliked_foods && data.most_disliked_foods.length > 0) {
        console.log(`Loaded ${data.most_disliked_foods.length} food items from last 24 hours`);
        setTodayData(data);
        setTodayLastUpdated(new Date());
      } else {
        setTodayData(null);
        setTodayError('No disposal data available from the last 24 hours');
        setTodayLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching today\'s data:', error);
      setTodayData(null);
      setTodayError(error instanceof Error ? error.message : 'Failed to fetch today\'s data');
      setTodayLastUpdated(new Date());
    } finally {
      setIsTodayLoading(false);
    }
  }, [todayLastUpdated, todayData]);

  const refetchRecommendationsData = useCallback(async () => {
    if (!shouldRefetchData(recommendationsLastUpdated) && recommendationsData) {
      return;
    }

    setIsRecommendationsLoading(true);
    setRecommendationsError(null);
    
    try {
      console.log('Fetching recommendations data from Supabase...');
      const data = await api.analyzeFoodDataAuto(168, 20);
      
      if (data && data.most_disliked_foods && data.most_disliked_foods.length > 0) {
        console.log(`Loaded ${data.most_disliked_foods.length} food recommendations`);
        setRecommendationsData(data);
        setRecommendationsLastUpdated(new Date());
      } else {
        setRecommendationsData(null);
        setRecommendationsError('No recommendations data available');
        setRecommendationsLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching recommendations data:', error);
      setRecommendationsData(null);
      setRecommendationsError(error instanceof Error ? error.message : 'Failed to fetch recommendations data');
      setRecommendationsLastUpdated(new Date());
    } finally {
      setIsRecommendationsLoading(false);
    }
  }, [recommendationsLastUpdated, recommendationsData]);

  useEffect(() => {
    refetchTodayData();
  }, [refetchTodayData]);

  const value = {
    todayData,
    isTodayLoading,
    todayError,
    todayLastUpdated,
    recommendationsData,
    isRecommendationsLoading,
    recommendationsError,
    recommendationsLastUpdated,
    refetchTodayData,
    refetchRecommendationsData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};