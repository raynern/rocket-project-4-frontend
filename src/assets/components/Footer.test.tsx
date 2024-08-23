import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

test("renders the footer", () => {
  render(<Footer></Footer>);
  const footerElement = screen.getByText(/RocketAcademy Bootcamp Project 4/i);
  expect(footerElement).toBeInTheDocument();
});
