import * as nlpToolkit from "natural";

import Fs from "fs";
import numWords from "num-words";

const clearDocument = (document) => {
  const tokenizer = new nlpToolkit.WordTokenizer();
  const stemmer = nlpToolkit.PorterStemmer;

  // remove um conjunto de caracteres
  // correspondente ao autor das descrições
  document = document.replace(/Written by MAL Rewrite/g, "");
  // separa o texto em tokens e remove caracteres indesejados 
  // e em seguida deixa todos os tokens em minúsculo
  const tokens = tokenizer
    .tokenize(document)
    .map((token) => token.toLowerCase());
  // remove tokens com apenas um caractere
  const nonSingleCharacters = removeSingleCharacters(tokens);
  // remove tokens que são stopwords
  const nonStopWords = removeStopWords(nonSingleCharacters);
  // transforma os números em palavras
  // ex: 1 -> one
  // pois algumas descrições possuem números (dia, ano, episódios, etc)
  const withTextNumbers = nonStopWords.map((token) =>
    token === "infinity" ? token : numWords(token) || token
  );
  // extrai a palavra raiz dos tokens
  const stemmedTokens = withTextNumbers.map((token) => stemmer.stem(token));
  
  document = stemmedTokens.join(" ");
  // retorna o texto limpo
  return document;
};

const removeStopWords = (tokens) => {
  const data = Fs.readFileSync("stopwords.dat", "utf8");

  const stopWords = data.replace(/\r/gi, "").split("\n");

  return tokens.filter((token) => !stopWords.includes(token));
};

const removeSingleCharacters = (tokens) => {
  return tokens.filter((token) => token.length > 1);
};

export default clearDocument;