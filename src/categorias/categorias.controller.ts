import {
  Controller,
  UsePipes,
  ValidationPipe,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';

import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { CategoriasService } from './categorias.service';

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
}
