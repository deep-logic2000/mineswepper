import openCell from "../../assets/audio/open-cell.mp3";
import openSeveralCells from "../../assets/audio/open-several-cells.mp3";
import setFlag from "../../assets/audio/set-flag.mp3";
import winGame from "../../assets/audio/tada.mp3";
import loseGame from "../../assets/audio/game-over.mp3";

class Sounds {
  constructor() {
    this.openCell = new Audio(openCell);
    this.openSeveralCells = new Audio(openSeveralCells);
    this.setFlag = new Audio(setFlag);
    this.winGame = new Audio(winGame);
    this.loseGame = new Audio(loseGame);
    this.isSoundOn = true;
  }

  openCellPlay() {
    if (!this.isSoundOn) return;
    this.openCell.play();
  }

  openSeveralCellsPlay() {
    if (!this.isSoundOn) return;
    this.openSeveralCells.play();
  }

  flagSetPlay() {
    if (!this.isSoundOn) return;
    this.setFlag.play();
  }

  winGamePlay() {
    if (!this.isSoundOn) return;
    this.winGame.play();
  }

  loseGamePlay() {
    if (!this.isSoundOn) return;
    this.loseGame.volume = 0.2;
    this.loseGame.play();
  }

  changeIsSoundOn(value) {
    this.isSoundOn = value;
  }
}

const sounds = new Sounds();

export { sounds };
