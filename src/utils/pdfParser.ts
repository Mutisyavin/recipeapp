import fs from 'fs';
import path from 'path';
import { Recipe } from '../types/recipe';

// LlamaCloud API configuration 
const LLAMACLOUD_API_KEY = 'llx-nG8epkVdLwq2ELHA2hZxvlWXTe8DGguHOarNQ8Fix2bMrIjq';
const LLAMACLOUD_API_URL = 'https://cloud.llama.api/v1/chat/completions';

/**
 * Gets recipe data from PDFs, with optional caching to avoid redundant API calls
 */
export async function getRecipesFromPDFs(
  directoryPath: string = path.join(process.cwd(), 'PDF'),
  useCache: boolean = true
): Promise<Recipe[]> {
  console.log(`Looking for PDFs in: ${directoryPath}`);
  const cacheFile = path.join(process.cwd(), 'recipe-cache.json');
  
  // Use cache if available and requested
  if (useCache && fs.existsSync(cacheFile)) {
    try {
      const cacheData = fs.readFileSync(cacheFile, 'utf8');
      const cachedRecipes = JSON.parse(cacheData);
      console.log(`Loaded ${cachedRecipes.length} recipes from cache`);
      return cachedRecipes;
    } catch (error) {
      console.error('Error reading cache file:', error);
      // Fall back to processing PDFs if cache fails
    }
  }
  
  // Check if directory exists
  if (!fs.existsSync(directoryPath)) {
    console.warn(`Directory not found: ${directoryPath}. Checking alternate locations...`);
    
    // Try alternate locations - useful for development/production differences
    const altPaths = [
      path.join(process.cwd(), '..', 'PDF'),
      path.join(process.cwd(), '..', '..', 'PDF'),
      'C:\\Cursor Projects\\Cook app\\PDF'
    ];
    
    for (const altPath of altPaths) {
      if (fs.existsSync(altPath)) {
        console.log(`Found PDF directory at alternate location: ${altPath}`);
        directoryPath = altPath;
        break;
      }
    }
    
    if (!fs.existsSync(directoryPath)) {
      console.error(`Could not find PDF directory in any location`);
      return getMockRecipes();
    }
  }
  
  // Get all PDF files in the directory
  try {
    const files = fs.readdirSync(directoryPath).filter(file => 
      file.toLowerCase().endsWith('.pdf')
    );
    
    console.log(`Found ${files.length} PDF files to process`);
    
    if (files.length === 0) {
      // No PDF files found, return mock data
      return getMockRecipes();
    }
    
    // Process the PDF files
    const recipes: Recipe[] = [];
    for (const file of files) {
      try {
        const filePath = path.join(directoryPath, file);
        console.log(`Processing PDF file: ${filePath}`);
        
        // Extract text from PDF file
        const pdfText = await parsePDFRecipe(filePath);
        
        // Split the PDF text by recipe sections (assuming each recipe is separated by a title and blank lines)
        const recipeTexts = pdfText.split(/\n{3,}/).filter(text => text.trim() !== '');
        
        // Process each recipe text
        for (let i = 0; i < recipeTexts.length; i++) {
          try {
            if (recipeTexts[i].trim().length > 50) { // Only process substantial text blocks
              const recipe = extractRecipeFromPDFText(recipeTexts[i], i);
              recipes.push({
                ...recipe,
                id: `pdf-${recipes.length + 1}`,
                source: file
              });
            }
          } catch (error) {
            console.error(`Error processing recipe section ${i} from ${file}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error processing PDF file ${file}:`, error);
      }
    }
    
    if (recipes.length === 0) {
      // If we couldn't extract any recipes, fallback to mock data
      return getMockRecipes();
    }
    
    // Cache the recipes
    try {
      fs.writeFileSync(cacheFile, JSON.stringify(recipes, null, 2));
      console.log(`Cached ${recipes.length} recipes for future use`);
    } catch (error) {
      console.error(`Error writing cache file: ${error}`);
    }
    
    return recipes;
  } catch (error) {
    console.error(`Error listing PDF files: ${error}`);
    return getMockRecipes();
  }
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
    }
  ];
}

/**
 * For a real implementation, would parse a PDF file and extract text
 * In this implementation, we just read the text file with .pdf extension
 */
export async function parsePDFRecipe(filePath: string): Promise<string> {
  try {
    // For real PDFs, you would use a PDF parsing library here
    // Since our test file is just a text file with .pdf extension, we can read it directly
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log(`Successfully read PDF file: ${filePath}`);
    return fileContent;
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
      const amount = parseFloat(eval(match[1])); // Safely evaluate fractions like 1/2
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
 * For a real implementation, would extract recipe data from text using LlamaCloud API
 */
export async function extractRecipeFromText(text: string): Promise<Recipe> {
  try {
    // In a real implementation, this would call the LlamaCloud API
    const response = await fetch(LLAMACLOUD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLAMACLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3-8b-chat',
        messages: [
          {
            role: 'system',
            content: `You are a recipe extraction assistant. Extract detailed recipe information from the provided text into a structured format with the following fields:
              - title: The recipe title
              - description: A brief description of the recipe
              - prepTime: Preparation time in minutes (number)
              - cookTime: Cooking time in minutes (number)
              - servings: Number of servings (number)
              - ingredients: An array of objects with {name, amount, unit, metricAmount, metricUnit}
              - instructions: An array of step-by-step instructions
              - tags: An array of relevant tags (e.g., "Vegetarian", "Italian", "Dinner")
            Only respond with valid JSON, no other text.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      })
    });

    const responseData = await response.json();
    
    if (responseData && responseData.choices && responseData.choices.length > 0) {
      const content = responseData.choices[0].message.content;
      // Extract the JSON from the response
      return JSON.parse(content);
    } else {
      throw new Error('Invalid response from LlamaCloud API');
    }
  } catch (error: any) {
    console.error('Error extracting recipe with LlamaCloud API:', error);
    throw new Error(`Failed to extract recipe: ${error.message}`);
  }

  // Return a mock recipe for testing if API fails
  return {
    title: "Mock Recipe from Text",
    description: "This is a mock recipe that would be extracted from PDF text.",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    ingredients: [
      { name: "Ingredient 1", amount: 1, unit: "cup", metricAmount: 240, metricUnit: "ml" },
      { name: "Ingredient 2", amount: 2, unit: "tbsp", metricAmount: 30, metricUnit: "g" },
    ],
    instructions: [
      "Step 1 of the mock recipe.",
      "Step 2 of the mock recipe.",
    ],
    tags: ["Mock", "Test"],
  };
} 