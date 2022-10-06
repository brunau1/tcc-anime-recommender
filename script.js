import { Corpus } from "tiny-tfidf";
import Fs from "fs";
import { TfIdf } from "natural";
import clearDocument from "./cleaner.js";

let measures = [];
const documents = JSON.parse(Fs.readFileSync("animes.json", "utf8"));

const saveMeasures = (i, measure) => {
  measures.push([i, measure]);

  Fs.writeFileSync("measures.json", JSON.stringify(measures), "utf8");
};

const process = () => {
  const tfidf = new TfIdf();

  const limit = 1000; // max = documents.content.length

  // adiciona os documentos ao corpus
  for (let i = 0; i < limit; i++) {
    tfidf.addDocument(documents.content[i]);
  }

  // documents.content.forEach((document) => {
  //   tfidf.addDocument(document);
  // });

  const query = clearDocument("two brothers fight against evil");

  // tfidf.tfidfs(query, (i, measure) => {
  //   console.log("document #" + documents.names[i] + " is " + measure);
  // });

  // calcula as medidas de similaridade entre a consulta e os documentos
  tfidf.tfidfs(query, saveMeasures);
};

const getTopMeasures = () => {
  // recupera a lista de estimativas salvas
  const measures = JSON.parse(Fs.readFileSync("measures.json", "utf8"));
  // ordena a lista de estimativas do maior para o menor
  const sortedMeasures = measures.sort((a, b) => b[1] - a[1]);
  // pega os 10 primeiros elementos da lista ordenada
  const topMeasures = sortedMeasures.slice(0, 10);
  // mostra os 10 primeiros elementos da lista ordenada
  topMeasures.forEach((measure) => {
    console.log(
      "document #" + documents.names[measure[0]] + " | measure = " + measure[1]
    );
  });
};

process();
getTopMeasures();

// implementar o modulo do tiny-tfidf

// processar os textos em pequenos pacotes para evitar o erro de memoria

// slice determina o número de textos que serão processados
// const processDocuments = {
//   names: documents.names.slice(0, 1000),
//   content: documents.content.slice(0, 1000),
// };

// console.log(processDocuments.names.length);

// const corpus = new Corpus(processDocuments.names, processDocuments.content);

// const query = clearDocument("two brothers fight against evil");

// console.log("Query result: ", corpus.getResultsForQuery(query));

// TODO: fazer a busca por similaridade de cossenos
