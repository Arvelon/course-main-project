import { Recipe } from '../recipes/recipe.model';
import { EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class RecipesService {
  private recipes: Recipe[] = [
    new Recipe(
      1,
      'A Test Recipe',
      'This is simply a test',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [new Ingredient('Bulgur', 200, 'g'), new Ingredient('Cream', 50, 'ml')]
    ),
    new Recipe(
      86,
      'Another Test Recipe',
      'This is simply a test',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [new Ingredient('Parmesan cheese', 30, 'g'), new Ingredient('Ricotta', 250, 'g')]
    ),
  ];
  selectedRecipe = new Subject<Recipe>();
  updatedRecipes = new Subject<Recipe[]>();

  constructor() {}

  updateRecipe = (index: number, newRecipe: Recipe) => {
    this.recipes[index] = newRecipe;
    this.updatedRecipes.next(this.recipes.slice());
  };

  getRecipes = () => {
    return [...this.recipes];
  };

  getRecipe = (id) => {
    return this.recipes.find((recipe) => recipe.id === id);
  };
}
