angular.module('SolarSystemSoundMachine', ['ngMaterial', 'ngAnimate'])

	.config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default')
	    .primaryPalette('cyan')
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
    					'<span></span>',
    					'<span class="collapsable-heading-text" ng-class="{\'rotate\': viewModel.collapsed}" ng-click="toggle()">{{planet.name}}</span>',
  						'<md-slider ng-model="planet.rotation" min="0" max="0.03" step="0.0001" class="planetSlider" ng-class="planet.name"></md-slider>',
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
	})


	.directive('parseInt', function(){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elm, attr, ngModel){
				ngModel.$parsers.push(function(a){
					return parseInt(a,10);
				});
			}	
		}
	})

	.run(['$rootScope', 'AppParameters', function($rootScope, AppParameters){
		$rootScope.menuVisible = false;

		var addRule = (function(style){
		 	var sheet = document.head.appendChild(style).sheet;
		    return function(selector, css){
		        var propText = Object.keys(css).map(function(p){
		            return p+":"+css[p]
		        }).join(";");
		        sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
		    }
		})(document.createElement("style"));

		angular.forEach(AppParameters.planets, function(planet){
			addRule("md-slider.md-default-theme."+planet.name+" .md-thumb:after", {
				background: '#'+planet.color.toString(16).toUpperCase(),
				'border-color': '#'+planet.color.toString(16).toUpperCase()
			});
			addRule("md-slider.md-default-theme."+planet.name+" .md-track.md-track-fill", {
  				'background-color': '#'+planet.color.toString(16).toUpperCase()
			});
		});
	}])










	