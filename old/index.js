import express    from "express"
import njk        from "nunjucks"
import bp         from "body-parser"
import { Player } from "./backend/game.js"

const server = express()

njk.configure(
    "views",
    {express: server
    }
)

server.use("/style", express.static("style"))
server.use(bp.urlencoded({ extended: true }))

server.get("/", (req, res) => res.render("landing.njk"))


server.post("/play", (req, res) => {
    const player = new Player(req.body.name)
    res.render("play.njk", { player })
})

server.use("/static", express.static("style")),


server.listen(12345,
    () => console.log("Server has started!"))

