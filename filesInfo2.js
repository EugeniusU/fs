
let pathStr = document.querySelector('#path');
let find = document.querySelector('#find');
let table = document.querySelector('table');

let url = 'http://127.0.0.1:8000';

let result = [];

let states = {};

find.addEventListener('click', event => {
	
	let value = pathStr.value;
	value = value.trim();
	
	let obj = {path: value};
	
	if (value.length != 0) {
		let json = JSON.stringify(obj);
		post(json);
	}
	
});

function post(data) {
	
	let xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			console.log(xhr.responseText);
			
			let obj = {};
			
			try {
				obj = JSON.parse(xhr.responseText);
			} catch (e) {
				console.log(e);
			}
			result = obj;
			console.log(obj);
			removeTable(table);
			buildTable(obj, table);
			
			let name = table.querySelector('#name');
			let size = table.querySelector('#size');
			
		}
	};
	
	xhr.open('POST', url, true);
	xhr.send(data);
	
}

function buildTable(array, table) {
	array.forEach((obj, index) => {
		let keys = Object.keys(obj);
		
		if (index == 0) {
			let tr2 = elt('tr');
			
			keys.forEach(k => {				
				let th = elt('th', k);
				th.textContent = k;
				tr2.appendChild(th);

				applyEvent(th, (event) => {
					let name = event.target.id;
					
					if (states[name] == 'min') {
						states[name] = 'max';
					} else {
						states[name] = 'min';
					}
					
					let sorted = sort2(result, name, states[name]);
					removeTable(table);
					buildTable(sorted, table);
				});
				
			});
			
			table.appendChild(tr2);
		}
		
		let tr = elt('tr');
		
		keys.forEach((k, index) => {
			let v = obj[k];
			
			let td = elt('td');
			td.textContent = v;
			
			tr.appendChild(td);
		});
		
		table.appendChild(tr);
		
	});
	
	let tr3 = elt('tr', 'all');
	
	let n = elt('td');
	let v = elt('td');
	
	n.textContent = 'Total';
	v.textContent = array.length;
	
	tr3.appendChild(n);
	tr3.appendChild(v);
	
	table.appendChild(tr3);
	
}

function elt(el, id) {
	let e = document.createElement(el);
	
	if (id) {
		e.id = id;
	}
	return e;
}

function removeTable(table) {
	let nodes = table.childNodes;
	
	for (let i = nodes.length - 1; i >= 0; i--) {
		table.removeChild(nodes[i]);
	}
	
}

function applyEvent(node, fn) {
	node.addEventListener('click', fn);
}

function sort2(array, key, type) {

	let keys = Object.keys(array[0]);
	let keys2 = Object.keys(array[0]);

	let sorted = array.sort((obj1, obj2) => {
		let a = obj1[key];
		let b = obj2[key];
		
		if (type == 'min') {
			if (typeof a == 'string' && typeof b == 'string') {
				return a.charCodeAt(0) - b.charCodeAt(0);
			} else {
				return a - b;
			}
		} else if (type == 'max') {
			if (typeof a == 'string' && typeof b == 'string') {
				return b.charCodeAt(0) - a.charCodeAt(0);
			} else {
				return b - a;
			}
		}
	});
	
	console.log(sorted);
	return sorted;
}

