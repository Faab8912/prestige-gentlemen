import React, { useState, useEffect } from "react";
import { Container, Card, Badge, Alert } from "react-bootstrap";
import { orderAPI } from "../services/api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
      setError("Erreur lors du chargement des commandes");
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "warning", text: "En attente" },
      confirmed: { bg: "info", text: "Confirmée" },
      shipped: { bg: "primary", text: "Expédiée" },
      delivered: { bg: "success", text: "Livrée" },
      cancelled: { bg: "danger", text: "Annulée" },
    };

    const config = statusConfig[status] || { bg: "secondary", text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "warning", text: "En attente" },
      completed: { bg: "success", text: "Payé" },
      failed: { bg: "danger", text: "Échoué" },
    };

    const config = statusConfig[status] || { bg: "secondary", text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
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
      <h1
        className="text-center mb-4"
        style={{ color: "#000000", fontWeight: "bold" }}
      >
        Mes Commandes
      </h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>Aucune commande</h4>
            <p className="text-muted">
              Vous n'avez pas encore passé de commande.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div>
          <p className="text-muted mb-4">
            {orders.length} commande(s) trouvée(s)
          </p>

          {orders.map((order) => (
            <Card
              key={order.id}
              className="mb-4"
              style={{ border: "2px solid #00497c" }}
            >
              <Card.Body>
                <div className="row">
                  <div className="col-md-8">
                    <h5 style={{ color: "#0074c7" }}>
                      Commande #{order.order_number}
                    </h5>
                    <p className="mb-2">
                      <strong>Date:</strong>{" "}
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mb-2">
                      <strong>Adresse de livraison:</strong>{" "}
                      {order.shipping_address}, {order.shipping_postal_code}{" "}
                      {order.shipping_city}
                    </p>
                    {order.notes && (
                      <p className="mb-2">
                        <strong>Notes:</strong> {order.notes}
                      </p>
                    )}
                  </div>

                  <div className="col-md-4 text-md-end">
                    <h4
                      className="mb-3"
                      style={{ color: "#000000", fontWeight: "bold" }}
                    >
                      {parseFloat(order.total_amount).toFixed(2)} €
                    </h4>
                    <div className="mb-2">
                      <strong>Statut: </strong>
                      {getStatusBadge(order.status)}
                    </div>
                    <div>
                      <strong>Paiement: </strong>
                      {getPaymentStatusBadge(order.payment_status)}
                    </div>
                  </div>
                </div>

                {order.payment_method && (
                  <p className="mt-3 mb-0 text-muted">
                    <small>Méthode de paiement: {order.payment_method}</small>
                  </p>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

export default OrdersPage;
