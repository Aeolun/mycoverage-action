import * as core from "@actions/core";
import * as github from "@actions/github";
import { PullRequestEvent } from "@octokit/webhooks-types";
import fs from "node:fs";
import { createUrl } from "../lib/create-url";
import {
  ActionInterface,
  CoverageActionInput,
} from "../actions/action-interface";

export const coverageAction: ActionInterface<CoverageActionInput> = async (
  input
) => {
  const inputTestName = core.getInput("testName");
  const inputCoverageRootDirectory = core.getInput("coverageRootDirectory");

  const urlParameters = new URLSearchParams({
    branch:
      github.context.eventName === "pull_request"
        ? // use pull request refs/merge/[pr-number]/head as branch name
          github.context.ref
        : github.context.ref.replace("refs/heads/", ""),
    testName: inputTestName ? inputTestName : github.context.job,
    ref: input.ref,
    baseBranch: input.baseBranch,
    repositoryRoot: process.env.GITHUB_WORKSPACE ?? process.cwd(),
    index: core.getInput("index"),
    workingDirectory: inputCoverageRootDirectory
      ? inputCoverageRootDirectory
      : process.cwd(),
  });

  if (!fs.existsSync(input.file)) {
    throw new Error(`File ${input.file} does not exist!`);
  }

  return {
    data: {
      file: input.file,
      contentType: "application/xml",
    },
    url: createUrl(`upload?${urlParameters.toString()}`),
  };
};
