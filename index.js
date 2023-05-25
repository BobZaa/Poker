//Importerar viktiga saker från andra platser än själva skriptet
import express from "express"
import njk from "nunjucks"
import bp from "body-parser"
import sqlite from "better-sqlite3"
import { Game, Player } from "./backend/play.js"

const DEBUG = true

/**
 * @type {Game}
 */
let game

/**
 * Takes any value, logs it, and returns it.
 * @template T Any type.
 * @param {T} val Any value.
 * @returns {T}
 */

const db = sqlite("Gamelog.db")

db.prepare(`
    CREATE TABLE IF NOT EXISTS victories (
        date TIMESTAMP NOT NULL DEFAULT current_timestamp,
        player TEXT NOT NULL
    )
`).run()

export function debug(val) {
    if (DEBUG) {
        // Får typ av värde
        console.log(`Value is a:  ${val?.constructor?.name} (${typeof val}; ${val?.toString()})`)

        //Visar hela objektet
        console.log("Value of it:")
        console.dir(val, { depth: null })
    }

    return val
}

//Instansierar en express server
const server = express()

//Säger var nunjucks filerna ligger
njk.configure("views", { express: server })
//Gör så att CSS blir använt av servern
server.use("/style", express.static("style"))

//Gör så att servern kan parsa information genom bodyparser
server.use(bp.urlencoded({ extended: true }))

//Servern tar emot GET requests skickade till "/", grunden av hemsidan
server.get("/", (req, res) => res.render("landing.njk"))

//Servern tar emot en POST via ruten "/play"
server.post("/play", async (req, res) => {
    //Servern kollar bodyn av play
    debug(req.body)

    //Instansierar en player 1 och player 2
    const myPlayer1 = new Player(debug(req.body.player1))
    const myPlayer2 = new Player(debug(req.body.player2))
    //Instansierar ett spel
    game = debug(new Game(myPlayer1.name, myPlayer2.name))
    game.deck = debug(await game.createDeck())
    await game.giveCard(0)
    await game.giveCard(1)
    debug(game.players[0])
    res.render(
        "play.njk",
        {
            image1: game.players[0].card.image,
            player1: game.players[0].name,
            image2: game.players[1].card.image,
            player2 : game.players[1].name,
            showPlayer1Cards: true
        }
    )
})

server.post("/new-card-to-player", async (req, res) => {
    const checkPlayerTurn = game.checkPlayerTurn() 
    await game.giveCard(checkPlayerTurn)
    res.render(
        "play.njk", 
        {
            image1: game.players[0].card.image,
            player1: game.players[0].name,
            image2: game.players[1].card.image,
            player2 : game.players[1].name,
            showPlayer1Cards: game.players[0].turn
        }
    )
})

server.post("/end-turn-for-player", (req, res) => {
    if(game.checkPlayerTurn() == 1){
        game.translateValue()
        let card1 = game.players[0].card.value 
        let card2 = game.players[1].card.value

        if(card1 > card2) {
            db.prepare("INSERT INTO victories (player) VALUES (?)").run(game.players[0].name)
            return res.render(
                "play.njk",
                {
                    image: game.players[0].card.image,
                    player: game.players[0].name,
                    winner : game.players[0].name
                } 
            )
        }  
        
        if(card1 < card2) {
            db.prepare("INSERT INTO victories (player) VALUES (?)").run(game.players[1].name)
            return res.render(
                "play.njk",
                {
                    image: game.players[1].card.image,
                    player: game.players[1].name,
                    winner : game.players[1].name
                }
            )
        }
        
        if(card1 == card2) {
            return res.render(
                "play.njk",
                {
                    winner : "There is no winner"
                }
            )
        }
    }
    game.players[0].turn = false
    game.players[1].turn = true
    
    res.render(
        "play.njk",
        {
            image1: game.players[0].card.image,
            player1: game.players[0].name,
            image2: game.players[1].card.image,
            player2 : game.players[1].name,
            showPlayer1Cards: false
        }
    )
})

server.listen(12345, () => console.log("Server has started!"))