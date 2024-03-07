import { createUrl } from "../lib/create-url";
import {
  ActionInterface,
  SonarqubeActionInput,
} from "../actions/action-interface";
import { Sonarqube } from "../lib/sonarqube";

export const sonarqubeAction: ActionInterface<SonarqubeActionInput> = async (
  options
) => {
  const sq = new Sonarqube(
    options.sonarqubeServer,
    options.sonarqubeLogin,
    options.sonarqubePassword,
    options.projectName,
    options.repository,
    options.ref
  );

  const issues = await sq.getIssues();

  const issuesSummary: {
    [severity: string]: {
      [type: string]: {
        [tag: string]: number;
      };
    };
  } = {};

  for (const issue of issues) {
    if (!issuesSummary[issue.severity]) issuesSummary[issue.severity] = {};
    if (!issuesSummary[issue.severity][issue.type])
      issuesSummary[issue.severity][issue.type] = {};
    for (const tag of issue.tags) {
      if (!issuesSummary[issue.severity][issue.type][tag])
        issuesSummary[issue.severity][issue.type][tag] = 0;
      issuesSummary[issue.severity][issue.type][tag]++;
    }
  }

  console.log("Summary of issues: ", issuesSummary);

  return {
    url: createUrl(`upload-sonarqube?ref=${options.ref}`),
    data: {
      data: Buffer.from(JSON.stringify(issues)),
      contentType: "application/json",
    },
  };
};
