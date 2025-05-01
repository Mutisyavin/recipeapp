# PDF Recipe Feature

This application includes a feature to extract recipes from PDF documents. The PDF parsing feature lets you quickly import recipes from digital cookbooks or recipe collections.

## How it Works

1. Place your PDF recipe files in the `PDF` directory
2. The app automatically parses the PDF content and extracts:
   - Recipe titles
   - Ingredients with amounts and units
   - Cooking instructions
   - Preparation and cooking times
   - Servings
   - Tags (cuisine type, meal type, dietary preferences)

## Getting Started

### Accessing PDF Recipes

1. Ensure your PDF files are in the `PDF` directory at the root of the project
2. Start the application with `npm run dev` or use the `start-app.ps1` script
3. Navigate to http://localhost:3000/recipes/pdf in your browser
4. All extracted recipes will be displayed with filtering and search options

### Sample PDF

A sample PDF file named `Recipe-Book_merged.pdf` is automatically created for testing purposes. This file contains:

- Classic Spaghetti Carbonara
- Chocolate Chip Cookies
- Homemade Pizza

### Formatting Tips for Better Extraction

For best results, PDF recipe files should follow these formatting guidelines:

1. Each recipe should have a clear title at the beginning
2. Include "Prep Time", "Cook Time", and "Servings" information
3. Mark ingredients with bullet points or numbers
4. Number the instructions steps
5. Include blank lines between recipes if multiple recipes are in a single file

Example format:
```
Recipe Title
-----------
Prep Time: 15 minutes
Cook Time: 30 minutes
Servings: 4

Ingredients:
- 1 cup ingredient one
- 2 tbsp ingredient two
- etc.

Instructions:
1. First step
2. Second step
3. etc.
```

## Troubleshooting

If your recipes aren't being extracted correctly:

1. Check that your PDF files are in the correct directory
2. Examine the PDF formatting (see formatting tips above)
3. Try refreshing the page after placing new PDFs in the directory
4. Check the browser console for detailed error messages

## Technical Details

- The app uses a text extraction algorithm to parse PDF content
- Unit conversions are performed automatically (US to metric)
- Tags are generated based on recipe content and keywords 