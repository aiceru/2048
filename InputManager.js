function InputManager() {
    window.addEventListener("keydown", this.handle, false);
}

InputManager.prototype.handle = function(event) {
    var input = null;
    switch(event.keyCode) {
        case 37:
            input = "left";
            break;
        case 38:
            input = "up";
            break;
        case 39:
            input = "right"
            break;
        case 40:
            input = "down"
            break;
        default:
            // imvalid input, do nothing
            break;
    }
    if(input) gGameEngine.updateGrid(input);
}

var gInputManager;
