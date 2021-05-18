const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const db = require("../model");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {

    let token = req.cookies['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                console.log(roles);
                if (roles[0].name === "admin") {
                    next();
                    return;
                }
                let ErrMessage = "No tienes permiso para realizar esta acción."
                res.status(403).render("index", {ErrMessage: ErrMessage});
                return;
            }
        );
    });
};

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }


                if (roles[0].name === "moderator" || roles[0].name === "admin") {
                    next();
                    return;
                }

                let ErrMessage = "No tienes permiso para realizar esta acción."
                res.status(403).render("index", {ErrMessage: ErrMessage});
                return;
            }
        );
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};
module.exports = authJwt;