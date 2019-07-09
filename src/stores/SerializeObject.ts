import 'reflect-metadata';

const serializeMetadataKey = Symbol('serialize');

export function serializeF(): any {
  return Reflect.metadata(serializeMetadataKey, true);
}

export function serialize(target: any, key: string): any {
  let func = Reflect.metadata(serializeMetadataKey, true);
  func(target, key);
}

function getSerialize(target: any, propertyKey: string) {
  return Reflect.getMetadata(serializeMetadataKey, target, propertyKey);
}

export function serializeObject(obj: object) {
  const localStorage = window.localStorage;
  for (let [key, value] of Object.entries(obj)) {
    if (getSerialize(obj, key)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

export function deserializeObject(obj: object) {
  const localStorage = window.localStorage;
  for (let [key, value] of Object.entries(obj)) {
    if (getSerialize(obj, key)) {
      let itemVal = localStorage.getItem(key);
      if (itemVal) {
        if (value && value.constructor == Array) {
          value.push(...JSON.parse(itemVal));
        } else {
          Object.defineProperty(obj, key, {
            value: JSON.parse(itemVal),
            writable: true
          });
        }
      }
    }
  }
}
