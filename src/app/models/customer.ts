import { Patient } from './patient';
import { Test } from './test';
import { Turn } from './turn';

/* export interface CustomerCenter {
    id?: number;
    code: string;
    description: string;
    address: string;
    phone: string;
    emailList?: string;
    rut: string;
    admRegionId?: number;
    admCommuneId?: number;
    admProvinceId?: number;
    responsibleUserId?: number;
    userId: number;
    status: boolean;
    tests?: number[];
    turns?: number[];
    patients?: CustomerPatientDTO[];
}
export interface CustomerCenterTestDTO {
    id?: number;
    customerCenterId: number;
    testId: number;
}

export interface CustomerCenterTurnDTO {
    id?: number;
    customerCenterId: number;
    turnId: number;
}

export interface CustomerPatientDTO {
    id?: number;
    customerCenterId?: number;
    patientId: number;
    turnId?: number;
}
*/


export interface CustomerCenterTurnDTO {
    id?: number;
    customerCenterId: number;
    turnId: number;
}

export interface Customer {
    id?: number;
    code: string;
    description: string;
    address: string;
    phone?: string;
    emailList?: string[];
    rut: string;
    region: string;
    commune: string;
    province: string;
    userId: number;
    status: boolean;
    tests?: number[];
    turns?: number[];
    patients?: Patient[];
}

/**
 * New Customer Center interface defined by backend endpoint response
 * @author Diego Beltran
 * @since 2020-10-27
 */
export interface CustomerCenter {
    id?: number;
    code: string;
    description: string;
    address: string;
    phone: string;
    emailList?: string[];
    rut: string;
    admRegionId?: number;
    admCommuneId?: number;
    admProvinceId?: number;
    responsibleUserId?: number;
    userId: number;
    status: boolean;
    tests?: number[];
    turns?: number[];
    patients?: CustomerPatientDTO[];
}

export interface CustomerPatientDTO {
    id?: number;
    customerCenterId?: number;
    patientId: number;
    turnId?: number;
}

export interface CustomerCenterData {
    customerCenter: Customer;
    agreementTests: Test[];
    turns: Turn[];
    patients: Patient[];
}
