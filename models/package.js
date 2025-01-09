const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const PackageSchema = new Schema({
    pais: { type: String, required: true },
    hotel: { type: String, required: true },
    precio: { type: Number, required: true },
    numeroPersonas: { type: Number, required: true },
    fechaIda: { type: Date, required: true },
    fechaSalida: { type: Date, required: true },
    actividadRecreativa: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    imagen: { type: String, required: true }
});

module.exports = model('Package', PackageSchema);
