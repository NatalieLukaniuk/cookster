import { IngredientsGroup } from "./ingredient.interface";

export interface PreparationStep {
  id: number;
  description: string;
  timeActive: number; // minutes
  timePassive: number; // minutes
  group?: IngredientsGroup
}
