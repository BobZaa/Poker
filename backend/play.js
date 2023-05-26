import fetch from "node-fetch"
import { debug } from "../index.js"

//Funktion som drar ett kort utifrån deckID som kommer från en annan funktion och sparas i variabeln "deckID"
function drawCard(deckID) {
    //Skapar ett löfte
    console.log("promising")
    return new Promise(
        (resolve, reject) => {
            //Hämtar från API:n med deckIDn från innan, specifierar 1
            console.log("My Deck ID:" + deckID)
            fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
            //Tar bort oönskad DOM data och hämtar endast json data
                .then(result => result.json())
                //Löser löftet och sparar informationen om kortet
                .then(result => resolve(debug(result).cards[0]))
                .catch(reject)
        }
    ) 
}

//Class för spelaren/spelarna i spelet
export class Player {
    //Definierar vad som bygger upp en "player"
    constructor(name) {
        this.name = name
        this.card = null
        this.turn = false
        this.cardsLeft = 3
    }
  
    //Funktion inom spelare som gör det möjligt att byta ut spelarens kort
    changeCard(newCard) {
        console.log("changeCard")
        this.card = newCard
        this.cardsLeft -= 1
    }
}

//Class för själva spelet
export class Game {
    gameID
    players
    deck
    //Konstruktor som ska bygga upp players som hämtas ur form i html
    constructor(player1Name, player2Name) {
        this.players = [new Player(player1Name), new Player(player2Name)]
        this.players[0].turn = true
        //this.deck    = this.createDeck()
        this.gameID  = 0
        console.log("const 1" + this.deck)
    }

    checkPlayerTurn(){
        if(this.players[0].turn == true){
            return 0
        }
        return 1 
    }

    translateValue(){
        for(let player of this.players) {
            if(player.card.value == "QUEEN" || player.card.value == "KING" ||player.card.value == "JACK") {
                player.card.value = 10
            }
            else if(player.card.value == "ACE") {
                player.card.value = 11
            }
        }  
    }

    //En funktion inom spelet som ger spelaren ett kort
    async giveCard(place) {
        //Skapar ett nytt kort med spelets deckID
        this.newCard = await drawCard(this.deck)
        //Utifrån spelarens Index placering (0 eller 1) lägger spelet in det nya kortet
        this.players[place].changeCard(this.newCard)
    }

    //En funktion inom spelet som skapar en kortlek 
    createDeck() {
        //Skapar ett "löfte" som ska uppfyllas senare
        return new Promise((resolve, reject) => {
            //Hämtar en response från nätet.
            fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
            //Hämtar JSON delen av responsen.
                .then(res => res.json())
            //Löser "löftet" 
                .then(res => resolve(res.deck_id))
            //Kollar efter errors 
                .catch(reject)
        })
    }
}