export interface AdmRegion {
    id?: number;
    code: string;
    description: string;
    status: boolean;
}

export interface AdmProvince {
    id?: number;
    code: string;
    description: string;
    admRegionId: number;
    status: boolean;

}

export interface AdmCommune {
    id?: number;
    code: string;
    description: string;
    admProvinceId: number;
    status: boolean;
}
