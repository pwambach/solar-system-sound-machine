window.appParameters = {
	rotationSpeed: 5,
	planets: [
		{
			name: "Mercury",
			distanceToSun: 51,
			radius: 2.4,
			color: 0x875581,
			rotation: 1/88,
			note: 0,
			velocity: 1,
			noteLength: 0.8,
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