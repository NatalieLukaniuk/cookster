import { PlannerByDate } from './../../planner-reworked/models';
import { MultiFactorUser, UserInfo, UserMetadata } from 'firebase/auth';
import { DayDetails } from 'src/app/calendar/models/calendar';
import { ShoppingListItem } from 'src/app/shopping-list/models';
import { SuggestionList } from 'src/app/planner-reworked/preps.models';

export interface User {
  email: string;
  uid: string;
  details?: DayDetails[];
  id?: string;
  shoppingLists?: ShoppingListItem[];
  prepLists?: SuggestionList[];
  img?: string;
  role: Role,
  planner?: PlannerByDate[],
  collections?: RecipyCollection[],
  scenarios?: SuggestionList[]
}

export enum Role {
  Admin = 'admin',
  User = 'user'
}

export interface RecipyCollection {
  name: string,
  recipies: string[]
}

export interface UserImpl {
  displayName: string | null,
  email: string | null,
  emailVerified: boolean,
  isAnonymous: boolean,
  metadata: UserMetadata,
  multiFactor: MultiFactorUser,
  phoneNumber: string | null,
  photoURL: string | null,
  providerData: UserInfo[],
  providerId: string,
  refreshToken: string,
  tenantId: string | null,
  uid: string
}