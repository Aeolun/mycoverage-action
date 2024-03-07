import * as core from "@actions/core";
import axios from "axios";
import https from "https";
import fs from "node:fs";
import { getInput } from "../lib/action-helper";
import { DataFormat } from "../actions/action-interface";

export const post = async (url: string, data: DataFormat) => {
  const validateCertificates = getInput("validateCertificates") !== "false";

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  console.log(`Uploading ${"file" in data ? data.file : "data"} to ${url}!`);
  return axios.post(
    url,
    "file" in data ? fs.readFileSync(data.file) : data.data,
    {
      method: "POST",
      headers: {
        "Content-Type": data.contentType,
      },
      httpsAgent: validateCertificates ? undefined : agent,
    }
  );
};
