import { NextRequest, NextResponse } from 'next/server';
import { mockRecipes, getRecipeById } from '../route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get the recipe using the getRecipeById function from the parent route
    const recipe = await getRecipeById(id);
    
    if (recipe) {
      return NextResponse.json(recipe, { status: 200 });
    } else {
      return NextResponse.json(
        { error: `Recipe with ID ${id} not found` },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error(`Error fetching recipe: ${error.message}`);
    return NextResponse.json(
      { error: `Failed to fetch recipe: ${error.message}` },
      { status: 500 }
    );
  }
} 