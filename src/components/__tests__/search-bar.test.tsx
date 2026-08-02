/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { SearchBar } from "@/components/search-bar";
import { LanguageProvider } from "@/components/language-provider";
import type { GeoPlace } from "@/lib/weather";

const isfahan: GeoPlace = {
  id: 112931,
  name: "Isfahan",
  latitude: 32.65,
  longitude: 51.67,
  country: "Iran",
  admin1: "Isfahan",
};

function mockGeocodeResponse(results: GeoPlace[]) {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ results }),
  });
}

function renderSearchBar(onSelect = jest.fn()) {
  render(
    <LanguageProvider>
      <SearchBar onSelect={onSelect} />
    </LanguageProvider>
  );
  return onSelect;
}

beforeEach(() => {
  jest.useFakeTimers({ legacyFakeTimers: false });
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.useRealTimers();
  jest.resetAllMocks();
});

describe("SearchBar", () => {
  it("stays closed and does not re-open after selecting a result", async () => {
    mockGeocodeResponse([isfahan]);
    const onSelect = renderSearchBar();

    fireEvent.change(screen.getByLabelText("Search location"), {
      target: { value: "Isf" },
    });

    // Let the debounce timer + fetch resolve so results appear.
    await act(() => jest.advanceTimersByTimeAsync(300));

    const option = await screen.findByText("Isfahan");
    fireEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith(isfahan);

    // Selecting rewrites the input value, which would normally re-trigger
    // the debounced search. Advance past that debounce window and make
    // sure the dropdown does NOT reappear.
    await act(() => jest.advanceTimersByTimeAsync(300));

    expect(screen.queryByText("Isfahan")).not.toBeInTheDocument();
  });

  it("sends the current UI language to the geocode API", async () => {
    mockGeocodeResponse([isfahan]);
    renderSearchBar();

    fireEvent.change(screen.getByLabelText("Search location"), {
      target: { value: "Isf" },
    });

    await act(() => jest.advanceTimersByTimeAsync(300));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain("lang=fa"); // app's default language is Persian
  });

  it("shows the English name alongside the localized name when both are present", async () => {
    const isfahanFa = { ...isfahan, name: "اصفهان", nameEn: "Isfahan" };
    mockGeocodeResponse([isfahanFa]);
    renderSearchBar();

    fireEvent.change(screen.getByLabelText("Search location"), {
      target: { value: "Isf" },
    });

    await act(() => jest.advanceTimersByTimeAsync(300));

    expect(await screen.findByText("اصفهان")).toBeInTheDocument();
    expect(screen.getByText("· Isfahan")).toBeInTheDocument();
  });
});
