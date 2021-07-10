/*
	dom.js - Document Object Model functionality container
	 
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

// NOTE: When using this code, the id attribute of 'initialize' should be treated as reserved, and not used in the HTML document.
let DOM = {	
	initialize: function () {
		// Get a list of all the elements in the page:
		let element_list = document.getElementsByTagName('*');
		
		// Get a handle for every element with the id attribute set:
		for (let elem of element_list) {
			let id = elem.id;
			if (id != '') {
				DOM[id] = elem;
			}
		}
	}
};
