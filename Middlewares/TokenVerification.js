<<<<<<< HEAD
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]

    const token = authHeader && authHeader.split(" ")[1];

    if (!token){
        return res.status(403).json({message:"No token provided, authorization denied", success:false})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            _id: decoded._id,
            username:decoded.username
        };
        next();
    }catch(e){
        res.status(401).json({message:"Token is invalid or expired, authorization denied"})
    }
}

module.exports = {verifyToken};
=======

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if(!token){
    return res.status(403).json({message:"No token provided authorization denied", success:false})
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      _id: decoded._id,
      username: decoded.username
    }
    next()
  }catch(e){
    res.status(401).json({message:"Invalid token authorization denied", success:false})
  }
  
}

module.exports = {verifyToken}
>>>>>>> 3026a650a96cb2363b3fea0273315efad23d1d31
