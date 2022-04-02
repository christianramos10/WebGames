
var dealerSum=0, yourSum=0, dealerAceCount=0, yourAceCount=0;

var hidden, deck;

var canHit=true; //Allows the player to draw while youSum<=21


window.onload = function(){
  document.getElementById("play-again").style.visibility = "hidden";
  buildDeck();
  shuffleDeck();
  startGame();
}

//Play again function reloads page
function playAgain(){
  location.reload();
}

//Deck builder function
function buildDeck(){
  let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; //Card values
  let types = ["C", "D", "H", "S"]; //Clubs, Diamonds, Hearts, and Stripes
  deck = []; //Empty deck

//Add cards to deck
  for(let i=0;i<types.length;i++){
    for(let j=0; j<values.length;j++){
      deck.push(values[j] + "-" + types[i]); //A-C --> K-C --> A-D --> K-D
    }
  }
  console.log(deck);
}

//Deck shuffler function
function shuffleDeck(){
  for(let i=0;i<deck.length;i++){
    let j = Math.floor(Math.random() * deck.length); //Random number between 0 and 52
    let temp = deck[i]; //Swap cards
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck);
}

//Game starter function
function startGame(){
  hidden = deck.pop(); //Add a hidden card to dealer
  dealerSum += getValue(hidden); //Check cards value
  dealerAceCount += checkAce(hidden); //Check if it's an Ace

  //Dealer must pick cards until its count exceeds 17
  while(dealerSum< 17){
    let cardImg = document.createElement("img"); //Create an Image
    let card = deck.pop(); //Get a card from deck
    cardImg.src = "./images/" + card + ".png"; //Get image of card from image folder
    dealerSum += getValue(card); //Sum card's value
    dealerAceCount += checkAce(card); //Check if its an Ace
    document.getElementById("dealer-cards").append(cardImg); //Add card and image to dealer-card div
  }
  console.log(dealerSum);

  //Player must get two cards
  for(let i=0; i<2; i++){
    let cardImg = document.createElement("img"); //Create an Image
    let card = deck.pop(); //Get a card from deck
    cardImg.src = "./images/" + card + ".png"; //Get image of card from image folder
    yourSum += getValue(card); //Sum card's value
    yourAceCount += checkAce(card); //Check if its an Ace
    document.getElementById("your-cards").append(cardImg); //Add card and image to your-card div
  }
}
console.log(yourSum);
document.getElementById("hit").addEventListener("click", hit); //Hit button function
document.getElementById("stay").addEventListener("click", stay);//Stay button function

//Player stays
function stay(){
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);
  canHit=false;
  document.getElementById("hidden").src = "./images/" + hidden + ".png";
  let message = "";

  //Win conditions
  if(yourSum > 21) message = "Game over! You exceeded 21.";
  else if(yourSum == 21) message = "Congratulations! You Won! 21!";
  else if(yourSum == dealerSum) message = "A Tie!";
  else if(yourSum < dealerSum && dealerSum < 21) message = "Game Over! Your count is lower than dealer's";
  else if(yourSum > dealerSum && yourSum < 21) message = "Congratulations! You won!";

  //Display message, scores, and play again button
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("results").innerText = message;
  document.getElementById("play-again").style.visibility = "visible";
}

//Player hits
function hit(){
  if(reduceAce(yourSum, yourAceCount) > 21) canHit=false; //Sums your total values with the amount of Aces you have

  if(!canHit){
    stay();
  }
  else{
    let cardImg = document.createElement("img"); //Create an Image
    let card = deck.pop(); //Get a card from deck
    cardImg.src = "./images/" + card + ".png"; //Get image of card from image folder
    yourSum += getValue(card); //Sum card's value
    yourAceCount += checkAce(card); //Check if its an Ace
    document.getElementById("your-cards").append(cardImg); //Add card and image to your-card div

    //Automatically go to end stage when you hit 21 or higher
    if(yourSum >= 21){
      stay();
    }
  }
}


//Reduce player's sum if theres an Ace in players hand and sum of values is higher than 21.
function reduceAce(playerSum, playerAceCount){
  while(playerSum>21 && playerAceCount>0){
    playerSum -=10;
    playerAceCount -=1;
  }
  return playerSum;
}

//Return card's value
function getValue(card){
  let data = card.split("-"); //"4-C" --> ["4", "C"], where 4: Value, C: type
  let value = data[0];

  if(isNaN(value)){ //If its not a number (A, J, Q, K)
    if(value == "A") return 11;
    return 10;
  }
  return parseInt(value); //If its a number, return its value
}

//Returns 1 if card is an Ace
function checkAce(card){
  if(card[0] =="A") return 1;
  return 0;
}
