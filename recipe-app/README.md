# Recipe App

A modern recipe application that allows users to upload, view, and share recipes with a clean interface and useful features.

## Features

- **Recipe Browsing**: Browse recipes by category, cuisine type, or search for specific dishes
- **Recipe Detail View**: View detailed recipe information including ingredients and step-by-step instructions
- **Measurement Converter**: Toggle between US (cups, tbsp) and metric (grams, ml) measurements
- **Recipe Upload**: Add your own recipes with images, ingredients, and instructions
- **Recipe Saving**: Save your favorite recipes to easily find them later
- **Sharing Options**: Share recipes via social media, email, or messaging
- **Extract Recipes from PDF**: Extract recipes from PDF cookbooks

## PDF Recipe Feature

This app includes a special feature to extract recipes from PDF files:

1. Place your PDF recipe books in the `PDF` directory at the root of the project
2. The app will automatically extract recipe information
3. View your PDF recipes at http://localhost:3000/recipes/pdf

A sample PDF file is created automatically when you run the app for testing purposes.

## Technology Stack

- **Framework**: Next.js 15 (React)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd recipe-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
recipe-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Home page
│   │   ├── layout.tsx       # Root layout
│   │   ├── recipe/[id]/     # Recipe detail page
│   │   ├── upload/          # Recipe upload page
│   │   └── saved/           # Saved recipes page
│   └── components/          # Reusable components
├── public/                  # Static assets
└── README.md                # Project documentation
```

## Future Enhancements

- User authentication and profiles
- Comments and ratings on recipes
- Recipe collections and organization
- Nutritional information calculation
- Text-to-audio recipe instructions
- Mobile app versions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Recipe images and data are placeholders and would be replaced with real content in a production environment
- Icons from Heroicons
- PDF processing via LlamaCloud API
