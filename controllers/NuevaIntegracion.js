// Cargamos los modelos para usarlos posteriormente
const Integracion = require('../model/Integracion');

exports.list = async function() {
    try{
        let result = await Integracion.find();
        return result;
    }catch (error) {
        console.log(error)
    };
}

exports.read = async function(patientId) {
    let result = await Integracion.findById(patientId);
    console.log(result);
    console.log(result.name);
    return result;
}

exports.create = async function(body) {

    var integraciones = [];
    var nInteg = (Object.keys(body).length - 1) / 6;
    var bodyString = JSON.stringify(body);
    var bodyArray = bodyString.split(',');
    console.log(bodyArray);
    console.log("Número de integraciones: " + nInteg);

    for(var j = 0; j<bodyArray.length; j++){
        bodyArray[j] = bodyArray[j].substring(bodyArray[j].indexOf(":"));
        bodyArray[j] = bodyArray[j].replace(/[^a-zA-Z0-9 /-]/g, "");
    }
    console.log(bodyArray);

    for(var i = 0; i < nInteg; i++){
        console.log(bodyArray[i*6 + 1]);
        singleInteg = {
            OLT: bodyArray[i*6 + 1],
            central: bodyArray[i*6 + 2],
            MIGA: bodyArray[i*6 + 3],
            agregador: bodyArray[i*6 + 4],
            DN: bodyArray[i*6 + 5],
            POP: bodyArray[i*6 + 6],
            poolesIPv4JZZ: [],
            poolesIPv4OSP: [],
            poolIPv6JZZ: "",
            poolIPv6OSP: "",
            CGNJZZ: "",
            CGNOSP: ""
        };
        integraciones.push(singleInteg);
    }
    console.log(integraciones);
    var newDoc = new Integracion({
        solicitante: body.solicitante,
        completed: false,
        integraciones: integraciones
    });
    let result= await newDoc.save();
    return result;
}

exports.update= async function(integracionId, body) {
    let result= await Integracion.findOneAndUpdate({_id: integracionId},
        {OLT: body.OLT,
            central: body.central,
            MIGA: body.MIGA,
            agregador: body.agregador,
            DN: body.DN,
            POP: body.POP}, {new: true});
    return result;
}

exports.delete = async function(integracionId) {
    let result= await Integracion.deleteOne({_id: integracionId});
    return result;
}

exports.addPools = async function (patientId, medicalRecord) {

    let result= await Integracion.findOneAndUpdate({_id: patientId},
        {$push: {medicalHistory: [{
                    specialist: medicalRecord.specialist,
                    diagnosis: medicalRecord.diagnosis,
                    date: medicalRecord.date}]}}, {new: true});
    return result;
}
