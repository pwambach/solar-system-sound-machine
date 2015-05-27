angular.module('SolarSystemSoundMachine', ['ngMaterial'])

	.constant('AppParameters', window.appParameters)

	.controller('MenuController', ['AppParameters', function(AppParameters){
		this.params = AppParameters;
	}]);