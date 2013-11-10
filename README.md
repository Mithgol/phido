![PhiDo](icon/PhiDo-32x32.png)

**PhiDo** (aka **φ道**) is a Fidonet browser with a GUI.

* Its name means “the Golden Path”, where “φ” represents [the golden ratio](http://en.wikipedia.org/wiki/Golden_ratio) and “道” means “path”.

* Its name sounds like the Russian “Фидо” that means “Fido” (as in “Fidonet”).

## Requirements

* PhiDo is written in HTML5 + CSS + JavaScript and requires [node-webkit](https://github.com/rogerwang/node-webkit) to run.

* PhiDo currently requires **Node.js** and **npm** for installation of dependencies. For futher versions of PhiDo the distribution of complete packages (with dependencies included) is planned.

* PhiDo supports only the JAM [(Joaquim-Andrew-Mats)](http://groups.google.com/group/fido7.ru.ftn.develop/msg/e2f5486f80394418) type of Fidonet message bases.

## Installing PhiDo

1. Make sure that **Node.js** and **npm** are installed. (Follow the “[Installation](https://github.com/joyent/node/wiki/Installation)” article in the Node's wiki. You may prefer [installing without building](https://github.com/joyent/node/wiki/Installation#installing-without-building), especially on Windows.)

2. Download the [ZIP-packed](https://github.com/Mithgol/phido/archive/master.zip) source code of PhiDo and unpack it to some directory. Then run `npm install --production` in that directory.

3. Download [node-webkit](https://github.com/rogerwang/node-webkit). Either unpack it to the PhiDo's directory or put in some other directory. In the latter case, add the node-webkit's directory to your system's `PATH` variable's value (unless you plan to use the verbose node-webkit's path when you launch PhiDo).

### Setting up

Copy `phido.conf-example` to `phido.conf` and edit in your favourite text editor.

### Launching PhiDo

Run `nw .` in the PhiDo's directory.

**Note:** if node-webkit resides in another directory and you won't add that directory to your system's `PATH` variable's value, then you should use a verbose (absolute or relative) path to the node-webkit's executable. (On Windows you may use the `start.bat` file as an example and edit it according to your circumstances.)

## License

MIT License, see the `LICENSE` file.