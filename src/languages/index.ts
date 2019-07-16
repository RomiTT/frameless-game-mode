interface ILocaleInfo {
  language: string;
  name: string;
}

export function getLanguageNames(): Array<ILocaleInfo> {
  return [
    {
      language: 'Korean',
      name: 'ko'
    },
    {
      language: 'English',
      name: 'en'
    }
  ];
}

export function getLanguage(localeName: string) {
  return require(`./${localeName}.js`);
}
