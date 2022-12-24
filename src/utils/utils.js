export const wait = function(ms, callback){
	return new Promise(resolve => {
		setTimeout(() => {
			callback();
			resolve();
		}, ms)
	})
}