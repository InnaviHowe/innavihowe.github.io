/*
# JustIT Skills BootCamp Project
# Codee: A.M. Howe (InnaviHowe) AUG 2023
    Project title: 2D JS CANVAS GAME DEMO
# All artwork is original to my 2003 Java Internet game	
# File name: app.js
# Details: Javascript - 
# Function(s):
    lots of functions
*/

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


/* SETUP GAME CANVAS*/
var canvas = document.createElement('canvas');
canvas.setAttribute("id", "myGameCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 525;
document.body.appendChild(canvas);
console.log(`Canvas info: width = ${canvas.width} height= ${canvas.height}`);


/* SOME MAIN GAME STATE VARIABLES*/
var GAMEPAUSED;
var lastTime;

////////////////////////////////
/* Initialise the game - 
display splash screen and call level 1*/
//////////////////////////////
function init() {
    // DISPLAY splash-screen
    document.getElementById('splash-screen').innerHTML=`<img src='./img/forabout.png' style="width:480px; height:525px;"></img>`;
    document.getElementById('btn-gamebegin-newgame').innerText=`START`;
    document.getElementById('btn-gamebegin-howtoplay').innerText=`CONTROLS`;
    document.getElementById('btn-gamebegin-about').innerText=`ABOUT`;
    document.getElementById('splash-screen').style.display='block';
    
    // DISPLAY splash screen NEW GAME (with msg and 2 btns newGame howtoplay)
    document.getElementById('game-title').innerHTML= `All for the Melee<br> [DEMO]`;
    document.getElementById('game-welcome').innerHTML= `<p> Old skool gaming - few bells and whistles!<br>Please enjoy!`;

    document.getElementById('splash-gamebegin-newgame').style.display='block';
    
    // TRIGGER EVENTLISTENER: btn-gamebegin-newgame
    document.getElementById('btn-gamebegin-newgame').addEventListener('click', function(){   
        //Call Level 1
        levelOne();    
    });        
    
    // TRIGGER EVENTLISTENER: btn-gamebegin-howtoplay
    document.getElementById('game-rules').innerHTML= `CONTROLS`;
    document.getElementById('btn-close-HowTo').innerText=`CLOSE`;
    document.getElementById('btn-gamebegin-howtoplay').addEventListener('click', function(){
        // DISPLAY splash screen HOWtoPLAY (with msg and 1 btn CLOSE)
        document.getElementById('splash-gamebegin-newgame').style.display='none';
        document.getElementById('splash-game-howtoplay').style.display='block';
        document.getElementById('game-howto').innerHTML= `<p> MOVE -  use the Arrow keys <br>
        PAUSE - press P or p <br>
        SPACEBAR - to fire <br>`;

        // TRIGGER internal EVENTLISTENER: btn-close-HowTo
        document.getElementById('btn-close-HowTo').addEventListener('click', function(){
            // DISPLAY splash screen HOWtoPLAY (with msg and 1 btn CLOSE)
            document.getElementById('splash-game-howtoplay').style.display='none';
            document.getElementById('splash-gamebegin-newgame').style.display='block';
        });

    });

    // TRIGGER EVENTLISTENER: btn-gamebegin-about
    document.getElementById('game-about').innerHTML= `ABOUT`;
    document.getElementById('btn-close-about').innerText=`CLOSE`;
    document.getElementById('btn-gamebegin-about').addEventListener('click', function(){
        // DISPLAY splash screen ABOUT (with msg and 1 btn CLOSE)
        document.getElementById('splash-gamebegin-newgame').style.display='none';
        document.getElementById('splash-game-about').style.display='block';
        document.getElementById('game-aboutgame').innerHTML= `<h2>All for the Melee<br>
         [DEMO]</h2><br>
         <small>All artwork, Designed and created by InnaviHowe 2023, &copy puiggysoft 1995-2023</small>
         <div class="footnote">
      <small>&#169; Designed and created by InnaviHowe (aka. A.M. Howe) 2023, all artwork and prose is original and owned by the content provider AMHowe (AMGHowe) via &#169 StreetsChronic Designs and &#169 puiggysoft 1993-2023</small>
  </div>`;

        // TRIGGER internal EVENTLISTENER: btn-close-about
        document.getElementById('btn-close-about').addEventListener('click', function(){
            // DISPLAY splash screen ABOUT (with msg and 1 btn CLOSE)
            document.getElementById('splash-game-about').style.display='none';
            document.getElementById('splash-gamebegin-newgame').style.display='block';
        });
    });
}

/////////////////////////
/* BEGIN MAIN GAME LOOP*/
////////////////////////
function main() {
    if (GAMEPAUSED == false) {
        var now = Date.now();  // time in millisecinds
        var dt = (now - lastTime) / 1000.0;
       // console.log(`now = ${now} , dt = ${dt}`);
        update(dt);
        render();

        lastTime = now;
        requestAnimFrame(main);
    }
}

/* GAME IMAGE RESOURCES - see resources.js*/
resources.load([
    'img/lt_backgroundSpritesD.png',
    'img/lt_decorSpritesD.png',
    'img/lt_playerSpritesC.png',
    'img/lt_enemySpritesC.png',
    'img/lt_bossLSpritesC.png',
    'img/lt_bossLSpritesE.png',
    'img/lt_explosionSpritesC.png'
]);
resources.onReady(init);


/* GLOBAL GAME VARIABLES */
var abackground;
var decor1;
var decor2;

var player;
var playerHealth = 1000; // health of player
var playerScore = 0; // the player Score

var scoreInfo = document.getElementById('player-score');
var playerLevel = "Starting..."
var playerInfo = document.getElementById('player-info-ammo');

var smarts = [];
var exitPortal;

var MAX_ENEMY =50;
var enemies = []; 
var enemyCounter = 0;

var eGenCounter = 0; // ALL ENEMIES GENRATED PER LEVEL

var enemyFireCount = 0; // addEnemyFire

var explosions = [];

/* Level 6 boss stuff */
var boss;
var driller;
var bosshits = 1000;
var bossOilhits = 0;
var oilSlick;

/* Game thread counter */
var isGameOver; 
var tdelay = Date.now(); //milliseconds
var gameTime = 0; // seconds

/* BOOLEAN game level over states */
var isLevel1Over;
var isLevel2Over;
var isLevel3Over;
var isLevel4Over;
var isLevel5Over;

/* BOOLEAN game level in play states */
var LEVEL1; // trek ( space background )
var LEVEL2; // manta ( space/earth cloudy background)
var LEVEL3; // scolder ( desert  background )
var LEVEL4; // maverick (water background)
var LEVEL5; // skull pre-boss level
var LEVEL6; // boss level 

/* BOOLEAN player fire states*/
var SHOOTUP = true;
var SHOOTDOWN = false;
var SHOOTLEFT = false;
var SHOOTUL1 = false;
var SHOOTDL2 = false;
var SHOOTRIGHT = false;
var SHOOTUR1 = false;
var SHOOTDR2 = false;

/* INTEGERS game object velocities */
var playerSpeed = 200;
var smartSpeed = 500;
var enemySpeed = 100;
var bossSpeed = 100;
var bossbombSpeed = 75;

////////////////////////////////////
/* ADD A BACKGROUND TO THE SCREEN */
///////////////////////////////////
function addBackground() {
    abackground = {
        pos: [0, 0],
        name: 'backdrop',
        sprite: new Sprite('backdrop','img/lt_backgroundSpritesD.png', [0, 0], [480, 525], 8, [0, 1,2,3])
    };
}
/////////////////////
/* ADD LEVEL DECOR */
////////////////////
function addDecor(decnum) {
    if (decnum == 1) {
        //empty
        decor1 = {
            pos: [0, 0],
            name: 'decor1',
            sprite: new Sprite('decor1','img/lt_decorSpritesD.png', [0, 0], [0, 0], 1, [0,0])
        };
        //empty
        decor2 = {
            pos: [0, 0],
            name: 'decor2',
            sprite: new Sprite('decor1','img/lt_decorSpritesD.png', [0, 0], [0, 0], 1, [0,0])
        };
    }
    // manta - water  
    else if (decnum == 2) {
        //waves
        decor1 = {
            pos: [0, canvas.height - 300],
            name: 'decor1',
            sprite: new Sprite('decor1','img/lt_decorSpritesD.png', [0, 530], [480, 300], 1, [0, 1,2,3])
        };
        //panel
        decor2 = {
            pos: [0, 0],
            name: 'decor2',
            sprite: new Sprite('decor2','img/lt_decorSpritesD.png', [0, 832], [480, 292], 1, [0, 1,2,3])
        };
    }
    // maverick - oasis  
    else if (decnum ==3) {
        //plants
        decor1 = {
            pos: [0, canvas.height - 300],
            name: 'decor1',
            sprite: new Sprite('decor1','img/lt_decorSpritesD.png', [0, 1130], [480, 300], 4, [0, 1,2,3])
        };
        // empty
        decor2 = {
            pos: [0, 0],
            name: 'decor2',
            sprite: new Sprite('decor2','img/lt_decorSpritesD.png', [0, 0], [0, 0], 1, [0,0])
        };
    }    
       // scolder - desert  
    else if (decnum ==4) {
        //plants
        decor1 = {
            pos: [0, canvas.height - 281],
            name: 'decor1',
            sprite: new Sprite('decor1','img/lt_decorSpritesD.png', [0, 2570], [480, 281], 4, [0, 1,2,3])
        };
        //panel
        decor2 = {
            pos: [0, 0],
            name: 'decor2',
            sprite: new Sprite('decor2','img/lt_decorSpritesD.png', [0, 0], [0, 0], 1, [0,0])
        };
    }     
}


////////////////////
/* ADD THE PLAYER */
///////////////////
function addPlayer() {
    player = {
        pos: [0, 0],
        name: 'aimer',
        sprite: new Sprite('aimer','img/lt_playerSpritesC.png', [0, 0], [30, 30], 16, [0, 0])
    };
}
//////////////////////////////////
// ADD PLAYER AMMO TO THE SCREEN
/////////////////////////////////
function addSmartRocket(x,y, direction) {
    if( direction = 'left') {
        smarts.push({ pos: [x, y],
            dir: direction,
            sprite: new Sprite('rocket', 'img/lt_playerSpritesC.png', [0, 47], [20, 6], 2, [0,1]) });
    }
    if (direction = 'right') {
        smarts.push({ pos: [x, y],
            dir: direction,
            sprite: new Sprite('rocket', 'img/lt_playerSpritesC.png', [0, 53], [20, 6], 2, [0,1]) });
    }
}
function addSmartURocket(x,y, direction) {
    if( direction = 'uleft') {
        smarts.push({ pos: [x, y],
            dir: direction,
            sprite: new Sprite('rocket', 'img/lt_playerSpritesC.png', [35, 14], [10, 10], 2, [0,0]) });
    }
    if (direction = 'uright') {
        smarts.push({ pos: [x, y],
            dir: direction,
            sprite: new Sprite('rocket', 'img/lt_playerSpritesC.png', [35, 1], [10, 12], 2, [0,0]) });
    }
}
function addSmartDRocket(x,y, direction) {
    if( direction = 'dleft') {
        smarts.push({ pos: [x, y],
            dir: direction,
            sprite: new Sprite('rocket', 'img/lt_playerSpritesC.png', [35,62], [10, 12], 2, [0,0]) });
    }
    if (direction = 'dright') {
        smarts.push({ pos: [x, y],
            dir: direction,
            sprite: new Sprite('rocket', 'img/lt_playerSpritesC.png', [35,76], [10, 10], 2, [0,0]) });
    }
}
function addSmartDisc(x,y, direction) {
    smarts.push({ pos: [x, y],
        dir: direction,
        sprite: new Sprite('rocket', 'img/lt_playerSpritesC.png', [0, 31], [15, 15], 3, [0,1,2]) });
}

//////////////////////////////////
// ADD AN EXPLOSION TO THE SCREEN
/////////////////////////////////
function addExplosion(pos, size) {
    // Add an explosion
    explosions.push({
        pos: pos,
        sprite: new Sprite('explode', 'img/lt_explosionSpritesC.png',
                           [0, 0],
                           [88, 88],
                           16,
                           [0, 1, 2, 3],
                           null,
                           true)
    });
    // explosions.push({
    //     pos: pos,
    //     sprite: new Sprite('explode', 'img/lt_explosionSpritesC.png',
    //                        [0, 0],
    //                        [88, 88],
    //                        2,
    //                        [0, 1, 2, 3, 4, 5, 6, 7, 8],
    //                        null,
    //                        true)
    // });
}

//////////////////////////////////////////
// ADD LEVEL 1 - ENEMY TREK TO THE SCREEN
//////////////////////////////////////////
/* Level 1 enemy - Right to left movement */  
function addTrek(){
    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime //if(Math.random() < 1 - Math.pow(.993, gameTime)) {
    //eGenCounter = eGenCounter + 1;
    if (LEVEL1 == true && GAMEPAUSED == false && !isLevel1Over && !isGameOver) {
        eGenCounter = eGenCounter + 1;
        enemies.push({
            pos: [canvas.width, Math.random() * (canvas.height/2 - 30)],           
            name: 'trek',
            sprite: new Sprite('trek', 'img/lt_enemySpritesC.png', [0, 0], [50, 30], 1,[0, 1, 2, 3])
        });
        //eGenCounter = eGenCounter + 1; 
    }
}

////////////////////////////////////////////////
// ADD LEVEL 2 - ENEMY MANTA TREK TO THE SCREEN
///////////////////////////////////////////////
/* Level 2 enemy - Bottom to top movement */
function addManta(){
    if (LEVEL2) { // == true && GAMEPAUSED == false && !isLevel2Over && !isGameOver) {
        eGenCounter = eGenCounter + 1;
        if (eGenCounter % 30 == 0) {
            enemies.push({
                pos: [ Math.random() *(canvas.width-60), canvas.height-40],
                //pos: [ getEmptyPosition(60,40)],
                name: 'manta',
                sprite: new Sprite('manta', 'img/lt_enemySpritesC.png', [0, 30], [60, 40],
                                1, [0,1,2,3])
            });
        }
        if (eGenCounter % 40 == 0) {
            enemies.push({
                pos: [ Math.random() *(canvas.width-60), canvas.height/3 +40],
                //pos: [ getEmptyPosition(60,40)],
                name: 'manta',
                sprite: new Sprite('manta', 'img/lt_enemySpritesC.png', [0, 30], [60, 40],
                                1, [0,1,2,3])
            });
        }
    }
}
//////////////////////////////////////////////
// ADD LEVEL 3 - ENEMY MAVERICK TO THE SCREEN
/////////////////////////////////////////////
/* Level 3 enemy - left to right movement */
function addMaverick(){
    if (LEVEL3) { //== true && GAMEPAUSED == false && !isLevel3Over && !isGameOver) {                
        eGenCounter = eGenCounter + 1;
        if (eGenCounter % 30 == 0) {    
            enemies.push({
                pos: [0, Math.random() * (canvas.height/2)],
                name: 'maverick',
                sprite: new Sprite('maverick', 'img/lt_enemySpritesC.png', [0, 70], [60, 40],
                                    2, [0,1,2,3])
            });
        }
    }
}
//////////////////////////////////////////////
// ADD LEVEL 4 - ENEMY SCOLDER TO THE SCREEN
/////////////////////////////////////////////
/* Level 4 enemy - top to down movement */
function addScolder() {
    if (LEVEL4) { //== true && GAMEPAUSED == false && !isLevel4Over && !isGameOver) {    
        eGenCounter = eGenCounter + 1;
        if (eGenCounter % 30 == 0) {      
            enemies.push({
                pos: [Math.random() *(canvas.width-70), 0],
                name: 'scolder',
                sprite: new Sprite('scolder', 'img/lt_enemySpritesC.png', [0, 110], [70, 40],
                                4, [0, 1])
            });
        }
    }
}
//////////////////////////////////////////////
// ADD LEVEL 5 - ENEMY SKULL TO THE SCREEN
/////////////////////////////////////////////
/*  Pre-boss Level 5 enemy -  random appearance */
function addSkull() {
    if (LEVEL5) { // == true && GAMEPAUSED == false && !isLevel5Over && !isGameOver) {                
        eGenCounter = eGenCounter + 1;
        if (eGenCounter % 50 == 0) {      
            enemies.push({
                pos: [Math.random() * (canvas.width-40), Math.random() * (canvas.height-50)],
                name: 'skull',
                sprite: new Sprite('skull', 'img/lt_enemySpritesC.png', [0, 150], [40, 50],
                                1, [0,1,2,3])
            });
        }
    }
}
////////////////////////////////////////////////
// ADD LEVEL 2 - ENEMY MANTA FIRE TO THE SCREEN
///////////////////////////////////////////////
/* enemy fire - manta */
function addEnemyFire(enemyPos, enemySize){
    var x = enemyPos[0] + enemySize[0]/4;
    var x1 = enemyPos[0] + enemySize[0]-8;
    var y = enemyPos[1];

    enemyFireCount = enemyFireCount+1;
    enemies.push ({
        pos: [x, y],
        name: 'enemyfire',
        sprite: new Sprite('enemyfire','img/lt_enemySpritesC.png', [0, 200], [15, 40], 2, [0, 1])
    });
}
////////////////////////////////////////////////
// ADD LEVEL 3 - ENEMY MAVERICK FIRE TO THE SCREEN
///////////////////////////////////////////////
/* enemy bomb - maverick */
function addEnemyBomb(enemyPos, enemySize){
    var x = enemyPos[0] + enemySize[0]/2 - 4;
    var x1 = enemyPos[0] + enemySize[0]-4
    var y = enemyPos[1];

    enemyFireCount = enemyFireCount+1;
    enemies.push ({
        pos: [x, y],
        name: 'enemybomb',
        sprite: new Sprite('enemybomb','img/lt_enemySpritesC.png', [0, 291], [8, 8], 4, [0, 1,2,3])
    });
    enemies.push ({
        pos: [x1, y],
        name: 'enemybomb',
        sprite: new Sprite('enemybomb','img/lt_enemySpritesC.png', [0, 291], [8, 8], 4, [0, 1,2,3])
    });
}
////////////////////////////////////////////////
// ADD LEVEL 2 - ENEMY SCOLDER FIRE TO THE SCREEN
///////////////////////////////////////////////
/* enemy comet - scolder */
function addEnemyComet(enemyPos, enemySize) {
    //console.log(`IN addEnemyComet - ENEMYCOMET ADDED`);
    //if ( playerScore > 11000) {
        var x = enemyPos[0] + enemySize[0]/2;
        var y = enemyPos[1] + enemySize[1]/2;

        enemyFireCount = enemyFireCount+1;
        enemies.push ({
            pos: [x, y],
            name: 'enemycomet',
            sprite: new Sprite('enemycomet','img/lt_enemySpritesC.png', [0, 240], [30, 50], 4, [0,1,2,3])
        });
}
////////////////////////////////////////////////
// ADD LEVEL 5 - ENEMY SKULL FIRE TO THE SCREEN
///////////////////////////////////////////////
/* enemy pellet -  skull */
function addEnemyPellet(enemyPos, enemySize, diro) {
    var x = enemyPos[0] + enemySize[0]/2;
    var y = enemyPos[1] + enemySize[1]/2;

    enemyFireCount = enemyFireCount+1;
    //left
    if( diro =1) {
        enemies.push({ pos: [x, y],
            name: 'enemypellet1',
            sprite: new Sprite('enemypellet1', 'img/lt_enemySpritesC.png', [33, 292], [12, 3], 2, [0,1]) });
    }
    //right
    if (diro =2) {
        enemies.push({ pos: [x, y],
            name: 'enemypellet2',
            sprite: new Sprite('enemypellet2', 'img/lt_enemySpritesC.png', [57, 292], [12, 3], 2, [0,1]) });
    }
    //up
    if( diro =3) {
        enemies.push({ pos: [x, y],
            name: 'enemypellet3',
            sprite: new Sprite('enemypellet3', 'img/lt_enemySpritesC.png', [120, 285], [3, 12], 2, [0,1]) });
    }
    //down
    if (diro =4) {
        enemies.push({ pos: [x, y],
            name: 'enemypellet4',
            sprite: new Sprite('enemypellet4', 'img/lt_enemySpritesC.png', [128, 285], [3, 12], 2, [0,1]) });
    }
}

/////////////////////////////
// ADD and DRILLER LEVEL 6
////////////////////////////
/* Boss Level 5 - up-down - forward-back  */
function addBoss(numBoss, pos){
    //if ( playerScore > 11000  && enemies.length < bossCount) {
    // /initial boss ship image 
    console.log(`IN addBoss - BOSS number ${numBoss} ADDED`);
    //GREEN TO GREY
    if (numBoss == 1) {
    boss = ({
            pos: [pos], //canvas.width-150, 0],
            name: 'boss',
            //sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
            //sprite: new Sprite('boss','img/lt_bossLSpritesD.png', [0, 156], [200, 150], 1, [0,1,2,3,4,5])
            sprite: new Sprite('boss','img/lt_bossLSpritesE.png', [0, 0], [200, 150], 6, [0,1,2,3,4,5])
        });
        return boss;
    }
    //GREY TO GREEN
    if (numBoss == 2) {
        boss = ({
                pos: [pos], //canvas.width-150, 0],
                name: 'boss',
                //sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
                //sprite: new Sprite('boss','img/lt_bossLSpritesD.png', [200, 156], [200, 150], 1, [0,0])
                sprite: new Sprite('boss','img/lt_bossLSpritesE.png', [0, 165], [200, 150], 6, [0,1,2,3,4,5])
            });
        return boss;
    }
    //GREY TO YELLOW
    if (numBoss == 3) {
            boss = ({
                    pos: [pos], //canvas.width-150, 0],
                    name: 'boss',
                    //sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
                    //sprite: new Sprite('boss','img/lt_bossLSpritesD.png', [400, 156], [200, 150], 1, [0,0])
                    sprite: new Sprite('boss','img/lt_bossLSpritesE.png', [0, 335], [200, 150], 6, [0,1,2,3,4,5])
                });
            return boss;
    }
    //GREY TO BLUE
    if (numBoss == 4) {
        boss = ({
                pos: [pos], //canvas.width-150, 0],
                name: 'boss',
                //sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
                //sprite: new Sprite('boss','img/lt_bossLSpritesD.png', [600, 156], [200, 150], 1, [0,0])
                sprite: new Sprite('boss','img/lt_bossLSpritesE.png', [0, 505], [200, 150], 6, [0,1,2,3,4,5])
            });
        return boss;
    }
    //GREY TO RED
    if (numBoss == 5) {
        boss = ({
                pos: [pos], //canvas.width-150, 0],
                name: 'boss',
                //sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
                //sprite: new Sprite('boss','img/lt_bossLSpritesD.png', [600, 156], [200, 150], 1, [0,0])
                sprite: new Sprite('boss','img/lt_bossLSpritesE.png', [0, 665], [200, 150], 6, [0,1,2,3,4,5])
            });
        return boss;
    }
    //OILY SHELL
    if (numBoss == 6) {
        boss = ({
                pos: [pos], //canvas.width-150, 0],
                name: 'boss',
                //sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
                //sprite: new Sprite('boss','img/lt_bossLSpritesD.png', [600, 156], [200, 150], 1, [0,0])
                sprite: new Sprite('boss','img/lt_bossLSpritesE.png', [0, 825], [200, 150], 6, [0,1,2,3,4,5])
            });
        return boss;
    }
    //DRILLING
    if (numBoss == 7) {
        driller = ({
                pos: [canvas.width/2, canvas.height/2,],
                name: 'driller',
                //sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
                //sprite: new Sprite('boss','img/lt_bossLSpritesD.png', [600, 156], [200, 150], 1, [0,0])
                sprite: new Sprite('driller','img/lt_bossLSpritesE.png', [0, 985], [200, 207], 6, [0,1,2,3,4,5])
            });
        return driller;
    }
    //return boss;
};
//////////////////////////////////////////
/* ADD BOSS BOMBS & RING FIRE */
//added to the global [bossFirePower] array
///////////////////////////////////////////
/* Level 6 - boss bombs */
function addBossBomb(bossPos){
    var x = bossPos[0] + 10;
    var y = bossPos[1] + boss.sprite.size[1]-51;
    var x1 = bossPos[0] + boss.sprite.size[0] - 10;
    var y1 = bossPos[1] + boss.sprite.size[1]-51;
    enemyFireCount = enemyFireCount+2;
    if (enemyFireCount % 4) {
        enemies.push ({
            pos: [x, y],
            name: 'bossbomb',
            sprite: new Sprite('bossbomb','img/lt_bossLSpritesC.png', [0, 307], [20, 50], 7, [0,1,2,3,4,5,6])
        });
    }
    
    if (enemyFireCount % 5) {
        enemyFireCount = enemyFireCount+2;
        enemies.push ({
            pos: [x1, y1],
            name: 'bossbomb',
            sprite: new Sprite('bossbomb','img/lt_bossLSpritesC.png', [0, 307], [20, 50], 7, [0,1,2,3,4,5,6])
        });
    }
};
/* Level 6 - boss rings */
function addBossRing(bossPos){
    var x = bossPos[0];
    var y = bossPos[1];
    var rndBossRing = Math.floor(Math.random() * 4);
    enemyFireCount = enemyFireCount+2;
    if (enemyFireCount % 4) {
        switch (rndBossRing) {
            case 0: {
                enemyFireCount = enemyFireCount+2;
                x = bossPos[0]+ boss.sprite.size[0]-21;
                y = bossPos[1] + 1;
                enemies.push ({
                    pos: [x, y],
                    name: 'bossring',
                    sprite: new Sprite('bossring','img/lt_bossLSpritesC.png', [1, 361], [20, 20], 4, [0,1,2,3])
                });
            } break;

            case 1: {
                enemyFireCount = enemyFireCount+2;
                x = bossPos[0]+ 31;
                y = bossPos[1] + 1;
                enemies.push ({
                    pos: [x, y],
                    name: 'bossring',
                    sprite: new Sprite('bossring','img/lt_bossLSpritesC.png', [1, 382], [30, 30], 4, [0,1,2,3])
                });
            } break;

            case 2: {
                enemyFireCount = enemyFireCount+2;
                x = bossPos[0]+ boss.sprite.size[0]-51;
                y = bossPos[1] + 1;
                enemies.push ({
                    pos: [x, y],
                    name: 'bossring',
                    sprite: new Sprite('bossring','img/lt_bossLSpritesC.png', [1, 413], [50, 50], 4, [0,1,2,3])
                });
            } break;

            case 3: {
                enemyFireCount = enemyFireCount+2;
                x = bossPos[0]+ 71;
                y = bossPos[1] + 1;
                enemies.push ({
                    pos: [x, y],
                    name: 'bossring',
                    sprite: new Sprite('bossring','img/lt_bossLSpritesC.png', [1, 464], [70, 70], 4, [0,1,2,3])
                });
            } break;
            default: rndBossRing = 0;
        }
    }
};
//////////////////////////////////
/* ADD OILSLICK OVERLAY LEVEL 6 */
//////////////////////////////////
/* oilslick overlay for level 6 - used for Boss bombs collision*/
function addOilSlick(locPosX, locPosY){
    var x = locPosX;
    var y = locPosY;
    oilSlick = {
        pos: [x,y], 
        name: 'oilslick',
        sprite: new Sprite('oilslick','img/lt_bossLSpritesC.png', [0, 10], [500, 145], 2, [0,1])
    };
};
//////////////////////////
/* ADD OILSPLASHES LEVEL 6
//////////////////////////
/*oilsplashes (explosions) */
function addOilSplash(splashPos){
    var x = splashPos[0];
    var y = splashPos[1];
    explosions.push = {
        pos: [x,y],
        name: 'oilsplash',
        sprite: new Sprite('oilsplash','img/lt_bossLSpritesC.png', [0, 0], [40,10], 12, [0,1,2,3,4], null, true)
    };
};

//////////////////////
/* UPDATE the levels*/
//////////////////////
function update(dt) {
    //console.log(`---GO: ${isGameOver} P: ${GAMEPAUSED}L1: ${LEVEL1}, L2:${LEVEL2}, L3:${LEVEL3}, L4:${LEVEL4}, L5:${LEVEL5}, , L6:${LEVEL6}`);
    if (!isGameOver && GAMEPAUSED == false) {        
        // start game timer
        gameTime += dt;
        // user input
        handleInput(dt);

        if (LEVEL1==true || LEVEL2==true || LEVEL3==true || LEVEL4==true || LEVEL5==true ) {
            updateAllLevelOne(dt)
            if (LEVEL1 == true ) {
                addTrek();
            } 
            else if (LEVEL2 == true ) {
                addManta();
            }
            else if (LEVEL3 == true ) {
                addMaverick();
            }
            else if (LEVEL4 == true ) {
                addScolder();
            }
            else if (LEVEL5 == true) { 
                addSkull();
            }
            checkCollisionAllLevelOne(dt);
            playerInfo.innerHTML = `PH:${playerHealth} - EH:${enemyCounter} of EC: ${eGenCounter}`;
        } 
        else if (LEVEL6 == true) {
            updateBossLevel(dt);
            checkCollisionBossLevelSix(dt);
            playerInfo.innerHTML = `PH:${playerHealth} - BH:${bosshits} - BO: ${bossOilhits} -BF:${enemyFireCount}`;
        }
      
        if (LEVEL1) { playerLevel = "LEVEL-1";}
        if (LEVEL2) { playerLevel = "LEVEL-2";}
        if (LEVEL3) { playerLevel = "LEVEL-3";}
        if (LEVEL4) { playerLevel = "LEVEL-4";}
        if (LEVEL5) { playerLevel = "LEVEL-5";}
        if (LEVEL6) { playerLevel = "BOSS-LEVEL";}
    }
    // Display player level and score info
    scoreInfo.innerHTML = `LVL:${playerLevel} = ${playerScore}, `;
};

////////////////////////////////////////////
// PLAYER MOVEMENT HANDLER - see input.js
////////////////////////////////////////////
/* player aimer movement on keyboard input*/
function handleInput(dt) {
    if(oninput.isDown('DOWN') || oninput.isDown('s')) {
        player.pos[1] += Math.floor(playerSpeed * dt);
    }

    if(oninput.isDown('UP') || oninput.isDown('w')) {
        player.pos[1] -= Math.floor(playerSpeed * dt);
    }

    if(oninput.isDown('LEFT') || oninput.isDown('a')) {
        player.pos[0] -= Math.floor(playerSpeed * dt);
    }

    if(oninput.isDown('RIGHT') || oninput.isDown('d')) {
        player.pos[0] += Math.floor(playerSpeed * dt);
    }
    if(oninput.isDown('PAUSE') || oninput.isDown('p')) {      
        GAMEPAUSED = true;
        tdelay = Date.now();;
        pauseGame();    
    }

    if(oninput.isDown('SPACE') &&
       !isGameOver && !GAMEPAUSED &&
       Date.now() - tdelay > 100) {
        var x = player.pos[0] + player.sprite.size[0] / 2;
        var y = player.pos[1] + player.sprite.size[1] / 2;
        
        if (SHOOTLEFT) { addSmartRocket(x,y, 'left'); }
        // upper left missile
        if (SHOOTUL1) { addSmartURocket(x,y-6, 'uleft'); }
        // bottom left missile
        if (SHOOTDL2) { addSmartDRocket(x,y+6, 'dleft'); }
        if ( SHOOTUP ) { addSmartDisc(x,y, 'up'); }
        if ( SHOOTDOWN ) { addSmartDisc(x,y, 'down'); }
        if ( SHOOTRIGHT ) { addSmartRocket(x,y, 'right'); }
        // upper right missle
        if ( SHOOTUR1 ) { addSmartURocket(x,y-6, 'uright'); }
        // lower right missle
        if ( SHOOTDR2 ) { addSmartDRocket(x,y+6, 'dright'); }
        tdelay = Date.now();
    }
} 

////////////////////////////////
// LEVEL 6 - UPDATE BOSS LEVEL 
////////////////////////////////
function updateBossLevel(dt) {   
        
    try {
        player.sprite.update(dt);
        // Update all the smarts
        for(var i=0; i<smarts.length; i++) {
            var smart = smarts[i];

            switch(smart.dir) {
            case 'up': smart.pos[1] -= smartSpeed * dt; break;    
            case 'down': smart.pos[1] += smartSpeed * dt; break;
            case 'left': smart.pos[0] -= smartSpeed * dt; break;
            case 'uleft': smart.pos[0] -= smartSpeed * dt; smart.pos[1] -= smartSpeed * dt; break; 
            case 'dleft': smart.pos[0] -= smartSpeed * dt; smart.pos[1] += smartSpeed * dt; break;
            case 'right': smart.pos[0] += smartSpeed * dt; break;
            case 'uright': smart.pos[0] += smartSpeed * dt; smart.pos[1] -= smartSpeed * dt; break; 
            case 'dright': smart.pos[0] += smartSpeed * dt; smart.pos[1] += smartSpeed * dt; break;
            default:
                smart.pos[1] -= smartSpeed * dt;
            }

            // Remove the smart if it goes offscreen
            if( smarts[i].pos[0] + smarts[i].sprite.size[0] < 0 ||
                smarts[i].pos[0] + smarts[i].sprite.size[0] > canvas.width ||
                smarts[i].pos[1] + smarts[i].sprite.size[1] < 0 ||
                smarts[i].pos[1] + smarts[i].sprite.size[1] > canvas.height ) {
                smarts.splice(i, 1);
                i--;
            }
        } // end for smarts loop

        // Update driller sprite movement
        if(Math.floor(gameTime % 10) == 0 ) {
            driller.pos[0] -= 2*bossSpeed * dt;
            if(Math.floor(bosshits % 20) == 0 ) {            
                //if (Date.now() - tdelay > 100) {
                    addBossRing(driller.pos);
                //    tdelay = Date.now();
                //}  
            }
        } else {
            driller.pos[0] += 1.5*bossSpeed * dt;
        }
        driller.sprite.update(dt);

        if(Math.floor(gameTime % 5) == 0 ) {
            console.log(gameTime);
            boss.pos[0] += 2*bossSpeed * dt;
            if(Math.floor(bosshits % 30) == 0 ) {            
                if (Date.now() - tdelay > 50) {  
                    addBossBomb(boss.pos);
                    tdelay = Date.now();
                }
            } 
        }
        else { 
            boss.pos[0] -= 2*bossSpeed * dt;
        }

        // // Update boss sprite costume
        // see checkcollisonBossLevelSix
      
        boss.sprite.update(dt);

        for(var b=0; b< enemies.length; b++) {            
            var bossfire = enemies[b];
            switch(bossfire.name) {
                case 'bossbomb': {
                    bossfire.pos[1] += 2*bossbombSpeed * dt;
                } break;
                case 'bossring': {
                    bossfire.pos[1] += 2*bossbombSpeed * dt; 
                } break;
                default:
                    bossfire.pos[1] += bossbombSpeed * dt;
            }
            enemies[b].sprite.update(dt);

            if(enemies[b].pos[0] + enemies[b].sprite.size[0] < 0) {
                enemies.splice(b, 1);
                b--;
            }
        }
        // Update all the explosions
        for(var i=0; i < explosions.length; i++) {
            explosions[i].sprite.update(dt);
            // Remove explosion if animation is done
            if(explosions[i].sprite.done) {
                explosions.splice(i, 1);
                i--;
            }
        }
        abackground.sprite.update(dt);
        oilSlick.sprite.update(dt);
    }
    catch (myerror) {
        console.log(`ERROR MESSAGE : - ${myerror}`);
    }
}

////////////////////////////////////////
// LEVEL 6 - CHECK COLLISION BOSS LEVEL
////////////////////////////////////////
function checkCollisionBossLevelSix(dt) {
    try {
        checkSpriteBounds(player);
        checkSpriteBounds(boss);
        checkSpriteBounds(driller);
        var pos4 = boss.pos;
        var size4 = boss.sprite.size;
        var bosshitcounter=0;
        for(var f=0; f<smarts.length; f++) {
            var pos5 = smarts[f].pos;
            var size5 = smarts[f].sprite.size;
            //var k =0;
            if(ammoCollides(pos4, size4, pos5, size5)) {
                // increment for each collision
                bosshitcounter = bosshitcounter++;
                // for every 25 hits decrement booshits counter
                if (bosshitcounter % 10 == 0){
                    bosshits = bosshits -5;
                    bossOilhits = bossOilhits -10;
                    // Update boss sprite costume
                    // green to grey
                    if (Math.floor(bosshits >=750 && bosshits <=900 )) {
                        //boss.sprite = new Sprite('boss','img/lt_bossLSpritesE.png', [0, 0], [200, 150], 6, [0,1,2,3,4,5]);
                        boss.sprite = addBoss(2, boss.sprite.pos);
                    }
                    //grey to yellow
                    else if (Math.floor(bosshits >=500  && bosshits <=749)) {
                        //boss.sprite = new Sprite('boss','img/lt_bossLSpritesE.png', [0, 335], [200, 150], 6, [0,1,2,3,4,5]);
                        boss.sprite = addBoss(3, boss.sprite.pos);
                    }
                    //grey to blue
                    else if (Math.floor(bosshits >=250  && bosshits <=499)) {
                        //boss.sprite = new Sprite('boss','img/lt_bossLSpritesE.png', [0, 505], [200, 150], 6, [0,1,2,3,4,5])
                        boss.sprite = addBoss(4, boss.sprite.pos);
                    }
                    //grey to red
                    else if (Math.floor(bosshits >=101  && bosshits <=249 )) {
                        //boss.sprite = new Sprite('boss','img/lt_bossLSpritesE.png', [0, 665], [200, 150], 6, [0,1,2,3,4,5])
                        boss.sprite = addBoss(5, boss.sprite.pos);
                    }
                    //oily shell
                    else if (Math.floor(bosshits >=0  && bosshits <=100 )) {
                        //boss.sprite = new Sprite('boss','img/lt_bossLSpritesE.png', [0, 825], [200, 150], 6, [0,1,2,3,4,5])
                        boss.sprite = addBoss(6, boss.sprite.pos);
                    }  
                }
                if (bosshits < 0) {
                    gameWon();
                }
                console.log(`*** HIT BOSS SPRITE = ${bosshits} of ${500}`);

                // Add score
                playerScore += 200;

                // Add an explosion
                addExplosion(pos4, size4);

                // Remove the smart and stop this iteration
                smarts.splice(f, 1);
                break;
            }
        }

        // Run collision detection for all bossFirePower(enemies) and smarts
        for(var b=0; b< enemies.length; b++) {
            var pos = enemies[b].pos;
            var size =enemies[b].sprite.size;        
            for(var d=0; d<smarts.length; d++) {
                var pos2 = smarts[d].pos;
                var size2 = smarts[d].sprite.size;
                if(boxCollides(pos, size, pos2, size2)) {
                    enemyCounter = enemyCounter+1;
                    // Remove the bossFire
                    enemies.splice(b, 1);
                    b--;
                    // Add score
                    playerScore += 100;
                    // Add an explosion
                    addExplosion(pos, size);
                    // Remove the smart and stop this iteration
                    smarts.splice(d, 1);
                    
                    break;
                }
            }
       
            if(boxCollides(pos, size, oilSlick.pos, oilSlick.sprite.size)) {                
                // Remove the bossFire
                enemies.splice(b, 1);
                b--;

                bossOilhits = bossOilhits+20;
                if (bossOilhits > 1000) {
                    gameOver();
                }
                // Add an explosion
                addExplosion(pos, size);
            }

            if(boxCollides(pos, size, player.pos, player.sprite.size)) {
                // Remove the bossFire
                enemies.splice(b, 1);
                b--;
                // Add an explosion
                addExplosion(pos, size);
                playerHealth = playerHealth -10;
                if (playerHealth < 0 ) {
                    gameOver();
                }
            }
        }
    }
    catch (myerror) {
        console.log(`ERROR MESSAGE : - ${myerror}`);
    }
}

/////////////////////////////////
// LEVEL 1-5 - UPDATE ;EVELS 1-5
/////////////////////////////////
function updateAllLevelOne(dt){
    player.sprite.update(dt);
    // Update all the smarts
    try {
        for(var i=0; i<smarts.length; i++) {
            var smart = smarts[i];

            switch(smart.dir) {
            case 'up': smart.pos[1] -= smartSpeed * dt; break;    
            case 'down': smart.pos[1] += smartSpeed * dt; break;
            case 'left': smart.pos[0] -= smartSpeed * dt; break;
            case 'uleft': smart.pos[0] -= smartSpeed * dt; smart.pos[1] -= smartSpeed * dt; break; 
            case 'dleft': smart.pos[0] -= smartSpeed * dt; smart.pos[1] += smartSpeed * dt; break;
            case 'right': smart.pos[0] += smartSpeed * dt; break;
            case 'uright': smart.pos[0] += smartSpeed * dt; smart.pos[1] -= smartSpeed * dt; break; 
            case 'dright': smart.pos[0] += smartSpeed * dt; smart.pos[1] += smartSpeed * dt; break;
            default:
                smart.pos[1] -= smartSpeed * dt;
            }

            // Remove the smart if it goes offscreen
            if(smart.pos[1] < 0 || smart.pos[1] > canvas.height ||
            smart.pos[0] > canvas.width || smart.pos[0]<0) {
                smarts.splice(i, 1);
                i--;
            }
        }
        // Update the movement of enemies
        //in the [enemies] array based on their 'name' identifier
        for(var j=0; j< enemies.length; j++) {
            var enemy = enemies[j];
            switch(enemy.name) {
                case 'trek': {
                    enemy.pos[0] -= enemySpeed * dt;
                } break;
                // moves from bottom to top
                case 'manta': {
                    if (Math.floor(gameTime % 3 == 0)) {
                        enemy.pos[1] -= 1*enemySpeed *dt;
                    } else
                    if(Math.floor(eGenCounter % 40) == 0 ) {            
                        enemy.pos[1] -= 2.5*enemySpeed * dt;
                        addEnemyFire(enemies[j].pos, enemies[j].sprite.size); 
                    }
                    else if(Math.floor(gameTime % 7) == 0 ) {
                        enemy.pos[0] -= 2*enemySpeed * dt;
                        enemy.pos[1] -= 2;
                    }
                    else if (Math.floor(gameTime % 10) == 0 ) {
                        //console.log(gameTime);
                        enemy.pos[0] += 2*enemySpeed * dt;
                        enemy.pos[1] -= 2; 
                    }  
                } break;
                // maverick - moves from left to right
                case 'maverick': {
                    enemy.pos[0] += 3*enemySpeed * dt;
                    if (Math.floor(eGenCounter % 20) == 0 ) {
                        addEnemyBomb(enemy.pos, enemy.sprite.size);
                    }
                } break; 
                // scolder - moves from top to bottom
                case 'scolder': {
                    enemy.pos[1] += 2.5*enemySpeed * dt;
                    if(Math.floor(eGenCounter % 50) == 0 ) {            
                        addEnemyComet(enemy.pos, enemy.sprite.size);
                    } 
                } break; 
                // skull - appears randomly and fires
                case 'skull': {
                    if(Math.floor(eGenCounter % 50) == 0 ) {            
                        addEnemyPellet(enemy.pos, enemy.sprite.size, 1);
                        addEnemyPellet(enemy.pos, enemy.sprite.size, 2);
                        addEnemyPellet(enemy.pos, enemy.sprite.size, 3);
                        addEnemyPellet(enemy.pos, enemy.sprite.size, 4);
                    } 
                } break;
                case 'enemyfire': enemy.pos[1] -= Math.floor(2*enemySpeed * dt); break;
                case 'enemybomb': enemy.pos[1] += Math.floor(3*enemySpeed * dt); break;
                case 'enemycomet': enemy.pos[1] += Math.floor(2*enemySpeed * dt); break;
                //up
                case 'enemypellet1': enemy.pos[0] -= Math.floor(2*enemySpeed * dt); break;
                //down
                case 'enemypellet2': enemy.pos[0] += Math.floor(2*enemySpeed * dt); break;
                //left
                case 'enemypellet3': enemy.pos[1] -= Math.floor(2*enemySpeed * dt); break;
                //right
                case 'enemypellet4': enemy.pos[1] += Math.floor(2*enemySpeed * dt); break;
                default:
                    enemy.pos[0] += Math.floor(enemySpeed * dt);
            }       

            // Update all the enemies
            enemies[j].sprite.update(dt);
            // Remove if offscreen
            if(enemies[j].pos[0] + enemies[j].sprite.size[0] < 0 ||
                //enemies[j].pos[0] + enemies[j].sprite.size[0] > canvas.width ||
                enemies[j].pos[1] + enemies[j].sprite.size[1] < 0 ||
                enemies[j].pos[1] + enemies[j].sprite.size[1] > canvas.height ) {
                enemies.splice(j, 1);
                j--;
            }
        }

        // Update all the explosions
        for(var i=0; i < explosions.length; i++) {
            // var expo = explosions[j];
            explosions[i].sprite.update(dt);

            // Remove if animation is done
            if(explosions[i].sprite.done) {
                explosions.splice(i, 1);
                i--;
            }
        }
        abackground.sprite.update(dt);
        decor1.sprite.update(dt);

        decor2.sprite.update(dt);
    }
    catch (myerror) {
        console.log(`ERROR MESSAGE : - ${myerror}`);
    }  
}
// end updateAllLevelOne(dt)

//////////////////////////////////////////////
// LEVEL 1-5 - CHECK COLLISION FOR LEVELS 1-5
/////////////////////////////////////////////
function checkCollisionAllLevelOne(dt) {
    // Run collision detection for all enemies and smarts
    try {
        checkSpriteBounds(player);
        for(var i=0; i< enemies.length; i++) {
            //var enemy = enemies[i];
            var pos = enemies[i].pos; // Math.floor(enemies[i].pos);
            var size =enemies[i].sprite.size;

            // switch(enemy.name) {
            //     case 'enemycomet': {
            //         if (enemy.pos[1] < canvas.height/2) {
            //              // Add an explosion
            //         addExplosion(pos, size);

            //         // Remove the smart and stop this iteration
            //         enemy.splice(i, 1);
            //         i--;
                    
            //         }
            //      } break;
            // }
                
            for(var j=0; j<smarts.length; j++) {
                var pos2 = smarts[j].pos;
                var size2 = smarts[j].sprite.size;
                if(boxCollides(pos, size, pos2, size2)) {
                    enemyCounter = enemyCounter+1;
                    // Remove the enemy
                    enemies.splice(i, 1);
                    i--;
                    //checkEndofLevel(enemyCounter);
                    //console.log(`*** KILL SPRITE = ${enemyCounter} of ${MAX_ENEMY}`);
                    // Add score
                    playerScore += 50;
                    if (playerScore >= 0) {
                        SHOOTUP = true;
                        SHOOTUL1 = true;
                        LEVEL1 = true;
                    }
                    if (playerScore >= 2000 && playerScore <= 2450) {
                        LEVEL1 = false;
                        isLevel1Over = true;
                        if (LEVEL1 == false &&  isLevel1Over == true) {
                            LEVEL2 = true;
                            nextLevel("LEVEL-2");
                        }
                    }

                    if (playerScore >= 2500) {
                        SHOOTDOWN = true;
                        SHOOTDL2 = true;
                        LEVEL1 = false;
                        LEVEL2 = true;                        
                    }
                    if (playerScore >= 5450 && playerScore <= 5950) {
                        LEVEL2 = false;
                        isLevel2Over = true;
                        if (LEVEL2 == false &&  isLevel2Over == true) {
                            LEVEL3 = true;
                            nextLevel("LEVEL-3");
                        }
                    }
                    if( playerScore >=  6000) {
                        SHOOTLEFT = true;
                        SHOOTUL1 = true;
                        SHOOTDL2 = true;
                        LEVEL2 = false;
                        LEVEL3 = true;
                    }
                    if (playerScore >= 8450 && playerScore <= 8950) {
                        LEVEL3 = false;
                        isLevel3Over = true;
                        if (LEVEL3 == false &&  isLevel3Over == true) {
                            LEVEL4 = true;
                            nextLevel("LEVEL-4");
                        }
                    }
                    if ( playerScore >= 9000) {
                        SHOOTUP = true;
                        SHOOTUL1 = true;
                        SHOOTDL2 = true;
                        LEVEL3 = false;
                        LEVEL4 = true;
                    }
                    if (playerScore >= 10450 && playerScore <= 10950) {
                        LEVEL4 = false;
                        isLevel4Over = true;
                        if (LEVEL4 == false &&  isLevel4Over == true) {
                            LEVEL5 = true;
                            nextLevel("LEVEL-5");
                        }
                    }
                    if ( playerScore >= 11000) {
                        SHOOTRIGHT = true;
                        SHOOTLEFT = true;
                        SHOOTUP = true;
                        SHOOTDOWN = true;
                        SHOOTUL1 =true;
                        SHOOTDL2 = true;
                        SHOOTUR1 = true;
                        SHOOTDR2= true;
                        LEVEL4 = false;
                        LEVEL5 = true;
                    }
                    if (playerScore >= 12450 && playerScore <= 12950) {
                        LEVEL5 = false;
                        isLevel5Over = true;
                        if (LEVEL5 == false &&  isLevel5Over == true) {
                            LEVEL6 = true;
                            levelSix();
                        }
                    }

                    // Add an explosion
                    addExplosion(pos, size);

                    // Remove the smart and stop this iteration
                    smarts.splice(j, 1);
                    
                    break;
                }
            }

            if(boxCollides(pos, size, player.pos, player.sprite.size)) {
                // Remove the enemy
                enemies.splice(i, 1);
                i--;
                // Add an explosion
                addExplosion(pos, size);
                playerHealth = playerHealth -10;
                if (playerHealth < 0 ) {
                    gameOver();
                }
            }
        }
    }
    catch (myerror) {
        console.log(`ERROR MESSAGE : - ${myerror}`);
    }
}

/*//////////////////////*/
// TEST Collisions
// collides returns Point
// boxCollides - returns collide
// ammoCollides - returns collide (center of game object)
// bossoilCollides - returns oilslick collis
///////////////////////
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}
function ammoCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0]/2, pos[1] + size[1]/2,
                    pos2[0], pos2[1],
                    pos2[0] + size2[0]/2, pos2[1] + size2[1]/2);
}
function bossoilCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0]/2, pos2[1] + size2[1]/2);
}

//////////////////////////////////////
// ALL LEVELS - BOUNDS checkSpriteBounds(spriteObject)
// used by player and the boss
// CHECKS A SPECFIC GAME OBJECTS IS WITHIN THE 
/// THE CANVAS - WIDTH AND HEIGHT
////////////////////////////////////////
function checkSpriteBounds(spriteObject) {
    // Check bounds
    if(spriteObject.pos[0] < 0) {
        spriteObject.pos[0] = 0;
    }
    else if(spriteObject.pos[0] > canvas.width - spriteObject.sprite.size[0]) {
        spriteObject.pos[0] = canvas.width - spriteObject.sprite.size[0];
    }

    if(spriteObject.pos[1] < 0) {
        spriteObject.pos[1] = 0;
    }
    else if(spriteObject.pos[1] > canvas.height - spriteObject.sprite.size[1]) {
        spriteObject.pos[1] = canvas.height - spriteObject.sprite.size[1];
    }
}

///////////////////////////////
/* RENDER ALL GAME ELEMENTS */
/////////////////////////////
function render() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(!isGameOver && GAMEPAUSED==false) {

        if (LEVEL1==true || LEVEL2==true || LEVEL3==true || LEVEL4==true || LEVEL5==true ) {
            renderEntity(abackground);
            
            renderEntities(enemies);
            renderEntities(explosions);
            renderEntity(decor1);
            renderEntity(decor2);

            renderEntity(player);
            renderEntities(smarts);
        }

        if (LEVEL6 == true) {
            renderEntity(abackground);
            renderEntity(oilSlick);   
            
            renderEntity(player);
            renderEntities(smarts);

            renderEntities(enemies);
            renderEntity(boss);   
            renderEntity(driller);          
            
            renderEntities(explosions);

        }
    }    
};

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}
///////////////////////////////////////
/* CLEAR GAME CANVAS INBETWEEN LEVELS */
//////////////////////////////////////
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/////////////////////////////
/* GAME OVER SPLASH SCREEN*/
///////////////////////////
function gameOver() {
    /* Game has ended show splash screen with button press option - Replay*/
    document.getElementById('splash-screen').style.display = 'block';
    document.getElementById('splash-gameover-playagain').style.display = 'block';
    document.getElementById('game-loser').innerHTML= `GAME OVER`;
    document.getElementById('message-failure').innerHTML= `<h2>Unlucky - maybe next time!</h2>`;
    document.getElementById('btn-gameover-playagain').innerText=`Try again?`;
    document.getElementById('btn-gameover-exit').innerText=`QUIT`;
    document.getElementById('btn-gameover-playagain').addEventListener('click', function() {
        // call to play next level
        levelAll(playerLevel)
    });

    /* Game has ended show splash screen with button press option - Exit game*/
    document.getElementById('btn-gameover-exit').addEventListener('click', function() {
        document.getElementById('message-failure').innerHTML= `Thank you for playing <h2>All for the Melee</h2>`;
        isGameOver = true;
        window.location.reload();
    });
}

/////////////////////////////
/* GAME WON SPLASH SCREEN */
////////////////////////////
function gameWon() {
    /* Game has ended show splash screen with EXIT*/
    document.getElementById('game-winner').innerHTML= `Well done - Melee-er`;
    document.getElementById('btn-gamewon-exit').innerText=`RETIRE`;
    document.getElementById('splash-screen').style.display = 'block';
    document.getElementById('splash-gamewon').style.display = 'block';
    document.getElementById('message-success').innerHTML= `<h2>Thank you for playing <br> All for the Melee<br> [DEMO]</h2>`;
    document.getElementById('btn-gamewon-exit').addEventListener('click', function() {
        isGameOver = true;
        window.location.reload();
    });
}

//////////////////////////////
/* PAUSE GAME SPLASH SCREEN*/
////////////////////////////
function pauseGame() {
    document.getElementById('splash-screen').style.display = 'block';
    document.getElementById('game-pausing').innerHTML= `GAME PAUSED`;
    document.getElementById('btn-gamepause').innerText=`UNPAUSE?`;
    document.getElementById('splash-gamepause').style.display = 'block';

    document.getElementById('btn-gamepause').addEventListener('click', function() {
        
        document.getElementById('splash-gamepause').style.display='none';
        document.getElementById('splash-screen').style.display='none';
        
        if (Date.now() - tdelay > 100) {
            GAMEPAUSED = false;
            lastTime = Date.now();
            main();
        }
    });
}

//////////////////////////////
/* NEXT LEVEL SPLASH SCREEN */
//////////////////////////////
function nextLevel(playerLevel) {
    tdelay = Date.now();
    gametime=0;
    
    document.getElementById('splash-screen').style.display = 'block';

    document.getElementById('splash-nextlevel').style.display='block';
    document.getElementById('game-levelcongrats').innerHTML= `Congrats on a super Melee !!!`;
    document.getElementById('message-nextlevel').innerHTML= `<h2>Onward to ${playerLevel}</h2>`;
    
    document.getElementById('btn-nextLevel').innerHTML= `Play ${playerLevel}`;
    
    document.getElementById('btn-nextLevel').addEventListener('click', function() {
           
                levelAll(playerLevel);    
    });
}


///////////////////////////////////////////
/* ALL LEVEL SETUP FOR NEXT PLAYER LEVEL */
//////////////////////////////////////////
/* All Levels */
function levelAll(playerLevel) {
    document.getElementById('splash-gamebegin-newgame').style.display='none';
    document.getElementById('splash-gameover-playagain').style.display='none';
    document.getElementById('splash-nextlevel').style.display='none';
    document.getElementById('splash-screen').style.display = 'none';

    clearCanvas();
    gameTime = 0;

    playerHealth = 1000;   
    
    enemies = [];
    explosions = [];
    smarts = [];

    eGenCounter = 0; // // ALL ENEMIES GENERATED PER LEVEL
    enemyFireCount = 0; // addEnemyFire

    switch (playerLevel) {
        case "LEVEL-1":
            playerScore = 0;
            SHOOTUP=true;
            SHOOTUL1= true;
            SHOOTUR1= true;
            LEVEL1= true;
        break;
        case "LEVEL-2":
            playerScore = 2500; //playerScore; // + 5000;
            clearCanvas();
            SHOOTDOWN=true;
            SHOOTDL2= true;
            SHOOTDR2= true;
            abackground.sprite = new Sprite('backdrop','img/lt_backgroundSpritesD.png', [0,525], [480, 525], 4, [0, 1,2,3]);
            //abackground.sprite = new Sprite('backdrop','img/lt_decorSpritesD.png', [0,0], [480, 525], 4, [0, 1,2,3]);
            abackground.pos = [0,0];
            addDecor(1);
            LEVEL1 = false;
            LEVEL2= true;
        break;
        case "LEVEL-3":
            playerScore = 6000;
            clearCanvas();
            SHOOTLEFT = true;
            SHOOTUL1= true;
            SHOOTDL2= true;
            abackground.sprite = new Sprite('backdrop','img/lt_backgroundSpritesD.png', [0,1050], [480, 525], 4, [0, 1,2,3]);
            //abackground.sprite = new Sprite('backdrop','img/lt_decorSpritesD.png', [0,1130], [480, 300], 4, [0, 1,2,3]);
            abackground.pos = [0,0];
            addDecor(1);
            LEVEL2 = false;
            LEVEL3= true;
        break;
        case "LEVEL-4":
            playerScore = 9000;
            clearCanvas();
            SHOOTUP=true;
            SHOOTUL1= true;
            SHOOTUR1= true;
            abackground.sprite = new Sprite('backdrop','img/lt_backgroundSpritesD.png', [0,1575], [480, 525], 4, [0, 1,2,3]);
            //abackground.sprite = new Sprite('backdrop','img/lt_decorSpritesD.png', [0,2010], [480, 525], 4, [0,1,2,3]);
            abackground.pos = [0,0];
            addDecor(1);
            LEVEL3=false;
            LEVEL4= true;
        break;
        case "LEVEL-5":
            playerScore = 11000;
            clearCanvas();
            SHOOTUP = true;
            SHOOTDOWN = true;
            SHOOTLEFT = true;
            SHOOTUL1 = true;
            SHOOTDL2 = true;
            SHOOTRIGHT = true;
            abackground.sprite = new Sprite('backdrop','img/lt_backgroundSpritesD.png', [0,2100], [480, 525], 4, [0, 1,2,3]);
            abackground.pos = [0,0];
            addDecor(1);
            LEVEL4=false;
            LEVEL5= true;
        break;
        case "BOSS-LEVEL":
            playerScore = 13000;
            clearCanvas();
            levelSix();
        break;
        default:
            levelOne();
            break;
    }
    
    isGameOver = false;
    GAMEPAUSED = false;
       
    player.pos = [canvas.width/4, canvas.height / 4];

};

///////////////////////////////////////////
/* LEVEL 1 - NEW GAME LEVEL/ LEVEL SETUP */
//////////////////////////////////////////
function levelOne() {
    /* Display player info splash screen */
    document.getElementById('player-score').style.display='block';
    document.getElementById('splash-gamebegin-newgame').style.display='none';
    document.getElementById('splash-gameover-playagain').style.display='none';
    document.getElementById('splash-screen').style.display='none';
    
    // GAME VARIABLES - LEVEL 1
    gameTime = 0;

    playerScore = 0;
    playerHealth = 1000;   

    MAX_ENEMY = 50;
    enemyCounter = 0;
    
    enemies = [];
    explosions = [];
    smarts = [];

    enemies.length =0;
    explosions.length = 0;
    smarts.length =0;

    eGenCounter = 0; // // ALL ENEMIES GENERATED PER LEVEL
    enemyFireCount = 0; // addEnemyFire

    /* BOOLEAN player fire states*/
    SHOOTUP = true;
    SHOOTDOWN = false;
    SHOOTLEFT = false;
    SHOOTUL1 = false;
    SHOOTDL2 = false;
    SHOOTRIGHT = false;
    SHOOTUR1 = false;
    SHOOTDR2 = false;

    /* BOOLEAN game level in play states */
    LEVEL1 = true;
    LEVEL2 = false;
    LEVEL3 = false;
    LEVEL4 = false;
    LEVEL5 = false;
    LEVEL6 = false;
    //isLevelOver = false;
    isGameOver = false;
    GAMEPAUSED = false;

    addBackground(0,0);
    abackground.pos = [0,0];

    addDecor(1);

    addPlayer();
    
    player.pos = [canvas.width/4, canvas.height -30];
    
    // enter the main game loop
    tdelay= Date.now();
    if (!isGameOver && GAMEPAUSED == false) {
        lastTime = Date.now();
        main();
    }
};

//////////////////////////
// BOSS LEVEL
//////////////////////////
/* Level 6 */
function levelSix() {
    console.log("*** IN: levelSix ");
    clearCanvas();

    gameTime = 0;

    playerScore = 0;
    playerHealth = 1000;   

    MAX_ENEMY = 50;
    enemyCounter = 0;
    enemyFireCount = 0;

    bosshits = 1000;
    bossOilhits = 0;

    enemies = [];
    explosions = [];
    smarts = [];

    // clear previous
    enemies.length =0;
    explosions.length = 0;
    smarts.length =0;
    
    /* BOOLEAN player fire states*/
    SHOOTUP = true;
    SHOOTDOWN = true;
    SHOOTLEFT = true;
    SHOOTUL1 = true;
    SHOOTDL2 = true;
    SHOOTRIGHT = true;
    SHOOTUR1 = true;
    SHOOTDR2 = true;
    /* BOOLEAN game level in play states */
    LEVEL1 = false;
    LEVEL2 = false;
    LEVEL3 = false;
    LEVEL4 = false;
    LEVEL5 = false;
    LEVEL6 = true;

    // Game state
    isGameOver = false;
    GAMEPAUSED = false;    

    abackground.sprite = new Sprite('backdrop','img/lt_backgroundSpritesD.png', [0,2100], [480, 525], 4, [0, 1,2,3]);
    abackground.pos = [0,0];

    addOilSlick(0, canvas.height - 50); //145);
    oilSlick.pos = [0, canvas.height - 50]; //145];   

    addPlayer();
    player.pos = [0, canvas.height /2 ];
    
    //add driller
    driller = addBoss(7);
    driller.pos = [canvas.width/2, canvas.height/2];

    // add Boss
    boss = addBoss(1);
    boss.pos = [0, 0];

};


