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
