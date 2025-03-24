
import { Brand } from '@/types';

export const createBrand = (name: string): Brand => {
  return {
    id: `brand-${Date.now()}`,
    name,
    questions: [],
    storeCredit: 100
  };
};

export const addStoreCreditToBrand = (brands: Brand[], brandId: string, amount: number): Brand[] => {
  return brands.map(brand => 
    brand.id === brandId 
      ? { ...brand, storeCredit: brand.storeCredit + amount }
      : brand
  );
};
