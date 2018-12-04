var	contentBubbles = document.querySelector('.contentBubbles'),
	arrD = [];

// Возвращает случайное целое число между min (включительно) и max (не включая max)
// Использование метода Math.round() даст вам неравномерное распределение!
//https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
	
function createBubble (i = 0, sumD = 0) {
	var contentWeight = contentBubbles.clientWidth,
		minD = ((contentWeight > 1000) ? (Math.floor(contentWeight / 30)) : 20),
		maxD = Math.floor(contentWeight / 10),
		newD = 0,
		spaceD = 40;
	
	//Записываем в массив диаметр нового шара
	newD = getRandomInt(minD, maxD);	
	arrD[i] = newD;
	sumD += newD;
	sumD += spaceD; //Учтём отступы
	
	//Создаём шар с соответствующим диаметром
	var newBubble = document.createElement("div");
	newBubble.classList.add('bubble');
	
	/*Цвет шара*/
	var colorBubble = 'bubbleYellow';
	if (i%4 === 0) {
		colorBubble = 'bubbleRed';
	}
	else if (i%3 === 0) {
		colorBubble = 'bubbleBlue';
	}
	else if (i%2 === 0) {
		colorBubble = 'bubbleGreen';
	}
	newBubble.classList.add(colorBubble);
	
	var bublleOptions = arrD[i] + 'px';
	newBubble.style.width = bublleOptions;
	newBubble.style.height = bublleOptions;
	newBubble.style.borderRadius = bublleOptions;
	
	newBubble.textContent = arrD[i];	//Для отладки выводим число на шаре
	contentBubbles.appendChild(newBubble);
	
	if ((contentWeight - sumD) > (maxD + spaceD)) {
		//Если оставшееся свободное место больше, чем максимальный шарик с учётом отступов
		i++;
		createBubble(i, sumD);
	}
}


/*Меняет местами 2 шара и проверяет, нужны ли ещё перестановки
Параметры:
k			- счётчик элементов, увеличивается на 1, обнуляется когда завершён перебор всех элементов (проход)
flagWasSwap	- флаг, отмечает что за проход была перестановка, сбрасывается перед новым проходом
n			- индекс последнего в проходе элемента, уменьшается на 1 когда завершён проход
startTime		- таймаут выполнения функций, секунды, переводится в мс и увеличивается перед вызовом setTime
*/
function sortBubbles (k = 0, flagWasSwap = false, n = arrD.length-1, startTime = 0) {
	var i = k;
	if (arrD[i] > arrD[i+1]) {
		//Меняем местами диаметры
		var tempD = arrD[i];
		arrD[i] = arrD[i+1];
		arrD[i+1] = tempD;
		
		flagWasSwap = true;
	}
	
	startTime += 1;
	setTimeout(function() 
	{
		var bubbles = document.querySelectorAll('.bubble');
		console.log(i);
		//Выделяем шары
		bubbles[i].classList.add('bubbleInFocus');
		bubbles[i+1].classList.add('bubbleInFocus');
	}, startTime*1000);	
		
	if (flagWasSwap) {	
		startTime += 1;
		setTimeout(function() 
		{
			var bubbles = document.querySelectorAll('.bubble');
			
			//Выделяем неправильные шары
			bubbles[i].classList.add('bubbleFalse');
			bubbles[i+1].classList.add('bubbleFalse');
		}, startTime*1000, i);
		
		startTime += 1;
		setTimeout(function() 
		{
			var bubbles = document.querySelectorAll('.bubble');
			
			//Меняем местами шары
			contentBubbles.removeChild(bubbles[i+1]);
			contentBubbles.insertBefore(bubbles[i+1], bubbles[i]);
		}, startTime*1000, i);
	}
	
	//Снимаем выделение с шаров
	startTime += 1;
	setTimeout(function() 
	{
		var bubbles = document.querySelectorAll('.bubble');
		
		bubbles[i].classList.remove('bubbleInFocus');
		bubbles[i].classList.remove('bubbleFalse');
		
		bubbles[i+1].classList.remove('bubbleInFocus');
		bubbles[i+1].classList.remove('bubbleFalse');
	}, startTime*1000, i);
	
	k++;
	
	if ((k === n) && (!flagWasSwap)) {
		//Дошли до последнего шара и не было перестановок
		//Это финал, наряжаем ёлку
	}
	else {
		if (k === n) {
			//Дошли до последнего шара, перестановки были, поэтому надо перебирать заново
			k = 0;
			n--;
			flagWasSwap = false;	
		}
		sortBubbles(k, flagWasSwap, n, startTime);
	}
}






