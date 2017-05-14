'use strict';

var gulp = require( 'gulp' );
var bs = require('browser-sync');
var reload = bs.reload;
var nodemon = require('gulp-nodemon');
var sass = require( 'gulp-sass' );
var sourcemaps = require('gulp-sourcemaps');
var bs_sync_reload_delay = 500;

var src = {
	scss   : ['public/sass/*.scss', 'public/sass/**/*.scss'], 
	css    : 'css/main.css',
	ejs    : 'views/*.ejs',
	script : 'server.js'
};

// browserSync task
gulp.task( 'browser-sync', ['nodemon'], function(){
	bs.init( null, {
	    files : src.css,
	    proxy : "http://localhost:8080",
		port: 3000
	});
});

// sass task
gulp.task( 'sass', function(){
	return gulp.src( src.scss )
	.pipe( sourcemaps.init() )
	.pipe( sass({ outputStyle: 'compressed' }).on( 'error', sass.logError ) )
	.pipe( sourcemaps.write() )
	.pipe( gulp.dest( './public/css/' ))
	.pipe( reload({stream: true}));
}); 

gulp.task('nodemon', function (cb) {
    var callbackCalled = false;
    return nodemon({
    	script: src.script, 
    	watch: src.script
    })
    .on('start', function onStart() {
        if (!callbackCalled) {
            callbackCalled = true;
            cb();
        }
    })
    .on('restart', function onRestart() {
    	setTimeout( function reload(){
    		bs.reload({
    			sream : false
    		});
    	}, bs_sync_reload_delay)
    });
});



// Watch task
// gulp.task( 'default', function(){
// 	gulp.watch( src.scss, ['sass'] );
// });

gulp.task( 'default', ['sass','browser-sync'], function(){
	gulp.watch( src.scss, ['sass'] );
	gulp.watch( src.ejs ).on( 'change', reload );	
});
