/**
 * @class Creates cells and calculates which live and die in the Game of Life simulation.
 * 
 * @author Riley Bennett
 */
class Automata {
    /**
     * Initializes the class.
     */
    constructor() {
        this.board = [];
        this.cellSize = 8;
        this.totalTicks = 0;
        this.gameTicks = 0;
        this.cellColor = "White";
        this.backgroundColor = "Black";
    }

    /**
     * Initializes the board of the Game of Life.
     * @param ctx The frame of the game
     */
    initBoard(ctx) {
        this.canvasWidth = ctx.canvas.width;
        this.canvasHeight = ctx.canvas.height;
        this.width = this.canvasWidth / this.cellSize;      // # of horizontal cells
        this.height = this.canvasHeight / this.cellSize;    // # of vertical cells
        this.createBaseBoard(true);
    }

    /**
     * Restarts the simulation.
     */
    restart() {
        this.totalTicks = 0;
        this.gameTicks = 0;
        document.getElementById("tickCounter").innerHTML = "Total Ticks: 0";

        // Slider has values 1-4, so cell size is 4px-16px
        this.cellSize = 4 * document.getElementById("blockSize").value;

        // Calculate new width/height cells with new cell size
        this.width = this.canvasWidth / this.cellSize;
        this.height = this.canvasHeight / this.cellSize;

        // Change cell/background color
        this.cellColor = document.getElementById("cellColor").value;
        this.backgroundColor = document.getElementById("backgroundColor").value;
        document.getElementById("gameWorld").style.backgroundColor = this.backgroundColor;

        // Check which preset is selected
        switch (document.querySelector('input[name=presets]:checked').value) {
            case "random":
                this.createBaseBoard(true);
                break;
            case "presetf":
                this.createFBoard();
                break;
            case "blockEngine":
                this.createBlockBoard();
                break;
            case "blinkShip":
                this.createBlinkShipBoard();
                break;
            case "lightWire":
                this.createWireBoard();
                break;
        }
        
    }

    /**
     * Fills the game board with cells, either randomly or all dead.
     * @param random True if the board should be filled with random numbers, false for no live cells
     */
    createBaseBoard(random) {
        for (let i = 0; i < this.width; i++) {
            this.board[i] = [];     // Inner array is columns of board
            for (let j = 0; j < this.height; j++) {
                if (random) {
                    this.board[i][j] = randomInt(2);    // Fill randomly if param is truthy
                } else {
                    this.board[i][j] = 0;               // Otherwise fill with dead cells
                }
            }
        }
    }

    /**
     * Adds mirrored rows of live cells across a given height and offset.
     * @param startX Column to start adding cells
     * @param endX Column to stop adding cells
     * @param yAxis Row to mirror across
     * @param offset Distance (in rows) between the cell row and the row to mirror across
     */
    mirrorVertical(startX, endX, yAxis, offset) {
        for (let i = startX; i <= endX; i++) {
            this.board[i][yAxis + offset] = 1;  // Add row below mirror line
            this.board[i][yAxis - offset] = 1;  // Add row above mirror line
        }
    }

    /**
     * Creates a board with cells in an "F" structure.
     */
    createFBoard() {
        // Find middle cells to center the structure
        let middleCellX = this.width / 2;
        let middleCellY = this.height / 2;
        this.createBaseBoard(false);

        // Add cells to create the structure
        this.board[middleCellX][middleCellY] = 1;
        this.mirrorVertical(middleCellX, middleCellX, middleCellY, 1);
        this.board[middleCellX - 1][middleCellY] = 1;
        this.board[middleCellX + 1][middleCellY - 1] = 1;

    }

    /**
     * Creates a board with cells in a "Block Engine" structure
     */
    createBlockBoard() {
        // Find middle cells to center the structure
        let middleCellX = this.width / 2;
        let middleCellY = this.height / 2;
        this.createBaseBoard(false);

        // Cells to the right of the center
        for (let i = 7; i < 20; i++) {
            if (i === 14) {
                continue;
            }
            this.board[middleCellX + i][middleCellY] = 1;
        }

        // Cells to the left of the center
        for (let i = 19; i > 5; i--) {
            if (i === 11) {
                continue;
            }
            this.board[middleCellX - i][middleCellY] = 1;
        }

        // Middle cells
        this.board[middleCellX][middleCellY] = 1;
        this.board[middleCellX - 1][middleCellY] = 1;
        this.board[middleCellX - 2][middleCellY] = 1;
    }

    /**
     * Creates a board with cells in a "Blinker Ship" structure.
     */
    createBlinkShipBoard() {
        // Find middle height and rightmost X for structure to fit (it moves left)
        let middleCellY = this.height / 2;
        let maxX = this.width - 5;
        this.createBaseBoard(false);

        // Rightmost circle
        this.board[maxX][middleCellY] = 1;
        this.board[maxX - 2][middleCellY] = 1;
        this.mirrorVertical(maxX - 2, maxX, middleCellY, 1);

        // Right line
        this.board[maxX - 7][middleCellY] = 1;
        this.mirrorVertical(maxX - 7, maxX - 7, middleCellY, 1);

        // Right-middle section of structure
        this.board[maxX - 14][middleCellY] = 1;
        this.mirrorVertical(maxX - 16, maxX - 15, middleCellY, 1);
        this.mirrorVertical(maxX - 18, maxX - 16, middleCellY, 2);

        // Left-middle section of structure
        this.board[maxX - 23][middleCellY] = 1;
        this.board[maxX - 22][middleCellY] = 1;
        this.mirrorVertical(maxX - 22, maxX - 22, middleCellY, 1);
        this.mirrorVertical(maxX - 21, maxX- 20, middleCellY, 2);

        // Upper/lower middle section of structure
        this.mirrorVertical(maxX - 19, maxX - 16, middleCellY, 5);
        this.mirrorVertical(maxX - 19, maxX - 19, middleCellY, 6);
        this.mirrorVertical(maxX - 19, maxX - 19, middleCellY, 7);
        this.mirrorVertical(maxX - 18, maxX - 18, middleCellY, 8);
        this.mirrorVertical(maxX - 15, maxX - 15, middleCellY, 8);
        this.mirrorVertical(maxX - 15, maxX - 15, middleCellY, 6);

        // Leftmost section of structure
        this.mirrorVertical(maxX - 28, maxX - 27, middleCellY, 2);
        this.mirrorVertical(maxX - 26, maxX - 25, middleCellY, 3);
        this.mirrorVertical(maxX - 29, maxX - 28, middleCellY, 3);
        this.mirrorVertical(maxX - 28, maxX - 25, middleCellY, 4);
        this.mirrorVertical(maxX - 27, maxX - 26, middleCellY, 5);
    }

    /**
     * Creates a board with cells in a "Lightspeed Wire" structure.
     */
    createWireBoard() {
        // Find middle cells to center the structure
        let middleCellX = this.width / 2;
        let middleCellY = this.height / 2;
        this.createBaseBoard(false);

        // Outside divets
        for (let i = middleCellX - 29; i <= middleCellX + 28; i += 3) {
            this.mirrorVertical(i, i, middleCellY, 6);
        }
        this.mirrorVertical(middleCellX - 29, middleCellX + 28, middleCellY, 5);

        // Straight walls of structure
        this.mirrorVertical(middleCellX - 31, middleCellX + 30, middleCellY, 3);

        // Inner cells starting from the right
        this.mirrorVertical(middleCellX + 31, middleCellX + 31, middleCellY, 2);
        this.mirrorVertical(middleCellX + 24, middleCellX + 31, middleCellY, 1);
        
        // 2nd rightmost shape
        this.board[middleCellX + 22][middleCellY] = 1;
        this.mirrorVertical(middleCellX + 21, middleCellX + 21, middleCellY, 2);
        this.mirrorVertical(middleCellX + 14, middleCellX + 20, middleCellY, 1);

        // 3rd rightmost shape
        this.mirrorVertical(middleCellX + 10, middleCellX + 10, middleCellY, 2);
        this.board[middleCellX + 9][middleCellY] = 1;
        this.mirrorVertical(middleCellX + 5, middleCellX + 9, middleCellY, 1);

        // 4th rightmost shape (Uneven)
        this.board[middleCellX + 2][middleCellY - 2] = 1;
        this.board[middleCellX + 1][middleCellY + 2] = 1;
        this.board[middleCellX][middleCellY] = 1;
        this.mirrorVertical(middleCellX - 5, middleCellX, middleCellY, 1);
        for (let i = middleCellX - 9; i <= middleCellX - 6; i++) {
            this.board[i][middleCellY - 1] = 1;
        }
        this.board[middleCellX - 8][middleCellY] = 1;
        this.board[middleCellX - 9][middleCellY + 2] = 1;
        this.mirrorVertical(middleCellX - 14, middleCellX - 10, middleCellY, 1);
        
        // 3rd leftmost shape
        this.board[middleCellX - 16][middleCellY] = 1;
        this.board[middleCellX - 17][middleCellY] = 1;
        this.mirrorVertical(middleCellX - 21, middleCellX - 17, middleCellY, 1);

        // 2nd leftmost shape
        this.board[middleCellX - 23][middleCellY] = 1;
        this.board[middleCellX - 24][middleCellY] = 1;
        this.mirrorVertical(middleCellX - 24, middleCellX - 24, middleCellY, 1);

        // Leftmost shape (uneven)
        this.board[middleCellX - 26][middleCellY - 1] = 1;
        this.mirrorVertical(middleCellX - 27, middleCellX - 27, middleCellY, 1);
        this.board[middleCellX - 28][middleCellY] = 1;
        this.board[middleCellX - 28][middleCellY + 1] = 1;
        this.mirrorVertical(middleCellX - 32, middleCellX - 29, middleCellY, 1);
        this.mirrorVertical(middleCellX - 32, middleCellX - 32, middleCellY, 2);
    }

    /**
     * Calculates and returns the number of live cells surrounding the specified cell.
     * @param cellRow The row of the cell to check
     * @param cellCol The column of the cell to check
     * @returns Number of live neighbors
     */
    countNeighbors(cellRow, cellCol) {
        let count = 0;
        // Start from top left
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                // Don't check middle cell or null cells outside game board
                if ((i === 0 && j === 0) || 
                    j + cellCol >= this.width || i + cellRow >= this.height || 
                    j + cellCol < 0 || i + cellRow < 0) {

                    continue;
                }

                // Increase count if this neighbor is alive
                if (this.board[j + cellCol][i + cellRow] === 1) {
                    count++;
                }
            }
        }

        return count;
    }

    /**
     * Updates the game board to the next frame.
     */
    update() {
        this.speed = parseInt(document.getElementById("tickSpeed").value);
        this.totalTicks++;
        // Only update game board on specified increments, pause game when at lowest value
        if (this.totalTicks % this.speed != 0 || this.speed == 61) {
            return;
        }

        // Update displayed game ticks
        this.gameTicks++;
        document.getElementById("tickCounter").innerHTML = "Total Ticks: " + this.gameTicks;

        let nextBoard = [];

        // Create board of next frame
        for (let i = 0; i < this.width; i++) {
            nextBoard[i] = [];
            for (let j = 0; j < this.height; j++) {
                let neighbors = this.countNeighbors(j, i);

                // Kill cell if it has less than 2 or more than 3 live neighbors
                if (this.board[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                    nextBoard[i][j] = 0;             
                // Revive cell if it has 3 neighbors
                } else if (this.board[i][j] === 0 && neighbors === 3) {
                    nextBoard[i][j] = 1;
                // Keep cell the same if it does not satisfy previous conditions
                } else {
                    nextBoard[i][j] = this.board[i][j];
                }
            }
        }
        this.board = nextBoard;
    }

    /**
     * Displays the current board/frame of the game.
     * @param ctx The frame of the game
     * @param game The current game engine (not used in this simulation)
     */
    draw(ctx, game) {
        // Draw cells with specified color
        ctx.fillStyle = this.cellColor;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                // Only draw if cell is alive
                if (this.board[i][j] === 1) {
                    // Cells should be drawn at ith row, jth column, with 1px gap on all sides
                    ctx.fillRect(i * this.cellSize + 1, j * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);
                }
            }
        }
    }
}