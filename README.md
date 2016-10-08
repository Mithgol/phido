[![(a histogram of downloads)](https://nodei.co/npm-dl/phido.png?height=3)](https://npmjs.org/package/phido)

![PhiDo](icon/PhiDo-32x32.png)

**PhiDo** (aka **φ道**) is a Fidonet browser with a GUI.

* Its name means “the Golden Path”, where “φ” represents [the golden ratio](http://en.wikipedia.org/wiki/Golden_ratio) and “道” means “path”.

* Its name sounds like the Russian “Фидо” that means “Fido” (as in “Fidonet”).

## Features

[![(Fidonet Unicode substrings)](https://img.shields.io/badge/Fidonet-Unicode%20substrings-57ab1e.svg?style=plastic)](https://github.com/Mithgol/fiunis)
[![(Fidonet avatars)](https://img.shields.io/badge/Fidonet-avatars-57ab1e.svg?style=plastic)](https://github.com/Mithgol/node-fidonet-jam/blob/master/avatar.txt)
[![(FGHI URL)](https://img.shields.io/badge/FGHI-URL-57ab1e.svg?style=plastic)](https://github.com/Mithgol/FGHI-URL)
[![(Fidonet Runes)](https://img.shields.io/badge/Fidonet-Runes-57ab1e.svg?style=plastic)](https://github.com/Mithgol/node-fidonet-fidohtml)

The application is currently in an early phase of its development and thus does not have the desired level of feature completeness.

However, it already supports the following features:

* [Fidonet Unicode substrings](https://github.com/Mithgol/fiunis)

* pictures displayed instead of their [UUE codes](http://en.wikipedia.org/wiki/Uuencoding)

* some [Fidonet avatars](https://github.com/Mithgol/node-fidonet-jam/blob/master/avatar.txt)

* some [FGHI URLs](https://github.com/Mithgol/FGHI-URL)

* [IPFS](https://ipfs.io/) URLs (both `fs:` and `ipfs:`), using the [`ipfs.io`](https://ipfs.io/) web gate

* some Fidonet Runes (Markdown-alike declarations of hyperlinks and images)

## Requirements

* PhiDo is written in HTML5 + CSS + JavaScript and uses the latest [nw.js](https://github.com/nwjs/nw.js) engine to run. A system supported by nw.js (such as Windows, or Linux, or Mac OS X) is required.

* Have 2 Gb RAM (or more). When PhiDo renders large Fidonet echomail areas (thousands of messages) and some other browser (such as Firefox) is running in background, if the system has only 1 Gb RAM (or less), swapping occurs inevitably.

* PhiDo currently requires **Node.js** and **npm** to be present (installed) on your system. (Usually [Node.js installers](https://nodejs.org/en/download/) install both Node.js and npm.) A compatible Node's fork such as [io.js](https://iojs.org/) or [JXcore](http://jxcore.com/) is fine too.

* PhiDo currently supports only the JAM [(Joaquim-Andrew-Mats)](https://github.com/Mithgol/node-fidonet-jam/blob/master/JAM.txt) type of Fidonet message bases.

* PhiDo currently uses [HPT](http://husky.sourceforge.net/hpt.html)'s area configuration file as the description of echomail areas.

* PhiDo does not currently create any lock files, not does it lock files in use. Users themselves have to prevent their echoprocessors (tossers) or mail editors from running when PhiDo is active.

## Installing PhiDo

[![(npm package version)](https://nodei.co/npm/phido.png?downloads=true&downloadRank=true)](https://npmjs.org/package/phido)

### Global installation

* Latest packaged version: `npm install -g phido`

* Latest githubbed version: `npm install -g https://github.com/Mithgol/phido/tarball/master`

The application becomes installed globally (for example, in `node_modules/phido` subdirectory in your Node's directory) and appears in your `PATH`.

You may use `phido` command to run the application.

You should create a configuration file for the installed PhiDo (in its directory) before you launch it.

### Local installation

Instead of the above, download the [ZIP-packed](https://github.com/Mithgol/phido/archive/master.zip) source code of PhiDo and unpack it to some directory. Then run `npm install --production` in that directory.

Unlike the global installation (`npm -g`), the application does not appear in the `PATH`, and thus you'll have to run it directly from the application's directory. You'll also have to run `node phido` instead of `phido`. (On Windows you may use `start.bat` as the launcher.)

You should create a configuration file for the installed PhiDo (in its directory) before you launch it.

#### Portability of a local installation

If you install PhiDo in a directory on a portable drive (such as [a USB flash drive](https://en.wikipedia.org/wiki/USB_flash_drive)), you may move it to a different system and run PhiDo there if the following requirements are met:

* The platform has to be the same (i.e. move from Linux to Linux, or from Windows to Windows, or from Mac OS X to Max OS X).

* The architecture has to be the same (i.e. move from a 32-bit system to 32-bit or from 64-bit system to 64-bit).

* It is also possible to run PhiDo on a 64-bit Windows if PhiDo was originally installed on a 32-bit Windows, but not vice versa.

* Node.js has to be installed on the target system. A compatible Node's fork such as [io.js](https://iojs.org/) or [JXcore](http://jxcore.com/) is fine too.

#### Be patient

About 200 megabytes of dependencies are installed. Most of them contain dozens of small files with source code and metadata. An installation on a low-speed (USB 2.0) flash drive may take, for example, **half an hour** on a system with a limited Internet connection.

## Configuration options

PhiDo uses the configuration given in the file `phido.conf` in PhiDo's directory (in the same directory where PhiDo's `package.json` resides).

You may use `phido.conf-example` as an example. (Or even copy `phido.conf-example` to `phido.conf` and edit in your favourite text editor.)

The following configuration options are supported (in arbitrary order):

* `ConfigGoldED` — path to the configuration file of GoldED (or [GoldED+](http://golded-plus.sf.net), or GoldED-NSF). This setting is not necessary, but it allows to use PhiDo alongside that popular Fidonet mail editor (GoldED) when the former uses some settings of the latter. The following settings (also individually mentioned below) are used:
   * `UserName`
   * `ViewKludges`
   * `StyleCodes`
   * `AreaSep`

* `EncodingGoldED` — the encoding of non-ASCII characters in the GoldED config file. By default, `utf8` is used. You may use any encoding provided by the [`iconv-lite`](https://github.com/ashtuchkin/iconv-lite) module.

* `AreasHPT` — path to the area configuration file of HPT. This setting is necessary for PhiDo to know where the echomail resides.
   * The configuration lines for echomail are expected to start with `EchoArea` (literally; not case-sensitive), then a whitespace-separated echotag (such as `Ru.FTN.Develop` for example), then a whitespace-separated full path (without the extensions) to the echomail files of the area, in that order. (A sequence of several whitespaces is also a supported separator.) The rest of the configuration line is also whitespace-separated from the path.
   * If the `-d "some description"` is found on the same line, it is used as the echomail area's description.
   * Only JAM echomail areas are supported. Names of echo base files are generated by appending lowercase extensions (`.jhr`, `.jdt`, `.jdx`, `.jlr`) to the given path.

* `EncodingHPT` — the encoding of non-ASCII characters in the HPT areafile. By default, `utf8` is used. You may use any encoding provided by the [`iconv-lite`](https://github.com/ashtuchkin/iconv-lite) module.

* `UserName` — the user's name. May be borrowed from GoldED's configuration if omitted in PhiDo's.

* `ViewKludges` — if `Yes` (case-insensitive), Fidonet kludges (hidden lines) are displayed. This setting may be borrowed from GoldED's configuration if omitted in PhiDo's, but it affects unknown kludges as well (while in GoldED unknown kludges are controlled by a separate `ViewHidden` setting).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) `StyleCodes` — may have one of the following values (not case-sensitive; borrowed from GoldED's configuration if omitted in PhiDo's) that control the processing of style codes:
   * `Yes` (default) — style codes affect the style of words surrounded by them. There are four types of style codes: `*asterisks*`, `_underscores_`, `#hashes#` or `/slashes/` around words.
   * `Hide` — same as above, but the style codes themselves are not displayed.
   * `No` — style codes are ignored (treated as any other characters).

* `AreaSep` — descriptions of separators between areas in the arealist. May be borrowed from GoldED's configuration if omitted in PhiDo's. Each separator consists of the following elements (separated with one or more spaces):
   * `AreaSep` (literally)
   * areatag (such as `Ru.FTN.Develop` for example)
   * `"separator text"` (in double quotes)
   * group ID (number, currently ignored)
   * group type (currently only `Echo` separators are displayed)

* `ZIPNodelist` — path to a ZIP-packed nodelist.

* `MaximizeWindow` — if `Yes` (case-insensitive), the PhiDo's window is maximized after PhiDo starts.

### Examples of external configuration files

Examples of the area configuration file of HPT are available in its own CVS repository on SourceForge [in English](http://husky.cvs.sf.net/viewvc/husky/hpt/config/areas) and [in Russian](http://husky.cvs.sf.net/viewvc/husky/hpt/config/areas.ru). Text lines of these examples are commented out (by `#` characters in the lines' beginnings) but your real configuration lines must be uncommented.

An example of GoldED configuration file is [available](http://golded-plus.cvs.sourceforge.net/viewvc/golded-plus/golded%2B/etc/golded.conf?revision=1.1&view=markup) in the CVS of GoldED+. It contains a lot of configuration directives; only the most basic of them are understood by PhiDo (and they already appear in `phido.conf-example` anyway).

### Launching PhiDo from GoldED

PhiDo can be configured and used as an advanced external viewer of echomail messages for any version of GoldED (for example, for GoldED+ or GoldED-NSF).

It is useful because PhiDo has the following features that are not present in GoldED:

* FGHI URLs become hyperlinks (GoldED-NSF also has this feature, but GoldED+ does not have it)

* Raster images (PNG, JPEG, GIF) and vector images (SVG) are automatically decoded from UUE and displayed instead of UUE

* Unicode support

* User's picture (avatar) in a message's header

* Fidonet Runes (Markdown-alike declarations of hyperlinks and images)

Two lines have to be added to configuration files of GoldED to enable launching of PhiDo.

The first additional line has to be added in the main GoldED's configuration file (usually called `golded.cfg` or `gedcyg.cfg`); this line defines a new external utility (15th in this example).

To launch a global installation of PhiDo, use the following line:

    ExternUtil 15 phido "--file=@file" "--area=@cecho"

To launch a local installation of PhiDo, use the following line:

    ExternUtil 15 node \path\to\PhiDo\phido "--file=@file" "--area=@cecho"

* Substitute `\path\to\PhiDo` with the real path that leads to PhiDo on your system.

* If not on Windows, `/` instead of `\` is likely to be used in your paths.

The second additional line has to be added in the GoldED's hotkey configuration file (usually `goldkeys.cfg`); this line defines a hotkey for the utility (`F12` in this example):

    F12 ExternUtil15

Afterwards press F12 to launch PhiDo from GoldED. If the message that you view in GoldED has a MSGID (it usually has; see [FTS-0009.001](http://ftsc.org/docs/fts-0009.001) for details), PhiDo shows the same message; otherwise PhiDo displays the list of available echomail areas.

## Testing PhiDo

[![(build testing status)](https://img.shields.io/travis/Mithgol/phido/master.svg?style=plastic)](https://travis-ci.org/Mithgol/phido)

It is necessary to install [JSHint](http://jshint.com/) for testing.

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of PhiDo).

After that you may run `npm test` (in the directory of PhiDo). Only the JS code issues are caught; the code's behaviour is not tested.

## License

The source code is MIT-licensed (see `LICENSE`), with the following exceptions:

* The file `jq/jquery.color.min.js` contains [jQuery Color](https://github.com/jquery/jquery-color) plugin by jQuery Foundation and other contributors, [MIT-licensed](https://jquery.org/license/).

* The file `jq/scrollspy.js` contains [scrollSpy](https://github.com/thesmart/jquery-scrollspy), a jQuery plugin by John Smart (MIT-licensed).

* Fonts in the `paratype` directory are published [by ParaType](http://www.paratype.com/public/) on the terms of [ParaType Free Font Licensing Agreement](http://www.paratype.com/public/pt_openlicense_eng.asp). (See the `PT Free Font License*.txt` files in the same folder.)

* The directory `bootstrap` contains [Bootstrap](http://getbootstrap.com/) licensed under [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0). It is used in a hope that a newer version becomes MIT-licensed eventually [(as planned)](http://blog.getbootstrap.com/2013/10/29/bootstrap-3-0-1-released/) and replaces the current version.

* This product uses the JAM(mbp) API — Copyright 1993 Joaquim Homrighausen, Andrew Milner, Mats Birch, Mats Wallin. ALL RIGHTS RESERVED. (JAM may be used by any developer as long as [its specifications](https://github.com/Mithgol/node-fidonet-jam/blob/master/JAM.txt) are followed exactly. JAM may be used free-of-charge by any developer for any purpose, commercially or otherwise.)

* Node.js modules (installed in the `node_modules` directory) belong to their respective owners.