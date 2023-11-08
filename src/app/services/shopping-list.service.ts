import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class ShoppingListService {
  ingredients: Ingredient[] = [new Ingredient('Apples', 5, 'pcs'), new Ingredient('Tomatoes', 10, 'pcs')];
  editMode: boolean = false;
  startedEditing = new Subject<number>();
  ingredientsChanged = new Subject<Ingredient[]>();

  constructor(private http: HttpClient) {
    console.log('ShoppingListService constructor');
  }

  fetchList() {
    return this.http
      .get('https://private-project-jonas-default-rtdb.europe-west1.firebasedatabase.app/shopping-list.json')
      .pipe(
        map((responseData) => {
          console.log(responseData);
          const postsArray: Ingredient[] = [];
          for (const key in responseData) {
            postsArray.push({
              ...responseData[key],
              id: key,
            });
          }
          this.ingredients = postsArray;
          this.ingredientsChanged.next(this.ingredients.slice());
          return postsArray;
        })
      );
  }

  addToShoppingList = (ingsToAdd: Ingredient[]) => {
    this.ingredients.push(...ingsToAdd);
  };

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.save();
  }

  updateIngredient = (index: number, newIngredient: Ingredient) => {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  };

  deleteIngredient = (index: number) => {
    this.ingredients.splice(index, 1);
    this.save();
  };

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  closeEditMode = () => {
    this.editMode = false;
  };

  save() {
    this.http
      .put(
        'https://private-project-jonas-default-rtdb.europe-west1.firebasedatabase.app/shopping-list.json',
        this.ingredients
      )
      .subscribe(
        (data) => console.log(data),
        (err) => console.log(err)
      );
  }
}
