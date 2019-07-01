import { create } from 'mobx-persist';
import { StoreFGM } from './StoreFGM';

interface Stores {
  [key: string]: any;
}

export const stores: Stores = {
  storeFGM: new StoreFGM()
};

const hydrate = create({
  storage: localStorage,
  jsonify: true
});

Object.keys(stores).map(val => hydrate(val, stores[val]));
