let timerInterval;
function ResetConfirm() {
  response = confirm('Are you sure you want to reset your progress?');
  if (response) {
    score = 0;
    UpdateProgress();
    GetNextQuestion();
  }
  else {
    $('#reset').blur();
  }
}

function randomChoice(end) {
    return Math.floor(Math.random()*end);
}

function randomSample(total, num) {
  var choices = new Array(5);
  for (var i=0; i<num; i++) {
    var unique = false;
    while(!unique) {
      thischoice = randomChoice(total-i);
      unique = true;
      for(j=0; j<i; j++) {
        if(thischoice == choices[j]) unique = false;
      }
    }
    choices[i] = thischoice;
  }
  return choices;
}

function PickFive(level) {
  var part = [a, n, v][randomChoice(3)];
  var start = level*20;
  var sample = randomSample(60,5);
  var fivewords = new Array(5);
  for (var i=0; i<5; i++) {
    fivewords[i] = part[start+sample[i]];
  }
  return fivewords;
}

function GenerateWords() {
  let levelNum = 1 + Math.floor(score/100);
  if (levelNum >= 6) {
    return PickFive(randomChoice(5));
  }
  return PickFive(levelNum-1);
}

function GetNextQuestion() {
  $('.hide').addClass("hidden");
  $('#nextCell').html('<div id="nextbg" onclick="GetNextQuestion();"><span id="nextword" class="next">NEXT</span></div>');
  $('#choicestable tr').css('background-color', '#ffffff');
  $('.correct').removeClass('correctrow').removeClass('correct');
  $('#choicestable button').attr('disabled', false);
  $('.gray').addClass('black').removeClass('gray');

  var fivewords = GenerateWords();
  window.correctIndex = randomChoice(5);

  $('.question h3').html(fivewords[window.correctIndex][1]);
  for (var i=0; i<5; i++) {
    $('tr.'+i+' b').html(fivewords[i][0]);
    $('tr.'+i+' span').html(fivewords[i][1]);
  }
  $('tr.'+window.correctIndex).addClass('correct');
}

function UpdateScore(iscorrect) {
  if (iscorrect) {
    var togo = 100-score%100;
    if (togo > 3) {
        score += 3;
    }
    else {
        score += togo;
    }
  }
  else {
    if (score%100 > 3) {
      score -= 4;
    }
    else {
      score -= score%100;
    }
  }
  UpdateProgress();
}

function UpdateProgress() {
  localStorage.setItem(game + "-score", score);
  let levelNum = 1 + Math.floor(score/100);
  if (levelNum > 6) levelNum = '∞';
  $("#levelNum").text(levelNum);
  $('#progressbar').css('width', score%100+'%');
}


function Submit(object) {
  $('#choicestable button').blur();
  if ($(object).parent().parent().hasClass(correctIndex+'')) {
    $('#grade').html('CORRECT').css('color', '#6c5ce7');
  }
  else {
    $(object).parent().parent().css('background-color', '#ffe0cc');
    $('#grade').html('INCORRECT').css('color', '#ff1e00 ');
  }
  $('#choicestable button').attr('disabled', true);
  $('.hide').removeClass("hidden");
  $('.correct').addClass('correctrow').css('background-color', '#d5f3ff');
  $('.black').addClass('gray').removeClass('black');
  UpdateScore(+($(object).parent().parent().hasClass(correctIndex+'')));
  return(false);
}


function PopulateList() {
	var wordslist = '';
	var len = a.length;
	for (var i=0; i<len; ++i) {
		wordslist += '<tr><td>' + a[i][0] + '</td><td>' + a[i][1] + '</td></tr>';
		wordslist += '<tr><td>' + n[i][0] + '</td><td>' + n[i][1] + '</td></tr>';
		wordslist += '<tr><td>' + v[i][0] + '</td><td>' + v[i][1] + '</td></tr>';
	}
    $('#wordslist').html(wordslist);
	$('h3#jsmessage').html('');
}


function timer() {
  let timeInSecond = 65;
  timerInterval = setInterval(() => {

      let minutes = Math.floor(timeInSecond / 60);
      let seconds = Math.floor(timeInSecond % 60);
      timeInSecond--;
      minutes < 10 ? minutes = `0${minutes}` : minutes = minutes;
      seconds < 10 ? seconds = `0${seconds}` : seconds = seconds;

      counter.innerHTML = `${minutes} : ${seconds}`;
      timeInSecond < 0 ? submitBtn.click() : "";
  }, 1000);

}

var correctIndex;
var upgradeAlert = false;

var a = [];
var n = [];
var v = [];

if (game == "gre") {
	greWords();
} 