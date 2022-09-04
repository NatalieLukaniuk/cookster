import { MultiFactorUser, UserInfo, UserMetadata } from 'firebase/auth';
import { DayDetails } from 'src/app/calendar/models/calendar';
import { SuggestionList } from 'src/app/planner/components/advance-preparation/advance-preparation.component';
import { ShoppingListItem } from 'src/app/shopping-list/models';

export interface User {
  email: string;
  uid: string;
  details?: DayDetails[];
  id?: string;
  shoppingLists?: ShoppingListItem[];
  prepLists?: SuggestionList[];
  img?: string;
  role: Role
}

export enum Role {
  Admin = 'admin',
  User = 'user'
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