// Constants
const DEFAULT_IMAGES = [
  "https://www.dummyimage.com/800x400/000/fff",
  "https://www.dummyimage.com/800x400/000/fff",
  "https://www.dummyimage.com/800x400/000/fff",
  "https://www.dummyimage.com/800x400/000/fff",
  "https://www.dummyimage.com/800x400/000/fff",
];

const BREAKPOINTS = {
  LG: "(min-width: 1024px)",
  MD: "(min-width: 768px)",
} as const;

const ITEMS_PER_VIEW = {
  LARGE: 3,
  MEDIUM: 2,
  SMALL: 1,
} as const;

// State management
export class ImageSliderState {
  images: string[] = [...DEFAULT_IMAGES];
  inputValue: string = "";
  perView: number = ITEMS_PER_VIEW.SMALL;
  slideIndex: number = 0;

  get totalSlides(): number {
    return Math.max(1, Math.ceil(this.images.length / this.perView));
  }

  get currentSlide(): number {
    return Math.min(this.totalSlides, this.slideIndex + 1);
  }

  get translateX(): string {
    return `translateX(-${this.slideIndex * 100}%)`;
  }
}

// Responsive layout functions
export function updatePerView(state: ImageSliderState): void {
  const isLarge = window.matchMedia(BREAKPOINTS.LG).matches;
  const isMedium = window.matchMedia(BREAKPOINTS.MD).matches;
  
  state.perView = isLarge 
    ? ITEMS_PER_VIEW.LARGE 
    : isMedium 
    ? ITEMS_PER_VIEW.MEDIUM 
    : ITEMS_PER_VIEW.SMALL;
}

export function handleResize(state: ImageSliderState, updateCallback: () => void): void {
  const oldPerView = state.perView;
  updatePerView(state);
  
  if (oldPerView !== state.perView) {
    const firstVisibleImageIndex = state.slideIndex * oldPerView;
    state.slideIndex = Math.floor(firstVisibleImageIndex / state.perView);
    updateCallback();
  }
}

// Navigation functions
export function clampSlideIndex(index: number, totalSlides: number): number {
  return ((index % totalSlides) + totalSlides) % totalSlides;
}

export function navigatePrevious(state: ImageSliderState, updateCallback: () => void): void {
  state.slideIndex = clampSlideIndex(state.slideIndex - 1, state.totalSlides);
  updateCallback();
}

export function navigateNext(state: ImageSliderState, updateCallback: () => void): void {
  state.slideIndex = clampSlideIndex(state.slideIndex + 1, state.totalSlides);
  updateCallback();
}

// Image management functions
export function updateInputValue(state: ImageSliderState, value: string): void {
  state.inputValue = value;
}

export function addImage(state: ImageSliderState, url: string, updateCallback: () => void): void {
  if (!url.trim()) return;
  
  state.images = [...state.images, url];
  state.slideIndex = Math.floor((state.images.length - 1) / state.perView);
  state.inputValue = "";
  updateCallback();
}

// Utility functions
export function groupImagesIntoSlides(images: string[], perView: number): string[][] {
  const slides: string[][] = [];
  
  for (let i = 0; i < images.length; i += perView) {
    slides.push(images.slice(i, i + perView));
  }
  
  return slides.length > 0 ? slides : [[]];
}