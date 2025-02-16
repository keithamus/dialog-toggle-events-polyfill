# Dialog Toggle Events polyfill

This polyfills toggle events for the `<dialog>` element.

## How to use

If you're using npm, you only need to import the package, like so:

```js
import "dialog-toggle-events-polyfill";
```

Alternatively, if you're not using a package manager, you can use the `unpkg` script:

```html
<script
  type="module"
  async
  src="https://unpkg.com/dialog-toggle-events-polyfill@latest/polyfill.min.js"
></script>
```

With the module imported, you can use `beforetoggle` and `toggle` events for dialogs:

```html
<dialog id="mydialog">I'm a dialog!</dialog>
<script>
  mydialog.addEventListener('beforetoggle', console.log)
  mydialog.showModal()
</script>
```
