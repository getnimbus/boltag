import { currentLang } from "~/store";
import _ from "lodash";
import * as browser from "webextension-polyfill";
import { derived } from "svelte/store";
import translations from "~/lib/translations";

type LANG = "en" | "ru";

browser.storage.onChanged.addListener((changes) => {
  if (changes?.options?.newValue?.lang) {
    currentLang.update((n) => n =  changes?.options?.newValue?.lang)
  }
});

browser.storage.sync.get("options").then((res) => { 
  let selectLang = res?.options?.lang;
  if (!selectLang) {
    selectLang = navigator.language === 'ru' ? 'ru' : 'en'
  }
  currentLang.update((n) => n = selectLang)
});

export const setLang = async (lang: LANG) => {
  currentLang.update((n) => n = lang)
  await browser.storage.sync.set({
    options: {
      lang,
    },
  });
};

function translate(locale: string, key: string, vars: any) {
  // if (!key) throw new Error("no key provided to $t()");
  if (!locale) throw new Error(`no translation for key "${key}"`);

  // Grab the translation from the translations object.
  let text = (translations as any)[locale][key];

  if (!text) {
    return key;
  }

  // Replace any passed in variables in the translation string.
  if (vars && Object.keys(vars).length !== 0) {
    Object.keys(vars).map((k) => {
      const regex = new RegExp(`{{${k}}}`, "g");
      text = text.replace(regex, vars[k]);
    });
  }

  return text;
}

export const t = derived(currentLang, ($currentLang) => (key: string, vars = {}) => 
  {
    return translate($currentLang, key, vars)
  }
);