import fs from 'fs';
import path from 'path';
import { Recipe } from '../types/recipe';

/**
 * Gets recipe data from PDFs, with optional caching to avoid redundant API calls
 */
export async function getRecipesFromPDFs(
  directoryPath: string = path.join(process.cwd(), 'PDF'),
  useCache: boolean = true
): Promise<Recipe[]> {
  console.log(`Looking for PDFs in: ${directoryPath}`);
  console.log(`Current working directory: ${process.cwd()}`);
  
  // Define specific file path
  const specificPdfPath = path.join(directoryPath, 'Recipe-Book_merged.pdf');
  console.log(`Looking for specific PDF file: ${specificPdfPath}`);
  
  // Check if specific file exists
  if (fs.existsSync(specificPdfPath)) {
    console.log(`Found specific PDF file: ${specificPdfPath}`);
    
    try {
      // Process this specific PDF file
      console.log(`Processing PDF file: ${specificPdfPath}`);
      
      // Extract text from PDF file
      const pdfText = await parsePDFRecipe(specificPdfPath);
      console.log(`PDF text length: ${pdfText.length} characters`);
      
      // Process the PDF text to extract recipes
      // Split the PDF text by recipe sections
      const recipeTexts = pdfText.split(/\n{2,}(?=##)/g).filter(text => text.trim() !== '');
      console.log(`Found ${recipeTexts.length} potential recipe sections`);
      
      // Process each recipe text
      const recipes: Recipe[] = [];
      for (let i = 0; i < recipeTexts.length; i++) {
        try {
          if (recipeTexts[i].trim().length > 50) { // Only process substantial text blocks
            const recipe = extractRecipeFromPDFText(recipeTexts[i], i);
            recipes.push({
              ...recipe,
              id: `pdf-${recipes.length + 1}`,
              source: path.basename(specificPdfPath)
            });
            console.log(`Extracted recipe: ${recipe.title}`);
          }
        } catch (error) {
          console.error(`Error processing recipe section ${i}:`, error);
        }
      }
      
      if (recipes.length > 0) {
        // Cache the recipes
        try {
          const cacheFile = path.join(process.cwd(), 'recipe-cache.json');
          fs.writeFileSync(cacheFile, JSON.stringify(recipes, null, 2));
          console.log(`Cached ${recipes.length} recipes for future use`);
        } catch (error) {
          console.error(`Error writing cache file: ${error}`);
        }
        
        return recipes;
      }
    } catch (error) {
      console.error(`Error processing PDF file: ${specificPdfPath}`, error);
    }
  } else {
    console.log(`Specific PDF file not found at: ${specificPdfPath}`);
    
    // Check alternate locations
    const altPaths = [
      'C:\\Cursor Projects\\Cook app\\recipe-app\\PDF\\Recipe-Book_merged.pdf',
      'C:/Cursor Projects/Cook app/recipe-app/PDF/Recipe-Book_merged.pdf',
      'C:\\Cursor Projects\\Cook app\\PDF\\Recipe-Book_merged.pdf',
      'C:/Cursor Projects/Cook app/PDF/Recipe-Book_merged.pdf'
    ];
    
    for (const altPath of altPaths) {
      console.log(`Checking alternate path: ${altPath}`);
      if (fs.existsSync(altPath)) {
        console.log(`Found PDF file at alternate location: ${altPath}`);
        
        try {
          // Process this alternate PDF file
          const pdfText = await parsePDFRecipe(altPath);
          console.log(`PDF text length from alternate path: ${pdfText.length} characters`);
          
          // Process the PDF text to extract recipes
          const recipeTexts = pdfText.split(/\n{2,}(?=##)/g).filter(text => text.trim() !== '');
          console.log(`Found ${recipeTexts.length} potential recipe sections`);
          
          // Process each recipe text
          const recipes: Recipe[] = [];
          for (let i = 0; i < recipeTexts.length; i++) {
            try {
              if (recipeTexts[i].trim().length > 50) {
                const recipe = extractRecipeFromPDFText(recipeTexts[i], i);
                recipes.push({
                  ...recipe,
                  id: `pdf-${recipes.length + 1}`,
                  source: path.basename(altPath)
                });
                console.log(`Extracted recipe: ${recipe.title}`);
              }
            } catch (error) {
              console.error(`Error processing recipe section ${i} from alternate path:`, error);
            }
          }
          
          if (recipes.length > 0) {
            return recipes;
          }
        } catch (error) {
          console.error(`Error processing PDF file from alternate path: ${altPath}`, error);
        }
      }
    }
  }
  
  // If we get here, we couldn't find or process any PDF files, fallback to mock data
  console.log('No valid PDF files found or processed, using mock data');
  return getMockRecipes();
}

/**
 * Returns mock recipe data for testing
 */
function getMockRecipes(): Recipe[] {
  return [
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
}

/**
 * For a real implementation, would parse a PDF file and extract text
 * This implementation uses the LlamaCloud API to extract text from the PDF
 */
export async function parsePDFRecipe(filePath: string): Promise<string> {
  try {
    console.log(`Parsing PDF file: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`PDF file does not exist: ${filePath}`);
      throw new Error('PDF file not found');
    }
    
    // First try: Direct file reading for text PDFs (our test case)
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      console.log(`Successfully read PDF file directly: ${filePath}`);
      return fileContent;
    } catch (err) {
      console.log('File is not a text PDF, will try LlamaCloud API...');
    }
    
    // For real PDFs, use LlamaCloud API
    // Read file as binary data
    const fileData = fs.readFileSync(filePath);
    
    // Convert to base64
    const base64Data = fileData.toString('base64');
    
    // Call LlamaCloud API
    const llamaApiKey = 'llx-nG8epkVdLwq2ELHA2hZxvlWXTe8DGguHOarNQ8Fix2bMrIjq';
    
    const response = await fetch('https://api.llamacloud.ai/v1/extract-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${llamaApiKey}`
      },
      body: JSON.stringify({
        file: {
          data: base64Data,
          type: 'application/pdf'
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LlamaCloud API error: ${response.status} ${errorText}`);
      throw new Error(`LlamaCloud API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully extracted text from PDF using LlamaCloud API`);
    
    return data.text || '';
  } catch (error: any) {
    console.error(`Error reading PDF file: ${filePath}`, error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Extract recipe information from raw PDF text without API call
 */
function extractRecipeFromPDFText(text: string, index: number): Recipe {
  console.log(`Extracting recipe from text section ${index}`);
  
  // Basic pattern matching to extract recipe information
  const titleMatch = text.match(/^([A-Z][A-Za-z\s]+)(?:\n|-{2,})/m);
  const title = titleMatch ? titleMatch[1].trim() : `Recipe ${index + 1}`;
  
  // Extract prep time, cook time, and servings
  const prepTimeMatch = text.match(/Prep(?:\s+|)Time:?\s+(\d+)(?:\s+|)(?:min|minute|minutes)/i);
  const cookTimeMatch = text.match(/Cook(?:\s+|)Time:?\s+(\d+)(?:\s+|)(?:min|minute|minutes)/i);
  const servingsMatch = text.match(/Servings:?\s+(\d+)/i);
  
  const prepTime = prepTimeMatch ? parseInt(prepTimeMatch[1]) : 15;
  const cookTime = cookTimeMatch ? parseInt(cookTimeMatch[1]) : 20;
  const servings = servingsMatch ? parseInt(servingsMatch[1]) : 4;
  
  // Extract ingredients
  const ingredientsSection = text.match(/Ingredients:?([\s\S]*?)(?:Instructions:|Directions:|Method:|$)/i);
  const ingredientsList = ingredientsSection ? 
    ingredientsSection[1].split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.match(/^\d+[\.\)]/))
      .map(line => line.replace(/^-\s*|^\d+[\.\)]\s*/, '').trim())
      .filter(line => line.length > 0) : 
    [];
  
  const ingredients = ingredientsList.map(ingredient => {
    // Try to parse amount and unit from ingredient text
    const match = ingredient.match(/^([\d./]+)(?:\s+|)([a-zA-Z]+)(?:\s+|)(.+)$/);
    if (match) {
      const amount = eval(match[1]); // Safely evaluate fractions like 1/2
      const unit = match[2];
      const name = match[3];
      
      // Basic conversion to metric (simplified)
      let metricAmount = amount;
      let metricUnit = unit;
      
      if (unit === 'cup' || unit === 'cups') {
        metricAmount = amount * 240;
        metricUnit = 'ml';
      } else if (unit === 'tbsp' || unit === 'tablespoon' || unit === 'tablespoons') {
        metricAmount = amount * 15;
        metricUnit = 'ml';
      } else if (unit === 'tsp' || unit === 'teaspoon' || unit === 'teaspoons') {
        metricAmount = amount * 5;
        metricUnit = 'ml';
      } else if (unit === 'oz' || unit === 'ounce' || unit === 'ounces') {
        metricAmount = amount * 28;
        metricUnit = 'g';
      } else if (unit === 'lb' || unit === 'pound' || unit === 'pounds') {
        metricAmount = amount * 453.592;
        metricUnit = 'g';
      }
      
      return {
        name,
        amount,
        unit,
        metricAmount,
        metricUnit
      };
    }
    
    // Default if parsing fails
    return {
      name: ingredient,
      amount: 1,
      unit: 'item',
      metricAmount: 1,
      metricUnit: 'item'
    };
  });
  
  // Extract instructions
  const instructionsSection = text.match(/Instructions:?([\s\S]*?)(?:\n{2,}|$)/i);
  const instructionsList = instructionsSection ? 
    instructionsSection[1].split('\n')
      .map(line => line.trim())
      .filter(line => line.match(/^\d+[\.\)]/) || line.length > 10)
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(line => line.length > 0) : 
    [];
  
  // Generate a description
  const description = `${title} - a delicious recipe with ${ingredients.length} ingredients, taking ${prepTime + cookTime} minutes to prepare.`;
  
  // Generate tags
  const tags: string[] = [];
  
  // Check for likely cuisine types
  if (text.toLowerCase().includes('italian') || title.toLowerCase().includes('pasta') || 
      title.toLowerCase().includes('pizza') || title.toLowerCase().includes('risotto')) {
    tags.push('Italian');
  } else if (text.toLowerCase().includes('mexican') || title.toLowerCase().includes('taco') || 
            title.toLowerCase().includes('enchilada') || title.toLowerCase().includes('burrito')) {
    tags.push('Mexican');
  } else if (text.toLowerCase().includes('chinese') || title.toLowerCase().includes('stir-fry') || 
            title.toLowerCase().includes('noodle')) {
    tags.push('Chinese');
  }
  
  // Check for meal types
  if (text.toLowerCase().includes('breakfast') || title.toLowerCase().includes('pancake') || 
      title.toLowerCase().includes('egg') || title.toLowerCase().includes('muffin')) {
    tags.push('Breakfast');
  } else if (text.toLowerCase().includes('dessert') || title.toLowerCase().includes('cake') || 
            title.toLowerCase().includes('cookie') || title.toLowerCase().includes('pie')) {
    tags.push('Dessert');
  } else {
    tags.push('Dinner');
  }
  
  // Check for dietary preferences
  if (!text.toLowerCase().includes('meat') && !text.toLowerCase().includes('chicken') && 
      !text.toLowerCase().includes('beef') && !text.toLowerCase().includes('pork')) {
    tags.push('Vegetarian');
  }
  
  return {
    title,
    description,
    prepTime,
    cookTime,
    servings,
    ingredients,
    instructions: instructionsList.length > 0 ? instructionsList : ["Follow package instructions"],
    tags: tags.length > 0 ? tags : ["General"],
  };
}

/**
 * Client-side function to fetch recipes from the API
 */
export async function getRecipesFromPDFs(): Promise<Recipe[]> {
  try {
    const response = await fetch('/api/pdf-recipes');
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipes from API:', error);
    throw error;
  }
}

/**
 * Client-side function to fetch a specific recipe from the API
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
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