# Restore Overrides

This plugin is a workaround for Library updates that reset override values on symbol instances. This happens when a symbol containing a string value is replaced with a different symbol, and the override can no longer map to the new symbol.

[![Download from Sketchpacks.com](https://badges.sketchpacks.com/plugins/restore-overrides/version.svg)](https://api.sketchpacks.com/v1/plugins/restore-overrides/download)


## Installing Plugins

### Install from download
1. [Download the ZIP file](https://github.com/danielthall/restore-overrides/archive/master.zip) and unzip
2. Open `restore-overrides.sketchplugin`

### Install with Sketchpacks
1. With [Sketchpacks](https://sketchpacks.com), search for `Restore Overrides`
2. Click `Install`
3. Get automatic updates for `Restore OVerrides`

**Already have Sketchpacks?**

[![Install Restore Overrides with Sketchpacks](http://sketchpacks-com.s3.amazonaws.com/assets/badges/sketchpacks-badge-install.png "Install Restore Overrides with Sketchpacks")](https://sketchpacks.com/danielthall/restore-overrides/install)

### Install with Sketch Runner
With Sketch Runner, just go to the `install` command and search for `Restore Overrides`. Runner allows you to manage plugins and do much more to speed up your workflow in Sketch. [Download Runner here](http://www.sketchrunner.com).


## Usage

This plugin must be run sequentially in the following order:
1. Open the document and **do not update the library**
2. Run the `Override Export` command. This will create a JSON document at `${homeDirectory}/sketch-restore-overrides/${documentName}` containing the values of every override from every symbol instance from every artboard on every page in your document. Very large files (hundreds of artboards) may take up to 30 seconds.
3. Accept the library updates.
4. Run the `Override Import` command. This will find the generated JSON file and try to reset the values on the newly updated symbols.

## Things to look out for

This plugin has a few gotchas, most notably, it only works on text values. All other override types are not supported at this time. Additionally, Sketch doesn't appear to provide unique UUIDs for each override of the same type, so if you have a group of the same symbol- for example, list items- The override values all get the same ID. The current work around for this is to remove each item from the list as it is set. Because of this, the order of your symbol instances **must not change** from the time you export to the time you import.

## Roadmap
- [ ] Add tests
- [ ] Add ability to install from Sketch Runner and Sketch Packs
- [ ] Add support for other override types
