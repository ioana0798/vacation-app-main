import { Holiday } from './holiday';

export interface Country {
  name: string;
  code: string;
  holidays: Holiday[];
}
