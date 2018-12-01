var
	countBubbles = 5,
	container = document.querySelector('.container'),
	minWeight = 2.5,
	maxWeight = 10.5;

// Возвращает случайное число между min (включительно) и max (не включая max)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
	
function createBubbles () {
	for (var i = 0; i < countBubbles; i++) {
		var newBubble = document.createElement("div");
		newBubble.classList.add('bubble');
		container.appendChild(newBubble);
		var weightBubble = getRandomArbitrary(minWeight, maxWeight);
		newBubble.textContent = weightBubble.toFixed(2);
	}
}