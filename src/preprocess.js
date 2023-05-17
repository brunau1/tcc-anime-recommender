import * as nlpToolkit from "natural";
import stopwords from "../public/stopwords.js";

const clearDocument = (document) => {
  const tokenizer = new nlpToolkit.WordTokenizer();
  const stemmer = nlpToolkit.PorterStemmer;

  // remove um conjunto de caracteres
  // correspondente ao autor das descrições
  document = document.replace(/Written by MAL Rewrite/g, "");
  // separa o texto em tokens e remove caracteres indesejados
  // e em seguida deixa todos os tokens em minúsculo
  // const tokens = tokenizer
  //   .tokenize(document)
  //   .map((token) => token.toLowerCase()); 
  // // remove numeros
  // const withoutNumbers = tokens.filter((token) => isNaN(token));
  // // remove tokens com apenas um caractere
  // // remove tokens que são stopwords
  // const nonStopWords = removeStopWords(withoutNumbers);
  // // extrai a palavra raiz dos tokens
  // const stemmedTokens = nonStopWords.map((token) => stemmer.stem(token));
  // document = stemmedTokens.join(" ");

  // retorna o texto limpo
  return document;
};

const removeStopWords = (tokens) => {
  return tokens.filter((token) => !stopwords.includes(token));
};

export default clearDocument;
