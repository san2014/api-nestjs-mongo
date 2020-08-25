import {
  Controller,
  UsePipes,
  ValidationPipe,
  Post,
  Body,
  Get,
  Param,
  Put,
} from '@nestjs/common';

import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() categoriasDTO: CriarCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriasService.criarCategoriaDto(categoriasDTO);
  }

  @Get()
  async consultarTodascategorias(): Promise<Categoria[]> {
    return await this.categoriasService.consultarTodascategorias();
  }

  @Get('/:categoria')
  async consultarCategoriaPeloId(
    @Param('categoria') categoria: string,
  ): Promise<Categoria> {
    return await this.categoriasService.consultarCategoriaPorId(categoria);
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('categoria') categoria: string
  ): Promise<void> {
    await this.categoriasService.atualizarCategoria(categoria, atualizarCategoriaDto);
  }

  @Post('/:categoria/jogadores/:idJogador')
  async atribuirCategoriaJogador(
    @Param() params: string[]
  ): Promise<void> {
    return await this.categoriasService.atribuirCategoriaJogador(params);
  }

  
}
