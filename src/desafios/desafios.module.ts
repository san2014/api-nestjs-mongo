import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DesafioController } from './desafio.controller';
import { DesafioService } from './desafio.service';
import { DesafioSechema } from './interfaces/desafio.schema';
import { JogadoresModule } from '../jogadores/jogadores.module';
import { CategoriasModule } from '../categorias/categorias.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Desafio', schema: DesafioSechema}]),
        JogadoresModule,
        CategoriasModule,
    ],
    controllers: [
        DesafioController
    ],
    providers: [
        DesafioService
    ]
})
export class DesafiosModule {}
