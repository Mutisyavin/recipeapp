"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Recipe } from "../../../types/recipe";
import { getRecipesFromPDFs } from "../../../utils/pdfParser";

export default function PDFRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadPDFRecipes() {
      try {
        setLoading(true);
        const pdfRecipes = await getRecipesFromPDFs();
        
        // Add IDs to recipes if they don't have them
        const recipesWithIds = pdfRecipes.map((recipe, index) => ({
          ...recipe,
          id: recipe.id || `pdf-${index + 1}`
        }));
        
        setRecipes(recipesWithIds);
        setError(null);
      } catch (err: any) {
        console.error("Error loading PDF recipes:", err);
        setError(`Failed to load recipes from PDFs: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadPDFRecipes();
  }, []);

  // Filter recipes based on search term and filter
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && recipe.tags.some(tag => tag.toLowerCase() === filter.toLowerCase());
  });

  // Get unique tags for filter options
  const uniqueTags = Array.from(new Set(recipes.flatMap(recipe => recipe.tags)));

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
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/recipes/pdf" className="hover:underline font-bold">PDF Recipes</Link></li>
              <li><Link href="/upload" className="hover:underline">Upload</Link></li>
              <li><Link href="/saved" className="hover:underline">Saved</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-green-600 hover:text-green-800 flex items-center space-x-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">PDF Imported Recipes</h1>
          <p className="text-gray-600 mb-6">Recipes automatically extracted from your PDF cookbook using recipe extraction</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Recipes</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Search by title, description, or tags"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Tag</label>
              <select
                id="filter"
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Tags</option>
                {uniqueTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Recipe List */}
        {!loading && !error && (
          <>
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                    <div className="relative h-48 w-full bg-gray-200">
                      {/* Placeholder for recipe image */}
                      <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-400">
                        {recipe.source && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            From: {recipe.source}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {recipe.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{recipe.prepTime + recipe.cookTime} mins total</span>
                        <Link
                          href={`/recipe/${recipe.id}`}
                          className="text-green-600 hover:text-green-800 font-medium text-sm"
                        >
                          View Recipe →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter, or place a PDF recipe book in the PDF folder.
                </p>
              </div>
            )}
          </>
        )}
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