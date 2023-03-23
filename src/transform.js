import Fs from "fs";
import { TfIdf } from "natural";
import Path from "path";

let documents = {};
let documentCount = 0;

const init = () => {
   const dir = Path.resolve("./public/animes.json");
   documents = JSON.parse(Fs.readFileSync(dir, "utf8"));
   documentCount = documents.content.length; // (10k ~ 1min));
};
// lista de termos unicos com o IDF calculado
const dictionary = {
  terms: new Array(),
  idfs: new Array(),
};
const currentTerms = new Array();

// define um tamanho padrão para o conjunto de
// documentos e cria o conjunto de documentos
function createDocumentSet() {
  const set = new TfIdf();
  // adiciona o documento ao conjunto de documentos
  for (let i = 0; i < documentCount; i++) {
    set.addDocument(documents.content[i]);
  }

  return set;
}

// cria o dicionario de termos a partir
// do conjunto de documentos e salva em um json
// com as medidas de IDF para cada termo
// a lib será usada para calcular as medidas de IDF
// para os termos unicos do dicionario
export function createListOfTerms() {
  init();
  console.time("createListOfTerms");
  // cria o dicionario com os documentos do dataset
  // pre processados
  const documentSet = createDocumentSet();

  console.log("processing documents... | lenght: ", documentCount);
  // percorre todos os documentos para recuperar
  // os termos e o IDF calculado
  for (let i = 0; i < documentCount; i++) {
    console.log("listing terms | doc: ", i);
    const terms = documentSet.listTerms(i);
    currentTerms.push(...terms);
  }

  console.log("Terms listed! Number of terms: ", currentTerms.length, "\n");
  console.timeEnd("createListOfTerms");
  return currentTerms;
}

// cria o dicionario de termos unicos
// com o IDF calculado
export function createDictionary() {
  init();
  console.time("createDictionary");
  // lista de termos unicos
  const uniqueTerms = {};

  console.log("making dictionary...");
  // percorre todos os termos da lista
  for (const termInfo of currentTerms) {
    // verifica se o termo já foi adicionado
    if (!uniqueTerms[termInfo.term]) {
      console.log("adding term: ", termInfo.term);
      // adiciona o termo na lista de controle
      // para evitar repetições
      uniqueTerms[termInfo.term] = true;
      // adiciona o termo e o IDF calculado, respectivamente
      dictionary.terms.push(termInfo.term);
      dictionary.idfs.push(termInfo.idf);
    }
  }

  // salva a lista de termos unicos com o valor IDF
  // para o calculo das medidas de TF-IDF posteriormente
  // para a consulta e os documentos
  Fs.writeFileSync("./public/dictionary.json", JSON.stringify(dictionary));

  console.log(
    "Dictionary created! Number of unique terms: ",
    dictionary.terms.length,
    "\n"
  );

  console.timeEnd("createDictionary");

  return dictionary;
}
