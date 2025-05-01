export interface Ingredient {
  name: string;
  amount: number | string;
  unit: string;
  metricAmount: number | string;
  metricUnit: string;
}

export interface Recipe {
  id?: number | string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  image?: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  author?: string;
  createdAt?: string;
  source?: string; // PDF file source
} 