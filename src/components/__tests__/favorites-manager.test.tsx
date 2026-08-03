/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FavoritesManager } from "@/components/favorites-manager";
import { LanguageProvider } from "@/components/language-provider";

// Keep this test focused on FavoritesManager's own add/list error handling —
// stub out SearchBar (fires onSelect directly) and WeatherDashboard (heavy,
// unrelated to this component's responsibility).
jest.mock("../search-bar", () => ({
  SearchBar: ({ onSelect }: { onSelect: (p: any) => void }) => (
    <button
      onClick={() =>
        onSelect({ id: 1, name: "Isfahan", latitude: 32.65, longitude: 51.67 })
      }
    >
      mock-select-isfahan
    </button>
  ),
}));

jest.mock("../weather-dashboard", () => ({
  WeatherDashboard: () => <div>mock-weather-dashboard</div>,
}));

function renderManager() {
  render(
    <LanguageProvider>
      <FavoritesManager />
    </LanguageProvider>
  );
}

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("FavoritesManager", () => {
  it("shows an error when adding a favorite fails (non-OK response)", async () => {
    (global.fetch as jest.Mock)
      // initial GET /api/favorites on mount
      .mockResolvedValueOnce({ ok: true, json: async () => ({ favorites: [] }) })
      // POST /api/favorites fails
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Database unavailable" }),
      });

    renderManager();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText("mock-select-isfahan"));

    expect(await screen.findByRole("alert")).toHaveTextContent("Database unavailable");
  });

  it("shows a generic error when adding fails due to a network error", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ favorites: [] }) })
      .mockRejectedValueOnce(new Error("network down"));

    renderManager();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText("mock-select-isfahan"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "این مکان اضافه نشد" // Persian default: "Couldn't add this location"
    );
  });

  it("clears a previous add-error once a retry succeeds", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ favorites: [] }) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "fail once" }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ favorite: { _id: 1, name: "Isfahan", latitude: 32.65, longitude: 51.67 } }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ favorites: [] }) }) // reload list
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // weather lookup

    renderManager();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const selectBtn = screen.getByText("mock-select-isfahan");
    fireEvent.click(selectBtn);
    expect(await screen.findByRole("alert")).toHaveTextContent("fail once");

    fireEvent.click(selectBtn);
    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
  });

  it("shows a load error instead of silently rendering an empty list when GET fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Database unavailable" }),
    });

    renderManager();

    expect(await screen.findByRole("alert")).toHaveTextContent("Database unavailable");
    // Should NOT show the generic "no favorites yet" empty state instead.
    expect(screen.queryByText(/هنوز علاقه‌مندی نداری/)).not.toBeInTheDocument();
  });
});
