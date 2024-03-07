import * as core from "@actions/core";
import * as github from "@actions/github";
import { ActionInput } from "../actions/action-interface";

let mockedInput: ActionInput | undefined;
let mockedContext: RequiredContext | undefined;

export type DefaultInputs = {
  projectName?: string;
  repository?: string;
  baseBranch?: string;
  ref?: string;
  file?: string;
  endpoint?: string;
  validateCertificates?: "false" | "true";
  sonarqubeServer?: string;
  sonarqubeLogin?: string;
  sonarqubePassword?: string;
};

export type RequiredContext =
  | {
      eventName: "pull_request";
      payload: {
        pull_request: {
          head: {
            sha: string;
          };
          base: {
            ref: string;
          };
        };
        repository: {
          name: string;
          default_branch: string;
          owner: {
            login: string;
          };
        };
      };
      sha: string;
    }
  | {
      eventName: "push";
      payload: {
        repository: {
          name: string;
          default_branch: string;
          owner: {
            login: string;
          };
        };
      };
      sha: string;
    };

export const mockInput = (input: ActionInput) => {
  mockedInput = input;
};

export const mockContext = (context: RequiredContext) => {
  mockedContext = context;
};

export const clearMock = () => {
  mockedInput = undefined;
  mockedContext = undefined;
};

export const getInput = <T extends keyof ActionInput>(
  name: T
): ActionInput[T] => {
  return mockedInput
    ? mockedInput[name]
    : (core.getInput(name) as ActionInput[T]);
};

export const getContext = (): RequiredContext => {
  return mockedContext
    ? mockedContext
    : (github.context as unknown as RequiredContext);
};
