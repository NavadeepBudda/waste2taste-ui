import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { AnalyzeFoodDataResponse, HistoricalAnalytics, SmartInsight, SmartRecommendation } from '@/types/api';

interface DataContextType {
  todayData: AnalyzeFoodDataResponse | null;
  isTodayLoading: boolean;
  todayError: string | null;
  todayLastUpdated: Date | null;
  recommendationsData: AnalyzeFoodDataResponse | null;
  isRecommendationsLoading: boolean;
  recommendationsError: string | null;
  recommendationsLastUpdated: Date | null;
  historicalData: HistoricalAnalytics | null;
  isHistoricalLoading: boolean;
  historicalError: string | null;
  historicalLastUpdated: Date | null;
  insights: SmartInsight[];
  recommendations: SmartRecommendation[];
  refetchTodayData: () => Promise<void>;
  refetchRecommendationsData: () => Promise<void>;
  refetchHistoricalData: () => Promise<void>;
  refetchInsights: () => Promise<void>;
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

  const [historicalData, setHistoricalData] = useState<HistoricalAnalytics | null>(null);
  const [isHistoricalLoading, setIsHistoricalLoading] = useState(false);
  const [historicalError, setHistoricalError] = useState<string | null>(null);
  const [historicalLastUpdated, setHistoricalLastUpdated] = useState<Date | null>(null);

  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);

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

  const refetchHistoricalData = useCallback(async () => {
    if (!shouldRefetchData(historicalLastUpdated) && historicalData) {
      return;
    }

    setIsHistoricalLoading(true);
    setHistoricalError(null);
    
    try {
      console.log('Fetching historical analytics data...');
      const response = await api.getHistoricalAnalytics(30);
      
      if (response.historical_analytics) {
        console.log('Loaded historical analytics data');
        setHistoricalData(response.historical_analytics);
        setHistoricalLastUpdated(new Date());
      } else {
        setHistoricalData(null);
        setHistoricalError('No historical data available');
        setHistoricalLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setHistoricalData(null);
      setHistoricalError(error instanceof Error ? error.message : 'Failed to fetch historical data');
      setHistoricalLastUpdated(new Date());
    } finally {
      setIsHistoricalLoading(false);
    }
  }, [historicalLastUpdated, historicalData]);

  const refetchInsights = useCallback(async () => {
    try {
      console.log('Fetching smart insights...');
      const response = await api.getSmartInsights();
      
      if (response.insights) {
        setInsights(response.insights.key_insights);
        setRecommendations(response.insights.recommendations);
        console.log(`Loaded ${response.insights.key_insights.length} insights and ${response.insights.recommendations.length} recommendations`);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights([]);
      setRecommendations([]);
    }
  }, []);

  useEffect(() => {
    refetchTodayData();
    refetchRecommendationsData();
    refetchHistoricalData();
    refetchInsights();
  }, [refetchTodayData, refetchRecommendationsData, refetchHistoricalData, refetchInsights]);

  const value = {
    todayData,
    isTodayLoading,
    todayError,
    todayLastUpdated,
    recommendationsData,
    isRecommendationsLoading,
    recommendationsError,
    recommendationsLastUpdated,
    historicalData,
    isHistoricalLoading,
    historicalError,
    historicalLastUpdated,
    insights,
    recommendations,
    refetchTodayData,
    refetchRecommendationsData,
    refetchHistoricalData,
    refetchInsights,
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