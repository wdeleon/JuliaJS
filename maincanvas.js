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

var SelectionOverlay = {
	startX: -1,
	startY: -1,
	stopX: -1,
	stopY: -1,
		
	initialize: function () {
		DOM.selectionOverlay.addEventListener('mousedown', SelectionOverlay.start);
	},
	
	start: function (evt) {
		SelectionOverlay.startX = evt.offsetX;
		SelectionOverlay.startY = evt.offsetY;
		
		DOM.selectionBox.style.visibility = 'visible';
		DOM.selectionBox.style.left = evt.offsetX + 'px';
		DOM.selectionBox.style.top = evt.offsetY + 'px';
		
		DOM.selectionOverlay.addEventListener('mousemove', SelectionOverlay.move);
		DOM.selectionOverlay.addEventListener('mouseup', SelectionOverlay.stop);
	},
	
	move: function (evt) {
		let rect = DOM.selectionOverlay.getBoundingClientRect();
		DOM.selectionBox.style.width = evt.clientX - (SelectionOverlay.startX + rect.left) + 'px';
		DOM.selectionBox.style.height = evt.clientY - (SelectionOverlay.startY + rect.top) + 'px';
	},
	
	stop: function (evt) {
		SelectionOverlay.stopX = evt.offsetX;
		SelectionOverlay.stopY = evt.offsetY;
		
		DOM.selectionOverlay.removeEventListener('mousemove', SelectionOverlay.move);
		DOM.selectionOverlay.removeEventListener('mouseup', SelectionOverlay.stop);
		DOM.selectionBox.style.visibility = 'hidden';
		
		// What is needed to find the new size:
		//   X center
		//   Y center
		//   X width
		// All other parameters: reload from the last committed rendering settings (TODO)
		
		if (SelectionOverlay.startX != SelectionOverlay.stopX && JuliaSet.settings.previousCommit) {
			let px1 = SelectionOverlay.startX;
			let px2 = SelectionOverlay.stopX;
			let py1 = SelectionOverlay.startY;
			let py2 = SelectionOverlay.stopY;
			
			let x1 = JuliaSet.settings.xMin + (px1 * JuliaSet.settings.stepSize);
			let x2 = JuliaSet.settings.xMin + (px2 * JuliaSet.settings.stepSize);
			let centerX = (x1 + x2) / 2;
			let xWidth = Math.abs(x2 - x1);
			
			let y1 = JuliaSet.settings.yMax - (py1 * JuliaSet.settings.stepSize);
			let y2 = JuliaSet.settings.yMax - (py2 * JuliaSet.settings.stepSize);
			let centerY = (y1 + y2) / 2;
			
			Controls.inputs.setValue.call(DOM.cxCenter, centerX);
			Controls.inputs.setValue.call(DOM.cyCenter, centerY);
			Controls.inputs.setValue.call(DOM.cxWidth, xWidth);
			
			DOM.renderButton.click();
		}
	},
};

var MainCanvas = {
	xSize: 2560,	// Default for 2k resolution
	ySize: 0,		// Calculated value, will be determined at run-time when the canvas is resized
	
	initialize: function () {
		SelectionOverlay.initialize();
		DOM.mainCanvasCtx = DOM.mainCanvas.getContext('2d');
	},
	
	resize: function () {
		// Read X and Y dimensions from input boxes
		MainCanvas.xSize = Controls.inputs.toNumber.call(DOM.pX, flags.INT, flags.ABS);	
		MainCanvas.ySize = Controls.inputs.toNumber.call(DOM.pY, flags.INT, flags.ABS);
		
		// Resize canvas in HTML page by setting CSS values
		DOM.mainCanvas.style.width = MainCanvas.xSize + 'px';
		DOM.mainCanvas.style.height = MainCanvas.ySize + 'px';
		
		// Resize selection overlay layer to match the canvas
		DOM.selectionOverlay.style.width = DOM.mainCanvas.style.width;
		DOM.selectionOverlay.style.height = DOM.mainCanvas.style.height;
		
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
	},
};
