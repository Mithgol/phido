![PhiDo](icon/PhiDo-32x32.png)

**PhiDo** (aka **φ道**) is a Fidonet browser with a GUI.

* Its name means “the Golden Path”, where “φ” represents [the golden ratio](http://en.wikipedia.org/wiki/Golden_ratio) and “道” means “path”.

* Its name sounds like the Russian “Фидо” that means “Fido” (as in “Fidonet”).

## Requirements

* PhiDo is written in HTML5 + CSS + JavaScript and requires [node-webkit](https://github.com/rogerwang/node-webkit) to run.

* PhiDo currently requires **Node.js** and **npm** for installation of dependencies. For futher versions of PhiDo the distribution of complete packages (with dependencies included) is planned.

* PhiDo supports only the JAM [(Joaquim-Andrew-Mats)](http://groups.google.com/group/fido7.ru.ftn.develop/msg/e2f5486f80394418) type of Fidonet message bases.

* PhiDo currently uses [HPT](http://husky.sourceforge.net/hpt.html)'s area configuration file as the description of echomail areas.

## Installing PhiDo

1. Make sure that **Node.js** and **npm** are installed. (Follow the “[Installation](https://github.com/joyent/node/wiki/Installation)” article in the Node's wiki. You may prefer [installing without building](https://github.com/joyent/node/wiki/Installation#installing-without-building), especially on Windows.)

2. Download the [ZIP-packed](https://github.com/Mithgol/phido/archive/master.zip) source code of PhiDo and unpack it to some directory. Then run `npm install --production` in that directory.

3. Download [node-webkit](https://github.com/rogerwang/node-webkit). Either unpack it to the PhiDo's directory or put in some other directory. In the latter case, add the node-webkit's directory to your system's `PATH` variable's value (unless you plan to use the verbose node-webkit's path when you launch PhiDo).

### Setting up

Copy `phido.conf-example` to `phido.conf` and edit in your favourite text editor.

The following configuration options are supported (in arbitrary order):

* `ConfigGoldED` — path to the configuration file of GoldED (or GoldED+, or GoldED-NSF). This setting allows to use PhiDo alongside the popular Fidonet mail editor (GoldED) when the former uses some settings of the latter.

* `EncodingGoldED` — the encoding of non-ASCII characters in the GoldED config file. By default, `utf8` is used. You may use any encoding provided by the [singlebyte](https://github.com/Mithgol/node-singlebyte) module.

* `AreasHPT` — path to the area configuration file of HPT. This setting is necessary for PhiDo to know where the echomail resides.
   * The configuration lines for echomail are exprected to start with `EchoArea` (literally), then a whitespace-separated echotag (such as `Ru.FTN.Develop` for example), then a whitespace-separated full path (without the extensions) to the echomail files of the area, in that order. (A sequence of several whitespaces is also a supported separator.) The rest of the configuration line is also whitespace-separated from the path.
   * If the `-d "some description"` is found on the line, it is used as the echomail area's description.
   * Only JAM echomail areas are supported. Names of echo base files are generated by appending lowercase extensions (`.jhr`, `.jdt`, `.jdx`, `.jlr`) to the given path.

* `EncodingHPT` — the encoding of non-ASCII characters in the HPT areafile. By default, `utf8` is used. You may use any encoding provided by the [singlebyte](https://github.com/Mithgol/node-singlebyte) module.

* `UserName` — the user's name. May be borrowed from GoldED's configuration if omitted in PhiDo's.

## Launching PhiDo

Run `nw .` in the PhiDo's directory.

**Note:** if node-webkit resides in another directory and you won't add that directory to your system's `PATH` variable's value, then you should use a verbose (absolute or relative) path to the node-webkit's executable. (On Windows you may use the `start.bat` file as an example and edit it according to your circumstances.)

## License

The source code is MIT-licensed (see `LICENSE`), with the following exceptions:

* The file `jq/$.js` contains [jQuery](http://jquery.com/) which is also [MIT-licensed](https://jquery.org/license/) but has its own authors.

* Fonts in the `paratype` directory are published [by ParaType](http://www.paratype.com/public/) on the terms of [ParaType Free Font Licensing Agreement](http://www.paratype.com/public/pt_openlicense_eng.asp). (See the `PT Free Font License*.txt` files in the same folder.)

* The directory `bootstrap` contains [Bootstrap](http://getbootstrap.com/) licensed under [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0). It is used in a hope that a newer version becomes MIT-licensed eventually [(as planned)](http://blog.getbootstrap.com/2013/10/29/bootstrap-3-0-1-released/) and replaces the current version.

* The directory `awesome` contains [Font Awesome](http://fortawesome.github.io/Font-Awesome/), licensed under [SIL OFL 1.1](http://scripts.sil.org/OFL).

* This product uses the JAM(mbp) API — Copyright 1993 Joaquim Homrighausen, Andrew Milner, Mats Birch, Mats Wallin. ALL RIGHTS RESERVED. (JAM may be used by any developer as long as its specifications are followed exactly. JAM may be used free-of-charge by any developer for any purpose, commercially or otherwise.)

* Node.js modules installed in the `node_modules` directory are the property of their respective owners.