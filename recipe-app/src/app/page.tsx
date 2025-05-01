import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 className="text-2xl font-bold">Recipe App</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/recipes" className="hover:underline">Recipes</Link></li>
              <li><Link href="/recipes/pdf" className="hover:underline">PDF Recipes</Link></li>
              <li><Link href="/upload" className="hover:underline">Upload</Link></li>
              <li><Link href="/saved" className="hover:underline">Saved</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-80 w-full">
              <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h2 className="text-3xl font-bold mb-4">Discover Amazing Recipes</h2>
                  <p className="text-xl mb-6">Upload, save, and share your favorite dishes</p>
                  <Link 
                    href="/recipes" 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
                  >
                    Explore Recipes
                  </Link>
                </div>
              </div>
              <div className="absolute inset-0">
                {/* Placeholder for hero image */}
                <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500" />
              </div>
            </div>
          </div>
        </section>

        {/* PDF Recipe Feature */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-4">Import Recipes from PDFs</h2>
                <p className="text-gray-600 mb-6">
                  Automatically extract your favorite recipes from PDF cookbooks and magazines. 
                  Just place your PDFs in the app's PDF directory and we'll do the rest!
                </p>
                <div>
                  <Link 
                    href="/recipes/pdf" 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    View PDF Recipes
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-green-200 p-8 flex items-center justify-center">
                <div className="transform rotate-3 bg-white p-4 shadow-lg rounded">
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-bold">Recipe-Book_merged.pdf</p>
                    <p className="text-sm text-gray-500">Your digital cookbook</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                href={`/category/${category.slug}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300"
              >
                <div className="p-4 text-center">
                  <span className="text-2xl mb-2 block">{category.icon}</span>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Recipes */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="relative h-48 w-full bg-gray-200">
                  {/* Placeholder for recipe image */}
                  <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{recipe.time} mins</span>
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
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
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

// Mock data
const categories = [
  { name: "Breakfast", icon: "🍳", slug: "breakfast" },
  { name: "Lunch", icon: "🥪", slug: "lunch" },
  { name: "Dinner", icon: "🍲", slug: "dinner" },
  { name: "Desserts", icon: "🍰", slug: "desserts" },
  { name: "Vegetarian", icon: "🥗", slug: "vegetarian" },
  { name: "Vegan", icon: "🌱", slug: "vegan" },
  { name: "Gluten-Free", icon: "🌾", slug: "gluten-free" },
  { name: "Quick Meals", icon: "⏱️", slug: "quick-meals" },
];

const featuredRecipes = [
  {
    id: 1,
    title: "Classic Spaghetti Carbonara",
    description: "Creamy Italian pasta dish with eggs, cheese, pancetta, and pepper.",
    time: 30,
  },
  {
    id: 2,
    title: "Avocado Toast with Poached Egg",
    description: "Simple and nutritious breakfast with creamy avocado and perfectly poached eggs.",
    time: 15,
  },
  {
    id: 3,
    title: "Chocolate Chip Cookies",
    description: "Warm, gooey chocolate chip cookies with a soft center and crispy edges.",
    time: 45,
  },
];
