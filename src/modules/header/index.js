import "./styles.scss";
import { board } from "../board";
import logo from "../../assets/images/logo.png";
import tropheyImg from "../../assets/images/trophey.png";
import Element from "../element";
import { modal } from "../modal";
import { sounds } from "../audio";
import { getLocalStorage } from "../../utils/localStorage";

class Header {
  constructor() {
    this.parentNode = document.body;
  }

  init(widthCells) {
    this.createHeader();
    this.createLogoBlock();
    this.createDifficultyPanel(widthCells);
    this.createDifficultySelect();
    this.createIconsWrapper();
    this.addListeners();
  }

  createHeader() {
    this.header = new Element({
      tag: "header",
      className: "header",
      parentNode: this.parentNode,
    });

    this.container = new Element({
      className: "container",
      parentNode: this.header.node,
    });

    this.headerWrapper = new Element({
      className: "header-wrapper",
      parentNode: this.container.node,
    });
  }

  createLogoBlock() {
    this.logoWrapper = new Element({
      className: "logo-wrapper",
      parentNode: this.headerWrapper.node,
    });

    this.logoImgWrapper = new Element({
      className: "logo-img-wrapper",
      parentNode: this.logoWrapper.node,
    });

    this.logoImg = new Element({
      tag: "img",
      className: "logo-img",
      attributes: { src: logo, alt: "Minesweeper Logo" },
      parentNode: this.logoImgWrapper.node,
    });

    this.logoText = new Element({
      tag: "h1",
      className: "logo-text",
      parentNode: this.logoWrapper.node,
    });

    this.logoText.node.innerText = "Minesweeper";
  }

  createDifficultyPanel(widthCells) {
    this.difficultyPanelWrapper = new Element({
      className: "difficulty-panel-wrapper",
      parentNode: this.headerWrapper.node,
    });

    this.easyDifficultyButton = new Element({
      tag: "button",
      className: "button",
      parentNode: this.difficultyPanelWrapper.node,
    });
    this.easyDifficultyButton.node.classList.add("button_easy");
    this.easyDifficultyButton.node.innerText = "Easy 10*10";

    this.mediumDifficultyButton = new Element({
      tag: "button",
      className: "button",
      parentNode: this.difficultyPanelWrapper.node,
    });
    this.mediumDifficultyButton.node.classList.add("button_medium");
    this.mediumDifficultyButton.node.innerText = "Medium 15*15";

    this.hardDifficultyButton = new Element({
      tag: "button",
      className: "button",
      parentNode: this.difficultyPanelWrapper.node,
    });
    this.hardDifficultyButton.node.classList.add("button_hard");
    this.hardDifficultyButton.node.innerText = "Hard 25*25";

    this.switchActiveButton(widthCells);
  }

  createDifficultySelect() {
    this.selectWrapper = new Element({
      className: "select-wrapper",
      parentNode: this.headerWrapper.node,
    });

    const diffOptions = [
      { name: "10", value: "Easy 10*10" },
      { name: "15", value: "Medium 15*15" },
      { name: "25", value: "Hard 25*25" },
    ];

    this.select = new Element({
      tag: "select",
      className: "select",
      parentNode: this.selectWrapper.node,
    });

    this.select.node.insertAdjacentHTML(
      "afterbegin",
      `
    ${diffOptions
      .map(
        (option) =>
          `<option class="option" value='${option.name}'>${option.value}</option>`
      )
      .join("")}
`
    );
    this.select.node.addEventListener("change", () => this.handleSelect());
  }

  handleSelect() {
    board.switchDifficulty({
      width: Number(this.select.node.value),
      height: Number(this.select.node.value),
    });
  }

  addListeners() {
    this.hardDifficultyButton.node.addEventListener("click", () => {
      board.switchDifficulty({ width: 25, height: 25 });
      this.switchActiveButton(25);
    });
    this.mediumDifficultyButton.node.addEventListener("click", () => {
      board.switchDifficulty({ width: 15, height: 15 });
      this.switchActiveButton(15);
    });
    this.easyDifficultyButton.node.addEventListener("click", () => {
      board.switchDifficulty({ width: 10, height: 10 });
      this.switchActiveButton(10);
    });
  }

  createIconsWrapper() {
    this.iconsWrapper = new Element({
      className: "icons-wrapper",
      parentNode: this.headerWrapper.node,
    });
    this.createTropheyImage();
    this.createSoundSwitcher();
    this.createThemeSwitcher();
  }

  createTropheyImage() {
    this.tropheyWrapper = new Element({
      className: "trophey-img-wrapper",
      parentNode: this.iconsWrapper.node,
    });

    this.tropheyImg = new Element({
      tag: "img",
      className: "trophey-img",
      attributes: {
        src: tropheyImg,
        alt: "Scores",
      },
      parentNode: this.tropheyWrapper.node,
    });

    this.tropheyWrapper.node.addEventListener("click", () => {
      const scores = getLocalStorage("lastResults");
      modal.renderScoresModal(scores);
    });
  }

  createSoundSwitcher() {
    this.soundSwitcherWrapper = new Element({
      className: "sound-switcher-wrapper",
      parentNode: this.iconsWrapper.node,
    });

    this.soundSwitcher = new Element({
      tag: "input",
      className: "sound-switch",
      attributes: {
        type: "checkbox",
        id: "sound-switch",
        name: "sound-switch",
      },
      parentNode: this.soundSwitcherWrapper.node,
    });

    this.label = new Element({
      tag: "label",
      className: "sound-switch-label",
      attributes: {
        for: "sound-switch",
      },
      parentNode: this.soundSwitcherWrapper.node,
    });

    this.soundSwitcher.node.addEventListener("change", (e) => {
      const isSoundOn = !document.body.classList.contains("sound-off");
      if (isSoundOn) {
        document.body.classList.add("sound-off");
        sounds.changeIsSoundOn(false);
      } else {
        document.body.classList.remove("sound-off");
        sounds.changeIsSoundOn(true);
      }
    });
  }

  createThemeSwitcher() {
    this.themeSwitcherWrapper = new Element({
      className: "theme-switcher-wrapper",
      parentNode: this.iconsWrapper.node,
    });

    this.switcher = new Element({
      tag: "input",
      className: "theme-switch",
      attributes: {
        type: "checkbox",
        id: "theme-switch",
        name: "theme-switch",
      },
      parentNode: this.themeSwitcherWrapper.node,
    });

    this.label = new Element({
      tag: "label",
      className: "switch-label",
      attributes: {
        for: "theme-switch",
      },
      parentNode: this.themeSwitcherWrapper.node,
    });

    this.switcher.node.addEventListener("change", (e) =>
      document.body.classList.toggle("theme-dark")
    );
  }

  switchActiveButton(widthCells) {
    this.easyDifficultyButton.node.classList.remove("active");
    this.mediumDifficultyButton.node.classList.remove("active");
    this.hardDifficultyButton.node.classList.remove("active");

    switch (widthCells) {
      case 10:
        this.easyDifficultyButton.node.classList.add("active");
        break;
      case 15:
        this.mediumDifficultyButton.node.classList.add("active");
        break;
      case 25:
        this.hardDifficultyButton.node.classList.add("active");
        break;
      default:
        break;
    }
  }
}

const header = new Header();

export { header };
