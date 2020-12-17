import { AlumnCalification } from './calification';


export interface LearningObjective {
    id?: number;
    subjectId?: number;
    description?: string;
    gradeId?: number;
    name?: string;
    hasCalifications?: boolean;
}

export interface ObjectiveData {
    id?: number;
    description: string;
    name: string;
    objectiveId: number;
    status: boolean;
    califications: AlumnCalification[];
}
