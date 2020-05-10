document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.square');
    const resultContainer = document.querySelector('.result__container');
    const displayScore = document.querySelector('#score');
    const displayResult = document.querySelector('#result');
    let width = 15;
    let currentShooterIndex = 202;
    let currentInvaderIndex = 0; //where the first alien is
    let aliensTakenDown = [];
    let score = 0;
    displayScore.textContent = score;
    let direction = 1;
    let invaderId;
    let laserId;
    let currentLaserIndex;

    //how many and where the alien invaders are
    let alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]

    // - adding the class invader to all of them -
    // we are adding the class from the very first alien
    // by using the currentInviderIndex
    // this way we are able to move all the invaders block
    // bc we will keep the gap between inviders and inviders lines
    alienInvaders.forEach(invider => {
        squares[currentInvaderIndex + invider].classList.add('invader');
    })

    // - adding the class shooter to the place we want the gun to be -
    // we are using currentShooterIndex to place the shooter in the middle
    // of the second line of the grid (bc it looks good there)
    squares[currentShooterIndex].classList.add('shooter');

    // - setting the function to move the shooter -
    // let's first remove the class shooter so it doesn't
    // appear more than once in our grid.
    // we will then use switch case to set an option for every
    // case that could take place (pressing key up, down...)
    // that's why we will include events as argument
    function moveShooterPC(e) {
        squares[currentShooterIndex].classList.remove('shooter');
        switch (e.keyCode) {
            case 37: //left
                if (currentShooterIndex % width !== 0) {
                    currentShooterIndex -= 1;
                    break;
                }
            case 39: //right
                if (currentShooterIndex % width < width - 1) {
                    currentShooterIndex += 1;
                    break;
                }
        }
        squares[currentShooterIndex].classList.add('shooter');
    }

    function moveShooterLeft() {
        squares[currentShooterIndex].classList.remove('shooter');
        if (currentShooterIndex % width !== 0) {
            currentShooterIndex -= 1;
        }
        squares[currentShooterIndex].classList.add('shooter');
    }
    function moveShooterRight() {
        squares[currentShooterIndex].classList.remove('shooter');
        if (currentShooterIndex % width < width - 1) {
            currentShooterIndex += 1;
        }
        squares[currentShooterIndex].classList.add('shooter');
    }

    const left = document.querySelector('#left');
    left.addEventListener('click', moveShooterLeft);

    const right = document.querySelector('#right');
    right.addEventListener('click', moveShooterRight);

    document.addEventListener('keydown', moveShooterPC);

    // - setting a function to move the inviders - 
    // let's first define the extrems of the grid so we can move
    // the hole inviders block instead of letting them move piece
    // by piece.
    // we will define the direction depending on the extrems,
    // if we get one extreme, the direction will be width (the inviders
    // we'll be moved a hole line down -not up bc the game will never end)
    // if they don't get the extreme the direction will be 1 or -1 so the
    // hole block moves left or right
    // everytime the inviders block moves, we will remove the class invider,
    // change the value of all the items by increasing or decreasing 1 their index
    // and adding again the class invader to the new square index taken as invader.
    // since the game will be over depending on the inviders getting the shooter,
    // we will define when the game is over and display the result.
    // we will also add the class boom and clear the interval of the invaders movement.
    function moveInviders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
        if ((leftEdge && direction == -1) || (rightEdge && direction == 1)) {
            direction = width;
        } else if (direction === width) {
            if (leftEdge) {
                direction = 1;
            } else {
                direction = -1;
            }
        }
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            squares[alienInvaders[i]].classList.remove('invader');
        }
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            alienInvaders[i] += direction;
        }
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            if (!aliensTakenDown.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader');
            }
        }

        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            squares[currentShooterIndex].classList.add('boom');
            clearInterval(invaderId);
            clearInterval(laserId);
            resultContainer.classList.remove('displayNone');
            setTimeout(() => {
                squares.forEach(square => {
                    square.classList.remove('boom', 'invader', 'laser')
                });
            }, 1000);
            currentLaserIndex = undefined;
            displayResult.textContent = 'GAME OVER';
            setTimeout(() => {
                displayResult.textContent = 'PLAY AGAIN!';
            }, 2000);
            displayResult.addEventListener('click', reload);

        }

        if (aliensTakenDown.length === alienInvaders.length) {
            resultContainer.classList.remove('displayNone');
            squares.forEach(square => {
                square.classList.remove('boom', 'invader', 'laser')
            });
            currentLaserIndex = undefined;
            displayResult.textContent = `CONGRATS! YOU KILLED ${score} INVIDERS`;
            clearInterval(invaderId);
            clearInterval(laserId);
            setTimeout(() => {
                displayResult.textContent = 'PLAY AGAIN!';
            }, 2000);
            displayResult.addEventListener('click', reload);
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            if (alienInvaders[i] > (squares.length - (width - 1))) {
                resultContainer.classList.remove('displayNone');
                squares.forEach(square => {
                    square.classList.remove('boom', 'invader', 'laser')
                });
                currentLaserIndex = undefined;
                displayResult.textContent = 'GAME OVER';
                clearInterval(invaderId);
                clearInterval(laserId);
                setTimeout(() => {
                    displayResult.textContent = 'PLAY AGAIN!';
                }, 2000);
                displayResult.addEventListener('click', reload);
            }
        }

    }

    invaderId = setInterval(moveInviders, 500);

    function shootPC(e) {
        squares.forEach(square => {
            square.classList.remove('boom');
        })
        if (e.keyCode === 32) {
            currentLaserIndex = currentShooterIndex;
            laserId = setInterval(moveLaser, 100);
        } else {
            squares.forEach(square => {
                square.classList.remove('laser');
            })
        }
    }

    function shootMP(e) {
        squares.forEach(square => {
            square.classList.remove('boom');
        })
        currentLaserIndex = currentShooterIndex;
        laserId = setInterval(moveLaser, 100);
    }


    function moveLaser() {
        if(currentLaserIndex !== undefined){
            squares[currentLaserIndex].classList.remove('laser');
            if (currentLaserIndex > width){
                currentLaserIndex -= width;
            }
            squares[currentLaserIndex].classList.add('laser');
            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');
                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                aliensTakenDown.push(alienTakenDown);
                score++
                setTimeout(() => {
                    squares[currentLaserIndex].classList.remove('boom');
                }, 100);
                clearInterval(laserId);
                displayScore.textContent = score;
            }else if (currentLaserIndex < width && !squares[currentLaserIndex].classList.contains('invader')) {
                clearInterval(laserId);
                    squares[currentLaserIndex].classList.remove('laser');
            }
        }
        
    }


    document.addEventListener('keyup', shootPC);
    const shoot = document.querySelector('#shoot');
    shoot.addEventListener('click', shootMP);

    function reload() {
        clearInterval(laserId);
        laserId = null;
        displayScore.textContent = 0;
        displayResult.textContent = "";
        score = 0;
        displayScore.textContent = score;
        resultContainer.classList.add('displayNone');
        aliensTakenDown = [];
        alienInvaders = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            30, 31, 32, 33, 34, 35, 36, 37, 38, 39
        ];
        currentInvaderIndex = 0;
        alienInvaders.forEach(invider => {
            squares[currentInvaderIndex + invider].classList.add('invader');
        })
        invaderId = setInterval(moveInviders, 500);
    }


})