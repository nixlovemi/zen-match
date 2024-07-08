// script.js

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

document.addEventListener('DOMContentLoaded', () => {
    const mainBoard = document.getElementById('main-board');
    const bottomBar = document.getElementById('bottom-bar');
    const mainBoardBounds = mainBoard.getBoundingClientRect();
    const boardSize = mainBoardBounds.width;
    const pieceSize = 50;
    const stackCount = 9;
    const maxStackHeight = 6;
    // const pieceTypes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const pieceTypes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const barMaxLength = 7;
    let barPieces = [];
    let occupiedPositions = [];

    function generatePieces() {
        const totalPieces = maxStackHeight * stackCount;
        const pieces = [];
    
        // Determine the number of favorable pieces (60% of total pieces)
        const favorablePieceCount = Math.floor(totalPieces * 0.75);
        const favorablePieceTypes = pieceTypes.slice(0, 6); // Select 6 piece types to favor
    
        // Determine the number of remaining pieces (40% of total pieces)
        const remainingPieceCount = totalPieces - favorablePieceCount;
        const remainingPieceTypes = pieceTypes.slice(6);
    
        // Add favorable pieces in multiples of three
        for (const type of favorablePieceTypes) {
            for (let i = 0; i < favorablePieceCount / favorablePieceTypes.length; i+=3) {
                pieces.push(type, type, type);
            }
        }
    
        // Add remaining pieces in multiples of three
        for (const type of remainingPieceTypes) {
            for (let i = 0; i < remainingPieceCount / remainingPieceTypes.length; i+=3) {
                pieces.push(type, type, type);
            }
        }
    
        // Shuffle the pieces array
        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
        }

        // how many of each piece type
        const pieceCounts = {};
        pieces.forEach(piece => {
            pieceCounts[piece] = (pieceCounts[piece] || 0) + 1;
        });

        return pieces;
    }

    function initializeBoard() {
        const pieces = generatePieces();
        const totalPieces = pieces.length;
        const piecesToDistribute = totalPieces;
        let pieceIndex = 0;
    
        // Distribute pieces evenly across stacks, up to the maxStackHeight
        for (let i = 0; i < stackCount; i++) {
            const stack = document.createElement('div');
            stack.classList.add('stack');
    
            // Set random non-colliding position for the stack within the board
            let topPosition, leftPosition;
            do {
                topPosition = randomIntFromInterval(20, boardSize - pieceSize - 20);
                leftPosition = randomIntFromInterval(20, boardSize - pieceSize - 20);
            } while (isColliding(topPosition, leftPosition) && topPosition !== 0 && leftPosition !== 0);
    
            occupiedPositions.push({ top: topPosition, left: leftPosition });
            stack.style.top = `${topPosition}px`;
            stack.style.left = `${leftPosition}px`;
    
            mainBoard.appendChild(stack);
        }
    
        // Distribute all pieces across the stacks
        let currentStackIndex = 0;
        while (pieceIndex < piecesToDistribute) {
            const stack = mainBoard.children[currentStackIndex];
            const piece = document.createElement('div');
            piece.classList.add('piece');
    
            const textContent = pieces[pieceIndex % totalPieces]; // Reuse pieces if less than 72
            piece.textContent = textContent;
            if (stack.children.length > 1) {
                piece.classList.add('hidden');
            }
            piece.addEventListener('click', () => selectPiece(piece, stack));
    
            // add a custom class to the piece to identify piece type
            piece.classList.add(`piece-${textContent}`);
    
            // add z-index to the piece in descending order
            piece.style.zIndex = (maxStackHeight * 1000) - stack.children.length;
    
            stack.appendChild(piece);
            pieceIndex++;
    
            // Move to the next stack
            currentStackIndex = (currentStackIndex + 1) % stackCount;
        }
    
        // count how many of each piece type in each stack
        const pieceCounts = {};
        mainBoard.querySelectorAll('.piece').forEach(piece => {
            const type = piece.textContent;
            pieceCounts[type] = (pieceCounts[type] || 0) + 1;
        });
    }    

    // Check if a position is colliding with any existing stack positions
    function isColliding(top, left) {
        for (const pos of occupiedPositions) {
            if (Math.abs(pos.top - top) < pieceSize*1.5 && Math.abs(pos.left - left) < pieceSize*1.5) {
                return true;
            }
        }
        return false;
    }

    // Handle piece selection
    function selectPiece(piece, stack) {
        // if it's not the first piece in the stack when the stack has more than 1 piece, return
        if (stack.children.length > 1 && piece !== stack.children[0]) {
            return;
        }

        if (barPieces.length < barMaxLength) {
            const pieceClone = piece.cloneNode(true);
            bottomBar.appendChild(pieceClone);
            orderBottomBar();
            barPieces.push(pieceClone);
            piece.remove();
            revealNextPiece(stack);
            checkMatches();
        } else {
            alert('Você perdeu! A barra está cheia.');
            resetGame();
        }
    }

    function orderBottomBar() {
        // order bottomBar div pieces by class
        const pieces = Array.from(bottomBar.children);
        pieces.sort((a, b) => a.className.localeCompare(b.className));
        bottomBar.innerHTML = '';
        pieces.forEach(piece => bottomBar.appendChild(piece));
    }

    // Reveal the next piece in the stack
    function revealNextPiece(stack) {
        // two first pieces remove hidden
        for (let i = 0; i < 2; i++) {
            let piece = stack.querySelectorAll('.piece')[i];
            if (piece) {
                piece.classList.remove('hidden');

                piece.style.top = i * 12 + 'px';
                piece.style.left = i * 12 + 'px';
            }
        }
    }

    // Check for matches in the bottom bar
    function checkMatches() {
        const pieceCounts = {};
        barPieces.forEach(piece => {
            const type = piece.textContent;
            pieceCounts[type] = (pieceCounts[type] || 0) + 1;
        });

        for (const [type, count] of Object.entries(pieceCounts)) {
            if (count >= 3) {
                barPieces = barPieces.filter(piece => piece.textContent !== type);
                updateBottomBar();
                break;
            }
        }

        if (mainBoard.querySelectorAll('.piece').length === 0 && barPieces.length === 0) {
            alert('Você venceu! Clique para visualizar o prêmio \o/');

            // redirect to /images/prize.png
            window.location.href = window.location.href + 'images/prize.png';

            // resetGame();
        }
    }

    // Update the bottom bar display
    function updateBottomBar() {
        bottomBar.innerHTML = '';
        barPieces.forEach(piece => bottomBar.appendChild(piece));
    }

    // Reset the game
    function resetGame() {
        mainBoard.innerHTML = '';
        bottomBar.innerHTML = '';
        barPieces = [];
        occupiedPositions = [];
        initializeBoard();
    }

    initializeBoard();
});
