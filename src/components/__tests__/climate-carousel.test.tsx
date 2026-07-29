/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
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
});
