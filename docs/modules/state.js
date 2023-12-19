import { signal } from "/modules/signals.js";

export const $cwd = signal('/srv/public');
export const $currentMachine = signal('amiran');
export const $input = signal('');
export const $inputAllowed = signal(true);