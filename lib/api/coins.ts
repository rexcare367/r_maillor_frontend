import { axiosAuth } from '../axios'

export interface Coin {
  id: string
  name: string
  sub_name: string
  category: string
  reference: string
  material: string
  origin_country: string
  year: number
  condition: string
  gross_weight: number
  net_weight: number
  prime_percent: number
  price_eur: number
  taxation: string
  vault_location: string
  lsp_eligible: boolean
  is_main_list: boolean
  is_featured: boolean
  is_deliverable: boolean
  is_new: boolean
  is_sold: boolean
  front_picture_url: string
  product_url: string
  ai_score: number | null
  scraped_at: string
  created_at: string
  updated_at: string | null
  is_favorite?: boolean
}

export interface CoinsResponse {
  data: Coin[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CoinsParams {
  page?: number
  limit?: number
  category?: string
  material?: string
  origin_country?: string
  condition?: string
  is_main_list?: boolean
  is_featured?: boolean
  min_price?: number
  max_price?: number
  min_year?: number
  max_year?: number
}

export const coinsApi = {
  async getCoins(params: CoinsParams = {}): Promise<CoinsResponse> {
    console.log('🪙 Fetching coins with params:', params);
    try {
      const response = await axiosAuth.get('/coins', { params });
      console.log('✅ Coins fetched successfully:', response.data.pagination);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching coins:', error);
      throw error;
    }
  },

  async getCoinById(id: string): Promise<Coin> {
    console.log('🪙 Fetching coin by ID:', id);
    try {
      const response = await axiosAuth.get(`/coins/${id}`);
      console.log('✅ Coin fetched successfully:', response.data.name);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching coin:', error);
      throw error;
    }
  }
}
