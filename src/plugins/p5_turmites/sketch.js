
var sketch = function (
  parentElementId,
  turmitesData,
  // turmiteData0,
  // turmiteData1,
  // turmiteData2,
  // turmiteData3,
  turmiteIds,
  boardData,
  frameRate = 60
  ) {
    // var turmitesData = [turmiteData0, turmiteData1, turmiteData2, turmiteData3];
    //p5.noLoop();
    let myMethods
    
    const myp5 = new p5(function (p5) {
    const colors = ['red', '#0081ff', '#03de00', '#fa8700']
    var initalizedTurmites = [];
    const board1 = boardData;
    const initalBoard = {
      board:boardData
    }
    Object.freeze(initalBoard);
    let slider;
    var userinput;
    var turmitesToMove = {};
    var choosenTurmites = "all";
    let sel;
    let boardNew
    let initializing = true

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

      setField(colorOfField, posx, posy) {
        //setstate turmite  - current field
        if (colorOfField == "00") {
          // console.log("new colorfield:black")
          this.computationBoard[posx][posy] = 0;
          this.boardCache.push([posx,posy,0])
        }
        if (colorOfField == "ff") {
          // console.log("new colorfield:white")
          this.computationBoard[posx][posy] = 255;
          this.boardCache.push([posx,posy,255])
        }
        //this.renderBoard = this.updateRenderBoard(this.computationBoard, 144);
      }

      getField(posx, posy) {
        return this.computationBoard[posx][posy];
      }

      reDrawCache(){
        for (var t = 0; t < this.boardCache.length; t++){
          if (this.boardCache[t][2] == 255) {
            p5.fill("white");
            p5.noStroke()
            p5.rect(this.boardCache[t][1] * 5, (143 -this.boardCache[t][0]) * 5, 5, 5);
          }
          else if (this.boardCache[t][2] == 0) {
            p5.noStroke()
            p5.fill("black");
            p5.rect(this.boardCache[t][1] * 5, (143 - this.boardCache[t][0]) * 5, 5, 5);
          }
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
      constructor(turmite1, field) {
        this.posx = parseInt(turmite1.posy);
        this.posy = parseInt(turmite1.posx);
        this.rule = turmite1.rule;
        this.board = field;
        this.direction = turmite1.direction;
        this.state = turmite1.state;

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
        this.board.setField(this.colorOfField, this.posx, this.posy);
      }

      drawTurmite(index) {
        p5.fill(colors[index]);
        // p5.noStroke()
        p5.rect(this.posy * 5, (143 - this.posx) * 5, 5, 5);
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
      myCanvas.parent(parentElementId)
      // p5.createCanvas(p5.windowWidth, p5.windowHeight);
      
      // p5.background(250);
      p5.background(0);

      p5.frameRate(frameRate)
      
      //p5.noLoop();

      for (let z = 0; z < turmiteIds.length; z++) {
        var newname = turmiteIds[z];
        turmitesToMove[newname] = [z];
      }
      turmitesToMove["all"] = [0, 1, 2, 3].slice(0, turmitesData.length);

      boardNew = new board(board1);
      for (var i = 0; i < turmitesData.length; i++) {
        let turmiteNew = new turmiteobj(turmitesData[i], boardNew);
        initalizedTurmites.push(turmiteNew);
      }
      boardNew.reDrawCanvas();

      for (var b = 0; b < initalizedTurmites.length; b++) {
        initalizedTurmites[b].drawTurmite(b);
      }

      p5.noLoop()
    };

    p5.draw = function draw() {
      console.log('running')
      // draw loop...

      // prevent extra step since draw() is always called on setup() and loop()
      if (!p5.isLooping()) {
        return
      }

      // step
      var tumitesToMOVE = turmitesToMove[choosenTurmites];
      // for (var u = 0; u < tumitesToMOVE.length; u++) {
      for (var u = 0; u < tumitesToMOVE.length; u++) {
        initalizedTurmites[tumitesToMOVE[u]].step();
      }
      boardNew.reDrawCache();

      // draw turmite in new position
      for (var u = 0; u < tumitesToMOVE.length; u++) {
        initalizedTurmites[tumitesToMOVE[u]].drawTurmite(u);
      }
      //console.log(p5.frameRate()); 
    };

    // p5.windowResized = function windowResized() {
    //   p5.resizeCanvas();
    // };

  //});

  myMethods = {
    changeTurmiteSelection: function (value = '') {
      if (!turmiteIds.includes(value)) {
        console.warn(`${value} not found in turmiteIds:`, JSON.stringify(turmiteIds))
        value = undefined
      }
      value = value || 'all'
      choosenTurmites = value
    },

    // pressStart: function () {
    //   console.log("start");
    //   //button.html('stop');
    //   if (myp5.isLooping() == false) {
    //     myp5.loop()
    //     console.log("lets go");
    //   }
    // },

    // pressStop: function () {
    //   if (myp5.isLooping() == true) {
    //     myp5.noLoop()
    //     console.log("stop");
    //   }
    // },

    togglePlayback: function  () {
      // running = !running
      console.log("toggle stuff")
      return myp5.isLooping() ? myp5.noLoop() : myp5.loop()
    },

    reset: function () {
      console.log('restart')
      // myp5.setup();

      //initalizedTurmites = [];

      //const emptyBoard = new Uint8Array(new Array(20736).fill(0)); //Uint8Array(20736)
      //const boardData1 = emptyBoard
      //console.log(board1)
      console.log(initalBoard.board)
      boardNew = new board(initalBoard.board);
      boardNew.reDrawCanvas();

      // for (var i = 0; i < turmitesData.length; i++) {
      //   let turmiteNew = new turmiteobj(turmitesData[i], boardNew);
      //   initalizedTurmites.push(turmiteNew);
      // }
      
      // for (var b = 0; b < initalizedTurmites.length; b++) {
      //   initalizedTurmites[b].drawTurmite(b);
      // }
    },

    myInputEvent: function () {
      userinput = this.value();
    },

    simulateSteps: function ({ turmiteId, steps }) {
      if (myp5.isLooping() == true) {
        myp5.noLoop();
      }
      
      if (turmiteId) {
        myp5.myMethods.changeTurmiteSelection(turmiteId)
      }

      let val = steps // slider.value();
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
    },

    reprogramm: function () {
      console.log("reprogrammed!");
      var tumitesToReprogramm = turmitesToMove[choosenTurmites];
      for (var u = 0; u < tumitesToReprogramm.length; u++) {
        initalizedTurmites[tumitesToReprogramm[u]].rule = String(userinput);
      }
    }
  }
});
  
  myp5.myMethods = myMethods
  return myp5
};

export default sketch
