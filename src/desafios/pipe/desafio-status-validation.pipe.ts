import { DesafioStatus } from './../desaftio-status.enum';
import { PipeTransform, BadRequestException } from '@nestjs/common';

export class DesafioStatusValidacaoPipe implements PipeTransform {

    readonly statusPermitidos = [
        DesafioStatus.ACEITO,
        DesafioStatus.NEGADO,
        DesafioStatus.CANCELADO
    ];

    transform(value: any) {
        const status = value.status.toUpperCase();

        if(!this.ehStatusValido(status)) {
            throw new BadRequestException(`${status} é um status inválido`);
        }

        return value;
    }

    private ehStatusValido(status: any) {
        const idx = this.statusPermitidos.indexOf(status);
        return idx !== -1;
    }

}