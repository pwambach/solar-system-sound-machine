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
		if(MIDI.ready){
			MIDI.noteOn(0, note, _velocity, 0);
			MIDI.noteOff(0, note, _length);
		}
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

