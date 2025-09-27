import {
  AnalyzeFoodDataResponse,
  GetRecommendationsResponse,
  AnalyticsResponse,
  CookingTipsResponse,
  IngredientSuggestionsResponse,
  HealthCheckResponse,
  AnalyzeFoodDataRequest,
  StoreDisposalDataRequest,
  ApiError,
} from '@/types/api';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

class ApiServiceError extends Error {
  constructor(
    message: string,
    public status?: number,
    public suggestion?: string
  ) {
    super(message);
    this.name = 'ApiServiceError';
  }
}

class Waste2TasteAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        throw new ApiServiceError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }
      
      throw new ApiServiceError(
        errorData.error || `HTTP error! status: ${response.status}`,
        response.status,
        errorData.suggestion
      );
    }

    return response.json();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    return this.handleResponse<T>(response);
  }

  // Health check endpoint
  async healthCheck(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/health');
  }

  // Main food data analysis endpoint with sample data
  async analyzeFoodData(
    requestData: AnalyzeFoodDataRequest
  ): Promise<AnalyzeFoodDataResponse> {
    return this.request<AnalyzeFoodDataResponse>('/analyze-food-data', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Test method to send sample data and see real AI responses
  async testWithSampleData(): Promise<AnalyzeFoodDataResponse> {
    const sampleData = {
      food_data: [
        { food_name: "Soggy Pizza", disposal_mass: 15.2 },
        { food_name: "Dry Chicken Breast", disposal_mass: 8.7 },
        { food_name: "Overcooked Broccoli", disposal_mass: 12.3 },
        { food_name: "Bland Mac and Cheese", disposal_mass: 18.5 },
        { food_name: "Tough Steak", disposal_mass: 22.1 },
        { food_name: "Mushy Rice", disposal_mass: 10.5 },
        { food_name: "Burnt Toast", disposal_mass: 6.8 },
        { food_name: "Salty Soup", disposal_mass: 14.2 },
        { food_name: "Rubbery Fish", disposal_mass: 9.3 },
        { food_name: "Soggy Salad", disposal_mass: 7.9 },
        { food_name: "Lumpy Mashed Potatoes", disposal_mass: 11.1 },
        { food_name: "Watery Pasta", disposal_mass: 13.6 },
        { food_name: "Greasy Fries", disposal_mass: 16.4 },
        { food_name: "Underseasoned Vegetables", disposal_mass: 8.2 },
        { food_name: "Stale Bread", disposal_mass: 5.5 }
      ],
      top_n_recommendations: 15
    };
    
    return this.request<AnalyzeFoodDataResponse>('/analyze-food-data', {
      method: 'POST',
      body: JSON.stringify(sampleData),
    });
  }

  // Auto-fetch analysis endpoint
  async analyzeFoodDataAuto(
    hoursBack: number = 24,
    topNRecommendations: number = 10
  ): Promise<AnalyzeFoodDataResponse> {
    return this.request<AnalyzeFoodDataResponse>('/analyze-food-data-auto', {
      method: 'POST',
      body: JSON.stringify({
        hours_back: hoursBack,
        top_n_recommendations: topNRecommendations,
      }),
    });
  }

  // Store disposal data endpoint
  async storeDisposalData(
    requestData: StoreDisposalDataRequest
  ): Promise<{ status: string; message: string; timestamp: string }> {
    return this.request('/store-disposal-data', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Get recommendations endpoint
  async getRecommendations(limit: number = 10): Promise<GetRecommendationsResponse> {
    return this.request<GetRecommendationsResponse>(`/get-recommendations?limit=${limit}`);
  }

  // Cooking tips endpoint
  async getCookingTips(): Promise<CookingTipsResponse> {
    return this.request<CookingTipsResponse>('/cooking-tips');
  }

  // Ingredient suggestions endpoint
  async getIngredientSuggestions(
    foodCategory: string
  ): Promise<IngredientSuggestionsResponse> {
    return this.request<IngredientSuggestionsResponse>(
      `/ingredient-suggestions/${encodeURIComponent(foodCategory)}`
    );
  }

  // Analytics endpoint
  async getAnalytics(): Promise<AnalyticsResponse> {
    return this.request<AnalyticsResponse>('/analytics');
  }
}

// Create and export API instance
export const api = new Waste2TasteAPI();

// Export the API class for potential custom instances
export { Waste2TasteAPI, ApiServiceError };