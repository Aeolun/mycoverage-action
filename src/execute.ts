import * as core from "@actions/core";
import { sonarqubeAction } from "./actions/sonarqube";
import { createInput } from "./lib/create-input";
import { ActionInterface } from "./actions/action-interface";
import { coverageAction } from "./actions/coverage";
import { lighthouseAction } from "./actions/lighthouse";
import { post } from "./lib/post";
import { changefrequencyAction } from "./actions/changefrequency";

export async function execute() {
  try {
    const input = createInput();

    let postAction: Awaited<ReturnType<ActionInterface>>;
    if (input.kind === "coverage") {
      postAction = await coverageAction(input);
    } else if (input.kind === "lighthouse") {
      postAction = await lighthouseAction(input);
    } else if (input.kind === "sonarqube") {
      postAction = await sonarqubeAction(input);
    } else {
      postAction = await changefrequencyAction(input);
    }

    await post(postAction.url, postAction.data);
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
