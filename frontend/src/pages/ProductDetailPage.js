import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { productAPI, reviewAPI } from "../services/api";
import { useCart } from "../context/CartContext";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProductDetails();
    loadReviews();
  }, [id]);

  const loadProductDetails = async () => {
    try {
      const response = await productAPI.getById(id);
      setProduct(response.data.product);

      if (
        response.data.product.variants &&
        response.data.product.variants.length > 0
      ) {
        setSelectedVariant(response.data.product.variants[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement produit:", error);
      setError("Produit non trouvé");
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getProductReviews(id);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Erreur chargement avis:", error);
    }
  };

  const handleVariantChange = (variantId) => {
    const variant = product.variants.find((v) => v.id === parseInt(variantId));
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock_quantity === 0) {
      return;
    }

    addToCart(product, selectedVariant, quantity);
    setAddedToCart(true);

    // Masquer le message après 3 secondes
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  if (loading) {
    return (
      <Container className="my-5">
        <p className="text-center">Chargement...</p>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error || "Erreur de chargement"}</Alert>
        <Button onClick={() => navigate("/products")}>
          Retour aux produits
        </Button>
      </Container>
    );
  }

  const uniqueSizes = [...new Set(product.variants.map((v) => v.size))].sort(
    (a, b) => {
      const sizeOrder = ["S", "M", "L", "XL", "XXL"];
      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    }
  );
  const uniqueColors = [...new Set(product.variants.map((v) => v.color))];

  return (
    <Container className="my-5">
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate("/products")}
      >
        ← Retour
      </Button>
      {addedToCart && (
        <Alert variant="success" className="text-center">
          ✅ Produit ajouté au panier avec succès!
        </Alert>
      )}
      <Row>
        <Col md={6}>
          <img
            src={
              product.image_url ||
              "https://via.placeholder.com/500x600?text=Costume"
            }
            alt={product.name}
            className="img-fluid rounded"
            style={{ width: "100%", border: "3px solid #000000" }}
          />
        </Col>

        <Col md={6}>
          <h1 style={{ color: "#000000", fontWeight: "bold" }}>
            {product.name}
          </h1>

          {product.is_featured && (
            <Badge
              className="mb-3"
              style={{
                backgroundColor: "#D4AF37",
                color: "#000000",
                fontSize: "1rem",
              }}
            >
              ⭐ Recommandé
            </Badge>
          )}

          <h2 className="my-3" style={{ color: "#0074c7" }}>
            {parseFloat(product.base_price).toFixed(2)} €
          </h2>

          <p className="mb-4">{product.description}</p>

          <Card className="mb-4" style={{ border: "2px solid #00497c" }}>
            <Card.Body>
              <h5 className="mb-3">Sélectionner une taille et couleur</h5>

              {product.variants && product.variants.length > 0 ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Taille:</strong>
                    </Form.Label>
                    <div className="d-flex gap-2 flex-wrap">
                      {uniqueSizes.map((size) => (
                        <Button
                          key={size}
                          variant={
                            selectedVariant?.size === size
                              ? "dark"
                              : "outline-dark"
                          }
                          onClick={() => {
                            const variant = product.variants.find(
                              (v) => v.size === size
                            );
                            if (variant) setSelectedVariant(variant);
                          }}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Couleur:</strong>
                    </Form.Label>
                    <div className="d-flex gap-2 flex-wrap">
                      {uniqueColors.map((color) => (
                        <Button
                          key={color}
                          variant={
                            selectedVariant?.color === color
                              ? "dark"
                              : "outline-dark"
                          }
                          onClick={() => {
                            const variant = product.variants.find(
                              (v) =>
                                v.color === color &&
                                v.size === selectedVariant.size
                            );
                            if (variant) setSelectedVariant(variant);
                          }}
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  {selectedVariant && (
                    <div className="mb-3">
                      <p className="mb-2">
                        <strong>Stock disponible:</strong>{" "}
                        <span
                          style={{
                            color:
                              selectedVariant.stock_quantity > 0
                                ? "green"
                                : "red",
                          }}
                        >
                          {selectedVariant.stock_quantity > 0
                            ? `${selectedVariant.stock_quantity} unité(s)`
                            : "Rupture de stock"}
                        </span>
                      </p>
                      <p className="mb-0">
                        <strong>SKU:</strong> {selectedVariant.sku}
                      </p>
                    </div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Quantité:</strong>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={selectedVariant?.stock_quantity || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      style={{ width: "100px" }}
                      disabled={
                        !selectedVariant || selectedVariant.stock_quantity === 0
                      }
                    />
                  </Form.Group>

                  <Button
                    size="lg"
                    className="w-100"
                    style={{ backgroundColor: "#0074c7", border: "none" }}
                    onClick={handleAddToCart}
                    disabled={
                      !selectedVariant || selectedVariant.stock_quantity === 0
                    }
                  >
                    Ajouter au panier
                  </Button>
                </>
              ) : (
                <p className="text-muted">
                  Aucun variant disponible pour ce produit.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h3 style={{ color: "#000000", fontWeight: "bold" }}>
            Avis clients ({reviews.length})
          </h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review._id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <strong>{review.userName}</strong>
                    <span style={{ color: "#D4AF37" }}>
                      {"⭐".repeat(review.rating)}
                    </span>
                  </div>
                  <p className="mt-2 mb-0">{review.comment}</p>
                  <small className="text-muted">
                    {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                  </small>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-muted">Aucun avis pour ce produit.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailPage;
