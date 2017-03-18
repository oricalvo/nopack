## nopack

Running a JavaScript file under NodeJS is easy. Just invoke node + a path to a JavaScript file

However, running the same file under the browser is a little nightmare. In case the file is written according to the CommonJS specification then probably it uses the "require" syntax which is not supported under latest browsers

That's why we have module loaders like WebPack and SystemJS. The thing is that both of them are not easy to use

If you are building demos applications or just looking for a way to easily run CommonJS modules inside the browser then you should consider **nopack**

Let's assume you hold a JavaScript file named **main.js** and want to execute it under the browser

Your project contain an **index.html** file you want to open that file under the browser and load into it the the **main.js**. The last thing you want is to deal with complex module loaders like WebPack and SystemJS

So, first install nopack package

```
npm install nopack
```

Then execute the following command

```
node_modules/.bin/nopack
```

nopack automatically creates a web server and opens a new browser window. The browser is directed to the **index.html** 
which loads your **main.js** file and any other dependencies according to the CommonJS syntax

In case you are OK with installing global packages then you can execute

```
npm install -g nopack
```

And then, instead of specifying the long path of nopack script you can just execute

```
nopack
```

## How does it work

nopack spawns a web server and a browser. The web server searches the file system and looks for interesting files like main.js, index.html and others. When an HTTP request arrives for index.html the web server returns a modified version of the index.html by injecting a a script into it. The returned HTML is loaded into the browser and the nopackr client side script is loaded too and is responsible for importing the main.js file using SystemJS module loader

## License

MIT
