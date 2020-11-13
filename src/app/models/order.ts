import { Demographic } from './demographic';
import { Test } from './test';

export interface Order {
    id?: number;
    orderCode: string;
    patientId: number;
    status: boolean;
    year: number;
    userId: number;
    observation?: string;
    demographic?: Demographic[];
    test?: Test[];
    customerCenterId?: number;
    turnId?: number;
    profiles?: number[];
    workloadId?: number;
}
