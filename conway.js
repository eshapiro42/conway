$(document).ready(function() {
  
  var gridSize   = 15;
  var cellDim    = 80 / gridSize;
  var aliveProb  = 15;
  var numClicks  = 0;
  
  var grid = new Array(gridSize + 2);
  for (var i = 0; i <= gridSize + 1; i++) {
    grid[i] = new Array(gridSize + 2);
  }
  var oldGrid = new Array(gridSize + 2);
  for (var i = 0; i <= gridSize + 1; i++) {
    oldGrid[i] = new Array(gridSize + 2);
  }
  
  for (var i = 0; i <= gridSize + 1; i++) {
    for (var j = 0; j <= gridSize + 1; j++) {
      grid[i][j] = 0;
    }
  }
  
  var birthSound = new Audio('assets/pop_sound.mp3');
  var deathSound = new Audio('assets/fade_sound.mp3');
  
    function createGrid() {
    for (var i = 1; i <= gridSize; i++) {
      for (var j = 1; j <= gridSize; j++) {
        if (Math.floor((Math.random() * 100) + 1) <= aliveProb ){
          grid[i][j] = 1;
        } else {
          grid[i][j] = 0;
        }
      }
    }
    renderGrid();
  }
  
  function renderGrid() {
    var html;
    $("#grid").html('');
    for (var i = 1; i <= gridSize; i++) {
      html = '<div class="row">'; // begin row
      for (var j = 1; j <= gridSize; j++) {
        if (grid[i][j] == 1){
          html += '<div class="cell-wrapper"><div class="cell alive" id=' + i + ',' + j + '"></div></div>';
        } else {
          html += '<div class="cell-wrapper"><div class="cell dead" id=' + i + ',' + j + '"></div></div>';
        }
      }
      html += '</div>'; //end row
      $("#grid").append(html);
    }
    if ($(window).innerWidth() >= $(window).innerHeight()){
      $(".cell-wrapper").css({"width":  cellDim.toString() + "vh", "height": cellDim.toString() + "vh"});
    } else {
      $(".cell-wrapper").css({"width":  cellDim.toString() + "vw", "height": cellDim.toString() + "vw"});
    }
  }
  
  function copyGrid() {
    for (var i = 0; i <= gridSize + 1; i++) {
      for (var j = 0; j <= gridSize + 1; j++) {
        oldGrid[i][j] = grid[i][j];
      }
    }
  }
  
  function stepGrid() {
    var neighbors;
    copyGrid();
    for (var i = 1; i <= gridSize; i++) {
      for (var j = 1; j <= gridSize; j++) {
        neighbors = oldGrid[i-1][j-1]
                  + oldGrid[i][j-1]
                  + oldGrid[i+1][j-1]
                  + oldGrid[i+1][j]
                  + oldGrid[i+1][j+1]
                  + oldGrid[i][j+1]
                  + oldGrid[i-1][j+1]
                  + oldGrid[i-1][j];
        //var id = i.toString() + "," + j.toString();
        //console.log(id + ": " +neighbors.toString());
        if (grid[i][j] == 1) { // if this cell is alive
          if (neighbors < 2 || neighbors > 3){ // and has less than two or more than three neighbors
            grid[i][j] = 0; // this cell dies
          }
        } else { // if this cell is dead
          if (neighbors == 3) { // and has three neighbors
            grid[i][j] = 1;
          }
        }
      }
    }
    renderGrid();
  }
  
   createGrid();
  
  $(document).on("click", ".cell", function() {
    numClicks++;
    var x = this.id.split(",")[0];
    var y = this.id.split(",")[1];
    $("#moves").html(numClicks.toString() + " moves");
    if($(this).hasClass("alive")) {
      deathSound.play();
      $(this).fadeOut(function() {
        $(this).removeClass("alive").addClass("dead").fadeIn('fast');
        grid[parseInt(x)][parseInt(y)] = 0;
      });
    } else {
      birthSound.play();
      $(this).removeClass("dead").addClass("alive");
      grid[parseInt(x)][parseInt(y)] = 1;
    }
      setTimeout(function() {
        stepGrid();
      }, 450);
  });
  
  window.addEventListener('resize', function(event){
    if ($(window).width() >= $(window).height()){
      $(".cell-wrapper").css({"width":  cellDim.toString() + "vh", "height": cellDim.toString() + "vh"});
    } else {
      $(".cell-wrapper").css({"width":  cellDim.toString() + "vw", "height": cellDim.toString() + "vw"});
    }
  });
    
});