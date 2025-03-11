import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar from "../components/Sidebar";

describe("Sidebar Component", () => {
  beforeEach(() => {
    render(<Sidebar />);
  });

  it("renders the sidebar with proper label", () => {
    expect(screen.getByLabelText("Application sidebar")).toBeInTheDocument();
  });

  it("displays the application branding", () => {
    expect(screen.getByAltText("TaskKit")).toBeInTheDocument();

    expect(screen.getByText("TaskKit")).toBeInTheDocument();
  });
});
