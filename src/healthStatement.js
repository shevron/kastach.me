/**
 * Health Statement Generator
 */
import trimCanvas from 'trim-canvas';

const fieldLabels = {
  name: 'שם התלמיד',
  idn: 'תעודת זהות',
  age: 'גיל',
  instName: 'שם המוסד',
  teacherName: 'שם הגנן/גננת',
  parentName: 'שם ההורה',
  phone: 'טלפון',
};

const fieldGrid = [
  ['name', 'idn', 'age'],
  ['instName', 'teacherName'],
  ['parentName', 'phone'],
];

/**
 * Copy the contents of a canvas element to a new canvas element
 * and trim whitespace around it
 *
 * @param source
 */
function copyCanvasContents(source) {
  const dest = document.createElement('canvas');
  dest.setAttribute('width', source.width);
  dest.setAttribute('height', source.height);

  const ctx = dest.getContext('2d');
  ctx.drawImage(source, 0, 0);
  trimCanvas(dest);

  return dest;
}

class HealthStatement {
  constructor(fields, date) {
    this.fields = fields;
    this.signature = null;
    this.date = date;
    this.canvas = null;

    this.canvasWidth = 800;
    this.canvasHeight = 400;
    this.lineHeight = 30;
    this.fieldWidth = 240;
    this.signatureMaxHeight = 60;
  }

  addSignature(signature, date) {
    this.signature = copyCanvasContents(signature);
    this.date = date;
  }

  draw() {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);
    this.canvas.setAttribute('dir', 'rtl');

    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this._writeTitle();

    for (let line = 0; line < fieldGrid.length; line += 1) {
      for (let col = 0; col < fieldGrid[line].length; col += 1) {
        this._writeField(line, col);
      }
    }

    this._writeStatement();
    this._drawSignature();

    return this;
  }

  preview(containerNode) {
    this.draw();
    if (containerNode.hasChildNodes()) {
      containerNode.replaceChild(this.canvas, containerNode.firstChild);
    } else {
      containerNode.appendChild(this.canvas);
    }
  }

  async toBlob() {
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => {
        resolve(blob);
      });
    });
  }

  _writeTitle() {
    const ctx = this.canvas.getContext('2d');
    const y = 10;
    const origin = this.canvasWidth - 15;
    const logo = document.getElementById('moe-logo');
    const title = 'הצהרת הורה';
    ctx.drawImage(logo, origin - 55, y);

    ctx.fillStyle = 'black';
    ctx.font = '30px Tahoma';
    ctx.textBaseline = 'bottom';
    ctx.fillText(title, origin - 65 - ctx.measureText(title).width, y + 50);
  }

  _writeField(line, col) {
    const key = fieldGrid[line][col];
    const label = `:${fieldLabels[key]}`;
    const value = this.fields[key];

    const y = (line * this.lineHeight) + this.lineHeight + 70;
    const origin = this.canvasWidth - 20 - (this.fieldWidth * col);

    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px Tahoma';
    const labelWidth = ctx.measureText(label).width;
    ctx.fillText(label, origin - labelWidth, y);

    ctx.font = '16px Tahoma';
    const valueWidth = ctx.measureText(value).width;
    ctx.fillText(value, origin - labelWidth - 10 - valueWidth, y);
  }

  _writeStatement() {
    const bullets = document.querySelectorAll('#statement-bullets li');
    const ctx = this.canvas.getContext('2d');
    const yTop = ((fieldGrid.length + 2) * this.lineHeight) + 50;
    const xRight = this.canvasWidth - 30;
    let text = document.querySelector('#statement-top span').textContent;

    ctx.font = '16px Tahoma';
    ctx.fillText(`:${text}`, xRight - ctx.measureText(text).width, yTop);

    bullets.forEach((bullet, row) => {
      text = `${bullet.textContent} ✓`;
      const y = yTop + this.lineHeight + (row * this.lineHeight);
      ctx.fillText(text, xRight - ctx.measureText(text).width - 15, y);
    });
  }

  _drawSignature() {
    const ctx = this.canvas.getContext('2d');
    const yTop = this.canvasHeight - (2 * this.lineHeight);
    const xRight = this.canvasWidth - 30;

    ctx.font = '16px Tahoma';

    let text = ':באנו על החתום';
    let yPos = yTop;
    let xPos = xRight - ctx.measureText(text).width;
    ctx.fillText(text, xPos, yPos);

    text = ':תאריך';
    yPos += this.lineHeight;
    xPos -= 30;
    ctx.fillText(text, xPos, yPos);

    text = this.date.format('D.M.YYYY');
    xPos -= ctx.measureText(text).width + 15;
    ctx.fillText(text, xPos, yPos);
    ctx.fillRect(xPos - 10, yPos - 2, ctx.measureText(text).width + 20, 1);

    text = ':חתימה';
    xPos -= ctx.measureText(text).width + 30;
    ctx.fillText(text, xPos, yPos);

    const [sigWidth, sigHeight] = this._getScaledSignatureDimensions();
    xPos -= 20 + sigWidth;
    ctx.drawImage(this.signature, xPos, yPos - sigHeight + 10, sigWidth, sigHeight);
    ctx.fillRect(xPos - 10, yPos - 2, sigWidth + 20, 1);
  }

  _getScaledSignatureDimensions() {
    if (this.signature.height <= this.signatureMaxHeight) {
      return [this.signature.width, this.signature.height];
    }

    const ratio = this.signatureMaxHeight / this.signature.height;
    return [this.signature.width * ratio, this.signatureMaxHeight];
  }
}

export default HealthStatement;
