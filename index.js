import { apply, isSupported } from './polyfill.js';
if (!isSupported()) apply();
