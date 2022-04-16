let beastData = getBeastData();
let atk = 0;
let turn;

let socket = io();
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
    let selectors = document.querySelectorAll("select");

    selectors.forEach(x => {
        let option = document.createElement("option");
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
    let selectors = document.querySelectorAll("select");

    socket.emit("howdy", "Hello World");

    selectors.forEach(x => {
        let randNum = Math.floor(Math.random() * (x.options.length - 1) + 1);// Random number between 1 and the number of selectable Beasts.
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
    let currentBeast;

    for (let i = 0; i <= 5; i++) {
        currentBeast = beastData.find(x => x.Name === arrOfNames[i]);
        let img, maxHp, currentHp, currentPrs, maxPrs, atk, def, spd, ttImg;//ttImg = turn tracker image

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
                ttImg = document.querySelector('#p1b3tt');
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
                ttImg = document.querySelector('#p1b2tt');
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
                ttImg = document.querySelector('#p1b1tt');
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
                ttImg = document.querySelector('#p2b1tt');
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
                ttImg = document.querySelector('#p2b2tt');
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
                ttImg = document.querySelector('#p2b3tt');
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
        ttImg.src = currentBeast.Img;
    }
}

function startGame() {
    mapBeastsToElementsByName();
    startTurnTracker();
}

function startTurnTracker() {// Write unit tests.
    document.querySelector('#round').value = 1;// Start at round 1.
    determineTurnOrderForRound();
    initTurnControls();
}

function initTurnControls() {
    document.querySelector('#nextTurnBtn').style.visibility = "visible";
    document.querySelector('#roundLbl').style.visibility = "visible";
    document.querySelector('#round').style.visibility = "visible";
    document.querySelector('#calcTurnsBtn').style.visibility = "visible";

    turn = -1;
    setTurnInd();
}

function setTurnInd() {
    turn++;

    // TODO This will break depending on how Beast deaths are handled.
    if (turn > 5) {
        turn = 0;// Start over at the beginning.
        document.querySelector('#round').value++;
    }

    let indexToClean;
    if (turn !== 0) indexToClean = turn - 1;
    else indexToClean = 5;

    document.querySelector('#tth' + indexToClean).src = "";

    document.querySelector('#tth' + turn).src = "./img/turnArrow.png";
}

function determineTurnOrderForRound() {
    let p1b1 = { ttid: "p1b1tt", player: 1, beastCardId: "player1Beast1", spd: parseInt(document.querySelector('#currentSpdP1B1').value), prs: parseInt(document.querySelector('#currentPrsP1B1').value), rand: Math.floor(Math.random() * (1000 - 1) + 1) }
    let p1b2 = { ttid: "p1b2tt", player: 1, beastCardId: "player1Beast2", spd: parseInt(document.querySelector('#currentSpdP1B2').value), prs: parseInt(document.querySelector('#currentPrsP1B2').value), rand: Math.floor(Math.random() * (1000 - 1) + 1) }
    let p1b3 = { ttid: "p1b3tt", player: 1, beastCardId: "player1Beast3", spd: parseInt(document.querySelector('#currentSpdP1B3').value), prs: parseInt(document.querySelector('#currentPrsP1B3').value), rand: Math.floor(Math.random() * (1000 - 1) + 1) }
    let p2b1 = { ttid: "p2b1tt", player: 2, beastCardId: "player2Beast1", spd: parseInt(document.querySelector('#currentSpdP2B1').value), prs: parseInt(document.querySelector('#currentPrsP2B1').value), rand: Math.floor(Math.random() * (1000 - 1) + 1) }
    let p2b2 = { ttid: "p2b2tt", player: 2, beastCardId: "player2Beast2", spd: parseInt(document.querySelector('#currentSpdP2B2').value), prs: parseInt(document.querySelector('#currentPrsP2B2').value), rand: Math.floor(Math.random() * (1000 - 1) + 1) }
    let p2b3 = { ttid: "p2b3tt", player: 2, beastCardId: "player2Beast3", spd: parseInt(document.querySelector('#currentSpdP2B3').value), prs: parseInt(document.querySelector('#currentPrsP2B3').value), rand: Math.floor(Math.random() * (1000 - 1) + 1) }

    ttArr = [p1b1, p1b2, p1b3, p2b1, p2b2, p2b3];

    // FOR DEBUG ONLY
    //ttArr[2].prs = 5;

    // Determine row
    ttArr.forEach((b, i) => {
        let cardElem = document.querySelector('#' + b.beastCardId);

        let currRowElem = cardElem.parentElement;
        let currRowIndex = Array.prototype.indexOf.call(currRowElem.parentElement.children, currRowElem);

        if (b.player === 1) {
            ttArr[i].row = currRowIndex === 0 ? 2 : 1;// Flip rows for player 1.
        }

        if (b.player === 2) {
            ttArr[i].row = currRowIndex + 1;
        }
    });

    // Sort by random die roll out of 100 (highest roll -> lowest roll)
    ttArr.sort((a, b) => parseFloat(b.rand) - parseFloat(a.rand));

    // Sort by Advantage (true -> false)
    // TODO

    // Sort by Position (front row (1) -> back row (2))
    ttArr.sort((a, b) => parseFloat(a.row) - parseFloat(b.row));

    // Sort by Pressure (lowest -> highest)
    ttArr.sort((a, b) => parseFloat(a.prs) - parseFloat(b.prs));

    // Sort by Speed (highest -> lowest)
    ttArr.sort((a, b) => parseFloat(b.spd) - parseFloat(a.spd));

    // Reorder the tt according to new sort ... TODO May want to extract this so that it's testable.
    ttArr.forEach((b, i) => {
        let currIndex = $('#' + b.ttid).index();

        //console.log("Beast at " + currIndex);
        //console.log("should be at " + i);

        let tt = document.querySelector('#turnTracker');
        let beastToMove = tt.children[currIndex];
        tt.insertBefore(beastToMove, tt.children[i]);
    });

    //console.log(ttArr);
}

function setAtk(atkElemId) {
    atk = document.querySelector('#' + atkElemId).value;
    console.log("Attack Set: " + atk);
}

function defend(defElemId, currHpElemId) {
    let def = document.querySelector('#' + defElemId).value;
    let hpElem = document.querySelector('#' + currHpElemId);

    console.log("Defense Set: " + def);
    console.log("Attacking...");

    let damage = parseInt(atk) * parseInt(atk) / (parseInt(atk) + parseInt(def));
    let damageRounded = Math.round(damage);
    console.log("Damage: " + damage + " (rounded to " + damageRounded + ")");

    hpElem.value -= damageRounded;
}

function swapBeastRow(cardElemId) {
    let cardElem = document.querySelector('#' + cardElemId);

    let currRowElem = cardElem.parentElement;
    let currRowIndex = Array.prototype.indexOf.call(currRowElem.parentElement.children, currRowElem);

    let newRowIndex = currRowIndex === 0 ? 1 : 0;

    currRowElem.parentElement.children[newRowIndex].appendChild(cardElem);
}

function flipCoin() {
    let coin = document.querySelector('#coinResult');
    let randNum = Math.floor(Math.random() * (2 - 1 + 1) + 1);//Random number between 1 and 2.
    coin.innerHTML = randNum === 1 ? "Heads" : "Tails";
}

function highlightBeast(cardElemId) {
    // Find Beast card.
    let cardElem = document.querySelector('#' + cardElemId);

    // Set highlight style.
    cardElem.style.transition = "background 1s";
    cardElem.style.backgroundColor = "#FDFF47";
}

function removeHightlightBeast(cardElemId) {
    // Find Beast card.
    let cardElem = document.querySelector('#' + cardElemId);

    // Set highlight style.
    cardElem.style.transition = "background 0s";
    cardElem.style.backgroundColor = "";
}
