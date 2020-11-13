export enum DemographicType {
    CODED = 'CODED',
    FREE = 'FREE',
}

export enum DemographicUse {
    ORDER = 'ORDER',
    PATIENT = 'PATIENT',
}

export interface Demographic {
    id?: number;
    code?: string;
    type?: DemographicType;
    use?: DemographicUse;
    userId: number;
    isRequired?: boolean;
    value?: string;
    itemValue?: string;
    description?: string;
    status?: boolean;
    itemId?: number;
    items?: DemographicItems[];
}

export interface DemographicItems {
    id: number;
    code: string;
    description: string;
    demographicId: number;
    status: boolean;
    printable: boolean;
    userId: number;
}
