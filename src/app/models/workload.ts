import { Turn } from './turn';

export interface WorkloadTurnDTO extends Turn {
    // id?: number;
    // workloadId?: number;
    turnId: number;
    sampleTakeDate: Date;
    checked: boolean;
}

export interface Workload {
    id?: number;
    customerCenterId: number;
    workloadDate: Date;
    toBill: boolean;
    workloadStatus: string;
    status: boolean;
    userId: number;
    patientsIds?: number[];
    testsIds?: number[];
    turns?: WorkloadTurnDTO[];
}
