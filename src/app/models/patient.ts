import { Demographic } from './demographic';

export interface Patient {
    id?: number;
    patientId: string;
    firstName: string;
    lastName: string;
    secondSurname: string;
    sex: string;
    birthdate: Date;
    age: number;
    demographics?: Demographic[];
    userId: number;
    customerCenterId?: number;
    turnId?: number;
    status?: boolean;
}

/**
 * Interface pacientes para modulo de nomina
 */
export interface WorkloadPatientDTO {
    patientId: number;
    turnId: number;
    turnCode: string;
    patientFullName: string;
    patientRut: string;
    orderId: number;
    orderCode: string;
    checked: boolean;
}

export interface PatientGender {
    value: string;
    dedscription: string;
}

export enum PatientSex {
    M = 'Masculino',
    F = 'Femenino',
    G = 'Genérico'
}
