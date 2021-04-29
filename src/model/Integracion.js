'use strict'
const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const IntegracionSchema = Schema({
    solicitante: String,
    dateId: String,
    completed: Boolean,
    integraciones: [{
        Intid: Number,
        OLT: String,
        central: String,
        MIGA: String,
        agregador: String,
        DN: String,
        POP: String,
        poolesIPv4JZZ: Array,
        poolLIJZZ: String,
        RelayJZZ: String,
        poolesDinOSP: Array,
        poolesSuspOSP: Array,
        poolesFijOSP: Array,
        poolIPv6JZZ: String,
        poolIPv6OSP: String,
        CGNJZZ: String,
        CGNOSP: String
    }]
});

module.exports = mongoose.model('Integracion', IntegracionSchema);
