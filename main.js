const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

const automata = new Automata();	// Declare as global so restart button can access it

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	
	gameEngine.init(ctx);

	automata.initBoard(ctx);		// Use seperate function to initialize board once ctx is created

	gameEngine.addEntity(automata);

	gameEngine.start();
});
