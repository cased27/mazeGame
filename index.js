const { Engine, Render, Runner, World, Bodies } = Matter;

//square maze prefered for ease in auto-creation
const width = 600;
const height = 600;
const cells = 3;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element : document.body,
	engine  : engine,
	options : {
		wireframes : true,
		width,
		height
	}
});
Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
	Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, 40, height, { isStatic: true })
];
World.add(world, walls);

//maze generation
const shuffle = (arr) => {
	let counter = arr.length;
	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);
		counter--;
		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}
	return arr;
};

// the first Array(3) determines how many rows; the 2nd determines the columns (this allows them to change independently T/F)
const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));
const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));
const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
	//If cell already visited, return
	if (grid[row][column]) {
		return;
	}
	//otherwise mark cell as visited (update cell to 'true')
	grid[row][column] = true;
	//Assemble randomly ordered list of neighboring cells
	const neighbors = shuffle([
		[ row - 1, column, 'up' ],
		[ row, column + 1, 'right' ],
		[ row + 1, column, 'down' ],
		[ row, column - 1, 'left' ]
	]);

	//for each neighbor cell:
	for (let neighbor of neighbors) {
		const [ nextRow, nextColumn, direction ] = neighbor;
		//see if neighbor is out of bounds
		if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
			continue;
		}
		//if visited, ctn to next neighbor
		if (grid[nextRow][nextColumn]) {
			continue;
		}
		//remove wall from either horizontals or verticals array
		if (direction === 'left') {
			verticals[row][column - 1] = true;
		} else if (direction === 'right') {
			verticals[row][column] = true;
		} else if (direction === 'up') {
			horizontals[row - 1][column] = true;
		} else if (direction === 'down') {
			horizontals[row][column] = true;
		}
	}
	//visit chosen cell (call stepThroughCell func again)
};

stepThroughCell(startRow, startColumn);
