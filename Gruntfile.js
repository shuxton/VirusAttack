module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: './deploy'
                }
            }
        },
        concat: {
            dist: {
                src: [  "src/lib/**/*.js",
                    "src/game/**/*.js",
                     ],
                dest: 'deploy/js/<%= pkg.name %>.js'
            }
        },
        watch: {
            files: 'src/**/*.js',
            tasks: ['concat']
        },
        open: {
            dev: {
                path: 'https://virus-attack.herokuapp.com/index.html'
            }
        }
    });

    grunt.registerTask('default', ['concat', 'connect', 'open', 'watch']);
    grunt.registerTask('heroku',
    ['compass:dist', 'autoprefixer', 'imagemin']);
}