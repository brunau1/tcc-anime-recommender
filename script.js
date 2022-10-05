import { Corpus } from "tiny-tfidf";
import Fs from "fs";
import clearDocument from "./cleaner.js";

// implementar o modulo do tiny-tfidf

// processar os textos em pequenos pacotes para evitar o erro de memoria

const documents = JSON.parse(Fs.readFileSync("animes.json", "utf8"));

// const TfIdf = require("natural").TfIdf;

// const tfidf = new TfIdf();

// for (const document of documents.content) {
//   tfidf.addDocument(document);
// }

// const term = "action";

// tfidf.tfidfs(term, (i, measure) => {
//   console.log("document #" + i + " is " + measure);
// });

// slice determina o número de textos que serão processados
const processDocuments = {
  names: documents.names.slice(0, 1000),
  content: documents.content.slice(0, 1000),
};

console.log(processDocuments.names.length);

const corpus = new Corpus(processDocuments.names, processDocuments.content);

const query = clearDocument("two brothers fight against evil");

console.log("Query result: ", corpus.getResultsForQuery(query));

// TODO: fazer a busca por similaridade de cossenos