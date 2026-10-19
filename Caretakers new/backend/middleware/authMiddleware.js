const jwt = require("jsonwebtoken");
const secretKey = "secretkey123"; // Same key used during login

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1]; // Format: Bearer <token>

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // decoded will include ID
    next();
  });
};

module.exports = authenticateUser;
