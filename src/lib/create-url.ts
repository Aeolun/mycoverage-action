import * as github from "@actions/github";
import { getContext, getInput } from "../lib/action-helper";

export function createUrl(path: string) {
  const endpoint = getInput("endpoint");

  if (!endpoint) {
    throw new Error("Endpoint is not set!");
  }

  const context = getContext();
  const owner = context.payload.repository?.owner.login.toLowerCase();
  const repo = context.payload.repository?.name.toLowerCase();

  return [
    endpoint.replace(/^\/|\/$/g, ""),
    `api/group/${owner}/project/${repo}`,
    path,
  ].join("/");
}
