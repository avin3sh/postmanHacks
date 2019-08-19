var fs = require('fs');
var path = require('path');

var moveFrom = `${__dirname}/original-collection`; // directory where your ugly named json files are present
var moveTo = `${__dirname}/clean-collection`; // directory where clean name json files will be created

fs.readdir(moveFrom, function (err, files) {
  if (err) { 
    console.error("Could not list the directory.", err);
    return;
  }

  files.forEach(function (fileName, index) {  // loop through all the files in the main direcotyr
    const filePath = `${moveFrom}/${fileName}`;
    const rawdata = fs.readFileSync(filePath); // obtain content of the json file
    try {
      const fileContent = JSON.parse(rawdata); // parse content into JSON
      let newFileName = fileContent.info.name;
      let newFilePath = `${moveTo}/${newFileName}.json`;
      if (fs.existsSync(newFilePath)) { // check if clean name json file already exists in the moveTo folder
        newFileName = getNonDuplicateName(newFileName, moveTo); // if yes, generate a non-duplicate name by appending positive integer
        newFilePath = `${moveTo}/${newFileName}.json`; // update the full path
      }
      
      fs.writeFileSync(newFilePath, rawdata, 'utf8'); // write the stringified json to the file
    } catch (e) {
      console.log(e);
      return;
    }
  });
});

function getNonDuplicateName(fileName, folderPath, start=0) {
  const incrementedFilePath = `${folderPath}/${fileName}-${start+1}`;
  if (fs.existsSync(`${incrementedFilePath}.json`)) {
    return getNonDuplicateName(fileName,folderPath,++start);
  }

  return `${fileName}-${start+1}`;
}

