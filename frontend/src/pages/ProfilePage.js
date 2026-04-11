import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { authAPI } from "../services/api";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      setFormData({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        phone: response.data.user.phone || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement profil:", error);
      setError("Erreur de chargement du profil");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      const response = await authAPI.updateProfile(formData);
      setUser(response.data.user);
      setSuccess("Profil mis à jour avec succès!");
      setSaving(false);
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      setError(
        error.response?.data?.message || "Erreur lors de la mise à jour"
      );
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-5">
        <p className="text-center">Chargement...</p>
      </Container>
    );
  }

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
                Mon Profil
              </h2>

              {success && (
                <Alert
                  variant="success"
                  onClose={() => setSuccess("")}
                  dismissible
                >
                  {success}
                </Alert>
              )}

              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError("")}
                  dismissible
                >
                  {error}
                </Alert>
              )}

              <div
                className="mb-4 p-3"
                style={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              >
                <p className="mb-2">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="mb-0">
                  <strong>Rôle:</strong>{" "}
                  {user?.role === "admin" ? "Administrateur" : "Client"}
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        style={{ border: "2px solid #00497c" }}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        style={{ border: "2px solid #00497c" }}
                      />
                    </Form.Group>
                  </div>
                </div>

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

                <Button
                  type="submit"
                  className="w-100"
                  size="lg"
                  disabled={saving}
                  style={{ backgroundColor: "#0074c7", border: "none" }}
                >
                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default ProfilePage;
