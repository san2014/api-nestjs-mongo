import { BadRequestException } from '@nestjs/common';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Jogador } from './interfaces/jogador.interface';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

import { v1 as uuidv1 } from 'uuid'; 

@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name);

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}
    
    async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {

        const { email } = criarJogadorDto;

        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();

        if(jogadorEncontrado) {
            throw new BadRequestException(`Jogador com email ${email} já cadastrado`);
        } 

        const jogadorCriado = new this.jogadorModel(criarJogadorDto);
        return await jogadorCriado.save();

    }

    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {

        const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec();

        if(!jogadorEncontrado) {
            throw new NotFoundException(`O Jogador com id ${_id} não encontrado!`);
        } 
        
        await this.jogadorModel.findOneAndUpdate({_id},
            {$set: atualizarJogadorDto}).exec();

    }    

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec();
    }


    async consultaJogadoresPorId(_id: string): Promise<Jogador> {

        const jogadorEncontrado = await this.encontrarJogador(_id);
        
        if (!this.encontrarJogador(_id)) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
        }

        return jogadorEncontrado;

    }

    async deletarJogador(_id: string): Promise<any> {
        
        if (!this.encontrarJogador(_id)) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
        }    

        return await this.jogadorModel.deleteOne({_id}).exec();

    }

    private encontrarJogador(_id: string): Promise<Jogador> {
        return this.jogadorModel.findOne({_id}).exec();
    }

    
}
