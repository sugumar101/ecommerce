import { create } from 'zustand';

export interface CartItemData {
  id: string;
  cartId: string;
  productVariantId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    image: string;
    category: string;
  };
  variant: {
    id: string;
    sku: string;
    price: string;
    salePrice: string | null;
    color: {
      id: string;
      name: string;
      hexCode: string;
    };
    size: {
      id: string;
      name: string;
    };
  };
}

interface CartStore {
  items: CartItemData[];
  isLoading: boolean;
  error: string | null;
  setItems: (items: CartItemData[]) => void;
  addItem: (item: CartItemData) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  setItems: (items) => set({ items, error: null }),

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  updateItem: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    })),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),

  clearCart: () => set({ items: [] }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  getTotalItems: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    const state = get();
    return state.items.reduce((total, item) => {
      const price = parseFloat(item.variant.salePrice || item.variant.price);
      return total + price * item.quantity;
    }, 0);
  },
}));
