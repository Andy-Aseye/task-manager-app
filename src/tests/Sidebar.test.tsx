import { render, screen } from "@testing-library/react";
import Sidebar from "../components/Sidebar";

describe("Sidebar Component", () => {
  it("renders the sidebar container", () => {
    render(<Sidebar />);
    const sidebar = screen.getByRole("complementary", { hidden: true });
    expect(sidebar).not.toBeNull();
  });

  it("displays the logo image with correct src and alt text", () => {
    render(<Sidebar />);
    const logo = screen.getByAltText("TaskKit") as HTMLImageElement;

    expect(logo).not.toBeNull();
    expect(logo.src).toContain("/todo.png");
  });

  it("renders the application name 'TaskKit'", () => {
    render(<Sidebar />);
    const appName = screen.getByText("TaskKit");
    expect(appName).not.toBeNull();
  });
});
