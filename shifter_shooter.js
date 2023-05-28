var score = 0;
var lives = 0;
var level = 1;

var playMode = 0;


var randomStarY = [];
var randomStarX = [];

var enemyWait = 0;

var spaceshipBoundaries = {
    xLeft: 30,
    xRight: 370,
    yUp: 100,
    yDown: 400
};

imageMode(CENTER);


// Object for the spaceship
var Spaceship = function() {
    this.x = random(10, 390);
    this.y = 360;
    this.width = 70;
    this.height = 70;
    this.imageSrc = getImage("minecraft/egg");
    this.logoSrc = loadImage("https://blog.hatchcoding.com/hubfs/Hatch%20stacked%20logo%20purple-2.png");
    this.xSpeed = 0;
    this.ySpeed = 0;
};

//object for the laserBeams 
var LaserBeam = function(x, y, color, stroke, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 8;
    this.color = color;
    this.stroke = stroke;
};


//object for enemies, the "Shifters", of the spaceship
var enemyImage = getImage("starwars/r2d2");
var Enemy = function() {
    this.x = random(10, 390);
    this.y = random(-80, -10);
    this.speed = random(3, 6);
    this.width = 70;
    this.height = 60;
    this.imageSrc = enemyImage;
};


//object for falling prizes
var Prize = function() {
    this.x = random(10, 390);
    this.y = random(-80, -10);
    this.speed = random(2, 5);
    this.width = 30;
    this.height = 30;
    this.listOfPrizes = ["LaserBeam", "lives", "LaserBeam", "LaserBeam", "score", "score", "score", "lives", "lives", "triangleBeam", "triangleBeam", "triangleBeam"];
    this.prize = this.listOfPrizes[round(random(this.listOfPrizes.length - 1))];
    this.listOfColors = [color(0, 255, 0), color(255, 0, 0), color(0, 0, 255), color(140, 0, 180)];
    this.color = this.listOfColors[round(random(this.listOfColors.length - 1))];
};

//object for the big boss level
var BigBoss = function(type) {
    this.x = 200;
    this.y = 100;
    this.type = type;
    
    if (this.type === 1) {
        this.width = 250;
        this.height = 150;
        this.lives = 200;
        this.imageSrc = getImage("pokemon/ball-closed");
    } else if (this.type === 2) {
        this.width = 300;
        this.height = 200;
        this.lives = 260;
        this.imageSrc = getImage("starwars/bb8");
    } else if (this.type === 0) {
        this.width = 230;
        this.height = 130;
        this.lives = 140;
        this.imageSrc = getImage("starwars/c3po");
    }
};



var spaceship = new Spaceship();
var laserBeams = [];
var badLaserBeams = [];
var laserBeamHitValue = 0;
var enemies = [];
var prizes = [];
var prizesWait = 0;
var bigBoss = new BigBoss(0);
var bigBossLaserBeams = [];
var fallingObjectBoolean = true;
var maxScore = 2500;


var bigBoss1MeetScore = 1000;
var bigBoss1EndScore = 1200;
var bigBoss2MeetScore = 1700;
var bigBoss2EndScore = 2500;

var easyMode = true;
var mediumMode = false;
var hardMode = false;

var prizeLaserBeamHitValue = 0;
var triangleLaserBeamHitValue = 0;
var livesDecreaseValue = 0;
var difficulty = 0;


// most used color variables
var white = color(255);
var lime = color(0, 255, 0);
var black = color(0);

//sound effects
var sfx = false;


//reset all the variables to normal
var resetGame = function(){
    lives = 200; 
    level = 1;
    score = 0;
    enemies = [];
    prizes = [];
    bigBoss.lives = 200;
    spaceship.x = random(10, 390);
    bigBoss.type = 0;
    
    
    //laserBeamHitValue becomes based on the difficulty when the game restarts
    
    if (easyMode === true) {
        laserBeamHitValue = 0.8;
        prizeLaserBeamHitValue = 1.6;
        triangleLaserBeamHitValue = 2.4;
        livesDecreaseValue = 0.5;
        bigBoss1MeetScore = 500;
        bigBoss1EndScore = 700;
        bigBoss2MeetScore = 1200;
        bigBoss2EndScore = 1700;
        
        maxScore = 1700;
        
        difficulty = "easy";
    }
    
    if (mediumMode === true) {
        laserBeamHitValue = 0.2;
        prizeLaserBeamHitValue = 0.4;
        triangleLaserBeamHitValue = 0.6;
        livesDecreaseValue = 0.8;
        
        
        bigBoss1MeetScore = 800;
        bigBoss1EndScore = 1000;
        bigBoss2MeetScore = 1500;
        bigBoss2EndScore = 2000;
        
        difficulty = "medium";
    }
    
    if (hardMode === true) {
        laserBeamHitValue = 0.1;
        prizeLaserBeamHitValue = 0.2;
        triangleLaserBeamHitValue = 0.3;
        livesDecreaseValue = 1;
        
        bigBoss1MeetScore = 1000;
        bigBoss1EndScore = 1200;
        bigBoss2MeetScore = 1700;
        bigBoss2EndScore = 2500;
        
        difficulty = "hard";
    }
    
    
    
    
    
    
};



//creating many stars positions and string it in list
for (var s = 0; s < 300; s++) {
    randomStarX.push(random(400));
    randomStarY.push(random(400));
}


//starting off with a couple of Shifter enemies using for loop
for (var i = 0; i < 4; i++) {
    enemies.push(new Enemy());
}



var displayStars = function() {
    // using a for loop to show all the stars and their position from the randomStarX, randomStarY
    for (var i = 0; i < 300; i++) {
        //a white color for the stars
        fill(white);
        strokeWeight(3);
        stroke(white);
        
        randomStarY[i] += 2;
        
        point(randomStarX[i], randomStarY[i]);
        
        if (randomStarY[i] >= 400) {
            randomStarY[i] =  0;
        }
    }
};


//displaying the laser beam
var displayProjectile = function(x, y, width, height) {
    rect(x, y, width, height, 30);
};



var drawSpaceship = function() {
    spaceship.x += spaceship.xSpeed;
    spaceship.y += spaceship.ySpeed;
    
    var laserBeamsIndexOutOfCanvas = [];
    
    // spaceship
    image(spaceship.imageSrc, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
    
    // spaceship hatch logo
    image(spaceship.logoSrc, spaceship.x, spaceship.y, spaceship.width - 30, spaceship.height - 30);
    
    
    //boundaries for when the spaceship hits the sides
    if (spaceship.x <= spaceshipBoundaries.xLeft) {
        spaceship.xSpeed = 0;
    }
    if (spaceship.x >= spaceshipBoundaries.xRight) {
        spaceship.xSpeed = 0;
    }
    
    if (spaceship.y <= spaceshipBoundaries.yUp) {
        spaceship.ySpeed = 0;
    }
    if (spaceship.y >= spaceshipBoundaries.yDown - spaceship.height / 2) {
        spaceship.ySpeed = 0;
    }
    
    
    // for loop for all the laser beams
    for (var i = 0; i < laserBeams.length; i++) {
        laserBeams[i].y -= laserBeams[i].speed;
        
        fill(laserBeams[i].color);
        stroke(laserBeams[i].stroke);
        displayProjectile(laserBeams[i].x, laserBeams[i].y, laserBeams[i].width, laserBeams[i].height);
        
        
    //if laser beams goes out of canvas
    if (laserBeams[i].y <= 0) {
        laserBeamsIndexOutOfCanvas.push(i);
    }
    }
    
    if (lives >= 200) {
        lives = 200;
    }
    
    // when you win game
    if (score >= maxScore) {
        playMode = 3;
    }
    
    for (var q = laserBeamsIndexOutOfCanvas.length - 1; q >= 0; q--) {
        laserBeams.splice(laserBeamsIndexOutOfCanvas[q], 1);
    }
    
};


var drawEnemy = function() {
    enemyWait += 0.25;
    
    var enemyIndexOutOfCanvas = [];

    for (var w = 0; w < enemies.length; w++) {
        enemies[w].y += enemies[w].speed;
        
        if (enemies[w].y > 400) {
            enemyIndexOutOfCanvas.push(w);
            continue;
        }
        
        if (score >= 50) {
            enemies[w].width = 100;
            enemies[w].height = 90;
        }
        
        
        if (score >= 100) {
            enemies[w].width = 120;
            enemies[w].height = 110;
            
            laserBeamHitValue = 1;
            
            prizeLaserBeamHitValue = 2;
            triangleLaserBeamHitValue = 3;
        }
        
        
        
        
        image(enemies[w].imageSrc, enemies[w].x, enemies[w].y, enemies[w].width, enemies[w].height);
        
        for (var e = 0; e < laserBeams.length; e++) {
            if ((laserBeams[e].x > enemies[w].x && laserBeams[e].x < enemies[w].x + enemies[w].width) && (laserBeams[e].y > enemies[w].y && laserBeams[e].y < enemies[w].y + enemies[w].height)) {
                // puts the laser beam and enemy out of    canvas and score increases
                enemyIndexOutOfCanvas.push(w);
                laserBeams[e].x = -300;
                score += laserBeamHitValue;
            }
        }
    }
    
    for (var q = enemyIndexOutOfCanvas.length - 1; q >=0; q--){
        enemies.splice(enemyIndexOutOfCanvas[q], 1);
    }
    
    
    for (var q = laserBeams.length - 1; q >=0; q--){
        if (laserBeams[q].x < -10){
            laserBeams.splice(q, 1);
        }
    }
    
    for (var a = 0; a < badLaserBeams.length; a++) {
        
        if ((badLaserBeams[a].x > spaceship.x && badLaserBeams[a].x < spaceship.x + spaceship.width) && (badLaserBeams[a].y > spaceship.y && badLaserBeams[a].y < spaceship.y + spaceship.height)) {
            // puts the bad laser beam out of canvas and lives decreases
            badLaserBeams[a].x = -300;
            lives -= livesDecreaseValue;
         }
    }
    
    
    for (var a = 0; a < badLaserBeams.length; a++) {
        badLaserBeams[a].y += badLaserBeams[a].speed;
        
        fill(badLaserBeams[a].color);
        stroke(badLaserBeams[a].stroke);
        rect(badLaserBeams[a].x, badLaserBeams[a].y, badLaserBeams[a].width, badLaserBeams[a].height, 30);
        
    }
    
    
    // adds more enemies and laser beams when enemyWait is a divisible of 2
    if (fallingObjectBoolean === true) {
        if (enemyWait % 7 === 0) {
            enemyWait = 0;
            enemies.push(new Enemy());
            badLaserBeams.push(new LaserBeam(enemies[round(random(enemies.length - 1))].x - 2, enemies[round(random(enemies.length - 1))].y - 10, color(255, 0, 0), color(100, 0, 0), 10, 17));
        }
    }
};

var laserBeamHitValueList = [];
var changeProjectileList = [];

var drawPrizes = function() {
    prizesWait += 0.25;
    
    
    var prizeIndexOutOfCanvas = [];
    
    var changeProjectile = function() {
        //changing the projectile to a triangle
        displayProjectile = function(x, y, width, height) {
            triangle(x, y, x - 10, y + height, x + 10, y + height);
        };
    };
    
     var changeProjectileToNormal = function() {
        //changing the projectile back to a rectangle
        displayProjectile = function(x, y, width, height) {
            rect(x, y, width, height, 30);
        };
    };
    
    for (var p = 0; p < prizes.length; p++) {
        prizes[p].y += prizes[p].speed;
        
        fill(prizes[p].color);
        ellipse(prizes[p].x, prizes[p].y, prizes[p].width, prizes[p].height);
        fill(255);
        textSize(20);
        text(prizes[p].prize[0], prizes[p].x - 5, prizes[p].y + 5);
        
        if (prizes[p].y > 410) {
            prizeIndexOutOfCanvas.push(p);
        }
        
        
        
        for (var i = 0; i < laserBeams.length; i++) {
            if ((laserBeams[i].x >= prizes[p].x && laserBeams[i].x <= prizes[p].x + prizes[p].width) && (laserBeams[i].y >= prizes[p].y && laserBeams[i].y <= prizes[p].y + prizes[p].height)) {
                //hit value increases
                if (prizes[p].prize[0] === "L") {
                    laserBeamHitValueList.push(score);
                    
                    laserBeamHitValue = prizeLaserBeamHitValue;
                    
                }
                //score increases
                if (prizes[p].prize[0] === "s") {
                    score += 5;
                }
                //lives increase
                if (prizes[p].prize[0] === "l") {
                    lives += laserBeamHitValue;
                }
                //triangle laser beam
                if (prizes[p].prize[0] === "t") {
                    //adding the score to remember when to stop the triangle size
                    changeProjectileList.push(score);
                    changeProjectile();
                    
                    // the laserBeamHitValue becomes 0.3, 0.1 for each side
                    laserBeamHitValue = triangleLaserBeamHitValue;
                }
                prizeIndexOutOfCanvas.push(p);
            }
        }
        
        if (laserBeamHitValueList[0] + 5.0 <= score) {
            laserBeamHitValue = prizeLaserBeamHitValue / 2;
            laserBeamHitValueList.splice(0, 1);
        }
        
        if (changeProjectileList[0] + 5.0 <= score) {
            laserBeamHitValue = triangleLaserBeamHitValue / 3;
            
            
            changeProjectileToNormal();
            
            laserBeamHitValueList.splice(0, 1);
        }
    }
    
    for (var p = prizeIndexOutOfCanvas.length - 1; p >= 0; p--) {
        prizes.splice(prizeIndexOutOfCanvas[p], 1);
    }
    
    if (fallingObjectBoolean === true) {
        //if prizes divisible by 80
        if (prizesWait % 80 === 0) {
            prizesWait = 0;
            prizes.push(new Prize());
        }
    }

};

var bigBossLaserBeamsWait = 0;
var drawBigBoss = function() {
    var bigBossLaserBeamIndexOutOfCanvas = [];
    var laserBeamIndexOutOfCanvas = [];
    
    textSize(20);
    
    
    if (bigBoss.type === 0) {
        if (score >= 200 && score < 400 && bigBoss.lives > 0) {
            fallingObjectBoolean = false;
            
            if (bigBoss.lives >= 161) {
                lives += 20;
                bigBoss.lives = 160;
            }
            
            bigBossLaserBeamsWait += 0.25;
            
            bigBoss.y = sin(Date.now()/250)*height/50;
            
            image(bigBoss.imageSrc, bigBoss.x, bigBoss.y + 90, bigBoss.width, bigBoss.height);
            
            fill(255, 0, 0);
            rect(bigBoss.x / 2, bigBoss.y + 60, 200, 15);
            fill(0, 255, 0);
            rect(bigBoss.x / 2, bigBoss.y + 60, bigBoss.lives, 15);
            fill(255);
            text(Math.floor(bigBoss.lives), bigBoss.x, bigBoss.y + 75);
            
            for (var i = 0; i < bigBossLaserBeams.length; i++) {
                bigBossLaserBeams[i].y += bigBossLaserBeams[i].speed;
                
                fill(bigBossLaserBeams[i].color);
                stroke(bigBossLaserBeams[i].stroke);
                
                rect(bigBossLaserBeams[i].x, bigBossLaserBeams[i].y, bigBossLaserBeams[i].width, bigBossLaserBeams[i].height, 50);
                
                if (bigBossLaserBeams[i].y >= 400) {
                    bigBossLaserBeamIndexOutOfCanvas.push(i);
                }
                
                if ((bigBossLaserBeams[i].x >= spaceship.x && bigBossLaserBeams[i].x <= spaceship.x + spaceship.width) && (bigBossLaserBeams[i].y >= spaceship.y && bigBossLaserBeams[i].y <= spaceship.y + spaceship.height)) {
                    lives -= 2;
                    bigBossLaserBeamIndexOutOfCanvas.push(i);
                }
            }
            
            
            for (var e = 0; e < laserBeams.length; e++) {
                if ((laserBeams[e].x >= bigBoss.x && laserBeams[e].x <= bigBoss.x + bigBoss.width) && (laserBeams[e].y >= bigBoss.y && laserBeams[e].y <= bigBoss.y + bigBoss.height)) { 
                    bigBoss.lives -= 0.4;
                    laserBeamIndexOutOfCanvas.push(e);
                }
            }
            
          
            
            if (bigBossLaserBeamsWait % 3 === 0) {
                bigBossLaserBeamsWait = 0;
                
                bigBossLaserBeams.push(new LaserBeam(random(spaceship.x - 2, spaceship.x + spaceship.width), bigBoss.y - 10, color(240, 240, 0), color(200, 200, 0), 20, 34));
    
                
            }
            
            for (var q = bigBossLaserBeamIndexOutOfCanvas.length - 1; q >=0; q--){
                bigBossLaserBeams.splice(bigBossLaserBeamIndexOutOfCanvas[q], 1);
            }
            
            for (var q = laserBeamIndexOutOfCanvas.length - 1; q >=0; q--){
                laserBeams.splice(laserBeamIndexOutOfCanvas[q], 1);
            }
        } else {
            fallingObjectBoolean = true;
        }
        
        
        if (bigBoss.lives <= 0 && lives > 0) {
            fallingObjectBoolean = true;
            score += 200;
            bigBoss = new BigBoss(1);
            lives = 200;
            bigBoss.lives = 200;
        }
    }
    
    if (bigBoss.type === 1) {
        //1000
        if (score >= bigBoss1MeetScore && score < bigBoss1EndScore && bigBoss.lives > 0) {
            fallingObjectBoolean = false;
            
            if (bigBoss.lives >= 200) {
                lives += 20;
                bigBoss.lives = 199.9;
            }
            
            bigBossLaserBeamsWait += 0.25;
            
            bigBoss.y = sin(Date.now()/250)*height/50;
            
            image(bigBoss.imageSrc, bigBoss.x, bigBoss.y + 90, bigBoss.width, bigBoss.height);
            
            fill(255, 0, 0);
            rect(bigBoss.x / 2, bigBoss.y + 60, 200, 15);
            fill(0, 255, 0);
            rect(bigBoss.x / 2, bigBoss.y + 60, bigBoss.lives, 15);
            fill(255);
            text(Math.floor(bigBoss.lives), bigBoss.x, bigBoss.y + 75);
            
            for (var i = 0; i < bigBossLaserBeams.length; i++) {
                bigBossLaserBeams[i].y += bigBossLaserBeams[i].speed;
                
                fill(bigBossLaserBeams[i].color);
                stroke(bigBossLaserBeams[i].stroke);
                
                rect(bigBossLaserBeams[i].x, bigBossLaserBeams[i].y, bigBossLaserBeams[i].width, bigBossLaserBeams[i].height, 50);
                
                if (bigBossLaserBeams[i].y >= 400) {
                    bigBossLaserBeamIndexOutOfCanvas.push(i);
                }
                
                if ((bigBossLaserBeams[i].x >= spaceship.x && bigBossLaserBeams[i].x <= spaceship.x + spaceship.width) && (bigBossLaserBeams[i].y >= spaceship.y && bigBossLaserBeams[i].y <= spaceship.y + spaceship.height)) {
                    lives -= 3;
                    bigBossLaserBeamIndexOutOfCanvas.push(i);
                }
            }
            
            
            for (var e = 0; e < laserBeams.length; e++) {
                if ((laserBeams[e].x >= bigBoss.x && laserBeams[e].x <= bigBoss.x + bigBoss.width) && (laserBeams[e].y >= bigBoss.y && laserBeams[e].y <= bigBoss.y + bigBoss.height)) { 
                    bigBoss.lives -= 0.4;
                    laserBeamIndexOutOfCanvas.push(e);
                }
            }
            
            for (var e = 0; e < badLaserBeams.length; e++) {
                if ((badLaserBeams[e].x >= spaceship.x && badLaserBeams[e].x <= spaceship.x + spaceship.width) && (badLaserBeams[e].y >= spaceship.y && badLaserBeams[e].y <= spaceship.y + spaceship.height)) { 
                    lives -= 2;
                    
                }
            }
            
          
            
            if (bigBossLaserBeamsWait % 4 === 0) {
                bigBossLaserBeamsWait = 0;
                
                bigBossLaserBeams.push(new LaserBeam(random(spaceship.x - 2, spaceship.x + spaceship.width), bigBoss.y - 10, color(147, 0, 150), color(10, 1, 100), 20, 34));
    
                
            }
            
            for (var q = bigBossLaserBeamIndexOutOfCanvas.length - 1; q >=0; q--){
                bigBossLaserBeams.splice(bigBossLaserBeamIndexOutOfCanvas[q], 1);
            }
            
            for (var q = laserBeamIndexOutOfCanvas.length - 1; q >=0; q--){
                laserBeams.splice(laserBeamIndexOutOfCanvas[q], 1);
            }
        } else {
            fallingObjectBoolean = true;
        }
        
        
        if (bigBoss.lives <= 0 && lives > 0) {
            fallingObjectBoolean = true;
            score += 200;
            lives = 200;
            bigBoss = new BigBoss(2);
            bigBoss.lives = 260;
        }
    }
    if (bigBoss.type === 2) {
        if (score >= bigBoss2MeetScore && score < maxScore && bigBoss.lives > 0) {
            fallingObjectBoolean = false;
            
            if (bigBoss.lives >= 200) {
                lives += 20;
                bigBoss.lives = 199.9;
            }
            
            bigBossLaserBeamsWait += 0.25;
            
            bigBoss.y = sin(Date.now()/250)*height/50;
            
            image(bigBoss.imageSrc, bigBoss.x, bigBoss.y + 90, bigBoss.width, bigBoss.height);
            
            fill(255, 0, 0);
            rect(bigBoss.x / 2, bigBoss.y + 60, 200, 15);
            fill(0, 255, 0);
            rect(bigBoss.x / 2, bigBoss.y + 60, bigBoss.lives, 15);
            fill(255);
            text(Math.floor(bigBoss.lives), bigBoss.x, bigBoss.y + 75);
            
            for (var i = 0; i < bigBossLaserBeams.length; i++) {
                bigBossLaserBeams[i].y += bigBossLaserBeams[i].speed;
                
                fill(bigBossLaserBeams[i].color);
                stroke(bigBossLaserBeams[i].stroke);
                
                rect(bigBossLaserBeams[i].x, bigBossLaserBeams[i].y, bigBossLaserBeams[i].width, bigBossLaserBeams[i].height, 50);
                
                if (bigBossLaserBeams[i].y >= 400) {
                    bigBossLaserBeamIndexOutOfCanvas.push(i);
                }
                
                if ((bigBossLaserBeams[i].x >= spaceship.x && bigBossLaserBeams[i].x <= spaceship.x + spaceship.width) && (bigBossLaserBeams[i].y >= spaceship.y && bigBossLaserBeams[i].y <= spaceship.y + spaceship.height)) {
                    lives -= 4;
                    bigBossLaserBeamIndexOutOfCanvas.push(i);
                }
            }
            
            for (var e = 0; e < laserBeams.length; e++) {
                if ((laserBeams[e].x >= bigBoss.x && laserBeams[e].x <= bigBoss.x + bigBoss.width) && (laserBeams[e].y >= bigBoss.y && laserBeams[e].y <= bigBoss.y + bigBoss.height)) { 
                    bigBoss.lives -= 0.2;
                    laserBeamIndexOutOfCanvas.push(e);
                }
            }
            
            if (bigBossLaserBeamsWait % 6 === 0) {
                bigBossLaserBeamsWait = 0;
                
                bigBossLaserBeams.push(new LaserBeam(random(spaceship.x - 2, spaceship.x + spaceship.width), bigBoss.y - 10, color(30, 100, 200), color(120, 70, 0), 40, 68));
                
            }
            
            for (var q = bigBossLaserBeamIndexOutOfCanvas.length - 1; q >=0; q--){
                bigBossLaserBeams.splice(bigBossLaserBeamIndexOutOfCanvas[q], 1);
            }
            
            for (var q = laserBeamIndexOutOfCanvas.length - 1; q >=0; q--){
                laserBeams.splice(laserBeamIndexOutOfCanvas[q], 1);
            }
        } else {
            fallingObjectBoolean = true;
        }
        
        
        if (bigBoss.lives <= 0 && lives > 0) {
            fallingObjectBoolean = true;
            score += maxScore - bigBoss2MeetScore;
            bigBoss.lives = 0.1;
        }
    }
};

// the space background
var drawBackground = function() {
    //a black background
    background(black);
    
    //call the displayStars function to dislay stars
    displayStars();
    
}; 

//shows your scores
var drawPointboard = function() {
    
    //white
    fill(white);
    textAlign(CORNER);
    textSize(18);
    //show the score and lives
    text("Score: " + score.toFixed(1), 15, 30);
    text("Lives: ", 15, 55);
    fill(255, 0, 0);
    rect(60, 43, 200, 12);
    fill(lime);
    rect(60, 43, lives, 12);
    fill(white);
    text(lives, 265, 55);
    text("Level " + level, 15, 80);
    text("Difficulty: " + difficulty, 15, 105);
    
    
    //when lives is 0 playMode turns false so you lose
    if (lives <= 0) {
        lives = 0;
        playMode = false;
    }
    
    // so the prizes don't come often
    if (score % 50 === 0 && score > 0) {
        level++;
        score++;
    }
    

};




// you win the game
var loseGame = function() {
    if (playMode === false) {
        background(black);
        
        displayStars();
        
        textAlign(CENTER);
        textSize(40);
        text("You lost the Battle!", 200, 100);
        textSize(30);
        text("The Shifter aliens have taken over the \n Milky Way Galaxy!", 200, 160);
        
        textSize(20);
        fill(white);
        text("Get a second chance", 200, 261);
        
        fill(lime);
        rect(100, 280, 200, 40, 100);
        fill(white);
        textSize(25);
        fill(lime);
        rect(100, 330, 200, 40, 100);
        fill(white);
        text("Play Again!", 200, 310);
        text("Start Page", 200, 360);
    }
};



var startText1X = -10;
var startText2X = 410;
var playButtonSize = 70;
var playButtonX = 150;
var playButtonY = 240;

//when the game starts
var startGame = function() {
    if (playMode === 0) {
        
        //so the text slides from the sides and stops
        if (startText1X <= 170 && startText2X >= 230) {
            startText1X += 5;
            startText2X -= 5;
        }
        
        background(black);
        
        displayStars();
        
        textAlign(CENTER);
        textSize(40);
        text("Shifter", startText1X, 100);
        text("Sh", startText2X - 50, 140);
        image(getImage("minecraft/egg"), startText2X - 12, 130, 30, 30);
        image(getImage("minecraft/egg"), startText2X + 13, 130, 30, 30);
        text("ter", startText2X + 50, 140);
        
        //dodgerblue rgb
        noStroke();
        fill(30, 144, 255);
        rect(playButtonX, playButtonY, playButtonSize, playButtonSize, 20);
        fill(255);
        triangle(170, 258, 202, 273, 170, 293);
        
        if (mouseX >= 143 && mouseX <= 221 && mouseY >= 240 && mouseY <= 309) {
            playButtonSize = 80;
            playButtonX = 145;
            playButtonY = 235;
        } else {
            playButtonSize = 70;
            playButtonX = 150;
            playButtonY = 240;
        }
        
        //gold
        fill(255, 215, 0);
        
        //difficulty modes
        strokeWeight(3);
        
        if (easyMode === true) {
            stroke(lime);
        } else {
            stroke(white, 0);
        }
        
        rect(30, 340, 100, 30, 10);
        
        if (mediumMode === true) {
            stroke(lime);
        } else {
            stroke(white, 0);
        }
        
        rect(150, 340, 100, 30, 10);
        
        if (hardMode === true) {
            stroke(lime);
        } else {
            stroke(white, 0);
        }
        rect(270, 340, 100, 30, 10);
        
        if (sfx === true) {
            stroke(lime);
        } else {
            stroke(white, 0);
        } 
        rect(270, 270, 80, 30, 10);
        
        //black color
        fill(black);
        textSize(20);
        text("Easy", 80, 362);
        text("Medium", 200, 362);
        text("Hard", 320, 362);
        text("SFX", 310, 293);
        
        
        
        image(getImage("starwars/bb8"), 260, 90, 70, 70);
        image(getImage("starwars/r2d2"), 120, 130, 80, 70);
        
    }
};

//page for when you win
var winGame = function() {
    background(black);
        
    displayStars();
    
    textAlign(CENTER);
    textSize(40);
    text("You won the Battle!", 200, 100);
    textSize(30);
    text("The Shifter aliens won't take over the \n Milky Way Galaxy!", 200, 160);
    
    textSize(20);
    fill(white);
    text("But there might still be one left", 200, 261);
    
    fill(0, 255, 0);
    rect(100, 280, 200, 40, 100);
    fill(255);
    textSize(25);
    fill(0, 255, 0);
    rect(100, 330, 200, 40, 100);
    fill(255);
    text("Play Again!", 200, 310);
    text("Start Page", 200, 360);
};


//tells the short story/summary about the Shifter aliens and keys
var storyGame = function() {
    background(black);
        

    fill(white);
    textSize(25);
    text("The Shifter aliens are about \n to take over the Milky Way Galaxy! \n It is all up to you to defeat them. \n Beat them and the Big Bosses in \n your Hatch egg spaceship!", 200, 50);
    textSize(20);
    text("Keys: \n Fire: spacebar \n Left, Right, Up, Down: Arrows", 200, 250);

    fill(0, 255, 0);
    rect(253, 350, 124, 35, 50);
    rect(20, 350, 110, 35, 50);
    fill(255);
    textSize(30);
    text("Start!", 315, 378);
    text("Guide", 72, 378);
    
    
};


// the game guide to explain the rules
var gameGuide = function() {
    background(black);
    
    fill(white);
    textSize(20);
    text("Press spacebar for firing laser beams. \n You lose one 1 life xp if a Shifter \n laser beam hits your egg spaceship. \n Use the arrow format to move. \n Press the control key to stop the egg. \n Prizes fall down, hit them with your \n laser beams to get them. \n L: laser beam value increase \n I: 10 more lives \n s: score increase by 10 \n t: change the laser beam to triangle \n You reach to Big Boss' General, Big Boss 1 \n and Big Boss 2 \n when at score based on difficulty. \n If you beat all you win the game.", 200, 30);
    fill(lime);
    rect(11, 372, 54, 19, 20);
    fill(white);
    text("<-", 40, 387);
};


resetGame();


var draw = function() {
    // If the game started
    if (playMode === true) {
        drawBackground();
        drawPrizes();
        drawSpaceship();
        drawEnemy();
        drawBigBoss();
        
        drawPointboard();

    }
    
    // if you lose
    if (playMode === false) {
        loseGame();
    }
    
    //start page
    if (playMode === 0) {
        startGame();
    }
    
    // story and keys
    if (playMode === 1) {
        storyGame();
    }
    
    //game guide
    if (playMode === 2) {
        gameGuide();
    }
    
    //win game
    if (playMode === 3) {
        winGame();
    }
    
};


var keyPressed = function() {
    switch(keyCode) {
        // left arrow key - spaceship goes left
        case 37:
            spaceship.ySpeed = 0;
            spaceship.xSpeed = -3;
            break;
            
        // right arrow key - spaceship goes right
        case 39:
            spaceship.ySpeed = 0;
            spaceship.xSpeed = 3;
            break;
        
        // up arrow key - spaceship goes up
        case 38:
            spaceship.xSpeed = 0;
            spaceship.ySpeed = -3;
            break;
            
        // down arrow key - spaceship goes down
        case 40:
            spaceship.xSpeed = 0;
            spaceship.ySpeed = 3;
            break;
            
        // escape key - stop spaceship
        case 17:
            spaceship.xSpeed = 0;
            spaceship.ySpeed = 0;
            break;
        
        
        //spacebar key - shoot laser beam
        case 32:
            laserBeams.push(new LaserBeam(spaceship.x - 2, spaceship.y - 10, color(0, 255, 0), color(1, 50, 32), 10, 17));
            
            var music = "http://static1.grsites.com/archive/sounds/scifi/scifi039.mp3";
            var musicAudio = new Audio(music);
            
            if (sfx) {
                musicAudio.play();
            }
            break;
    }
};

var mouseClicked = function() {
    // lose game
    if (playMode === false) {
        // play again button
        if (mouseX > 100 && mouseX < 298 && mouseY > 280 && mouseY < 318) {
            playMode = true;
            resetGame();
        }
        // go to start page
        if (mouseX > 100 && mouseX < 298 && mouseY > 329 && mouseY < 365) {
            playMode = 0;
            
        }
    }
    
    // start page
    if (playMode === 0) {
        if (mouseX > 146 && mouseX < 220 && mouseY > 238 && mouseY < 311) {
            // start the story
            playMode = 1;
        }
        
        //easy mode button
        if (mouseX >= 24 && mouseX <= 130 && mouseY > 338 && mouseY < 372) {
            easyMode = !easyMode;
            mediumMode = false;
            hardMode = false;
        }
        
        //medium mode button
        if (mouseX >= 147 && mouseX <= 247 && mouseY > 338 && mouseY < 372) {
            easyMode = false;
            mediumMode = !mediumMode;
            hardMode = false;
        }
        
        //hard mode button
        if (mouseX >= 266 && mouseX <= 376 && mouseY > 338 && mouseY < 372) {
            easyMode = false;
            mediumMode = false;
            hardMode = !hardMode;
        }
        
        //if no mode is chosen
        if (easyMode === false && mediumMode === false && hardMode === false) {
            easyMode = true;
            mediumMode = false;
            hardMode = false;
        }
        
        if (mouseX >= 267 && mouseX <= 353 && mouseY >= 267 && mouseY <= 298) {
            sfx = !sfx;
        }
        
    }
    
    // story
    if (playMode === 1) {
        if (mouseX > 246 && mouseX < 377 && mouseY > 349 && mouseY < 382) {
            // start the game
            playMode = true;
            //reset all the lives
            resetGame();
        }
        if (mouseX > 19 && mouseX < 131 && mouseY > 349 && mouseY < 382) {
            // go to the guide
            playMode = 2;
        }
    }
    
    // guide
    if (playMode === 2) {
        if (mouseX > 10 && mouseX < 66 && mouseY > 371 && mouseY < 392) {
            //go back to story
            playMode = 1;
        }
    }
    
    // winning page
    if (playMode === 3) {
        if (mouseX > 100 && mouseX < 298 && mouseY > 280 && mouseY < 318) {
            playMode = true;
            resetGame();
        }
        if (mouseX > 100 && mouseX < 298 && mouseY > 329 && mouseY < 365) {
            playMode = 0;
            
        }
    }
};
