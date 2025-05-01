"use client";

import { useState } from "react";
import Link from "next/link";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  metricAmount: string;
  metricUnit: string;
}

interface Step {
  instruction: string;
}

export default function UploadRecipe() {
  const [recipeForm, setRecipeForm] = useState({
    title: "",
    description: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    category: "",
    cuisine: "",
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "", unit: "", metricAmount: "", metricUnit: "" },
  ]);

  const [steps, setSteps] = useState<Step[]>([{ instruction: "" }]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecipeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "", metricAmount: "", metricUnit: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].instruction = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, { instruction: "" }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to a server
    console.log({
      ...recipeForm,
      ingredients,
      steps,
      tags,
    });
    alert("Recipe submitted successfully! (In a real app, this would save to a database)");
  };

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
              <li><Link href="/upload" className="hover:underline font-bold">Upload</Link></li>
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
          <h1 className="text-3xl font-bold mb-2">Upload a New Recipe</h1>
          <p className="text-gray-600 mb-6">Share your culinary creations with the world</p>
        </div>

        {/* Recipe Upload Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit}>
            {/* Basic Recipe Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={recipeForm.title}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter recipe title"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={recipeForm.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your recipe in a few sentences"
                />
              </div>

              <div>
                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Prep Time (minutes)*
                </label>
                <input
                  type="number"
                  id="prepTime"
                  name="prepTime"
                  required
                  min="0"
                  value={recipeForm.prepTime}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Cook Time (minutes)*
                </label>
                <input
                  type="number"
                  id="cookTime"
                  name="cookTime"
                  required
                  min="0"
                  value={recipeForm.cookTime}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
                  Servings*
                </label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  required
                  min="1"
                  value={recipeForm.servings}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={recipeForm.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="appetizer">Appetizer</option>
                  <option value="dessert">Dessert</option>
                  <option value="snack">Snack</option>
                  <option value="drink">Drink</option>
                </select>
              </div>

              <div>
                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine
                </label>
                <select
                  id="cuisine"
                  name="cuisine"
                  value={recipeForm.cuisine}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a cuisine</option>
                  <option value="african">African</option>
                  <option value="asian">Asian</option>
                  <option value="european">European</option>
                  <option value="middle-eastern">Middle Eastern</option>
                  <option value="latin-american">Latin American</option>
                  <option value="north-american">North American</option>
                  <option value="oceanic">Oceanic</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="recipe-image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 mb-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 2MB)</p>
                    </div>
                    <input id="recipe-image" type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-green-400 hover:text-green-700"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add a tag (e.g., Vegetarian, Gluten-Free)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 transition duration-300"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Ingredients</h2>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div className="md:col-span-3">
                      <label htmlFor={`ingredient-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Ingredient Name*
                      </label>
                      <input
                        type="text"
                        id={`ingredient-name-${index}`}
                        required
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Flour, Sugar, Eggs"
                      />
                    </div>

                    <div>
                      <label htmlFor={`amount-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        US Amount*
                      </label>
                      <input
                        type="text"
                        id={`amount-${index}`}
                        required
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., 2, 1/2"
                      />
                    </div>

                    <div>
                      <label htmlFor={`unit-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        US Unit*
                      </label>
                      <input
                        type="text"
                        id={`unit-${index}`}
                        required
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., cup, tbsp, oz"
                      />
                    </div>

                    <div className="flex items-center justify-end md:col-span-1">
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove ingredient"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div>
                      <label htmlFor={`metric-amount-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Metric Amount*
                      </label>
                      <input
                        type="text"
                        id={`metric-amount-${index}`}
                        required
                        value={ingredient.metricAmount}
                        onChange={(e) => handleIngredientChange(index, "metricAmount", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., 240, 15"
                      />
                    </div>

                    <div>
                      <label htmlFor={`metric-unit-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Metric Unit*
                      </label>
                      <input
                        type="text"
                        id={`metric-unit-${index}`}
                        required
                        value={ingredient.metricUnit}
                        onChange={(e) => handleIngredientChange(index, "metricUnit", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., g, ml, kg"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Ingredient
              </button>
            </div>

            {/* Instructions Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Instructions</h2>
              {steps.map((step, index) => (
                <div key={index} className="mb-4">
                  <label htmlFor={`step-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Step {index + 1}*
                  </label>
                  <div className="flex space-x-2">
                    <textarea
                      id={`step-${index}`}
                      required
                      value={step.instruction}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      rows={2}
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe this step of the recipe"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-500 hover:text-red-700 self-start p-2"
                      aria-label="Remove step"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Step
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-300"
              >
                Upload Recipe
              </button>
            </div>
          </form>
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