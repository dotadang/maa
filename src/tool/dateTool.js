export function zeroPad(nr,base){
    var  len = (String(base).length - String(nr).length)+1;
    return len > 0? new Array(len).join('0')+nr : nr;
  }

export default function getCountdownTime(timestamp) {
  	const now = Date.parse(new Date());
  	const t = timestamp*1000 + 24*60*60*1000 - now;
  	let seconds = Math.floor((t / 1000) % 60)
    let minutes = Math.floor((t / 1000 / 60) % 60)
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    let days = Math.floor(t / (1000 * 60 * 60 * 24))
  	return zeroPad(hours,10) + ":" + zeroPad(minutes,10) + ":" + zeroPad(seconds,10);
}

export function formatDate(date) {

	console.log(date);
	return 'hello World';

	//return date.getFullYear() + '/' + zeroPad(date.getMonth()+1,10) + '/' + zeroPad(date.Date()+1,10) + ' '	 + zeroPad(date.getHours(),10) + ":" + zeroPad(date.getMinutes(), 10) + ":" + zeroPad(date.getSeconds(),10);
}