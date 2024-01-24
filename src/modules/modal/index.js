import "./styles.scss";
import Element from "../element";

class Modal {
  constructor() {
    this.parentNode = document.body;
    this.modalWrapper = document.createElement("div");
    this.content = "";
  }

  renderScoresModal(dataObj) {
    this.createModal();
    const length = dataObj ? dataObj.length + 1 : 1;
    let emptyLines = "";
    for (let index = length; index <= 10; index++) {
      emptyLines += `<tr><td>${index}</td></tr>`;
    }
    this.modalTitle.node.textContent = "Last scores";
    this.modalBody.node.insertAdjacentHTML(
      "afterbegin",
      `
    <table class="table">
    <tbody>
    <thead>
    <tr>
        <th>#</th>
        <th>Date and time</th>
        <th>Difficulty</th>
        <th>Mines in game</th>
        <th>Movies</th>
        <th>Time</th>
    </tr>
</thead>
        ${
          dataObj
            ? dataObj
                .map(
                  (el, index) => `
            <tr>
            <td>${index + 1}</td>
        <td>${new Date(el.date).getDate()}-${
                    new Date(el.date).getMonth() + 1
                  }-${new Date(el.date).getFullYear()} ${new Date(
                    el.date
                  ).getHours()}:${new Date(el.date).getMinutes()}</td>
        <td>${el.difficulty}</td>
        <td>${el.mines}</td>
        <td>${el.movies}</td>
        <td>${el.time}</td>
        </tr>
        `
                )
                .join("")
            : ""
        }
        ${emptyLines}
    </tbody>
    </table>
    `
    );
  }

  createModal() {
    this.backgroundLayout = new Element({
      className: "modal-background",
      parentNode: this.parentNode,
    });

    this.modalWrapper = new Element({
      className: "modal-wrapper",
      parentNode: this.parentNode,
    });

    this.modalTitle = new Element({
      tag: "h2",
      className: "title",
      parentNode: this.modalWrapper.node,
    });

    this.modalBody = new Element({
      className: "modal-body",
      parentNode: this.modalWrapper.node,
    });

    this.closeButton = new Element({
      tag: "button",
      className: "button",
      parentNode: this.modalWrapper.node,
    });
    this.closeButton.node.innerText = "Close";
    this.closeButton.node.classList.add("button_close");

    this.closeButton.node.addEventListener("click", () => this.closeModal());
    this.backgroundLayout.node.addEventListener("click", () =>
      this.closeModal()
    );
    document.body.classList.add("body__overflow");
  }

  renderWinModal({ isWin }, modalContent) {
    this.createModal();
    this.modalWrapper.node.classList.add('modal_win_info');
    this.modalBody.node.classList.add(
      isWin ? "modal-body_win" : "modal-body_lose"
    );
    this.modalBody.node.append(modalContent);
  }

  closeModal() {
    this.backgroundLayout.node.remove();
    this.modalWrapper.node.remove();
    document.body.classList.remove("body__overflow");
  }
}

const modal = new Modal();

export { modal };
