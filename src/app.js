angular.module('SolarSystemSoundMachine', ['ngMaterial', 'ngAnimate'])

	.config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default')
	    .primaryPalette('indigo')
	    .accentPalette('cyan');
	})

	.constant('AppParameters', window.appParameters)

	.controller('MenuController', ['AppParameters', function(AppParameters){
		this.params = AppParameters;
	}])

	.directive('planetSettings', function(){
	    return {
	      transclude: true,
	      scope: {
	        planet: '=planetSettings',
	        collapsable: '='
	      },
	      template: ['<div class="collapsable">',
  					'<div class="collapsable-heading"',
    					'<i class="fa fa-angle-right" ng-class="{\'fa-rotate-90\': viewModel.collapsed}"></i>',
    					'<span class="collapsable-heading-text" ng-click="toggle()">{{planet.name}}</span>',
  						'<md-slider ng-model="planet.rotation" min="0" max="0.03" step="0.0001" class="planetSlider"></md-slider>',
  					'</div>',
  					'<div ng-class="{\'collapsed\': viewModel.collapsed}" class="collapsable-body collapsable-animate margin-top-5" ng-transclude></div>',
					'</div>'].join(''),
	      link: function (scope, elm) {
	        scope.viewModel = {};
	        scope.viewModel.collapsed = false;
	        if(scope.collapsable === false){
	          scope.viewModel.collapsed = true;
	        }
	        var level = elm.parents('.collapsable').length;
	        if(level){
	          elm.css('margin-left', level*20+'px');
	        }

	        scope.toggle = function(){
	          scope.viewModel.collapsed = !scope.viewModel.collapsed;
	        };
	      }
	    };
	  });






	