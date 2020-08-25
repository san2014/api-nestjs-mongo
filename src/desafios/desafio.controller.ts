import { Controller, Post, UsePipes, ValidationPipe, Body } from "@nestjs/common";
import { DesafioService } from './desafio.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from "./interfaces/desafio.interface";

@Controller("/api/v1/desafios")
export class DesafioController {

    constructor(private readonly desafioService: DesafioService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async criar(@Body() criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        return await this.desafioService.criar(criarDesafioDto);
    }

}