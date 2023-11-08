import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipesService } from 'src/app/services/recipes.service';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: string;
  recipe: Recipe;
  editMode: boolean = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private recipeService: RecipesService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.recipe = this.recipeService.getRecipe(params.id);
      this.id = params.id;
      this.editMode = params.id != null;
      this.initForm();
    });
    this.recipeService.updatedRecipes.subscribe(
      (recipeList: Recipe[]) => (this.recipe = recipeList.find((recipe) => recipe.id === this.id))
    );
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
        unit: new FormControl(null, Validators.required),
      })
    );
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients: FormArray = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      recipeImagePath = recipe.imagePath;

      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
              unit: new FormControl(ingredient.unit, Validators.required),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      ingredients: recipeIngredients,
    });

    const data = this.recipeForm.get('ingredients') as FormArray;
  }

  onSave() {
    if (this.editMode) {
      // Update
      console.log('onSave', this.recipeForm.value);
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value); // COVER
    } else {
      // Create
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onCancel = () => this.router.navigate(['../'], { relativeTo: this.route });

  onDelete = () => this.recipeService.deleteRecipe(this.id);

  onDeleteIngredient = (index: number) => {
    // this.recipeService.deleteIngredient(this.id, index); // COVER
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  };
}
