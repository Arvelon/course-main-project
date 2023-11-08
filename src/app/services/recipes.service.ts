import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable()
export class RecipesService {
  private recipes: Recipe[] = [];
  selectedRecipe = new Subject<Recipe>();
  updatedRecipes = new Subject<Recipe[]>();
  apiUrl: string = 'https://private-project-jonas-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
  constructor(private dataService: DataService, private http: HttpClient) {
    this.load();
  }
  addRecipe(recipe: Recipe) {
    const recipeWithID = { ...recipe, id: this.recipes.length + 1 };
    this.recipes.push(recipeWithID);
    this.updatedRecipes.next(this.recipes.slice());
    this.save();
    this.http.post(this.apiUrl, recipe).subscribe(
      (data) => console.log(data),
      (err) => console.log(err)
    );
  }
  updateRecipe = (index: number, newRecipe: Recipe) => {
    this.recipes[this.recipes.findIndex((r) => r.id === index)] = { ...newRecipe, id: index };
    this.updatedRecipes.next(this.recipes.slice());
    this.save();
  };
  getRecipes = () => {
    return this.http.get<{ [key: string]: Recipe }>(this.apiUrl).pipe(
      map((responseData) => {
        const postsArray: Recipe[] = [];
        for (const key in responseData) {
          postsArray.push({
            ...responseData[key],
            id: key,
            ingredients: responseData[key].ingredients ? responseData[key].ingredients : [],
          });
        }
        this.recipes = postsArray;
        return postsArray;
      })
    );
    // return [...this.recipes];
  };
  getRecipe = (id: string) => {
    if (!this.recipes.length) return;
    this.recipes.forEach((recipes) => console.log(recipes.id));
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
    this.updatedRecipes.next(this.recipes.slice());
    this.save();
  };
  save = () => localStorage.setItem('recipes', JSON.stringify(this.recipes));
  load = () => {
    const lsString = localStorage.getItem('recipes');
    if (!lsString) return;
    const json = JSON.parse(lsString);
    this.recipes = json;
  };
}
