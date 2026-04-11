import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { productAPI } from "../services/api";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { id: "", name: "Tous les produits" },
    { id: "1", name: "Costumes 3 pièces" },
    { id: "2", name: "Smokings" },
    { id: "3", name: "Costumes casual chic" },
    { id: "4", name: "Chemises" },
    { id: "5", name: "Accessoires" },
    { id: "6", name: "Chaussures" },
  ];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = selectedCategory ? { categoryId: selectedCategory } : {};
      const response = await productAPI.getAll(params);

      // Ordre personnalisé exact selon tes fichiers images
      const customOrder = {
        2: 1, // Costume Élégance Marine
        12: 2, // Costume Élégance Blanc
        1: 3, // Costume 3 pièces Élégance Noire
        3: 4, // Costume 3 pièces Gris Anthracite
        5: 5, // Costume Élégance Vert
        6: 6, // Costume Élégance Bleu Foncé
        4: 7, // Smoking Classique Noir
        14: 8, // Costume Élégance Bleu Roi ← NOUVEAU
        7: 9, // Chemise Blanche Premium
        8: 10, // Cravate Soie Bleue
        9: 11, // Nœud Papillon Noir Satin
        10: 12, // Richelieu Cuir Noir
      };

      const sortedProducts = response.data.products.sort((a, b) => {
        return (customOrder[a.id] || 999) - (customOrder[b.id] || 999);
      });

      setProducts(sortedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement produits:", error);
      setLoading(false);
    }
  };
  return (
    <Container className="my-5">
      <h1
        className="text-center mb-4"
        style={{ color: "#000000", fontWeight: "bold" }}
      >
        Notre Collection
      </h1>

      <Row className="mb-4">
        <Col md={4} className="mx-auto">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ border: "2px solid #00497c" }}
            translate="no"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <>
          <p className="text-center text-muted mb-4">
            {products.length} produit(s) trouvé(s)
          </p>

          <Row>
            {products.map((product) => (
              <Col key={product.id} md={4} lg={3} className="mb-4">
                <Card
                  className="h-100 shadow-sm"
                  style={{ border: "2px solid #000000" }}
                >
                  <Card.Img
                    variant="top"
                    src={
                      product.image_url ||
                      "https://via.placeholder.com/300x200?text=Costume"
                    }
                    style={{
                      height: "450px",
                      objectFit: "contain",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="text-muted">
                      {product.description?.substring(0, 20)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5
                        className="mb-0"
                        style={{ color: "#000000", fontWeight: "bold" }}
                      >
                        {parseFloat(product.base_price).toFixed(2)} €
                      </h5>
                      <Link to={`/products/${product.id}`}>
                        <Button
                          variant="primary"
                          size="sm"
                          style={{ backgroundColor: "#0074c7", border: "none" }}
                        >
                          Voir détails
                        </Button>
                      </Link>
                    </div>
                    {product.is_featured && (
                      <div className="mt-2">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: "#D4AF37",
                            color: "#000000",
                          }}
                        >
                          ⭐ Recommandé
                        </span>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {products.length === 0 && !loading && (
        <p className="text-center">
          Aucun produit trouvé dans cette catégorie.
        </p>
      )}
    </Container>
  );
}

export default ProductsPage;
