import { createContext, useContext, ReactNode } from 'react';
import { useTodayData } from '@/hooks/useTodayData';
import { useRecommendationsData } from '@/hooks/useRecommendationsData';
import { AnalyzeFoodDataResponse } from '@/types/api';

interface DataContextType {
  todayData: AnalyzeFoodDataResponse | null;
  isTodayLoading: boolean;
  todayError: string | null;
  recommendationsData: AnalyzeFoodDataResponse | null;
  isRecommendationsLoading: boolean;
  recommendationsError: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { todayData, isLoading: isTodayLoading, error: todayError } = useTodayData();
  const { recommendationsData, isLoading: isRecommendationsLoading, error: recommendationsError } = useRecommendationsData();

  const value = {
    todayData,
    isTodayLoading,
    todayError,
    recommendationsData,
    isRecommendationsLoading,
    recommendationsError,
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