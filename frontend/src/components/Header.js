import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useCart } from "../context/CartContext";

function Header() {
  const isLoggedIn = localStorage.getItem("token");
  const { getItemCount } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const navLinkStyle = {
    color: "white",
    marginLeft: "15px",
    textDecoration: "none",
  };

  return (
    <Navbar
      expand="lg"
      style={{ backgroundColor: "#00497c", padding: "20px 0" }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          translate="no"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src="/images/logo.svg"
            alt="Prestige Gentlemen Logo"
            style={{ height: "50px", marginRight: "-60px" }}
          />
          <span
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            Prestige Gentlemen
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ backgroundColor: "white" }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" style={navLinkStyle} translate="no">
              Accueil
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              style={navLinkStyle}
              translate="no"
            >
              Produits
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" style={navLinkStyle} translate="no">
              Panier {getItemCount() > 0 && `(${getItemCount()})`}
            </Nav.Link>

            {isLoggedIn ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/orders"
                  style={navLinkStyle}
                  translate="no"
                >
                  Mes Commandes
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  style={navLinkStyle}
                  translate="no"
                >
                  Profil
                </Nav.Link>
                <Nav.Link
                  onClick={handleLogout}
                  style={navLinkStyle}
                  translate="no"
                >
                  Déconnexion
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  style={navLinkStyle}
                  translate="no"
                >
                  Connexion
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  style={navLinkStyle}
                  translate="no"
                >
                  Inscription
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
