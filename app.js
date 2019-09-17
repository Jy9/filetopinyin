const pinyin = require("pinyin");
const fs = require('fs');
const join = require('path').join;


const getPinyin = (str) => {
	let pinyinarr = pinyin(str, {
		style: pinyin.STYLE_NORMAL
	})

	let str1 = "";
	for (let i = 0, len = pinyinarr.length; i < len; i++) {
		str1 += pinyinarr[i][0];
	}
	str1 += parseInt(Math.random() * 10000);

	return str1
}
/**
 * 
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
const findSync = (startPath) => {
	//新建文件夹
	fs.mkdirSync('newdir'+startPath);
	fs.mkdirSync('newdir'+startPath+startPath);
	let result = [];
	let finder = (path) => {
		let files = fs.readdirSync(path);
		files.forEach((val, index) => {
			let oldPath = join(path, val);
			let stats = fs.statSync(oldPath);
			if (stats.isDirectory()) {
				fs.mkdirSync('newdir'+startPath+oldPath);
				// 递归读取文件夹下文件
				finder(oldPath)
				
			};
			// 读取文件名 并重命名保存
			if (stats.isFile()) {
				let vals = val.split(".");
				let fPath = join(path, (getPinyin(vals[0]) + '.' + vals[1]));
				var err = fs.renameSync(oldPath, "newdir"+startPath+fPath);
				result.push({
					val: vals[0],
					path: "newdir"+startPath+fPath
				})
			}
		});

	}
	finder(startPath);
	return result;
}
let imgpath = 'img/';
let fileNames = findSync(imgpath);
console.log(fileNames)
fs.writeFile("newdir"+imgpath+"json.txt", JSON.stringify(fileNames), function(err) {
    if(err) {
        return console.log(err);
    }
})
