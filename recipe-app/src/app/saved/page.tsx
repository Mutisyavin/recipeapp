"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data for saved recipes
const savedRecipesData = [
  {
    id: 1,
    title: "Classic Spaghetti Carbonara",
    description: "Creamy Italian pasta dish with eggs, cheese, pancetta, and pepper.",
    time: 30,
    tags: ["Italian", "Pasta", "Dinner"],
    savedAt: "2023-05-12"
  },
  {
    id: 2,
    title: "Avocado Toast with Poached Egg",
    description: "Simple and nutritious breakfast with creamy avocado and perfectly poached eggs.",
    time: 15,
    tags: ["Breakfast", "Vegetarian", "Quick"],
    savedAt: "2023-05-10"
  },
  {
    id: 3,
    title: "Chocolate Chip Cookies",
    description: "Warm, gooey chocolate chip cookies with a soft center and crispy edges.",
    time: 45,
    tags: ["Dessert", "Baking", "Treats"],
    savedAt: "2023-05-08"
  },
  {
    id: 4,
    title: "Thai Green Curry",
    description: "Fragrant and spicy Thai curry with vegetables and your choice of protein.",
    time: 40,
    tags: ["Thai", "Spicy", "Dinner"],
    savedAt: "2023-05-05"
  },
  {
    id: 5,
    title: "Classic Beef Burger",
    description: "Juicy homemade beef burger with all the fixings.",
    time: 35,
    tags: ["American", "Dinner", "Beef"],
    savedAt: "2023-05-01"
  }
];

export default function SavedRecipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter recipes based on search term and filter
  const filteredRecipes = savedRecipesData.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && recipe.tags.some(tag => tag.toLowerCase() === filter.toLowerCase());
  });

  // Get unique tags for filter options
  const uniqueTags = Array.from(new Set(savedRecipesData.flatMap(recipe => recipe.tags)));

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
              <li><Link href="/recipes" className="hover:underline">Recipes</Link></li>
              <li><Link href="/upload" className="hover:underline">Upload</Link></li>
              <li><Link href="/saved" className="hover:underline font-bold">Saved</Link></li>
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
          <h1 className="text-3xl font-bold mb-2">Saved Recipes</h1>
          <p className="text-gray-600 mb-6">Your favorite recipes saved in one place</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-grow mb-4 md:mb-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search your saved recipes..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter recipes by category"
              >
                <option value="all">All Categories</option>
                {uniqueTags.map((tag) => (
                  <option key={tag} value={tag.toLowerCase()}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Saved Recipes List */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="relative h-48 w-full bg-gray-200">
                  {/* Placeholder for recipe image */}
                  <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-400" />
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
                    <span className="text-sm text-gray-500">Saved on {recipe.savedAt}</span>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "You haven't saved any recipes yet. Explore recipes and save your favorites!"}
            </p>
            {(searchTerm || filter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Clear Filters
              </button>
            )}
          </div>
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