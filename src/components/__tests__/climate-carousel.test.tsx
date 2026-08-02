/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ClimateCarousel, type CarouselSlide } from "@/components/climate-carousel";

const slides: CarouselSlide[] = [
  { src: "/images/a.jpg", alt: "Desert", caption: "Desert" },
  { src: "/images/b.jpg", alt: "Tropical", caption: "Tropical" },
  { src: "/images/c.jpg", alt: "Arctic", caption: "Arctic" },
];

describe("ClimateCarousel", () => {
  it("renders the first slide's caption initially", () => {
    render(<ClimateCarousel slides={slides} />);
    expect(screen.getByText("Desert")).toBeInTheDocument();
  });

  it("advances to the next slide when the next arrow is clicked", () => {
    render(<ClimateCarousel slides={slides} />);
    fireEvent.click(screen.getByLabelText("Next slide"));
    expect(screen.getByText("Tropical")).toBeInTheDocument();
  });

  it("goes back to the previous slide when the prev arrow is clicked", () => {
    render(<ClimateCarousel slides={slides} />);
    fireEvent.click(screen.getByLabelText("Next slide"));
    fireEvent.click(screen.getByLabelText("Previous slide"));
    expect(screen.getByText("Desert")).toBeInTheDocument();
  });

  it("wraps around from the last slide to the first", () => {
    render(<ClimateCarousel slides={slides} />);
    fireEvent.click(screen.getByLabelText("Next slide")); // -> Tropical
    fireEvent.click(screen.getByLabelText("Next slide")); // -> Arctic
    fireEvent.click(screen.getByLabelText("Next slide")); // -> wraps to Desert
    expect(screen.getByText("Desert")).toBeInTheDocument();
  });

  it("wraps around from the first slide to the last when going previous", () => {
    render(<ClimateCarousel slides={slides} />);
    fireEvent.click(screen.getByLabelText("Previous slide"));
    expect(screen.getByText("Arctic")).toBeInTheDocument();
  });

  it("jumps directly to a slide via its dot indicator", () => {
    render(<ClimateCarousel slides={slides} />);
    fireEvent.click(screen.getByLabelText("Go to slide 3"));
    expect(screen.getByText("Arctic")).toBeInTheDocument();
  });

  it("advances to the next slide on a left drag/swipe past the threshold", () => {
    const { container } = render(<ClimateCarousel slides={slides} />);
    const surface = container.querySelector(".touch-pan-y") as HTMLElement;

    fireEvent.mouseDown(surface, { clientX: 300 });
    fireEvent.mouseUp(surface, { clientX: 200 }); // 100px left swipe

    expect(screen.getByText("Tropical")).toBeInTheDocument();
  });

  it("does not change slides on a drag that doesn't cross the threshold", () => {
    const { container } = render(<ClimateCarousel slides={slides} />);
    const surface = container.querySelector(".touch-pan-y") as HTMLElement;

    fireEvent.mouseDown(surface, { clientX: 300 });
    fireEvent.mouseUp(surface, { clientX: 285 }); // only 15px, below threshold

    expect(screen.getByText("Desert")).toBeInTheDocument();
  });

  it("supports touch swipe the same way as mouse drag", () => {
    const { container } = render(<ClimateCarousel slides={slides} />);
    const surface = container.querySelector(".touch-pan-y") as HTMLElement;

    fireEvent.touchStart(surface, { touches: [{ clientX: 300 }] });
    fireEvent.touchEnd(surface, { changedTouches: [{ clientX: 220 }] });

    expect(screen.getByText("Tropical")).toBeInTheDocument();
  });
});

describe("ClimateCarousel autoplay", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("automatically advances to the next slide after the autoplay interval", () => {
    render(<ClimateCarousel slides={slides} autoplayMs={5000} />);
    expect(screen.getByText("Desert")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText("Tropical")).toBeInTheDocument();
  });

  it("does not autoplay when autoplayMs is 0", () => {
    render(<ClimateCarousel slides={slides} autoplayMs={0} />);

    act(() => {
      jest.advanceTimersByTime(20000);
    });

    expect(screen.getByText("Desert")).toBeInTheDocument();
  });

  it("pauses autoplay while the mouse is hovering the carousel", () => {
    const { container } = render(<ClimateCarousel slides={slides} autoplayMs={5000} />);
    const root = container.firstElementChild as HTMLElement;

    fireEvent.mouseEnter(root);
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(screen.getByText("Desert")).toBeInTheDocument(); // still paused

    fireEvent.mouseLeave(root);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Tropical")).toBeInTheDocument(); // resumed
  });

  it("pauses autoplay while the user is dragging", () => {
    const { container } = render(<ClimateCarousel slides={slides} autoplayMs={5000} />);
    const surface = container.querySelector(".touch-pan-y") as HTMLElement;

    fireEvent.mouseDown(surface, { clientX: 300 }); // starts drag -> pauses
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(screen.getByText("Desert")).toBeInTheDocument(); // still paused mid-drag

    fireEvent.mouseUp(surface, { clientX: 295 }); // ends drag (no swipe), resumes
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Tropical")).toBeInTheDocument();
  });
});
