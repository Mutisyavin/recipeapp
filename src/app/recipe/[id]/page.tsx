"use client";

import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";
import { Recipe } from "../../../types/recipe";
import { getRecipesFromPDFs } from "../../../utils/pdfParser";

// This would come from a database in a real app
const getRecipe = async (id: string): Promise<Recipe> => {
  // Check if it's a PDF recipe
  if (id.startsWith('pdf-')) {
    try {
      const pdfRecipes = await getRecipesFromPDFs();
      
      // Look for a recipe with matching ID
      const recipe = pdfRecipes.find(r => r.id === id);
      
      if (recipe) {
        return recipe;
      }
      
      // If no direct ID match, try to infer by index
      const index = parseInt(id.replace('pdf-', '')) - 1;
      if (index >= 0 && index < pdfRecipes.length) {
        return {
          ...pdfRecipes[index],
          id
        };
      }
      
      console.log(`PDF recipe with ID ${id} not found in ${pdfRecipes.length} recipes`);
    } catch (error) {
      console.error("Error fetching PDF recipe:", error);
    }
  }

  // Fallback to hardcoded recipe if not a PDF recipe or PDF recipe not found
  return {
    id: parseInt(id),
    title: "Classic Spaghetti Carbonara",
    description: "Creamy Italian pasta dish with eggs, cheese, pancetta, and pepper.",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    image: "/carbonara.jpg", // This would be a real image in production
    ingredients: [
      { name: "Spaghetti", amount: 1, unit: "lb", metricAmount: 450, metricUnit: "g" },
      { name: "Eggs", amount: 4, unit: "whole", metricAmount: 4, metricUnit: "whole" },
      { name: "Pancetta or Bacon", amount: 8, unit: "oz", metricAmount: 225, metricUnit: "g" },
      { name: "Parmesan Cheese", amount: 1, unit: "cup", metricAmount: 100, metricUnit: "g" },
      { name: "Black Pepper", amount: 1, unit: "tsp", metricAmount: 5, metricUnit: "ml" },
      { name: "Salt", amount: 1, unit: "tsp", metricAmount: 5, metricUnit: "g" },
    ],
    instructions: [
      "Bring a large pot of salted water to a boil. Add the spaghetti and cook until al dente, about 8-10 minutes.",
      "While the pasta is cooking, heat a large skillet over medium heat. Add the pancetta or bacon and cook until crisp, about 5 minutes.",
      "In a bowl, whisk together the eggs, grated Parmesan, and black pepper.",
      "Drain the pasta, reserving about 1/2 cup of the pasta water.",
      "Working quickly, add the hot pasta to the skillet with the pancetta. Toss to combine.",
      "Remove the skillet from the heat and pour in the egg mixture, tossing constantly. The residual heat will cook the eggs gently.",
      "If needed, add a splash of the reserved pasta water to create a creamy sauce.",
      "Serve immediately, topped with additional grated Parmesan and freshly ground black pepper.",
    ],
    tags: ["Italian", "Pasta", "Dinner", "Main Course"],
    author: "Chef Mario",
    createdAt: "2023-04-15",
  };
};

export default function RecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [usesMetric, setUsesMetric] = useState(false);

  useEffect(() => {
    async function loadRecipe() {
      try {
        setLoading(true);
        const recipeData = await getRecipe(params.id);
        setRecipe(recipeData);
      } catch (err) {
        console.error("Error loading recipe:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">Recipe Not Found</h3>
          <p className="text-red-600 mb-4">We couldn't find the recipe you're looking for.</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h1 className="text-2xl font-bold">Recipe App</h1>
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/recipes/pdf" className="hover:underline">PDF Recipes</Link></li>
              <li><Link href="/upload" className="hover:underline">Upload</Link></li>
              <li><Link href="/saved" className="hover:underline">Saved</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Recipe Header */}
        <div className="mb-8">
          <Link href="/" className="text-green-600 hover:text-green-800 flex items-center space-x-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-600 mb-4">{recipe.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.map(tag => (
              <span key={tag} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex space-x-4 text-sm text-gray-600">
            <span>Prep: {recipe.prepTime} mins</span>
            <span>Cook: {recipe.cookTime} mins</span>
            <span>Servings: {recipe.servings}</span>
            {recipe.author && <span>By: {recipe.author}</span>}
            {recipe.source && <span>From PDF: {recipe.source}</span>}
          </div>
        </div>

        {/* Recipe Image */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <div className="w-full h-80 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-lg" />
        </div>

        {/* Measurement Toggle */}
        <div className="mb-8 flex justify-end">
          <div className="bg-white rounded-full shadow-sm inline-flex p-1">
            <button
              onClick={() => setUsesMetric(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                !usesMetric ? "bg-green-600 text-white" : "text-gray-700"
              }`}
            >
              US
            </button>
            <button
              onClick={() => setUsesMetric(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                usesMetric ? "bg-green-600 text-white" : "text-gray-700"
              }`}
            >
              Metric
            </button>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>
                      {usesMetric
                        ? `${ingredient.metricAmount} ${ingredient.metricUnit} ${ingredient.name}`
                        : `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Sharing and Saving */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-medium mb-2">Share this recipe</h3>
            <div className="flex space-x-4">
              <button 
                className="p-2 bg-blue-600 text-white rounded-full"
                aria-label="Share to social media"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button 
                className="p-2 bg-green-500 text-white rounded-full"
                aria-label="Share via email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button 
                className="p-2 bg-blue-400 text-white rounded-full"
                aria-label="Share via messaging"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>Save Recipe</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Recipe App</h2>
              <p className="text-gray-400">Upload, save, and share your favorite recipes</p>
            </div>
            <div>
              <p className="text-gray-400">© {new Date().getFullYear()} Recipe App. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 