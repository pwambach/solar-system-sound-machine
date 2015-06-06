window.appParameters = {
	rotationSpeed: 8,
	planets: [
		{
			name: "Mercury",
			distanceToSun: 51,
			radius: 2.4,
			color: 0x875581,
			rotation: 1/88,
			note: 0,
			velocity: 30,
			noteLength: 0.6,
			octave: 3,
		},
		{
			name: "Venus",
			distanceToSun: 77,
			radius: 4.2,
			color: 0xAEA4CF,
			rotation: 1/225,
			note: 9,
			velocity: 70,
			noteLength: 1,
			octave: 4
		},
		{
			name: "Earth",
			distanceToSun: 107,
			radius: 5,
			color: 0x107ACB,
			rotation: 1/365,
			note: 7,
			velocity: 80,
			noteLength: 1,
			octave: 4
		},
		{
			name: "Mars",
			distanceToSun: 143,
			radius: 3,
			color: 0xD94141,
			rotation: 1/687,
			note: 4,
			velocity: 80,
			noteLength: 1,
			octave: 4
		}
		,{
			name: "Jupiter",
			distanceToSun: 180,
			radius: 7,
			color: 0x3FC7B8,
			rotation: 1/4329,
			note: 7,
			velocity: 80,
			noteLength: 1,
			octave: 3
		},
		{
			name: "Saturn",
			distanceToSun: 220,
			radius: 5,
			color: 0xEBB779,
			rotation: 1/10751,
			note: 5,
			velocity: 80,
			noteLength: 1,
			octave: 3
		},
		{
			name: "Uranus",
			distanceToSun: 260,
			radius: 4,
			color: 0x6B95E9,
			rotation: 1/30660,
			note: 7,
			velocity: 80,
			noteLength: 1,
			octave: 2
		},
		{
			name: "Neptune",
			distanceToSun: 300,
			radius: 3.8,
			color: 0x3B47F9,
			rotation: 1/60225,
			note: 5,
			velocity: 80,
			noteLength: 1,
			octave: 2
		}
	],
	effects: [
		{
	        type: "Phaser",
	        rate: 2, // 0.01 to 8 is a decent range, but higher values are possible
	        depth: 0.2, // 0 to 1
	        feedback: 0.2, // 0 to 1+
	        stereoPhase: 10, // 0 to 180
	        baseModulationFrequency: 1000, // 500 to 1500
	        bypass: 0
	    },
        {
	        type: "Chorus",
	        rate: 1.5,
	        feedback: 0.2,
	        delay: 0.0045,
	        bypass: 0
	    }
	]
};
window.onload = function () {
	MIDI.loadPlugin({
		soundfontUrl: "./bower_components/midi-soundfonts-partial/FluidR3_GM/",
		instrument: "acoustic_grand_piano",
		onsuccess: function(){
			//MIDI.setEffects(appParameters.effects);
		}
	});
};


'use strict';

(function(appParameters){

	var $container = $('#canvasContainer');
	var backgroundColor = 0x43d3d3;
	var lineColor = 0x93f5f5;
	var PI2 = Math.PI*2;
	var planets = appParameters.planets;

	var frameUniform = {
	    type: 'f',
	    value: 0
	};

	// set the scene size
	var WIDTH = $(document).width();
	var HEIGHT = $(document).height();
	var ASPECT = WIDTH / HEIGHT;

	// WebGL Renderer
	var renderer = new THREE.WebGLRenderer({antialias: true });
	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;;
	renderer.setClearColor(backgroundColor, 1);
	renderer.setSize(WIDTH, HEIGHT);

	// Scene
	var scene = new THREE.Scene();

	//Orthographic Camera
	var d = 220;
	var orthoCamera = new THREE.OrthographicCamera( - d * ASPECT, d * ASPECT, d, - d, 1, 2500 );
	orthoCamera.position.set( -200, 160, 0 );
	orthoCamera.lookAt( new THREE.Vector3(0,0,0) );
	scene.add(orthoCamera);

	//Ambient Light
	var light = new THREE.AmbientLight( 0xe0e0e0 ); // soft white light
	scene.add( light );

	//Point Light
	var pointLight = new THREE.PointLight( 0xffff55, 0.4 );
	pointLight.position.y = 30;
	 pointLight.position.z = 10;
	 pointLight.position.x = -5;
	scene.add( pointLight );

	// Background Plane
	var geometry = new THREE.PlaneGeometry( 1000, 1000, 1, 1);
	var material = new THREE.MeshBasicMaterial({color: new THREE.Color( backgroundColor )});
	var plane = new THREE.Mesh( geometry, material );
	plane.position.y = -10;
	plane.rotation.x = Math.PI/-2;
	plane.receiveShadow = true;
	scene.add(plane);

	// Sun
	scene.add(new THREE.Mesh(
		new THREE.SphereGeometry( 15, 30, 30 ),
		new THREE.MeshLambertMaterial({color: 0xF9EC79})
	));


	//Light
	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 0, 20, 0 );
	spotLight.castShadow = true;
	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;
	spotLight.shadowCameraNear = 10;
	spotLight.shadowCameraFar = 800;
	spotLight.shadowCameraFov = 172;
	spotLight.shadowDarkness = 0.1;
	spotLight.shadowCameraVisible = false;
	spotLight.onlyShadow = false;
	scene.add( spotLight );


	//BeatLine
	var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(12, -10, planets[0].distanceToSun));
    lineGeometry.vertices.push(new THREE.Vector3(12, -10, planets[planets.length-1].distanceToSun));
    var line = new THREE.Line(
    	lineGeometry, 
    	new THREE.LineBasicMaterial({
	        color: 0x73e5e5
	    })
	);
    scene.add(line);

	//Planets
	planets.forEach(function(planetData){
		var planet = createPlanetMesh(planetData);
		planetData.amplitude = {
			type: 'f',
			value: 0
		}
		planetData.circle = createCircle(planetData);
		scene.add(planet);
	});




	function createPlanetMesh(planet) {
		//Spheres
		var sphere = new THREE.Mesh(
			new THREE.SphereGeometry( planet.radius, 50, 50 ),
			new THREE.MeshLambertMaterial({color: planet.color})
		); 
		sphere.position.z = planet.distanceToSun; 
		sphere.position.y = 0; 
		sphere.castShadow = true;
		var rotationWrapper = new THREE.Object3D();
		rotationWrapper.add(sphere);
		planet.mesh = rotationWrapper;


		if(planet.name === "Earth"){
			var moon = new THREE.Mesh(
				new THREE.SphereGeometry( 1.2, 8, 8 ),
				new THREE.MeshLambertMaterial({color: 0x969696})
			);
			moon.position.x = 8;
			moon.castShadow = true;
			sphere.rotation.x = 0.5;
			sphere.receiveShadow = true;
			sphere.add(moon);
		}


		if(planet.name === "Saturn"){					
			var ring = new THREE.Mesh(
			new THREE.RingGeometry(7, 10, 16, 1, 0, Math.PI * 2),
			new THREE.MeshLambertMaterial({color: 0xD9AE79}));
			ring.rotation.x = -Math.PI/2 - 0.4;
			ring.rotation.z = Math.PI/4;
			ring.castShadow = true;
			sphere.add(ring);
		}

		return rotationWrapper;
	}


	function rotatePlanet(planet){
		planet.mesh.rotation.y += (planet.rotation * (appParameters.rotationSpeed));
		if(planet.mesh.rotation.y > PI2){
			roundComplete(planet);
			planet.mesh.rotation.y = 0;
		}
		if(planet.name === "Earth" || planet.name === "Saturn"){
			planet.mesh.children[0].rotation.y += (planet.rotation * (appParameters.rotationSpeed)) * 4;
		}
	}

	function createCircle(planet){
		var segmentCount = 64,
		geometry = new THREE.Geometry();
		material = new THREE.LineBasicMaterial({ color: lineColor });

		var shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: {
				frame: frameUniform,
				amplitude: planet.amplitude
			},
		    vertexShader: document.getElementById( 'vertexShader' ).textContent,
		    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		} );

		var material = shaderMaterial;

		for (var i = 0; i <= segmentCount; i++) {
		    var theta = (i / segmentCount) * Math.PI * 2;
		    geometry.vertices.push(
		        new THREE.Vector3(
		            Math.cos(theta) * planet.distanceToSun,
		            0,
		            Math.sin(theta) * planet.distanceToSun));
		}

		var circle = new THREE.Line(geometry, material)
		scene.add(circle);
		return circle;
	}

	function roundComplete(planet){
		setAmplitude(planet.amplitude, planet.velocity);
		playNote(planet.note+(12*(planet.octave+1)), planet.velocity, planet.noteLength);
	}

	function setAmplitude(amplitude, value){
		amplitude.value = 2 + (value/127)*4;
		var reduceAmplitude = function(){
			requestAnimationFrame(function(){
				amplitude.value = amplitude.value - 0.1;
				if(amplitude.value > 0.0){
					reduceAmplitude();
				} else {
					amplitude.value = 0.0;
				}
			});
		}
		reduceAmplitude();
	}

	function playNote(note, velocity, length){
		var _length = length || 1;
		var _velocity = velocity || 90;
		MIDI.noteOn(0, note, _velocity, 0);
		MIDI.noteOff(0, note, _length);
	}


	// Render loop
	function render() {
		planets.forEach(rotatePlanet);
		frameUniform.value++;
	    renderer.render(scene, orthoCamera);
	    requestAnimationFrame(render);
	}
	$container.append(renderer.domElement); 
	render();
	var windowResize = THREEx.WindowResize(renderer, orthoCamera, undefined, 220);

})(window.appParameters);


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
  						'<md-slider ng-model="planet.rotation" min="0" max="0.02" step="0.0001" class="planetSlider" ng-class="planet.name" aria-label="planet speed"></md-slider>',
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










	