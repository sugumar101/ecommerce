import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  brand: string;
  stock: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));