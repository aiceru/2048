function GraphicsEngine() {
	this.canvas = document.getElementById("myCanvas");
	this.ctx = this.canvas.getContext("2d");
	
	this.ctx.font="40px Arial";

	xhrGet("./numbersjson.json", function(json) {
		var numSpriteSheet = new SpriteSheetClass();
		numSpriteSheet.load("numbersSprite.png", json);
	});
}

GraphicsEngine.prototype.draw = function(grid) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	for (var i = grid.length - 1; i >= 0; i--) {
        if(grid[i] != null)	this.drawEntity(grid[i]);
	}
	this.ctx.beginPath();
	for( i = 1; i < 4; i++ ) {
		this.ctx.moveTo(i * 150, 0);
		this.ctx.lineTo(i * 150, 600);
		this.ctx.moveTo(0, i * 150);
		this.ctx.lineTo(600, i * 150);
	}

	this.ctx.stroke();
}

GraphicsEngine.prototype.drawEntity = function(entity) {
	var num = entity.number;
	var digits = 0;
	var to_draw = [];
	while(num > 0) {
		to_draw.push(num % 10);
		num = Math.floor(num / 10);
		digits += 1;
	}

	var posX = entity.posX * 150 + 75;
	var posY = entity.posY * 150 + 75;
	var width = Math.floor(80/digits);
	var height = 90;
	for(var i = 0; i < digits; i++) {
		drawSprite("img_" + to_draw.pop().toString(), posX, posY, width, height);
		posX = posX + width;
	}
}

GraphicsEngine.prototype.drawFinish = function() {
	this.ctx.fillText("FINISH!!", 150, 250);
}

var gGraphicsEngine;

var gSpriteSheets = {};

SpriteSheetClass = Class.extend({

    img: null,
    url: "",

    sprites: [],

    init: function () {},

    load: function (imgName, jsonFile) {
        this.url = imgName;
		var img = new Image();
        img.src = imgName;

        this.img = img;
        
        gSpriteSheets[imgName] = this;
        gSpriteSheets[imgName].parseAtlasDefinition(jsonFile);

        this.img.onload = function() {
            gGameEngine.startGame();
        }
    },

    defSprite: function (name, x, y, w, h, cx, cy) {
        var spt = {
            "id": name,
            "x": x,
            "y": y,
            "w": w,
            "h": h,
            "cx": cx === null ? 0 : cx,
            "cy": cy === null ? 0 : cy
        };
        this.sprites.push(spt);
    },

    parseAtlasDefinition: function (atlasJSON) {
        var parsed = JSON.parse(atlasJSON);

        for(var key in parsed.frames) {
            var sprite = parsed.frames[key];
            var cx = -sprite.frame.w * 0.5;
            var cy = -sprite.frame.h * 0.5;

            this.defSprite(key, sprite.frame.x, sprite.frame.y, sprite.frame.w, sprite.frame.h, cx, cy);
        }
    },

    getStats: function (name) {
        for(var i = 0; i < this.sprites.length; i++) {
            if(this.sprites[i].id === name) {
                return this.sprites[i];
            }
        }
        return null;
    }

});

function drawSprite(spritename, posX, posY, w, h) {
    for(var sheetName in gSpriteSheets) {
        var sheet = gSpriteSheets[sheetName];
        var sprite = sheet.getStats(spritename);
        if(sprite === null) {
            continue;
        }

        __drawSpriteInternal(sprite, sheet, posX, posY, w, h);
        return;
    }
}

function __drawSpriteInternal(spt, sheet, posX, posY, w, h) {
    if (spt === null || sheet === null) {
        return;
    }

    var canvasObj = document.getElementById("myCanvas");
    var ctx = canvasObj.getContext('2d');

    if(w != null && h != null) {
    	ctx.drawImage(sheet.img, spt.x, spt.y, spt.w, spt.h, posX - w/2, posY - h/2, w, h);
    }
    else {
    	ctx.drawImage(sheet.img, spt.x, spt.y, spt.w, spt.h, posX + spt.cx, posY + spt.cy, spt.w <= 150? spt.w : 150, spt.h <= 150? spt.h : 150);
    }
}