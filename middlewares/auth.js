const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  //const token = req.headers['authorization'];
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No se proporcionó un token de autenticación" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token no válido o expirado" });
    }
    req.usuario = decoded;
    next();
  });
};
module.exports = authToken;
