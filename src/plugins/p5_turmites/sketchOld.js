const colors = ['red', '#0081ff', '#03de00', '#fa8700']

var sketch = function (
  parentElementId,
  turmitesData,
  // turmiteData0,
  // turmiteData1,
  // turmiteData2,
  // turmiteData3,
  turmiteIds,
  boardData,
  playbackButton
) {
  new p5(function (p5) {
    // var turmitesData = [turmiteData0, turmiteData1, turmiteData2, turmiteData3];
    var initalizedTurmites = [];
    var board1 = boardData;
    var running = false;
    let slider;
    var userinput;
    var turmitesToMove = {};
    var choosenTurmites = "all";
    let sel;
    let boardNew
    let frameRate = 30
    // exp
    let stateOfField

    class board {
      constructor(initBoard) {
        this.computationBoard = this.construct2DArray(initBoard, 144, 144);
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
        }
        if (colorOfField == "ff") {
          // console.log("new colorfield:white")
          this.computationBoard[posx][posy] = 255;
        }
        //this.renderBoard = this.updateRenderBoard(this.computationBoard, 144);
      }

      getField(posx, posy) {
        return this.computationBoard[posx][posy];
      }

      reDrawCanvas() {
        var plzreverse = [].concat(this.computationBoard).reverse();
        for (var x = 0; x < 144; x++) {
          for (var y = 0; y < 144; y++) {
            if (plzreverse[x][y] == 255) {
              p5.fill("white");
              p5.stroke("white");
              p5.rect(y * 5, x * 5, 5, 5);
            }
            if (plzreverse[x][y] == 0) {
              p5.stroke("black");
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

      // original implementation
      // takeStep() {
      //   if (this.direction == 0) {
      //     // 0 2 3 1
      //     //console.log("move:left");
      //     this.posx = (this.posx + 1) % 144;
      //   } else if (this.direction == 2) {
      //     //console.log("move:right");
      //     if (this.posx == 0) {
      //       this.posx = 143;
      //     } else {
      //       this.posx = this.posx - 1;
      //     }
      //   } else if (this.direction == 3) {
      //     //console.log("move:up");
      //     this.posy = (this.posy + 1) % 144;
      //   } else if (this.direction == 1) {
      //     //console.log("move:down");
      //     if (this.posy == 0) {
      //       this.posy = 143;
      //     } else {
      //       this.posy = this.posy - 1;
      //     }
      //   }
      // }

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
        p5.stroke(colors[index]);
        p5.rect(this.posy * 5, (143 - this.posx) * 5, 4, 4);
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
      
      p5.background(0); // black because pixel in bottom-left corner???

      for (var z = 0; z < turmiteIds.length; z++) {
        var newname = "Turmite " + String(turmiteIds[z]);
        turmitesToMove[newname] = [z];
      }
      turmitesToMove["all"] = [0, 1, 2, 3].slice(0, turmitesData.length);

      // let startbutton = p5.createButton("start");
      // startbutton.mousePressed(pressStart);
      // startbutton.position(20, 20);

      // let stopbutton = p5.createButton("stop");
      // stopbutton.mousePressed(pressStop);
      // stopbutton.position(80, 20);

      playbackButton.addEventListener('click', () => playPause())
      
      // slider = p5.createSlider(0, 8000, 100);
      // slider.position(210, 20);
      // slider.style("width", "80px");

      // let simulatebutton = p5.createButton("simulate steps");
      // simulatebutton.position(300, 20);
      // simulatebutton.mousePressed(simulateSteps);

      // let inp = p5.createInput("");
      // inp.position(210, 60);
      // inp.size(200);
      // inp.input(myInputEvent);

      // let reprogramButton = p5.createButton("reprogram");
      // reprogramButton.position(420, 60);
      // reprogramButton.mousePressed(reprogramm);

      // sel = p5.createSelect();
      // sel.position(500, 30);
      // sel.option("Turmite " + String(turmiteIds[0]));
      // sel.option("Turmite " + String(turmiteIds[1]));
      // sel.option("Turmite " + String(turmiteIds[2]));
      // sel.option("Turmite " + String(turmiteIds[3]));
      // sel.option("all");
      // sel.selected("all");
      // sel.changed(changeTurmiteSelection);

      boardNew = new board(board1);
      
      for (var i = 0; i < turmitesData.length; i++) {
        var turmiteNew = new turmiteobj(turmitesData[i], boardNew);
        initalizedTurmites.push(turmiteNew);
      }
      
      boardNew.reDrawCanvas();

      for (var b = 0; b < initalizedTurmites.length; b++) {
        initalizedTurmites[b].drawTurmite(b);
      }
    };

    function changeTurmiteSelection() {
      choosenTurmites = sel.value();
    }

    function pressStart() {
      console.log("start");
      //button.html('stop');
      if (running == false) {
        running = true;
        console.log("lets go");
      }
    }

    function pressStop() {
      if (running == true) {
        running = false;
      }
    }

    function playPause () {
      running = !running
    }

    function myInputEvent() {
      userinput = this.value();
    }

    function simulateSteps (val) {
      if (running == true) {
        running = false;
      }
      // let val = slider.value();
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
    }

    function reprogramm() {
      console.log("reprogrammed!");
      var tumitesToReprogramm = turmitesToMove[choosenTurmites];
      for (var u = 0; u < tumitesToReprogramm.length; u++) {
        initalizedTurmites[tumitesToReprogramm[u]].rule = String(userinput);
      }
    }

    p5.draw = function draw() {
      if (running == true) {
        var tumitesToMOVE = turmitesToMove[choosenTurmites];
        for (var u = 0; u < tumitesToMOVE.length; u++) {
          initalizedTurmites[tumitesToMOVE[u]].step();
        }
        boardNew.reDrawCanvas();
        for (var u = 0; u < tumitesToMOVE.length; u++) {
          initalizedTurmites[tumitesToMOVE[u]].drawTurmite(u);
        }
      }
    };
    // p5.windowResized = function windowResized() {
    //   p5.resizeCanvas();
    // };
  });
};

export default sketch
