// Fix swiping. Add arrows. Add Joystick.

// All green have to touch to win
// Touching a red resets the level (movable?)
// Yellow makes you stuck (movable?)
// Brown is a barrier
// Save color combos
// Fireflies, Rain, Stars

let game = document.getElementById("game");
game.width = Math.min(0.75*window.innerWidth, 0.75*8*window.innerHeight/4);
game.height = Math.min(0.75*window.innerHeight, 0.75*4*window.innerWidth/8);

let pen = game.getContext("2d");

let blurryIndex = window.devicePixelRatio;
function fixBlurryIndex ()
{
  let blurryHeight = getComputedStyle(game).getPropertyValue("height").slice(0, -2);
  let blurryWidth = getComputedStyle(game).getPropertyValue("width").slice(0, -2);

  game.setAttribute('height', blurryHeight * blurryIndex);
  game.setAttribute('width', blurryWidth * blurryIndex);
}

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let d_x = true;
let d_y = true;
let keys = [];

function reset ()
{
  d_x = true;
  d_y = true;
}

function keyPressed (key)
{
  return keys.includes(key);
}

window.addEventListener('resize', () => {
  game.width = Math.min(0.80*window.innerWidth, 6.40*window.innerHeight/4);
  game.height = Math.min(0.80*window.innerHeight, 3.20*window.innerWidth/8);
})

window.addEventListener('keydown', (key) => {
  if (keys.includes(key.keyCode) == false)
  {
      keys.push(key.keyCode);
  }
})

window.addEventListener('keyup', (key) => {
    if (keys.includes(key.keyCode))
    {
        keys.splice(keys.indexOf(key.keyCode), 1);
    }
})

class Block
{
    constructor (c, x, y, s, r)
    {
      this.c = c;
      this.x = x;
      this.y = y;
      this.s = s;
      this.r = r;
    }

    roundRect()
    {
      pen.fillStyle = this.c;
      pen.beginPath();
      pen.moveTo(this.x + this.r, this.y);
      pen.arcTo(this.x + this.s, this.y, this.x + this.s, this.y + this.s, this.r);
      pen.arcTo(this.x + this.s, this.y + this.s, this.x, this.y + this.s, this.r);
      pen.arcTo(this.x, this.y + this.s, this.x, this.y, this.r);
      pen.arcTo(this.x, this.y, this.x + this.s, this.y, this.r);
      pen.fill();
    }

    resize(s)
    {
      this.s = s;
      this.r = s/10;
    }

    reposition(s1, s2)
    {
      this.x = s1 * this.x;
      this.y = s2 * this.y;
    }

}

class PlayerBlock extends Block
{
  constructor (c, x, y, s, r)
  {
    super(c, x, y, s, r);
    this.v_x = 0;
    this.v_y = 0;
    this.a_x = 0.5;
    this.a_y = 0.5;
    this.u = 0.2;
  }

  accelerate ()
  {
    if (keyPressed(39))
    {
      this.v_x += this.a_x;
    }
    if (keyPressed(37))
    {
      this.v_x -= this.a_x;
    }
    if (keyPressed(40))
    {
      this.v_y += this.a_y;
    }
    if (keyPressed(38))
    {
      this.v_y -= this.a_y;
    }
  }

  decelerate ()
  {
    if (keyPressed(37) || (keyPressed(39)))
    {
      d_x = false;
    }

    if (keyPressed(38) || (keyPressed(40)))
    {
      d_y = false;
    }

    if ((this.v_x > 0) && (d_x))
    {
      this.v_x -= this.u * this.a_x;
    }

    if ((this.v_x < 0) && (d_x))
    {
      this.v_x += this.u * this.a_x;
    }

    if ((this.v_y > 0) && (d_y))
    {
      this.v_y -= this.u * this.a_y;
    }

    if ((this.v_y < 0) && (d_y))
    {
      this.v_y += this.u * this.a_y;
    }

    if (Math.abs(this.v_x) < 0.1)
    {
      this.v_x = 0;
    }

    if (Math.abs(this.v_y) < 0.1)
    {
      this.v_y = 0;
    }
  }

  collisions ()
  {
    if (this.x < 0)
    {
      this.x = 0;
      this.v_x = 0;
    }

    if (this.x+this.s > game.width)
    {
      this.x = game.width - this.s;
      this.v_x = 0;
    }

    if (this.y < 0)
    {
      this.y = 0;
      this.v_y = 0;
    }

    if (this.y+this.s > game.height)
    {
      this.y = game.height - this.s;
      this.v_y = 0;
    }
  }

  intersects (other)
  {
    let x1 = this.x;
    let y1 = this.y;
    let s1 = this.s;

    let x2 = other.x;
    let y2 = other.y;
    let s2 = other.s;

    let x_shift = 0;
    let y_shift = 0;

    if ((x1 < x2) && (x2 < s1 + x1))
    {
      x_shift = x2 - (x1 + s1);
    }
    if ((x2 < x1) && (x1 < s2 + x2))
    {
      x_shift = -(x1 - (x2 + s2));
    }
    if ((y1 < y2) && (y2 < s1 + y1))
    {
      y_shift = y2 - (y1 + s1);
    }
    if ((y2 < y1) && (y1 < s2 + y2))
    {
      y_shift = -(y1 - (y2 + s2));
    }
  }

  move()
  {
    this.x += this.v_x;
    this.y += this.v_y;
  }
}

let pw = game.width;
let w = game.width;
let ph = game.height;
let h = game.height;

let one = new PlayerBlock ("#59F440", 0, 0, w/8, w/80);
let two = new Block ("#8B2D19", 4*w/8, h/4, w/8, w/80);

animate();
function animate ()
{
  w = game.width;
  h = game.height;

  requestAnimationFrame(animate);
  pen.clearRect(0, 0, w, h);

  if ((innerWidth < 350) || (innerHeight < 150) || (innerWidth <= innerHeight))
  {

  }

  else
  {
    one.resize(w/8);
    one.reposition(w/pw, h/ph);
    one.accelerate();
    one.decelerate();
    one.collisions();
    one.intersects(two);
    one.move();
    one.roundRect();

    two.resize(w/8);
    two.reposition(w/pw, h/ph);
    two.roundRect();

    reset();

    pw = game.width;
    ph = game.height;
  }
}

// https://stackoverflow.com/questions/12625766/javascript-canvas-detect-click-on-shape
