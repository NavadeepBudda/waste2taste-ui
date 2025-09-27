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