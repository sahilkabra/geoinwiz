/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	meta: {
		version: '0.0.0'
	},
	concat: {
		dist: {
			src: ['{%= lib_dir %}/{%= file_name %}.js'],
			dest: 'dist/{%= file_name %}.js'
		}
	},
	jshint: {
		all: ['src/**/*.js', 'routes/**/*.js', 'test/**/*.js'],
		options: {
			curly: true,
			eqeqeq: true,
			immed: true,
			latedef: true,
			newcap: true,
			noarg: true,
			sub: true,
			undef: true,
			unused: true,
			boss: true,
		},
		gruntfile: {
			src: 'Gruntfile.js'
		},
		lib_test: {
			src: ['{%= lib_dir %}/**/*.js', '{%= test_dir %}/**/*.js']
		}
	},
});

  // These plugins provide necessary tasks.{% if (min_concat) { %}
//	grunt.loadNpmTasks('grunt-contrib-concat');
//	grunt.loadNpmTasks('grunt-contrib-uglify');{% } %}
//	grunt.loadNpmTasks('grunt-contrib-{%= test_task %}');
	grunt.loadNpmTasks('grunt-contrib-jshint');
//	grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
	grunt.registerTask('default', ['jshint']);
};
