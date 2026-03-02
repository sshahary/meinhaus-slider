import { LitElement, html } from "lit";

class InputBar extends LitElement {
  createRenderRoot() { return this; }

  private handleSubmit = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    const url = input.value.trim();
    
    if (!url) return;

    const slider = document.querySelector("image-slider") as any;
    slider?.addImageUrl?.(url);
    
    input.value = "";
  };

  render() {
    return html`
      <div class="w-full max-w-5xl">


        <form @submit=${this.handleSubmit} class="w-full flex gap-2">
  <input
    id="imageUrl"
    class="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700
           bg-white dark:bg-neutral-900
           px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
    type="url"
    placeholder="Paste image URL and press Enter…"
    required
  />
  <button
    class="rounded-xl border border-neutral-300 dark:border-neutral-700
           bg-neutral-900 text-white dark:bg-white dark:text-neutral-900
           px-6 py-3 hover:opacity-90 transition-opacity"
    type="submit"
  >
    Add
  </button>
</form>
      </div>
    `;
  }
}

customElements.define("input-bar", InputBar);
