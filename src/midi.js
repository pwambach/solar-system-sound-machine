window.onload = function () {
	MIDI.loadPlugin({
		soundfontUrl: "./bower_components/midi-soundfonts-partial/FluidR3_GM/",
		instrument: "acoustic_grand_piano",
		onsuccess: function(){
			MIDI.ready = true;
		}
	});
};

