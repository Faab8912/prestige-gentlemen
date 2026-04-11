import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer
      className="text-white mt-5 py-4"
      style={{ backgroundColor: "#00497c" }}
    >
      <Container>
        <div className="row">
          <div className="col-md-4">
            <h5 style={{ color: "white" }}>Messieurs de prestige</h5>
            <p>L'élégance pour votre jour parfait</p>
          </div>
          <div className="col-md-4">
            <h6>Navigation</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white text-decoration-none">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/products" className="text-white text-decoration-none">
                  Produits
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-white text-decoration-none"
                  translate="no"
                >
                  Connexion
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6>Contact</h6>
            <p>Email: contact@prestige-gentlemen.fr</p>
            <p>Tél: 01 23 45 67 89</p>
          </div>
        </div>
        <hr className="bg-white" />
        <div className="text-center">
          <p className="mb-0">
            © 2026 Prestige Gentlemen - Tous droits réservés
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
