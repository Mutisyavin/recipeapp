import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { Recipe } from '../../../types/recipe';
import { extractRecipeFromPDFText } from '../../../utils/pdfParser';

// Mock data for recipes
export const mockRecipes: Recipe[] = [
  {
    id: 'pdf-1',
    title: "Homemade Pizza",
    description: "Delicious homemade pizza with a crispy crust and your favorite toppings.",
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    ingredients: [
      { name: "Pizza dough", amount: 1, unit: "ball", metricAmount: 300, metricUnit: "g" },
      { name: "Tomato sauce", amount: 0.5, unit: "cup", metricAmount: 120, metricUnit: "ml" },
      { name: "Mozzarella cheese", amount: 2, unit: "cups", metricAmount: 200, metricUnit: "g" },
      { name: "Olive oil", amount: 2, unit: "tbsp", metricAmount: 30, metricUnit: "ml" },
      { name: "Fresh basil", amount: 0.25, unit: "cup", metricAmount: 10, metricUnit: "g" },
    ],
    instructions: [
      "Preheat oven to 475°F (245°C) with a pizza stone if you have one.",
      "Stretch the pizza dough on a floured surface to desired thickness.",
      "Spread tomato sauce evenly over the dough, leaving a small border for the crust.",
      "Sprinkle mozzarella cheese over the sauce.",
      "Drizzle with olive oil and add any additional toppings of your choice.",
      "Bake for 12-15 minutes until the crust is golden and cheese is bubbly.",
      "Remove from oven, top with fresh basil, and let cool slightly before slicing."
    ],
    tags: ["Italian", "Dinner", "Vegetarian"],
    source: "Recipe-Book_merged.pdf"
  },
  {
    id: 'pdf-2',
    title: "Chocolate Chip Cookies",
    description: "Classic chocolate chip cookies with crispy edges and soft centers.",
    prepTime: 15,
    cookTime: 10,
    servings: 24,
    ingredients: [
      { name: "All-purpose flour", amount: 2.25, unit: "cups", metricAmount: 280, metricUnit: "g" },
      { name: "Butter, softened", amount: 1, unit: "cup", metricAmount: 225, metricUnit: "g" },
      { name: "Brown sugar", amount: 0.75, unit: "cup", metricAmount: 150, metricUnit: "g" },
      { name: "White sugar", amount: 0.75, unit: "cup", metricAmount: 150, metricUnit: "g" },
      { name: "Eggs", amount: 2, unit: "large", metricAmount: 2, metricUnit: "large" },
      { name: "Vanilla extract", amount: 2, unit: "tsp", metricAmount: 10, metricUnit: "ml" },
      { name: "Baking soda", amount: 1, unit: "tsp", metricAmount: 5, metricUnit: "g" },
      { name: "Salt", amount: 0.5, unit: "tsp", metricAmount: 3, metricUnit: "g" },
      { name: "Chocolate chips", amount: 2, unit: "cups", metricAmount: 350, metricUnit: "g" },
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "In a large bowl, cream together butter and both sugars until light and fluffy.",
      "Beat in eggs one at a time, then stir in vanilla.",
      "In a separate bowl, combine flour, baking soda, and salt.",
      "Gradually blend the dry ingredients into the wet mixture.",
      "Fold in chocolate chips.",
      "Drop tablespoon-sized balls of dough onto ungreased baking sheets.",
      "Bake for 9-11 minutes or until golden brown.",
      "Allow to cool on baking sheet for 2 minutes, then transfer to wire racks."
    ],
    tags: ["Dessert", "Baking", "Sweets"],
    source: "Recipe-Book_merged.pdf"
  },
  {
    id: 'pdf-3',
    title: "Classic Spaghetti Carbonara",
    description: "Creamy Italian pasta dish with eggs, cheese, pancetta, and pepper.",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    ingredients: [
      { name: "Spaghetti", amount: 1, unit: "lb", metricAmount: 450, metricUnit: "g" },
      { name: "Eggs", amount: 4, unit: "whole", metricAmount: 4, metricUnit: "whole" },
      { name: "Pancetta or Bacon", amount: 8, unit: "oz", metricAmount: 225, metricUnit: "g" },
      { name: "Parmesan Cheese", amount: 1, unit: "cup", metricAmount: 100, metricUnit: "g" },
      { name: "Black Pepper", amount: 1, unit: "tsp", metricAmount: 5, metricUnit: "ml" },
      { name: "Salt", amount: 1, unit: "tsp", metricAmount: 5, metricUnit: "g" },
    ],
    instructions: [
      "Bring a large pot of salted water to a boil. Add the spaghetti and cook until al dente.",
      "While the pasta is cooking, heat a large skillet over medium heat. Add the pancetta and cook until crisp.",
      "In a bowl, whisk together the eggs, Parmesan, and black pepper.",
      "Drain the pasta, reserving about 1/2 cup of the pasta water.",
      "Working quickly, add the hot pasta to the skillet with the pancetta. Toss to combine.",
      "Remove from heat and pour in the egg mixture, tossing constantly.",
      "If needed, add a splash of the reserved pasta water to create a creamy sauce.",
      "Serve immediately with additional Parmesan and black pepper."
    ],
    tags: ["Italian", "Pasta", "Dinner"],
    source: "Recipe-Book_merged.pdf"
  }
];

// Check for a specific PDF file and extract recipes
async function getPDFRecipes(): Promise<Recipe[]> {
  try {
    // Define the specific PDF file path to use
    const pdfFilePath = path.join(process.cwd(), 'PDF', 'Recipe-Book_merged.pdf');
    
    // Log some debugging info
    console.log(`Looking for specific PDF file: ${pdfFilePath}`);
    
    if (fs.existsSync(pdfFilePath)) {
      console.log(`Found PDF file: ${pdfFilePath}`);
      
      try {
        // Read the PDF file directly (it's actually a text file with .pdf extension)
        const pdfText = fs.readFileSync(pdfFilePath, 'utf8');
        console.log(`Successfully read PDF file. Content length: ${pdfText.length}`);
        
        if (pdfText && pdfText.length > 0) {
          // Process the PDF text to extract recipes
          // Split by markdown headers
          const recipeTexts = pdfText.split(/\n##/).filter(text => text.trim() !== '');
          console.log(`Found ${recipeTexts.length} potential recipe sections`);
          
          // Make sure the first section (title) is handled properly
          if (recipeTexts.length > 0 && recipeTexts[0].startsWith('# ')) {
            recipeTexts[0] = recipeTexts[0].substring(1);
          }
          
          // Process each recipe text
          const recipes: Recipe[] = [];
          for (let i = 0; i < recipeTexts.length; i++) {
            try {
              // Add back the ## prefix for non-first sections to maintain format
              const recipeText = i === 0 ? recipeTexts[i] : `##${recipeTexts[i]}`;
              if (recipeText.trim().length > 50) { // Only process substantial text blocks
                const recipe = extractRecipeFromPDFText(recipeText, i);
                recipes.push({
                  ...recipe,
                  id: `pdf-${recipes.length + 1}`,
                  source: path.basename(pdfFilePath)
                });
                console.log(`Extracted recipe: ${recipe.title}`);
              }
            } catch (error) {
              console.error(`Error processing recipe section ${i}:`, error);
            }
          }
          
          if (recipes.length > 0) {
            console.log(`Successfully extracted ${recipes.length} recipes from PDF`);
            return recipes;
          }
        }
      } catch (error) {
        console.error('Error extracting recipes from PDF:', error);
      }
    } else {
      console.log('Specific PDF file not found');
    }
    
    // Return mock data as fallback
    console.log('Using mock data as fallback');
    return mockRecipes;
  } catch (error) {
    console.error('Error getting PDF recipes:', error);
    return mockRecipes;
  }
}

// GET handler for /api/pdf-recipes
export async function GET() {
  try {
    const recipes = await getPDFRecipes();
    return NextResponse.json(recipes, { status: 200 });
  } catch (error: any) {
    console.error('Error in PDF recipes API:', error);
    return NextResponse.json(
      { error: `Failed to get PDF recipes: ${error.message}` },
      { status: 500 }
    );
  }
}

// GET handler to get a specific recipe by ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const recipes = await getPDFRecipes();
    const recipe = recipes.find(r => r.id === id);
    return recipe || null;
  } catch (error) {
    console.error(`Error getting recipe ${id}:`, error);
    return null;
  }
} 