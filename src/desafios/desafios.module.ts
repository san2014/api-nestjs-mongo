import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DesafioController } from './desafio.controller';
import { DesafioService } from './desafio.service';
import { DesafioSechema } from './interfaces/desafio.schema';
import { JogadoresModule } from '../jogadores/jogadores.module';
import { CategoriasModule } from '../categorias/categorias.module';
import { PartidaSchema } from './interfaces/partida.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Desafio', schema: DesafioSechema}]),
        MongooseModule.forFeature([{name: 'Partida', schema: PartidaSchema}]),
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
