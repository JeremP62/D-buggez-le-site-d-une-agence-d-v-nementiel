import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./index";

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });
});

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      
    const fields = screen.getAllByTestId("field-testid");
    fireEvent.change(fields[0], { target: { value: "Nom" } });
    fireEvent.change(fields[1], { target: { value: "Prenom" } });
    fireEvent.change(fields[2], { target: { value: "test@test.com" } });
    fireEvent.change(fields[3], { target: { value: "Message de test assez long" } });

    const button = screen.getByText("Envoyer");
    fireEvent.click(button);

    
    await screen.findByText("Message envoyé !");
    });
  });     


describe("When a page is created", () => {
  it("a list of events is displayed", () => {
    // to implement
  })
  it("a list a people is displayed", () => {
    // to implement
  })
  it("a footer is displayed", () => {
    // to implement
  })
  it("an event card, with the last event, is displayed", () => {
    // to implement
  })
});
