import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setLoading(true);

    try {
      const response = await authAPI.login(formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Erreur login:", error);
      setError(error.response?.data?.message || "Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card style={{ border: "2px solid #00497c" }}>
            <Card.Body className="p-4">
              <h2
                className="text-center mb-4"
                style={{ color: "#000000", fontWeight: "bold" }}
              >
                Connexion
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
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
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
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Votre mot de passe"
                    style={{ border: "2px solid #00497c" }}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 mb-3"
                  size="lg"
                  disabled={loading}
                  style={{ backgroundColor: "#0074c7", border: "none" }}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Pas encore de compte?{" "}
                    <Link
                      to="/register"
                      style={{ color: "#0074c7", fontWeight: "bold" }}
                    >
                      S'inscrire
                    </Link>
                  </p>
                </div>
              </Form>

              <hr className="my-4" />

              <div className="text-center text-muted">
                <small>
                  <strong>Compte de test:</strong>
                  <br />
                  Email: admin@prestige-gentlemen.com
                  <br />
                  Mot de passe: admin123
                </small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default LoginPage;
