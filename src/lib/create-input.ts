import { getContext, getInput } from "../lib/action-helper";
import { ActionInput } from "../actions/action-interface";

export const createInput = (): ActionInput => {
  const endpoint = getInput("endpoint");
  const file = getInput("file");
  const kind = getInput("kind");

  if (!endpoint) {
    throw new Error("Endpoint is required!");
  }

  const context = getContext();
  const owner = context.payload.repository?.owner.login.toLowerCase();
  const repo = context.payload.repository?.name.toLowerCase();

  const repositoryBaseBranch =
    getInput("baseBranch") ??
    (context.eventName === "pull_request"
      ? context.payload.pull_request?.base.ref
      : context.payload.repository?.default_branch);
  const ref =
    context.eventName === "pull_request"
      ? context.payload.pull_request.head.sha
      : context.sha;

  if (!owner || !repo) {
    throw new Error("Could not get owner or repo!");
  }

  const input: ActionInput = {
    kind,
    projectName: owner,
    repository: repo,
    ref: ref,
    baseBranch: repositoryBaseBranch,
    file,
    sonarqubeServer: getInput("sonarqubeServer"),
    sonarqubeLogin: getInput("sonarqubeLogin"),
    sonarqubePassword: getInput("sonarqubePassword"),
  };

  return input;
};
