import axiosInstance from '../axios'

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
    const response = await axiosInstance.get('/coins', { params })
    return response.data
  },

  async getCoinById(id: string): Promise<Coin> {
    const response = await axiosInstance.get(`/coins/${id}`)
    return response.data
  }
}
