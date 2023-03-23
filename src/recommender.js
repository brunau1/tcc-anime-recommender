import similarity from "compute-cosine-similarity";
import clearDocument from "./preprocess.js";
import Path from "path";
import Fs from "fs";
import { generateVSMWithTfIdf } from "./vectorizer.js";

export function computeSimilarity(document = "", search = "") {
  search = clearDocument(search);
  const documentVector = generateVSMWithTfIdf(document);
  const searchVector = generateVSMWithTfIdf(search);

  return similarity(documentVector, searchVector);
}
// recomendar a partir dos documentos vetorializados salvos
export function recommender() {
  console.log("Recommender");
console.time("recommender");

  const computedSimilarities = [];
  const search =
    "two brothers enter army to become alchemists";

  console.log("search: ", search);

  const docsDir = Path.resolve("./public/animes.json");
  const docs = JSON.parse(Fs.readFileSync(docsDir, "utf8"));

  for (let i = 0; i < docs.content.length; i++) {
    console.log("Computing similarity | anime: ", i);
    const measure = computeSimilarity(docs.content[i], search);
    computedSimilarities.push([i, measure]);
  }

  computedSimilarities.sort((a, b) => b[1] - a[1]);

  const topMeasures = computedSimilarities.slice(0, 10);

  console.timeEnd("recommender");

  console.log("Top 10 recommendations:");
  topMeasures.forEach((measure) => {
    console.info(
      "Anime #" + docs.names[measure[0]] + " | similarity = " + measure[1]
    );
  });
}
recommender();
