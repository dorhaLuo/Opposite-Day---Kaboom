const instructions = [
        "Help the cat navigate in a world where nothing follows convention!",
        "Level 1: Left/Right controls are reversed",
        "Level 2: Up/Down controls are reversed",
        "Level 3: All directions are reversed",
        "Level 4: Controls are delayed",
        "Level 5: Random control changes with each press"
    ];
    
    
    
// types: score, food, danger, portal, jump, left, right
function effects(type){
    
    switch (type) {
      case "jump":
        day = "Sunday";
        break;
      case "left":
        day = "Monday";
        break;
      case "right":
        day = "Tuesday";
        break;
      case "score":
        day = "Wednesday";
        break;
      case "food":
        day = "Thursday";
        break;
      case "danger":
        day = "Thursday";
        break;
      case "portal":
        day = "Thursday";
        break;
      default :
        day = "Friday";
        break;
    }

}