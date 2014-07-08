module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					'public/stylesheets/style.css': 'public/stylesheets/style.less',
					'public/stylesheets/bootstrap.min.css': 'public/stylesheets/bootstrap.less'
				}
			}
		},
		watch: {
			styles: {
				files: [
					'public/stylesheets/*'
				],
				tasks: [
					'less'
				],
				options: {
					nospawn: true
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['watch']);
};
