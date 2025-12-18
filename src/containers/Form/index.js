import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

// simple regex email expression réguliere
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);

  // controlled form state
  const [form, setForm] = useState({
    lastname: "",
    firstname: "",
    kind: null, // "Personel" | "Entreprise" | null
    email: "",
    message: "",
  });

  // messages d'erreur inline
  const [errors, setErrors] = useState({});
  // message global de confirmation / erreur
  const [globalMessage, setGlobalMessage] = useState(null);

  // handle input change (Field)
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear field error when typing
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  // handle select change (Select calls onChange(value|null))
  const handleSelectChange = useCallback((value) => {
    setForm((prev) => ({ ...prev, kind: value }));
    setErrors((prev) => ({ ...prev, kind: null }));
  }, []);

  // validate fields; returns true if ok, sets errors state otherwise
  const validate = useCallback(() => {
    const next = {};
    if (!form.lastname || form.lastname.trim().length < 2) {
      next.lastname = "Le nom doit contenir au moins 2 caractères.";
    }
    if (!form.firstname || form.firstname.trim().length < 2) {
      next.firstname = "Le prénom doit contenir au moins 2 caractères.";
    }
    if (!form.email || !EMAIL_REGEX.test(form.email)) {
      next.email = "Merci de saisir une adresse email valide.";
    }
    if (!form.message || form.message.trim().length < 5) {
      next.message = "Le message doit contenir au moins 5 caractères.";
    }
    // kind is optional here; si requis, décommenter:
    // if (!form.kind) next.kind = "Veuillez choisir Personel ou Entreprise.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form]);

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      // remove previous messages
      setGlobalMessage(null);

      if (sending) return;

      // first validation
      if (!validate()) {
        setGlobalMessage({ type: "error", text: "Veuillez corriger les erreurs du formulaire." });
        return;
      }

      setSending(true);

      try {
        await mockContactApi(); 
        setSending(false);
        setGlobalMessage({ type: "success", text: "Votre message a bien été envoyé ✔️" });

        // reset form
        setForm({
          lastname: "",
          firstname: "",
          kind: null,
          email: "",
          message: "",
        });
        setErrors({});

        // callback parent success
        if (typeof onSuccess === "function") onSuccess();

        // auto-hide message after 4s
        setTimeout(() => setGlobalMessage(null), 4000);
      } catch (err) {
        setSending(false);
        setGlobalMessage({ type: "error", text: "Une erreur est survenue. Réessayez plus tard." });
        if (typeof onError === "function") onError(err);
        setTimeout(() => setGlobalMessage(null), 4000);
      }
    },
    [form, sending, validate, onSuccess, onError]
  );

  // helpful effect: log when globalMessage changes for debug
  useEffect(() => {
    if (globalMessage);
  }, [globalMessage]);

  return (
    <form onSubmit={sendContact} data-testid="contact-form">
      <div className="row">
        <div className="col">
          <Field
            name="lastname"
            placeholder=""
            label="Nom"
            value={form.lastname}
            onChange={handleChange}
            required
          />
          {errors.lastname && <div className="field-error" data-testid="error-lastname">{errors.lastname}</div>}

          <Field
            name="firstname"
            placeholder=""
            label="Prénom"
            value={form.firstname}
            onChange={handleChange}
            required
          />
          {errors.firstname && <div className="field-error" data-testid="error-firstname">{errors.firstname}</div>}

          <Select
            selection={["Personel", "Entreprise"]}
            onChange={handleSelectChange}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            value={form.kind}
          />
          {errors.kind && <div className="field-error" data-testid="error-kind">{errors.kind}</div>}

          <Field
            name="email"
            placeholder=""
            label="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="field-error" data-testid="error-email">{errors.email}</div>}

          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending} data-testid="form-submit">
            {sending ? "En cours..." : "Envoyer"}
          </Button>
        </div>

        <div className="col">
          <Field
            name="message"
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            value={form.message}
            onChange={handleChange}
            required
          />
          {errors.message && <div className="field-error" data-testid="error-message">{errors.message}</div>}
        </div>
      </div>

      {globalMessage && (
        <div
          className={`form-global-message ${globalMessage.type}`}
          role="status"
          data-testid="form-global-message"
        >
          {globalMessage.text}
        </div>
      )}
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
