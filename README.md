# Dialog Toggle Events polyfill

This polyfills toggle events for the `<dialog>` element.

## Installation

If you're using npm, you only need to import the package, like so:

```js
import "dialog-toggle-events-polyfill";
```

This will automatically apply the polyfill if required.

If you'd like to manually apply the polyfill, you can instead import the `isSupported` and `apply` functions directly from the `./polyfill.js` file, which
is mapped to `/fn`:

```js
import { isSupported, apply } from "dialog-toggle-events-polyfill/fn";
if (!isSupported()) apply();
```

An `isPolyfilled` function is also available, to detect if it has been polyfilled:

```js
import { isSupported, isPolyfilled, apply } from "dialog-toggle-events-polyfill/fn";
if (!isSupported() && !isPolyfilled()) apply();
```

Alternatively, if you're not using a package manager, you can use the `unpkg` script:

```html
<script
  type="module"
  async
  src="https://unpkg.com/dialog-toggle-events-polyfill@latest/index.min.js"
></script>
```

## Usage

With the module imported, you can use `beforetoggle` and `toggle` events for dialogs:

```html
<dialog id="mydialog">I'm a dialog!</dialog>
<script>
  mydialog.addEventListener('beforetoggle', console.log)
  mydialog.showModal()
</script>
```
