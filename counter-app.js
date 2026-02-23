/**
 * Copyright 2026 Hyunseok Lee
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 *
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.title = "";
    this.counter = 0;
    this.min = 0;
    this.max = 100;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href + "/../",
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      counter: { type: Number, reflect: true },
      min: { type: Number },
      max: { type: Number },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }

        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }

        h3 span {
          font-size: var(
            --counter-app-label-font-size,
            var(--ddd-font-size-s)
          );
        }

        .number {
          font-size: var(--ddd-font-size-3xl);
          margin: var(--ddd-spacing-2) 0;
        }

        button {
          margin-right: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
        }

        :host([counter="18"]) .number {
          color: var(--ddd-theme-default-keystoneYellow);
        }

        :host([counter="21"]) .number {
          color: var(--ddd-theme-default-athertonViolet);
        }

        .minmax {
          color: var(--ddd-theme-default-discoveryCoral);
        }
      `,
    ];
  }

  // Increase counter by 1, but never above max.
  increment() {
    if (this.counter < this.max) {
      this.counter += 1;
    }
  }

  // Decrease counter by 1, but never below min.
  decrement() {
    if (this.counter > this.min) {
      this.counter -= 1;
    }
  }

  // If the counter reaches 21, trigger the confetti animation.
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("counter")) {
      if (this.counter === 21) {
        this.makeItRain();
      }
    }
  }

  makeItRain() {
    // this is called a dynamic import. It means it won't import the code for confetti until this method is called
    // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
    // will only run AFTER the code is imported and available to us
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        // This is a minor timing 'hack'. We know the code library above will import prior to this running
        // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
        // this "hack" ensures the element has had time to process in the DOM so that when we set popped
        // it's listening for changes so it can react
        setTimeout(() => {
          // forcibly set the poppped attribute on something with id confetti
          // while I've said in general NOT to do this, the confetti container element will reset this
          // after the animation runs so it's a simple way to generate the effect over and over again
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }

  // Lit render the HTML
  render() {
    return html`
      <confetti-container id="confetti">
        <div class="wrapper">
          <h3><span>${this.t.title}:</span> ${this.title}</h3>
          <!-- Disable button when count reaches min or max -->
          <div class="number ${this.counter === this.min || this.counter === this.max ? "minmax" : ""}">
            ${this.counter}
          </div>

          <button
            @click="${this.decrement}"
            ?disabled="${this.counter <= this.min}"
          >
            -
          </button>

          <button
            @click="${this.increment}"
            ?disabled="${this.counter >= this.max}"
          >
            +
          </button>

          <slot></slot>
        </div>
      </confetti-container>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);