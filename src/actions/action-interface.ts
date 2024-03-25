export type DataFormat =
  | {
      file: string;
      contentType: string;
    }
  | { data: Buffer; contentType: string };

export type CommonActionInput = {
  projectName: string;
  repository: string;
  endpoint: string;
  ref: string;
};

export type CoverageActionInput = CommonActionInput & {
  kind: "coverage";
  baseBranch: string;
  file: string;
};

export type LighthouseActionInput = CommonActionInput & {
  kind: "lighthouse";
  file: string;
};

export type ChangeFrequencyActionInput = CommonActionInput & {
  kind: "changefrequency";
};

export type SonarqubeActionInput = CommonActionInput & {
  kind: "sonarqube";
  sonarqubeServer: string;
  sonarqubeLogin: string;
  sonarqubePassword: string;
};

export type ActionInput =
  | CoverageActionInput
  | LighthouseActionInput
  | ChangeFrequencyActionInput
  | SonarqubeActionInput;

export type ActionResponse = Promise<{
  url: string;
  data: DataFormat;
}>;

export type ActionInterface<T = unknown> = (arg: T) => ActionResponse;
