import { addMessages } from 'svelte-i18n';
import { init, getLocaleFromNavigator } from 'svelte-i18n';

// TODO: Make async
import en from '../messages/en.json';
import ja from '../messages/ja.json';

addMessages('en', en);
addMessages('en-US', en);
addMessages('ja', ja);
addMessages('ja-JP', ja);

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});
