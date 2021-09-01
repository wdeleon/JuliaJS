/*
	history.js - History class
	 
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

class History {
	#past = [];
	#future = [];
	#now = undefined;
	
	add (state) {
		if (this.#now !== undefined) {
			this.#past.push(this.#now);
		}
		this.#now = JSON.stringify(state);
		this.#future = [];
	}
	
	rewind (n = 1) {
		if (this.#past.length >= n) {
			for (let i = 0; i < n; i++) {
				this.#future.unshift(this.#now);
				this.#now = this.#past.pop();
			}
			return true;
		}
		else {
			return false;
		}
	}
	
	advance (n = 1) {
		if (this.#future.length >= n) {
			for (let i = 0; i < n; i++) {
				this.#past.push(this.#now);
				this.#now = this.#future.shift();
			}
			return true;
		}
		else {
			return false;
		}
	}
	
	get current () {
		return (this.#now !== undefined) ? JSON.parse(this.#now) : false;
	}
	
	get pastLength () {
		return this.#past.length;
	}
	
	get futureLength () {
		return this.#future.length;
	}
}



var RenderHistory = {
	hist: new History(),
	
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
		JuliaSet.loadSettings(RenderHistory.hist.current); // TODO
		JuliaSet.render();
		RenderHistory.updateButtons();
	},
	
	initialize: function () {
		// Attach event listeners to fire when these buttons are clicked:
		DOM.backButton.addEventListener('click', (evt) => {RenderHistory.buttons.back.click(evt);});
		DOM.forwardButton.addEventListener('click', (evt) => {RenderHistory.buttons.forward.click(evt);});

		RenderHistory.updateButtons();
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
