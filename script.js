// All green have to touch to win
// Touching a red resets the level (movable?)
// Yellow makes you stuck (movable?)
// Brown is a barrier
// Save color combos

// Collision Detection --> https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
// Fireflies, Rain, Stars

let canvas = document.getElementById("canvas");
canvas.width = Math.min(0.80*window.innerWidth, 5.60*window.innerHeight/3);
canvas.height = Math.min(0.80*window.innerHeight, 2.40*window.innerWidth/7);

let pen = canvas.getContext("2d");

let blurryIndex = window.devicePixelRatio;
function fixBlurryIndex ()
{
  let blurryHeight = getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  let blurryWidth = getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

  canvas.setAttribute('height', blurryHeight * blurryIndex);
  canvas.setAttribute('width', blurryWidth * blurryIndex);
}


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
  canvas.width = Math.min(0.80*window.innerWidth, 5.60*window.innerHeight/3);
  canvas.height = Math.min(0.80*window.innerHeight, 2.40*window.innerWidth/7);
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
      pen.roundRect(this.x, this.y, this.s, this.s, this.r);
      pen.fill();

      pen.beginPath();
      pen.moveTo(this.x + this.s, this.y + this.s);
      pen.arcTo(this.x, this.y + this.s, this.x, this.y, this.r);
      pen.arcTo(this.x, this.y, this.x + this.s, this.y, this.r);
      pen.arcTo(this.x + this.s, this.y, this.x + this.s, this.y + this.s, this.r);
      pen.arcTo(this.x + this.s, this.y + this.s, this.y, this.y + this.s, this.r);
      pen.fill();
    }

    resize(s)
    {
      this.s = s;
      this.r = s/10;
    }

    reposition(x, y)
    {
      this.x = x;
      this.y = y;
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

    if (this.x+this.s > canvas.width)
    {
      this.x = canvas.width - this.s;
      this.v_x = 0;
    }

    if (this.y < 0)
    {
      this.y = 0;
      this.v_y = 0;
    }

    if (this.y+this.s > canvas.height)
    {
      this.y = canvas.height - this.s;
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

//


  }

  move()
  {
    this.x += this.v_x;
    this.y += this.v_y;
  }
}

let w = canvas.width;
let h = canvas.height;

let one = new PlayerBlock ("#59F440", 0, 0, w/7, w/70);
let two = new Block ("#8B2D19", 3*w/7, h/3, w/7, w/70);

animate();
function animate ()
{
  w = canvas.width;
  h = canvas.height;

  requestAnimationFrame(animate);
  pen.clearRect(0, 0, w, h);

  one.resize(w/7);
  one.accelerate();
  one.decelerate();
  one.collisions();
  one.intersects(two);
  one.move();
  one.roundRect();

  two.resize(w/7);
  two.reposition(3*w/7, h/3)
  two.roundRect();

  reset();
}
