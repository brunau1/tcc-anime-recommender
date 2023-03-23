import Fs from "fs";
import Path from "path";

let dictionary = null;

function init() {
  const dir = Path.resolve("./public/dictionary.json");

  dictionary = dictionary ? dictionary : JSON.parse(
    Fs.readFileSync(dir, "utf8") // Fs.readFileSync("./public/dictionary-15444.json", "utf8")
  );
}
export function generateVSMWithTfIdf(document = "") {
  init();
  const documentTerms = document.split(" ");
  const vsm = new Array(dictionary.terms.length).fill(0);

  for (const term of documentTerms) {
    const termIndex = dictionary.terms.indexOf(term);
    const termCount = documentTerms.filter((t) => t === term).length;
    const tf = termCount; // / documentTerms.length; // forma comum de calcular o tf

    if (termIndex >= 0) {
      vsm[termIndex] += tf * dictionary.idfs[termIndex];
    }
  }

  return vsm;
}
