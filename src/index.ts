import * as core from "@actions/core";
import * as github from "@actions/github";
import axios from "axios";
import * as https from "https";
import fs from "node:fs";
import path from "node:path";

async function execute() {
  try {
    // `who-to-greet` input defined in action metadata file
    const endpoint = core.getInput("endpoint");
    const file = core.getInput("file");
    const kind = core.getInput("kind");
    const validateCertificates =
      core.getInput("validateCertificates") !== "false";

    if (!endpoint) {
      core.setFailed("Endpoint is required!");
      return;
    }

    const owner = github.context.payload.repository?.owner.login.toLowerCase();
    const repo = github.context.payload.repository?.name.toLowerCase();

    if (!owner || !repo) {
      core.setFailed("Could not get owner or repo!");
      return;
    }

    let url = [
      endpoint.replace(/^\/|\/$/g, ""),
      `api/group/${owner}/project/${repo}/`,
    ].join("/");

    if (kind === "coverage") {
      const inputBaseBranch = core.getInput("baseBranch");
      const repositoryBaseBranch =
        github.context.eventName === "pull_request"
          ? github.context.payload.pull_request?.base.ref
          : github.context.payload.repository?.default_branch;

      const inputTestName = core.getInput("testName");
      const inputCoverageRootDirectory = core.getInput("coverageRootDirectory");

      const urlParameters = new URLSearchParams({
        branch:
          github.context.eventName === "pull_request"
            ? github.context.payload.pull_request?.head.ref
            : github.context.ref.replace("refs/heads/", ""),
        testName: inputTestName ? inputTestName : github.context.job,
        ref:
          github.context.eventName === "pull_request"
            ? github.context.payload.pull_request?.head.sha
            : github.context.sha,
        baseBranch: inputBaseBranch ? inputBaseBranch : repositoryBaseBranch,
        repositoryRoot: process.env.GITHUB_WORKSPACE ?? process.cwd(),
        index: core.getInput("index"),
        workingDirectory: inputCoverageRootDirectory
          ? inputCoverageRootDirectory
          : process.cwd(),
      });

      url += `upload?${urlParameters.toString()}`;

      if (!fs.existsSync(file)) {
        core.setFailed(`File ${file} does not exist!`);
        return;
      }
      console.log(`Uploading ${file} to ${url}!`);
    } else if (kind === "lighthouse") {
      const urlParameters = new URLSearchParams({
        ref:
          github.context.eventName === "pull_request"
            ? github.context.payload.pull_request?.head.sha
            : github.context.sha,
      });
      url += `upload-lighthouse?${urlParameters.toString()}`;
      console.log(`Uploading ${file} to ${url}!`);
    }

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    await axios.post(url, fs.readFileSync(file).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      httpsAgent: validateCertificates ? undefined : agent,
    });
  } catch (error) {
    console.log(error);
    core.error(error?.toString() ?? "Unknown error!");
    if (error instanceof Error) {
      core.setFailed(error);
    } else {
      core.setFailed("Unknown error!");
    }
  }
}
execute().then(() => console.log("Done"));
