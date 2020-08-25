import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";

import { Model } from 'mongoose';

import { Desafio } from "./interfaces/desafio.interface";
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { JogadoresService } from '../jogadores/jogadores.service';
import { CategoriasService } from '../categorias/categorias.service';


@Injectable()
export class DesafioService {

    constructor(
        @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
        private readonly jogadoresService: JogadoresService,
        private readonly categoriaService: CategoriasService,
    ) {}

    async criar(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {

        /* 
        Verificar se os jogadores informados são válidos
        */
        criarDesafioDto.jogadores.forEach(async jogadorDto => {
            const jogadorEncontrado = await this.jogadoresService.consultaJogadoresPorId(jogadorDto._id);
            if (!jogadorEncontrado) {
                throw new BadRequestException(`O id ${jogadorDto._id} não foi encontrao!`);
            }
        });

        /* 
        Verificar se o solicitante é um jogador da partida
        */
        const solicitanteEJogadorDaPartida = criarDesafioDto.jogadores.find(
          jogador => jogador._id === criarDesafioDto.solicitante._id
        );

        if (!solicitanteEJogadorDaPartida) {
            throw new BadRequestException(`O solicitante deve ser um jogador da partida!`);
        }

        const categoriaDoJogador = await this.categoriaService.consultarCategoriaDoJogador(criarDesafioDto.solicitante);

        if (!categoriaDoJogador) {
            throw new BadRequestException(`O jogador de id ${criarDesafioDto.solicitante._id} não pertence a uma categoria`);
        }

        const desafioCriado = new this.desafioModel(criarDesafioDto);
        desafioCriado.categoria = categoriaDoJogador.categoria;
        desafioCriado.dataHoraSolicitacao = new Date();

        return await desafioCriado.save();
    }

}