export interface Dish {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  badgeText?: string;
  prepTime?: string;
  servings?: string;
  isStar?: boolean;
}

export type DishCategory = 'Todos' | string;
