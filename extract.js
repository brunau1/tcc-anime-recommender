import CsvReadableStream from "csv-reader";
import Fs from "fs";
import clearDocument from "./cleaner.js";

const getDocuments = async () => {
  const extract = async () => {
    const inputStream = Fs.createReadStream("animes.csv", "utf8");

    const csvContent = [];

    return new Promise((resolve, reject) => {
      inputStream
        .pipe(
          new CsvReadableStream({
            parseNumbers: true,
            parseBooleans: true,
            trim: true,
          })
        )
        .on("data", function (row) {
          csvContent.push(row);
        })
        .on("end", function () {
          console.log("End of CSV file.");

          resolve(csvContent);
        });
    });
  };

  const documents = {
    names: [],
    content: new Set(),
  };

  const csvContent = await extract();

  csvContent.splice(0, 1);

  for (const rowContent of csvContent) {
    const anime = rowContent[1];
    const description = rowContent[2];

    // adiciona apenas se o anime não estiver no dataset
    // e se a descrição não estiver vazia
    // para evitar conteúdo duplicado ou vazio
    if (description && !documents.content.has(description)) {
      documents.names.push(anime);
      documents.content.add(description);
    }
  }

  const currentDocuments = {
    names: [...documents.names],
    content: [...documents.content],
  };

  // inclui o nome do anime no conteúdo do texto
  // para facilitar a busca
  currentDocuments.content = currentDocuments.content.map((content, index) => {
    return `${currentDocuments.names[index]} ${content}`;
  });

  return currentDocuments;
};

getDocuments().then((documents) => {
  for (let i = 0; i < documents.content.length; i++)
    documents.content[i] = clearDocument(documents.content[i]);

  console.log(
    "name: ",
    documents.names[0],
    "| content: ",
    documents.content[0]
  );

  Fs.writeFileSync("animes.json", JSON.stringify(documents));

  console.log("Dataset length: ", documents.names.length);
});
