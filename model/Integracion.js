'use strict'
const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const IntegracionSchema = Schema({
    solicitante: String,
    dateId: String,
    completed: Boolean,
    integraciones: [{
        OLT: String,
        central: String,
        MIGA: String,
        agregador: String,
        DN: String,
        POP: String,
        poolesIPv4JZZ: Array,
        poolesIPv4OSP: Array,
        poolIPv6JZZ: String,
        poolIPv6OSP: String,
        CGNJZZ: String,
        CGNOSP: String
    }]
});

module.exports = mongoose.model('Integracion', IntegracionSchema);
