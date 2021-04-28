// Cargamos los modelos para usarlos posteriormente
const Integracion = require('../model/Integracion');
const Migracion = require('../model/Migracion');

exports.listInt = async function() {
    try{
        let result = await Integracion.find({completed: false});
        return result;
    }catch (error) {
        console.log(error)
    };
};

exports.listMig = async function() {
    try{
        let result = await Migracion.find({completed: false});
        return result;
    }catch (error) {
        console.log(error)
    };
};

exports.read = async function(integracionId) {
    let result = await Integracion.findById(integracionId);
    console.log(result);
    console.log(result.solicitante);
    return result;
};

exports.create = async function(body) {

    var integraciones = [];
    var nInteg;
    if (body.OLT === body.OLT.toString()){
        singleInteg = {
            id: 0,
            OLT: body.OLT,
            central: body.central,
            MIGA: body.MIGA,
            agregador: body.agregador,
            DN: body.DN,
            POP: body.POP,
            poolesIPv4JZZ: [],
            poolLIJZZ: "",
            RelayJZZ: "",
            poolesDinOSP: [],
            poolesSuspOSP: [],
            poolesFijOSP: [],
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
                id: i,
                OLT: body.OLT[i],
                central: body.central[i],
                MIGA: body.MIGA[i],
                agregador: body.agregador[i],
                DN: body.DN[i],
                POP: body.POP[i],
                poolesIPv4JZZ: [],
                poolLIJZZ: "",
                RelayJZZ: "",
                poolesDinOSP: [],
                poolesSuspOSP: [],
                poolesFijOSP: [],
                poolIPv6JZZ: "",
                poolIPv6OSP: "",
                CGNJZZ: "",
                CGNOSP: ""
            };
            console.log(singleInteg)
            integraciones.push(singleInteg);
        }
    }

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
    let completado = false;
    if (body.completed === "True"){
        completado = true;
    }
    let nInteg;
    let solicitud = await Integracion.findById(integracionId);
    console.log(solicitud.integraciones);
    nInteg = solicitud.integraciones.length;
    console.log ("el número de integraciones es de " + nInteg);
    console.log(body);
    if (nInteg === 1){
        let result= await Integracion.findOneAndUpdate({_id: integracionId},
            { $set: {
                    //completed: completado,
                    dateId: body.idSolicitud,
                    'integraciones.0.poolesIPv4JZZ': body.PoolJZZ0,
                    'integraciones.0.poolLIJZZ': body.PoolLIJZZ0,
                    'integraciones.0.RelayJZZ': body.RelayJZZ0,
                    'integraciones.0.poolesDinOSP': body.PoolDinOSP0,
                    'integraciones.0.poolesSuspOSP': body.PoolSuspOSP0,
                    'integraciones.0.poolesFijOSP': body.PoolFijOSP0,
                    'integraciones.0.poolIPv6JZZ': body.PoolIPv6JZZ0,
                    'integraciones.0.poolIPv6OSP': body.PoolIPv6OSP0,
                    'integraciones.0.CGNJZZ': body.PoolCGNJZZ0,
                    'integraciones.0.CGNOSP': body.PoolCGNOSP0

                }});
        return result;
    } else {
        let integraciones = [];
        let bodyvalues = Object.values(body);
        console.log(bodyvalues);
        let prev= await Integracion.findById(integracionId);
		console.log(prev);
        for (let i = 0; i< nInteg; i++){
            integraciones.push({
                OLT: prev.integraciones[i].OLT,
                central: prev.integraciones[i].central,
                MIGA: prev.integraciones[i].MIGA,
                agregador:prev.integraciones[i].agregador,
                DN: prev.integraciones[i].DN,
                POP: prev.integraciones[i].POP,
                poolesDinOSP: bodyvalues[i*10+2],
                poolesSuspOSP: bodyvalues[i*10+3],
                poolesFijOSP: bodyvalues[i*10+4],
                poolIPv6OSP: bodyvalues[i*10+5],
                CGNOSP: bodyvalues[i*10+6],
                poolesIPv4JZZ: bodyvalues[i*10+7],
                poolLIJZZ: bodyvalues[i*10+8],
                RelayJZZ: bodyvalues[i*10+9],
                poolIPv6JZZ: bodyvalues[i*10+10],
                CGNJZZ: bodyvalues[i*10+11]
                });
            console.log(integraciones[i]);
            console.log("el id de mi solicitud es " + integracionId)
            let result= await Integracion.findOneAndUpdate({_id: integracionId, 'integraciones.id': i},
                { $set: {
                    //completed: completado,
                    dateId: body.idSolicitud,
                    'integraciones.$': integraciones[i]
                    }}
            );
        }
        return console.log("Ojala salga bien.");
    }

};

exports.search = async function (body) {
    console.log(body);
    if (body.categoria === "id"){
        let result = await Integracion.find({dateId: body.infor});
        console.log(result);
        return result;
    }
    else if (body.categoria === "solicitante"){
        let result = await Integracion.find({solicitante: body.infor});
        console.log(result);
        return result;
    }
    else if (body.categoria === "olt"){
        let result = await Integracion.find({"integraciones.OLT": body.infor});
        console.log(result);
        return result;
    }
    else if (body.categoria === "agregador"){
        let result = await Integracion.find({"integraciones.agregador": body.infor});
        console.log(result);
        return result;
    }
    else if (body.categoria === "pool") {
        let result = await Integracion.find({ $or:[
                {"integraciones.poolLIJZZ": body.infor},
                {"integraciones.RelayJZZ": body.infor},
                {"integraciones.poolesIPv4JZZ": body.infor},
                {"integraciones.poolesDinOSP": body.infor},
                {"integraciones.poolesSuspOSP": body.infor},
                {"integraciones.poolesFijOSP": body.infor},
                {"integraciones.poolIPv6JZZ": body.infor},
                {"integraciones.poolIPv6OSP": body.infor},
                {"integraciones.CGNOSP": body.infor},
                {"integraciones.CGNJZZ": body.infor}
        ]});
        return result;
    }
};
