const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const IntegracionController = require('./controllers/NuevaIntegracion');

const app = express();

const mongoose = require('mongoose');
(async () => {
    try {
        await mongoose.connect('mongodb://localhost/solicitudes_db',{ useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Connected to Mongo!')
    } catch (err) {
        console.log('Error connecting to Database: ' + err)
    }
})()

app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res, next) => {
    res.redirect('/home');
});

app.get('/home', async (req, res, next) => {
    res.render('index');
});

app.get('/nuevaIntegracion', (req, res, next) => {
    res.render('nuevaIntegracion');
});

app.get('/nuevaMigracion', (req, res, next) => {
    res.render('nuevaMigracion');
});
/**
app.get('/solicitudes', (req, res, next) => {
    res.render('solicitudes');
});
**/
 app.post('/nuevaIntegracion', async (req, res, next) => {
    await IntegracionController.create(req.body).catch(e => next(e));
    res.redirect('/nuevaIntegracion');
});

app.get('/solicitudes', async (req, res, next) => {
    let integraciones = await IntegracionController.list().catch(e => next(e));
    res.render('solicitudes', {integraciones: integraciones});
});

app.get('/solicitudes/:solicitudId/fillIntegracion', async (req, res, next) => {

    let solicitudToFill = await IntegracionController.read(req.params.solicitudId).catch(e => next(e));

    res.render('fillIntegracion', { solicitud: solicitudToFill, id_sol: req.params.solicitudId });
});

app.post('/solicitudes/:solicitudId/fillIntegracion', async (req, res, next) => {
    console.log("Hola, he llegado a app");
    console.log(req.params);
    let solicitud = await IntegracionController.addPools(req.params.solicitudId, req.body).catch(e => next(e));
    let integraciones = await IntegracionController.list().catch(e => next(e));
    res.render('solicitudes', {integraciones: integraciones});
});


/**
app.post('/patients/filterByCity', async (req, res, next) => {
    let patients = await PatientController.filterPatientsByCity(req.body.city).catch(e => next(e))
    res.render('index', {patients: patients, patientDeleted: false});
});

app.post('/patients/filterByDiagnosis', async (req, res, next) => {
    let patients = await PatientController.filterPatientsByDiagnosis(req.body.diagnosis).catch(e => next(e))
    res.render('index', {patients: patients, patientDeleted: false});
});

app.post('/patients/filterByDate', async (req, res, next) => {
    let patients = await PatientController.filterPatientsBySpeacialistAndDate(req.body.specialist,req.body.start,req.body.end).catch(e => next(e))
    res.render('index', {patients: patients, patientDeleted: false});
});

app.get('/patients/:patientId', async (req, res, next) => {
    let patient = await PatientController.read(req.params.patientId).catch(e => next(e));
    res.render('show', {patient: patient});
});

app.put('/patients/:patientId', async (req, res, next) => {
    let patient = await PatientController.update(req.params.patientId, req.body).catch(e => next(e));
    res.render('show', {patient: patient});
});

app.delete('/patients/:patientId', async (req, res, next) => {
    let deleted = await PatientController.delete(req.params.patientId).catch(e => next(e));
    res.redirect('/patients?patientDeleted=true');
});

app.get('/patients/:patientId/edit', (req, res, next) => {
    let patientToEdit = {
        id: req.params.patientId,
        name: req.query.name,
        surname: req.query.surname,
        dni: req.query.dni,
        city: req.query.city
    }
    res.render('edit', {patient: patientToEdit});
});

app.get('/patients/:patientId/history', async (req, res, next) => {
    let patientToEditHistory = {
        id: req.params.patientId
    }
    res.render('history', { patient: patientToEditHistory });
});

app.put('/patients/:patientId/history', async (req, res, next) => {
    let patient = await PatientController.addPatientHistory(req.params.patientId, req.body).catch(e => next(e))
    res.render('show', {patient: patient});
});
**/

// handle 404 errors
app.use(function(req, res){
    res.status(404).render('notFound');
});

app.use(function(err, req, res, next) {
    console.log(err);
    res.status(500).render('error', { error: err});
});

const port = parseInt(process.env.PORT || '8001', 10);
app.listen(port, function() {
    console.log('App listening on port: ' + 8001);
});
