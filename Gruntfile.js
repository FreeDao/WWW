'use strict';

var lrSnippet = require('connect-livereload')();
var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};


module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var pathConfig = {
        app : 'app',
        dist : 'dist',
        tmp : '.tmp',
        test : 'test'
    };

    grunt.initConfig({
        paths : pathConfig,
        watch : {
            compass : {
                files : ['<%= paths.app %>/compass/{,*/}*/{,*/}*.{scss,sass,png,ttf}'],
                tasks : ['compass:server']
            },
            test : {
                files : ['<%= paths.app %>/javascripts/**/*.js'],
                tasks : ['jshint:test', 'karma:server:run'],
                options : {
                    spawn : false
                }
            },
            stencil : {
                files : ['<%= paths.app %>/**/*.html'],
                tasks : ['stencil:server'],
                options : {
                    spawn : false
                }
            },
            statics : {
                files : ['<%= paths.app %>/statics/**/*.*'],
                tasks : ['copy:server'],
                options : {
                    spawn : false
                }
            },
            livereload: {
                files: [
                    '<%= paths.app %>/javascripts/**/*.js',
                    '<%= paths.app %>/images/**/*.*',
                    '<%= paths.tmp %>/**/*.html',
                    '<%= paths.tmp %>/stylesheets/**/*.css',
                    '<%= paths.tmp %>/images/**/*.*'
                ],
                options : {
                    livereload : true,
                    spawn : false
                }
            }
        },
        connect : {
            options : {
                port : 9999,
                hostname : '0.0.0.0'
            },
            rules : [{
                from : '^/android',
                to : '/android.html'
            }, {
                from : '^/terms',
                to : '/terms.html'
            }, {
                from : '^/privacy',
                to : '/privacy.html'
            }, {
                from : '^/api',
                to : '/api.html'
            }, {
                from : '^/branding',
                to : '/branding.html'
            }, {
                from : '^/xibaibai',
                to : '/xibaibai/index.html'
            }, {
                from : '^/zhuizhuikan',
                to : '/zhuizhuikan.html'
            }],
            server : {
                options : {
                    middleware : function (connect) {
                        return [
                            lrSnippet,
                            rewriteRulesSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, pathConfig.app)
                        ];
                    }
                }
            }
        },
        open: {
            server : {
                path : 'http://127.0.0.1:<%= connect.options.port %>',
                app : 'Google Chrome Canary'
            }
        },
        clean : {
            dist : ['<%= paths.tmp %>', '<%= paths.dist %>'],
            server : '<%= paths.tmp %>'
        },
        useminPrepare : {
            html : ['<%= paths.tmp %>/**/*.html'],
            options : {
                dest : '<%= paths.dist %>'
            }
        },
        usemin: {
            html : ['<%= paths.dist %>/*.html'],
            options : {
                dirs : ['<%= paths.dist %>']
            }
        },
        htmlmin : {
            dist : {
                files : [{
                    expand : true,
                    cwd : '<%= paths.tmp %>',
                    src : ['*.html'],
                    dest : '<%= paths.dist %>'
                }]
            }
        },
        copy : {
            server : {
                files : [{
                    expand : true,
                    dot : true,
                    cwd : '<%= paths.app %>/statics/',
                    dest : '<%= paths.tmp %>',
                    src : [
                        '**/*.*'
                    ]
                }]
            },
            dist : {
                files : [{
                    expand : true,
                    dot : true,
                    cwd : '<%= paths.app %>',
                    dest : '<%= paths.dist %>',
                    src : [
                        'images/**/*.{webp,gif,png,jpg,jpeg}'
                    ]
                }]
            }
        },
        compass : {
            options : {
                sassDir : '<%= paths.app %>/compass/sass',
                imagesDir : '<%= paths.app %>/compass/images',
                fontsDir : '<%= paths.app %>/compass/fonts',
                relativeAssets : true,
                require : 'compass-blueprint'
            },
            server : {
                options : {
                    cssDir : '<%= paths.tmp %>/stylesheets',
                    generatedImagesDir : '<%= paths.tmp %>/images',
                    debugInfo : true
                }
            },
            dist : {
                options : {
                    cssDir : '<%= paths.dist %>/stylesheets',
                    generatedImagesDir : '<%= paths.dist %>/images',
                    outputStyle : 'compressed',
                    httpGeneratedImagesPath: 'http://img.wdjimg.com/www/images/',
                    relativeAssets : false
                }
            }
        },
        rev : {
            dist : {
                files : {
                    src : [
                        '<%= paths.dist %>/javascripts/**/*.js',
                        '<%= paths.dist %>/stylesheets/**/*.css'
                    ]
                }
            }
        },
        imagemin : {
            dist : {
                files : [{
                    expand : true,
                    cwd : '<%= paths.dist %>/images',
                    src : '**/*.{png,jpg,jpeg}',
                    dest : '<%= paths.dist %>/images'
                }]
            }
        },
        requirejs : {
            dist : {
                options : {
                    optimize : 'uglify',
                    uglify : {
                        toplevel : true,
                        ascii_only : false,
                        beautify : false
                    },
                    preserveLicenseComments : true,
                    useStrict : false,
                    wrap : true
                }
            }
        },
        concurrent: {
            server : ['copy:server', 'compass:server'],
            dist : ['copy:dist', 'compass:dist']
        },
        jshint : {
            test : ['<%= paths.app %>/javascripts/**/*.js']
        },
        karma : {
            options : {
                configFile : '<%= paths.test %>/karma.conf.js',
                browsers : ['Chrome_without_security']
            },
            server : {
                reporters : ['progress'],
                background : true
            },
            test : {
                reporters : ['progress', 'junit', 'coverage'],
                preprocessors : {
                    '<%= paths.app %>/javascripts/**/*.js' : 'coverage'
                },
                junitReporter : {
                    outputFile : '<%= paths.test %>/output/test-results.xml'
                },
                coverageReporter : {
                    type : 'html',
                    dir : '<%= paths.test %>/output/coverage/'
                },
                singleRun : true
            },
            travis : {
                browsers : ['PhantomJS'],
                reporters : ['progress'],
                singleRun : true
            }
        },
        bump : {
            options : {
                files : ['package.json', 'bower.json'],
                updateConfigs : [],
                commit : true,
                commitMessage : 'Release v%VERSION%',
                commitFiles : ['-a'],
                createTag : true,
                tagName : 'v%VERSION%',
                tagMessage : 'Version %VERSION%',
                push : false
            }
        },
        stencil : {
            options : {
                partials : '<%= paths.app %>/partials',
                templates : '<%= paths.app %>/templates',
                dot_template_settings : {
                    strip : false
                }
            },
            server : {
                options : {
                    env : {
                        title : '豌豆荚',
                        prefix : ''
                    }
                },
                files : [{
                    expand : true,
                    cwd : '<%= paths.app %>/pages/',
                    src : '**/*.dot.html',
                    dest : '<%= paths.tmp %>',
                    ext : '.html',
                    flatten : false
                }]
            },
            dist : {
                options : {
                    env : {
                        title : '豌豆荚',
                        prefix : 'http://www.wandoujia.com'
                    }
                },
                files : [{
                    expand : true,
                    cwd : '<%= paths.app %>/pages/',
                    src : '**/*.dot.html',
                    dest : '<%= paths.tmp %>',
                    ext : '.html',
                    flatten : false
                }]
            }
        }
    });

    grunt.registerTask('server', [
        'clean:server',
        'concurrent:server',
        'configureRewriteRules',
        'connect:server',
        // 'karma:server',
        'stencil:server',
        'open',
        'watch'
    ]);

    grunt.registerTask('test', [
        'jshint:test',
        'karma:test'
    ]);

    grunt.registerTask('test:travis', [
        'jshint:test',
        'karma:travis'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'stencil:dist',
        'useminPrepare',
        'concat',
        'uglify',
        'imagemin',
        'htmlmin',
        'rev',
        'usemin'
    ]);
};
