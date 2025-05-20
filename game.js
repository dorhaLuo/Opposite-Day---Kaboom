// Start game
// kaboom()
kaboom({
	width: window.innerWidth,
	height: window.innerHeight,
	background: [245, 216, 206], // Light blue sky color (R, G, B)
	font: "sink",
	scale: 1,
	fullscreen: false//true, // Optional, can set true if you want true fullscreen
})


// Load assets

loadSound("bgm", "https://codehs.com/uploads/faa40002deba6ba708a8b0b306515523")
loadSound("score", "https://codehs.com/uploads/76b656cc78524cb75aee74321e8da9a9")
loadSound("portal", "https://codehs.com/uploads/735d28cb4e752766a61c6ab0d27ab6b7")
loadSound("screech", "https://codehs.com/uploads/00759de459654ef6841611c72e86345a")
loadSound("munch", "https://codehs.com/uploads/2ea0dd7d89cc1deed35c1e017f2d214b")



loadSprite("cat", "https://codehs.com/uploads/dda65f8e518c5d863b404eebb04469c4");
loadSprite("cat-idle", "https://codehs.com/uploads/d5ebfdf90a879a51d815f5d1b3748e12");
loadSprite("cat-run", "https://codehs.com/uploads/3e2a0ad55931431cec375796bd4b7be9");
loadSprite("goal", "https://codehs.com/uploads/566ed6cd252b069f132487dc8e794440");
loadSprite("block", "https://codehs.com/uploads/11dbe87fcd1e50efaeb2519581cbb95c");
loadSprite("water", "https://codehs.com/uploads/d6c4cfdc20925ecd5b1d551dfae1497e")
loadSprite("fish", "https://codehs.com/uploads/22c6cf90877808a57e600fedefba4fb1");


loadSprite("door", "https://codehs.com/uploads/e6ccd6488a34acbdc28492e3ab626d08");
loadSprite("key", "https://codehs.com/uploads/58c006fe9ba0e75cc5431018dff55d79");
loadSprite("bg-layer1", "https://codehs.com/uploads/8f91dd85950df1a05899ed6cada690a7");




// Loading a multi-frame sprite
loadSprite("cat-sprite", "https://codehs.com/uploads/fb465904e9208aa4cac658cf39a415e2", {
	// The image contains 9 frames layed out horizontally, slice it into individual frames
	sliceX:11,

	// Define animations
	anims: {
		"idle": 6,
		"run": {
			from: 0,
			to: 9,
			speed: 20,
			loop: true,
		},
		// This animation only has 1 frame
		"jump": 8,
	},
})


function effects(type, player, object = null, position = (0,0), txtLebel=null){
    
    switch (type) {
      case "jump":
        if (player.isGrounded() || levelCount == 2) {
			player.jump(spaceCtrl[levelCount]*JUMPPOWER)
			player.play("jump")
		}
        break;
      case "left":
        player.move(-SPEED, 0)
		player.flipX = true
		player.play("run")
        break;
      case "right":
        player.move(SPEED, 0)
		player.flipX = false
		player.play("run")
        break;
      case "score": // aka key
        destroy(object)
		play("score")
		hasK = true
		//hasKLabel.text = "Key: YES"
      case "food":
        // eat the fish
		destroy(object)
		play("munch")
		HungerIDX++
		//hungerIdxLabel.text = "Food: " + HungerIDX
        break;
      case "danger":
        // cat's reaction
		play("screech")
		// getting out of the water makes the cat hungrier
		HungerIDX--
		
		player.pos = position
		// Go to "lose" scene when we hit a "danger"
		go("die")
        break;
      case "portal":
        if (hasK){
            play("portal")
    		levelCount++
    		if (levelCount < LEVELS.length - 1) {
    			// If there's a next level, go() to the same scene but load the next level
    			go("game", {
    				hungerIdx: HungerIDX,
    			})
    		} else {
    			// Otherwise we have reached the end of game, go to "win" scene!
    			go("win")
    		}
	    }
        break;
      default :
        day = "Friday";
        break;
    }

}



const TILE_COLUMNS = 25; // tiles horizontally
const TILE_ROWS = 16;    // tiles vertically

// Compute scale based on window size
const SCALE = Math.min(
	width() / (64 * TILE_COLUMNS),
	height() / (64 * TILE_ROWS)
);


//const SCALE = 1//48/64
const SPEED = 480 * SCALE
const JUMPPOWER = 1000
let levelCount = 0
let HungerIDX = 5
let hasK = false

const spaceCtrl = [1,1.5,1.3,1.1,1.2]
const leftCtrl = []
const rightCtrl = []


setGravity(2400)


const COLORS = {
    backBtn: [255, 255, 255],
    goal: [80, 70, 120],
    block: [80, 70, 120],
    spike: [230, 60, 60],
    background: [12, 12, 20],
    door: [139, 69, 19],
    key: [255, 215, 0],
    text: [12, 12, 20],
    highlight: [147, 112, 219] // Light purple
};

//
const LeftControls = [
    ["left"],
    ["left"],
    ["right"],
    ["left"],
    ["right"]
]

const RightControls = [
    ["right"],
    ["right"],
    ["left"],
    ["right"],
    ["left"]
]




// Design 2 levels
const LEVELS = [
	[
		"=========================",
	    "=                       =",
	    "=                       =",
	    "=                       =",
	    "=         g             =",
	    "=        ===            =",
	    "=    k                  =",
	    "=   ===         ==      =",
	    "=                       =",
	    "=            g          =",
	    "=            ==^^^==    =",
	    "=      >                =",
	    "=     ===               =",
	    "=p                      =",
	    "=========================",
	    "=========================",
	],
	[//2
		"=========================",
		"=                       =",
		"=                       =",
	    "=    g                  =",
	    "=   ===                 =",
	    "=                       =",
	    "=          ^  ^  ^      =",
	    "=        ===========    =",
	    "=                       =",
	    "=                       =",
	    "=           k           =",
	    "=          ===          =",
	    "=                       =",
	    "=p                      =",
	    "=====    >    ===========",
	    "=========================",
	    "=========================",
	],
	[//3
		//"=========================",
	    "=                       =",
	    "=                       =",
	    "=                       =",
	    "=                       =",
	    "=      ^                =",
	    "=     ===   ^   ^       =",
	    "=           ===== g     =",
	    "=                 ===   =",
	    "=        ^              =",
	    "=       ===      k      =",
	    "=p                ====  =",
	    "=    ^       >          =",
	    "=========================",
	    "=========================",
	    "=========================",
	],
	[
		"=========================",
	    "=                       =",
	    "=                       =",
	    "=                       =",
	    "=  g                    =",
	    "=  ===      ^           =",
	    "=          ===          =",
	    "=     ^                 =",
	    "=    ===                =",
	    "=           ^           =",
	    "=       k  ===          =",
	    "=      ===              =",
	    "=        ^              =",
	    "=p      ===  >          =",
	    "======     ===     ======",
	    "=========================",
	],
	[
		"=========================",
	    "=                       =",
	    "=   ^                   =",
	    "=  ===                  =",
	    "=                       =",
	    "=        ^              =",
	    "=       ===   k         =",
	    "=              ===      =",
	    "=    ^                  =",
	    "=   ===    ^            =",
	    "=         ===     g     =",
	    "=                 ===   =",
	    "=p     ^     >          =",
	    "======================================",
	    "=========================",
	    "=========================",
	]
]




// Play background music
const bgm = play("bgm", {
    volume: 0.2,
    loop: true,
    paused: true,
});


// Scene: Start Screen
scene("home", () => {
    
    bgm.paused = false
    
    
    
    const title = add([
        text("OPPOSITE DAY", {
            size: 100 * SCALE,
            font: "sink",
        }),
        pos(width() / 2, height() / 5),
        anchor("center"),
        color(COLORS.text),
        z(10)
    ]);
    
    const subtitle = add([
        text("A Mysterious Cat Adventure", {
            size: 36 * SCALE,
            font: "sink",
        }),
        pos(width() / 2, height() / 4 + 80 * SCALE),
        anchor("center"),
        color(COLORS.highlight),
        z(10)
    ]);
    
    
    
    // Cat character display
    const cat = add([
        sprite("cat-sprite"),
        pos(width() / 2, height() / 2 - 40*SCALE),
        anchor("center"),
        scale(2.5 * SCALE),
        rotate(0),
        z(10)
    ]);
    
    
    // Pulsing effect for the title
    let time = 0;
    onUpdate(() => {
        time += dt();
        const pulse = Math.sin(time * 3) * 0.1 + 1;
        title.scale = vec2(pulse);
        
        // Make cat float up and down
        cat.pos.y = height() / 2 + Math.sin(time * 2) * 15;
        cat.angle = Math.sin(time) * 5;
    });
    
    // Particle effects
    onUpdate(() => {
        if (rand(0, 100) > 95) {
            add([
                rect(3, 3),
                pos(rand(0, width()), rand(0, height())),
                color(COLORS.highlight),
                lifespan(1),
                scale(1),
                opacity(rand(0.3, 0.8)),
                z(5)
            ]);
        }
    });
    
    
    
    
    // Button Interations
    const startBtn = add([
        rect(400, 60, { radius: 8 }),
        pos(width() / 2, height() * 0.7),
        anchor("center"),
        color(COLORS.highlight),
        area(),
        scale(SCALE),
        z(10),
        "button"
    ]);
    
    add([
        text("START", {
            size: 32,
            font: "sink",
        }),
        pos(width() / 2, height() * 0.7),
        anchor("center"),
        color(COLORS.background),
        scale(SCALE),
        z(11)
    ]);
    
    onClick("button", () => {
        start("instructions");
    });
    
    
    
    
    // Control BGM
    const bgmBtn = add([
        rect(400, 60, { radius: 8 }),
        pos(width() /2, height() * 0.7 + 80 * SCALE),
        anchor("center"),
        color(COLORS.backBtn),
        area(),
        scale(SCALE),
        z(10),
        "bgmBtn"
    ]);
    
    const bgmBtnTxt= add([
        text("Turn Music OFF", {
            size: 32 * SCALE,
            font: "sink",
        }),
        pos(width() /2, height() * 0.7 + 80 * SCALE),
        anchor("center"),
        color(COLORS.background),
        z(11)
    ]);
    
    onClick("bgmBtn", () => {
        bgm.paused = !(bgm.paused)
        bgmBtnTxt.text = ((bgm.paused)? "Turn Music ON" : "Turn Music OFF")
    });

    
});









// Scene: Instructions
scene("instructions", () => {
    
    
    add([
        text("HOW TO PLAY", {
            size: 72,
            font: "sink",
        }),
        pos(width() / 2, 80),
        anchor("center"),
        color(COLORS.text),
        scale(SCALE),
        z(10),
    ]);
    
    const instructions = [
        "← Help the cat navigate in a world where nothing follows convention!",
        "→ Use the arrow buttons and the space bar to navigate.",
        "→ The controls might or might not change.",
        "→ There are currently five levels.",
        "→ Please Enjoy~~",
        "↖(￣u￣)"
    ];
    
    for (let i = 0; i < instructions.length; i++) {
        add([
            text(instructions[i], {
                size: 24,
                font: "sink",
                width: 700,
            }),
            pos(width() / 2 + 200 * SCALE, height()/5 + i * 40),
            anchor("top"),
            scale(SCALE),
            color(i === 0 ? COLORS.highlight : COLORS.text),
            z(10)
        ]);
    }
    
    // Cat icon
    const cat = add([
        sprite("cat-sprite"),
        pos(width() / 2 - 300, 150),
        scale(1.2),
        color(COLORS.player),
        z(12)
    ]);
    
    
    add([
        text("Reach the door(portal) to complete each level", {
            size: 28,
            font: "sink",
        }),
        pos(width() / 2, height()/3*2),
        anchor("center"),
        color(COLORS.goal),
        scale(SCALE),
        z(10)
    ]);
    
    
    const startBtn = add([
        rect(400, 80, { radius: 8 }),
        pos(width() / 2, height() * 3/4),
        anchor("center"),
        color(COLORS.highlight),
        scale(SCALE),
        area(),
        z(10),
        "start-game-button"
    ]);
    
    add([
        text("BEGIN", {
            size: 42,
            font: "sink",
        }),
        pos(width() / 2, height() * 3/4),
        anchor("center"),
        color(COLORS.background),
        scale(SCALE),
        z(11)
    ]);
    
    // Back button
    const backBtn = add([
        rect(300, 70, { radius: 8 }),
        pos(width() / 2, height() * 5/6),
        anchor("center"),
        color(COLORS.backBtn),
        scale(SCALE),
        area(),
        z(10),
        "back-button"
    ]);
    
    add([
        text("BACK", {
            size: 32,
            font: "sink",
        }),
        pos(width() / 2, height() * 5/6),
        anchor("center"),
        color(COLORS.background),
        scale(SCALE),
        z(11)
    ]);
    
    onClick("start-game-button", () => {
        //GAME_STATE.currentLevel = 1;
        start("game");
    });
    
    onClick("back-button", () => {
        start("home");
    });
});












// Define a scene called "game". The callback will be run when we go() to the scene
// Scenes can accept argument from go()
scene("game", () => {
    
    
	// Use the level passed, or first level
	const level = addLevel(LEVELS[levelCount || 0], {
		tileWidth: 64 * SCALE,
		tileHeight: 64 * SCALE,
		pos: vec2((width() - 64 * SCALE * TILE_COLUMNS) / 2,	height() - 64 * SCALE * (TILE_ROWS + 0)),

		//pos: vec2(100 * SCALE, 200 * SCALE),
		tiles: {
			"p": () => [
				sprite("cat-sprite"),
				area(),
				body(),			
				scale(SCALE),
				anchor("bot"),
				"player",
			],
			"=": () => [
				sprite("block"),
				area(),
				body({ isStatic: true }),
				scale(SCALE),
				anchor("bot"),
			],
			"k": () => [
				sprite("key"),
				area(),
				scale(SCALE),
				anchor("bot"),
				"key",
			],
			"^": () => [
				sprite("water"),
				area(),
				scale(SCALE),
				anchor("bot"),
				"water",
			],
			">": () => [
                sprite("fish"),
                area(),
				scale(SCALE),
				anchor("bot"),
                "fish"
            ],
			"g": () => [
				sprite("door"),
				area(),
				scale(SCALE),
				anchor("bot"),
				"portal",
			],
		},
	})

	// Get the player object from tag
	const player = level.get("player")[0]
	player.play("idle")


	
	/*/ Movements - CONTROLS
	onKeyPress("space", () => {
		if (player.isGrounded() || levelCount == 2) {
			player.jump(spaceCtrl[levelCount]*JUMPPOWER)
			player.play("jump")
		}
	})/*/
	
	onKeyPress("space", () => {
	    effects("jump", player)
	})

	onKeyDown("left", () => {
	    
		effects(LeftControls[levelCount][0], player)
	})

	onKeyDown("right", () => {
	    
		effects(RightControls[levelCount][0], player)
	})

	;["left", "right","space"].forEach((key) => {
    	onKeyRelease(key, () => {
    	// Only reset to "idle" if player is not holding any of these keys
    		if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
    			player.play("idle")
    		}
    	})
    })
    
    const getInfo = () => `
    Anim: ${player.curAnim()}
    Frame: ${player.frame}
    `.trim()
    
    
    
    // Collisions and CONTROLS - use switch

	player.onCollide("water", () => {
	    effects("danger", player, level.tile2Pos(1, 0))
	    //player.pos = level.tile2Pos(1, 0)
	})

	player.onCollide("key", (key) => {
		effects("score", player, key, undefined, hasKLabel)
		hasKLabel.text = "Key: YES"
	})
	player.onCollide("fish", (fish) => {
	    effects("food", player, fish, undefined, hungerIdxLabel)
	    hungerIdxLabel.text = "Food: " + HungerIDX
	})

	// Fall death
	player.onUpdate(() => {
		if (player.pos.y >= 4000) {
			go("lose")
		}
	})

	// Enter the next level on portal
	player.onCollide("portal", () => {
	    effects("portal", player)
		
	})

	// Counters (text)
	const hungerIdxLabel = add([
		text("Food: " + HungerIDX, {size:64*SCALE}),
		pos(width()/5, 64 * SCALE),
		anchor("center"),
	])
	const levelLabel = add([
		text("Level: " + (levelCount + 1), {size:64*SCALE}),
		pos(width()/5*2, 64 * SCALE),
		anchor("center"),
	])
	const hasKLabel = add([
	    text("Key: NO", {size:64*SCALE}),
		pos(width()/5*3, 64 * SCALE),
		anchor("center"),
	])
	
	// House Keeping - Control BGM
    const bgmBtnTxt= add([
        text((bgm.paused)? "Turn Music ON" : "Turn Music OFF", {
            size: 64 * SCALE,
            font: "sink",
        }),
        pos(width()/5*4, 64 * SCALE),
		anchor("center"),
        color(COLORS.background),
        area(),
        z(10),
        "bgmBtn"
    ]);
    
    onClick("bgmBtn", () => {
        bgm.paused = !(bgm.paused)
        bgmBtnTxt.text = ((bgm.paused)? "Turn Music ON" : "Turn Music OFF")
    });

})








scene("die", () => {

	add([
		text("Don't touch the water!!!"),
		pos(12),
	])
    
    if (HungerIDX >= 1){
        add([
    		text("Press anything to restart the level."),
    		pos(12,200),
    	])
        onKeyPress(start("game"))
        
    } else {
        add([
    		text("You Lose"),
    		pos(12),
    	])
    	HungerIDX = 5
    
    	// Press any key to go back
    	onKeyPress(start("game"))
    }
    
	
})

scene("lose", () => {

	add([
		text("You Lose"),
		pos(12),
	])

	// Press any key to go back
	onKeyPress(start("game"))

})

scene("win", () => {

	add([
		text(`You grabbed ${HungerIDX} coins!!!`, {
			width: width(),
		}),
		pos(12),
	])

    levelCount = 0
	onKeyPress(start("game"))

})






function start(name) {
	// Start with the "game" scene, with initial parameters
	hasK = false
	go(name, {
		hungerIdx: HungerIDX,
	})
}

start("home")
