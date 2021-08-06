document.addEventListener("DOMContentLoaded", function () {
	const init = function () {
		imagesLoaded(document.body, () => {
			// const cards = document.querySelectorAll(".game-card");
			const bg = document.querySelector("body");
			// let numCards = cards.length;
			let card1 = null;
			let card2 = null;
			let cardsFlipped = 0;
			let currentScore = 0;
			let enableClick = true;
			let lowScore = localStorage.getItem("low-score");

			if (lowScore) {
				document.getElementById("best-score").innerText = lowScore;
			}

			// for (let card of cards) {
			// 	card.addEventListener("click", handleCardClick);
			// }

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
				let bgMusic = new sound("sounds/nCardBGMusic.mp3");
				bgMusic.play();
				bgMusic.sound.loop = true;
			}

			function handleCardClick(e) {
				if (!enableClick) return;
				if (!e.target.classList.contains("front")) return;

				let currentCard = e.target.parentElement;
				// let currentCard = e.target.closest(".game-card");

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
				// setScore(0);
				start.classList.add("playing");
				game.classList.add("playing");
				let indices = [];
				for (let i = 1; i <= numCards / 2; i++) {
					indices.push(i.toString());
				}
				let pairs = shuffle(indices.concat(indices));
				for (let i = 0; i < cards.length; i++) {
					let path = "imgs/fronts/" + pairs[i] + ".png";
					console.log(path);
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

			// function setScore(newScore) {
			// 	currentScore = newScore;
			// 	document.getElementById("current-score").innerText = currentScore;
			// }

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


			// Remove loading class from body
			document.body.classList.remove('loading');
		});
	}

	init();
});
