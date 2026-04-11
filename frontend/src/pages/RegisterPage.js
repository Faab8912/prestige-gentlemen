import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Erreur inscription:", error);
      setError(error.response?.data?.message || "Erreur lors de l'inscription");
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card style={{ border: "2px solid #00497c" }}>
            <Card.Body className="p-4">
              <h2
                className="text-center mb-4"
                style={{ color: "#000000", fontWeight: "bold" }}
              >
                Créer un compte
              </h2>

              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError("")}
                  dismissible
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Prénom *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Jean"
                        style={{ border: "2px solid #00497c" }}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Nom *</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Dupont"
                        style={{ border: "2px solid #00497c" }}
                      />
                    </Form.Group>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.fr"
                    style={{ border: "2px solid #00497c" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="06 12 34 56 78"
                    style={{ border: "2px solid #00497c" }}
                  />
                </Form.Group>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Mot de passe *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Min. 6 caractères"
                        style={{ border: "2px solid #00497c" }}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmer mot de passe *</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Répéter le mot de passe"
                        style={{ border: "2px solid #00497c" }}
                      />
                    </Form.Group>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-100 mb-3"
                  size="lg"
                  disabled={loading}
                  style={{ backgroundColor: "#0074c7", border: "none" }}
                >
                  {loading ? "Inscription..." : "Créer mon compte"}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Déjà un compte?{" "}
                    <Link
                      to="/login"
                      style={{ color: "#0074c7", fontWeight: "bold" }}
                    >
                      Se connecter
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default RegisterPage;
