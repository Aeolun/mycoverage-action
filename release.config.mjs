export default {
	branches: [
		"+([0-9])?(.{+([0-9]),x}).x",
		"main",
		"next",
		"next-major",
		{ name: "beta", prerelease: true },
		{ name: "alpha", prerelease: true },
	],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		"@semantic-release/changelog",
		[
			"@semantic-release/npm",
			{
				npmPublish: false,
			},
		],
		"@semantic-release/github",
		"semantic-release-major-tag",
		[
			"@semantic-release/git",
			{
				message:
					"chore(release): ${nextRelease.version} [skip release]\n\n${nextRelease.notes}",
				assets: [
					"CHANGELOG.md",
					"package.json",
					"package-lock.json",
					"npm-shrinkwrap.json",
					"dist/**/*",
				],
			},
		],
	],
};
