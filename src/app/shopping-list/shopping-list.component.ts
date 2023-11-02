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
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5, 'pcs'),
    new Ingredient('Tomatoes', 10, 'pcs'),
  ];
  editMode: boolean = false;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.ingredients = this.shoppingListService.ingredients;
    this.editMode = this.shoppingListService.editMode;
  }

  ngOnChanges() {
    this.editMode = this.shoppingListService.editMode;
    console.log(this.shoppingListService.editMode);
  }

  enableEditMode = () => {
    this.editMode = true;
    console.log('enableEditMode SLC');
  };

  closeEditMode = () => (this.editMode = false);
}
