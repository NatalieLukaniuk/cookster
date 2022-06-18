import { Complexity } from './complexity.enum';
import { DishType } from './dishType.enum';
import { Ingredient, IngredientsGroup } from './ingredient.interface';
import { PreparationStep } from './preparationStep.interface';

export interface Recipy extends NewRecipy {
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
  lastEdited?: number;
  clonedBy?: string;
  clonedOn?: number;
  originalRecipy?: string;
  isSplitIntoGroups: IngredientsGroup[]
}

export interface RecipyForCalendar extends Recipy {
  portions: number
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
  clonedBy?: string;
  clonedOn?: number;
  originalRecipy?: string;
  isSplitIntoGroups: IngredientsGroup[]
}

export class emptyRecipy implements NewRecipy {
  name: string = '';
  ingrediends: Ingredient[] = [];
  complexity: Complexity = Complexity.simple;
  steps: PreparationStep[] = [];
  type: DishType[] = [];
  author: string;
  createdOn: number = Date.now();
  isSplitIntoGroups: IngredientsGroup[] = []
  constructor(author: string) {
    this.author = author;
  }
}