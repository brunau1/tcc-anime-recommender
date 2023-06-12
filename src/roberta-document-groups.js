/**
 * - separar titulos semelhantes e agrupar para criar grupos de contexto para cada titulo
 * - extrair frases de cada documento associado ao titulo em um grupo de contexto
 * - treinar roberta com as frases de cada grupo de contexto associando a cada documento do grupo
 * - para os titulos sem contexto, treinar roberta com as frases de cada documento associado ao titulo
 */

import animes from "../public/animes.json" assert { type: "json" };
import Fs from "fs";
import Path from "path";
import { stringSimilarity } from "string-similarity-js";

console.log(animes.names.length, animes.content.length);

const titles = animes.names.map((title = "") => {
  return title
    .toLowerCase()
    .replace(/[^a-z ]+/g, " ")
    .replace("second season", "")
    .replace("third season", "")
    .replace("the animation", "")
    .replace("the movie", "")
    .replace("season", "")
    .trim();
});

function compareTitles(title, titleCollection) {
  const similarities = [];

  for (let i = 0; i < titleCollection.length; i++) {
    const titleToCompare = titleCollection[i];

    const similarity = stringSimilarity(title, titleToCompare, 4);

    const includesName = titleToCompare.includes(title.split(" ")[0]);

    const ableToInclude = similarity >= 0.3 && includesName;

    if (ableToInclude) {
      similarities.push({ idx: i, title: titleToCompare, sim: similarity });
    }
  }

  return similarities;
}

function createDocumentGroups(titles) {
  const alreadyCompared = [];
  const documentGroups = [];

  for (let i = 0; i < titles.length; i++) {
    if (alreadyCompared.includes(i)) continue;

    console.log(i);

    const title = titles[i];

    const similarities = compareTitles(title, titles);

    // console.log(title, similarities);

    const documentIds = similarities.map((s) => s.idx);

    alreadyCompared.push(...documentIds);

    documentGroups.push(documentIds);
  }

  const noMatch = titles
    .map((_, idx) => idx)
    .filter((idx) => !alreadyCompared.includes(idx));

  return {
    documentGroups,
    noMatch,
  };
}

function main() {
  console.time("createDocumentGroups");

  const { documentGroups, noMatch } = createDocumentGroups(titles);

  console.log(noMatch.length, noMatch);

  Fs.writeFileSync(
    Path.resolve("./public/roberta-document-groups.json"),
    JSON.stringify({ documentGroups, noMatch })
  );

  console.timeEnd("createDocumentGroups");
}

main();
