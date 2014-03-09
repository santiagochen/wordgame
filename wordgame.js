/*
 * Word War
 * Santiago Chen made it
 * santiago1209@foxmail.com
 * =========================
 * Parameters
 * this.letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
 * this._begin = false;
 * this._pause = false;
 * this.level = 1;
 * this.width = 500;
 * this.height = 400;
 * =========================
*/

/*
 *Word Class
 */
function Word(content,speedlevel,boardwidth,boardheight){
	var _self = this;
	this.posy = -10;
	this.content = content;
	this.speedlevel = speedlevel;
	this.boardheight = boardheight;
	this.posxrandom = Math.random();
	this._el =  $("<p></p>").html(this.content).css({
		position:"absolute",
		left:-999,
		top:this.posy
	});

	this.updateposx = function(){
		_self.posy+=_self._el.height();

		_self._el.css({
			top : _self.posy,
			left: parseInt(_self.posxrandom*(boardwidth-_self._el.width()))
		});
		if(_self._el.offset().top>_self.boardheight){
			//lifenum cut down
			_self._el.trigger("loseword", _self);
			_self._el.remove();
			
			//clearInterval(Timer.word);
		}
	}
	this._el.on("wordinput",function(e,data){
		if(data==_self.content) {
			_self._el.trigger("winword", _self);
			_self._el.animate({
				opacity: 0,
				top: "-=20"
			},500,function(){
				_self._el.remove();
			})
			

		}
	})
	this.interval = setInterval(this.updateposx,1000/this.speedlevel);
	return this;
}
Word.prototype = function(){
	resume = function(){
		this.interval = setInterval(this.updateposx,1000/this.speedlevel);
	}
	pause = function(){
		clearInterval(this.interval);

	}
	return {
		resume:resume,
		pause:pause
	}
}()

/*
 * GameMaster Class Singleton
 */
function GameMaster() {
	//GameMaster parameters
	this.patten = 1;
	this.letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	this._begin = false;
	this._pause = false;
	this.level = 1;
	this.width = 500;
	this.height = 400;
	this.wordbundle = [];
	this.gameboard = $('<div class="gameboard"></div>');
	this.useinput = $('<div class="userinput"><span>输入框:</span><input id="wordinput" type="text"/><span>剩余生命:</span><span id="lifenum">10</span><button id="rebtn" class="cbtn">refresh</button><button id="prbtn" class="cbtn">pause</button>');
	this.newstart = $('<div class="newstart">Start A New Game</div>');
}
//GameMaster functions
GameMaster.prototype = function(){
	var _self = this;
	
	init = function(domain,target){
		this.wrap = target||$(document.body);
		this.wrap.append(this.gameboard.css({
			width:this.width,
			height:this.height,
		}));
		this.wrap.append(this.useinput.css({
			width:this.width
		}));
		this.gameboard.append(this.newstart);
		this.playerinput = $('#wordinput');
		this.lifenum = $('#lifenum');
		this.rebtn = $('#rebtn');
		this.prbtn = $('#prbtn').attr("disabled",true);
		this.rebtn = $('#rebtn').attr("disabled",true);
		this.newstart.on("click",function(e){
			domain.start(domain);
		})

		$(window).keyup(function(e){
			domain.checkrword(domain.playerinput.val())
		})

	}
	restore = function(){
		for(var  m = 0 ; m<this.wordbundle.length; m++){
			this.wordbundle[m]._el.remove();
		}
		this.newstart.show();
		
		this.prbtn.attr("disabled",true).html("pause").off("click");
		this.rebtn.attr("disabled",true).off("click");
		this._begin = false;
		this._pause = false;
		clearInterval(this.wordcreate);
		
	}
	start = function (domain){
		this.newstart.hide()
		this._begin = true;
		this._pause = false;
		this.playerinput.focus();
		this.lifenum = $('#lifenum').html(10);
		this.rebtn.attr("disabled",false).on("click",function(e){
			if(domain)domain.restore();
		});
		this.prbtn.attr("disabled",false).on("click",function(e){
			$(this).html((domain._pause==false)?"resume":"pause");
			if(domain._pause==true){domain.resume();domain._pause = false;}
			else{domain.pause();domain._pause = true;}
		});
		
		
		this.wordcreate = setInterval(produceword,1000/this.level*2,this);

	}

	pause = function (){
		//this._pause = false;
		clearInterval(this.wordcreate);
		for(var  m = 0 ; m<this.wordbundle.length; m++){
			this.wordbundle[m].pause();
		}
		
	}
	resume = function (){
		this.wordcreate = setInterval(produceword,1000/this.level*2,this);
		for(var  m = 0 ; m<this.wordbundle.length; m++){
			this.wordbundle[m].resume();
		}
	}
	produceword = function (domain) {
		//var r = parseInt(Math.random()*10);
		//if(r<5){}
		//parseInt(Math.random()*26)
		var _letter=domain.letters[parseInt(Math.random()*domain.letters.length)];
		/*for(var x=0; x<domain.patten; x++){
			_letter += domain.letters[parseInt(Math.random()*26)]
		}*/
		
		var word = new Word(_letter,domain.level,domain.width,domain.height);
		domain.gameboard.append(word._el);
		domain.wordbundle.push(word);
		word._el.on("winword",function(e,data){
			domain.playerinput.val("");
		});
		word._el.on("loseword",function(e,data){
			var _val = (parseInt(domain.lifenum.html())-1);
			domain.lifenum.html(_val);
			if(parseInt(domain.lifenum.html())==0){
				domain.restore();
			}
			
		});
	
	}
	function checkrword(data){
		for(var  m = 0 ; m<this.wordbundle.length; m++){
			this.wordbundle[m]._el.trigger("wordinput",data);
		}
	}

	return{
		init:init,
		start:start,
		pause:pause,
		resume:resume,
		checkrword:checkrword,
		restore:restore
	}
}()







