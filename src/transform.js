import Fs from "fs";
import { TfIdf } from "natural";

const documents = JSON.parse(Fs.readFileSync("./public/animes.json", "utf8"));
const documentCount = 1000; // documents.content.length (10k ~ 1min));
// define um tamanho padrão para o conjunto de
// documentos e cria o conjunto de documentos
const createDocumentSet = () => {
  const set = new TfIdf();
  // adiciona o documento ao conjunto de documentos
  for (let i = 0; i < documentCount; i++) {
    set.addDocument(documents.content[i]);
  }

  return set;
};

// cria o dicionario de termos a partir
// do conjunto de documentos e salva em um json
// com as medidas de IDF para cada termo
// a lib será usada para calcular as medidas de IDF
// para os termos unicos do dicionario
function createDictionary() {
  console.time("createDictionary");
  // cria o dicionario com os documentos do dataset
  // pre processados
  const documentSet = createDocumentSet();

  const currentTerms = new Array();

  // lista de termos unicos com o IDF calculado
  const dictionary = {
    terms: new Array(),
    idfs: new Array(),
  };

  // percorre todos os documentos para recuperar 
  // os termos e o IDF calculado
  for (let i = 0; i < documentCount; i++) {
    const terms = documentSet.listTerms(i);
    currentTerms.push(...terms);
  }

  // lista de termos unicos
  const uniqueTerms = {}

   // percorre todos os termos da lista
  for (const termInfo of currentTerms) {
    // verifica se o termo já foi adicionado
    if (!uniqueTerms[termInfo.term]) {
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
    "Dictionary created! Number of terms: ",
    dictionary.terms.length,
    "\n"
  );

  console.timeEnd("createDictionary");

  return dictionary;
}

createDictionary();
