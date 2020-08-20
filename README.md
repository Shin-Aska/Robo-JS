Robo JS Game
===========================================

This game is made as a direct inspiration from an activity
from my master's class in theory of programming languages.
In the activity, we where tasked to create a script base
on the specified op-codes of the robot.

The idea is to game-ify this activity by adding levels
and extra functionalities that the original script did not
have.

[![Game](https://img.youtube.com/vi/RlSc0fsRZg0/0.jpg)](https://www.youtube.com/watch?v=RlSc0fsRZg0E)

How to run example:

    git clone https://github.com/Shin-Aska/Robo-JS.git
    cd Robo-JS
    npm install webpack-cli -g (add sudo if on linux)
    npm install http-server -g (add sudo if on linux)
    npm install
    webpack --config webpack.config.js
    http-server

You can replace http-server with other http server that you wish to use. If you are going to host the project on Apache
You only need to copy the following files and folders:
1. assets
2. sprites
3. build
4. index.html
5. robo.js

The demo runs at [http://127.0.0.1:8080](http://127.0.0.1:8080)

Shout out to Prof. Solomon See from DLSU for the inspiration for this game (Since the idea popped-in during his class)