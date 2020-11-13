export interface Printer {
    id?: number;
    code: string;
    description: string;
    tcpAddress: string;
    tcpPort: number;
    timeout: number;
    status: boolean;
    userId: number;
}
