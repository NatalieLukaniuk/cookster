import { DayDetails } from "src/app/menus/components/day/day.component";

export interface User {
    email: string
    uid: string
    details?: DayDetails[],
    id?: string
}