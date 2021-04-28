'use strict'
const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const MigracionSchema = Schema({
    solicitante: String,
    dateId: String,
    completed: Boolean,
    migraciones: [{
        id: Number,
        OLT: String,
        central: String,
        MIGA: String,
        agregador_origen: String,
        DN_origen: String,
        POP_origen: String,
        agregador_destino: String,
        DN_destino: String,
        POP_destino: String,
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

module.exports = mongoose.model('Migracion', MigracionSchema);