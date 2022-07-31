/*
createElement - создание элемента
appendChild - добавить элемент на страницу
remove - удаление элемента
clearInterval - останавливать таймер
 */
audioPlayer = document.querySelector("audio");
audioPlayer.volume = 0.2;
// console.dir(audioPlayer);
startButton = document.querySelector("#start button");
startBlock = document.querySelector("#start");
gameBlock = document.querySelector("#game");
gamerSkin = "skin_1";
countLifes = 5;

startButton.onclick = function () {
    startGame();
}
sound = "off";
soundButton = document.querySelector("#sound img"); // создаем переменную по выбору картинки в блоке саунд
soundButton.onclick = function () { // функция при нажатии на картинку динамика
    if (sound == "on") {
        soundButton.src = "images/mute_sound.png"; // меняем картинку на звук выключен при клике
        sound = "off";
        audioPlayer.pause();
    } else {
        soundButton.src = "images/sound_on.png"; // меняем картинку на звук включен при клике
        sound = "on";
        audioPlayer.play(); // запускаем музыку
    }
}
gamer = document.querySelector("#player"); // выбор игрока в переменную

document.onkeydown = function (event) { // события при нажатии клавиш
    if (event.code == "ArrowUp") { // нажата кнопка стрелка вверх
        if (gamer.offsetTop > 60) {
            gamer.style.top = gamer.offsetTop - 50 + "px"; // двигаем игрока на 10 пикселей вверх от текущего положения
        }
    }
    if (event.code == "ArrowDown") { // нажата кнопка стрелка вниз
        if (gamer.offsetTop < document.documentElement.scrollHeight - 210) {
            gamer.style.top = gamer.offsetTop + 50 + "px"; // двигаем игрока на 10 пикселей вниз от текущего положения
        }
    }
    if (event.code == "Space") { // нажат пробел
        createBullet();         // выстрел если нажал пробел
    }
}

function startGame() {
    startBlock.style.display = "none"; // скрытие блока старт
    gameBlock.style.display = "block"; // отобразить блок игра
    gamer.className = gamerSkin;
    createLifes();
    // createEnemy(); // создать врага
    createMultipleEnemy(); // создание нескольких врагов от 1 до 5
}

/*
работа с врагами
 */
function createEnemy() {
    let enemy = document.createElement("div"); // создание элемента
    enemy.className = "enemy " + typeEnemy(); // назначение класса случайным образом
    enemy.style.top = random(100, document.querySelector("#app").clientHeight - 120) + "px";
    gameBlock.appendChild(enemy); // создание врага
    moveEnemy(enemy); // движение врага
}

function typeEnemy() { // случайный выбор из двух скинов врага
    return "type-" + random(1, 2);
}

function moveEnemy(enemy) {
    let timerID = setInterval(function () {
        enemy.style.left = enemy.offsetLeft - 10 + "px";
        if (enemy.offsetLeft < -100) { // враг улетел за границу экрана
            enemy.remove(); // удалить врага
            // createEnemy(); // снова создать врага
            createMultipleEnemy();
            clearInterval(timerID); //остановить таймер
            die(); // смерть врага уменьшает количество жизней
        }
    }, 100);
}

function createMultipleEnemy() { // создание нескольких врагов от 1 до 5
    for (let i = 1; i <= random(1, 5); i++) {
        createEnemy();
    }
}

/*
создание выстрела
 */
function createBullet() {
    let bullet = document.createElement("div"); // создание элемента
    bullet.className = "bullet"; // назначение класса
    bullet.style.top = gamer.offsetTop + 140 + "px"; // привязка положения пули к игроку
    bullet.style.left = gamer.offsetLeft + 140 + "px"; // привязка положения пули к игроку
    gameBlock.appendChild(bullet); // создание пули
    moveBullet(bullet); // движение пули
}

function moveBullet(bullet) {
    let timerID = setInterval(function () {
        bullet.style.left = bullet.offsetLeft + 10 + "px";
        if (bullet.offsetLeft > document.querySelector("body").clientWidth + 10) { // пуля вылетает за границу экрана
            bullet.remove(); // удаление пули
            clearInterval(timerID); // остановить таймер
        }
        isBoom(bullet);
    }, 10);
}

/*
1. Попадание по врагу
2. Уменьшение жизней если враг пролетел

 */
score = document.querySelector("#score span");

function isBoom(bullet) {
    let enemies = document.querySelectorAll(".enemy");
    for (let enemy of enemies) {
        if (bullet.offsetTop > enemy.offsetTop
            && bullet.offsetTop < enemy.offsetTop + enemy.clientHeight
            && bullet.offsetLeft > enemy.offsetLeft) {
            bullet.remove();
            createBoom(enemy );
            enemy.remove();
            score.innerHTML = Number(score.innerHTML) + 1;
            let timerID = setTimeout(function () {
            createEnemy();
            clearInterval(timerID); // остановить таймер
            }, 1000)
        }
    }
}

/*
Создание взрыва на месте поражения врага пулей и удаление через 1 сек
 */
function createBoom(enemy) {
    let boom = document.createElement("div"); // создание элемента
    boom.className = "boom"; // назначение класса
    boom.style.top = enemy.offsetTop + "px"; // привязка положения взрыва к врагу
    boom.style.left = enemy.offsetLeft + "px"; // привязка положения взрыва к врагу
    gameBlock.appendChild(boom); // создание взрыва
    let timerID = setTimeout(function () {
        boom.remove(); // удаление взрыва через 1 сек после создания
        clearTimeout(timerID); // остановить таймер
    }, 1000)
}

function die() {
    countLifes -= 1;
    if (countLifes <= 0) {
        endGame();
    }
    createLifes();
}

function createLifes() {
    let lifesBlock = document.querySelector("#lifes");
    lifesBlock.innerHTML = "";
    let count = 0;
    while (count < countLifes) {
        let span = document.createElement("span");
        lifesBlock.appendChild(span);
        count += 1;
    }
}

/*
1 сделать появление врага в случайном месте экрана по вертикали(top)
  - top + 50px DONE
  - top = app.clientHeight - 140px DONE
2 Сделать появление случайного скина врага
3 Завершение игры
 */
function random(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function endGame() {
    let scoreBlock = document.querySelector("#end h3 span");
    scoreBlock.innerHTML = score.innerHTML;
    gameBlock.innerHTML = "";
    let endBlock = document.querySelector("#end");
    endBlock.style.display = "block";
    let restartButton = document.querySelector("#end button");
    restartButton.onclick = restart;

    // удаляем все таймауты
    var max_id;
    max_id = setTimeout(function () {});
    while (max_id--) {
        clearTimeout(max_id);
    }

}

function restart() {
    location.reload();
}

selectSkin1 = document.querySelector("#skin_1");
selectSkin1.onclick = function () {
    selectSkin1.className = "selected";
    selectSkin2.className = "";
    gamerSkin = "skin_1";
}
selectSkin2 = document.querySelector("#skin_2");
selectSkin2.onclick = function () {
    selectSkin2.className = "selected";
    selectSkin1.className = "";
    gamerSkin = "skin_2";
}