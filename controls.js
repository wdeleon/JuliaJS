/*
	controls.js - GUI controls functionality container
	 
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

const flags = {
	INT: 0b01,
	ABS: 0b10,
};

var Banner = {
	hide: function () {
		DOM.launchBanner.style.visibility = "hidden";
	}
};

var Controls = {
	currentlyVisible: false,	// Hide controls by default
	
	initialize: function () {
		Controls.inputs.initialize();
		Controls.buttons.initialize();
		Controls.updateVisibility();
	},
	
	updateVisibility: function () {
		if (Controls.currentlyVisible) {
			DOM.control_container.style.visibility = "visible";
		}
		else {
			DOM.control_container.style.visibility = "hidden";
		}
	},
	
	events: {
		hide: function () {
			Controls.currentlyVisible = false;
			Controls.updateVisibility();
		},
		
		show: function () {
			Controls.currentlyVisible = true;
			Controls.updateVisibility();
		},
		
		toggleVisibility: function () {
			Controls.currentlyVisible = !Controls.currentlyVisible;
			Controls.updateVisibility();
		},
	},
	
	buttons: {
		initialize: function () {
			// Miscellaneous control buttons:
			DOM.renderButton.addEventListener('click', Controls.buttons.render.click);
			DOM.closeButton.addEventListener('click', Controls.buttons.close.click);
			DOM.autoPyButton.addEventListener('click', Controls.buttons.autoPy.click);
			
			// Resolution buttons:
			DOM.res640Button.addEventListener('click', (evt) => {Controls.buttons.resButton.click(evt, 4, 3, 640);});
			DOM.resHdButton.addEventListener('click', (evt) => {Controls.buttons.resButton.click(evt, 16, 9, 1920);});
			DOM.res2kButton.addEventListener('click', (evt) => {Controls.buttons.resButton.click(evt, 16, 9, 2560);});
			DOM.res4kButton.addEventListener('click', (evt) => {Controls.buttons.resButton.click(evt, 16, 9, 3840);});
			DOM.res8kButton.addEventListener('click', (evt) => {Controls.buttons.resButton.click(evt, 16, 9, 7680);});
			
			// Aspect ratio buttons:
			DOM.aspect11Button.addEventListener('click', (evt) => {Controls.buttons.aspectButton.click(evt, 1, 1);});
			DOM.aspect43Button.addEventListener('click', (evt) => {Controls.buttons.aspectButton.click(evt, 4, 3);});
			DOM.aspect1610Button.addEventListener('click', (evt) => {Controls.buttons.aspectButton.click(evt, 16, 10);});
			DOM.aspect169Button.addEventListener('click', (evt) => {Controls.buttons.aspectButton.click(evt, 16, 9);});

			// C-value buttons:
			DOM.c0Button.addEventListener('click', (evt) => {Controls.buttons.cButton.click(evt, -1.4, 0);});
			DOM.c1Button.addEventListener('click', (evt) => {Controls.buttons.cButton.click(evt, 0.377, 0.28);});
			DOM.c2Button.addEventListener('click', (evt) => {Controls.buttons.cButton.click(evt, -0.79, 0.15);});
			DOM.c3Button.addEventListener('click', (evt) => {Controls.buttons.cButton.click(evt, 0.28, -0.01);});
			
			DOM.c4Button.addEventListener('click', (evt) => {Controls.buttons.cButton.click(evt, -0.162, 1.035);});
			DOM.c5Button.addEventListener('click', (evt) => {Controls.buttons.cButton.click(evt, -0.7269, 0.1889);});
			DOM.c6Button.addEventListener('click', (evt) => {Controls.buttons.cButton.click(evt, 0.45, 0.1428);});
			DOM.c7Button.addEventListener('click', (evt) => {Controls.buttons.cButton.click(evt, 0, -0.8);});
		},
		
		render: {
			click: function (evt) {
				// Prevent default action of reloading the page:
				evt.preventDefault();
				
				// Hide controls and start rendering when this button is clicked:
				Controls.events.hide();
				JuliaSet.commitSettings();
				JuliaSet.render();
			},
		},
		
		close: {
			click: function (evt) {
				evt.preventDefault();
				Controls.events.hide();
			},
		},
		
		autoPy: {
			click: function (evt) {
				evt.preventDefault();
				Controls.buttons.autoPy.process();
			},
			
			process: function () {
				// Set input field values:
				let ax = Controls.inputs.toNumber.call(DOM.aspectX, flags.ABS);
				let ay = Controls.inputs.toNumber.call(DOM.aspectY, flags.ABS);
				let px = Controls.inputs.toNumber.call(DOM.pX, flags.INT | flags.ABS);
				
				// Calculate new pixel-Y size value:
				// Doesn't use setValue() so that things like 'Infinity' don't get set as the last good value
				DOM.pY.value = Math.floor(px / (ax / ay));
			},
		},
		
		resButton: {
			click: function (evt, ax, ay, px) {
				evt.preventDefault();
				Controls.inputs.setValue.call(DOM.aspectX, ax, flags.ABS);
				Controls.inputs.setValue.call(DOM.aspectY, ay, flags.ABS);
				Controls.inputs.setValue.call(DOM.pX, px, flags.INT | flags.ABS);
				Controls.buttons.autoPy.process();
			},
		},
		
		aspectButton: {
			click: function (evt, ax, ay) {
				evt.preventDefault();
				Controls.inputs.setValue.call(DOM.aspectX, ax, flags.ABS);
				Controls.inputs.setValue.call(DOM.aspectY, ay, flags.ABS);
				Controls.buttons.autoPy.process();
			},
		},
		
		cButton: {
			click: function (evt, a, b) {
				evt.preventDefault();
				Controls.inputs.setValue.call(DOM.a, a);
				Controls.inputs.setValue.call(DOM.b, b);
				Controls.buttons.autoPy.process();
			},
		},
	},
	
	inputs: {
		initialize: function () {
			// Set all input fields to default values
			DOM.juliaRadio.checked = true;
			DOM.mandelbrotRadio.checked == false;
			
			Controls.inputs.setValue.call(DOM.cxCenter, JuliaSet.defaults.xCenter);
			Controls.inputs.setValue.call(DOM.cxWidth, JuliaSet.defaults.xWidth, flags.ABS);
			Controls.inputs.setValue.call(DOM.cyCenter, JuliaSet.defaults.yCenter);
			Controls.inputs.setValue.call(DOM.a, JuliaSet.defaults.a);
			Controls.inputs.setValue.call(DOM.b, JuliaSet.defaults.b);
			
			Controls.inputs.setValue.call(DOM.aspectX, 1, flags.ABS);
			Controls.inputs.setValue.call(DOM.aspectY, 1, flags.ABS);
			Controls.inputs.setValue.call(DOM.pX, MainCanvas.xSize, flags.INT | flags.ABS);
			Controls.buttons.autoPy.process();
		},
		
		toNumber: function (type = 0b00) {
			let n = Number.parseFloat(this.value);
			
			// Valid number:
			if (Number.isFinite(n)) {
				if (type & flags.ABS) {
					n = Math.abs(n);
				}
				if (type & flags.INT) {
					n = Math.round(n);
				}
				Controls.inputs.setValue.call(this, n, type);
			}
			
			// Not a valid number, roll back to last valid value:
			else {
				n = this.lastValue;	//Monkey-patched property that DOM objects don't usually have
				this.value = n;
			}
			
			return n;
		},
		
		setValue: function (n, type = 0b00) {
			// NOTICE: because setValue is invoked with a reference to a DOM object as its context, 'this' will be a DOM object.
			// Monkey-patching a property onto an object in the DOM (or generally any object you don't own) is
			// usually bad practice. I'm doing it anyway in this instance for convenience and expediency.
			
			this.lastValue = n;	//Monkey-patched property that DOM objects don't usually have
			this.value = n;
		},
	},
};

var Keys = {
	bindings: {},
	
	initialize: function () {
		// Associative array-like object binding keycode values to what function they should call:
		Keys.bindings['Escape'] = Controls.events.toggleVisibility;
		Keys.bindings['C'] = Controls.events.toggleVisibility;
		Keys.bindings['c'] = Controls.events.toggleVisibility;
		
		// Add event listener to listen for key presses:
		window.addEventListener('keydown', Keys.keyPress);
	},
	
	keyPress: function (evt) {
		// Don't continually fire for a key just being held down. It's annoying and can cause rapid flashing.
		// This is a potential safety issue for photosensitive users.
		if (evt.repeat) {
			return;
		}
		
		// Only try to execute keycode indices that are actually bound to functions, otherwise this causes errors
		let keycode = evt.key;
		if (typeof Keys.bindings[keycode] == "function") {
			Keys.bindings[keycode]();
		}
	},
};
