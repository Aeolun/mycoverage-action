import * as core from "@actions/core";
import * as github from "@actions/github";
import fs from "node:fs";
import path from "node:path";

async function execute() {
	try {
		// `who-to-greet` input defined in action metadata file
		const endpoint = core.getInput("endpoint");
		const file = core.getInput("file");

		const owner = github.context.payload.repository?.owner.login;
		const repo = github.context.payload.repository?.name;

		if (!owner || !repo) {
			core.setFailed("Could not get owner or repo!");
			return;
		}

		const url = path.join(
			endpoint,
			`api/group/${owner}/project/${repo}/upload`,
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
