const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const db = require("../model");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {

    let token = req.cookies['x-access-token'];

    if (!token) {
        let ErrMessage = "Por favor, haz login en el sistema."
        res.status(403).render("login", {ErrMessage: ErrMessage});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            let ErrMessage = "Por favor, haz login en el sistema."
            res.status(403).render("login", {ErrMessage: ErrMessage});
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

isUser = (req, res, next) => {
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


                if (roles[0].name === "moderator" || roles[0].name === "admin" || roles[0].name === "user") {
                    next();
                    return;
                }

                let ErrMessage = "Por favor, haz login en el sistema."
                res.status(403).render("login", {ErrMessage: ErrMessage});
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