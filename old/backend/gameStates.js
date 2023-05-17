let gameStates = []

function createGame() {
    // gameStates.push(new GameState())
}

function Game(gameID) {
    return gameStates.find(state => state.gameID === gameID)
}