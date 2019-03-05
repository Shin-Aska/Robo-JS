var instructions;
var ip = 0;
var instruction;
var opcode;
var data;
var opcodeD;
var dataD;
var time = 0;
var il = 20;
var mem={};

var registers = [0,0,0,0];

var execute = true;
var delay = 100;

var direction = 0;
var locx = 0, locy=0;
var blockSize = 50;
var mapWidth = 10;
var mapHeight = 5;
var map = [[0,4,0,0,0,0,0,0,0,0],
		   [0,0,2,0,0,0,0,0,0,0],
		   [0,0,2,0,0,0,0,0,0,2],
		   [0,0,0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0,0,0]];



var systemMesage;

function drawMap(id) {
	var elem = document.getElementById(id);
	elem.innerHTML = "";
	for(var i=0;i<mapHeight;i++) {
		for(var j=0;j<mapWidth;j++) {
			elem.innerHTML += "<div style=\"text-align: center;vertical-align: middle;line-height: " + blockSize + "px; border: 1px solid black;position:absolute;left:" + (j * blockSize) + ";top:" + (i * blockSize) + ";width:" + blockSize + "px; height:" + blockSize + "px;\">" + map[i][j] + "</div>";
		}
	}
	// Draw the robot
	elem.innerHTML += "<div id=\"robot\" style=\"background:red;text-align: center;vertical-align: middle;line-height: " + blockSize/2 + "px;border-radius:50%; color:white; width:" + blockSize/2 + "px; height:" + blockSize/2 + "px;position:absolute;left:" + (locx * blockSize) + ";top:" + (locy * blockSize) +"\">" + direction + "</div>"
}

var llocx = -1, llocy = -1;

function redrawBotPosition() {
	//var elem = document.getElementById("robot");
	//elem.style.left = locx * blockSize;
	//elem.style.top = locy * blockSize;
	//elem.innerText = direction;

	if (llocx == locx && llocy == locy) {
		setRobotDirection(direction);
	}
	else {
		makeRobotMove(locx, locy);
	}
	llocx = locx;
	llocy = locy;
	console.log([locx, locy, direction])
}



function reloadProgram(ins) {
	instructions = ins;
}

function resetMachine() {
	ip = 0;
	time = 0;
	mem = {};
	registers = [0,0,0,0];
	execute = true;
	direction=0;
	locx=0;
	locy=0;
	llocx = 0;
	llocy = 0;
	setRobotDirection(direction);
	forceRobotMove (locx, locy);
	// Update the screen
	redrawBotPosition();
	showMessage("");
}

function start() {
	//console.log("Processing " + ip);
	instruction = instructions.substring(ip,ip+il);
	//console.log("Instruction: " + instruction);
	opcode = instruction.substring(0,5);
	data = instruction.substring(5);
	ip = ip + il;

	opcodeD = parseInt(opcode, 2);
	dataD = parseInt(data, 2);

	switch (opcodeD) {
		case 0: halt(); break;
		case 1: moveForward(); break;
		case 2: rotateLeft(); break;
		case 3: rotateRight(); break;
		case 4: sense(); break;
		case 5: jump(); break;
		case 6: jumpeq(); break;
		case 7: jumpne(); break;
		case 8: jumpgt(); break;
		case 9: jumplt(); break;
		case 10: jumpgte(); break;
		case 11: jumplte(); break;
		case 12: opadd(); break;
		case 13: opsub(); break;
		case 14: opmult(); break;
		case 15: readmem(); break;
		case 16: writemem(); break;
		case 17: setreg(); break;
		default: execute = false;
	}

	redrawBotPosition();

	time++;

	if (execute) {
		setTimeout(function() {
			start();
			}, delay);
	}
}

function showMessage(str) {
	systemMessage = str;
	console.log(str);
	document.getElementById("message").innerText = str;
}

function halt() {
	execute = false;
	showMessage("System halted by user");
}

function moveForward() {
	switch(direction) {
		case 0: 
			if (locy > 0) {
				locy = locy - 1;
			} else {
				execute = false;
				showMessage("Robot fell off the grid");
			}
			break;
		case 2: 
			if (locy < mapHeight - 1) {
				locy = locy + 1;
			} else {
				execute = false;
				showMessage("Robot fell off the grid");
			}
			break;
		case 1: 
			if (locx < mapWidth -1) {
				locx = locx + 1;
			} else {
				execute = false;
				showMessage("Robot fell off the grid");
			}
			break;
		case 3: 
			if (locx > 0) {
				locx = locx - 1;
			} else {
				execute = false;
				showMessage("Robot fell off the grid");
			}
			break;
	}
}

function rotateLeft() {
	direction--;
	if (direction < 0)
		direction = 3;
}

function rotateRight() {
	direction++;
	if (direction > 3)
		direction = 0;
}

function sense() {
	if (dataD > 3) {
		execute = false;
		showMessage("Register out of range");
		return;
	}

	switch(direction) {
		case 0: 
			if (locy > 0) {
				registers[dataD] = map[locy - 1][locx];
			} else {
				registers[dataD] = 2;
			}
			break;
		case 2: 
			if (locy < mapHeight - 1) {
				registers[dataD] = map[locy + 1][locx];
			} else {
				registers[dataD] = 2;
			}
			break;
		case 1: 
			if (locx < mapWidth -1) {
				registers[dataD] = map[locy][locx + 1];
			} else {
				registers[dataD] = 2;
			}
			break;
		case 3: 
			if (locx > 0) {
				registers[dataD] = map[locy][locx - 1];
			} else {
				registers[dataD] = 2;
			}
			break;
	}
}

function jump() {
	ip = dataD * il;
}
function jumpeq() {
	var registerLocation = parseInt(data.substring(0,2),2);
	var jumpAddress = parseInt(data.substring(2),2);
	if (registers[registerLocation] == 0)
		ip = jumpAddress * il;
}
function jumpne() {
	var registerLocation = parseInt(data.substring(0,2),2);
	var jumpAddress = parseInt(data.substring(2),2);
	if (registers[registerLocation] != 0)
		ip = jumpAddress * il;
}
function jumpgt() {
	var registerLocation = parseInt(data.substring(0,2),2);
	var jumpAddress = parseInt(data.substring(2),2);
	if (registers[registerLocation] > 0)
		ip = jumpAddress * il;
}
function jumplt() {
	var registerLocation = parseInt(data.substring(0,2),2);
	var jumpAddress = parseInt(data.substring(2),2);
	if (registers[registerLocation] < 0)
		ip = jumpAddress * il;
}
function jumpgte() {
	var registerLocation = parseInt(data.substring(0,2),2);
	var jumpAddress = parseInt(data.substring(2),2);
	if (registers[registerLocation] >= 0)
		ip = jumpAddress * il;
}
function jumplte() {
	var registerLocation = parseInt(data.substring(0,2),2);
	var jumpAddress = parseInt(data.substring(2),2);
	if (registers[registerLocation] <= 0)
		ip = jumpAddress * il;
}
function opadd() {
	var registerLocation1 = parseInt(data.substring(0,2),2);
	var registerLocation2 = parseInt(data.substring(2,4),2);
	var registerLocation3 = parseInt(data.substring(4,6),2);

	registers[registerLocation3] = registers[registerLocation1] + registers[registerLocation2]
}
function opsub() {
	var registerLocation1 = parseInt(data.substring(0,2),2);
	var registerLocation2 = parseInt(data.substring(2,4),2);
	var registerLocation3 = parseInt(data.substring(4,6),2);

	registers[registerLocation3] = registers[registerLocation1] - registers[registerLocation2]	
}
function opmult() {
	var registerLocation1 = parseInt(data.substring(0,2),2);
	var registerLocation2 = parseInt(data.substring(2,4),2);
	var registerLocation3 = parseInt(data.substring(4,6),2);

	registers[registerLocation3] = registers[registerLocation1] * registers[registerLocation2]
}
function readmem() {
	var registerLocation = parseInt(data.substring(0,2),2);
	var memLocation = parseInt(data.substring(2),2);
	if (mem[memLocation]) {
		registers[registerLocation] = mem[memLocation];
	} else {
		registers[registerLocation] = 0;
	}
}
function writemem() {
	var registerLocation = parseInt(data.substring(0,2),2);
	var memLocation = parseInt(data.substring(2),2);
	mem[memLocation] = registers[registerLocation];
}
function setreg() {
	var registerLocation = parseInt(data.substring(0,2),2);
	var constant = parseInt(data.substring(2),2);
	registers[registerLocation] = constant;	
}