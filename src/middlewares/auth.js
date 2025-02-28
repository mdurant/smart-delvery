const jwt = require('jsonwebtoken');
process.loadEnvFile(); // Load .env file

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ code: 401, message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ code: 403, message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

module.exports = authenticate;