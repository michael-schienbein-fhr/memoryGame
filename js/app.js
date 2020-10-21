let loader = PIXI.Loader.shared;

let app = new PIXI.Application({
	width: 1920, // default: 800
	height: 1080, // default: 600
	antialias: false, // default: false
	transparent: false, // default: false
	resolution: 1, // default: 1
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
// app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0x39217b;

// PIXI.loader.add("imgs/sprites.json").load(setup);
loader.add("imgs/sprites.json").load(setup);

function setup() {
	let sheet = loader.resources["imgs/sprites.json"].spritesheet;
	let background = new PIXI.Sprite(sheet.textures["bgFinal.png"]);
	background.scale.x = 0.79;
	background.scale.y = 0.8;
	cardFlipOver = new PIXI.AnimatedSprite(sheet.animations["cardFlipOver"]);
	cardFlipOver.interactive = true;
	cardFlipOver.scale.x = 0.5;
	cardFlipOver.scale.y = 0.5;
	cardFlipOver.x = 700;
	cardFlipOver.y = 350;
	cardFlipOver.animationSpeed = 0.12;
	cardFlipOver.loop = false;
	cardFlipBack = new PIXI.AnimatedSprite(sheet.animations["cardFlipBack"]);
	cardFlipBack.interactive = true;
	cardFlipBack.scale.x = 0.5;
	cardFlipBack.scale.y = 0.5;
	cardFlipBack.x = 700;
	cardFlipBack.y = 350;
	cardFlipBack.animationSpeed = 0.12;
	cardFlipBack.loop = false;

	app.stage.addChild(background);
	app.stage.addChild(cardFlipOver);

	cardFlipOver.on("mousedown", onCardClickFront);
	cardFlipBack.on("mousedown", onCardClickBack);
	function onCardClickFront() {
		cardFlipOver.play();
		let id = setInterval(() => {
			cardFlipOver.visible = false;
			app.stage.addChild(cardFlipBack);
		}, 700);
		console.log(id);
		cardFlipBack.visible = true;
	}
	function onCardClickBack() {
		cardFlipBack.play();
		let id = setInterval(() => {
			cardFlipBack.visible = false;
			// app.stage.addChild(cardFlipOver);
		}, 700);
		console.log(id);
		cardFlipOver.visible = true;
	}
}

// Game logic:
document.addEventListener("DOMContentLoaded", function () {
	const cards = document.querySelectorAll(".game-card");
	const bg = document.querySelector("body");
	let numCards = cards.length;
	let card1 = null;
	let card2 = null;
	let cardsFlipped = 0;
	let currentScore = 0;
	let enableClick = true;
	let lowScore = localStorage.getItem("low-score");

	if (lowScore) {
		document.getElementById("best-score").innerText = lowScore;
	}

	for (let card of cards) {
		card.addEventListener("click", handleCardClick);
	}

	let startBtn = document.getElementById("start-button");
	startBtn.addEventListener("click", startGame);

	function sound(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
		this.play = function () {
			this.sound.play();
		};
		this.stop = function () {
			this.sound.pause();
		};
	}

	function bgMusic() {
		var bgMusic = new sound("sounds/nCardBGMusic.mp3");
		bgMusic.play();
		bgMusic.sound.loop = true;
	}

	function handleCardClick(e) {
		if (!enableClick) return;
		if (!e.target.classList.contains("front")) return;

		// let currentCard = e.target.parentElement;
		let currentCard = e.target.closest(".game-card");

		if (!card1 || !card2) {
			let selectSound = new sound("sounds/selectCardSound.mp3");
			selectSound.play();
			if (!currentCard.classList.contains("flipped")) {
				setScore(currentScore + 1);
			}
			currentCard.classList.add("flipped");
			card1 = card1 || currentCard;
			card2 = currentCard === card1 ? null : currentCard;
		}

		if (card1 && card2) {
			let gif1 = card1.children[1].children[0].src;
			let gif2 = card2.children[1].children[0].src;

			if (gif1 === gif2) {
				let matchSound = new sound("sounds/matchSound.mp3");
				matchSound.play();
				bg.classList.toggle("match");
				setTimeout(() => {
					bg.classList.toggle("match");
				}, 3000);
				cardsFlipped += 2;
				card1.removeEventListener("click", handleCardClick);
				card2.removeEventListener("click", handleCardClick);
				card1 = null;
				card2 = null;
			} else {
				let noMatchSound = new sound("sounds/noMatchSound.mp3");
				noMatchSound.play();
				enableClick = false;
				setTimeout(function () {
					card1.classList.remove("flipped");
					card2.classList.remove("flipped");
					card1 = null;
					card2 = null;
					enableClick = true;
				}, 1000);
			}
		}

		if (cardsFlipped === numCards) endGame();
	}

	function startGame() {
		bgMusic();
		setScore(0);
		start.classList.add("playing");
		let indices = [];
		for (let i = 1; i <= numCards / 2; i++) {
			indices.push(i.toString());
		}
		let pairs = shuffle(indices.concat(indices));
		console.log(pairs);
		for (let i = 0; i < cards.length; i++) {
			let path = "imgs/fronts/" + pairs[i] + ".png";
			cards[i].children[1].children[0].src = path;
		}
	}

	function shuffle(array) {
		let arrayCopy = array.slice();
		for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
			// generate a random index between 0 and idx1 (inclusive)
			let idx2 = Math.floor(Math.random() * (idx1 + 1));

			// swap elements at idx1 and idx2
			let temp = arrayCopy[idx1];
			arrayCopy[idx1] = arrayCopy[idx2];
			arrayCopy[idx2] = temp;
		}
		return arrayCopy;
	}

	function setScore(newScore) {
		currentScore = newScore;
		document.getElementById("current-score").innerText = currentScore;
	}

	function endGame() {
		let end = document.getElementById("end");
		let score = document.getElementById("current-score");
		let scoreHeader = end.children[1];
		scoreHeader.innerText = "Your score: " + currentScore;
		let lowScore = +localStorage.getItem("low-score") || Infinity;
		if (currentScore < lowScore) {
			scoreHeader.innerText += " - NEW BEST SCORE!!";
			localStorage.setItem("low-score", currentScore);
		}
		document.getElementById("end").classList.add("game-over");
		score.classList.add("game-over");
	}
});
