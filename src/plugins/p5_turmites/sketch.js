var sketch = function ({
  target,
  turmitesData,
  turmiteIds,
  boardData,
  colors,
  frameRate = 60,
  colorTail = 0
}) {
  let myMethods

  const myp5 = new p5(function (p5) {
    let initalizedTurmites = [];
    let board1 = boardData;
    let turmitesToMove = {};
    let choosenTurmites = "all";
    let boardNew
    let drawcounter = 0;
    let stepCount = 0;
    let _colorTail = colorTail
    
    // can remove "co" i believe:
    let co = 1 // 0.78;

    class board {
      constructor(initBoard) {
        this.computationBoard = this.construct2DArray(initBoard, 144, 144);
        this.boardCache = [];
      }

      construct2DArray(original, m, n) {
        if (original.length !== m * n) {
          console.log("Dimensions broken");
          return [];
        }
        let result = [];
        for (let i = 0; i < m; i++) {
          result.push(original.slice(i * m));
        }
        return result;
      }

      setField(colorOfField, posx, posy, cacheColor) {
        //setstate turmite  - current field
        if (colorOfField == "00") {
          // console.log("new colorfield:black")
          this.computationBoard[posx][posy] = 0;
          this.boardCache.push([posx,posy,0,cacheColor])
        }
        if (colorOfField == "ff") {
          // console.log("new colorfield:white")
          this.computationBoard[posx][posy] = 255;
          this.boardCache.push([posx,posy,255,cacheColor])
        }
        //this.renderBoard = this.updateRenderBoard(this.computationBoard, 144);
      }

      getField(posx, posy) {
        return this.computationBoard[posx][posy];
      }

      reDrawCache(){
        for (var t = 0; t < this.boardCache.length; t++){
          if (this.boardCache[t][2] == 255) {            
            // highlight path or just white?
            const fillColor = _colorTail ? this.boardCache[t][3] : 'white'
            p5.fill(fillColor)
            
            p5.noStroke()
            p5.rect(this.boardCache[t][1] * 5 , (143 -this.boardCache[t][0]) * 5  , 5*co, 5*co);
          }
          else if (this.boardCache[t][2] == 0) {
            p5.noStroke()
            p5.fill("black");
            p5.rect(this.boardCache[t][1] * 5 , (143 - this.boardCache[t][0]) * 5  , 5*co, 5*co);
          }
          p5.noStroke()
        }
        this.boardCache = []
      }

      reDrawCanvas() {
        var plzreverse = [].concat(this.computationBoard).reverse();
        for (var x = 0; x < 144; x++) {
          for (var y = 0; y < 144; y++) {
            if (plzreverse[x][y] == 255) {
              p5.fill("white");
              p5.noStroke()
              p5.rect(y * 5, x * 5, 5, 5);
            }
            else if (plzreverse[x][y] == 0) {
              p5.noStroke()
              p5.fill("black");
              p5.rect(y * 5, x * 5, 5, 5);
            }
          }
        }
      }
    }

    class turmiteobj {
      constructor(turmite1, field, color) {
        this.posx = parseInt(turmite1.posy);
        this.posy = parseInt(turmite1.posx);
        this.rule = turmite1.rule;
        this.board = field;
        this.direction = turmite1.direction;
        this.state = turmite1.state;
        this.color = color;

        /// temp slots
        this.newDirection = 0;
        this.colorOfField = 0;
        // console.log(this);
      }

      chooseDirection() {
        var stateOfField = this.board.getField(this.posx, this.posy);
        if (stateOfField == 0 && this.state == 0) {
          //0 0 change mirrow
          this.colorOfField = this.rule[0] + this.rule[1];
          this.newDirection = this.rule[2] + this.rule[3];
          this.state = parseInt(this.rule[4] + this.rule[5]);
          // console.log("rule:1");
        } else if (stateOfField == 255 && this.state == 0) {
          //1 0
          this.colorOfField = this.rule[6] + this.rule[7];
          this.newDirection = this.rule[8] + this.rule[9];
          this.state = parseInt(this.rule[10] + this.rule[11]);
          //console.log("rule:2");
        } else if (stateOfField == 0 && this.state == 1) {
          // 0 1
          this.colorOfField = this.rule[12] + this.rule[13];
          this.newDirection = this.rule[14] + this.rule[15];
          this.state = parseInt(this.rule[16] + this.rule[17]);
          //console.log("rule:3");
        } else if (stateOfField == 255 && this.state == 1) {
          //11
          this.colorOfField = this.rule[18] + this.rule[19];
          this.newDirection = this.rule[20] + this.rule[21];
          this.state = parseInt(this.rule[22] + this.rule[23]);
          //console.log("rule:4");
        }
      }

      changeDirection() {
        //change direction
        if (this.newDirection == "02") {
          //console.log("changedirection:left")
          this.direction = (this.direction + 1) % 4; // +
        } else if (this.newDirection == "08") {
          //console.log("changedirection:right")
          this.direction = (this.direction - 1) % 4; // -
          if (this.direction < 0) {
            this.direction = 3;
          }
        } else if (this.newDirection == "04") {
          //console.log("changedirection:uturn")
          this.direction = (this.direction + 2) % 4;
        }
      }


      takeStep() {
        if (this.direction == 0) {
          // 0 2 3 1
          //console.log("move:left");
          this.posy = (this.posy + 1) % 144;
        } else if (this.direction == 2) {
          //console.log("move:right");
          if (this.posy == 0) {
            this.posy = 143;
          } else {
            this.posy = this.posy - 1;
          }
        } else if (this.direction == 3) {
          //console.log("move:up");
          this.posx = (this.posx + 1) % 144;
        } else if (this.direction == 1) {
          //console.log("move:down");
          if (this.posx == 0) {
            this.posx = 143;
          } else {
            this.posx = this.posx - 1;
          }
        }
      }

      newSetField() {
        this.board.setField(this.colorOfField, this.posx, this.posy, this.color);
      }

      drawTurmite() {
        p5.noStroke()
        p5.fill(this.color);
        p5.rect(this.posy * 5, (143 - this.posx) * 5, 5*co, 5*co);
      }

      step() {
        this.chooseDirection();
        this.newSetField();
        this.changeDirection();
        this.takeStep();
      }
    }

    p5.setup = function () {
      let myCanvas = p5.createCanvas(720, 720);
      myCanvas.parent(target)

      p5.background(0);

      p5.frameRate(frameRate)

      for (let z = 0; z < turmiteIds.length; z++) {
        var newname = turmiteIds[z]; // "Turmite " + String(turmiteIds[z]);
        turmitesToMove[newname] = [z];
      }
      turmitesToMove["all"] = [0, 1, 2, 3].slice(0, turmitesData.length)

      // 

      boardNew = new board(board1);
      
      for (var i = 0; i < turmitesData.length; i++) {
        let turmiteNew = new turmiteobj(turmitesData[i], boardNew, colors[i]);
        initalizedTurmites.push(turmiteNew);
      }
      boardNew.reDrawCanvas();

      for (var b = 0; b < initalizedTurmites.length; b++) {
        initalizedTurmites[b].drawTurmite();
      }

      p5.noLoop()
    };

    p5.draw = function draw() {
      // draw loop...

      // prevent extra step since draw() is always called on setup() and loop()
      if (!p5.isLooping()) {
        return
      }

      // step
      var tumitesToMOVE = turmitesToMove[choosenTurmites];
      for (var u = 0; u < tumitesToMOVE.length; u++) {
        initalizedTurmites[tumitesToMOVE[u]].step();
      }

      boardNew.reDrawCache();
      
      // draw turmite in new position
      for (var u = 0; u < tumitesToMOVE.length; u++) {
        initalizedTurmites[tumitesToMOVE[u]].drawTurmite();
      }
      
      // color tail has finite length?
      if (typeof _colorTail === 'number') {
        drawcounter = drawcounter + 1;
        if (drawcounter % _colorTail === 0){
          boardNew.reDrawCanvas()
          drawcounter = 0;
        }
      }

      stepCount++
    };

    // p5.windowResized = function windowResized() {
    //   p5.resizeCanvas();
    // };

    myMethods = {
      changeTurmiteSelection: function (value = '') {
        if (!turmiteIds.includes(value)) {
          console.warn(`${value} not found in turmiteIds:`, JSON.stringify(turmiteIds))
          value = undefined
        }
        value = value ?? 'all'
        choosenTurmites = value
        console.log({ choosenTurmites })
      },

      pressStart: function () {
        console.log("start");
        //button.html('stop');
        if (myp5.isLooping() == false) {
          myp5.loop()
          console.log("lets go");
        }
      },

      pressStop: function () {
        if (myp5.isLooping() == true) {
          myp5.noLoop()
          console.log("stop");
        }
      },

      togglePlayback: function  () {
        return myp5.isLooping() ? myp5.noLoop() : myp5.loop()
      },
      

      simulateSteps: function ({ turmiteId, steps }) {
        if (myp5.isLooping() == true) {
          myp5.noLoop();
        }

        if (turmiteId) {
          myp5.myMethods.changeTurmiteSelection(turmiteId)
        }

        let val = steps

        var tumitesToMOVE = turmitesToMove[choosenTurmites];
        for (var u = 0; u < tumitesToMOVE.length; u++) {
          for (var moves = 0; moves < val; moves++) {
            initalizedTurmites[tumitesToMOVE[u]].step();
          }
        }
        boardNew.reDrawCanvas();
        for (var u = 0; u < tumitesToMOVE.length; u++) {
          initalizedTurmites[tumitesToMOVE[u]].drawTurmite(u);
        }

        stepCount = stepCount + steps
      },

      getStepCount: function () {
        return stepCount
      },

      reprogramm: function ({ id, rule }) {
        const prevChoosen = choosenTurmites
        
        if (id) {
          myMethods.changeTurmiteSelection(id)
        }
        
        var tumitesToReprogramm = turmitesToMove[choosenTurmites];
        for (var u = 0; u < tumitesToReprogramm.length; u++) {
          initalizedTurmites[tumitesToReprogramm[u]].rule = String(rule);
        }

        console.log(`reprogrammed ${choosenTurmites} to ${rule}`);

        // restore if was changed
        choosenTurmites = prevChoosen       
      },

      restart: function () {
        console.log('restart')
        initalizedTurmites = [];
        boardNew = new board(board1);
        stepCount = 0;

        for (var i = 0; i < turmitesData.length; i++) {
          let turmiteNew = new turmiteobj(turmitesData[i], boardNew, colors[i]);
          initalizedTurmites.push(turmiteNew);
        }

        boardNew.reDrawCanvas();

        for (var b = 0; b < initalizedTurmites.length; b++) {
          initalizedTurmites[b].drawTurmite();
        }
      },

      setColorTail: function (range = 0) {
        _colorTail = range
      }
    }
  });

  // ugly but... p5
  myp5.myMethods = myMethods
  
  return myp5
};

export default sketch
