let	arrD = [];
	
function onLoadPage () {
	createBubble();
	sortBubbles();
}

function createBubble (i = 0) {
	 
	if (checkFreeSpace(i)) {
		//Есть свободное место,
		let newBubble = createObject();
		
		editOptionsBubble(newBubble, i);
		addStyleBubble(newBubble, i);
		appendBubble(newBubble);
		
		i++;
		createBubble(i);
	}
}

/*Создаём div для будущего шара*/
function createObject () {
	return  document.createElement("div");
}

/*Проверим свободное место*/
function checkFreeSpace(i) {
	let contentBubbles = document.querySelector('.contentBubbles');
	const contentWeight = contentBubbles.clientWidth,
		MIN_D = ((contentWeight > 1000) ? (Math.floor(contentWeight / 30)) : 20),
		MAX_D = ((contentWeight > 1000) ? (Math.floor(contentWeight / 10)) : 30),
		SPACE_D = 40;
		
	let newD = getRandomInt(MIN_D, MAX_D);
	
	let sumArrD = getSumArr() + newD + (SPACE_D * (i+1));
	
	let flagFreePlace = false;
	if ((contentWeight - sumArrD) > 0) {
		//Свободного места осталось столько, что шарик с полученным диаметром поместится
		addDtoArr(newD, i);
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

/*Свёртка массива - сумма всех элементов
https://learn.javascript.ru/array-iteration */
function getSumArr () {
	// для каждого элемента массива запустить функцию,
	// промежуточный результат передавать первым аргументом далее
	let result = arrD.reduce(function(sum, current) {
	  return sum + current;
	}, 0);
	
	return result;
}

/*Добавляем новый диаметр в массив*/
function addDtoArr (D, i) {
	arrD[i] = D;
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

/*Вставляем созданный div с шариком на страницу*/
function appendBubble (bubble) {
	let contentBubbles = document.querySelector('.contentBubbles');
	contentBubbles.appendChild(bubble);
}

/*Меняет местами 2 шара и проверяет, нужны ли ещё перестановки
Параметры:
i			- счётчик элементов, увеличивается на 1, обнуляется когда завершён перебор всех элементов (проход)
flagWasSwap	- флаг, отмечает что за проход была перестановка, сбрасывается перед новым проходом
n			- индекс последнего в проходе элемента, уменьшается на 1 когда завершён проход
*/
function sortBubbles (iL = 0, flagWasSwap = false, n = arrD.length-1) {
	let flagEnd = false;
	
	if (iL === n) {
		//Дошли до последнего шара
		if (!flagWasSwap) {
			//Не было перестановок
			flagEnd = true;
		}
		else {
			//перестановки были, поэтому надо перебирать заново	
			iL = 0;
			n--;
			flagWasSwap = false;
		}
	}
	
	let iR = iL + 1;
	
	let flagSwappedBubbles = compareD(iL, iR);	//проверим, нужна ли перестановка
	if (flagSwappedBubbles) {
		flagWasSwap = true;	//за этот проход была перестановка
	}
	
	let timeoutMs = 300;
	
	setTimeout(function() 
	{
		let numberOfChecks = 0;
		//Новый шаг
		/*numberOfChecks++;
		let nowStep = document.getElementById('nowStep');
		nowStep.textContent = numberOfChecks;*/
					
		addClass(iL, iR, 'bubbleInFocus'); //Выделяем шары
		
		setTimeout(function() 
		{		
			if (flagSwappedBubbles) {
				addClass(iL, iR, 'bubbleFalse'); //Выделяем неправильные шары
			}
			
			setTimeout(function() 
			{			
				if (flagSwappedBubbles) {
					swappedBubbles(iL, iR); //Меняем местами шары				
					removeClass(iL, iR, 'bubbleFalse'); //Снимаем выделение с шаров, которые были неправильными
				}
				removeClass(iL, iR, 'bubbleInFocus'); //Снимаем выделение с шаров
				
				if (flagEnd) {
					return;
				}
				sortBubbles(iR, flagWasSwap, n);
			}, timeoutMs);
		}, timeoutMs);
	}, timeoutMs);
}

function compareD (i1, i2) {
	let flagSwap = false;
	
	if (arrD[i1] > arrD[i2]) {
		//Меняем местами диаметры
		let tempD = arrD[i1];
		arrD[i1] = arrD[i2];
		arrD[i2] = tempD;
		
		flagSwap = true;
	}
	return flagSwap;
}

function addClass (iFrom, iTo, className) {
	let contentBubbles = document.querySelector('.contentBubbles');
	let bubbles = contentBubbles.querySelectorAll('.bubble');
	for (let i = iFrom; i <= iTo; i++) {
		bubbles[i].classList.add(className);
	}
}

function swappedBubbles (iB1, iB2) {
	let contentBubbles = document.querySelector('.contentBubbles');
	let bubbles = contentBubbles.querySelectorAll('.bubble');

	contentBubbles.removeChild(bubbles[iB2]);
	let newPlaceBubble = contentBubbles.insertBefore(bubbles[iB2], bubbles[iB1]);
}

function removeClass (iFrom, iTo, className) {
	let contentBubbles = document.querySelector('.contentBubbles');
	let bubbles = contentBubbles.querySelectorAll('.bubble');
	for (let i = iFrom; i <= iTo; i++) {
		bubbles[i].classList.remove(className);
	}
}