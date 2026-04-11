const adminMiddleware = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé - droits administrateur requis",
    });
  }

  next();
};

module.exports = adminMiddleware;
