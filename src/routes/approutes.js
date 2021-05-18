const { authJwt } = require("../middleware");
const IntMigController = require('../controllers/NuevaIntegracion');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/', (req, res, next) => {
        res.render('login');

    });

    /*
    app.get('/', (req, res, next) => {
        res.redirect('/home');
    });*/

    app.get('/home', [authJwt.verifyToken], async (req, res, next) => {
        res.render('index');
    });

    app.get('/nuevaIntegracion', [authJwt.verifyToken], (req, res, next) => {
        res.render('nuevaIntegracion');
    });

    app.get('/nuevaMigracion', [authJwt.verifyToken], (req, res, next) => {
        res.render('nuevaMigracion');
    });

    app.get('/search', [authJwt.verifyToken], (req, res, next) => {
        res.render('search');
    });

    app.get('/signup', [authJwt.verifyToken, authJwt.isAdmin], (req, res, next) => {
        res.render('signup');
    });

    app.post('/nuevaIntegracion', [authJwt.verifyToken], async (req, res, next) => {
        await IntMigController.createInt(req.body).catch(e => next(e));
        res.redirect('/nuevaIntegracion');
    });

    app.post('/nuevaMigracion', [authJwt.verifyToken], async (req, res, next) => {
        await IntMigController.createMig(req.body).catch(e => next(e));
        res.redirect('/nuevaIntegracion');
    });

    app.get('/solicitudes', [authJwt.verifyToken], async (req, res, next) => {
        let integraciones = await IntMigController.listInt().catch(e => next(e));
        let migraciones = await IntMigController.listMig().catch(e => next(e));
        res.render('solicitudes', {integraciones: integraciones, migraciones: migraciones});
    });

    app.get('/solicitudes/:solicitudId/fillIntegracion', [authJwt.verifyToken], async (req, res, next) => {
        let solicitudToFill = await IntMigController.read(req.params.solicitudId).catch(e => next(e));
        res.render('fillIntegracion', { solicitud: solicitudToFill, id_sol: req.params.solicitudId });
    });

    app.post('/solicitudes/:solicitudId/fillIntegracion', [authJwt.verifyToken], async (req, res, next) => {
        let solicitud = await IntMigController.addPools(req.params.solicitudId, req.body).catch(e => next(e));
        let integraciones = await IntMigController.listInt().catch(e => next(e));
        let migraciones = await IntMigController.listMig().catch(e => next(e));
        res.render('solicitudes', {integraciones: integraciones, migraciones: migraciones});
    });

    app.get('/delete/:solicitudId', [authJwt.verifyToken], async (req, res, next) => {
        let deleted = await IntMigController.delete(req.params.solicitudId).catch(e => next(e));
        let integraciones = await IntMigController.listInt().catch(e => next(e));
        let migraciones = await IntMigController.listMig().catch(e => next(e));
        res.render('solicitudes', {integraciones: integraciones, migraciones: migraciones});
    });

    app.get('/detail/integracion/:solicitudId', [authJwt.verifyToken], async (req, res, next) => {
        let solicitud = await IntMigController.readInt(req.params.solicitudId).catch(e => next(e));
        res.render('detailIntegracion', { solicitud: solicitud, id_sol: req.params.solicitudId });
    });

    app.get('/detail/migracion/:solicitudId', [authJwt.verifyToken], async (req, res, next) => {
        let solicitud = await IntMigController.readMig(req.params.solicitudId).catch(e => next(e));
        res.render('detailMigracion', { solicitud: solicitud, id_sol: req.params.solicitudId });
    });


    app.post('/solicitudes/result', [authJwt.verifyToken], async (req, res, next) => {
        let integraciones = await IntMigController.searchInteg(req.body).catch(e => next(e));
        let migraciones = await IntMigController.searchMig(req.body).catch(e => next(e));
        res.render('solicitudes', {integraciones: integraciones, migraciones: migraciones});
    });
};