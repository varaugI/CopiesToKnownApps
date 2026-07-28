import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const source = resolve(projectRoot, ".openai", "hosting.json");
const destinationDirectory = resolve(projectRoot, "dist", ".openai");
const destination = resolve(destinationDirectory, "hosting.json");

await mkdir(destinationDirectory, { recursive: true });
await copyFile(source, destination);

console.log("Copied Sites hosting metadata into dist/.openai/hosting.json");
