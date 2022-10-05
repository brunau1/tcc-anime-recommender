import * as nlpToolkit from "natural";

import Fs from "fs";
import numWords from "num-words";

const clearDocument = (document) => {
  const tokenizer = new nlpToolkit.WordTokenizer();
  const stemmer = nlpToolkit.PorterStemmer;

  document = document.replace(/Written by MAL Rewrite/g, "");
  const tokens = tokenizer
    .tokenize(document)
    .map((token) => token.toLowerCase());
  const nonSingleCharacters = removeSingleCharacters(tokens);
  const nonStopWords = removeStopWords(nonSingleCharacters);
  const withTextNumbers = nonStopWords.map((token) =>
    token === "infinity" ? token : numWords(token) || token
  );
  const stemmedTokens = withTextNumbers.map((token) => stemmer.stem(token));

  document = stemmedTokens.join(" ");

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