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
			DOM.res800Button.addEventListener('click', (evt) => {Controls.buttons.resButton.click(evt, 4, 3, 800);});
			DOM.res1024Button.addEventListener('click', (evt) => {Controls.buttons.resButton.click(evt, 4, 3, 1024);});
			DOM.res720HdButton.addEventListener('click', (evt) => {Controls.buttons.resButton.click(evt, 16, 9, 1280);});
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
			
			// Save button:
			DOM.saveButton.addEventListener('click', Controls.buttons.saveButton.click);
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
		
		saveButton: {
			click: function (evt) {
				evt.preventDefault();
				let temp_link = document.createElement('a');
				temp_link.setAttribute('download', 'image.png');
				temp_link.setAttribute('href', DOM.mainCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
				temp_link.click();
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
			// Blank field:
			if (this.value == '') {
				return 0;
			}
			
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

var Colors = {
	red: 255,
	green: 128,
	blue: 0,
	
	// Calculated fields, determined at runtime
	hue: 0,
	saturation: 0,
	luminosity: 0,
	
	initialize: function () {
		// Slider listeners:
		DOM.redSlider.addEventListener('input', Colors.sliders.red.change);
		DOM.greenSlider.addEventListener('input', Colors.sliders.green.change);
		DOM.blueSlider.addEventListener('input', Colors.sliders.blue.change);
		DOM.hueSlider.addEventListener('input', Colors.sliders.hue.change);
		DOM.saturationSlider.addEventListener('input', Colors.sliders.saturation.change);
		DOM.luminositySlider.addEventListener('input', Colors.sliders.luminosity.change);
		
		// Text input listeners:
		DOM.red.addEventListener('input', Colors.textInputs.red.change);
		DOM.green.addEventListener('input', Colors.textInputs.green.change);
		DOM.blue.addEventListener('input', Colors.textInputs.blue.change);
		DOM.hue.addEventListener('input', Colors.textInputs.hue.change);
		DOM.saturation.addEventListener('input', Colors.textInputs.saturation.change);
		DOM.luminosity.addEventListener('input', Colors.textInputs.luminosity.change);
		
		// Quick color pick listeners:
		DOM.whiteQuickClick.addEventListener('click', () => {Colors.changeTo(255, 255, 255);});
		DOM.redQuickClick.addEventListener('click', () => {Colors.changeTo(255, 0, 0);});
		DOM.orangeQuickClick.addEventListener('click', () => {Colors.changeTo(255, 128, 0);});
		DOM.yellowQuickClick.addEventListener('click', () => {Colors.changeTo(255, 255, 0);});
		DOM.greenQuickClick.addEventListener('click', () => {Colors.changeTo(0, 255, 0);});
		DOM.cyanQuickClick.addEventListener('click', () => {Colors.changeTo(0, 255, 255);});
		DOM.blueQuickClick.addEventListener('click', () => {Colors.changeTo(0, 0, 255);});
		DOM.purpleQuickClick.addEventListener('click', () => {Colors.changeTo(128, 0, 255);});
        DOM.fuchsiaQuickClick.addEventListener('click', () => {Colors.changeTo(255, 0, 255);});
		
		// Set color to starting default:
		Colors.changeTo(JuliaSet.defaults.red, JuliaSet.defaults.green, JuliaSet.defaults.blue);
		Colors.updatePreview();
	},
	
	changeTo: function (red, green, blue) {
		Colors.red = red;
		Colors.green = green;
		Colors.blue = blue;
		
		Colors.updateHSL();
		Colors.refreshRGB();
	},

	calculateHSL: function () {
		let result = {
			hue: 0,
			saturation: 0,
			luminosity: 0,
		};
		
		let red_prime = Colors.red / 255;
		let green_prime = Colors.green / 255;
		let blue_prime = Colors.blue / 255;
		
		let c_max = Math.max(red_prime, green_prime, blue_prime);
		let c_min = Math.min(red_prime, green_prime, blue_prime);
		
		// Luma = (Cmax + Cmin) / 2
		let l = (c_max + c_min) / 2
		
		// H depends on which color is Cmax
		let h = 0;
		let delta = c_max - c_min;
		if (delta == 0) {
			h = 0;
		}
		else if ((red_prime >= green_prime) && (red_prime >= blue_prime)) {
			// The modulo operator (%) in JavaScript has behavior that can cause it to return a negative number.
			// The workaround is rewriting expressions into the form: ((n % m) + m) % m
			h = 60 * (((((green_prime - blue_prime) / delta) % 6) + 6) % 6);
		}
		else if (green_prime >= blue_prime) {
			h = 60 * (((blue_prime - red_prime) / delta) + 2);
		}
		else {
			h = 60 * (((red_prime - green_prime) / delta) + 4);
		}
		
		// S = 0 if delta = 0; otherwise S = delta / (1 - |((2 * L) - 1)|)
		let s = 0;
		if (delta == 0) {
			s = 0;
		}
		else {
			s = delta / (1 - Math.abs((2 * l) - 1));
		}
		
		result.hue = Math.min(359, Math.round(h));
		result.saturation = Math.min(100, Math.round(s * 100));
		result.luminosity = Math.min(100, Math.round(l * 100));
		
		return result;
	},
	
	calculateRGB: function () {
		let result = {
			red: 0,
			green: 0,
			blue: 0,
		};
		
		let h = Colors.hue;
		let s = Colors.saturation / 100;
		let l = Colors.luminosity / 100;
		
		let c = (1 - Math.abs((2 * l) - 1)) * s;
		let x = c * (1 - Math.abs((((h / 60) + 2) % 2) - 1));
		let m = l - (c / 2);
		
		let red_prime = 0;
		let green_prime = 0;
		let blue_prime = 0;
		
		if (h < 60) {
			red_prime = c;
			green_prime = x;
			blue_prime = 0;
		}
		else if (h < 120) {
			red_prime = x;
			green_prime = c;
			blue_prime = 0;
		}
		else if (h < 180) {
			red_prime = 0;
			green_prime = c;
			blue_prime = x;
		}
		else if (h < 240) {
			red_prime = 0;
			green_prime = x;
			blue_prime = c;
		}
		else if (h < 300) {
			red_prime = x;
			green_prime = 0;
			blue_prime = c;
		}
		else {
			red_prime = c;
			green_prime = 0;
			blue_prime = x;
		}
		
		result.red = Math.round((red_prime + m) * 255);
		result.green = Math.round((green_prime + m) * 255);
		result.blue = Math.round((blue_prime + m) * 255);
		
		return result;
	},
	
	updateRGB: function () {
		let rgb = Colors.calculateRGB();
		Colors.red = rgb.red;
		Colors.green = rgb.green;
		Colors.blue = rgb.blue;
		
		Colors.refreshRGB();
		Colors.updatePreview();
	},
	
	refreshRGB: function () {
		DOM.redSlider.value = Colors.red;
		DOM.greenSlider.value = Colors.green;
		DOM.blueSlider.value = Colors.blue;
		
		DOM.red.value = Colors.red;
		DOM.green.value = Colors.green;
		DOM.blue.value = Colors.blue;
	},
	
	updateHSL: function () {
		let hsl = Colors.calculateHSL();
		Colors.hue = hsl.hue;
		Colors.saturation = hsl.saturation;
		Colors.luminosity = hsl.luminosity;
		
		Colors.refreshHSL();
		Colors.updatePreview();
	},
	
	refreshHSL: function () {
		DOM.hueSlider.value = Colors.hue;
		DOM.saturationSlider.value = Colors.saturation;
		DOM.luminositySlider.value = Colors.luminosity;
		
		DOM.hue.value = Colors.hue;
		DOM.saturation.value = Colors.saturation;
		DOM.luminosity.value = Colors.luminosity;
	},
	
	updatePreview: function () {
		let color_string = "rgb(" + Colors.red + "," + Colors.green + "," + Colors.blue + ")";
		DOM.colorPreview.style.backgroundColor = color_string;
	},

	sliders: {
		// generic 'change' function for any color control slider - just fill in the paramters:
		change: function (slider, color, input, update_fn) {
			Colors[color] = Controls.inputs.toNumber.call(slider, flags.INT | flags.ABS);
			input.value = Colors[color];
			update_fn();
			Colors.updatePreview();
		},
		
		// Specific slider changers:
		red: {change: function () {Colors.sliders.change(DOM.redSlider, 'red', DOM.red, Colors.updateHSL);},},
		green: {change: function () {Colors.sliders.change(DOM.greenSlider, 'green', DOM.green, Colors.updateHSL);},},
		blue: {change: function () {Colors.sliders.change(DOM.blueSlider, 'blue', DOM.blue, Colors.updateHSL);},},
		hue: {change: function () {Colors.sliders.change(DOM.hueSlider, 'hue', DOM.hue, Colors.updateRGB);},},
		saturation: {change: function () {Colors.sliders.change(DOM.saturationSlider, 'saturation', DOM.saturation, Colors.updateRGB);},},
		luminosity: {change: function () {Colors.sliders.change(DOM.luminositySlider, 'luminosity', DOM.luminosity, Colors.updateRGB);},},
	},
	
	textInputs: {
		// generic 'change' function for any color control text input field - just fill in the paramters:
		change: function (input, input_max, color, slider, update_fn) {
			let n = Controls.inputs.toNumber.call(input, flags.INT | flags.ABS);
			if (n > input_max) {
				Controls.inputs.setValue.call(input, input_max);
			}
			n = Math.min(input_max, n);
			Colors[color] = n;
			slider.value = Colors[color];
			update_fn();
			Colors.updatePreview();
		},
		
		// Specific input changers:
		red: {change: function () {Colors.textInputs.change(DOM.red, 255, 'red', DOM.redSlider, Colors.updateHSL);},},
		green: {change: function () {Colors.textInputs.change(DOM.green, 255, 'green', DOM.greenSlider, Colors.updateHSL);},},
		blue: {change: function () {Colors.textInputs.change(DOM.blue, 255, 'blue', DOM.blueSlider, Colors.updateHSL);},},
		hue: {change: function () {Colors.textInputs.change(DOM.hue, 359, 'hue', DOM.hueSlider, Colors.updateRGB);},},
		saturation: {change: function () {Colors.textInputs.change(DOM.saturation, 100, 'saturation', DOM.saturationSlider, Colors.updateRGB);},},
		luminosity: {change: function () {Colors.textInputs.change(DOM.luminosity, 100, 'luminosity', DOM.luminositySlider, Colors.updateRGB);},},
	},
};

var RenderHistory = {
	hist: false,
	
	add: function () {
		RenderHistory.hist.add(JuliaSet.settings);
		RenderHistory.updateButtons();
	},
	
	rewind: function () {
		RenderHistory.hist.rewind(1);
		RenderHistory.processStateMovement();
	},
	
	advance: function () {
		RenderHistory.hist.advance(1);
		RenderHistory.processStateMovement();
	},
	
	processStateMovement: function () {
		JuliaSet.loadSettings(RenderHistory.hist.current);
		JuliaSet.render();
	},
	
	initialize: function () {
		RenderHistory.hist = new History();
		
		// Attach event listeners to fire when these buttons are clicked:
		DOM.backButton.addEventListener('click', (evt) => {RenderHistory.buttons.back.click(evt);});
		DOM.forwardButton.addEventListener('click', (evt) => {RenderHistory.buttons.forward.click(evt);});

		RenderHistory.updateButtons();
	},
	
	disableButtons: function () {
		DOM.backButton.disabled = true;
		DOM.forwardButton.disabled = true;
	},
	
	updateButtons: function () {
		// Back button:
		if (RenderHistory.hist.pastLength > 0) {
			DOM.backButton.disabled = false;
		}
		else {
			DOM.backButton.disabled = true;
		}
		
		// Forward button:
		if (RenderHistory.hist.futureLength > 0) {
			DOM.forwardButton.disabled = false;
		}
		else {
			DOM.forwardButton.disabled = true;
		}
	},
	
	buttons: {
		back: {
			click: function (evt) {
				evt.preventDefault();
				RenderHistory.rewind();
			},
		},
		
		forward: {
			click: function (evt) {
				evt.preventDefault();
				RenderHistory.advance();
			},
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
