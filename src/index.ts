import * as core from "@actions/core";
import * as github from "@actions/github";
import fs from "node:fs";
import path from "node:path";

async function execute() {
  try {
    // `who-to-greet` input defined in action metadata file
    const endpoint = core.getInput("endpoint");
    const file = core.getInput("file");

    const owner = github.context.payload.repository?.owner.login.toLowerCase();
    const repo = github.context.payload.repository?.name.toLowerCase();

    if (!owner || !repo) {
      core.setFailed("Could not get owner or repo!");
      return;
    }

    const urlParameters = new URLSearchParams({
      branch:
        github.context.eventName === "pull_request"
          ? github.context.payload.pull_request?.head.ref
          : github.context.ref.replace("refs/heads/", ""),
      testName: core.getInput("testName") ?? github.context.job,
      ref:
        github.context.eventName === "pull_request"
          ? github.context.payload.pull_request?.head.sha
          : github.context.sha,
      baseBranch:
        core.getInput("baseBranch") ??
        github.context.eventName === "pull_request"
          ? github.context.payload.pull_request?.base.ref
          : github.context.payload.repository?.default_branch,
      repositoryRoot: process.env["GITHUB_WORKSPACE"] ?? process.cwd(),
      index: core.getInput("index"),
      workingDirectory: process.cwd(),
    });

    const url = path.join(
      endpoint,
      `api/group/${owner}/project/${repo}/upload?${urlParameters.toString()}}`
    );

    if (!fs.existsSync(file)) {
      core.setFailed(`File ${file} does not exist!`);
      return;
    }
    console.log(`Uploading ${file} to ${url}!`);

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: fs.readFileSync(file).toString(),
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("Unknown error!");
    }
  }
}
execute().then(() => console.log("Done"));
