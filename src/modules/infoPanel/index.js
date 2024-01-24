import "./styles.scss";
import Element from "../element";
import clockSrc from "../../assets/images/clock.png";
import moviesSrc from "../../assets/images/clicks-icon.png";

class InfoPanel {
  constructor() {
    this.timerData = 0;
    this.moviesData = 0;
  }

  init(bombsAmount, changeMinesAmountFn) {
    this.createInfoPanel();
    this.createTimerScoreBoard();
    this.createMinesAmountInput(bombsAmount, changeMinesAmountFn);
    this.createMoviesCountBoard();
  }

  createInfoPanel() {
    this.infoPanelWrapper = new Element({ className: "info-panel-wrapper" });
    this.infoPanelWrapperMiddle = new Element({
      className: "info-panel-wrapper-middle",
      parentNode: this.infoPanelWrapper.node,
    });
    this.infoPanelWrapperInside = new Element({
      className: "info-panel-wrapper-inside",
      parentNode: this.infoPanelWrapperMiddle.node,
    });

    this.timerAndMoviesWrapper = new Element({
      className: "time-movies-wrapper",
      parentNode: this.infoPanelWrapperInside.node,
    });

    this.parentNode = document.querySelector(".boardWrapper");
    this.parentNode.prepend(this.infoPanelWrapper.node);
  }

  createTimerScoreBoard() {
    this.timerBoard = new Element({
      className: "timer-board-wrapper",
      parentNode: this.timerAndMoviesWrapper.node,
    });

    this.clockImgWrapper = new Element({
      className: "timer-img-wrapper",
      parentNode: this.timerBoard.node,
    });

    this.clockImg = new Element({
      tag: "img",
      className: "timer-img",
      attributes: { src: clockSrc, alt: "Timer" },
      parentNode: this.clockImgWrapper.node,
    });

    this.timerBoardSecondsLine = document.createElement("span");
    this.timerBoardSecondsLine.innerText = this.timerData;
    this.timerBoard.node.append(this.timerBoardSecondsLine);
  }

  updateTimer(newSeconds) {
    this.timerData = newSeconds;
    this.timerBoardSecondsLine.innerText = this.timerData;
  }

  createMoviesCountBoard() {
    this.moviesBoard = new Element({
      className: "movies-board-wrapper",
      parentNode: this.timerAndMoviesWrapper.node,
    });

    this.moviesImgWrapper = new Element({
      className: "movies-img-wrapper",
      parentNode: this.moviesBoard.node,
    });

    this.moviesImg = new Element({
      tag: "img",
      className: "movies-img",
      attributes: { src: moviesSrc, alt: "Movies" },
      parentNode: this.moviesImgWrapper.node,
    });

    this.moviesBoardLine = document.createElement("span");
    this.moviesBoardLine.innerText = this.moviesData;

    this.moviesBoard.node.append(this.moviesBoardLine);
  }

  updateMoviesData(newCount) {
    this.moviesData = newCount;
    this.moviesBoardLine.innerText = this.moviesData;
  }

  createStartGameButton(callback) {
    this.startButton = document.createElement("button");
    this.startButton.classList.add("start-button");
    this.startButton.innerText = "New Game";
    this.startButton.addEventListener("click", callback);

    this.infoPanelWrapperInside.node.append(this.startButton);
  }

  createSaveGameButton(callback) {
    this.saveButton = document.createElement("button");
    this.saveButton.classList.add("save-button");
    this.saveButton.innerText = "Save Game";
    this.saveButton.addEventListener("click", callback);

    this.infoPanelWrapperInside.node.append(this.saveButton);
  }

  createLoadGameButton(callback) {
    this.loadButton = document.createElement("button");
    this.loadButton.classList.add("load-button");
    this.loadButton.innerText = "Load Game";
    this.loadButton.addEventListener("click", callback);

    this.infoPanelWrapperInside.node.append(this.loadButton);
  }

  createMinesAmountInput(bombsAmount, callback) {
    this.inputMinesWrapper = new Element({
      className: "input-wrapper",
      parentNode: this.timerAndMoviesWrapper.node,
    });

    this.minesLabel = new Element({
      tag: "label",
      className: "input-label",
      content: "Mines: ",
      attributes: {
        for: "mines",
      },
      parentNode: this.inputMinesWrapper.node,
    });
    this.minesText = new Element({
      tag: "span",
      className: "mines-count-text",
      content: bombsAmount,
      parentNode: this.minesLabel.node,
    });
    this.inputMinesAmount = new Element({
      tag: "input",
      className: "input-range",
      attributes: {
        type: "range",
        id: "mines",
        min: "10",
        max: "99",
        name: "mines",
        value: bombsAmount,
      },
      parentNode: this.inputMinesWrapper.node,
    });

    this.changeMinesCount(callback);
  }

  changeMinesCount(callback) {
    this.timerAndMoviesWrapper.node.addEventListener("input", (event) => {
      this.minesTextNode = document.querySelector(".mines-count-text");
      this.minesTextNode.textContent = event.target.value;
      callback(event.target.value);
    });
  }
}

const infoPanel = new InfoPanel();

export { infoPanel };
