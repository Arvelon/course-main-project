import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  ingredients: Ingredient[] = [new Ingredient('Apples', 5, 'pcs'), new Ingredient('Tomatoes', 10, 'pcs')];
  editMode: boolean = false;
  startedEditing = new Subject<number>();
  ingredientsChanged = new Subject<Ingredient[]>();

  constructor() {}

  addToShoppingList = (ingsToAdd: Ingredient[]) => {
    console.log(ingsToAdd);
    this.ingredients.push(...ingsToAdd);
  };

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }

  updateIngredient = (index: number, newIngredient: Ingredient) => {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  };

  deleteIngredient = (index: number) => {
    this.ingredients.splice(index, 1);
  };

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  closeEditMode = () => {
    this.editMode = false;
  };
}
