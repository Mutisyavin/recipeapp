const fs = require('fs');
const path = require('path');

// Create PDF directory if it doesn't exist
const rootDir = path.join(__dirname, '..');
const pdfDir = path.join(rootDir, '..', 'PDF');

console.log(`Setting up PDF directory...`);

// Create directory if it doesn't exist
if (!fs.existsSync(pdfDir)) {
  console.log(`Creating PDF directory at: ${pdfDir}`);
  fs.mkdirSync(pdfDir, { recursive: true });
}

// Check if Recipe-Book_merged.pdf exists in the PDF directory
const recipePdfPath = path.join(pdfDir, 'Recipe-Book_merged.pdf');
if (!fs.existsSync(recipePdfPath)) {
  console.log('Creating a simple text file with .pdf extension for testing...');
  
  // Create a basic text file with .pdf extension for testing purposes
  const sampleContent = `
RECIPE BOOK

Classic Spaghetti Carbonara
----------------------------
Prep Time: 10 minutes
Cook Time: 20 minutes
Servings: 4

Ingredients:
- 1 lb spaghetti
- 4 eggs
- 8 oz pancetta or bacon
- 1 cup Parmesan cheese, grated
- 1 tsp black pepper
- 1 tsp salt

Instructions:
1. Bring a large pot of salted water to a boil. Add the spaghetti and cook until al dente.
2. While the pasta is cooking, heat a large skillet over medium heat. Add the pancetta and cook until crisp.
3. In a bowl, whisk together the eggs, Parmesan, and black pepper.
4. Drain the pasta, reserving about 1/2 cup of the pasta water.
5. Working quickly, add the hot pasta to the skillet with the pancetta. Toss to combine.
6. Remove from heat and pour in the egg mixture, tossing constantly.
7. If needed, add a splash of the reserved pasta water to create a creamy sauce.
8. Serve immediately with additional Parmesan and black pepper.

Chocolate Chip Cookies
---------------------
Prep Time: 15 minutes
Cook Time: 10 minutes
Servings: 24

Ingredients:
- 2 1/4 cups all-purpose flour
- 1 cup butter, softened
- 3/4 cup brown sugar
- 3/4 cup white sugar
- 2 large eggs
- 2 tsp vanilla extract
- 1 tsp baking soda
- 1/2 tsp salt
- 2 cups chocolate chips

Instructions:
1. Preheat oven to 375°F.
2. In a large bowl, cream together butter and both sugars until light and fluffy.
3. Beat in eggs one at a time, then stir in vanilla.
4. In a separate bowl, combine flour, baking soda, and salt.
5. Gradually blend the dry ingredients into the wet mixture.
6. Fold in chocolate chips.
7. Drop tablespoon-sized balls of dough onto ungreased baking sheets.
8. Bake for 9-11 minutes or until golden brown.
9. Allow to cool on baking sheet for 2 minutes, then transfer to wire racks.

Homemade Pizza
-------------
Prep Time: 30 minutes
Cook Time: 15 minutes
Servings: 4

Ingredients:
- 1 ball pizza dough
- 1/2 cup tomato sauce
- 2 cups mozzarella cheese, shredded
- 2 tbsp olive oil
- 1/4 cup fresh basil leaves
- Toppings of your choice

Instructions:
1. Preheat oven to 475°F with a pizza stone if you have one.
2. Roll out the pizza dough on a floured surface to your desired thickness.
3. Spread tomato sauce evenly over the dough, leaving a small border for the crust.
4. Sprinkle mozzarella cheese over the sauce.
5. Add your favorite toppings.
6. Drizzle with olive oil.
7. Bake for 12-15 minutes until the crust is golden and cheese is bubbly.
8. Remove from oven, top with fresh basil, and let cool slightly before slicing.
`;

  try {
    fs.writeFileSync(recipePdfPath, sampleContent);
    console.log(`Created sample PDF file at: ${recipePdfPath}`);
  } catch (error) {
    console.error(`Error creating sample PDF file: ${error.message}`);
  }
} else {
  console.log(`Found existing PDF file at: ${recipePdfPath}`);
}

console.log(`PDF directory is set up at: ${pdfDir}`);
console.log("To use the PDF recipe feature:");
console.log("1. Place your PDF recipe books in the PDF directory");
console.log("2. Visit http://localhost:3000/recipes/pdf to see your imported recipes");
console.log("Note: A sample text file with .pdf extension has been created for testing.");
console.log('The LlamaCloud API will be used to extract recipe information from the PDFs.'); 