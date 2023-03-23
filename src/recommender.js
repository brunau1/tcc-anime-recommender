import similarity from "compute-cosine-similarity";
import clearDocument from "./preprocess.js";
import Path from "path";
import Fs from "fs";
import { generateVSMWithTfIdf } from "./vectorizer.js";
import { createDocPacksWithRealIndex } from "./helper.js";

export function computeSimilarity(document = "", search = "") {
  search = clearDocument(search);
  const documentVector = generateVSMWithTfIdf(document);
  const searchVector = generateVSMWithTfIdf(search);

  return similarity(documentVector, searchVector);
}
// recomendar a partir dos documentos vetorializados salvos
export function recommender(docs, search) {
  console.log("Recommender");
  console.log("search: ", search);

  const computedSimilarities = [];

  for (let i = 0; i < docs.content.length; i++) {
    console.log("Computing similarity | anime: ", i);
    const measure = computeSimilarity(docs.content[i], search);
    computedSimilarities.push([i, measure]);
  }

  return computedSimilarities;
}

export function syncRecommender(documentsPackages, search) {
  console.log("Recommender");
  console.log("search: ", search);

  const similarities = [];
  for (let i = 0; i < documentsPackages.length; i++) {
    const pack = documentsPackages[i];

    // console.log("Computing similarity | part: ", i + 1);
    // computar similaridade para cada documento de cada pacote
    for (let j = 0; j < pack.length; j++) {
      const docPosition = pack[j][0];
      const document = pack[j][1];

      const measure = computeSimilarity(document, search);
      // retorna o índice do anime no dataset original
      similarities.push([docPosition, measure]);
    }
  }

  return similarities;
}

export async function syncRecommenderV2(documentsPackages, search) {
  console.log("Recommender");
  console.log("search: ", search);

  const promisedSimilarities = documentsPackages.map((pack, i) => {
    // console.log("Computing similarity | part: ", i + 1);
    // computar similaridade para cada documento de cada pacote
    const computedSimilarities = pack.map(([pos, document]) => {
      const measure = computeSimilarity(document, search);
      // retorna o índice do anime no dataset original
      return [pos, measure];
    });

    return computedSimilarities;
  });

  return promisedSimilarities.flat();
}
// paralelizar o processamento da recomendação
export async function asyncRecommender(documentsPackages, search) {
  console.log("Recommender");
  console.log("search: ", search);

  const promisedSimilarities = documentsPackages.map((pack, i) => {
    // console.log("Computing similarity | part: ", i + 1);
    // computar similaridade para cada documento de cada pacote
    const computedSimilarities = pack.map(
      ([pos, document]) =>
        new Promise((resolve) => {
          const measure = computeSimilarity(document, search);
          // retorna o índice do anime no dataset original
          resolve([pos, measure]);
        })
    );
    return computedSimilarities;
  });

  return Promise.all(promisedSimilarities.flat());
}

// utiliza os vetores de documentos salvos para recomendar
function prebuildSyncRecommender(search) {
  console.log("Recommender");
  console.log("search: ", search);

  search = clearDocument(search);
  const searchVector = generateVSMWithTfIdf(search);

  const dir = Path.resolve("./public");

  const fileNames = Fs.readdirSync(dir).filter((file) =>
    RegExp(/docs-vsm_[\d]{0,3}_.json$/).test(file)
  );

  const computedSimilarities = [];

  fileNames.forEach((filename) => {
    console.log("processing file: ", filename);
    const docsDir = Path.resolve(dir + "/" + filename);
    const docs = JSON.parse(Fs.readFileSync(docsDir, "utf8"));

    docs.map(([realIndex, docVector]) => {
      const measure = similarity(docVector, searchVector);
      computedSimilarities.push([realIndex, measure]);
    })
  });

  return computedSimilarities;
}
// cria o ranking de recomendações
export async function createRanking() {
  
  const docsDir = Path.resolve("./public/animes.json");
  const docs = JSON.parse(Fs.readFileSync(docsDir, "utf8"));
  
  const packLength = 200;
  // separar os documentos em pacotes
  const documentsPackages = createDocPacksWithRealIndex(docs, packLength);
  
  const search = "two brothers enter army to become alchemists";
  console.time("recommender");

  // const computedSimilarities = await asyncRecommender(documentsPackages, search);
  // const computedSimilarities = syncRecommender(documentsPackages, search);
  // const computedSimilarities = syncRecommenderV2(documentsPackages, search);
  // const computedSimilarities = recommender(docs, search);
  const computedSimilarities = prebuildSyncRecommender(search);

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

createRanking();

// recommender();
// parallelRecommender();
