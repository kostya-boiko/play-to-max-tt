class Field {
  #isInit = false;

  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.field = Array.from({ length: rows }, () => Array.from({ length: cols }, this.getRandomFigure));

    this.fieldElement = document.createElement("div");
    this.fieldElement.classList.add("field");
  }

  getRandomFigure() {
    const num = Math.round(Math.random() * (4 - 1) + 1);

    switch (num) {
      case 1:
        return "♠";
      case 2:
        return "♣";
      case 3:
        return "♢";
      default:
        return "♡";
    }
  }

  initField(node) {
    if (this.#isInit) {
      node.append(this.fieldElement);
      return;
    }
    this.#isInit = true;
    for (let row = 0; row < this.field.length; row++) {
      const rowElem = document.createElement("div");
      rowElem.classList.add("row");
      for (let col = 0; col < this.field[0].length; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.append(this.field[row][col]);
        cell.addEventListener("click", (e) => this._onCellClick(e, row, col));
        rowElem.append(cell);
      }

      this.fieldElement.append(rowElem);
    }
    node.append(this.fieldElement);
  }

  _onCellClick(e, row, col) {
    alert("Base behavior");
    alert(`X:${row} Y:${col} - ${e.target.textContent}`);
  }
}

class ShowSameField extends Field {
  constructor(...args) {
    super(...args);
  }

  #getCellIndex(row, col) {
    return row * this.cols + col;
  }

  #closeFigures(row, col) {
    const aim = this.field[row][col];

    const result = {};
    result[this.#getCellIndex(row, col)] = [row, col];

    function findSame(row, col) {
      for (let x = row ? row - 1 : row; x <= row + 1 && x <= this.rows - 1; x++) {
        for (let y = col ? col - 1 : col; y <= col + 1 && y <= this.cols - 1; y++) {
          const figure = this.field[x][y];
          if (figure === aim && !result[this.#getCellIndex(x, y)]) {
            result[this.#getCellIndex(x, y)] = [x, y];
            findSame.call(this, x, y);
          }
        }
      }
    }

    findSame.call(this, row, col);
    return result;
  }

  async _onCellClick(_, row, col) {
    const sameCells = Object.values(this.#closeFigures(row, col));
    for (let i of sameCells) {
      const cell = this.fieldElement.children[i[0]].children[i[1]];
      await new Promise((resolve) => setTimeout(resolve, 50));
      cell.classList.toggle("cell-active");
    }
  }
}

const TaskField = new ShowSameField(7, 6);
TaskField.initField(document.getElementsByTagName("body")[0]);
