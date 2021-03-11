// Cargamos los modelos para usarlos posteriormente
const Integracion = require('../model/Integracion');

exports.list = async function() {
    try{
        let result = await Integracion.find();
        return result;
    }catch (error) {
        console.log(error)
    };
};

exports.read = async function(integracionId) {
    let result = await Integracion.findById(integracionId);
    console.log(result);
    console.log(result.name);
    return result;
};

exports.create = async function(body) {

    var integraciones = [];
    var nInteg;
    if (body.OLT === body.OLT.toString()){
        singleInteg = {
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
            CGNOSP: ""
        };
        console.log(singleInteg);
        integraciones.push(singleInteg);
    } else {
        nInteg = body.OLT.length;
        for(var i = 0; i < nInteg; i++){
            singleInteg = {
                OLT: body.OLT[i],
                central: body.central[i],
                MIGA: body.MIGA[i],
                agregador: body.agregador[i],
                DN: body.DN[i],
                POP: body.POP[i],
                poolesIPv4JZZ: [],
                poolesIPv4OSP: [],
                poolIPv6JZZ: "",
                poolIPv6OSP: "",
                CGNJZZ: "",
                CGNOSP: ""
            };
            console.log(singleInteg)
            integraciones.push(singleInteg);
        }
    }
    /*var bodyString = JSON.stringify(body);
    var bodyArray = bodyString.split(',');
    console.log(bodyArray);
    console.log("Número de integraciones: " + nInteg);

    for(var j = 0; j<bodyArray.length; j++){
        bodyArray[j] = bodyArray[j].substring(bodyArray[j].indexOf(":"));
        bodyArray[j] = bodyArray[j].replace(/[^a-zA-Z0-9 /-]/g, "");
    }
    console.log(bodyArray);*/

    var newDoc = new Integracion({
        solicitante: body.solicitante,
        completed: false,
        dateId: "",
        integraciones: integraciones
    });
    let result= await newDoc.save();
    return result;
};

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

exports.addPools = async function (integracionId, body) {
    console.log(body);
    let result = await Integracion.findById(integracionId);
    console.log(result);
    /*
    var integraciones = [];
    var nInteg;
    if (body.RelayJZZ === body.RelayJZZ.toString()){
        let result= await Integracion.findOneAndUpdate({_id: integracionId},
            {$push: {integraciones: [{
                        specialist: body.specialist,
                        diagnosis: medicalRecord.diagnosis,
                        date: medicalRecord.date}]}}, {new: true});
    };*/
    return result;
};
