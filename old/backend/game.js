import fetch from "node-fetch"

export class Player {
    constructor(name) {
        this.name     = name ? name : "Anonymous"
        this.hand     = []
        this.isTurn   = false
        this.balance  = 0
        
        // May cause future issues 
        Object.preventExtensions(this)
    }
}

export class Game {
    constructor() {
        this.players = []
        getID()
        drawCard()
    }
}

export function changeCard(card, player, deckID) {
    //     ge en ny card to player
    //     ta en ny card via api
    //     sätta card i players hand i stället för en annan
    
}

    
export function getID () {
    return new Promise((resolve, reject) => {
        fetch("https://deckofcardsapi.com/api/deck/new/shuffle")
            .then(res => res.json())
            .then(card => resolve(card.deck_id))
            .catch(reject)
    })
}

try {
    const deckID = await getID()
    console.log(deckID)

} catch (error) {
    console.error(error)
}



export function drawCard(amount, deckID) {
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${amount}`)
}