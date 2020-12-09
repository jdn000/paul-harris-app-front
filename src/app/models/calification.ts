

export interface CalificationIndicator {
  id?: number;
  calificationId?: number;
  indicatorsIds?: number[];
}


export interface CalificationCummulative {
  id?: number;
  calificationId?: number;
  cummulativeId?: number;

}

export interface CalificationTemplate {
  alumnFullName?: string;
  califications?: {
    id: number,
    value: number;
  }[];

}

export interface Calification {
  id?: number;
  subjectId?: number;
  isCummulative?: boolean;
  objectiveId?: number;
  evaluationNumber?: number;
  gradeId?: number;
  indicators?: number[];

  // tomado de AlumnCalif
  alumnId?: number;
  value?: number;
  calificationId?: number; // para notas acumulativas
}

export interface AlumnCalification {
  id?: number;
  alumnId?: number;
  value?: number;
  idCalification?: number;
}

export interface BatchCalifications {
  mainCalification: Calification;
  califications: AlumnCalification[];
  indicators?: number[];
}

