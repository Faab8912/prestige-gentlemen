import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { productAPI } from "../services/api";

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAll({ featured: "true" });
      const sortedProducts = response.data.products.sort((a, b) => {
        // Mettre le Costume Marine (id=2) en premier
        if (a.id === 2) return -1;
        if (b.id === 2) return 1;
        return a.id - b.id;
      });
      setFeaturedProducts(sortedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement produits:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-white py-5" style={{ backgroundColor: "#000000" }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-3 fw-bold" style={{ color: "#0074c7" }}>
                Prestige Gentlemen
              </h1>
              <p className="lead fs-4">L'élégance pour votre jour parfait</p>
              <p className="mb-4">
                Découvrez notre collection de costumes de mariage haut de gamme,
                smokings et accessoires pour un look impeccable.
              </p>
              <Link to="/products">
                <Button
                  variant="primary"
                  size="lg"
                  style={{ backgroundColor: "#0074c7", border: "none" }}
                >
                  Découvrir la collection
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <h2
          className="text-center mb-4"
          style={{ color: "#000000", fontWeight: "bold" }}
        >
          Produits mis en avant
        </h2>
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <Row>
            {featuredProducts.map((product) => (
              <Col key={product.id} md={4} className="mb-4">
                <Card
                  className="h-100 shadow-sm"
                  style={{ border: "2px solid #000000" }}
                >
                  <Card.Img
                    variant="top"
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      height: "450px",
                      objectFit: "contain",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="text-muted">
                      {product.description.substring(0, 40)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5
                        className="mb-0"
                        style={{ color: "#000000", fontWeight: "bold" }}
                      >
                        {parseFloat(product.base_price).toFixed(2)} €
                      </h5>
                      <Link to={`/products/${product.id}`}>
                        <Button variant="outline-primary">Voir détails</Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {featuredProducts.length === 0 && !loading && (
          <p className="text-center">
            Aucun produit mis en avant pour le moment.
          </p>
        )}
      </Container>
    </div>
  );
}

export default HomePage;
