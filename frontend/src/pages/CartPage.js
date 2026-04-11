import React, { useState } from "react";
import { Container, Card, Button, Form, Alert, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderAPI } from "../services/api";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [shippingData, setShippingData] = useState({
    address: "",
    postalCode: "",
    city: "",
    notes: "",
  });

  const handleChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour commander");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (cartItems.length === 0) {
      setError("Votre panier est vide");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          variantId: item.variantId,
          productName: item.productName,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: shippingData.address,
        shippingPostalCode: shippingData.postalCode,
        shippingCity: shippingData.city,
        notes: shippingData.notes,
        paymentMethod: "card",
      };

      await orderAPI.create(orderData);

      setSuccess("Commande créée avec succès!");
      clearCart();

      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Erreur création commande:", error);
      setError(
        error.response?.data?.message ||
          "Erreur lors de la création de la commande"
      );
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <Container className="my-5">
        <Card className="text-center p-5">
          <Card.Body>
            <h2 style={{ color: "#000000", fontWeight: "bold" }}>
              Panier vide
            </h2>
            <p className="text-muted mb-4">
              Votre panier est actuellement vide.
            </p>
            <Button
              style={{ backgroundColor: "#0074c7", border: "none" }}
              onClick={() => navigate("/products")}
            >
              Découvrir nos produits
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1
        className="text-center mb-4"
        style={{ color: "#000000", fontWeight: "bold" }}
      >
        Mon Panier
      </h1>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {success && <Alert variant="success">{success}</Alert>}

      <div className="row">
        <div className="col-md-8">
          <Card style={{ border: "2px solid #00497c" }} className="mb-4">
            <Card.Body>
              <h4 className="mb-3">Articles ({cartItems.length})</h4>

              <Table responsive>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Taille</th>
                    <th>Couleur</th>
                    <th>Prix</th>
                    <th>Quantité</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.variantId}>
                      <td>
                        <strong>{item.productName}</strong>
                        <br />
                        <small className="text-muted">
                          SKU: {item.variantSku}
                        </small>
                      </td>
                      <td>{item.size}</td>
                      <td>{item.color}</td>
                      <td>{item.price.toFixed(2)} €</td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.variantId,
                              parseInt(e.target.value)
                            )
                          }
                          style={{ width: "80px" }}
                        />
                      </td>
                      <td>
                        <strong>
                          {(item.price * item.quantity).toFixed(2)} €
                        </strong>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.variantId)}
                        >
                          ✕
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Button
                variant="outline-secondary"
                onClick={() => navigate("/products")}
              >
                ← Continuer mes achats
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card style={{ border: "2px solid #00497c" }} className="mb-4">
            <Card.Body>
              <h4 className="mb-3">Récapitulatif</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Sous-total:</span>
                <strong>{getTotal().toFixed(2)} €</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Livraison:</span>
                <strong>Gratuite</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <h5>Total:</h5>
                <h5 style={{ color: "#0074c7" }}>{getTotal().toFixed(2)} €</h5>
              </div>
            </Card.Body>
          </Card>

          <Card style={{ border: "2px solid #00497c" }}>
            <Card.Body>
              <h4 className="mb-3">Informations de livraison</h4>

              <Form onSubmit={handleCreateOrder}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleChange}
                    required
                    placeholder="123 rue de la Paix"
                    style={{ border: "2px solid #00497c" }}
                  />
                </Form.Group>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Code postal *</Form.Label>
                      <Form.Control
                        type="text"
                        name="postalCode"
                        value={shippingData.postalCode}
                        onChange={handleChange}
                        required
                        placeholder="13001"
                        style={{ border: "2px solid #00497c" }}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Ville *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleChange}
                        required
                        placeholder="Marseille"
                        style={{ border: "2px solid #00497c" }}
                      />
                    </Form.Group>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Notes (optionnel)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="notes"
                    value={shippingData.notes}
                    onChange={handleChange}
                    placeholder="Instructions de livraison..."
                    style={{ border: "2px solid #00497c" }}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  size="lg"
                  disabled={loading}
                  style={{ backgroundColor: "#0074c7", border: "none" }}
                >
                  {loading ? "Création..." : "Valider la commande"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default CartPage;
