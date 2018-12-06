let	contentBubbles = document.querySelector('.contentBubbles'),
	arrD = [];

// Возвращает случайное целое число между min (включительно) и max (не включая max)
// Использование метода Math.round() даст вам неравномерное распределение!
//https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
	
function createBubble (i = 0, sumD = 0) {
	const contentWeight = contentBubbles.clientWidth,
		MIN_D = ((contentWeight > 1000) ? (Math.floor(contentWeight / 30)) : 20),
		MAX_D = Math.floor(contentWeight / 10),
		SPACE_D = 40
	let	newD = 0;
	
	//Записываем в массив диаметр нового шара
	newD = getRandomInt(MIN_D, MAX_D);	
	arrD[i] = newD;
	sumD += newD;
	sumD += SPACE_D; //Учтём отступы
	
	//Создаём шар с соответствующим диаметром
	let newBubble = document.createElement("div");
	newBubble.classList.add('bubble');
	
	/*Цвет шара*/
	let colorBubble = 'bubbleYellow';
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
	
	let bublleOptions = arrD[i] + 'px';
	newBubble.style.width = bublleOptions;
	newBubble.style.height = bublleOptions;
	newBubble.style.borderRadius = bublleOptions;
	
	newBubble.textContent = arrD[i];	//Для отладки выводим число на шаре
	contentBubbles.appendChild(newBubble);
	
	if ((contentWeight - sumD) > (MAX_D + SPACE_D)) {
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
	let i = k;

	startTime += 300;
	setTimeout(function() 
	{
		//Выделяем шары
		let bubbles = document.querySelectorAll('.bubble');
		bubbles[i].classList.add('bubbleInFocus');
		bubbles[i+1].classList.add('bubbleInFocus');
	}, startTime, i);
	
	if (arrD[i] > arrD[i+1]) {
		//Меняем местами диаметры
		let tempD = arrD[i];
		arrD[i] = arrD[i+1];
		arrD[i+1] = tempD;
		
		flagWasSwap = true;
	
		startTime += 300;
		setTimeout(function() 
		{		
			//Выделяем неправильные шары
			let bubbles = document.querySelectorAll('.bubble');
			bubbles[i].classList.add('bubbleFalse');
			bubbles[i+1].classList.add('bubbleFalse');
		}, startTime, i);
		
		startTime += 300;
		setTimeout(function() 
		{			
			//Меняем местами шары
			let bubbles = document.querySelectorAll('.bubble');
			
			contentBubbles.removeChild(bubbles[i+1]);
			let newPlaceBubble = contentBubbles.insertBefore(bubbles[i+1], bubbles[i]);
			
			bubbles[i].classList.remove('bubbleFalse');
			bubbles[i+1].classList.remove('bubbleFalse');
		}, startTime, i);
	}
	
	//Снимаем выделение с шаров
	startTime += 300;
	setTimeout(function() 
	{	
		let bubbles = document.querySelectorAll('.bubble');
		bubbles[i].classList.remove('bubbleInFocus');
		bubbles[i+1].classList.remove('bubbleInFocus');
	}, startTime, i);
	
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






