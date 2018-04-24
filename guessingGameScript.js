// Bypass localhost connection issues
// var json = {
//     "data": [
//         {
//             "id": 1,
//             "name": "Nikola Tesla",
//             "quote": "The present is theirs; the future, for which I really worked, is mine.",
//             "birthday": "July 10, 1856",
//             "image_url": "http://lorempixel.com/300/150/"
//         },
//         {
//             "id": 2,
//             "name": "Albert Einstein",
//             "quote": "Imagination is more important than knowledge.",
//             "birthday": "March 14, 1879",
//             "image_url": "http://lorempixel.com/300/150/"
//         },
//         {
//             "id": 3,
//             "name": "Isaac Newton",
//             "quote": "If I have seen further than others, it is by standing upon the shoulders of giants.",
//             "birthday": "December 25, 1642",
//             "image_url": "http://lorempixel.com/300/150/"
//         },
//         {
//             "id": 4,
//             "name": "Galileo Galilei",
//             "quote": "You cannot teach a man anything; you can only help him find it within himself.",
//             "birthday": "February 15, 1564",
//             "image_url": "http://lorempixel.com/300/150/"
//         },
//         {
//             "id": 5,
//             "name": "Marie Curie",
//             "quote": "Be less curious about people and more curious about ideas.",
//             "birthday": "November 7, 1867",
//             "image_url": "http://lorempixel.com/300/150/"
//         },
//         {
//             "id": 6,
//             "name": "Charles Darwin",
//             "quote": "A man who dares to waste one hour of time has not discovered the value of life.",
//             "birthday": "February 12, 1809",
//             "image_url": "http://lorempixel.com/300/150/"
//         },
//         {
//             "id": 7,
//             "name": "Stephen Hawking",
//             "quote": "Intelligence is the ability to adapt to change.",
//             "birthday": "January 8, 1942",
//             "image_url": "http://lorempixel.com/300/150/"
//         },
//         {
//             "id": 8,
//             "name": "Johannes Kepler",
//             "quote": "Nature uses as little as possible of anything.",
//             "birthday": "December 27, 1571",
//             "image_url": "http://lorempixel.com/300/150/"
//         },
//         {
//             "id": 9,
//             "name": "Thomas Edison",
//             "quote": "Genius is one percent inspiration and ninety-nine percent perspiration.",
//             "birthday": "February 11, 1847",
//             "image_url": "http://lorempixel.com/300/150/"
//         }
//     ]
// }
//var people = json["data"];

// Access the data from the server
var people = [];
var xhr = new XMLHttpRequest()
xhr.open("GET", "http://localhost:3000/data", true);
xhr.onreadystatechange = function () {
  	if(xhr.readyState === 4 && xhr.status === 200) {
    	people = JSON.parse(xhr.responseText);
    	console.log(people);
    	init();
    }
};
xhr.send();



var diff = 6;
var type;
var answer;
var answerText;
var possPeople;
var squares = document.querySelectorAll(".square");
var squareTextBlock = document.querySelectorAll(".squareText");
var text = document.querySelectorAll("p");
var questionDisplay = document.getElementById("questionDisplay");
var messageDisplay = document.querySelector("#message");
var resetButton = document.getElementById("reset");
var spacer = document.getElementById("spacer");
var startOver = document.getElementById("startOver")
var modeButtons = document.querySelectorAll(".mode");
var typeButtons = document.querySelectorAll(".type");
var container = document.getElementById("container");
var correct = document.getElementById("correct");
var correctbg = document.getElementById("correctbg");
var personImg;
var firstTime = true;

function init() {
	resetButton.addEventListener("click", setupTypeButtons);
	startOver.addEventListener("click", reset);
}

function setupTypeButtons() {
	resetButton.classList.add("hidden");
	startOver.classList.add("hidden");
	spacer.classList.add("hidden");
	questionDisplay.textContent = "";
	messageDisplay.textContent = "Choose A Game Type:";

	// Make sure mode buttons are hidden and unselected
	for(i=0; i<modeButtons.length; i++) {
		modeButtons[i].classList.remove("selected");
		modeButtons[i].classList.add("hidden");
	}
	// Make sure type buttons are visible and unselected
	for(i=0; i<typeButtons.length; i++) {
		typeButtons[i].classList.remove("hidden");
		typeButtons[i].classList.remove("selected");

		// If statement applies to first time only to prevent
		// adding event listeners subsequent times
		if(firstTime) {
			typeButtons[i].addEventListener("click", function() {
				for(j=0; j<typeButtons.length; j++){
					typeButtons[j].classList.remove("selected");
					typeButtons[j].classList.add("hidden");
				}
				this.classList.add("selected");
				this.classList.remove("hidden");
				type = this.textContent.toLowerCase();

				setupModeButtons();
			});
		}
	}
}

function setupModeButtons() {
	messageDisplay.textContent = "Choose A Difficulty:";
	for(i=0; i<modeButtons.length; i++) {
		modeButtons[i].classList.remove("hidden");

		// Same as with setupTypeButtons()
		if(firstTime) {
			modeButtons[i].addEventListener("click", function() {
				for(j=0; j<modeButtons.length; j++){
					modeButtons[j].classList.remove("selected");
					modeButtons[j].classList.add("hidden");
				}
				this.classList.add("selected");
				this.classList.remove("hidden");
				this.textContent === "Easy" ? diff = 3: diff = 6;
				messageDisplay.textContent = "Pick a square";

				// Check if first time again because this is inside
				// an event listener and will run subsequent times
				// everytime a mode is choosen
				if(firstTime) {
					setupSquares();
				} else {
					reset();
				}
			});
		}
	}
}

function setupSquares() {
	for(i=0; i<container.children.length; i++) {
		// Anonymous function to find out where the square
		// clicked is located within the square array...
		(function(place){
			container.children[place].addEventListener("click", function(){
				var clickedPerson = text[place].textContent;

				// ...check to see if the name of the person
				// assigned to that square matches the answer...
				if(clickedPerson === answer) {
					// ...if so, change all the squares to the correct person
					messageDisplay.textContent = "Correct!";
					correctAnswer(personImg);
				} else {
					// ...remove the square if not
					messageDisplay.textContent = "Try Again";
					this.style.opacity = "0";
				}
			});    
		})(i);
	}
	firstTime = false;
	reset();
}

function setupImages() {
	personImg = "url(" + possPeople[i]["image_url"] + ")";
	squares[i].style.backgroundImage = personImg;
	text[i].textContent = possPeople[i]["name"];
	squareTextBlock[i].classList.remove("hidden");
}

function correctAnswer(img) {
	for(i=0; i<possPeople.length; i++) {
		squareTextBlock[i].style.display = "none";
	}
	resetButton.textContent = "Reset Mode and Difficulty";
	startOver.classList.remove("hidden");
	resetButton.classList.remove("hidden");
	spacer.classList.remove("hidden");
	correctbg.style.backgroundImage = img;
	correct.style.display = "block";
}

function generateRandomPeople(num) {
	var arr = [];
	for(i=0; i<num; i++) {
		// run once to randomly generate a person,
		// but keep randomizing if that person is
		// already in the arr
		do {
			var person = randomPerson();
		} while (arr.indexOf(person) !== -1)
		arr.push(person);
	}
	return arr;
}

function randomPerson() {
	return people[Math.floor(Math.random() * people.length)];
}

function personPicker() {
	// Picks a person from the array to be the answer, then
	// gets their birthday or quote depending on the game type
	var rand = Math.floor(Math.random() * possPeople.length);
	answer = possPeople[rand]["name"];
	if(type === "birthday") {
		answerText = possPeople[rand].birthday;
		questionDisplay.style.fontStyle = "normal";
	} else {
		answerText = '"' + possPeople[rand].quote + '"';
		questionDisplay.style.fontStyle = "italic";
	}
}

function reset() {
	correct.classList.add("hidden");
	resetButton.classList.add("hidden");
	startOver.classList.add("hidden");
	spacer.classList.add("hidden");
	possPeople = generateRandomPeople(diff);
	personPicker();
	questionDisplay.textContent = answerText;
	for(i=0; i<squares.length; i++) {
		squareTextBlock[i].style.opacity = "1";
		squareTextBlock[i].style.display = "block";
		if(possPeople[i]) {
			setupImages();
		} else {
			squareTextBlock[i].style.display = "none";
		}
	}
}

