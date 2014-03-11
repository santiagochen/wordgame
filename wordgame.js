/*
 * Word War
 * Santiago Chen made it
 * santiago1209@foxmail.com
 * =========================
 * Parameters
 * this.letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
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
	//this.patten = 1;
	this.letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	this.level = 1;
	this.width = 500;
	this.height = 400;
	
}
//GameMaster functions
GameMaster.prototype = function(){
	var _self = this,_begin = false,_pause = false,_wordbundle = [],
		_gameboard = $('<div class="gameboard"></div>'),
		_useinput = $('<div class="userinput"><span>输入框:</span><input id="wordinput" type="text"/><span>剩余生命:</span><span id="lifenum">10</span><button id="rebtn" class="cbtn">refresh</button><button id="prbtn" class="cbtn">pause</button>'),
		_newstart = $('<div class="newstart">Start A New Game</div>'),
		_playerinput,_rebtn,_lifenum,_prbtn,_wordcreate;
	
	init = function(target){
		var _self =this;
		this.wrap = target||$(document.body);
		this.wrap.append(_gameboard.css({
			width:this.width,
			height:this.height,
		}));
		this.wrap.append(_useinput.css({
			width:this.width
		}));
		_gameboard.append(_newstart);
		
		_lifenum = $('#lifenum');
		_playerinput = $('#wordinput');
		_prbtn = $('#prbtn').attr("disabled",true);
		_rebtn = $('#rebtn').attr("disabled",true);
		_newstart.on("click",function(e){
			start(_self);
		})

		$(window).keyup(function(e){
			checkrword(_playerinput.val())
		})

	}
	restore = function(){
		for(var  m = 0 ; m<_wordbundle.length; m++){
			_wordbundle[m]._el.remove();
		}
		_newstart.show();
		
		_prbtn.attr("disabled",true).html("pause").off("click");
		_rebtn.attr("disabled",true).off("click");
		_begin = false;
		_pause = false;
		clearInterval(_wordcreate);
		
	}
	start = function (domain){
		_newstart.hide();
		_begin = true;
		_pause = false;
		_playerinput.focus();
		_lifenum.html(10);
		
		_rebtn.attr("disabled",false).on("click",function(e){
			restore();
		});
		_prbtn.attr("disabled",false).on("click",function(e){
			$(this).html((_pause==false)?"resume":"pause");
			if(_pause==true){domain.resume();_pause = false;}
			else{domain.pause();_pause = true;}
		});
		
		
		_wordcreate = setInterval(produceword,1000/domain.level*2,domain);
	}

	pause = function (){
		clearInterval(_wordcreate);
		for(var  m = 0 ; m<_wordbundle.length; m++){
			_wordbundle[m].pause();
		}
		
	}
	resume = function (){
		_wordcreate = setInterval(produceword,1000/this.level*2,this);
		for(var  m = 0 ; m<_wordbundle.length; m++){
			_wordbundle[m].resume();
		}
	}
	produceword = function (domain) {
		var _letter=domain.letters[parseInt(Math.random()*domain.letters.length)];
		
		var word = new Word(_letter,domain.level,domain.width,domain.height);
		_gameboard.append(word._el);
		_wordbundle.push(word);
		word._el.on("winword",function(e,data){
			_playerinput.val("");
		});
		word._el.on("loseword",function(e,data){
			var _val = (parseInt(_lifenum.html())-1);
			_lifenum.html(_val);
			if(parseInt(_lifenum.html())==0){
				domain.restore();
			}
			
		});
	
	}
	function checkrword(data){
		for(var  m = 0 ; m<_wordbundle.length; m++){
			_wordbundle[m]._el.trigger("wordinput",data);
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







