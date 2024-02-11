//ab
var lines = false;

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var width
var height
var skyx,skyy,skyw,skyh,gx,gy,gw,gh,fy
var oldcx = 0;
var oldcy = 0;
var curcx = 0;
var curcy = 0;
var curt = 0;
var oldt = 0;
var nvx = 0;
var nvy = 0;

var maxVel = 100;
var maxvelx = 100;
var d = new Date();
var rad = 150;
var scalex = 2;
var scaley = 2;
var inside = false;
var bouncing = false;
var hbouncing = false;
var pbvy = 0;
var bvy = 0;
var squishing = false;
var lsquishing = false;
var rsquishing = false;
var grounded = true;
var sd = 0;
var showInteractableText = true;

var resize = function() {
  width = 2*window.innerWidth
  height = 2*window.innerHeight
  canvas.width = width
  canvas.height = height
  skyx = 0
  skyy = 0
  skyw = width
  skyh = height*2/3
  gx = 0
  gy = height*2/3
  gw = width
  gh = height*1/3
  fy = gy
}
window.onresize = resize
resize();


ctx.fillStyle = 'red'


var state = {
  x: (width / 2) + 500,
  y: fy,
  velx: 0,
  vely: 0,
  ax: 0,
  ay: 0.5
};

var inGithub = false;
var inEmail = false;
function handlers() {
  (document.onmousemove = function (event) {
    oldcx = curcx;
    oldcy = curcy;
    oldt = curt;
    curcx = (event.pageX - canvas.getBoundingClientRect().left)*scalex;
    curcy = (event.pageY - canvas.getBoundingClientRect().top)*scaley;	
    curt = (new Date()).getMilliseconds();
    if (curcx >= ghcbx && curcx <= ghcbx + ghcbw && curcy >= ghcby && curcy <= ghcby + ghcbh) {
	inGithub = true;
    } else if (curcx >= emcbx && curcx <= emcbx + emcbw && curcy >= emcby && curcy <= emcby + emcbh) {
	inEmail = true;
    } else {
        inGithub = false;
	inEmail = false;
    }
   
 //      console.log(curcx + "," + curcy + "," + state.x + "," + state.y);
  }), document.onclick = function(event) {
    if (inEmail) {
       window.open('https://mail.google.com/mail/?view=cm&fs=1&to=gabriel.jsh@gmail.com');
    } else if (inGithub) {
       window.open('https://github.com/gabehouse');
    }
  };
};
handlers();

var cursorCollision = function(p) {
  ctx.beginPath();
  ctx.arc(state.x,state.y,rad,0,2*Math.PI);

  
  if (ctx.isPointInPath(curcx,curcy)) {
    
    if (!inside) {
      if (squishing) {
        squishing = false;
      }
      if (lsquishing) {
        lsquishing = false;
      }
      if (rsquishing) {
        rsquishing = false;
      }
      var dx = (curcx - oldcx)/(curt - oldt)*3;
      var dy = (curcy - oldcy)/(curt - oldt)*3;
      if (Math.abs(dx) < 10000) {
        state.velx = dx*10/p;
        console.log("velxchange");
      } else {
        state.velx = 20;
      }
      if (Math.abs(dy) < 10000) {
        state.vely = dy*10/p;
        state.ay = 0.5;
        grounded = false;
        console.log("ay");
      } else {
        state.vely = 20;
      }
    inside = true;
    }
  } else {
    inside = false;
  }
}

var efy = fy;

var sx = 1;
var sy = 1;
var ray = 0;
var n = 0;
var bm = 0.7;
state.ay = 0.5;

  var pbvx = 0;
  var lx = rad - 5;
  var rx = width - rad + 5;
  var elx = lx;
  var erx = rx;
  var xdiff = 0;
  var ln = 0;
  
  var pbay = 0;
  var pbax = 0;

var wallCollision = function(p) {
// bottom bounce
  if (state.y + state.vely >= fy && (state.y < efy || !squishing) && state.vely > 0 && !grounded) {
    if (!squishing) { 
      state.velx *= 0.93; 
      if (lsquishing || rsquishing) {
        state.vely = -state.vely*0.7;
      } else {
      
      squishing = true;
      pbvy = state.vely;
      nvy = -state.vely*0.7;
      state.vely = state.vely*0.17;
      efy = (rad/2)*(pbvy/maxVel) + fy;
      if (efy > rad/2 + fy) {
        efy = rad/2 + fy;
      } 
      state.y = fy;
      
      
      state.velx *= 0.9;
      if (pbvy < 5) {
        state.vely = 0;
        grounded = true;
        squishing = false;
        state.ay = 0;
      }
      }
    }
  } else if (state.y >= efy && !grounded && state.vely > 0) {
// alert(state.y + ", " + fy);
  // return upwards
    state.vely = -state.vely;
  } else if (state.y < fy && squishing) {   
//stop squishing
    squishing = false;
    state.vely = nvy;
    state.ay = 0.5;
  }
console.log(sy + " " + fy + " " + state.y + " " + (efy - fy));
//LEFT
 
  if (state.x + state.velx <= lx && (state.x > elx || !lsquishing) && state.velx < 0) {
    if (!lsquishing) {
      if (squishing) {
        state.velx = -state.velx*0.7;
      }  else {
      lsquishing = true;
      pbvx = state.velx;
      nvx = -state.velx*0.7;
      state.velx = state.velx*0.17;
      elx = lx - (rad/2)*(-pbvx/maxvelx);
      if (elx < rad/2) {
        elx = rad/2;
      }
      state.x = lx;
    }
    }
  } else if (state.x <= elx && state.velx < 0) {
  // return right
    state.velx = -state.velx;
  } else if (state.x > lx && lsquishing) {
//stop squishing
    lsquishing = false;
    state.velx = nvx;
  }

//RIGHT
  if (state.x + state.velx >= rx && (state.x < erx || !rsquishing) && state.velx > 0) {
    if (!rsquishing) {
    console.log("velx = " + state.velx);
      if (squishing) {
        state.velx = -state.velx*0.7;
      }  else {
      rsquishing = true;
      pbvx = state.velx;
      nvx = -state.velx*0.7;
      state.velx = state.velx*0.17;
    console.log("velxb = " + state.velx);
      erx = rx + (rad/2)*(pbvx/maxvelx);
      if (erx > width - rad/2) {
        erx = width - rad/2;
      }
      state.x = rx;
    }
    }
  } else if (state.x >= erx && state.velx > 0) {
  // return left
    state.velx = -state.velx;
console.log("velxc = " + state.velx);
  } else if (state.x < rx && rsquishing) {
//stop squishing
    rsquishing = false;
    state.velx = nvx;
  }
}

var squish = function(p) {
  if(state.y > fy && state.x >= lx && state.x <= rx) {
    sx = (state.y - fy)/(rad/2) + 1;
    sy = 1/sx;
  } else if(state.x < lx && state.y <= fy) {
    sy = (lx - state.x)/(rad/2) + 1;
    sx = 1/sy;
  } else if(state.x > rx && state.y <= fy) {
    sy = (state.x - rx)/(rad/2) + 1;
    sx = 1/sy;
  } else {
    sx = 1;
    sy = 1;
  }
}

var moveBall = function(p) {
 // console.log(state.vely + "," + state.y);
console.log("velxn = " + state.velx);
  state.x += state.velx;
  state.y += state.vely;
  if (!grounded) {
    console.log("1 " + state.vely);
    state.vely += state.ay; 
    console.log("2 " + state.vely);
  }  else {
    state.velx *= 0.98;
  }
  state.velx += state.ax;
  if (state.vely > maxVel) {
    state.vely = maxVel;
  }
 // if (Math.abs(state.vely) <= 0.4 && fy - state.y < 3) {
 //   state.vely = 0;
 // }
}

function update(progress) {
  cursorCollision(progress);
  wallCollision(progress);
  moveBall(progress);
  squish(progress);
  if (state.vely > 0 && showInteractableText) 
  showInteractableText = false;
}

var tgrd=ctx.createLinearGradient(skyx,skyy,skyx,skyh);
var bgrd=ctx.createLinearGradient(gx,gy,gx,height);
tgrd.addColorStop(0,"white");
tgrd.addColorStop(1,"#0A0A0A");
bgrd.addColorStop(0,"#0A0A0A");
bgrd.addColorStop(1,"#f2f2f2");




function drawBackground() {
  
  ctx.fillStyle=tgrd;
  ctx.fillRect(skyx,skyy,skyw,skyh);
  ctx.fillStyle=bgrd;
  ctx.fillRect(gx,gy,gw,gh);
}

function drawCircle() {
  ctx.beginPath();
console.log("yuht" + state.y);
  ctx.ellipse(state.x,state.y,rad,rad,0,0,2*Math.PI);
  ctx.fillStyle = 'black';
  ctx.lineWidth=8
  ctx.stroke();
  ctx.fillStyle = 'yellow';
  ctx.fill();
}

function drawShading() {
  var k=10*scaley;
  var y1=state.y+5*scaley;
  var x1=-Math.sqrt(rad*rad - (y1 - state.y)*(y1 - state.y)) + state.x
  var y2=state.y+35*scaley;
  var x2=Math.sqrt(rad*rad - (y2 - state.y)*(y2 - state.y)) + state.x
  var m=-1/((y2 - y1)/(x2 - x1))
  var mx = (x1 + x2)/2
  var my = (y1 + y2)/2
  var cx = mx - k
  var cy = my - k*m
  ctx.beginPath();

  ctx.moveTo(x1,y1)
  ctx.strokeStyle = 'black'
  ctx.quadraticCurveTo(cx,cy,x2,y2)

  var a1=Math.atan((y2 - state.y)/(x2 - state.x))
  var a2=Math.atan((y1 - state.y)/(x1 - state.x)) - Math.PI
  var a = ctx.arc(state.x,state.y,rad,a1,a2)
  ctx.fillStyle = "rgba(102, 102, 102, 0.6)"
  ctx.fill()

}

function drawShadow() {
  ctx.beginPath()
  ctx.moveTo(state.x,state.y);
  var xr = rad*(1 + 0.5*(fy - state.y)/fy);
  var yr = (rad/3)*(1 + 0.3*(fy - state.y)/fy);
  ctx.ellipse(state.x, fy + rad, xr, yr, 0, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(20, 20, 20, 0.8)"
  ctx.fill();
}
var lineh = 100;
var l1cy = height/2 - 600;
var l2cy = l1cy  + lineh;
var l3cy = l1cy  + lineh*2;
var l4cy = l1cy + lineh*3;
var foottexty = height - 100;
var textx = width/2;

var ghcx = width/2 - 120;
var ghcy = l3cy;
var ghcbw = 230;
var ghcbh = 90;
var ghcbx = ghcx - ghcbw/2;
var ghcby = ghcy - ghcbh/2 - 30;

var emcx = width/2 + 560;
var emcy = l3cy;
var emcbw = 190;
var emcbh = 110;
var emcbx = emcx - emcbw/2;
var emcby = emcy - emcbh/2 - 30;
var d = (new Date()).getFullYear();

function drawText() {
  ctx.textAlign="center"; 
  ctx.fillStyle = "black";
  ctx.font = "80px Georgia";
  ctx.fillText("Hello there,",textx,l1cy);
  ctx.fillText("I'm a software developer out of University of Waterloo.",textx,l2cy);
  ctx.fillText("Feel free to check out my ",textx - 700 ,l3cy);
  ctx.fillText(", send me an ",ghcx +350, l3cy);
  ctx.fillText(", or bounce along.",textx + 975, l3cy);
// ctx.fillStyle = "blue";
//  ctx.fillRect(ghcbx, ghcby, ghcbw, ghcbh);
//  ctx.fillRect(emcbx,emcby, emcbw,emcbh);
 // ctx.fillText(".",textx + 1170,l3cy); 
  ctx.fillStyle = "yellow";
  ctx.fillText("github",ghcx,ghcy);
  ctx.fillText("email",emcx,emcy);
  if (inGithub) { 
    ctx.fillRect(ghcbx,ghcby+ghcbh,ghcbw,20);
  } else if (inEmail){
    ctx.fillRect(emcbx,emcby+emcbh,emcbw,20);
  }
  ctx.font = "30px Georgia";
  var interactTextX = state.x;
  var interactTextY = state.y - 200;

  if (showInteractableText) {
    ctx.fillText("bounce using your cursor", interactTextX, interactTextY);
  }

//footer
  ctx.font = "35px Georgia";
  ctx.fillStyle = "grey";

}

function draw() {

  drawBackground();
  drawText();
  ctx.setTransform(sx,0,0,1,-state.x*(sx - 1),0);
  drawShadow();
  ctx.setTransform(sx,0,0,sy,-state.x*(sx - 1),(state.y)*(1 - sy));
 // ctx.transform(1,0,0,1,state.x,0);
  drawCircle();
  
  drawShading();
  ctx.setTransform(1,0,0,1,0,0);
  
if (lines) {
ctx.beginPath();
ctx.moveTo(0,fy);
ctx.lineTo(width,fy);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(0,efy);
ctx.lineTo(width,efy);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(0,state.y);
ctx.lineTo(width,state.y);
ctx.beginPath();
ctx.moveTo(0,fy + rad);
ctx.lineTo(width,fy + rad);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(lx,0);
ctx.lineTo(lx,height);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(elx,0);
ctx.lineTo(elx,height);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(state.x,0);
ctx.lineTo(state.x,height);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(rx,0);
ctx.lineTo(rx,height);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(erx,0);
ctx.lineTo(erx,height);
ctx.stroke();
ctx.beginPath();
ctx.stroke();

ctx.beginPath();
ctx.moveTo(0,state.y);
ctx.lineTo(width,state.y);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(0,efy);
ctx.lineTo(width,efy);
ctx.stroke();
}

}

function loop(timestamp) {


  var progress = timestamp - lastRender

  update(progress)
  draw()

  
  lastRender = timestamp
  window.requestAnimationFrame(loop)

}
var lastRender = 0
window.requestAnimationFrame(loop)
