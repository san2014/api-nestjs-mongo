import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PartidaSchema } from './interfaces/partida.schema';
import { PartidaController } from './partida.controller';
import { PartidaService } from './partida.service';
import { JogadoresModule } from '../jogadores/jogadores.module';

@Module({
    imports: [
      MongooseModule.forFeature([{name: 'Partida', schema: PartidaSchema}]),
      JogadoresModule,
    ],
    controllers: [
      PartidaController
    ],
    providers: [
      PartidaService
    ]
  })
export class PartidasModule {}
