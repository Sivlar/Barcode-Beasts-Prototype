let beastData = getBeastData();
var atk = 0;
var beasts = [];
var socket = io();
// import { io } from "socket.io-client";

function getBeastData() {
    fetch('./beasts.json')
        .then(res => res.json())
        .then(json => {
            beastData = json;
            populateBeastSelectors();
            $('#beastSelection').modal('show');
        });
}

function populateBeastSelectors() {
    var selectors = document.querySelectorAll("select");

    selectors.forEach(x => {
        var option = document.createElement("option");
        option.innerHTML = "--Select a Beast--";
        option.value = 0;
        x.appendChild(option);

        beastData.forEach(b => {
            option = document.createElement("option");
            option.value = b.Name;
            option.innerHTML = b.Name;

            x.appendChild(option);
        });
    });
}

function chooseRandomBeasts() {
    var selectors = document.querySelectorAll("select");

    socket.emit("howdy", "Hello World");

    selectors.forEach(x => {
        var randNum = Math.floor(Math.random() * (x.options.length - 1) + 1);// Random number between 1 and the number of selectable Beasts.
        x.options.selectedIndex = randNum;
    });
}

function mapBeastsToElementsByName() {
    const arrOfNames = [
        document.querySelector('#player1Beast1Selector').value,
        document.querySelector('#player1Beast2Selector').value,
        document.querySelector('#player1Beast3Selector').value,
        document.querySelector('#player2Beast1Selector').value,
        document.querySelector('#player2Beast2Selector').value,
        document.querySelector('#player2Beast3Selector').value
    ];
    var currentBeast;

    for (let i = 0; i <= 5; i++) {
        currentBeast = beastData.find(x => x.Name === arrOfNames[i]);
        var img, maxHp, currentHp, currentPrs, maxPrs, atk, def, spd;

        switch (i) {
            case 0:
                img = document.querySelector('#player1Beast3Img');
                maxHp = document.querySelector('#maxHpP1B3')
                currentHp = document.querySelector('#currentHpP1B3');
                currentPrs = document.querySelector('#currentPrsP1B3');
                maxPrs = document.querySelector('#maxPrsP1B3');
                atk = document.querySelector('#currentAtkP1B3');
                def = document.querySelector('#currentDefP1B3');
                spd = document.querySelector('#currentSpdP1B3');
                break;
            case 1:
                img = document.querySelector('#player1Beast2Img');
                maxHp = document.querySelector('#maxHpP1B2')
                currentHp = document.querySelector('#currentHpP1B2');
                currentPrs = document.querySelector('#currentPrsP1B2');
                maxPrs = document.querySelector('#maxPrsP1B2');
                atk = document.querySelector('#currentAtkP1B2');
                def = document.querySelector('#currentDefP1B2');
                spd = document.querySelector('#currentSpdP1B2');
                break;
            case 2:
                img = document.querySelector('#player1Beast1Img');
                maxHp = document.querySelector('#maxHpP1B1')
                currentHp = document.querySelector('#currentHpP1B1');
                currentPrs = document.querySelector('#currentPrsP1B1');
                maxPrs = document.querySelector('#maxPrsP1B1');
                atk = document.querySelector('#currentAtkP1B1');
                def = document.querySelector('#currentDefP1B1');
                spd = document.querySelector('#currentSpdP1B1');
                break;
            case 3:
                img = document.querySelector('#player2Beast1Img');
                maxHp = document.querySelector('#maxHpP2B1')
                currentHp = document.querySelector('#currentHpP2B1');
                currentPrs = document.querySelector('#currentPrsP2B1');
                maxPrs = document.querySelector('#maxPrsP2B1');
                atk = document.querySelector('#currentAtkP2B1');
                def = document.querySelector('#currentDefP2B1');
                spd = document.querySelector('#currentSpdP2B1');
                break;
            case 4:
                img = document.querySelector('#player2Beast2Img');
                maxHp = document.querySelector('#maxHpP2B2')
                currentHp = document.querySelector('#currentHpP2B2');
                currentPrs = document.querySelector('#currentPrsP2B2');
                maxPrs = document.querySelector('#maxPrsP2B2');
                atk = document.querySelector('#currentAtkP2B2');
                def = document.querySelector('#currentDefP2B2');
                spd = document.querySelector('#currentSpdP2B2');
                break;
            case 5:
                img = document.querySelector('#player2Beast3Img');
                maxHp = document.querySelector('#maxHpP2B3')
                currentHp = document.querySelector('#currentHpP2B3');
                currentPrs = document.querySelector('#currentPrsP2B3');
                maxPrs = document.querySelector('#maxPrsP2B3');
                atk = document.querySelector('#currentAtkP2B3');
                def = document.querySelector('#currentDefP2B3');
                spd = document.querySelector('#currentSpdP2B3');
                break;
            default:
        }

        img.src = currentBeast.Img;
        maxHp.value = currentBeast.HP;
        currentHp.value = maxHp.value;
        currentPrs.value = 0;
        maxPrs.value = 10;
        atk.value = currentBeast.ATK;
        def.value = currentBeast.DEF;
        spd.value = currentBeast.SPD;
    }
}

function startGame() {
    mapBeastsToElementsByName();
    startTurnTracker();
}

function startTurnTracker() {// Right unit tests. TODO
    document.querySelector('#round').value = 1;// Start at round 1.
    determineTurnOrderForRound();
    passTurn();
}

function determineTurnOrderForRound() {//Get speed from textboxes TODO
    let beast0 = { name: "Beast0", spd: 5 };
    let beast1 = { name: "Beast1", spd: 1 };
    let beast2 = { name: "Beast2", spd: 2 };
    let beast3 = { name: "Beast3", spd: 3 };
    let beast4 = { name: "Beast4", spd: 4 };
    let beast5 = { name: "Beast5", spd: 5 };

    //beast0 = getElementB

    let beasts = [beast0, beast1, beast2, beast3, beast4, beast5];

    console.log(beasts);
    beasts.sort((x, y) => parseFloat(y.spd) - parseFloat(x.spd));
    console.log(beasts);
}

function setAtk(atkElemId) {
    atk = document.querySelector('#' + atkElemId).value;
    console.log("Attack Set: " + atk);
}

function defend(defElemId, currHpElemId) {
    var def = document.querySelector('#' + defElemId).value;
    var hpElem = document.querySelector('#' + currHpElemId);

    console.log("Defense Set: " + def);
    console.log("Attacking...");

    var damage = parseInt(atk) * parseInt(atk) / (parseInt(atk) + parseInt(def));
    var damageRounded = Math.round(damage);
    console.log("Damage: " + damage + " (rounded to " + damageRounded + ")");

    hpElem.value -= damageRounded;
}

function swapBeastRow(cardElemId) {
    let cardElem = document.querySelector('#' + cardElemId);

    let currRow = cardElem.parentElement;
    let currRowIndex = Array.prototype.indexOf.call(currRow.parentElement.children, currRow);

    let newRowIndex = currRowIndex === 0 ? 1 : 0;

    currRow.parentElement.children[newRowIndex].appendChild(cardElem);
}

function flipCoin() {
    var coin = document.querySelector('#coinResult');
    var randNum = Math.floor(Math.random() * (2 - 1 + 1) + 1);//Random number between 1 and 2.
    coin.innerHTML = randNum === 1 ? "Heads" : "Tails";
}

function passTurn() {

}

function highlightBeast() {

}
