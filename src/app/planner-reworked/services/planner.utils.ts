import * as moment from 'moment';

export function getFormattedName(name: string): string {
  // format is 'DDMMYYYY'
  return moment(name, 'DDMMYYYY').toString();
}
