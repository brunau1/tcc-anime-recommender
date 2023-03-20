import CsvReadableStream from "csv-reader";
import Fs from "fs";
import clearDocument from "./cleaner.js";

function extractFileContent(fileName = "animes.csv") {
  const inputStream = Fs.createReadStream(fileName, "utf8");

  const content = [];

  return new Promise((resolve, _) => {
    inputStream
      .pipe(
        new CsvReadableStream({
          parseNumbers: true,
          parseBooleans: true,
          trim: true,
        })
      )
      .on("data", function (row) {
        content.push(row);
      })
      .on("end", function () {
        console.log("End of CSV file.");

        resolve(content);
      });
  });
}

async function getDocuments(csvContent) {
  console.log("extract and format");

  const documents = {
    names: new Array(),
    content: new Array(),
  };

  for (const row of csvContent) {
    const title = String(row[1]);
    const description = String(row[2]);

    // adiciona apenas se o title
    // e a descrição não estiverem vazios
    if (title && description) {
      // (description && !documents.content.has(description)) {
      documents.names.push(title);
      // inclui o nome do anime no conteúdo do texto
      // para match de buscas por nome da obra
      documents.content.push(title + " " + description);
    }
  }

  return documents;
}

//execute
(async () => {
  const csvContent = await extractFileContent("./public/animes.csv");
  csvContent.splice(0, 1);

  const documents = await getDocuments(csvContent);

  documents.content = documents.content.map(clearDocument);

  // console.log(
  //   "\nExample: \nname: ",
  //   documents.names[0],
  //   "| content: ",
  //   documents.content[0]
  // );

  Fs.writeFileSync("./public/animes.json", JSON.stringify(documents));

  console.log(
    "\nDataset length (title and desc): ",
    documents.names.length,
    documents.content.length
  );
})();