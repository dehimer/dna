const GRADIENT_COLOR_1 = '#65a7f7';
const GRADIENT_COLOR_2 = '#2989D8';
const GRADIENT_COLOR_3 = GRADIENT_COLOR_1;

const BUBBLES_LENGTH = 10

const BUBBLE_VY_MIN = 0.1
const BUBBLE_VY_MAX = 2

const BUBBLE_RADIUS_MIN = 1
const BUBBLE_RADIUS_MAX = 100

const BUBBLE_ALPHA_MAX = 0.25

createjs.Ticker.framerate = 30


const getRandomArbitary = (min, max) => {
  return Math.random() * (max - min) + min
}

const getRandomInt = (min, max) => {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}




class Main {

	constructor: (stage) => {

		this.stage = stage;
	    this.canvas = stage.canvas;
	    this.canvas.width  = $(document).width()
	    this.canvas.height = $(document).height()



	    this.background = new (createjs.Shape)
	    stage.addChild @background




	    this.bubbles = []
	    for i in [0...BUBBLES_LENGTH]
	      bubble = new (createjs.Shape)

	      radius = getRandomInt BUBBLE_RADIUS_MIN, BUBBLE_RADIUS_MAX
	      bubble.graphics.beginFill("#fff").drawCircle(0, 0, radius)

	      bubble.ax  = getRandomInt 0,  this.width
	      bubble.ay =  getRandomInt 0,  this.height

	      bubble.vy = getRandomArbitary BUBBLE_VY_MIN, BUBBLE_VY_MAX

	      bubble.alpha = 0
	      this.bubbles.push bubble

	      stage.addChild bubble
	}






  run: ->
    @_drawBackground()
    createjs.Ticker.addEventListener "tick", @handleTick.bind @
    console.log " - run"




  handleTick: ->

    for bubble in @bubbles
      bubble.ay  -= bubble.vy
      bubble.alpha = 1 - (Math.abs((bubble.ay / @canvas.height) - 0.5) * 2)
      bubble.alpha *= BUBBLE_ALPHA_MAX

      if bubble.ay <= 0
        bubble.ax = getRandomInt 0,  @canvas.width
        bubble.ay = @canvas.height

        bubble.vy = getRandomArbitary BUBBLE_VY_MIN, BUBBLE_VY_MAX

      bubble.x = Math.floor bubble.ax
      bubble.y = Math.floor bubble.ay

    this.stage.update()



  _drawBackground: ->


    @background.graphics
    .beginLinearGradientFill(
      [
        GRADIENT_COLOR_1
        GRADIENT_COLOR_2
        GRADIENT_COLOR_3
      ]
      [
        0
        0.5
        1
      ]
      0, 0, 0, @canvas.height
    )
    .drawRect 0, 0, @canvas.width, @canvas.height
}



$(document).ready(()=>{

	let stage = new (createjs.Stage)('background')

	// <canvas id="background"></canvas>

	let main = new Main(stage);
	main.run();

})