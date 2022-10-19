// import { Corpus } from "tiny-tfidf";

import Fs from "fs";
import { TfIdf } from "natural";
import clearDocument from "./cleaner.js";

const measures = [];
const documents = JSON.parse(Fs.readFileSync("animes.json", "utf8"));

const registerMeasure = (i, measure) => {
  measures.push([i, measure]);
};

const createProcess = (documentCount = 1000) => {
  const tfidf = new TfIdf();
  // adiciona os documentos ao corpus
  for (let i = 0; i < documentCount; i++) {
    tfidf.addDocument(documents.content[i]);
  }

  return tfidf;
};

const recommender = (query, documentCount) => {
  console.info("Creating process...");

  const tfidf = createProcess(documentCount);
  console.warn("Total documents: ", documentCount);
  // calcula as medidas de similaridade entre a consulta e os documentos
  tfidf.tfidfs(query, registerMeasure);
  // salva as medidas de similaridade em um arquivo
  Fs.writeFileSync("measures.json", JSON.stringify(measures), "utf8");

  getTopMeasures();
};

const getTopMeasures = () => {
  // recupera a lista de estimativas salvas
  const measures = JSON.parse(Fs.readFileSync("measures.json", "utf8"));
  // ordena a lista de estimativas do maior para o menor
  const sortedMeasures = measures.sort((a, b) => b[1] - a[1]);
  // pega os 10 primeiros elementos da lista ordenada
  const topMeasures = sortedMeasures.slice(0, 10);
  // mostra os 10 primeiros elementos da lista ordenada
  console.log("Top measures: ");
  topMeasures.forEach((measure) => {
    console.info(
      "Anime #" + documents.names[measure[0]] + " | measure = " + measure[1]
    );
  });
};

const main = () => {
  const queryText = "a boy and his brother lost their mother";
  const query = clearDocument(queryText);
  const documentCount = documents.content.length; // max = documents.content.length

  recommender(query, documentCount); 
};

main();