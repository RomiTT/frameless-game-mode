import { StoreFGM } from './StoreFGM';

interface Stores {
  [key: string]: any;
}

export const stores: Stores = {
  storeFGM: new StoreFGM()
};
