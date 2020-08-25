import { Controller, Post, UsePipes, ValidationPipe, Body, Param } from "@nestjs/common";

import { PartidaService } from './partida.service';
import { CriarPartidaDto } from './dtos/criar-partida.dto';

import { Partida } from "./interfaces/partida.interface";

@Controller('api/v1/partidas')
export class PartidaController {

    constructor(private readonly partidaService: PartidaService) {}

    @Post('/:idGanhador')
    @UsePipes(ValidationPipe)
    async criar(
        @Body() criarPartidaDto: CriarPartidaDto,
        @Param('idGanhador') idGanhador: string,
    ): Promise<Partida> {
        return await this.partidaService.criar(idGanhador, criarPartidaDto);
    }

}