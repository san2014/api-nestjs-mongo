import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";

import { Partida } from './interfaces/partida.interface';
import { CriarPartidaDto } from './dtos/criar-partida.dto';
import { JogadoresService } from '../jogadores/jogadores.service';

@Injectable()
export class PartidaService {

    constructor(
        @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
        private readonly jogadorService: JogadoresService,
    ) { }    

    async criar(idGanhador: string, criarPartidaDto: CriarPartidaDto): Promise<Partida> {

        const jogadorGanhador = await this.jogadorService.consultaJogadoresPorId(idGanhador);

        if (!jogadorGanhador) {
            throw new NotFoundException(`Ganhador não é um jogador válido!`);
        }

        const ganhadorNaPartida = criarPartidaDto.jogadores.find(jogador => jogador._id === idGanhador);
        
        if (!ganhadorNaPartida) {
            throw new NotFoundException(`Ganhador não está na partida!`);
        }
        
        criarPartidaDto.def = jogadorGanhador;

        const partidaCriada = new this.partidaModel(criarPartidaDto);
        return await partidaCriada.save();
    }

}