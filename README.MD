# README #

### Common setup ###

* `npm install`

* `bower install`

* Rename config.json.dist to config.json

* Set locale in config.json

### Development ###

* `gulp serve` build and start browsersync server with watching

### Gulp tasks ###

* `gulp` or `gulp build` build an optimized version of application in /dist

* `gulp serve` build and start browsersync server with watching

* `gulp browsersync` start a browser sync server

* `gulp watch` start a watching stream

* `gulp jade` compile Jade files

* `gulp styles` proceed styles

* `gulp sass` compile SASS files

* `gulp sass` compile LESS files

* `gulp js` proceed JS files

* `gulp js:webpack` build bundle use Webpack + Babel

* `gulp js:copy` just copy and uglify all JS files

* `gulp js:vendor` proceed vendor js files from Bower

* `gulp icons` proceed icons/sprites

* `gulp icons:svgfont` compile font and style based on SVG icons in /src/icons

* `gulp icons:sprite` compile spritesheet and style based on sprites in /src/sprites

* `gulp copy:static` copy static files from /src to /dist

* `gulp copy:bower` copy bower_components to /dist

* `gulp reload` reload all browsers

* `gulp clean` remove /dist and temp files