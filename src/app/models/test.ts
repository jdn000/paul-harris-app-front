export interface Test {
    id?: number;
    code?: string;
    description?: string;
    abbreviation?: string;
    isMicro?: boolean;
    status?: boolean;
    printable?: boolean;
    userId?: number;
    testVersion?: TestVersion;
    testFormula?: TestFormula [];
    testReferenceRange?: TestReferenceRange [];
    orderId?: number;
    orderTubeId?: number;
    registerDate?: Date;
    registerHour?: string;
    testStatus?: TestStatus;
    tubeId?: number;
    labeled?: boolean;
    extractionDatetime?: Date;
    extractionTime?: Date;
    extractionUser?: number;
    containerLabel?: string;
    tubeStatus?: boolean;
}

export interface TestVersion {
    id: number;
    testId: number;
    tubeId: number;
    status: boolean;
    formula: string;
    versionDate: Date;
    primaryUnit: string;
    automaticResult: string;
    comment: string;
    userId: number;
}
export interface TestFormula {
    id: number;
    status: boolean;
    variableName: string;
    testId: number;
    testVersionId: number;
    userId: number;
}
export interface TestReferenceRange {
    id: number;
    low: number;
    high: number;
    panicLow: number;
    panicHigh: number;
    toleranceLow: number;
    toleranceHigh: number;
    literal: string;
    physiology: string;
    startRangeUnit: string;
    endRangeUnit: string;
    testVersionId: number;
    status: boolean;
    userId: number;
}
export interface TestData {
    test: Test;
    testVersion: TestVersion;
    testFormula: TestFormula[];
    testReferenceRange: TestReferenceRange[];
}

export enum TestStatus {
    PENDING = 'PENDING',
    WITH_RESULT = 'WITH_RESULT',
    VALIDATED = 'VALIDATED',
    INFORMED = 'INFORMED',
}
