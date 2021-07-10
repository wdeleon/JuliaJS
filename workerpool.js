/*
	workerpool.js - WorkerPool class for managing web workers
	 
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

class WorkerPool {
	constructor (worker_fn, callback_fn, options = {}) {
		this.workerFn = URL.createObjectURL(new Blob(["("+worker_fn.toString()+")()"], {type: 'text/javascript'}));
		this.callbackFn = callback_fn;
		
		this.pool = new Array();
		this.nextWorkerID = 0;
		this.msgQueue = new Array();
		
		// By default, queued messages get processed FIFO (first in, first out)
		// Setting this to false uses LIFO (last in, first out) instead
		if (options.msgFIFO != undefined) {
			this.msgFIFO = options.msgFIFO;
		}
		else {
			this.msgFIFO = true;
		}
		
		// By default, the maximum number of worker threads is the number of available hardware threads
		if (options.max_workers != undefined) {
			this.maxWorkers = options.max_workers;
		}
		else {
			this.maxWorkers = window.navigator.hardwareConcurrency;
		}
		
		// Minimum number of workers to create. Zero by default.
		if (options.min_workers != undefined) {
			this.minWorkers = options.min_workers;
			this.createWorker(this.minWorkers);
		}
		else {
			this.minWorkers = 0;
		}
	}
	
	createWorker (n = 1) {
		for (let i = 0; i < n; i++) {
			if (this.pool.length < this.maxWorkers) {
				this.pool.push({
					worker: new Worker(this.workerFn),
					isBusy: false,
				});
				let slot = this.pool.length - 1;
				this.pool[slot].worker.addEventListener('message', (msg) => {this.returnProduct(slot, msg)});
			}
			else {
				break;
			}
		}
	}
	
	dispatchWorkUnit (msg) {
		let available = -1;
		
		// Search for the first worker not marked as busy
		for (let i = 0; i < this.pool.length; i++) {
			if (this.pool[i].isBusy == false) {
				available = i;
				break;
			}
		}
		
		// Free worker found: mark this worker as busy and post the work message to it
		if (available >= 0) {			
			this.pool[available].isBusy = true;
			this.pool[available].worker.postMessage(msg);
		}
		
		// No free workers:
		else { 
			if (this.pool.length < this.maxWorkers) {
				// No free workers, but a free slot exists: create a new worker and dispatch the request
				this.createWorker();
				this.dispatchWorkUnit(msg);
			}
			else {
				// No free workers or slots: queue the message for later dispatch
				this.msgQueue.push(msg);
			}
		}
	}
	
	returnProduct (slot, msg) {
		// Mark this worker as free and run the callback function
		this.pool[slot].isBusy = false;
		this.callbackFn(msg);
		
		// If there are queued work messages, pull one off the queue and dispatch it
		if (this.msgQueue.length > 0) {
			let nextMsg = '';
			if (this.msgFIFO) {
				nextMsg = this.msgQueue.shift();
			}
			else {
				nextMsg = this.msgQueue.pop();
			}
			this.dispatchWorkUnit(nextMsg);
		}
	}
}
