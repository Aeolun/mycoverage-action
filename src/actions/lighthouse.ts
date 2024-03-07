import * as github from "@actions/github";
import { createUrl } from "../lib/create-url";
import {
  ActionInterface,
  LighthouseActionInput,
} from "../actions/action-interface";

export const lighthouseAction: ActionInterface<LighthouseActionInput> = async (
  input
) => {
  const urlParameters = new URLSearchParams({
    ref:
      github.context.eventName === "pull_request"
        ? github.context.payload.pull_request?.head.sha
        : github.context.sha,
  });
  return {
    data: {
      file: input.file,
      contentType: "application/json",
    },
    url: createUrl(`upload-lighthouse?${urlParameters.toString()}`),
  };
};
