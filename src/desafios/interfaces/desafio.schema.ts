import * as mongoose from 'mongoose';

export const DesafioSechema = new mongoose.Schema({
    desafio: {type: String, unique: true},
    dataHoraDesafio: {type: Date},
    status: {type: String},
    dataHoraSolicitacao: {type: Date},
    dataHoraResposta: {type: Date},
    solicitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jogador'
    },
    partida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partida'        
    }
}, {timestamps: true, collection: 'desafios'})