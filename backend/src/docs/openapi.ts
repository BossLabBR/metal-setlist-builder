import fs from "fs";
import path from "path";
import { parse } from "yaml";

const specPath = path.join(__dirname, "openapi.yaml");
const specFile = fs.readFileSync(specPath, "utf-8");
const openApiSpec = parse(specFile);

export default openApiSpec;
