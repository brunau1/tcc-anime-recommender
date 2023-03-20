import Fs from "fs";

const dictionary = JSON.parse(
  Fs.readFileSync("./public/dictionary.json", "utf8")
);
const documents = JSON.parse(Fs.readFileSync("./public/animes.json", "utf8"));
const documentCount = 1000; // documents.content.length

export function generateVSMWithTfIdf(document = "") {
  const documentTerms = document.split(" ");
  const vsm = new Array(dictionary.terms.length).fill(0);

  for (const term of documentTerms) {
    const termIndex = dictionary.terms.indexOf(term);
    const termCount = documentTerms.filter((t) => t === term).length;
    const tf = termCount / documentTerms.length;

    if (termIndex >= 0) {
      vsm[termIndex] += tf * dictionary.idfs[termIndex];
    }
  }

  return vsm;
}

function generateVectorModels() {
  console.time("generateVectorModels");
  const vectorModels = new Array(documentCount);

  for (let i = 0; i < documentCount; i++) {
    vectorModels[i] = generateVSMWithTfIdf(documents.content[i]);
  }
  console.log(vectorModels[1])

  Fs.writeFileSync("./public/docs-vsm.json", JSON.stringify(vectorModels));

  console.timeEnd("generateVectorModels");
  return vectorModels;
}

generateVectorModels();
