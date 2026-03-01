import { LitElement, html } from "lit";

const DEFAULT_IMAGES = [
  "https://www.dummyimage.com/800x400/000/fff",
  "https://www.dummyimage.com/800x400/000/fff",
  "https://www.dummyimage.com/800x400/000/fff",
  "https://www.dummyimage.com/800x400/000/fff",
  "https://www.dummyimage.com/800x400/000/fff",
];

class ImageSlider extends LitElement {
  createRenderRoot() {
    return this;
  }

  private images: string[] = [...DEFAULT_IMAGES];
  private inputValue = "";
  private perView = 1;
  private slideIndex = 0;

  connectedCallback(): void {
    super.connectedCallback();
    this.updatePerView();
    window.addEventListener("resize", this.onResize, { passive: true });
  }

  disconnectedCallback(): void {
    window.removeEventListener("resize", this.onResize);
    super.disconnectedCallback();
  }

  private onResize = () => {
    const oldPerView = this.perView;
    this.updatePerView();
    if (oldPerView !== this.perView) {
      // Keep the first visible image in view when layout changes
      const firstImageIdx = this.slideIndex * oldPerView;
      this.slideIndex = Math.floor(firstImageIdx / this.perView);
      this.requestUpdate();
    }
  };

  private updatePerView() {
    const isLg = window.matchMedia("(min-width: 1024px)").matches;
    const isMd = window.matchMedia("(min-width: 768px)").matches;
    this.perView = isLg ? 3 : isMd ? 2 : 1;
  }

  private get totalSlides() {
    return Math.max(1, Math.ceil(this.images.length / this.perView));
  }

  private clampSlideIndex(i: number) {
    const total = this.totalSlides;
    const wrapped = ((i % total) + total) % total;
    return wrapped;
  }

  private prev = () => {
    this.slideIndex = this.clampSlideIndex(this.slideIndex - 1);
    this.requestUpdate();
  };

  private next = () => {
    this.slideIndex = this.clampSlideIndex(this.slideIndex + 1);
    this.requestUpdate();
  };

  private onInput = (e: Event) => {
    const el = e.target as HTMLInputElement;
    this.inputValue = el.value;
  };

  private addImage = (e: Event) => {
    e.preventDefault();
    const url = this.inputValue.trim();
    if (!url) return;

    this.images = [...this.images, url];

    const newIndex = this.images.length - 1;
    this.slideIndex = Math.floor(newIndex / this.perView);

    this.inputValue = "";
    this.requestUpdate();
  };

  private renderSlides() {
    const slides: string[][] = [];
    for (let i = 0; i < this.images.length; i += this.perView) {
      slides.push(this.images.slice(i, i + this.perView));
    }
    if (slides.length === 0) slides.push([]);

    return slides.map((group) => {
      return html`
        <div class="flex-none w-full">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${group.map(
              (src) => html`
                <div
                  class="w-full aspect-[2/1] rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center"
                >
                  <img
                    class="w-full h-full object-contain"
                    src=${src}
                    alt="Slide image"
                    loading="lazy"
                  />
                </div>
              `
            )}
          </div>
        </div>
      `;
    });
  }

  render() {
    const total = this.totalSlides;
    const current = Math.min(total, this.slideIndex + 1);
    const translate = `translateX(-${this.slideIndex * 100}%)`;

    return html`
      <div class="w-full flex flex-col gap-6">
        <div class="relative">
          <button
            type="button"
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-6
                   rounded-full border border-neutral-300 dark:border-neutral-700
                   bg-white/90 dark:bg-neutral-900/90 backdrop-blur
                   px-3 py-2 shadow z-10"
            @click=${this.prev}
            aria-label="Previous slide"
          >
            ‹
          </button>

          <!-- Slider viewport -->
          <div class="overflow-hidden rounded-2xl">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              style="transform: ${translate};"
            >
              ${this.renderSlides()}
            </div>
          </div>

          <button
            type="button"
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-6
                   rounded-full border border-neutral-300 dark:border-neutral-700
                   bg-white/90 dark:bg-neutral-900/90 backdrop-blur
                   px-3 py-2 shadow z-10"
            @click=${this.next}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        <div class="text-center text-sm text-neutral-600 dark:text-neutral-300">
          ${current} of ${total}
        </div>

        <!-- Input at bottom -->
        <form class="flex gap-2 mt-4" @submit=${this.addImage}>
          <input
            class="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700
                   bg-white dark:bg-neutral-900
                   px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            type="url"
            placeholder="Paste image URL and press Enter…"
            .value=${this.inputValue}
            @input=${this.onInput}
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

customElements.define("image-slider", ImageSlider);