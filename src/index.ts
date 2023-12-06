import core from "@actions/core";
import github from "@actions/github";
import fs from "fs";
import path from "path";

async function execute() {
	try {
		// `who-to-greet` input defined in action metadata file
		const endpoint = core.getInput("endpoint");
		const file = core.getInput("file");

		const owner = github.context.payload.repository.owner.login;
		const repo = github.context.payload.repository.name;

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
		core.setFailed(error.message);
	}
}
await execute();
