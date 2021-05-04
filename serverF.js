
const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
	if (req) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type', 'application/json;charset=utf8');
		console.log(req.method);
		
		let file = '';
		
		req.on('data', data => {
			file += data;
		});
		
		req.on('end', () => {
			let obj = {};
			
			try {
				obj = JSON.parse(file);
			} catch (e) {
				console.log(e);
			}
			
			console.log(obj);

			readFilesNames2(obj.path).then(array => {
				info3(array, obj.path).then(data => {
					let json = JSON.stringify(data);
					res.end(json);
				});
			});
		});
		
	}
});

server.listen(8000);

function readFilesNames2(path, fn) {	
	return new Promise(resolve => {
		fs.readdir(path, 'utf8', (err, data) => {
			if (err) {
				throw err;
			}
			console.log('q', data.length);
			resolve(data);
		});
	});
}

function info3(array, path) {
	let arrayOfObj = [];
	
	return new Promise(resolve => {
		(async function() {
			for (const el of array) {
				const data = await fs.promises.lstat(path + '/' + el);

				let obj = {name: el, size: data['size']};
				arrayOfObj.push(obj);		
			}
			resolve(arrayOfObj);
		})();
	});
}
