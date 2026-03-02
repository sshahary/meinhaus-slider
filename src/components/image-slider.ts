import { LitElement, html } from "lit";

const DEFAULT_IMAGES = Array.from({ length: 5 }, () => "https://www.dummyimage.com/800x400/000/fff");

class ImageSlider extends LitElement {
  createRenderRoot() { return this; }

  private images: string[] = [...DEFAULT_IMAGES];
  private perView = 1;
  private slideIndex = 0;

  connectedCallback() {
    super.connectedCallback();
    this.updatePerView();
    window.addEventListener("resize", this.onResize, { passive: true });
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.onResize);
    super.disconnectedCallback();
  }

  private onResize = () => {
    const old = this.perView;
    this.updatePerView();
    if (old !== this.perView) {
      const firstVisible = this.slideIndex * old;
      this.slideIndex = Math.floor(firstVisible / this.perView);
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

  private clamp(i: number) {
    const t = this.totalSlides;
    return ((i % t) + t) % t;
  }

  private prev = () => {
    this.slideIndex = this.clamp(this.slideIndex - 1);
    this.requestUpdate();
  };

  private next = () => {
    this.slideIndex = this.clamp(this.slideIndex + 1);
    this.requestUpdate();
  };

  // This is what InputBar calls
  public addImageUrl(url: string) {
    const cleaned = url.trim();
    if (!cleaned) return;

    this.images = [...this.images, cleaned];
    const newIndex = this.images.length - 1;
    this.slideIndex = Math.floor(newIndex / this.perView);
    this.requestUpdate();
  }

  private groupImages(): string[][] {
    const slides: string[][] = [];
    for (let i = 0; i < this.images.length; i += this.perView) {
      slides.push(this.images.slice(i, i + this.perView));
    }
    return slides.length ? slides : [[]];
  }

  render() {
    const current = Math.min(this.totalSlides, this.slideIndex + 1);
    const translate = `translateX(-${this.slideIndex * 100}%)`;
    const slides = this.groupImages();

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
          >‹</button>

          <div class="overflow-hidden rounded-2xl">
            <div
              class="flex transition-transform duration-500 ease-in-out will-change-transform"
              style="transform:${translate};"
            >
              ${slides.map((group) => html`
                <div class="flex-none w-full">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${group.map((src) => html`
                      <div class="w-full aspect-[2/1] rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                        <img class="w-full h-full object-contain" src=${src} alt="Slide image" loading="lazy" />
                      </div>
                    `)}
                  </div>
                </div>
              `)}
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
          >›</button>
        </div>

        <div class="text-center text-sm text-neutral-600 dark:text-neutral-300">
          ${current} of ${this.totalSlides}
        </div>
      </div>
    `;
  }
}

customElements.define("image-slider", ImageSlider);