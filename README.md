## SystemJS Server

Running a JavaScript file under NodeJS is easy. Just invoke node + a path to a JavaScript file

However, running the same file under the browser is a little nightmare. In case the file is written according to the CommonJS specification then probably it uses the "require" syntax which is not supported under latest browser

That's why we have module loaders like WebPack and SystemJS. The thing is that both of them are not easy to configure

If you are building demos applications or just looking for a way to easily run CommonJS modules inside the browser then you should consider the systemjs-server

Let's assume you hold a JavaScript file named **calc.js** and want to execute it under the browser

Your project does not contain any **index.html** file and for sure you are not interested learning how to work with complex module loaders like WebPack and SystemJS

So, first install systemjs-server

```
npm install systemjs-server
```

Then execute the following command

```
node_modules/.bin/sjs calc.js
```

systemjs-server automatically creates a web server and opens a new browser window. The web server returns a default HTML file
which loads your **calc.js** file and any other dependencies according to the CommonJS syntax

In case you are OK with installing global packages then you can execute

```
npm install -g systemjs-server
```

And then, instead of specifying the long path of sjs script you can just execute

```
sjs calc.js
```

In case the JavaScript to be executed has a common name like
* main.js
* app.js
* app/main.js

Then you don't even need to specify the file name. Just execute
```
sjs
```

And systemjs-server automatically looks for one of the "conventional" scripts. If no file was found a message is printed to the browser's console

## How does it work

systemjs-server spawns a web server and a browser. The web server searches the file system and looks for interesting files like main.js, system.src.js and others. When an HTTP request arrives for the root URL / the web server returns a "pre-defined" index.html and populates it with the configuration that was deducted during the file system search. The returned HTML is loaded into the browser and the systemjs-server client side script is loaded too and is responsible for importing the main.js file using SystemJS module loader

## More Options

You can use your own HTML file

## License

MIT
