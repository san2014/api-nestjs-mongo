import { Controller, Post, UsePipes, ValidationPipe, Body, Get, Logger, Query, Put, Param, Delete } from "@nestjs/common";
import { DesafioService } from './desafio.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from "./interfaces/desafio.interface";
import { AtualizarDesafioDto } from "./dtos/atualizar-desafio-dto";
import { DesafioStatusValidacaoPipe } from "./pipe/desafio-status-validation.pipe";
import { AtribuirDesafioPartidaDto } from "./dtos/atribuir-desafio-partida.dto";

@Controller("/api/v1/desafios")
export class DesafioController {

    private readonly logger = new Logger(DesafioController.name);

    constructor(private readonly desafioService: DesafioService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async criar(@Body() criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        return await this.desafioService.criar(criarDesafioDto);
    }

    @Get('/:idDesafio')
    async obterDesafio(
        @Param('idDesafio') _id: string
    ): Promise<Desafio> {
        return await this.desafioService.obterDesafio(_id);
    }

    @Get()
    async consultarDesafios(
        @Query('idJogador') _id: string,
    ): Promise<Desafio[]> {
        return _id? await this.desafioService.consultarDesafiosDeUmJogador(_id) : 
            await this.desafioService.consultarDesafios();
    }

    @Put('/:desafio')
    async atualizarDesafio(
        @Body(DesafioStatusValidacaoPipe) atualizarDesafiodto: AtualizarDesafioDto,
        @Param('desafio') _id: string): Promise<void> {
            await this.desafioService.atualizarDesafio(_id, atualizarDesafiodto);
        }

    @Post('/:desafio/partida/')
    async atribuirPartida(
        @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
        @Param('desafio') _id: string): Promise<void> {
            return await this.desafioService.atribuirDesafioPartidaDto(_id, atribuirDesafioPartidaDto);
        }
    
    @Delete('/:desafio')
    async deletarPartida(
        @Param('desafio') _id: string
    ): Promise<void> {
        return await this.desafioService.deletarDesafio(_id);
    }
}