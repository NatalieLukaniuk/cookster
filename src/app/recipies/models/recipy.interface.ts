import { Complexity } from './complexity.enum';
import { DishType } from './dishType.enum';
import { Ingredient } from './ingredient.interface';
import { PreparationStep } from './preparationStep.interface';

export interface Recipy {
  id: string;
  name: string;
  ingrediends: Ingredient[];
  complexity: Complexity;
  steps: PreparationStep[];
  type: DishType[];
  photo?: string;
  author: string;
  createdOn: number;
  editedBy?: string;
  lastEdited?: number
}

export interface NewRecipy {
  name: string;
  ingrediends: Ingredient[];
  complexity: Complexity;
  steps: PreparationStep[];
  type: DishType[];
  photo?: string;
  author: string;
  createdOn: number;
}