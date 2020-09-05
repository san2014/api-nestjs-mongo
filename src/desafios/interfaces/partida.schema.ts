import * as mongoose from 'mongoose';

export const PartidaSchema = new mongoose.Schema({ 
    partida: {type: String, unique: true},
    def: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jogador'
    },
    resultado: [
        {
            set: {type: String}
        }
    ],
    jogadores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jogador"
    }]
}, {timestamps: true, collection: 'partidas'});