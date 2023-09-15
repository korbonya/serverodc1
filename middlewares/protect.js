import Jwt  from "jsonwebtoken";

export const protect = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "you are not authorized" });
    const token = authorization.split(" ")[1];
    try {
        const decoded = Jwt.verify(token, "secretkey");
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
