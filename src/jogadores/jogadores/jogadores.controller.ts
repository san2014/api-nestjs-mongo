import { JogadoresValidacaoParametrosPipe } from './../pipes/jogadores-validacao-parametros.pipe';
import { Controller, Post, Body, Get, Query, Delete, HttpStatus, UsePipes, ValidationPipe, Param, Put } from '@nestjs/common';
import { CriarJogadorDto } from '../dtos/criar-jogador.dto';
import { JogadoresService } from '../jogadores.service';
import { Jogador } from '../interfaces/jogador.interface';
import { AtualizarJogadorDto } from '../dtos/atualizar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadoresService.criarJogador(criarJogadorDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string,
    @Body() atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
    return await this.jogadoresService.atualizarJogador(_id, atualizarJogadorDto);
  }

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadoresService.consultarTodosJogadores();
  }

  @Get('/:_id')
  async consultarJogadorPorId(
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string): Promise<Jogador> {
    return await this.jogadoresService.consultaJogadoresPorId(_id);
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', JogadoresValidacaoParametrosPipe) _id: string): Promise<void> {
    this.jogadoresService.deletarJogador(_id);
  }

}
