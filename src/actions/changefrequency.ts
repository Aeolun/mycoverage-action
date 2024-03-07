import * as child_process from "child_process";
import { createUrl } from "../lib/create-url";
import {
  ActionInterface,
  ChangeFrequencyActionInput,
} from "../actions/action-interface";

export const changefrequencyAction: ActionInterface<
  ChangeFrequencyActionInput
> = async (options) => {
  const totalCommits = parseInt(
    child_process
      .execSync('git rev-list --count HEAD --since="1 year ago"')
      .toString()
  );
  // TODO: Try to distinguish between feat and fix commits here
  const result = child_process
    .execSync(
      'git log --since "1 year ago" --name-only --pretty="format:" | sed \'/^\\s*$/\'d | sort | uniq -c | sort'
    )
    .toString();
  const lines = result.split("\n");

  const results: Record<
    string,
    {
      name: string;
      changes: number;
      percentage: number;
      rate: "very-low" | "low" | "medium" | "high" | "very-high";
    }
  > = {};
  const filtered = lines
    .map((line) => {
      return line.match(/^ *([0-9]+) (.*)/);
    })
    .filter((data) => data) as RegExpMatchArray[];

  for (const match of filtered) {
    const file = match[2];
    const changes = match[1];
    if (file && changes) {
      results[file] = {
        name: file,
        changes: parseInt(changes),
        percentage: (parseInt(changes) / totalCommits) * 100,
        rate: "medium",
      };
    }
  }

  //calculate median change rate and standard deviation
  // only count files that are not package.json or package-lock.json
  const changes = Object.values(results)
    .filter(
      (file) =>
        !file.name.includes("package.json") &&
        !file.name.includes("package-lock.json")
    )
    .map((file) => file.changes);

  const mean = changes.reduce((a, b) => a + b) / changes.length;
  const variance =
    changes.reduce((a, b) => a + (b - mean) ** 2, 0) / changes.length;
  const standardDeviation = Math.sqrt(variance);
  const median = changes[Math.floor(changes.length / 2)];
  const rate = (change: number) => {
    if (change < mean - standardDeviation) {
      return "very-low";
    } else if (change < mean) {
      return "low";
    } else if (change < mean + standardDeviation) {
      return "medium";
    } else if (change < mean + 2 * standardDeviation) {
      return "high";
    } else {
      return "very-high";
    }
  };
  for (const file of Object.values(results)) {
    file.rate = rate(file.changes);
    delete file.name;
  }

  return {
    data: {
      data: Buffer.from(
        JSON.stringify({
          changes: results,
          totalCommits: totalCommits,
        })
      ),
      contentType: "application/json",
    },
    url: createUrl(`upload-changefrequency?&ref=${options.ref}`),
  };
};
