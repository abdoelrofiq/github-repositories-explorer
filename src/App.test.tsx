import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, test } from "vitest";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("should render input and search button", () => {
  render(<App />);

  expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  expect(screen.getByText("Search")).toBeInTheDocument();
});

test("should show search result container when searching", async () => {
  render(<App />);

  const input = screen.getByPlaceholderText("Enter username");
  await userEvent.type(input, "testuser");

  fireEvent.click(screen.getByText("Search"));

  screen.debug();

  const resultContainer = await screen.findByText(
    /Showing users for "testuser"/
  );
  expect(resultContainer).toBeInTheDocument();
});

test("should handle pagination click", () => {
  render(<App />);

  fireEvent.click(screen.getByText("Search"));

  const paginationButton = screen.queryByText("2");

  if (paginationButton) {
    fireEvent.click(paginationButton);
    expect(screen.getByText("Search")).toBeInTheDocument();
  }
});
