import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5, 'pcs'),
    new Ingredient('Tomatoes', 10, 'pcs'),
  ];
  editMode: boolean = false;

  constructor() {}

  addToShoppingList = (ingsToAdd: Ingredient[]) => {
    console.log(ingsToAdd);
    // ingsToAdd.forEach((i) => this.ingredients.push(i));
    this.ingredients.push(...ingsToAdd);
    // this.ingredients.push(ingsToAdd);
  };

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }

  closeEditMode = () => {
    this.editMode = false;
    console.log('CEM()');
  };
}
