let	arrD = [],
	newArrD = [];
	
function onLoadPage () {
	createBubble();
	writeNumber('totalSteps', getMaxNumberSteps());
	sortBubbles();
}

function createBubble (i = 0) {	 
	if (checkFreeSpace(i)) {
		//Есть свободное место,
		let newBubble = createObject();
		
		editOptionsBubble(newBubble, arrD[i]);
		addStyleBubble(newBubble, i);
		appendBubble(newBubble);
		
		i++;
		createBubble(i);
	}
}

/* Клонирует будущий шар из шаблона */
function createObject () {
	let myTemplate = document.querySelector('#tmplBubble').content,
		tmplBubble = myTemplate.querySelector(".bubble"),
		clonedBubble = tmplBubble.cloneNode(true);
		
	return clonedBubble;
}

/* Проверяет свободное место */
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
		/* Свободного места осталось столько, что шарик с полученным диаметром поместится */
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

/* Сворачивает массив, суммируя все элементы
https://learn.javascript.ru/array-iteration */
function getSumArr () {
	// для каждого элемента массива запустить функцию,
	// промежуточный результат передавать первым аргументом далее
	let result = arrD.reduce(function(sum, current) {
	  return sum + current;
	}, 0);
	
	return result;
}

/* Добавляет новый диаметр в массив */
function addDtoArr (D, i) {
	arrD[i] = D;
	newArrD[i] = D;
}

/* Задаёт размеры нового шара */
function editOptionsBubble (bubble, myNumber) {
	bubble.style.width = myNumber + 'px';
	bubble.style.height = myNumber + 'px';
	
	bubble.textContent = myNumber;
}

/*Добавляет класс цвета шара*/
function addStyleBubble (bubble, i) {	
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

/* Вставляет новый шарик на страницу*/
function appendBubble (bubble) {
	let contentBubbles = document.querySelector('.contentBubbles');
	contentBubbles.appendChild(bubble);
}

/* Вычисляет и возвращает максимально возможное количество перестановок */
function getMaxNumberSteps () {
	let n = arrD.length;
	return (n-1)*n/2;
}

/*Меняет местами 2 шара и проверяет, нужны ли ещё перестановки
Параметры:
i			- счётчик элементов, увеличивается на 1, обнуляется когда завершён перебор всех элементов (проход)
flagWasSwap	- флаг, отмечает что за проход была перестановка, сбрасывается перед новым проходом
n			- индекс последнего в проходе элемента, уменьшается на 1 когда завершён проход
*/
function sortBubbles (iL = 0, flagWasSwap = false, n = newArrD.length-1) {
	
	let iR = iL + 1;
		
	let flagSwappedBubbles = compareD(iL, iR);	//проверим, нужна ли перестановка
	if (flagSwappedBubbles) {
		flagWasSwap = true;	//за этот проход была перестановка
	}
	
	let timeoutMs = 300;
	
	writeNumber('nowStep', getNumberStep(iR, n));	//вычисляем номер шага
		
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
			
			if (iR === n) {
				//Дошли до последнего шара
				addClass(iR, iR, 'moveBubbleUpDown'); //Добавим анимацию для шаров, которые уже не будем перебирать
				if (!flagWasSwap) {
					//Не было перестановок
					alert('Finish!');
					return;
				}
				//перестановки были, в этом проходе больше переставлять нечего, переходим на начало шариков
				iR = 0;
				n--;
				flagWasSwap = false;
			}
			
			sortBubbles(iR, flagWasSwap, n);
		}, timeoutMs);
	}, timeoutMs);
}

/* Вычисляет количество перестановок,
sumSwap - всего состоялось перестановок,
n - всего может быть перестановок,
возвращает число */
function getNumberStep (sumSwap, n) {
/*	arr.length-1 - n - количество завершившихся проходов
	если 0 = i
	если 1 = arr.length-1 + i
	если 2 = arr.length-1 + arr.length-2 + i */
	
	for (i=0; i<(newArrD.length-1-n); i++) {
		sumSwap += newArrD.length-(i+1);
	}
	
	return sumSwap;
}

/* Устанавливает значения перестановок */
function writeNumber (tagName, k) {
	let tag = document.getElementById(tagName);
	tag.textContent = k;
}

/* Меняет местами диаметры в массиве диаметров,
i1, i2 - индексы элементов массива диаметров,
возвращает истину, если перестановка состоялась */
function compareD (i1, i2) {
	let flagSwap = false;
	
	if (newArrD[i1] > newArrD[i2]) {
		let tempD = newArrD[i1];
		newArrD[i1] = newArrD[i2];
		newArrD[i2] = tempD;
		
		flagSwap = true;
	}
	
	return flagSwap;
}

/* Управление подсветкой шаров */

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