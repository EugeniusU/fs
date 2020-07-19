var fs = require('fs');
var methods = Object.create(null);

methods.ReadFile = function(file, logout, statF) {
//	if (!logout && statF) {
//		console.log(
	fs.readFile(file, 'utf-8', function(error, text) {
		if (error) {
			throw error;
		}
		if (logout) {
			logout(text);
		} else if (!logout) {
			console.log(2);
			return text;
		}
	});
	if (statF) {
		fs.stat(file, function(error, stats) {
		if (error) {
			throw error;
		}

		var fileStat = {"size": stats.size / 1024 + ' KB', "date": stats.birthtime};
		var sizeRound = fileStat.size;
		sizeRound = sizeRound.slice(0, sizeRound.length - 3);
		sizeRound = Math.round(Number(sizeRound) * 1000) / 1000;

		fileStat.size = sizeRound + ' KB';
		fileStat = JSON.stringify(fileStat);

		if (logout) {
			logout(JSON.parse(fileStat));
		} else {
			console.log(JSON.parse(fileStat));
		}
		});
	}
};


methods.TypeFile = function(type) {
	if (typeof type == 'string') {
		var chars = [];
		var alth = 'abcdefghigklmnopqrstuvwxyz';
		chars = alth.split('');
		return chars;
	} else if (typeof type == 'number') {
		var numbers = [];
		for (var i = 0; i < 10; i++) {
			numbers.push(i);
		}
		return numbers;
	}
};


methods.CreateFile = function(size, type) {
	var array = [];
	var m = methods.TypeFile(type);
	
	for (var i = 0; i < size * (2 ** 10); i++) {
		var random = Math.floor(Math.random() * m.length);
		array.push(m[random]);
	}
	return array;
};


methods.WriteFile = function(name, size, type) {
	var fileData = methods.CreateFile(size, type);
	fileData = fileData.join('');
	
	fs.writeFile(name, fileData, function(error) {
		if (error) {
			console.log('Something was wrong:', error);
		} else {
			console.log('Done');
		}
	});
	
};


methods.ChangeFile = function(file, ch, newFile) {
/*	var pre = methods.ReadFile(file, false, false);
	
	pre.on(function(success, error) {
		if (error) {
			throw error;
		} else {
			console.log(pre);
		}
	});*/
	
	var pre = [];

	fs.readFile(file, 'utf-8', function(error, text) {
		if (error) {
			throw error;
		} 
		
		pre = ch2(text).join(' ');
		
		if (newFile) {
			fs.writeFile(newFile, pre, function(error) {
				if (error) {
					console.log('Something was wrong:', error);
				} else {
					console.log('Done');
				}
			});
		}
	});

	function ch2(text) {
		var j = 0;
		for (var i = 0; i < text.length; i++) {
			if (ch == text[i]) {
				pre.push(text.slice(j, i));
				j = i;
			}
		}
		return pre;	
	}
			
};


methods.Sequence = function(file, seq, longest) {
	var current = 0;
	var max = 0;
	var maxS = [];
	
	fs.readFile(file, 'utf-8', function(error, text) {
		if (error) {
			throw error;
		}
		var allS = [];
		console.log(text.length / 1000 + ' k');
		if (seq.length == 1) {
		for (var i = 0; i < text.length; i++) {

			if (text[i] != seq) {
				current = 0;
			} else {
				if (current > 0) {
					allS.push(text.slice(i - current, i + 1));
				}
				current++;
			}
		}
		}
		if (seq.length > 1) {
			var j = 0;
			for (var i = 0; i < text.length; i++) {
				if (text[i] != seq[j]) {
					current = 0;
					j = 0;
				} else {
					if ((current > 0) && j == seq.length - 1) {
						allS.push(text.slice(i - current, i + 1));
					}
					current++;
					j++;
				}
			}
		}				
				
		if (!longest) {	
			console.log(allS);
		} else {
			allS.forEach(function(s) {
				if (s.length >= longest) {
					maxS.push(s);
				}
			});
			
			console.log(maxS);
		}

	});
