const game_field = document.querySelector('.game_field');
const fieldRect = game_field.getBoundingClientRect();

const game_button = document.querySelector('.game_button');
const game_timer = document.querySelector('.game_timer');
const game_score = document.querySelector('.game_score');

const COUNT_CARROT = 5;
const COUNT_BUG = 5;
const GAME_DURATION_SEC = 5;

let gameState = false;
let score = 0;
let timer = undefined;

const gamePopUp = document.querySelector('.pop-up');
const gameRefresh = document.querySelector('.pop-up_replay');
const gameMessage = document.querySelector('.pop-up_message');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const gameWinSound = new Audio('./sound/game_win.mp3');
const bgSound = new Audio('./sound/bg.mp3');
const alertSound = new Audio('./sound/alert.wav');

game_button.addEventListener('click', () => {
    if (gameState) { // 게임이 시작이 되었다면...
        gameStop();
    } else { // 게임이 시작 되지 않았다면...
        gameStart();
    }
    // gameState가 true라면 반대인 false가 할당이 되고
    // gameState가 false라면 반대인 true가 된다.
    // gameState = !gameState;
});

// game_field.addEventListener('click', (event) => onFieldClick(event));
game_field.addEventListener('click', onFieldClick);

gameRefresh.addEventListener('click', () => {
    hidePopUpMessage();
    gameStart();
    showGameBtn();
})

function gameStart() {
    gameState = true;

    initGame();
    changeGameBtn();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
}

function gameStop() {
    gameState = false;

    stopGameTimer();
    hideStopBtn();
    showPopUpMessage('REPLAY ❓');
    playSound(alertSound);
    stopSound(bgSound);
};

function gameFinish(win) {
    gameState = false;

    if (win) {
        playSound(gameWinSound);
    } else {
        playSound(bugSound);
    }

    stopSound(bgSound);
    hideStopBtn();
    stopGameTimer();
    showPopUpMessage(win ? 'YOU WIN 😆' : 'YOU LOSE 😥');
}

function changeGameBtn() {
    const button_icon = game_button.querySelector('.fas');

    button_icon.classList.add('fa-stop');
    button_icon.classList.remove('fa-play');
}

function showGameBtn() {
    game_button.style.visibility = 'visible';
}

function showTimerAndScore() {
    game_timer.style.visibility = 'visible';
    game_score.style.visibility = 'visible';
}

function showPopUpMessage(message) {
    gamePopUp.classList.remove('pop-up_hide');

    gameMessage.innerHTML = message;
}

function hideStopBtn() {
    game_button.style.visibility = 'hidden';
}

function hidePopUpMessage() {
    gamePopUp.classList.add('pop-up_hide');
}

function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC;

    // 처음 값을 보여주기 위해 위에 선언 해준다.
    updateInnerText(remainingTimeSec);
    
    timer = setInterval(() => {
        if(remainingTimeSec <= 0) {
            // clearInterval(): 0이면 타이머 종료
            clearInterval(timer);
            gameFinish(COUNT_CARROT === score);
            playSound(bugSound);

            return;
        }

        // 1초마다 remainingTimeSec 값이 줄어들며 Text 값 업데이트
        updateInnerText(--remainingTimeSec);
    }, 1000);
}

function stopGameTimer() {
    clearInterval(timer);
}

function updateInnerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
    game_timer.innerHTML = `${minutes}:${seconds}`;
}

function initGame() {
    score = 0;
    game_field.innerHTML = '';
    game_score.innerHTML = COUNT_BUG;
    gameState = true;

    createItem(COUNT_CARROT, 'carrot', 'img/carrot.png');
    createItem(COUNT_BUG, 'bug', 'img/bug.png');
}

function onFieldClick(event) {
    if (!gameState) { // 게임이 시작된 상태
        return;
    }

    const target = event.target;

    if (target.matches('.carrot')) {
        // 당근
        target.remove();
        score ++;
        updateScoreBoard();
        playSound(carrotSound);

        if (COUNT_CARROT === score) {
            gameFinish(true);
        }

    } else if (target.matches('.bug')) {
        // 벌레
        gameFinish(false);
        playSound(bugSound);
    }
}

function playSound(soundName) {
    soundName.currentTime = 0;
    soundName.play();
}

function stopSound(soundName) {
    soundName.pause();
}

function updateScoreBoard() {
    game_score.innerText = COUNT_CARROT - score;
}

function createItem(count, className, imgPath) {
    const x1 = 0;
    const y1 = 0;

    const rectX = fieldRect.width - 80;
    const rectY = fieldRect.height - 80;

    // console.log(`rectX: ${rectX} rectY: ${rectY}`);

    for (let i = 0; i < count; i++) {
        const item = document.createElement('img');

        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';

        const x = randomNum(x1, rectX);
        const y = randomNum(y1, rectY);

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;

        game_field.appendChild(item);
    }
}

// 두 값 사이의 난수 생성하기
// 이 예제는 주어진 두 값 사이의 난수를 생성한다.
// 함수의 반환값은 min보다 크거나 같으며, max보다 작다.
function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}