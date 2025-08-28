import axios from 'axios';

export const cartService = {
  getCart: (token: string) =>
    axios.get('/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  addToCart: (productId: string, quantity: number, token: string) =>
    axios.post(
      '/api/cart',
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  updateQuantity: (itemId: string, quantity: number, token: string) =>
    axios.put(
      `/api/cart/${itemId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  removeFromCart: (itemId: string, token: string) =>
    axios.delete(`/api/cart/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
