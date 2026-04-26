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
            <img
              src="/images/logo.svg"
              alt="Prestige Gentlemen Logo"
              style={{ height: "40px", marginBottom: "10px", display: "block" }}
            />
            <h6
              style={{
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Messieurs de prestige
            </h6>
            <p className="mb-0">{"L'élégance pour votre jour parfait"}</p>
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
            <p>
              Courriel :{" "}
              <a
                href="mailto:contact@prestige-gentlemen.fr"
                className="text-white text-decoration-none"
              >
                contact@prestige-gentlemen.fr
              </a>
            </p>
            <p>Tél : 01 23 45 67 89</p>
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
