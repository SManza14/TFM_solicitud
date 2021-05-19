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

exports.readInt = async function(integracionId) {
    let result = await Integracion.findById(integracionId);
    console.log(result);
    console.log(result.solicitante);
    return result;
};

exports.readMig = async function(migracionId) {
    let result = await Migracion.findById(migracionId);
    console.log(result);
    console.log(result.solicitante);
    return result;
};

exports.createInt = async function(body) {

    var integraciones = [];
    var nInteg;
    if (body.OLT === body.OLT.toString()){
        singleInteg = {
            Intid: 0,
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
        console.log(body);
        for(var i = 0; i < nInteg; i++){
            singleInteg = {
                Intid: i,
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

exports.createMig = async function(body) {

    var migraciones = [];
    var nMig;
    if (body.central === body.central.toString()){
        singleMig = {
            Migid: 0,
            OLT: body.OLT,
            central: body.central,
            MIGA: body.MIGA,
            agregador_origen: body.agregadororigen,
            DN_origen: body.DNorigen,
            POP_origen: body.POPorigen,
            agregador_destino: body.agregadordestino,
            DN_destino: body.DNdestino,
            POP_destino: body.POPdestino,
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
        console.log(singleMig);
        migraciones.push(singleMig);
    } else {
        nMig = body.central.length;
        for(var i = 0; i < nMig; i++){
            singleMig = {
                Migid: i,
                OLT: body.OLT[i],
                central: body.central[i],
                MIGA: body.MIGA[i],
                agregador_origen: body.agregadororigen[i],
                DN_origen: body.DNorigen[i],
                POP_origen: body.POPorigen[i],
                agregador_destino: body.agregadordestino[i],
                DN_destino: body.DNdestino[i],
                POP_destino: body.POPdestino[i],
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
            console.log(singleMig)
            migraciones.push(singleMig);
        }
    }

    var newDoc = new Migracion({
        solicitante: body.solicitante,
        completed: false,
        dateId: "",
        migraciones: migraciones
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

exports.delete = async function(intMigId) {
    let exists = await Integracion.findById(intMigId);
    let result;
    if (exists != null){
        result= await Integracion.deleteOne({_id: intMigId});
    }
    exists = await Migracion.findById(intMigId);
    if (exists != null){
        result= await Migracion.deleteOne({_id: intMigId});
    }
    return result;
}

exports.addPoolsInt = async function (integracionId, body) {
    let completado = false;
    if (body.completed === "True"){
        completado = true;
    }
    let nInteg;
    let solicitud = await Integracion.findById(integracionId);
    nInteg = solicitud.integraciones.length;
    console.log(body);
    if (nInteg === 1){
        let result= await Integracion.findOneAndUpdate({_id: integracionId},
            { $set: {
                    completed: completado,
                    dateId: body.idSolicitud,
                    'integraciones.0.Intid': 0,
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
                Intid: i,
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
            let result= await Integracion.findOneAndUpdate({_id: integracionId, 'integraciones.Intid': i},
                { $set: {
                    completed: completado,
                    dateId: body.idSolicitud,
                    'integraciones.$': integraciones[i]
                    }}
            );
        }
        return;
    }

};

exports.addPoolsMig = async function (migracionId, body) {
    let completado = false;
    if (body.completed === "True"){
        completado = true;
    }
    let nMig;
    let solicitud = await Migracion.findById(migracionId);
    nMig = solicitud.migraciones.length;
    console.log(body);
    if (nMig === 1){

        let result= await Migracion.findOneAndUpdate({_id: migracionId},
            { $set: {
                    completed: completado,
                    dateId: body.idSolicitud,
                    'migraciones.0.Migid': 0,
                    'migraciones.0.poolesIPv4JZZ': body.PoolJZZ0.replace(" ", "").split("+"),
                    'migraciones.0.poolLIJZZ': body.PoolLIJZZ0.replace(" ", ""),
                    'migraciones.0.RelayJZZ': body.RelayJZZ0.replace(" ", ""),
                    'migraciones.0.poolesDinOSP': body.PoolDinOSP0.replace(" ", "").split("+"),
                    'migraciones.0.poolesSuspOSP': body.PoolSuspOSP0.replace(" ", "").split("+"),
                    'migraciones.0.poolesFijOSP': body.PoolFijOSP0.replace(" ", "").split("+"),
                    'migraciones.0.poolIPv6JZZ': body.PoolIPv6JZZ0.replace(" ", ""),
                    'migraciones.0.poolIPv6OSP': body.PoolIPv6OSP0.replace(" ", ""),
                    'migraciones.0.CGNJZZ': body.PoolCGNJZZ0.replace(" ", ""),
                    'migraciones.0.CGNOSP': body.PoolCGNOSP0.replace(" ", "")

                }});
        return result;
    } else {
        let migraciones = [];
        let bodyvalues = Object.values(body);
        console.log(bodyvalues);
        let prev= await Migracion.findById(migracionId);
        console.log(prev);
        for (let i = 0; i< nMig; i++){
            migraciones.push({
                Migid: i,
                OLT: prev.migraciones[i].OLT,
                central: prev.migraciones[i].central,
                MIGA: prev.migraciones[i].MIGA,
                agregador_origen: prev.migraciones[i].agregador_origen,
                DN_origen: prev.migraciones[i].DN_origen,
                POP_origen: prev.migraciones[i].POP_origen,
                agregador_destino: prev.migraciones[i].agregador_destino,
                DN_destino: prev.migraciones[i].DN_destino,
                POP_destino: prev.migraciones[i].POP_destino,
                poolesDinOSP: bodyvalues[i*10+2].replace(" ", "").split("+"),
                poolesSuspOSP: bodyvalues[i*10+3].replace(" ", "").split("+"),
                poolesFijOSP: bodyvalues[i*10+4].replace(" ", "").split("+"),
                poolIPv6OSP: bodyvalues[i*10+5].replace(" ", ""),
                CGNOSP: bodyvalues[i*10+6].replace(" ", ""),
                poolesIPv4JZZ: bodyvalues[i*10+7].replace(" ", "").split("+"),
                poolLIJZZ: bodyvalues[i*10+8].replace(" ", ""),
                RelayJZZ: bodyvalues[i*10+9].replace(" ", ""),
                poolIPv6JZZ: bodyvalues[i*10+10].replace(" ", ""),
                CGNJZZ: bodyvalues[i*10+11].replace(" ", "")
            });
            console.log(migraciones[i]);
            console.log("el id de mi solicitud es " + migracionId)
            let result = await Migracion.findOneAndUpdate({_id: migracionId, 'migraciones.Migid': i},
                { $set: {
                        completed: completado,
                        dateId: body.idSolicitud,
                        'migraciones.$': migraciones[i]
                    }}
            );
        }
        return;
    }

};

exports.searchInteg = async function (body) {
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


exports.searchMig = async function (body) {
    console.log(body);
    if (body.categoria === "id"){
        let result = await Migracion.find({dateId: body.infor});
        console.log(result);
        return result;
    }
    else if (body.categoria === "solicitante"){
        let result = await Migracion.find({solicitante: body.infor});
        console.log(result);
        return result;
    }
    else if (body.categoria === "olt"){
        let result = await Migracion.find({"migraciones.OLT": body.infor});
        console.log(result);
        return result;
    }
    else if (body.categoria === "agregador"){
        let result = await Migracion.find({ $or:[
            {"migraciones.agregador_origen": body.infor},
            {"migraciones.agregador_destino": body.infor}
            ]});
        console.log(result);
        return result;
    }
    else if (body.categoria === "pool") {
        let result = await Migracion.find({ $or:[
                {"migraciones.poolLIJZZ": body.infor},
                {"migraciones.RelayJZZ": body.infor},
                {"migraciones.poolesIPv4JZZ": body.infor},
                {"migraciones.poolesDinOSP": body.infor},
                {"migraciones.poolesSuspOSP": body.infor},
                {"migraciones.poolesFijOSP": body.infor},
                {"migraciones.poolIPv6JZZ": body.infor},
                {"migraciones.poolIPv6OSP": body.infor},
                {"migraciones.CGNOSP": body.infor},
                {"migraciones.CGNJZZ": body.infor}
            ]});
        return result;
    }
};
