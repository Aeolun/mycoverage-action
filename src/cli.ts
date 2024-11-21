import { Command } from "commander";
import {
  ChangeFrequencyActionInput,
  CoverageActionInput,
  LighthouseActionInput,
  PerformanceActionInput,
  SonarqubeActionInput,
} from "./actions/action-interface";
import { execute } from "./execute";
import { mockContext, mockInput } from "./lib/action-helper";
import { version } from "../package.json";

const program = new Command();
program
  .name("mycoverage")
  .description("CLI to interface with the mycoverage API")
  .requiredOption(
    "--namespace <namespace>",
    "The namespace to upload the coverage to",
  )
  .requiredOption(
    "--repository <repository>",
    "The repository to upload the coverage for",
  )
  .requiredOption("--ref <ref>", "The ref to upload the coverage for")
  .requiredOption(
    "--endpoint <endpoint>",
    "The endpoint to upload the coverage to",
  )
  .option(
    "--validateCertificates <validateCertificates>",
    "Whether to validate certificates or not",
    "true",
  )
  .option(
    "--defaultBranch <defaultBranch>",
    "Which branch is the main branch of this repository",
    "main",
  )
  .version(version);
program
  .command("lighthouse")
  .description("Upload a lighthouse audit for a URL")
  .argument("<file>", "The file to upload")
  .action(async (file, local, cmd) => {
    const options = cmd.optsWithGlobals();
    mockInput({
      projectName: options.namespace,
      repository: options.repository,
      endpoint: options.endpoint,
      validateCertificates: options.validateCertificates,
      file,
      kind: "lighthouse",
      ref: options.ref,
    } satisfies LighthouseActionInput);
    mockContext({
      eventName: "push",
      payload: {
        repository: {
          owner: {
            login: options.namespace,
          },
          default_branch: options.defaultBranch,
          name: options.repository,
        },
      },
      sha: options.ref,
    });
    await execute();
  });
program
  .command("performance")
  .description("Upload a set of performance data for an application")
  .argument("<file>", "The file to upload")
  .action(async (file, local, cmd) => {
    const options = cmd.optsWithGlobals();
    mockInput({
      projectName: options.namespace,
      repository: options.repository,
      endpoint: options.endpoint,
      validateCertificates: options.validateCertificates,
      file,
      kind: "performance",
      ref: options.ref,
    } satisfies PerformanceActionInput);
    mockContext({
      eventName: "push",
      payload: {
        repository: {
          owner: {
            login: options.namespace,
          },
          default_branch: options.defaultBranch,
          name: options.repository,
        },
      },
      sha: options.ref,
    });
    await execute();
  });
program
  .command("coverage")
  .description("Upload a coverage report")
  .argument("<file>", "The file to upload")
  .option(
    "--baseBranch <baseBranch>",
    "The base branch to compare the coverage against",
  )
  .action(async (file, local, cmd) => {
    const options = cmd.optsWithGlobals();
    mockInput({
      projectName: options.namespace,
      repository: options.repository,
      baseBranch: options.baseBranch,
      endpoint: options.endpoint,
      validateCertificates: options.validateCertificates,
      file,
      kind: "coverage",
      ref: options.ref,
    } satisfies CoverageActionInput);
    mockContext({
      eventName: "push",
      payload: {
        repository: {
          owner: {
            login: options.namespace,
          },
          default_branch: options.defaultBranch,
          name: options.repository,
        },
      },
      sha: options.ref,
    });
    await execute();
  });
program
  .command("changefrequency")
  .description("Upload a changefrequency report")
  .action(async (local, command) => {
    const options = command.optsWithGlobals();
    console.log("options", options);
    mockInput({
      projectName: options.namespace,
      repository: options.repository,
      endpoint: options.endpoint,
      validateCertificates: options.validateCertificates,
      kind: "changefrequency",
      ref: options.ref,
    } satisfies ChangeFrequencyActionInput);
    mockContext({
      eventName: "push",
      payload: {
        repository: {
          owner: {
            login: options.namespace,
          },
          default_branch: options.defaultBranch,
          name: options.repository,
        },
      },
      sha: options.ref,
    });
    await execute();
  });
program
  .command("sonarqube")
  .description("Upload a sonarqube report")
  .requiredOption("--sonarqubeServer <sonarqubeServer>", "The sonarqube server")
  .requiredOption("--sonarqubeLogin <sonarqubeLogin>", "The sonarqube login")
  .requiredOption(
    "--sonarqubePassword <sonarqubePassword>",
    "The sonarqube password",
  )
  .action(async (local, command) => {
    const options = command.optsWithGlobals();
    console.log("options", options);
    mockInput({
      projectName: options.namespace,
      repository: options.repository,
      endpoint: options.endpoint,
      validateCertificates: options.validateCertificates,
      kind: "sonarqube",
      ref: options.ref,
      sonarqubeServer: options.sonarqubeServer,
      sonarqubeLogin: options.sonarqubeLogin,
      sonarqubePassword: options.sonarqubePassword,
    } satisfies SonarqubeActionInput);
    mockContext({
      eventName: "push",
      payload: {
        repository: {
          owner: {
            login: options.namespace,
          },
          default_branch: options.defaultBranch,
          name: options.repository,
        },
      },
      sha: options.ref,
    });
    await execute();
  });

program.parse();
