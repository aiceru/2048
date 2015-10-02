
function GameEngine() {
	this.score = 0;
}

// ----------------------Loop----------------------------------
// Input 대기
//    GameLogic(input) 실행 -> GRID 업데이트
//    GraphicsEngine.draw(grid) 호출, return 대기
//    점수 업데이트, 게임 종료 검사
//       (if true --> GraphicsEngine.drawCongraturation 호출)
//                    break;
// ----------------------Loop--END-----------------------------

GameEngine.prototype.startGame = function() {
	// 3. GRID 초기화 (미리 정의된 GRID status pool에서 불러오든지, 랜덤 생성하든지...)
	// 4. GraphicsEngine.draw(grid) 호출
	gGraphicsEngine.draw(gGrid);
}

GameEngine.prototype.updateGrid = function(input) {
	// Main game update logic
    console.log(input);
    var x;
    var y;
    var new_x = -1;
    var new_y = -1;
    var blank_pos = [];
    switch(input) {
        case "left" :
            for(y = 0; y < 4; y++) {
                for(x = 0; x < 4; x++) {
                    entity = gGrid[convertCood(x,y)];
                    if(entity != null) {
                        entity.merge("right");
                        entity.move(input);
                    }
                }
            }
            new_x = 3;
            for(var i = 0; i < 4; i++) {
                if(gGrid[convertCood(new_x, i)] == null) {
                    blank_pos.push(i);
                }
            }
            break;
        case "right" : 
            for(y = 0; y < 4; y++) {
                for(x = 3; x > -1; x--) {
                    entity = gGrid[convertCood(x,y)];
                    if(entity != null) {
                        entity.merge("left");
                        entity.move(input);
                    }
                }
            }
            new_x = 0;
            for(var i = 0; i < 4; i++) {
                if(gGrid[convertCood(new_x, i)] == null) {
                    blank_pos.push(i);
                }
            }
            break;
        case "up" : 
            for(x = 0; x < 4; x++) {
                for(y = 0; y < 4; y++) {
                    entity = gGrid[convertCood(x,y)];
                    if(entity != null) {
                        entity.merge("down");
                        entity.move(input);
                    }
                }
            }
            new_y = 3;
            for(var i = 0; i < 4; i++) {
                if(gGrid[convertCood(i, new_y)] == null) {
                    blank_pos.push(i);
                }
            }
            break;
        case "down" :
            for(x = 0; x < 4; x++) {
                for(y = 3; y > -1; y--) {
                    entity = gGrid[convertCood(x,y)];
                    if(entity != null) {
                        entity.merge("up");
                        entity.move(input);
                    }
                }
            }
            new_y = 0;
            for(var i = 0; i < 4; i++) {
                if(gGrid[convertCood(i, new_y)] == null) {
                    blank_pos.push(i);
                }
            }
            break;
        default:
            break;
    }

    if(blank_pos.length != 0) {
        if(new_x < 0) {
            new_x = blank_pos[Math.floor(Math.random() * blank_pos.length)];
        }
        else {  // new_y < 0
            new_y = blank_pos[Math.floor(Math.random() * blank_pos.length)];
        }
        gGrid[convertCood(new_x, new_y)] = new Entity(2, new_x, new_y);
        blank_pos.length = 0;
    }

    gGraphicsEngine.draw(gGrid);

    if(gGameEngine.checkFinish() == true) {
        gGraphicsEngine.drawFinish();
    }
}

GameEngine.prototype.checkFinish = function() {
    var x, y;
    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            if( (gGrid[convertCood(i, j)] == null) ||
                (gGrid[convertCood(i+1, j)] == null) ||
                (gGrid[convertCood(i, j+1)] == null) ||
                (gGrid[convertCood(i, j)].number == gGrid[convertCood(i+1, j)].number) ||
                (gGrid[convertCood(i, j)].number == gGrid[convertCood(i, j+1)].number)
            ) {
                return false;
            }
        }
    }
    for(j = 0; j < 3; j++) {
        if( (gGrid[convertCood(3, j)] == null) ||
            (gGrid[convertCood(j, 3)] == null) ||
            (gGrid[convertCood(3, j+1)] == null) ||
            (gGrid[convertCood(j+1, 3)] == null) ||
            (gGrid[convertCood(3, j)].number == gGrid[convertCood(3, j+1)].number) ||
            (gGrid[convertCood(j, 3)].number == gGrid[convertCood(j+1, 3)].number)
        ) {
            return false;
        }
    }
    return true;
}

window.onload = function() {
	console.log("onload!!!");
	gGameEngine = new GameEngine();
    gInputManager = new InputManager();
    gGraphicsEngine = new GraphicsEngine();
	//gGameEngine.startGame();
}



var convertCood = function(x, y) {
    return y * 4 + x;
}

var gGameEngine;
var gGrid = [new Entity(2, 0, 0), new Entity(4, 1, 0), new Entity(2, 2, 0), null,
             null, new Entity(2, 1, 1), null, null,
             null, null, null, null,
             null, null, new Entity(4, 2, 3), new Entity(4, 3, 3)];
