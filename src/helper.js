export function createDocPacksWithRealIndex(docs, packLength) {
  const documentsPackages = new Array();
  let currentPackage = new Array();

  // separar os documentos em pacotes
  for (let i = 0; i < docs.content.length; i += packLength) {
    // para cada pacote, adicionar os documentos
    // e seus índices reais no dataset original
    for (let j = i; j < i + packLength; j++) {
      if (j >= docs.content.length) break;
      currentPackage.push([j, docs.content[j]]);
    }
    // adicionar o pacote atual ao array de pacotes
    documentsPackages.push(currentPackage);
    currentPackage = new Array();
  }

  console.log(
    "Documents separated! | part lengths: ",
    documentsPackages.map((pack) => pack.length),
    "\n"
  );
  return documentsPackages;
}
