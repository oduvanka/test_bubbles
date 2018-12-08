let	contentBubbles = document.querySelector('.contentBubbles'),
	arrD = [];
	
function onLoadPage () {
	createBubble();
	//sortBubbles();
}

function createBubble (i = 0) {
	 
	if (getD(i)) {
		//Есть свободное место,
		let newBubble = createObject();
		
		editOptionsBubble(newBubble, i);
		addStyleBubble(newBubble, i);
		contentBubbles.appendChild(newBubble);
		
		i++;
		createBubble(i);
	}
}

/*Создаём div для будущего шара*/
function createObject () {
	return  document.createElement("div");
}

/*Работаем с размером шара*/
function getD(i) {
	const contentWeight = contentBubbles.clientWidth,
		MIN_D = ((contentWeight > 1000) ? (Math.floor(contentWeight / 30)) : 20),
		MAX_D = ((contentWeight > 1000) ? (Math.floor(contentWeight / 10)) : 30),
		SPACE_D = 40;
		
	let newD = getRandomInt(MIN_D, MAX_D);
	
	let sumArrD = getSumArr() + newD + (SPACE_D * (i-1));
	
	let flagFreePlace = false;
	if ((contentWeight - sumArrD) > 0) {
		//Свободного места осталось столько, что шарик с полученным диаметром поместится
		arrD[i] = newD;
		flagFreePlace = true;
	}
	return flagFreePlace;
}

/* Возвращает случайное целое число между min (включительно) и max (не включая max)
Использование метода Math.round() даст вам неравномерное распределение!
https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getSumArr () {
	// для каждого элемента массива запустить функцию,
	// промежуточный результат передавать первым аргументом далее
	let result = arrD.reduce(function(sum, current) {
	  return sum + current;
	}, 0);
	
	return result;
}

//Задаём размеры div нового шара
function editOptionsBubble (bubble, i) {
	let bublleOptions =  arrD[i] + 'px';
	bubble.style.width = bublleOptions;
	bubble.style.height = bublleOptions;
	bubble.style.borderRadius = bublleOptions;
	
	bubble.textContent = arrD[i];	//Для отладки выводим число на шаре
}

/*Добавляем классы для визуализации div нового шара*/
function addStyleBubble (bubble, i) {
	bubble.classList.add('bubble');
	
	/*Цвет шара*/
	let colorBubble = 'bubbleYellow';
	switch (i%4) {
		case 0: 
			colorBubble = 'bubbleRed';
			break;
		case 1: 
			colorBubble = 'bubbleBlue';
			break;
		case 2:
			colorBubble = 'bubbleGreen';
			break;
	}	
	bubble.classList.add(colorBubble);
}

/*Меняет местами 2 шара и проверяет, нужны ли ещё перестановки
Параметры:
k			- счётчик элементов, увеличивается на 1, обнуляется когда завершён перебор всех элементов (проход)
flagWasSwap	- флаг, отмечает что за проход была перестановка, сбрасывается перед новым проходом
n			- индекс последнего в проходе элемента, уменьшается на 1 когда завершён проход
startTime		- таймаут выполнения функций, секунды, переводится в мс и увеличивается перед вызовом setTime
*/
function sortBubbles (i = 0, flagWasSwap = false, n = arrD.length-1) {
		
	let flagWillSwapBubbles = false;
	
	if (arrD[i] > arrD[i+1]) {
		//Меняем местами диаметры
		let tempD = arrD[i];
		arrD[i] = arrD[i+1];
		arrD[i+1] = tempD;
		
		flagWasSwap = true;
		
		flagWillSwapBubbles = true;
	}
	
	setTimeout(function(i) 
	{
		let numberOfChecks = 0;
		//Новый шаг
		let nowStep = document.getElementById('nowStep');
		nowStep.textContent = numberOfChecks;
		
		let bubbles = contentBubbles.querySelectorAll('.bubble');
		let bubble1 = bubbles[i];
		let bubble2 = bubbles[i+1];
				
		//Выделяем шары
		bubble1.classList.add('bubbleInFocus');
		bubble2.classList.add('bubbleInFocus');
		
		setTimeout(function() 
		{		
			if (flagWillSwapBubbles) {
				//Выделяем неправильные шары
				bubble1.classList.add('bubbleFalse');
				bubble2.classList.add('bubbleFalse');
			}
			
			setTimeout(function() 
			{			
				if (flagWillSwapBubbles) {
					//Меняем местами шары
					contentBubbles.removeChild(bubble2);
					let newPlaceBubble = contentBubbles.insertBefore(bubble2, bubble1);
					
					bubble1.classList.remove('bubbleFalse');
					bubble2.classList.remove('bubbleFalse');
				}
							
				//Снимаем выделение с шаров
				bubble1.classList.remove('bubbleInFocus');
				bubble2.classList.remove('bubbleInFocus');
				numberOfChecks++;
			}, 300);
		}, 300);
	}, 300, i);
	
	i++;
	
	if (i === n) {
		//Дошли до последнего шара
		if (!flagWasSwap) {
			//Не было перестановок
			//totalSteps.textContent = numberOfChecks;
			return;
		}
		//перестановки были, поэтому надо перебирать заново	
		i = 0;
		n--;
		flagWasSwap = false;
	}
	setTimeout(function(i) 
	{
		sortBubbles(i, flagWasSwap, n);
	}, 1000, i);
}


/*
таймауты вложенные,
тогда не надо будет только 1 раз получать массив шаров,
избавиться от лишних счётчиков, не надо будет передавать startTime в функцию,

document заменить на content

вынести в отдельные функции создание шариков с размерами и отдельно прикручивание им классов,
то есть будет стартовая функция, которая будет звать 2 другие функции
*/
