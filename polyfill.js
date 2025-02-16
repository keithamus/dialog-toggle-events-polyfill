(() => {
  if (typeof HTMLDialogElement === "undefined") {
    return;
  }

  let supported = false;
  const dialog = document.createElement("dialog");
  dialog.addEventListener("beforetoggle", (e) => {
    supported = true;
    e.preventDefault();
  });
  dialog.show();
  if (supported) return;

  const toggleEventDispatcher = new WeakMap();
  function queueDialogToggleEventTask(dialog) {
    const newState = dialog.open ? "closed" : "open";
    let oldState = dialog.open ? "open" : "closed";
    if (toggleEventDispatcher.has(dialog)) {
      const old = toggleEventDispatcher.get(dialog);
      oldState = old.oldState;
      clearTimeout(old.id);
    }
    toggleEventDispatcher.set(dialog, {
      oldState,
      id: setTimeout(() => {
        dialog.dispatchEvent(new ToggleEvent("toggle", { newState, oldState }));
      }),
    });
  }

  const originalShow = HTMLDialogElement.prototype.show;
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;

  function dialogCloseEvents(dialog) {
    const event = new ToggleEvent("beforetoggle", {
      newState: "closed",
      oldState: "open",
      cancelable: false,
    });
    dialog.dispatchEvent(event);
    if (!dialog.open) {
      return;
    }
    queueDialogToggleEventTask(dialog);
  }

  document.addEventListener(
    "submit",
    (event) => {
      const form = event.target;
      if (form.method === "dialog") {
        const dialog = form.closest("dialog");
        if (dialog instanceof HTMLDialogElement) {
          dialogCloseEvents(dialog);
        }
      }
    },
    true,
  );

  Object.defineProperties(HTMLDialogElement.prototype, {
    show: {
      value() {
        // Event shouldn't fire, but browser might want to error/warn so return original call
        if (
          this.open ||
          this.matches(":popover-open, :modal") ||
          !this.isConnected ||
          !this.ownerDocument
        ) {
          return originalShow.apply(this, arguments);
        }
        const event = new ToggleEvent("beforetoggle", {
          newState: "open",
          oldState: "closed",
          cancelable: true,
        });
        if (!this.dispatchEvent(event)) {
          return;
        }
        queueDialogToggleEventTask(this);
        originalShow.apply(this, arguments);
      },
    },
    showModal: {
      value() {
        // Event shouldn't fire, but browser might want to error/warn so return original call
        if (
          this.open ||
          this.matches(":popover-open, :modal") ||
          !this.isConnected ||
          !this.ownerDocument
        ) {
          return originalShowModal.apply(this, arguments);
        }
        const event = new ToggleEvent("beforetoggle", {
          newState: "open",
          oldState: "closed",
          cancelable: true,
        });
        if (!this.dispatchEvent(event)) {
          return;
        }
        queueDialogToggleEventTask(this);
        return originalShowModal.apply(this, arguments);
      },
    },
    close: {
      value() {
        // Event shouldn't fire, but browser might want to error/warn so return original call
        if (!this.open && !this.matches(":popover-open, :modal")) {
          return originalClose.apply(this, arguments);
        }
        dialogCloseEvents(this);
        return originalClose.apply(this, arguments);
      },
    },
  });
})();
