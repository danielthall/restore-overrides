/**
 * Imports a JSON object created by `override-export.js` and applies the overrides to the new symbols.
 * The plugin looks for all symbol instances from every artboard and tries to set the value from the exported list
 * Should be run after `override-export.js` and after syncing the latest `Library` updates.
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

  // Build the path to look in
  const importPath = `${homedir}/sketch-restore-overrides/${docName}/overrides--${docName}.json`;

  // Load the data as JSON
  const json = JSON.parse(fs.readFileSync(importPath));
  const artboardOverrides = new Map();
  for (const override of json) {
    artboardOverrides.set(override.artboardId, override);
  }

  // Loop through all of the pages in the file
  for (const page of pages) {

    // Loop through all of the artboards on the page
    for (const artboard of page.layers) {
      // Find the artboards by the pages layers where type === `Artboard`
      if (artboard.type !== 'Artboard') {
        continue;
      }

      // Find this artboard in the JSON that was exported from `override-export.js
      const originalValueArtboard = artboardOverrides.get(artboard.id);

      if (!originalValueArtboard) {
        console.log('No original artboard to match');
        continue;
      }

      for (const layer of artboard.layers) {
        if (!layer.overrides) {
          continue;
        }

        for (const override of layer.overrides) {
          // Check if the override is a text value that we can edit
          if (override.property === 'stringValue') {
            // The path of the override includes the UUID of the parent, which hasn't changed. Grab that ID
            const newPath = override.path.split('/')[0];

            // If the artboard is in the original export, get the original value of this override before it was lost in the library sync
            const orginalOverideObject = originalValueArtboard.overrides.find(o => o.path.split('/')[0] === newPath);

            if (orginalOverideObject && orginalOverideObject.value) {
              // Set the value of this override to it's exported value.

              override.value = orginalOverideObject.value;
              originalValueArtboard.overrides = originalValueArtboard.overrides.filter(o => o !== orginalOverideObject);
            } else {
              console.log({
                message: 'No original object value',
                page: page.name,
                targetSymbol: layer.name
              });
            }
          }
        }
      }
    }
  }

  // Notify completion
  UI.message(`🎉 Overrides imported`);
}
