Word Game

=========

A simple word game in the way of OOP, with Plugin of Jquery.

HOW TO GAME?

var game = new GameMaster();

game.init();

The Exposured Parameters:

//By setting this, you could decide what content you'd like to play with, also as Array; 

game.letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]; 

//By setting this, you could decide how fast the game performs as you like; 

game.level = 1; 

//By setting the width and height, you could customize what size the board is; 

game.width = 500;
game.height = 400;

//By set the param, you decide where you put the game into;

game.init({somewhere}); 