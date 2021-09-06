/*
	juliaset.js - Julia set renderer
	 
	---------------------------------------------------------------------
	
	This file is part of the JuliaJS project.
	(C) 2021 Winston Deleon, wdeleon0@gmail.com
	
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License, version 3,
	as published by the Free Software Foundation.
	
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	
	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

let JuliaSet = {
	defaults: {
		xWidth: 2.5,
		xCenter: 0,
		
		yWidth: 0,
		yCenter: 0,
		
		a: 0.377,		// -0.79,
		b: 0.28,		// 0.15,
		mandelbrot: false,
		
		red: 255,
		green: 128,
		blue: 0,
	},
	
	settings: {
		previousCommit: false,
	},
	
	// Save the settings the most recent image was rendered with
	commitSettings: function () {
		JuliaSet.settings.previousCommit = true;
		
		// Settings directly from form fields:
		JuliaSet.settings.a = Controls.inputs.toNumber.call(DOM.a);
		JuliaSet.settings.b = Controls.inputs.toNumber.call(DOM.b);
		JuliaSet.settings.pxSize = Controls.inputs.toNumber.call(DOM.pX, flags.INT | flags.ABS);
		JuliaSet.settings.pySize = Controls.inputs.toNumber.call(DOM.pY, flags.INT | flags.ABS);
		JuliaSet.settings.xSize = Controls.inputs.toNumber.call(DOM.cxWidth, flags.ABS);
		JuliaSet.settings.xCenter = Controls.inputs.toNumber.call(DOM.cxCenter);
		JuliaSet.settings.yCenter = Controls.inputs.toNumber.call(DOM.cyCenter);
		JuliaSet.settings.aspectX = Controls.inputs.toNumber.call(DOM.aspectX, flags.ABS);
		JuliaSet.settings.aspectY = Controls.inputs.toNumber.call(DOM.aspectY, flags.ABS);
		
		// Color selection:
		JuliaSet.settings.red = Colors.red;
		JuliaSet.settings.green = Colors.green;
		JuliaSet.settings.blue = Colors.blue;
		
		// Mandelbrot set selector radio buttons:
		if (DOM.mandelbrotRadio.checked == true) {
			JuliaSet.settings.mandelbrot = true;
		}
		else {
			JuliaSet.settings.mandelbrot = false;
		}
		
		// Derived values:
		JuliaSet.settings.xMin = JuliaSet.settings.xCenter - (JuliaSet.settings.xSize / 2);
		JuliaSet.settings.ySize = JuliaSet.settings.xSize / (JuliaSet.settings.pxSize / JuliaSet.settings.pySize);
		JuliaSet.settings.yMax = JuliaSet.settings.yCenter + (JuliaSet.settings.ySize / 2);
		JuliaSet.settings.stepSize = JuliaSet.settings.xSize / JuliaSet.settings.pxSize;
		
		RenderHistory.add();
	},
	
	// Restore the control form fields back to the settings contained in the passed object
	loadSettings: function (settings) {
		// Restore rendering settings object:
		JuliaSet.settings = settings;
		
		// Restore imput form settings:
		DOM.a.value = JuliaSet.settings.a;
		DOM.b.value = JuliaSet.settings.b;
		DOM.pX.value = JuliaSet.settings.pxSize;
		DOM.pY.value = JuliaSet.settings.pySize;
		DOM.cxWidth.value = JuliaSet.settings.xSize;
		DOM.cxCenter.value = JuliaSet.settings.xCenter;
		DOM.cyCenter.value = JuliaSet.settings.yCenter;
		DOM.aspectX.value = JuliaSet.settings.aspectX;
		DOM.aspectY.value = JuliaSet.settings.aspectY;
		
		// Restore color:
		Colors.changeTo(JuliaSet.settings.red, JuliaSet.settings.green, JuliaSet.settings.blue);
		
		// Handle Mandelbrot set selector radio buttons:
		if (JuliaSet.settings.mandelbrot) {
			DOM.mandelbrotRadio.checked = true;
			DOM.juliaRadio.checked = false;
		}
		else {
			DOM.juliaRadio.checked = true;
			DOM.mandelbrotRadio.checked = false;
		}
	},
	
	workPool: false,
	
	initialize: function () {
		JuliaSet.workPool = new WorkerPool(JuliaSet.workerFunction, MainCanvas.paint);
	},
	
	render: function (threads = window.navigator.hardwareConcurrency) {
		// Disable history buttons to prevent strange artifacting resulting from buttons being pushed before current render is complete:
		RenderHistory.disableButtons();
		DOM.saveButton.disabled = true;
		
		// Perturbation parameters:
		let a = JuliaSet.settings.a;
		let b = JuliaSet.settings.b;
		
		// Mandelbrot or Julia set:
		let mandelbrot = JuliaSet.settings.mandelbrot;
		
		// Pixel X and Y dimensions:
		let pxSize = JuliaSet.settings.pxSize;
		let pySize = JuliaSet.settings.pySize;
		let blockPySize = Math.floor(pySize / threads);
		
		// Cartesian X and Y framing:
		let xSize = JuliaSet.settings.xSize;
		let xMin = JuliaSet.settings.xMin;
		
		let ySize = JuliaSet.settings.ySize;
		let yMax = JuliaSet.settings.yMax;
		
		// Cartestian coordinate step size of each pixel:
		let stepSize = JuliaSet.settings.stepSize;
		
		// Colors:
		let red = JuliaSet.settings.red;
		let green = JuliaSet.settings.green;
		let blue = JuliaSet.settings.blue;

		MainCanvas.resize();
		
		// First block starts at the top:
		let y = yMax;
		let py = 0;
		
		for (let i = 0; i < threads; i++) {
			let msg = {};
			msg.a = a;
			msg.b = b;
			msg.stepSize = stepSize;
			msg.x = xMin;
			msg.pxSize = pxSize;
			msg.y = y;
			msg.py = py;
			msg.iterationLimit = 1000;
			msg.mandelbrot = mandelbrot;
			msg.red = red;
			msg.green = green;
			msg.blue = blue;
			
			// An extra row of pixels must be added to block numbers less than the remainder of
			// the total Y pixel size divided by block Y pixel size:
			let currentBlockPySize = blockPySize;
			if (i < (pySize % blockPySize)) {
				currentBlockPySize += 1;
			}
			msg.pySize = currentBlockPySize;
			
			// Topmost cartestian Y value of the next block down:
			y -= stepSize * currentBlockPySize;
			
			// Pixel Y value of the next block down:
			py += currentBlockPySize;
			
			JuliaSet.workPool.dispatchWorkUnit(msg);
		}
	},
	
	workerFunction: function () {
		onmessage = function (e) {
			/***
			 *   There are a lot of variables here, so this is a reference:
			 *
			 *   a, b: perturbation parameters
			 *   x: cartesian X leftmost edge
			 *   cx, cy: cartesian X and Y coordinates of the point currently being tested
			 *   px, py: pixel X and Y coordinates of the point currently being tested
			 *   pxSize, pySize: pixel X and Y dimensions of current block
			 *   iterationLimit: the maximum number of iterations to run for testing each point
			 *   iterations: the number of iterations needed to escape (or not) by the current point being tested
			 *   mandelbrot: set to TRUE to render the Mandelbrot set instead of a Julia set
			 *   stepSize: the cartesian distance to move between each point
			 *   tx, ty, sx, sy: temporary X and Y cartesian coordinate variables
			 *   red, green, blue: RGB values for pixel color determination
			 ***/
			 
			let msg = e.data;
			let a = msg.a;
			let b = msg.b;
			let x = msg.x;
			let cy = msg.y;
			let pxSize = msg.pxSize;
			let pySize = msg.pySize;
			let stepSize = msg.stepSize;
			let iterationLimit = msg.iterationLimit;
			let iterations = 0;
			let mandelbrot = msg.mandelbrot;
			let tx = 0;
			let ty = 0;
			let sx = 0;
			let sy = 0;
			let red = msg.red;
			let green = msg.green;
			let blue = msg.blue;
			
			// Allocate memory for an array of unsigned 8-bit integer values with four values (R,G,B,A) per pixel
			msg.imgData = new Uint8ClampedArray(pxSize * pySize * 4);
			
			// Initial offsets of individual color positions in data array
			let rPos = 0;
			let gPos = 1;
			let bPos = 2;
			let aPos = 3;
			
			// Local scope py for this block - not to be confused with the py sent in the work message!
			let py = 0;
			
			let cx = x;
			while (py < pySize) {
				for (let px = 0; px < pxSize; px++) {
					iterations = 0;
					tx = cx;
					ty = cy;
					
					if (mandelbrot) {
						a = cx;
						b = cy;
					}
					
					for (var i = 0; i < iterationLimit; i++) {
						sx = tx;
						sy = ty;
						tx = (sx * sx) - (sy * sy) + a;
						ty = (2 * sx * sy) + b;
						if (((tx * tx) + (ty * ty)) > 4) {
							iterations = i;
							break;
						}
					}
					if (iterations == iterationLimit) {
						color = 0;
					}
					else {
						color = 255 * ((iterations * 4) / iterationLimit);
					}
					
					// Copy pixel color data to image data array
					msg.imgData[rPos] = red * (color / 255);	//color;
					msg.imgData[gPos] = green * (color / 255);	//color / 2;
					msg.imgData[bPos] = blue * (color / 255);	//0;
					msg.imgData[aPos] = 255;
					
					// Move X point position one pixel-sized step right:
					cx += stepSize;
					
					// Advance color data offsets to the next pixel
					rPos += 4;
					gPos += 4;
					bPos += 4;
					aPos += 4;
				}
				
				// Reset X point position to leftmost edge:
				cx = msg.x;
				
				// Move Y point position one pixel-sized step down, and move to the next row of pixels:
				cy -= stepSize;
				py++;
			}
			
			postMessage(msg);
		};
	}
};
