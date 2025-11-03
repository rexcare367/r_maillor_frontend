import { axiosAuth } from '../axios'

export const favoritesApi = {
  async addFavorite(coinId: string): Promise<void> {
    console.log('📌 Adding favorite:', coinId);
    try {
      const response = await axiosAuth.post('/favorites', { coin_id: coinId });
      console.log('✅ Favorite added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding favorite:', error);
      throw error;
    }
  },

  async removeFavorite(coinId: string): Promise<void> {
    console.log('📌 Removing favorite:', coinId);
    try {
      const response = await axiosAuth.delete(`/favorites/${coinId}`);
      console.log('✅ Favorite removed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error removing favorite:', error);
      throw error;
    }
  },

  async getFavorites(): Promise<string[]> {
    console.log('📌 Fetching favorites');
    try {
      const response = await axiosAuth.get('/favorites');
      console.log('✅ Favorites fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching favorites:', error);
      throw error;
    }
  }
}

