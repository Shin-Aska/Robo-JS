import 'phaser';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1280,
    height: 720,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    antialias: true,
    pixelArt: true
};

var game = new Phaser.Game(config);
var robot;

function preload()
{
    this.load.multiatlas('space', 'assets/space.json', "assets");
    this.load.multiatlas('cityscene', 'assets/cityscene.json', "assets");
    this.load.multiatlas('robot', 'sprites/robot.json', 'sprites');
    this.load.multiatlas('player', 'sprites/player.json', 'sprites');
}

function create()
{
    var background = this.add.sprite(0, 0, 'space', 'space.jpg');


    robot = this.add.sprite(0, 400, 'player', 'sideview/001.png');
    robot.setScale(4, 4);

    
    var robotSideViewIdleFrames = this.anims.generateFrameNames('player', { start: 1, end: 1, zeroPad: 3, prefix:'sideview-standby/', suffix:'.png' });
    var robotNorthIdleFrames = this.anims.generateFrameNames('player', { start: 1, end: 1, zeroPad: 3, prefix:'standby-north/', suffix:'.png' });
    var robotSouthIdleFrames = this.anims.generateFrameNames('player', { start: 1, end: 1, zeroPad: 3, prefix:'standby-south/', suffix:'.png' });

    var robotRunSideViewFrames = this.anims.generateFrameNames('player', { start: 1, end: 4, zeroPad: 3, prefix:'sideview/', suffix:'.png' });

    var robotRunNorthFrames = this.anims.generateFrameNames('player', { start: 1, end: 3, zeroPad: 3, prefix:'north/', suffix:'.png' });
    var robotRunSouthFrames = this.anims.generateFrameNames('player', { start: 1, end: 3, zeroPad: 3, prefix:'south/', suffix:'.png' });
    this.anims.create({ key: 'idle-sideview', frames: robotSideViewIdleFrames, frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'idle-north', frames: robotNorthIdleFrames, frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'idle-south', frames: robotSouthIdleFrames, frameRate: 6, repeat: -1 });

    this.anims.create({ key: 'sideview', frames: robotRunSideViewFrames, frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'north', frames: robotRunNorthFrames, frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'south', frames: robotRunSouthFrames, frameRate: 6, repeat: -1 });
    robot.anims.play('idle-sideview');
    robot.x = 500;

    robot.isRunning = false;
    robot.directed = false;
    robot.directedCoordinates = [];
    robot.direction = "NONE";
    
    this.input.keyboard.on('keydown-RIGHT', function (event) {
        robot.isRunning = true;
        if (robot.direction == "NONE") {
            robot.anims.play('sideview');
            robot.setScale(4, 4);
        }
        robot.direction = "RIGHT";
    });
    this.input.keyboard.on('keyup-RIGHT', function (event) {
        robot.isRunning = false;
        if (robot.direction != "NONE") {
            robot.anims.play('idle-sideview');
        }
        robot.direction = "NONE";
    });

    this.input.keyboard.on('keydown-LEFT', function (event) {
        robot.isRunning = true;
        if (robot.direction == "NONE") {
            robot.anims.play('sideview');
            robot.setScale(-4, 4);
        }
        robot.direction = "LEFT";
    });
    this.input.keyboard.on('keyup-LEFT', function (event) {
        robot.isRunning = false;
        if (robot.direction != "NONE") {
            robot.anims.play('idle-sideview');
            robot.setScale(-4, 4);
        }
        robot.direction = "NONE";
    });

    this.input.keyboard.on("keydown-UP", function (event) {
        robot.isRunning = true;
        if (robot.direction == "NONE") {
            robot.anims.play('north');
            robot.setScale(4, 4);
        }
        robot.direction = "UP";
    });

    this.input.keyboard.on("keyup-UP", function (event) {
        robot.isRunning = false;
        if (robot.direction != "NONE") {
            robot.anims.play('idle-north');
            robot.setScale(4, 4);
        }
        robot.direction = "NONE";
    });

    this.input.keyboard.on("keydown-DOWN", function (event) {
        robot.isRunning = true;
        if (robot.direction == "NONE") {
            robot.anims.play('south');
            robot.setScale(4, 4);
        }
        robot.direction = "DOWN";
    });

    this.input.keyboard.on("keyup-DOWN", function (event) {
        robot.isRunning = false;
        if (robot.direction != "NONE") {
            robot.anims.play('idle-south');
            robot.setScale(4, 4);
        }
        robot.direction = "NONE";
    });
}

function update(time, delta)
{
    if (robot.isRunning){
        
        if (robot.direction == "RIGHT") {
            robot.x += delta/8;
            if(robot.x > 800)
            {
                robot.x = -50;
            }
        }
        else if (robot.direction == "LEFT") {
            robot.x -= delta/8;
            if(robot.x < 0)
            {
                robot.x = 850;
            }
        }
    }

    if (robot.directed) {

        if (robot.x != robot.directedCoordinates[0] || robot.y != robot.directedCoordinates[1]) {

            if (robot.y > robot.directedCoordinates[1]) {
                if (robot.direction == "NONE") {
                    robot.anims.play("north");
                    robot.direction = "NORTH";
                }
                if (robot.y - delta/8 <= robot.directedCoordinates[1]) {
                    robot.y = robot.directedCoordinates[1];
                }
                else {
                    robot.y -= delta/8;
                }
            }
            else if (robot.y < robot.directedCoordinates[1]) {
                if (robot.direction == "NONE") {
                    robot.anims.play("south");
                    robot.direction = "SOUTH";
                }
                if (robot.y + delta/8 >= robot.directedCoordinates[1]) {
                    robot.y = robot.directedCoordinates[1];
                }
                else {
                    robot.y += delta/8;
                }
            }
            else {
                if (robot.x != robot.directedCoordinates[0] && robot.direction != "LEFT" && robot.direction != "RIGHT") {
                    robot.direction = "NONE";
                }
            }
            
            if (robot.x > robot.directedCoordinates[0]) {
                if (robot.direction == "NONE") {
                    robot.anims.play("sideview");
                    robot.direction = "LEFT";
                    robot.setScale(-4, 4);
                }
                if (robot.x - delta/8 <= robot.directedCoordinates[0]) {
                    robot.x = robot.directedCoordinates[0];
                }
                else {
                    robot.x -= delta/8;
                }
            }
            else if (robot.x <= robot.directedCoordinates[0]) {
                if (robot.direction == "NONE") {
                    robot.anims.play("sideview");
                    robot.direction = "RIGHT";
                    robot.setScale(4, 4);
                }
                if (robot.x + delta/8 >= robot.directedCoordinates[0]) {
                    robot.x = robot.directedCoordinates[0];
                }
                else {
                    robot.x += delta/8;
                }
            }
        }
        else {

            if (robot.direction != "NONE") {
                if (robot.direction != "LEFT" && robot.direction != "RIGHT") {
                    robot.anims.play("idle-" + robot.direction.toLowerCase());
                }
                else {
                    robot.anims.play("idle-sideview");
                    if (robot.direction == "LEFT") {
                        robot.setScale(-4, 4);
                    }
                    else {
                        robot.setScale(4, 4);
                    }
                }
                robot.direction = "NONE";
                robot.directed = false;
            }
        }
    }
}


function setDirection(robot, x, y) {
    robot.directedCoordinates[0] = x;
    robot.directedCoordinates[1] = y;
    robot.directed = true;
}

global.makeRobotMove = function(x, y) {
    setDirection(robot, x, y);
}