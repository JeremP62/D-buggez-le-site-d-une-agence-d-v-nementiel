import { fireEvent, render, screen } from "@testing-library/react";
import Form from "./index";

describe("When Events is created", () => {
  it("a list of event card is displayed", async () => {
    render(<Form />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success action is called", async () => {
      const onSuccess = jest.fn();
      render(<Form onSuccess={onSuccess} />);
      
      // je récup tous les champs qui ont le même test-id
      const fields = screen.getAllByTestId("field-testid");

      // je les remplit un par un en suivant l'ordre du HTML
      // index 0 : nom (lastname)
      fireEvent.change(fields[0], { target: { value: "NomTest"} });
      // index 1 : prénom (firstname)
      fireEvent.change(fields[1], { target: { value: "PrenomTest"} });
      // index 2 : Email
      fireEvent.change(fields[2], { target: { value: "test@test.com"} });
      // index 3 : Message (textarea)
      fireEvent.change(fields[3], { target: { value: "Ceci est un message de test"} });
        
      // l'event clic sur le btn
      fireEvent.click(screen.getByTestId("button-test-id"));

      await screen.findByText(/en cours/i);
      await screen.findByText("Envoyer");

      expect(onSuccess).toHaveBeenCalled();


    });
  });
});
