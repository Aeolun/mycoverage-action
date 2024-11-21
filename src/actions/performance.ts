import * as github from "@actions/github";
import { createUrl } from "../lib/create-url";
import type {
  ActionInterface,
  PerformanceActionInput,
} from "../actions/action-interface";
import fs from "node:fs";

export const performanceAction: ActionInterface<
  PerformanceActionInput
> = async (input) => {
  if (!fs.existsSync(input.file)) {
    throw new Error(`File ${input.file} does not exist!`);
  }

  const urlParameters = new URLSearchParams({
    ref: input.ref,
  });
  return {
    data: {
      file: input.file,
      contentType: "application/json",
    },
    url: createUrl(`upload-performance?${urlParameters.toString()}`),
  };
};
