// API Response Types for Waste2Taste API

export interface FoodDisposalData {
  food_name: string;
  disposal_mass: number;
  rank?: number;
}

export interface AlternativeRecipe {
  recipe_name: string;
  similar_ingredients: string[];
  improvements: string;
  estimated_popularity: number;
  prep_time: string;
}

export interface MostDislikedFood {
  food_name: string;
  disposal_mass: number;
  rank: number;
  dish_summary: string;
  keywords: string;
  alternative_recipes: AlternativeRecipe[];
}

export interface DisposalStatistics {
  total_items: number;
  total_disposal_mass: number;
  average_disposal_mass: number;
  min_disposal_mass: number;
  max_disposal_mass: number;
  median_disposal_mass: number;
}

export interface AnalysisInsights {
  analysis_timestamp: string;
  total_foods_analyzed: number;
  most_disliked_foods: string[];
  least_disliked_foods: string[];
  disposal_statistics: DisposalStatistics;
  recommendation: string;
}

export interface AnalysisSummary {
  total_foods_analyzed: number;
  most_disliked_count: number;
  recommendations_generated: number;
  hours_back: number;
}

export interface AnalyzeFoodDataResponse {
  status: string;
  timestamp: string;
  data_source: string;
  analysis_summary: AnalysisSummary;
  most_disliked_foods: MostDislikedFood[];
  insights: AnalysisInsights;
}

export interface GetRecommendationsResponse {
  status: string;
  timestamp: string;
  total_available: number;
  returned_count: number;
  most_disliked_foods: MostDislikedFood[];
}

export interface AnalyticsStatistics {
  total_items: number;
  total_disposal_mass: number;
  average_disposal_mass: number;
  min_disposal_mass: number;
  max_disposal_mass: number;
  median_disposal_mass: number;
}

export interface DisposalMassRange {
  highest_disposal: {
    food_name: string;
    mass: number;
    rank: number;
  };
  lowest_disposal: {
    food_name: string;
    mass: number;
    rank: number;
  };
}

export interface AnalyticsInsights {
  analysis_timestamp: string;
  total_foods_analyzed: number;
  most_disliked_foods: string[];
  least_disliked_foods: string[];
  disposal_mass_range: DisposalMassRange;
  foods_below_average_disposal: number;
  percentage_below_average: number;
  recommendation: string;
}

export interface Analytics {
  statistics: AnalyticsStatistics;
  insights: AnalyticsInsights;
}

export interface AnalyticsResponse {
  status: string;
  timestamp: string;
  data_summary: {
    total_food_items: number;
    analysis_date: string;
  };
  analytics: Analytics;
}

export interface CookingTipsResponse {
  status: string;
  timestamp: string;
  cooking_tips: {
    general_improvements: string[];
    student_preferences: string[];
  };
}

export interface IngredientSuggestionsResponse {
  status: string;
  timestamp: string;
  food_category: string;
  ingredient_suggestions: string[];
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  service: string;
}

export interface ApiError {
  error: string;
  timestamp: string;
  suggestion?: string;
  message?: string;
}

// Historical Analytics Types
export interface HistoricalTrendData {
  date: string;
  items_disposed: number;
  total_mass: number;
  avg_mass: number;
  unique_foods: number;
}

export interface FoodFrequencyData {
  food_name: string;
  disposal_frequency: number;
  total_mass_wasted: number;
  avg_mass_per_disposal: number;
  min_mass: number;
  max_mass: number;
  first_seen: string;
  last_seen: string;
}

export interface WasteReductionMetrics {
  current_period: {
    items: number;
    total_mass: number;
    avg_mass: number;
    unique_foods: number;
  };
  previous_period: {
    items: number;
    total_mass: number;
    avg_mass: number;
    unique_foods: number;
  };
  changes: {
    items_change_percent: number;
    mass_change_percent: number;
    avg_mass_change_percent: number;
    unique_foods_change_percent: number;
  };
  comparison_period_days: number;
}

export interface DisposalPattern {
  hour?: number;
  day_of_week?: number;
  day_name?: string;
  disposal_count: number;
  total_mass: number;
}

export interface DisposalPatterns {
  hourly_patterns: DisposalPattern[];
  daily_patterns: DisposalPattern[];
}

export interface HistoricalAnalyticsSummary {
  total_items_disposed: number;
  total_mass_disposed: number;
  avg_daily_items: number;
  avg_daily_mass: number;
  analysis_period_days: number;
  unique_foods_tracked: number;
}

export interface HistoricalAnalytics {
  summary: HistoricalAnalyticsSummary;
  trends: HistoricalTrendData[];
  frequency_analysis: FoodFrequencyData[];
  reduction_metrics: WasteReductionMetrics;
  disposal_patterns: DisposalPatterns;
  insights: string[];
}

export interface HistoricalAnalyticsResponse {
  status: string;
  timestamp: string;
  data_source: string;
  historical_analytics: HistoricalAnalytics;
}

export interface TrendsData {
  daily_data: HistoricalTrendData[];
  period_comparison: WasteReductionMetrics;
  analysis_period_days: number;
}

export interface TrendsResponse {
  status: string;
  timestamp: string;
  trends: TrendsData;
}

export interface SmartInsight {
  type: 'frequency' | 'timing' | 'trend' | 'pattern';
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SmartRecommendation {
  title: string;
  description: string;
  potential_impact: string;
  action_items: string[];
}

export interface InsightsData {
  summary: string;
  key_insights: SmartInsight[];
  recommendations: SmartRecommendation[];
  data_quality: {
    foods_analyzed: number;
    has_pattern_data: boolean;
    has_trend_data: boolean;
  };
}

export interface InsightsResponse {
  status: string;
  timestamp: string;
  insights: InsightsData;
}

// Request Types
export interface AnalyzeFoodDataRequest {
  food_data?: FoodDisposalData[];
  fetch_from_supabase?: boolean;
  hours_back?: number;
  top_n_recommendations?: number;
}

export interface StoreDisposalDataRequest {
  food_name?: string;
  disposal_mass?: number;
  location?: string;
  session_id?: string;
  disposal_records?: {
    food_name: string;
    disposal_mass: number;
  }[];
}