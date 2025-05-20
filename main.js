// Create a canvas and store it in a variable
// Not to be changed//////////////////////////////////////////////////////////////////
const canvas = document.createElement("canvas");

// Initialize kaboom inside the game container
const k = kaboom({
    width: 800,
    height: 500,
    background: [12, 12, 20],
    font: "sink",
    scale: 1,
    debug: false,
    canvas: canvas,
    global: true
});

// Add the canvas to the game container
document.getElementById("game-container").appendChild(canvas);

// Load assets
loadSprite("cat", "https://codehs.com/uploads/b68436416b660f6c1143cadce23107c8");
loadSprite("cat-idle", "https://codehs.com/uploads/d5ebfdf90a879a51d815f5d1b3748e12");
loadSprite("cat-run", "https://codehs.com/uploads/3e2a0ad55931431cec375796bd4b7be9");
loadSprite("goal", "https://codehs.com/uploads/566ed6cd252b069f132487dc8e794440");
loadSprite("block", "https://codehs.com/uploads/626e90a8fc7df801b3496ea88da16546");
loadSprite("spike", "https://codehs.com/uploads/36087e76d19941952f6fd7936c2d96ef");
loadSprite("door", "https://codehs.com/uploads/b1cd4c98cc401a0ba7522b2366b08fb5");
loadSprite("key", "https://codehs.com/uploads/95877eff6346b50003bc840495aae153");
loadSprite("bg-layer1", "https://codehs.com/uploads/8f91dd85950df1a05899ed6cada690a7");
loadSprite("bg-layer2", "https://codehs.com/uploads/6f3115c7ce51479863659b6257bb49af");
loadSprite("bg-layer3", "https://codehs.com/uploads/a6eb532519f8e1282f4c785625d01208");

// Load sounds
loadSound("jump", "https://codehs.com/uploads/faa40002deba6ba708a8b0b306515523");
loadSound("meow", "https://codehs.com/uploads/faa40002deba6ba708a8b0b306515523");
loadSound("collect", "https://codehs.com/uploads/faa40002deba6ba708a8b0b306515523");
loadSound("door", "https://codehs.com/uploads/faa40002deba6ba708a8b0b306515523");
loadSound("die", "https://codehs.com/uploads/faa40002deba6ba708a8b0b306515523");
loadSound("complete", "https://codehs.com/uploads/faa40002deba6ba708a8b0b306515523");
loadSound("bgm", "https://codehs.com/uploads/faa40002deba6ba708a8b0b306515523");

// Game state
const GAME_STATE = {
    currentLevel: 0,
    keysCollected: 0,
    playerDeaths: 0
};

// Colors
const COLORS = {
    player: [255, 255, 255], // White cat
    goal: [255, 215, 0],
    block: [80, 70, 120],
    spike: [230, 60, 60],
    background: [12, 12, 20],
    door: [139, 69, 19],
    key: [255, 215, 0],
    text: [230, 230, 250],
    highlight: [147, 112, 219] // Light purple
};

// Create parallax background
function createParallaxBackground() {
    // Create multiple layers with different speeds
    
    const bgLayer1 = add([
        sprite("bg-layer1"),
        pos(0, 0),
        fixed(),
        z(-10)
    ]);
    
    const bgLayer2 = add([
        sprite("bg-layer2"),
        pos(0, 0),
        fixed(),
        opacity(0.7),
        z(-20)
    ]);
    
    const bgLayer3 = add([
        sprite("bg-layer3"),
        pos(0, 0),
        fixed(),
        opacity(0.5),
        z(-30)
    ]);
    
    // Add subtle movement to backgrounds
    let time = 0;
    onUpdate(() => {
        time += dt() * 0.5;
        bgLayer2.pos.x = Math.sin(time) * 20;
        bgLayer2.pos.y = Math.cos(time) * 10;
        
        bgLayer3.pos.x = Math.sin(time * 0.5) * 30;
        bgLayer3.pos.y = Math.cos(time * 0.5) * 15;
    });
}

// Scene: Start Screen
scene("start", () => {
    createParallaxBackground();
    
    // Play background music
    const music = play("bgm", {
        volume: 0.5,
        loop: true
    });
    
    const title = add([
        text("OPPOSITE DAY", {
            size: 64,
            font: "sink",
        }),
        pos(width() / 2, height() / 3),
        anchor("center"),
        color(COLORS.text),
        z(10)
    ]);
    
    const subtitle = add([
        text("A Mysterious Cat Adventure", {
            size: 24,
            font: "sink",
        }),
        pos(width() / 2, height() / 3 + 80),
        anchor("center"),
        color(COLORS.highlight),
        z(10)
    ]);
    
    // Cat character display
    const cat = add([
        sprite("cat-idle"),
        pos(width() / 2, height() / 2 + 20),
        anchor("center"),
        scale(2),
        rotate(0),
        color(COLORS.player),
        z(10)
    ]);
    
    const startBtn = add([
        rect(200, 60, { radius: 8 }),
        pos(width() / 2, height() * 0.7),
        anchor("center"),
        color(COLORS.highlight),
        area(),
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
        z(11)
    ]);
    
    const instructionsBtn = add([
        rect(200, 60, { radius: 8 }),
        pos(width() / 2, height() * 0.7 + 80),
        anchor("center"),
        color(rgba(COLORS.highlight[0], COLORS.highlight[1], COLORS.highlight[2], 0.7)),
        area(),
        z(10),
        "instructions-button"
    ]);
    
    add([
        text("INSTRUCTIONS", {
            size: 28,
            font: "sink",
        }),
        pos(width() / 2, height() * 0.7 + 80),
        anchor("center"),
        color(COLORS.background),
        z(11)
    ]);
    
    // Pulsing effect for the title
    let time = 0;
    onUpdate(() => {
        time += dt();
        const pulse = Math.sin(time * 3) * 0.1 + 1;
        title.scale = vec2(pulse);
        
        // Make cat float up and down
        cat.pos.y = height() / 2 + 20 + Math.sin(time * 2) * 15;
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
    
    // Button interactions
    onClick("button", () => {
        go("instructions");
    });
    
    onClick("instructions-button", () => {
        go("instructions");
    });
});

// Scene: Instructions
scene("instructions", () => {
    createParallaxBackground();
    
    add([
        text("HOW TO PLAY", {
            size: 48,
            font: "sink",
        }),
        pos(width() / 2, 80),
        anchor("center"),
        color(COLORS.text),
        z(10)
    ]);
    
    const instructions = [
        "Help the cat navigate in a world where everything is reversed!",
        "Level 1: Left/Right controls are reversed",
        "Level 2: Up/Down controls are reversed",
        "Level 3: All directions are reversed",
        "Level 4: Controls are delayed",
        "Level 5: Random control changes with each press"
    ];
    
    for (let i = 0; i < instructions.length; i++) {
        add([
            text(instructions[i], {
                size: 24,
                font: "sink",
                width: 700,
            }),
            pos(width() / 2, 160 + i * 40),
            anchor("center"),
            color(i === 0 ? COLORS.highlight : COLORS.text),
            z(10)
        ]);
    }
    
    // Cat icon
    const cat = add([
        sprite("cat"),
        pos(width() / 2 - 300, 160),
        scale(1.2),
        color(COLORS.player),
        z(10)
    ]);
    
    add([
        text("Reach the golden portal to complete each level", {
            size: 28,
            font: "sink",
        }),
        pos(width() / 2, 380),
        anchor("center"),
        color(COLORS.goal),
        z(10)
    ]);
    
    const startBtn = add([
        rect(200, 60, { radius: 8 }),
        pos(width() / 2, height() - 80),
        anchor("center"),
        color(COLORS.highlight),
        area(),
        z(10),
        "start-game-button"
    ]);
    
    add([
        text("BEGIN", {
            size: 32,
            font: "sink",
        }),
        pos(width() / 2, height() - 80),
        anchor("center"),
        color(COLORS.background),
        z(11)
    ]);
    
    // Back button
    const backBtn = add([
        rect(120, 40, { radius: 8 }),
        pos(80, height() - 40),
        anchor("center"),
        color(rgba(COLORS.highlight[0], COLORS.highlight[1], COLORS.highlight[2], 0.7)),
        area(),
        z(10),
        "back-button"
    ]);
    
    add([
        text("BACK", {
            size: 20,
            font: "sink",
        }),
        pos(80, height() - 40),
        anchor("center"),
        color(COLORS.background),
        z(11)
    ]);
    
    onClick("start-game-button", () => {
        GAME_STATE.currentLevel = 1;
        go("level1");
    });
    
    onClick("back-button", () => {
        go("start");
    });
});

// Level factory function
function createLevel(levelNum, layout, controlType, nextLevel) {
    scene("level" + levelNum, () => {
        // Add parallax background with reduced opacity
        createParallaxBackground();
        
        // Level layout
        const levelConfig = {
            width: 25,
            height: 16,
            pos: vec2(0, 0),
            "=": () => [
                sprite("block"),
                color(COLORS.block),
                area(),
                solid(),
                "block"
            ],
            "^": () => [
                sprite("spike"),
                color(COLORS.spike),
                area(),
                "danger"
            ],
            "p": () => [
                sprite("cat"),
                color(COLORS.player),
                area({ width: 24, height: 24, offset: vec2(4, 4) }),
                body(),
                scale(1),
                "player"
            ],
            "g": () => [
                sprite("goal"),
                color(COLORS.goal),
                area(),
                scale(1),
                "goal"
            ],
            "d": () => [
                sprite("door"),
                color(COLORS.door),
                area(),
                solid(),
                scale(1),
                "door"
            ],
            "k": () => [
                sprite("key"),
                color(COLORS.key),
                area(),
                scale(1),
                "key"
            ]
        };
        
        const gameLevel = addLevel(layout, levelConfig);
        
        // Level title
        add([
            text("LEVEL " + levelNum, { size: 24 }),
            pos(40, 20),
            color(COLORS.text),
            fixed(),
            z(100)
        ]);
        
        // Control explanation
        let controlText = "";
        switch (controlType) {
            case "horizontal":
                controlText = "Left/Right are Reversed!";
                break;
            case "vertical":
                controlText = "Up/Down are Reversed!";
                break;
            case "complete":
                controlText = "All Directions Reversed!";
                break;
            case "delayed":
                controlText = "Controls are Delayed!";
                break;
            case "random":
                controlText = "Controls are Randomized!";
                break;
        }
        
        add([
            text(controlText, { size: 20 }),
            pos(width() - 40, 20),
            anchor("topright"),
            color(COLORS.highlight),
            fixed(),
            z(100)
        ]);
        
        // Deaths counter
        const deathCounter = add([
            text("Deaths: " + GAME_STATE.playerDeaths, { size: 16 }),
            pos(40, 50),
            color(rgba(255, 100, 100, 0.8)),
            fixed(),
            z(100)
        ]);
        
        // Keys display
        const keysDisplay = add([
            text("Keys: 0/1", { size: 16 }),
            pos(width() - 40, 50),
            anchor("topright"),
            color(COLORS.key),
            fixed(),
            z(100)
        ]);
        
        // Get player
        const player = get("player")[0];
        
        // Define player movement
        let moveDirection = { x: 0, y: 0 };
        const SPEED = 220;
        const JUMP_FORCE = 550;
        let canJump = true;
        let commandQueue = [];
        let facingRight = true;
        
        // Process input based on control type
        function handleControls() {
            const keys = {
                left: isKeyDown("left") || isKeyDown("a"),
                right: isKeyDown("right") || isKeyDown("d"),
                up: isKeyDown("up") || isKeyDown("w") || isKeyDown("space"),
                down: isKeyDown("down") || isKeyDown("s")
            };
            
            switch (controlType) {
                case "horizontal":
                    if (keys.left) {
                        moveDirection.x = 1;
                        facingRight = true;
                    } else if (keys.right) {
                        moveDirection.x = -1;
                        facingRight = false;
                    } else {
                        moveDirection.x = 0;
                    }
                    
                    if (keys.up && canJump) {
                        player.jump(JUMP_FORCE);
                        play("jump", { volume: 0.5 });
                        canJump = false;
                    }
                    break;
                    
                case "vertical":
                    if (keys.left) {
                        moveDirection.x = -1;
                        facingRight = false;
                    } else if (keys.right) {
                        moveDirection.x = 1;
                        facingRight = true;
                    } else {
                        moveDirection.x = 0;
                    }
                    
                    if (keys.down && canJump) {
                        player.jump(JUMP_FORCE);
                        play("jump", { volume: 0.5 });
                        canJump = false;
                    }
                    break;
                    
                case "complete":
                    if (keys.left) {
                        moveDirection.x = 1;
                        facingRight = true;
                    } else if (keys.right) {
                        moveDirection.x = -1;
                        facingRight = false;
                    } else {
                        moveDirection.x = 0;
                    }
                    
                    if (keys.down && canJump) {
                        player.jump(JUMP_FORCE);
                        play("jump", { volume: 0.5 });
                        canJump = false;
                    }
                    break;
                    
                case "delayed":
                    // Add current input to queue
                    if (keys.left) {
                        commandQueue.push({ dir: "left", time: 0.5 });
                    } else if (keys.right) {
                        commandQueue.push({ dir: "right", time: 0.5 });
                    }
                    
                    if (keys.up && canJump) {
                        commandQueue.push({ dir: "jump", time: 0.5 });
                        canJump = false;
                    }
                    break;
                    
                case "random":
                    // Random controls change each time a key is pressed
                    const randDirs = ["normal", "reversed"];
                    const horizontalDir = choose(randDirs);
                    const verticalDir = choose(randDirs);
                    
                    if (keys.left) {
                        moveDirection.x = horizontalDir === "normal" ? -1 : 1;
                        facingRight = horizontalDir !== "normal";
                    } else if (keys.right) {
                        moveDirection.x = horizontalDir === "normal" ? 1 : -1;
                        facingRight = horizontalDir === "normal";
                    } else {
                        moveDirection.x = 0;
                    }
                    
                    if (keys.up && canJump) {
                        if (verticalDir === "normal") {
                            player.jump(JUMP_FORCE);
                            play("jump", { volume: 0.5 });
                        }
                        canJump = false;
                    } else if (keys.down && canJump && verticalDir !== "normal") {
                        player.jump(JUMP_FORCE);
                        play("jump", { volume: 0.5 });
                        canJump = false;
                    }
                    break;
            }
        }
        
        // Handle delayed commands
        onUpdate(() => {
            if (controlType === "delayed") {
                // Process command queue
                for (let i = 0; i < commandQueue.length; i++) {
                    commandQueue[i].time -= dt();
                    
                    // Execute command when time is up
                    if (commandQueue[i].time <= 0) {
                        if (commandQueue[i].dir === "left") {
                            moveDirection.x = -1;
                            facingRight = false;
                            setTimeout(() => { moveDirection.x = 0; }, 300);
                        } else if (commandQueue[i].dir === "right") {
                            moveDirection.x = 1;
                            facingRight = true;
                            setTimeout(() => { moveDirection.x = 0; }, 300);
                        } else if (commandQueue[i].dir === "jump") {
                            player.jump(JUMP_FORCE);
                            play("jump", { volume: 0.5 });
                        }
                        commandQueue.splice(i, 1);
                        i--;
                    }
                }
            }
            
            // Apply movement
            player.move(moveDirection.x * SPEED, 0);
            
            // Handle player orientation
            player.scale.x = facingRight ? 1 : -1;
            
            // Update UI
            deathCounter.text = "Deaths: " + GAME_STATE.playerDeaths;
            keysDisplay.text = "Keys: " + GAME_STATE.keysCollected + "/1";
            
            // Occasional particle trail
            if (Math.abs(moveDirection.x) > 0 && rand(0, 100) > 80) {
                add([
                    rect(4, 4),
                    pos(player.pos.add(rand(-5, 5), rand(5, 10))),
                    color(COLORS.highlight),
                    opacity(0.7),
                    lifespan(0.5),
                    z(5)
                ]);
            }
        });
        
        // Input handling
        onKeyDown(handleControls);
        onKeyPress(handleControls);
        
        // Reset jump ability when landing
        player.onGround(() => {
            canJump = true;
        });
        
        // Death on touching danger
        player.onCollide("danger", () => {
            GAME_STATE.playerDeaths++;
            play("die", { volume: 0.6 });
            
            // Death effect
            for (let i = 0; i < 20; i++) {
                add([
                    rect(3, 3),
                    pos(player.pos),
                    color(COLORS.player),
                    move(rand(0, 360), rand(100, 200)),
                    lifespan(1),
                    area(),
                    cleanup(),
                    z(10)
                ]);
            }
            
            wait(0.5, () => {
                go("level" + levelNum);
            });
        });
        
        // Collect keys
        player.onCollide("key", (key) => {
            destroy(key);
            GAME_STATE.keysCollected++;
            play("collect", { volume: 0.7 });
            
            // Collection effect
            for (let i = 0; i < 10; i++) {
                add([
                    rect(2, 2),
                    pos(key.pos),
                    color(COLORS.key),
                    move(rand(0, 360), rand(50, 100)),
                    lifespan(0.8),
                    cleanup(),
                    z(10)
                ]);
            }
        });
        
        // Door interaction
        player.onCollide("door", (door) => {
            if (GAME_STATE.keysCollected > 0) {
                destroy(door);
                GAME_STATE.keysCollected--;
                play("door", { volume: 0.6 });
                
                // Door opening effect
                for (let i = 0; i < 15; i++) {
                    add([
                        rect(4, 4),
                        pos(door.pos.add(rand(-20, 20), rand(-30, 30))),
                        color(COLORS.door),
                        move(rand(0, 360), rand(60, 120)),
                        lifespan(1),
                        cleanup(),
                        z(10)
                    ]);
                }
            } else {
                // Locked door effect
                if (rand(0, 100) > 80) {
                    play("meow", { volume: 0.3, detune: rand(-200, 200) });
                }
            }
        });
        
        // Level completion
        player.onCollide("goal", () => {
            GAME_STATE.currentLevel++;
            play("complete", { volume: 0.7 });
            
            // Goal completion effect
            for (let i = 0; i < 30; i++) {
                add([
                    rect(5, 5),
                    pos(player.pos),
                    color(COLORS.goal),
                    move(rand(0, 360), rand(100, 200)),
                    lifespan(1),
                    cleanup(),
                    z(10)
                ]);
            }
            
            // Fade out
            add([
                rect(width(), height()),
                pos(0, 0),
                color(0, 0, 0),
                opacity(0),
                fixed(),
                z(200),
                {
                    update() {
                        this.opacity += dt() * 2;
                    }
                }
            ]);
            
            wait(1, () => {
                go(nextLevel);
            });
        });
        
        // Reset button
        const resetBtn = add([
            rect(100, 40, { radius: 5 }),
            pos(width() - 60, height() - 30),
            color(rgb(200, 50, 50)),
            anchor("center"),
            area(),
            fixed(),
            z(100),
            "reset-button"
        ]);
        
        add([
            text("RESET", { size: 16 }),
            pos(width() - 60, height() - 30),
            anchor("center"),
            color(255, 255, 255),
            fixed(),
            z(101)
        ]);
        
        onClick("reset-button", () => {
            go("level" + levelNum);
        });
        
        // Menu button
        const menuBtn = add([
            rect(100, 40, { radius: 5 }),
            pos(60, height() - 30),
            color(rgb(50, 50, 200)),
            anchor("center"),
            area(),
            fixed(),
            z(100),
            "menu-button"
        ]);
        
        add([
            text("MENU", { size: 16 }),
            pos(60, height() - 30),
            anchor("center"),
            color(255, 255, 255),
            fixed(),
            z(101)
        ]);
        
        onClick("menu-button", () => {
            go("start");
        });
    });
}

// Scene: Victory
scene("victory", () => {
    createParallaxBackground();
    
    add([
        text("CONGRATULATIONS!", {
            size: 64,
            font: "sink",
        }),
        pos(width() / 2, height() / 3),
        anchor("center"),
        color(COLORS.goal),
        z(10)
    ]);
    
    add([
        text("The cat has mastered Opposite Day!", {
            size: 32,
            font: "sink",
        }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(COLORS.text),
        z(10)
    ]);
    
    add([
        text("Total Deaths: " + GAME_STATE.playerDeaths, {
            size: 24,
            font: "sink",
        }),
        pos(width() / 2, height() / 2 + 60),
        anchor("center"),
        color(rgba(255, 100, 100, 0.8)),
        z(10)
    ]);
    
    // Cat celebration
    const cat = add([
        sprite("cat"),
        pos(width() / 2, height() / 2 - 80),
        scale(3),
        anchor("center"),
        color(COLORS.player),
        z(10)
    ]);
    
    // Cat animation
    let time = 0;
    onUpdate(() => {
        time += dt();
        cat.scale = vec2(3 + Math.sin(time * 5) * 0.2);
        cat.angle = Math.sin(time * 3) * 10;
    });
    
    const menuBtn = add([
        rect(200, 60, { radius: 8 }),
        pos(width() / 2, height() / 2 + 140),
        anchor("center"),
        color(rgb(50, 50, 200)),
        area(),
        z(10),
        "menu-button"
    ]);
    
    add([
        text("MAIN MENU", {
            size: 24,
            font: "sink",
        }),
        pos(width() / 2, height() / 2 + 140),
        anchor("center"),
        color(255, 255, 255),
    ]);

    onClick("menu-button", () => {
        GAME_STATE.playerDeaths = 0;
        GAME_STATE.keysCollected = 0;
        GAME_STATE.currentLevel = 0;
        go("start");
    });

    // Confetti effect
    function createConfetti() {
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                add([
                    rect(10, 10),
                    pos(rand(0, width()), -20),
                    color(rand(0, 255), rand(0, 255), rand(0, 255)),
                    move(90, rand(100, 200)),
                    lifespan(4),
                    rotate(rand(0, 360)),
                ]);
            }, i * 50);
        }
    }

    createConfetti();
});

// Define level layouts
const level1Layout = [
    "=========================",
    "=                       =",
    "=                       =",
    "=                       =",
    "=         g             =",
    "=        ===            =",
    "=    k                  =",
    "=   ===                 =",
    "=                       =",
    "=              ^^^      =",
    "=            =======    =",
    "=      d                =",
    "=     ===               =",
    "=p                      =",
    "=========================",
    "=========================",
];

const level2Layout = [
    "=========================",
    "=                       =",
    "=    g                  =",
    "=   ===                 =",
    "=                       =",
    "=        ^^^^^          =",
    "=       =========       =",
    "=                       =",
    "=                       =",
    "=           k           =",
    "=          ===          =",
    "=                       =",
    "=p                      =",
    "=====    d    ===========",
    "=========================",
    "=========================",
];

const level3Layout = [
    "=========================",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=     ^                 =",
    "=    ===   ^   ^        =",
    "=          ===== g      =",
    "=                ===    =",
    "=       ^               =",
    "=      ===      k       =",
    "=                ===    =",
    "=p  ^       d            =",
    "============================",
    "=========================",
    "=========================",
];

const level4Layout = [
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
    "=p      ===  d          =",
    "======     ===     ======",
    "=========================",
];

const level5Layout = [
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
    "=p     ^     d          =",
    "======================================",
    "=========================",
    "=========================",
];

// Create levels
createLevel(1, level1Layout, "horizontal", "level2");
createLevel(2, level2Layout, "vertical", "level3");
createLevel(3, level3Layout, "complete", "level4");
createLevel(4, level4Layout, "delayed", "level5");
createLevel(5, level5Layout, "random", "victory");

// For audio effects (placeholder)
function play(sound) {
    // Placeholder for sound effects
    console.log("Playing sound:", sound);
}

// Start the game
go("start");