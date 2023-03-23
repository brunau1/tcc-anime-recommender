import Fs from "fs";
import Path from "path";
import { generateVSMWithTfIdf } from "./vectorizer.js";

let documentPackages = null;

function init() {
  const dir = Path.resolve("./public/docs-packages.json");

  documentPackages = documentPackages ? documentPackages : JSON.parse(
    Fs.readFileSync(dir, "utf8")
  );
}

export function generateVectorModels() {
  init();
  console.log("Generating vector models...");
  console.time("generateVectorModels");

  console.log("Total packages: ", documentPackages.length);
  let packIndex = 0;
  for (const pack of documentPackages) {
    let vectorModels = Array(pack.length).fill(0);
    packIndex++;
    console.log("Generating vector models | pack: ", packIndex);

    for (let i = 0; i < pack.length; i++) {
      vectorModels[i] = generateVSMWithTfIdf(pack[i]);
    }
    console.log("Saving vector models | pack length: ", vectorModels.length);

    Fs.writeFileSync(
      `./public/docs-vsm_${packIndex}_.json`,
      JSON.stringify(vectorModels)
    );
    vectorModels = [];
  }

  console.timeEnd("generateVectorModels");
}
