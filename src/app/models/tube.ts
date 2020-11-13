export interface Tube {
    id: number;
    code: string;
    description: string;
    abbreviation: string;
    borderColor: string;
    capColor: string;
    specimenId: number;
    userId: number;
    status: boolean;
}

/**
 * Interface tubos para modulo de recepcion
 */
export interface ReceptionTubeDTO {
    customerCenterDescription: string;
    customerCenterId: number;
    extractionDatetime: string;
    orderCode: string;
    orderId: number;
    orderTubeId: number;
    patientFirstname: string;
    patientId: string;
    patientLastname: string;
    tubeDescription: string;
    tubeLabel: string;
    tubeLabeled: boolean;
    tubeState: string;
    receptionDatetime: string;
    rejectionDatetime: string;
}
