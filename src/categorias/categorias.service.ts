import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

@Injectable()
export class CategoriasService {



  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async criarCategoriaDto(categoriaDto: CriarCategoriaDto): Promise<Categoria> {
    const { categoria } = categoriaDto;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada!`);
    }

    const categoriaCriada = new this.categoriaModel(categoriaDto);

    return await categoriaCriada.save();
  }

  async consultarTodascategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find().populate("jogadores").exec();
  }

  async consultarCategoriaPorId(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`A Categoria ${categoria} não enontrada`);
    }

    return categoriaEncontrada;
  }

  async atualizarCategoria(categoria: string, atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
    const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada!`);
    }

    await this.categoriaModel.findOneAndUpdate({categoria}, {$set: atualizarCategoriaDto}).exec();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();
    await this.jogadoresService.consultaJogadoresPorId(idJogador);
    const jogadorJaCadastradoCategoria = await this.categoriaModel.find({categoria})
      .where('jogadores').in(idJogador).exec();

    if (!categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} não cadastrada!`);
    }

    if(jogadorJaCadastradoCategoria.length > 0) {
      throw new BadRequestException(`Jogador com ${idJogador} cadastrado na Categoria ${categoria}`);
    }

    categoriaEncontrada.jogadores.push(idJogador);

    await this.categoriaModel.findOneAndUpdate({categoria}, {$set: categoriaEncontrada}).exec();
  }

  async consultarCategoriaDoJogador(solicitante: Jogador): Promise<Categoria> {
    return await this.categoriaModel.findOne()
      .where('jogadores').in(solicitante._id).exec();
  }  

}
