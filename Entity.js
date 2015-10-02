function Entity(num, x, y) {
	this.number = num;
	this.posX = x;
	this.posY = y;
}

Entity.prototype.move = function(direction) {
    var wall = 3;
    var old_x = this.posX;
    var old_y = this.posY;
    switch(direction) {
        case "right" :
            while( (this.posX < wall) && (this.posX >= 0) && (gGrid[convertCood(this.posX+1, this.posY)] == null) )
                this.posX += 1;
            break;
        case "left" :
            while( (this.posX <= wall) && (this.posX > 0) && (gGrid[convertCood(this.posX-1, this.posY)] == null) )
                this.posX -= 1;
            break;
        case "up" :
            while( (this.posY <= wall) && (this.posY > 0) && (gGrid[convertCood(this.posX, this.posY-1)] == null) )
                this.posY -= 1;
            break;
        case "down" :
            while( (this.posY < wall) && (this.posY >= 0) && (gGrid[convertCood(this.posX, this.posY+1)] == null) )
                this.posY += 1;
            break;
    }
    if(old_x != this.posX || old_y != this.posY) {
        gGrid[convertCood(old_x, old_y)] = null;
        gGrid[convertCood(this.posX, this.posY)] = this;
    }
}

Entity.prototype.merge = function(to_merge) {
    var wall = 3;
    var to_find;
    switch(to_merge) {
        case "right" :
            to_find = this.posX+1;
            while( (to_find <= wall) && (gGrid[convertCood(to_find, this.posY)] == null) )
                to_find += 1;
            if(to_find <= wall && gGrid[convertCood(to_find, this.posY)].number == this.number) {
                this.number *= 2;
                gGrid[convertCood(to_find, this.posY)] = null;
            }
            break;
        case "left" :
            to_find = this.posX-1;
            while( (to_find >= 0) && (gGrid[convertCood(to_find, this.posY)] == null) )
                to_find -= 1;
            if(to_find >= 0 && gGrid[convertCood(to_find, this.posY)].number == this.number) {
                this.number *= 2;
                gGrid[convertCood(to_find, this.posY)] = null;
            }
            break;
        case "up" :
            to_find = this.posY-1;
            while( (to_find >= 0) && (gGrid[convertCood(this.posX, to_find)] == null) )
                to_find -= 1;
            if(to_find >= 0 && gGrid[convertCood(this.posX, to_find)].number == this.number) {
                this.number *= 2;
                gGrid[convertCood(this.posX, to_find)] = null;
            }
            break;
        case "down" :
            to_find = this.posY+1;
            while( (to_find <= wall) && (gGrid[convertCood(this.posX, to_find)] == null) )
                to_find += 1;
            if(to_find <= wall && gGrid[convertCood(this.posX, to_find)].number == this.number) {
                this.number *= 2;
                gGrid[convertCood(this.posX, to_find)] = null;
            }
        default:
            break;
    }
}