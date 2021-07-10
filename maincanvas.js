/*
	maincanvas.js - HTML5 canvas functionality container
	 
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

var MainCanvas = {
	xSize: 2560,	// Default for 2k resolution
	ySize: 0,		// Calculated value, will be determined at run-time when the canvas is resized
	
	initialize: function () {
		DOM.mainCanvasCtx = DOM.mainCanvas.getContext('2d');
	},
	
	resize: function () {
		// Read X and Y dimensions from input boxes
		MainCanvas.xSize = Controls.inputs.toNumber.call(DOM.pX, flags.INT, flags.ABS);	
		MainCanvas.ySize = Controls.inputs.toNumber.call(DOM.pY, flags.INT, flags.ABS);
		
		// Resize canvas in HTML page by setting CSS values
		DOM.mainCanvas.style.width = MainCanvas.xSize + 'px';
		DOM.mainCanvas.style.height = MainCanvas.ySize + 'px';
		
		// Reset 1:1 logical:physical pixel scaling on the canvas
		// Need to do this because this ratio is changed by resizing the canvas CSS values
		DOM.mainCanvas.width = MainCanvas.xSize;
		DOM.mainCanvas.height = MainCanvas.ySize;
		
		MainCanvas.clear();
	},
	
	paint: function (block) {
		let imgData = new ImageData(block.data.imgData, block.data.pxSize);
		DOM.mainCanvasCtx.putImageData(imgData, 0, block.data.py);
	},
	
	clear: function () {
		// Fastest, easiest way to clear the whole canvas: paints a transparent black rectangle over everything
		DOM.mainCanvasCtx.clearRect(0, 0, MainCanvas.xSize, MainCanvas.ySize);
	}
};
