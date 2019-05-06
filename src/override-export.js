/**
 * Exports a JSON object of all `stringValue` overrides for every symbol instance from every artboard.
 * Should be run before `override-import.js` and before syncing the latest `Library` updates.
 * @version 0.1.0
 * @author Daniel T. Hall <danielthall@me.com>
 */

const fs = require('@skpm/fs');
const homedir = require('os').homedir();
const UI = require('sketch/ui');

export default function() {
  const document = require('sketch/dom').getSelectedDocument();
  const pages = document.pages;

  // Get a name to build the file
  const rawDocName = document.sketchObject.displayName().replace(/\.[^/.]+$/, "");
  const docSplit = rawDocName.indexOf('(');
  const docName = rawDocName.substring(0, docSplit != -1 ? docSplit : rawDocName.lenth).replace(/\s/g,'');

  // Build the path to export to
  const exportBase = `${homedir}/sketch-restore-overrides`;
  const exportPath = `${homedir}/sketch-restore-overrides/${docName}`;

  // Store an array of all stringValue overrides for all layers for each artboard
  let exportOverrides = [];

  // Only save string values
  const filterOverrides = (overrides) => {
    let newOverrides = [];

    for (const override of overrides) {
      if (override.property === 'stringValue') {
        newOverrides.push({
          property: override.property,
          path: override.path,
          value: override.value
        })
      }
    }

    return newOverrides;
  }

  // for each page
  for (const page of pages) {
    // for each artboard that contains symbol with name `${targetSymbolName}`
    for (const artboard of page.layers) {
      // Find the artboards by the pages layers where type === `Artboard`
      if (artboard.type !== 'Artboard') {
        continue;
      }

      // save the filtered overrides for an artboard
      const overrides = [];

      for (const layer of artboard.layers) {
        if (layer.overrides) {
          overrides.push(...filterOverrides(layer.overrides));
        }
      }

      // export all overrides per artboard
      exportOverrides.push({
        artboardId: artboard.id,
        overrides: overrides
      });
    }
  }

  // create JSON with artboardId and overrides
  const createFile = () => {
    if (!fs.existsSync(exportBase)) {
      fs.mkdirSync(exportBase)
    }
    fs.mkdirSync(exportPath);
    fs.writeFileSync(`${exportPath}/overrides--${docName}.json`, JSON.stringify(exportOverrides));
  }

  // some weirdness is happening preventing file overrides. If the file exists, delete it and make a new one
  if (!fs.existsSync(exportPath)) {
    createFile();
  } else {
    fs.rmdirSync(exportPath);
    createFile();
  }

  UI.message(`🎉 Overrides exported`);

}
