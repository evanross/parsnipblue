function start() {
	//load elements
	svg = document.getElementsByTagName("svg")[0];
	sprite = svg.getElementById("sprite");
	highscore = 0;
	jump = false;
	jump_x = 2;
	var x = parseInt(sprite.getAttribute("cx").slice(0,-1));
	var r1 = makeRect(-15, 5);
	var r2 = makeRect(-30, 5);
	var r3 = makeRect(-60,10);
	var r4 = makeRect(-95, 5);
	var r5 = makeRect(-150, 40);
	moveSprite(2, 0.1, x, false, [r1, r2, r3, r4, r5]);
			//velocity, gravity, x, side, rects
}

function resetScore() {
	var score_box = svg.getElementById("score")
	score_box.textContent = 0;
	score_box.style.opacity = 0.7;  
	score_box.setAttributeNS(null, "fill", "#FF0000");
	window.setTimeout(function() {
		score_box.style.opacity = 0.3;
		score_box.setAttributeNS(null, "fill", "#FFFFFF");
	}, 500);
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max + min + 1) + min);
}

function makeRect(y, h) {
	var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rect.setAttributeNS(null, "x", "49%");
	rect.setAttributeNS(null, "y", y + "%");
	rect.setAttributeNS(null, "width", "2%");
	rect.setAttributeNS(null, "height", h +"%");
	rect.setAttributeNS(null, "fill", "#FFFFFF");
	svg.appendChild(rect);
	return rect;
}

function moveRects(rects) {
	for (var i = 0; i < rects.length; i++) {
		var cur_y =  parseInt(rects[i].getAttributeNS(null, "y").slice(0, -1));
		if (cur_y > 100){
			rects[i].setAttributeNS(null, "height", getRandom(5, 20) + "%");
			rects[i].setAttributeNS(null, "y", 0 - getRandom(20, 70) + "%");
		} else {
			rects[i].setAttributeNS(null, "y", cur_y + 1 + "%");
		}
	}
	return rects;
}

function isInBounds(x, velocity) {
	if (0 < x + velocity && x + velocity < 100) {
		return true;
	} else {
		return false;
	}
}

function didCollide(rects) {
	//checks rects against the sprite's y coordinate (75)
	for (var i = 0; i < rects.length; i++) {
		var ry = parseInt(rects[i].getAttributeNS(null, "y").slice(0, -1));
		var rh = ry + parseInt(rects[i].getAttributeNS(null, "height").slice(0, -1));
		if (ry <= 75 && rh >= 75) {
			return true;
		}
	}
	return false;
}

function setHighscore(score) {
	var highscore_box = svg.getElementById("highscore");
	highscore_box.textContent = "Highscore: " + score;
}

function setScore(rects) {
	if (!didCollide(rects)) {
		var score_box = svg.getElementById("score");
		var score = parseInt(score_box.textContent) + 1;
		score_box.textContent = score;
		if (score > highscore) {
			setHighscore(score);
			highscore = score;
		}
	} else {
		resetScore();
	}
}

function moveSprite(velocity, gravity, x, left_side, rects) {
	if (x < 50) {
		//sprite is on left side
		if (left_side !== true) {
			//apply score if not yet applied
			left_side = true;
			setScore(rects);
		}
		//keep in bounds
		if (!isInBounds(x, velocity)) {
			velocity = Math.abs(velocity) + gravity;
		}else {
			velocity += gravity;
		}
		//if jump on left side
		if (velocity > 0 && jump) {
			//if going towards center, move sprite towards bounds
			velocity -= jump_x;
			jump = false;
		}else if (jump) {
			//if going towards bounds, move sprite towards center
			velocity = -jump_x/2;
			jump = false;
		}
	} else {
		//sprite on right side
		if (left_side !== false) {
			//apply score if not yet applied
			left_side = false;
			setScore(rects);
		}
		//keep in bounds
		if (!isInBounds(x, velocity)) {
			velocity = -(velocity) - gravity;
		} else {
			velocity -= gravity; 
		}
		//if jump on right side
		if (jump && velocity < 0) {
			//if going towards center, move in opposite direction
			velocity += jump_x;
			jump = false;
		} else if (jump) {
			//if going towards bounds, move in opposite direction
			velocity = jump_x/2;
			jump = false;
		}
	}
	
	sprite.setAttribute("cx", (x + velocity) + "%");
	
	window.requestAnimationFrame( function() {
		moveSprite(velocity, gravity, (x + velocity), left_side, moveRects(rects));
	});
}

function entry() {
	jump = true;
	return false;
}

document.onkeyup = function(e) {
	if (e.keyCode == 32) {
		entry();
	}
}
