import {
  Injectable,
  BadRequestException,
  Logger,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Desafio } from './interfaces/desafio.interface';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { JogadoresService } from '../jogadores/jogadores.service';
import { CategoriasService } from '../categorias/categorias.service';
import { DesafioStatus } from './desaftio-status.enum';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio-dto';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { Partida } from './interfaces/partida.interface';

@Injectable()
export class DesafioService {


  private readonly logger = new Logger(DesafioService.name);

  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriaService: CategoriasService,
  ) {}

  async criar(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    /* 
        Verificar se os jogadores informados são válidos
        */
    criarDesafioDto.jogadores.forEach(async jogadorDto => {
      const jogadorEncontrado = await this.jogadoresService.consultaJogadoresPorId(
        jogadorDto._id,
      );
      if (!jogadorEncontrado) {
        throw new BadRequestException(
          `O id ${jogadorDto._id} não foi encontrao!`,
        );
      }
    });

    /* 
        Verificar se o solicitante é um jogador da partida
        */
    const solicitanteEJogadorDaPartida = criarDesafioDto.jogadores.find(
      jogador => jogador._id === criarDesafioDto.solicitante._id,
    );

    if (!solicitanteEJogadorDaPartida) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }

    const categoriaDoJogador = await this.categoriaService.consultarCategoriaDoJogador(
      criarDesafioDto.solicitante,
    );

    if (!categoriaDoJogador) {
      throw new BadRequestException(
        `O jogador de id ${criarDesafioDto.solicitante._id} não pertence a uma categoria`,
      );
    }

    const desafioCriado = new this.desafioModel(criarDesafioDto);
    desafioCriado.categoria = categoriaDoJogador.categoria;
    desafioCriado.dataHoraSolicitacao = new Date();
    this.logger.log(
      `desafioCriado.dataHoraSoliitacao: ${desafioCriado.dataHoraSolicitacao}`,
    );

    desafioCriado.status = DesafioStatus.PENDENTE;
    this.logger.log(`desafioCriado: ${JSON.stringify(desafioCriado)}`);

    return await desafioCriado.save();
  }

  async obterDesafio(_id: string): Promise<Desafio> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();
    this.logger.log(JSON.stringify(desafioEncontrado));
    return desafioEncontrado;
  }  

  async consultarDesafios(): Promise<Desafio[]> {
    return await this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async consultarDesafiosDeUmJogador(_id: any): Promise<Desafio[]> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    const jogadorFilter = jogadores.filter(jogador => jogador._id == _id);

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O id ${_id} não é um jogador`);
    }

    return await this.desafioModel
      .find()
      .where('jogadores')
      .in(_id)
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  async atualizarDesafio(
    _id: string,
    atualizarDesafiodto: AtualizarDesafioDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`);
    }

    if (atualizarDesafiodto.status) {
      desafioEncontrado.dataHoraResposta = new Date();
    }

    desafioEncontrado.status = atualizarDesafiodto.status;
    desafioEncontrado.dataHoraDesafio = atualizarDesafiodto.dataHoraDesafio;

    this.logger.log(JSON.stringify(desafioEncontrado));

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async atribuirDesafioPartidaDto(_id: string, atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto): Promise<void> {
    
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if(!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`);
    }

    const jogadorFilter = desafioEncontrado.jogadores.filter( jogador => jogador._id == atribuirDesafioPartidaDto.def);

    this.logger.log(`desafioEncontrado: ${desafioEncontrado}`);
    this.logger.log(`jogadorFilter: ${jogadorFilter}`);

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O jogador vencedor não faz parte do desafio!`);
    }

    const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto);

    partidaCriada.categoria = desafioEncontrado.categoria;
    partidaCriada.jogadores = desafioEncontrado.jogadores;

    this.logger.log(JSON.stringify(partidaCriada));

    const resultado = await partidaCriada.save();

    desafioEncontrado.status = DesafioStatus.REALIZADO;
    desafioEncontrado.partida = resultado._id;

    try {
      await this.desafioModel.findOneAndUpdate({_id}, {$set: desafioEncontrado}).exec();
    } catch (error) {
      await this.partidaModel.deleteOne({_id: resultado._id}).exec();
      throw new InternalServerErrorException();
    }

  }  

  async deletarDesafio(_id: string): Promise<void> {
    
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if(!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`);
    }

    desafioEncontrado.status = DesafioStatus.CANCELADO;

    await this.desafioModel.findOneAndUpdate({_id}, {$set: desafioEncontrado}).exec();

  }

}
