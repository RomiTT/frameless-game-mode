const app: any = require('electron').remote.app;

export enum Language {
  English,
  Korea
}

export enum Locale {
  English = 'en',
  Korea = 'ko'
}

export function getLanguageName(lang: Language): string {
  return Language[lang];
}

export function getAllLanguages(): Language[] {
  return Object.values(Language);
}

export function getDefaultLanguage(): Language {
  let lang: Language = Language.English;
  const locale = app.getLocale();

  switch (locale) {
    case 'ko': {
      lang = Language.Korea;
      break;
    }
  }

  return lang;
}

export function getLocaleNameFromLanguage(lang: Language): string {
  const name: any = getLanguageName(lang);
  return Locale[name];
}
