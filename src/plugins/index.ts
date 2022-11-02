/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { loadFonts } from './webfontloader'
import {App} from "vue";

export function registerPlugins (app: App) {
  loadFonts().then()
}
