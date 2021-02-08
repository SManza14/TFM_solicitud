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

    var newDoc = new Integracion({
        OLT: body.OLT,
        central: body.central,
        MIGA: body.MIGA,
        agregador: body.agregador,
        DN: body.DN,
        POP: body.POP,
        poolesIPv4JZZ: [],
        poolesIPv4OSP: [],
        poolIPv6JZZ: "",
        poolIPv6OSP: "",
        CGNJZZ: "",
        CGNOSP: "",
        completed: false
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
