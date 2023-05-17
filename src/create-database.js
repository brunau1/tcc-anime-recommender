import animes from "../public/animes.json" assert { type: "json" };
import Fs from "fs";
import Path from "path";
import { compareTwoStrings } from "string-similarity";

// aplicar o modulo de similaridade para os titulos e identificar os mais similares
// aplicar o modulo de similaridade para as descrições de titulos semelhantes e identificar os mais similares
// salvar os resultados em um arquivo json

console.log(animes.names.length, animes.content.length);

// const searchPhrases = [
//   "the protagonist gains the power to kill anyone whose name he writes in a notebook",
//   "a man who can defeat any enemy with one punch",
//   "it has a dragon wich give three wishes to the one who find it",
//   "the philosopher stone grants immortality to the one who find it",
//   "two brothers lost their bodies and now they have to find the philosopher stone",
//   "a ninja kid who wants to become a hokage",
//   "the protagonist got the shinigami sword and now he has to kill hollows",
//   "it was a knight who use a saint armor blessed by the goddess athena",
// ];

const titlesToCompare = [
  "Made in Abyss",
  "haikyuu",
  "devilman",
  "Naruto",
  "Death note",
  "Sword Art Online",
  "Code geas",
  "Bleach",
  "Fairy Tail",
  "Nanatsu no Taizai",
  "One Piece",
  "Dragon Ball",
  "Fullmetal Alchemist",
  "One punch man",
  "boku no hero academia",
  "Shingeki no Kyojin",
  "inuyasha",
  "Saint Seiya",
  "one piece",
  "hunter x hunter",
  "hunter",
  "Evangelion",
  "sailor moon",
  "kimetsu no yaiba",
  "cowboy bebop",
  "Berserk",
  "Gundam",
  "Hakusho",
];

// console.log(compareTwoStrings(animes.content[0],  animes.content[1]))
// console.log("Text", animes.content[0]);

// let index = 0;
// const documents = [];
// for (const anime of animes.content) {
// remove caracteres especiais e quebras de linha com regex e adiciona o anime ao array de documentos
// const text = anime.replace(/[^a-z ]+/g, " ");
//   if (text.split(" ").length > 50) {
//     documents.push([animes.names[index], index]);
//   }
//   if (documents.length > 150) break;
//   index++;
// }

// Fs.writeFileSync("./public/docs.json", JSON.stringify(documents));

// salva apenas os titulos de caada anime do array de documentos em um arquivo txt com um titulo por linha
// const titles = documents.map((doc) => `${doc[1]} - ${doc[0]}`);
// Fs.writeFileSync("./public/titles.txt", titles.join("\n"));

// console.log("Documents: ", documents.length);
// console.log("result 2: ", animes.names[5169]);
// process.exit(0);

// const similarities = {};
// const documents = [];
// for (const title of titlesToCompare) {
//   let index = 0;
//   let currentSimilarities = [];
//   const obj = {
//     title: title,
//     queries: [],
//     documents: [],
//   };
//   for (let anime of animes.names) {
//     // const similarity = compareTwoStrings(title, anime);
//     // if (similarity >= 0.4)
//     anime = anime.toLowerCase().replace(/[^a-z ]+/g, " ");

//     if (anime.includes(title.toLowerCase()) && obj.documents.length < 10) {
//       obj.documents.push(index);
//       currentSimilarities.push([index, animes.names[index]]);
//     }
//     index++;
//   }
//   similarities[title] = currentSimilarities;
//   documents.push(obj);
//   index = 0;
// }
// titlesToCompare.forEach((title) => {
//   const sorted = similarities[title].sort((a, b) => b[1] - a[1]);
//   const titles = sorted.map((s) => {
//     return { index: s[0], title: animes.names[s[0]] };
//   });
//   console.log(title, "-->", titles);
// });

// Fs.writeFileSync(__dirname, "../public/similarities.txt", `${similarities}`);
// for (const title of titlesToCompare) {
//   lines += `${title} -->\n`;
//   for (const anime of similarities[title]) {
//     lines += `${anime[0]} - ${anime[1]}\n`;
//   }
//   lines += "\n\n";
// }

function saveExpected(documents, setName) {
  let lines = "";

  for (const doc of documents) {
    console.log("title: ", animes.names[doc]);

    const text = animes.content[doc].toLowerCase().replace(/[^a-z ]+/g, " ");

    lines += `${doc} - ${animes.names[doc]}\n`;
    // lines += `${text}\n\n`;
  }

  Fs.writeFileSync(
    Path.resolve(
      "..",
      "tcc-anime-recommender",
      `public/${setName}-expected.txt`
    ),
    lines
  );
}

const setName = "saint_seiya";

const docs = [
  21, 111, 348, 394, 410, 781, 2940, 3165, 4333, 4920
];

saveExpected(docs, setName);

// Fs.writeFileSync(
//   Path.resolve("..", "tcc-anime-recommender", "public/train_large.json"),
//   JSON.stringify(documents, null, 2)
// );
