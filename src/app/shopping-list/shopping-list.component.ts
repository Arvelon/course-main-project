import { Component, OnChanges, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: [ShoppingListComponent],
})
export class ShoppingListComponent implements OnInit, OnChanges {
  // Initialize an array of Ingredient objects as a default list.
  ingredients: Ingredient[] = [new Ingredient('Apples', 5, 'pcs'), new Ingredient('Tomatoes', 10, 'pcs')];
  // Initialize a boolean flag for controlling edit mode.
  editMode: boolean = false;

  // Constructor for the component, injecting the ShoppingListService.
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    // Retrieve the ingredients list from the ShoppingListService.
    this.ingredients = this.shoppingListService.ingredients;

    // Fetch the list from an external source (e.g., server) and update the ingredients.
    this.shoppingListService.fetchList().subscribe((data) => (this.ingredients = data));

    // Get the initial edit mode state from the ShoppingListService.
    this.editMode = this.shoppingListService.editMode;
  }

  // OnChanges lifecycle hook.
  ngOnChanges() {
    // Update the edit mode based on changes from the ShoppingListService.
    this.editMode = this.shoppingListService.editMode;
  }

  // Method to handle editing an item at a specific index.
  onEditItem(index: number) {
    // Emit an event to indicate that an edit action has started.
    this.shoppingListService.startedEditing.next(index);
  }

  // Method to enable edit mode.
  enableEditMode = () => {
    this.editMode = true;
  };

  // Method to close the edit mode.
  closeEditMode = () => (this.editMode = false);
}
