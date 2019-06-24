let	arrD = [],
	newArrD = [];
	
function onLoadPage () {
	createBubble();
	writeNumber('totalSteps', getMaxNumberSteps());
	sortBubbles();
}

function createBubble (i = 0) {	 
	if (checkFreeSpace(i)) {
		//���� ��������� �����,
		let newBubble = createObject();
		
		editOptionsBubble(newBubble, arrD[i]);
		addStyleBubble(newBubble, i);
		appendBubble(newBubble);
		
		i++;
		createBubble(i);
	}
}

/* ��������� ������� ��� �� ������� */
function createObject () {
	let myTemplate = document.querySelector('#tmplBubble').content,
		tmplBubble = myTemplate.querySelector(".bubble"),
		clonedBubble = tmplBubble.cloneNode(true);
		
	return clonedBubble;
}

/* ��������� ��������� ����� */
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
		/* ���������� ����� �������� �������, ��� ����� � ���������� ��������� ���������� */
		addDtoArr(newD, i);
		flagFreePlace = true;
	}
	return flagFreePlace;
}

/* ���������� ��������� ����� ����� ����� min (������������) � max (�� ������� max)
������������� ������ Math.round() ���� ��� ������������� �������������!
https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/* ����������� ������, �������� ��� ��������
https://learn.javascript.ru/array-iteration */
function getSumArr () {
	// ��� ������� �������� ������� ��������� �������,
	// ������������� ��������� ���������� ������ ���������� �����
	let result = arrD.reduce(function(sum, current) {
	  return sum + current;
	}, 0);
	
	return result;
}

/* ��������� ����� ������� � ������ */
function addDtoArr (D, i) {
	arrD[i] = D;
	newArrD[i] = D;
}

/* ����� ������� ������ ���� */
function editOptionsBubble (bubble, myNumber) {
	bubble.style.width = myNumber + 'px';
	bubble.style.height = myNumber + 'px';
	
	bubble.textContent = myNumber;
}

/*��������� ����� ����� ����*/
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

/* ��������� ����� ����� �� ��������*/
function appendBubble (bubble) {
	let contentBubbles = document.querySelector('.contentBubbles');
	contentBubbles.appendChild(bubble);
}

/* ��������� � ���������� ����������� ��������� ���������� ������������ */
function getMaxNumberSteps () {
	let n = arrD.length;
	return (n-1)*n/2;
}

/*������ ������� 2 ���� � ���������, ����� �� ��� ������������
���������:
i			- ������� ���������, ������������� �� 1, ���������� ����� �������� ������� ���� ��������� (������)
flagWasSwap	- ����, �������� ��� �� ������ ���� ������������, ������������ ����� ����� ��������
n			- ������ ���������� � ������� ��������, ����������� �� 1 ����� �������� ������
*/
function sortBubbles (iL = 0, flagWasSwap = false, n = newArrD.length-1) {
	
	let iR = iL + 1;
		
	let flagSwappedBubbles = compareD(iL, iR);	//��������, ����� �� ������������
	if (flagSwappedBubbles) {
		flagWasSwap = true;	//�� ���� ������ ���� ������������
	}
	
	let timeoutMs = 300;
	
	writeNumber('nowStep', getNumberStep(iR, n));	//��������� ����� ����
		
	addClass(iL, iR, 'bubbleInFocus'); //�������� ����
		
	setTimeout(function() 
	{		
		if (flagSwappedBubbles) {
			addClass(iL, iR, 'bubbleFalse'); //�������� ������������ ����
		}
		
		setTimeout(function() 
		{			
			if (flagSwappedBubbles) {
				swappedBubbles(iL, iR); //������ ������� ����				
				removeClass(iL, iR, 'bubbleFalse'); //������� ��������� � �����, ������� ���� �������������
			}
			removeClass(iL, iR, 'bubbleInFocus'); //������� ��������� � �����
			
			if (iR === n) {
				//����� �� ���������� ����
				addClass(iR, iR, 'moveBubbleUpDown'); //������� �������� ��� �����, ������� ��� �� ����� ����������
				if (!flagWasSwap) {
					//�� ���� ������������
					alert('Finish!');
					return;
				}
				//������������ ����, � ���� ������� ������ ������������ ������, ��������� �� ������ �������
				iR = 0;
				n--;
				flagWasSwap = false;
			}
			
			sortBubbles(iR, flagWasSwap, n);
		}, timeoutMs);
	}, timeoutMs);
}

/* ��������� ���������� ������������,
sumSwap - ����� ���������� ������������,
n - ����� ����� ���� ������������,
���������� ����� */
function getNumberStep (sumSwap, n) {
/*	arr.length-1 - n - ���������� ������������� ��������
	���� 0 = i
	���� 1 = arr.length-1 + i
	���� 2 = arr.length-1 + arr.length-2 + i */
	
	for (i=0; i<(newArrD.length-1-n); i++) {
		sumSwap += newArrD.length-(i+1);
	}
	
	return sumSwap;
}

/* ������������� �������� ������������ */
function writeNumber (tagName, k) {
	let tag = document.getElementById(tagName);
	tag.textContent = k;
}

/* ������ ������� �������� � ������� ���������,
i1, i2 - ������� ��������� ������� ���������,
���������� ������, ���� ������������ ���������� */
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

/* ���������� ���������� ����� */

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