import { Recipe } from '../recipes/recipe.model';
import { EventEmitter, OnInit } from '@angular/core';
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

  constructor() {
    this.load();
  }

  addRecipe(recipe: Recipe) {
    console.log(recipe);
    const recipeWithID = { ...recipe, id: this.recipes.length + 1 };
    console.log(recipeWithID);
    this.recipes.push(recipeWithID);
    this.updatedRecipes.next(this.recipes.slice());
    this.save();
  }

  updateRecipe = (index: number, newRecipe: Recipe) => {
    this.recipes[this.recipes.findIndex((r) => r.id === index)] = { ...newRecipe, id: index };
    this.updatedRecipes.next(this.recipes.slice());
    this.save();
  };

  getRecipes = () => {
    return [...this.recipes];
  };

  getRecipe = (id) => {
    console.log(id);
    console.log(this.recipes);
    return this.recipes.find((recipe) => recipe.id === id);
  };

  deleteRecipe = (id) => {
    this.recipes.splice(
      this.recipes.findIndex((recipe) => recipe.id === id),
      1
    );
    this.updatedRecipes.next(this.recipes.slice());
    this.save();
  };

  deleteIngredient = (id: number, index: number) => {
    this.recipes[this.recipes.findIndex((recipe) => recipe.id === id)].ingredients.splice(index, 1);
    console.log(this.recipes);
    this.updatedRecipes.next(this.recipes.slice());
    this.save();
  };

  save = () => localStorage.setItem('recipes', JSON.stringify(this.recipes));
  load = () => {
    const lsString = localStorage.getItem('recipes');
    if (!lsString) return;
    const json = JSON.parse(lsString);
    this.recipes = json;
    console.log(json);
  };
}
