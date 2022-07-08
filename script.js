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
    constructor (c, x, y, s, r, v_x, v_y, a_x, a_y)
    {
      this.c = c;
      this.x = x;
      this.y = y;
      this.s = s;
      this.r = r;
      this.v_x = v_x;
      this.v_y = v_y;
      this.a_x = a_x;
      this.a_y = a_y;
    }

    roundRect()
    {
      pen.fillStyle = this.c;
      pen.beginPath();
      pen.roundRect(this.x, this.y, this.s, this.s, this.r);
      pen.fill();
    }

    resize(s)
    {
      this.s = s;
      this.r = s/10;
    }
}

class PlayerBlock extends Block
{
  constructor (c, x, y, s, r, v_x, v_y, a_x, a_y, u)
  {
    super(c, x, y, s, r, v_x, v_y, a_x, a_y);
    this.u = u;
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

  move()
  {
    this.x += this.v_x;
    this.y += this.v_y;
  }
}

let one = new PlayerBlock ("#59F440", 0, 0, 1/7 * canvas.width, 1/70 * canvas.width, 0, 0, 0.5, 0.5, 0.2);

animate();
function animate ()
{
  requestAnimationFrame(animate);
  pen.clearRect(0, 0, canvas.width, canvas.height);

  one.resize(1/7 * canvas.width);
  one.accelerate();
  one.decelerate();
  one.collisions();
  one.move();
  one.roundRect();

  reset();
}
