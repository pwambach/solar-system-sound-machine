// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = new THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: stop updating renderer and camera
//
// ```windowResize.destroy()```
// # Code

//

/** @namespace */
var THREEx	= THREEx || {}

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
 * @param {Function} dimension callback for renderer size
*/
THREEx.WindowResize	= function(renderer, camera, dimension, orthographicDistance){
	dimension 	= dimension || function(){ return { width: window.innerWidth, height: window.innerHeight } }
	orthographicDistance = orthographicDistance || 100;
	var callback	= function(){
		// fetch target renderer size
		var rendererSize = dimension();
		// notify the renderer of the size change
		renderer.setSize( rendererSize.width, rendererSize.height )
		// update the camera
		var ASPECT	= rendererSize.width / rendererSize.height;
		camera.left = - orthographicDistance * ASPECT;
		camera.right = orthographicDistance * ASPECT;
		camera.top = orthographicDistance;
		camera.bottom = - orthographicDistance;
		camera.updateProjectionMatrix();
	}
	// bind the resize event
	window.addEventListener('resize', callback, false)
	// return .stop() the function to stop watching window resize
	return {
		trigger	: function(){
			callback()
		},
		/**
		 * Stop watching window resize
		*/
		destroy	: function(){
			window.removeEventListener('resize', callback)
		}
	}
};
