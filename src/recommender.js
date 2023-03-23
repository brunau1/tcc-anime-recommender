import similarity from "compute-cosine-similarity";
import clearDocument from "./preprocess.js";
import Path from "path";
import Fs from "fs";
import { generateVSMWithTfIdf } from "./vectorizer.js";
import { createDocPacksWithRealIndex } from "./helper.js";

export function computeSimilarity(document = "", searchVector) {
  const documentVector = generateVSMWithTfIdf(document);

  return similarity(documentVector, searchVector);
}
// recomendar a partir dos documentos vetorializados salvos
export function recommender(docs, searchVector) {
  console.log("Recommender");

  const computedSimilarities = [];

  for (let i = 0; i < docs.content.length; i++) {
    console.log("Computing similarity | anime: ", i);
    const measure = computeSimilarity(docs.content[i], searchVector);
    computedSimilarities.push([i, measure]);
  }

  return computedSimilarities;
}

export function syncRecommender(documentsPackages, searchVector) {
  console.log("Recommender");

  const similarities = [];
  for (let i = 0; i < documentsPackages.length; i++) {
    const pack = documentsPackages[i];

    console.log("Computing similarity | part: ", i + 1);
    // computar similaridade para cada documento de cada pacote
    for (let j = 0; j < pack.length; j++) {
      const docPosition = pack[j][0];
      const document = pack[j][1];

      const measure = computeSimilarity(document, searchVector);
      // retorna o índice do anime no dataset original
      similarities.push([docPosition, measure]);
    }
  }

  return similarities;
}

export function syncRecommenderV2(documentsPackages, searchVector) {
  console.log("Recommender");

  const similarities = documentsPackages.map((pack, i) => {
    console.log("Computing similarity | part: ", i + 1);
    // computar similaridade para cada documento de cada pacote
    const computedSimilarities = pack.map(([pos, document]) => {
      const measure = computeSimilarity(document, searchVector);
      // retorna o índice do anime no dataset original
      return [pos, measure];
    });

    return computedSimilarities;
  });

  return similarities.flat();
}
// paralelizar o processamento da recomendação
export async function asyncRecommender(documentsPackages, searchVector) {
  console.log("Recommender");

  const promisedSimilarities = documentsPackages.map((pack, i) => {
    console.log("Computing similarity | part: ", i + 1);
    // computar similaridade para cada documento de cada pacote
    const computedSimilarities = pack.map(
      ([pos, document]) =>
        new Promise((resolve) => {
          const measure = computeSimilarity(document, searchVector);
          // retorna o índice do anime no dataset original
          resolve([pos, measure]);
        })
    );
    return computedSimilarities;
  });

  return Promise.all(promisedSimilarities.flat());
}

// utiliza os vetores de documentos salvos para recomendar
function prebuildSyncRecommender(searchVector) {
  console.log("Recommender");

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
    });
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

  let search = "two brothers enter army to become alchemists";
  console.log("search: ", search);

  search = clearDocument(search);
  const searchVector = generateVSMWithTfIdf(search);

  console.time("recommender");

  // const computedSimilarities = await asyncRecommender(documentsPackages, searchVector);
  // const computedSimilarities = syncRecommender(documentsPackages, searchVector);
  // const computedSimilarities = syncRecommenderV2(
  //   documentsPackages,
  //   searchVector
  // );
  // const computedSimilarities = recommender(docs, searchVector);
  const computedSimilarities = prebuildSyncRecommender(searchVector);

  console.log(computedSimilarities);
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
