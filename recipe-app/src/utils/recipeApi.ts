import { Recipe } from '../types/recipe';

/**
 * Client-side function to fetch recipes from the API
 */
export async function fetchRecipesFromAPI(): Promise<Recipe[]> {
  try {
    console.log('Fetching recipes from API...');
    const response = await fetch('/api/pdf-recipes', {
      // Disable caching to always get fresh data
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.length} recipes from API`);
    return data;
  } catch (error) {
    console.error('Error fetching recipes from API:', error);
    throw error;
  }
}

/**
 * Client-side function to fetch a specific recipe from the API
 */
export async function fetchRecipeByIdFromAPI(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`/api/pdf-recipes/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching recipe ${id} from API:`, error);
    return null;
  }
} 