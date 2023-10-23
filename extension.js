const vscode = require('vscode');
const md5 = require('md5')
const axios = require('axios');
//大写字母转化为小写并在前方加入空格
function convertAndAddSpace(str) {
	let result = '';
	for (let i = 0; i < str.length; i++) {
		if (str[i] >= 'A' && str[i] <= 'Z') {
			result += ' ' + str[i].toLowerCase();
		} else {
			result += str[i];
		}
	}
	return result.trim();
}
function activate(context) {
	let disposable = vscode.languages.registerHoverProvider(
		'*',
		{
			provideHover(document, position, token) {
				return new Promise((resolve, reject) => {
					let str = document.getText(document.getWordRangeAtPosition(position));
					let word = str
					if (str.includes('_')) {
						word = str.replace(/_/g, " ")
					} else if (/[A-Z]/.test(str)) {
						word = convertAndAddSpace(str)
					}
					const appid = "20231020001854021"
					const q = encodeURIComponent(word)
					const salt = Date.now().toString().slice(0, 8)
					const key = "o5YHf1bRrafvuGa6alMS"
					const sign = md5(appid + word + salt + key)
					axios.get(`http://api.fanyi.baidu.com/api/trans/vip/translate?q=${q}&from=en&to=zh&appid=${appid}&salt=${salt}&sign=${sign}`).then(res => {
						resolve(new vscode.Hover(JSON.stringify(res.data.trans_result)))
					})
				}).catch(err => {
					reject(err)
				})
			}
		}
	)
	context.subscriptions.push(disposable);

	let disposable1 = vscode.commands.registerCommand('extension.trans', function () {
		vscode.window.showInformationMessage('翻译功能已启动!');
	});
	context.subscriptions.push(disposable1)
}
function deactivate() {
	if (disposable) {
		disposable.dispose();
	}
}
exports.activate = activate;
exports.deactivate = deactivate;