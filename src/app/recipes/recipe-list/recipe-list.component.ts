import { Component, OnInit, OnDestroy } from '@angular/core';

import { Recipe } from '../recipe.model';
import { RecipesService } from '../../services/recipes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscribtion: Subscription;

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.recipesService.getRecipes().subscribe((recipes) => (this.recipes = recipes));
    this.subscribtion = this.recipesService.updatedRecipes.subscribe(
      (recipeList: Recipe[]) => (this.recipes = recipeList)
    );
  }

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }
}
