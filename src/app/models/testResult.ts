export interface TestResult {
    id?: number;
    orderTestId: number;
    registerDate?: Date;
    registerTime?: string;
    resultValue?: string;
    resultUserId?: number;
    validationUserId?: number;
    validationDate?: Date;
    validationTime?: string;
    resultDate?: Date;
    resultTime?: string;
    testVersionId?: number;
    rerun?: boolean;
    resultNumber?: number;
    testStatus?: TestStatus; // orderTest
}


export interface TestResultWithMetadata extends TestResult {

    isPanicResult?: boolean;
    isAlertResult?: boolean;
    // testVersion
    primaryUnit?: string;
    // testReferenceRange
    low?: number;
    high?: number;
    panicLow?: number;
    panicHigh?: number;
    alertLow?: number;
    alertHigh?: number;
    // test
    testCode?: string;
    abbreviation?: string;
    isMicro?: boolean;
}


export enum TestStatus {
    PENDING = 'PENDING',
    WITH_RESULT = 'WITH_RESULT',
    VALIDATED = 'VALIDATED',
    INFORMED = 'INFORMED',

}
