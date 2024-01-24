import "./styles.scss";
import Element from "../element";
import { header } from "../header";
import { infoPanel } from "../infoPanel";
import { modal } from "../modal";
import { sounds } from "../audio";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";

class Board {
  constructor() {
    this.widthCells = 10;
    this.heightCells = 10;
    this.bombAmount = 10;
    this.cellsNodeArr = [];
    this.cellsClassArr = [];
    this.arrayWithNumbersInCells = [];
    this.bombsLeftToReveal = this.bombAmount;
    this.timer = 0;
    this.clickCount = 0;
    this.isGameLosed = false;
    this.isGameWon = false;
    this.currentTarget = null;
  }

  init() {
    header.init(this.widthCells);
    this.createBoard();
    this.addListeners();
    this.createBombsDataArrs();
    this.tempBombAmount = this.bombAmount;
  }

  startNewGame() {
    this.isGameLosed = false;
    this.isGameWon = false;
    this.cellsClassArr = [];
    this.arrayWithNumbersInCells = [];
    for (let i = 0; i < this.widthCells * this.heightCells; i++) {
      const element = this.cellsNodeArr[i];
      element.className = "cell";
      element.innerText = "";
    }
    this.timer = 0;
    this.clickCount = 0;
    this.tempBombAmount = this.bombAmount;
    infoPanel.updateTimer(this.timer);
    infoPanel.updateMoviesData(this.clickCount);
    this.stopTimer();
    this.createBombsDataArrs();
  }

  createBoard() {
    if (this.mainSection) {
      this.mainSection.node.remove();
    }

    this.mainSection = new Element({ tag: "main", className: "main" });

    this.boardWrapper = new Element({
      className: "boardWrapper",
      parentNode: this.mainSection.node,
    });

    this.boardWrapperOutside = new Element({
      className: "boardWrapperOutside",
      parentNode: this.boardWrapper.node,
    });

    this.boardWrapperMiddle = new Element({
      className: "boardWrapperMiddle",
      parentNode: this.boardWrapperOutside.node,
    });

    this.boardWrapperInside = new Element({
      className: "boardWrapperInside",
      parentNode: this.boardWrapperMiddle.node,
    });

    this.header = document.querySelector("header");
    this.header.after(this.mainSection.node);
    this.changeWidthCells();

    for (let i = 0; i < this.widthCells * this.heightCells; i++) {
      this.createCell(i);
    }

    infoPanel.init(this.bombAmount, this.changeBombsAmount.bind(this));
    infoPanel.createStartGameButton(this.startNewGame.bind(this));
    infoPanel.createSaveGameButton(this.saveCurrentProgress.bind(this));
    infoPanel.createLoadGameButton(this.restoreProgress.bind(this));
    this.addMouseOverListeners();
  }

  createBombsDataArrs() {
    this.cellsClassArr = [];
    this.arrayWithNumbersInCells = [];
    this.cellsClassArr = this.createCellsShuffledArray();
    this.cellsNodeArr = document.querySelectorAll(".cell");
    this.arrayWithNumbersInCells = this.createNumbersArray(this.cellsClassArr);
  }

  createCell(id) {
    this.cell = new Element({
      className: "cell",
      parentNode: this.boardWrapperInside.node,
      attributes: { id },
    });
  }

  createCellsShuffledArray() {
    this.bombsArray = Array(this.bombAmount).fill("bomb");
    const emptyArray = Array(
      this.widthCells * this.heightCells - this.bombAmount
    ).fill("notBomb");
    const cellsArray = emptyArray.concat(this.bombsArray);
    const shuffledArray = this.shuffleArray(cellsArray);

    return shuffledArray;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  createNumbersArray(arrayOfCells) {
    for (let i = 0; i < arrayOfCells.length; i++) {
      let countOfMines = this.checkCountOfMines(i);
      this.arrayWithNumbersInCells.push(countOfMines);
    }

    return this.arrayWithNumbersInCells;
  }

  checkCountOfMines(id) {
    let countMines = 0;
    const isLeftEdge = id % this.widthCells === 0;
    const isRightEdge = id % this.widthCells === this.widthCells - 1;
    const isBombPresent = (id) => {
      return this.cellsClassArr[id] === "bomb";
    };
    if (this.cellsClassArr[id] === "notBomb") {
      if (id > 0 && !isLeftEdge && isBombPresent(id - 1)) {
        countMines++;
      }
      if (
        id < this.cellsNodeArr.length &&
        !isRightEdge &&
        isBombPresent(id + 1)
      ) {
        countMines++;
      }
      if (id >= this.widthCells && isBombPresent(id - this.widthCells)) {
        countMines++;
      }
      if (
        id < this.cellsNodeArr.length - this.widthCells &&
        isBombPresent(id + this.widthCells)
      ) {
        countMines++;
      }
      if (
        id > this.widthCells &&
        !isLeftEdge &&
        isBombPresent(id - this.widthCells - 1)
      ) {
        countMines++;
      }
      if (
        id >= this.widthCells &&
        !isRightEdge &&
        isBombPresent(id - this.widthCells + 1)
      ) {
        countMines++;
      }
      if (
        id < this.cellsNodeArr.length - this.widthCells &&
        !isLeftEdge &&
        isBombPresent(id + this.widthCells - 1)
      ) {
        countMines++;
      }
      if (
        id < this.cellsNodeArr.length - this.widthCells - 1 &&
        !isRightEdge &&
        isBombPresent(id + this.widthCells + 1)
      ) {
        countMines++;
      }
    }

    return countMines;
  }

  handleMouseDown(e) {
    if (this.isGameLosed) return;
    if (this.isGameWon) return;

    switch (e.button) {
      case 0:
        this.mouseDown = true;
        if (
          e.target.classList.contains("cell") &&
          !e.target.classList.contains("flag")
        )
          e.target.classList.add("pressed");
        break;
      case 2:
        if (!e.target.classList.contains("cell")) return;
        this.handleAddFlag(e.target);
        break;
      default:
        return;
    }
  }

  handleMouseUp(cell, button) {
    this.mouseDown = false;
    if (this.isGameLosed) return;
    if (this.isGameWon) return;
    if (button === 2 || cell.classList.contains("checked")) return;
    if (cell.classList.contains("flag") || !cell.classList.contains("cell"))
      return;
    const id = cell.getAttribute("id");
    const isStartCellIsBomb = this.cellsClassArr[id] === "bomb";
    if (this.clickCount === 0 && isStartCellIsBomb) {
      this.createBombsDataArrs();
      this.handleMouseUp(cell, button);
      return;
    }
    if (!this.interval && cell.classList.contains("cell")) {
      this.startTimer();
    }

    if (button === 0 && cell.classList.contains("cell")) this.clickCount++;
    infoPanel.updateMoviesData(this.clickCount);

    if (this.cellsClassArr[id] === "bomb") {
      this.explodedCellId = id;
      cell.classList.add("exploded-cell");
      this.gameLosed();
      return;
    }
    const numberOfBombs = this.arrayWithNumbersInCells[id];
    cell.classList.add("checked");
    if (numberOfBombs !== 0) {
      sounds.openCellPlay();
      this.checkWeitherWin();
      cell.classList.remove("flag");
      cell.innerText = numberOfBombs;
      if (numberOfBombs === 1) cell.classList.add("one");
      if (numberOfBombs === 2) cell.classList.add("two");
      if (numberOfBombs === 3) cell.classList.add("three");
      if (numberOfBombs === 4) cell.classList.add("four");
      if (numberOfBombs === 5) cell.classList.add("five");
      if (numberOfBombs === 6) cell.classList.add("six");
      if (numberOfBombs === 7) cell.classList.add("seven");
      if (numberOfBombs === 8) cell.classList.add("eight");
      return;
    }
    cell.classList.remove("flag");
    this.checkEmptyNeighbourCells(Number(id));
    this.checkWeitherWin();
  }

  checkEmptyNeighbourCells(id) {
    const isLeftEdge = id % this.widthCells === 0;
    const isRightEdge = id % this.widthCells === this.widthCells - 1;

    setTimeout(() => {
      if (id > 0 && !isLeftEdge) {
        const neighbourCellToOpen = this.cellsNodeArr[id - 1];
        this.handleMouseUp(neighbourCellToOpen);
        sounds.openSeveralCellsPlay();
      }
      if (id < this.cellsNodeArr.length && !isRightEdge) {
        const neighbourCellToOpen = this.cellsNodeArr[id + 1];
        this.handleMouseUp(neighbourCellToOpen);
        sounds.openSeveralCellsPlay();
      }
      if (id >= this.widthCells) {
        const neighbourCellToOpen = this.cellsNodeArr[id - this.widthCells];
        this.handleMouseUp(neighbourCellToOpen);
        sounds.openSeveralCellsPlay();
      }
      if (id < this.cellsNodeArr.length - this.widthCells) {
        const neighbourCellToOpen = this.cellsNodeArr[id + this.widthCells];
        this.handleMouseUp(neighbourCellToOpen);
        sounds.openSeveralCellsPlay();
      }
      if (id > this.widthCells && !isLeftEdge) {
        const neighbourCellToOpen = this.cellsNodeArr[id - this.widthCells - 1];
        this.handleMouseUp(neighbourCellToOpen);
        sounds.openSeveralCellsPlay();
      }
      if (id >= this.widthCells && !isRightEdge) {
        const neighbourCellToOpen = this.cellsNodeArr[id - this.widthCells + 1];
        this.handleMouseUp(neighbourCellToOpen);
        sounds.openSeveralCellsPlay();
      }
      if (id < this.cellsNodeArr.length - this.widthCells && !isLeftEdge) {
        const neighbourCellToOpen = this.cellsNodeArr[id + this.widthCells - 1];
        this.handleMouseUp(neighbourCellToOpen);
        sounds.openSeveralCellsPlay();
      }
      if (id < this.cellsNodeArr.length - this.widthCells - 1 && !isRightEdge) {
        const neighbourCellToOpen = this.cellsNodeArr[id + this.widthCells + 1];
        this.handleMouseUp(neighbourCellToOpen);
        sounds.openSeveralCellsPlay();
      }
    }, 5);
  }

  handleAddFlag(element) {
    if (element.classList.contains("checked")) return;
    if (element.classList.contains("flag")) {
      element.classList.remove("flag");
      this.bombsLeftToReveal++;
    } else {
      element.classList.add("flag");
      this.bombsLeftToReveal--;
    }
    sounds.flagSetPlay();
  }

  handleMouseOver(e) {
    if (this.mouseDown && !e.target.classList.contains("flag")) {
      e.target.classList.add("pressed");
    }
  }

  handleMouseOut(e) {
    e.target.classList.remove("pressed");
  }

  saveGameResult() {
    const date = new Date();
    const resultObj = {
      date: date,
      difficulty: `${this.widthCells}*${this.heightCells}`,
      mines: this.bombAmount,
      time: this.timer,
      movies: this.clickCount,
    };
    this.lastResults = getLocalStorage("lastResults") || [];
    this.lastResults.push(resultObj);
    if (this.lastResults.length > 10) {
      this.lastResults.splice(0, 1);
    }
    setLocalStorage("lastResults", this.lastResults);
  }

  saveCurrentProgress() {
    const cellsNodeArr = Array.from(document.querySelectorAll(".cell"));
    const checkedCellsArr = cellsNodeArr.map((el) =>
      el.classList.contains("checked") ? "checked" : false
    );
    const flagCellsArr = cellsNodeArr.map((el) =>
      el.classList.contains("flag") ? "flag" : false
    );

    const progressObj = {
      cellsClassArr: this.cellsClassArr,
      arrayWithNumbersInCells: this.arrayWithNumbersInCells,
      checkedCellsArr: checkedCellsArr,
      flagCellsArr: flagCellsArr,
      timer: this.timer,
      clickCount: this.clickCount,
      width: this.widthCells,
      height: this.heightCells,
      bombAmount: this.bombAmount,
      isGameLosed: this.isGameLosed,
      isGameWon: this.isGameWon,
      explodedCellId: this.explodedCellId || null,
    };
    setLocalStorage("savedLastProgress", progressObj);
  }

  restoreProgress() {
    const progressObj = getLocalStorage("savedLastProgress");
    if (!progressObj) return;
    this.stopTimer();
    this.cellsClassArr = [];
    this.arrayWithNumbersInCells = [];
    this.arrayWithNumbersInCells = progressObj.arrayWithNumbersInCells;
    this.cellsClassArr = progressObj.cellsClassArr;
    this.widthCells = progressObj.width;
    this.heightCells = progressObj.height;
    this.bombAmount = progressObj.bombAmount;
    this.tempBombAmount = progressObj.bombAmount;
    this.explodedCellId = progressObj.explodedCellId;
    this.createBoard();
    this.cellsNodeArr = document.querySelectorAll(".cell");

    for (let i = 0; i < this.cellsNodeArr.length; i++) {
      const element = this.cellsNodeArr[i];
      element.setAttribute("id", i);
      progressObj.checkedCellsArr[i] &&
        element.classList.add(progressObj.checkedCellsArr[i]);
      progressObj.flagCellsArr[i] &&
        element.classList.add(progressObj.flagCellsArr[i]);
      if (
        progressObj.arrayWithNumbersInCells[i] !== 0 &&
        element.classList.contains("checked")
      ) {
        element.innerText = progressObj.arrayWithNumbersInCells[i];
        if (progressObj.arrayWithNumbersInCells[i] === 1)
          element.classList.add("one");
        if (progressObj.arrayWithNumbersInCells[i] === 2)
          element.classList.add("two");
        if (progressObj.arrayWithNumbersInCells[i] === 3)
          element.classList.add("three");
        if (progressObj.arrayWithNumbersInCells[i] === 4)
          element.classList.add("four");
        if (progressObj.arrayWithNumbersInCells[i] === 5)
          element.classList.add("five");
        if (progressObj.arrayWithNumbersInCells[i] === 6)
          element.classList.add("six");
        if (progressObj.arrayWithNumbersInCells[i] === 7)
          element.classList.add("seven");
        if (progressObj.arrayWithNumbersInCells[i] === 8)
          element.classList.add("eight");
      }
    }

    this.isGameLosed = progressObj.isGameLosed;
    this.isGameWon = progressObj.isGameWon;
    this.timer = progressObj.timer;
    this.clickCount = progressObj.clickCount;

    header.switchActiveButton(this.widthCells);
    infoPanel.updateTimer(this.timer);
    this.startTimer();
    infoPanel.updateMoviesData(progressObj.clickCount);
    this.checkWeitherWin();
    if (progressObj.isGameLosed) {
      this.explodedCell = document.getElementById(progressObj.explodedCellId);
      if (progressObj.explodedCellId)
        this.explodedCell.classList.add("exploded-cell");
      this.gameLosed();
    }
  }

  addListeners() {
    window.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    window.addEventListener("mouseup", (e) =>
      this.handleMouseUp(e.target, e.button)
    );
    window.addEventListener("contextmenu", (e) => {
      if (e.target.classList.contains("cell")) {
        e.preventDefault();
      }
    });
    this.addMouseOverListeners();
    window.addEventListener("beforeunload", (e) => this.saveCurrentProgress(e));
  }

  addMouseOverListeners() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((el) => {
      el.addEventListener("mouseover", (e) => this.handleMouseOver(e));
      el.addEventListener("mouseout", (e) => this.handleMouseOut(e));
    });
  }

  gameLosed() {
    sounds.loseGamePlay();
    for (let i = 0; i < this.cellsNodeArr.length; i++) {
      const element = this.cellsNodeArr[i];
      if (
        this.cellsClassArr[i] === "bomb" &&
        !element.classList.contains("flag")
      ) {
        element.classList.add("bomb");
      }
    }

    const modalContent = "Game over. Try again";
    modal.renderWinModal({ isWin: false }, modalContent);
    this.stopTimer();
    this.isGameLosed = true;
  }

  checkWeitherWin() {
    const checkedCells = document.querySelectorAll(".checked");
    const cellsAmountNotChecked =
      this.cellsClassArr.length - checkedCells.length;

    const notCheckedCells = document.querySelectorAll(".cell:not(.checked)");
    if (this.tempBombAmount === cellsAmountNotChecked) {
      notCheckedCells.forEach((el) => el.classList.add("flag"));
      setTimeout(() => {
        let modalContent = `Hooray! You found all mines in ${this.timer} seconds and ${this.clickCount} moves!`;
        modal.renderWinModal({ isWin: true }, modalContent);
        this.stopTimer();
      }, 0);
      sounds.winGamePlay();
      this.isGameWon = true;
      this.saveGameResult();
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timer = this.timer + 1;
      infoPanel.updateTimer(this.timer);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
    this.interval = null;
  }

  switchDifficulty({ width, height }) {
    this.widthCells = width;
    this.heightCells = height;
    this.createBoard();
    this.createBombsDataArrs();
    this.startNewGame();
  }

  changeBombsAmount(newValue) {
    this.bombAmount = Number(newValue);
  }

  changeWidthCells() {
    this.boardWrapperOutside.node.classList.remove("boardWrapperOutside-m");
    this.boardWrapperOutside.node.classList.remove("boardWrapperOutside-l");

    this.boardWrapperInside.node.classList.remove("boardWrapperInside-m");
    this.boardWrapperInside.node.classList.remove("boardWrapperInside-l");

    if (this.widthCells === 15) {
      this.boardWrapperOutside.node.classList.add("boardWrapperOutside-m");
      this.boardWrapperInside.node.classList.add("boardWrapperInside-m");
    }
    if (this.widthCells === 25) {
      this.boardWrapperOutside.node.classList.add("boardWrapperOutside-l");
      this.boardWrapperInside.node.classList.add("boardWrapperInside-l");
    }
  }
}

const board = new Board();

export { board, Board };
