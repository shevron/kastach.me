import moment from 'moment';
import SignaturePad from 'signature_pad';

import Util from './util';
import HealthStatement from './healthStatement';
import Storage from './storage';

import './index.scss';

function initHealthStatement(form, signaturePad) {
  const savedData = Storage.load();
  Util.loadFormValues(form, savedData);

  if (savedData.signature) {
    signaturePad.fromData(savedData.signature);
  }
}

function createHealthStatement(form, signature, signaturePad, date = moment()) {
  const formValues = Util.serializeForm(form);
  const statement = new HealthStatement(formValues, date);
  statement.addSignature(signature);

  return statement;
}

function downloadHealthStatement(statement) {
  statement
    .draw()
    .toBlob().then((blob) => {
      Util.downloadBlob(blob, `hatzhara-${statement.date.format('YYYY-MM-DD')}.png`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const sigField = document.getElementById('signature');
  const form = document.getElementById('declaration-form');
  const signature = new SignaturePad(sigField);
  const previewBtn = document.getElementById('btn-preview');
  const overlay = document.getElementById('overlay');

  document.getElementById('signature-clear').addEventListener('click', () => {
    signature.clear();
  });

  initHealthStatement(form, signature);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (signature.isEmpty()) {
      window.alert('יש לחתום על ההצהרה');
      return;
    }
    const statement = createHealthStatement(event.target, sigField, signature);
    if (statement.fields.rememberMe === 'yes') {
      Storage.save({
        ...statement.fields,
        signature: signature.toData(),
      });
    } else {
      Storage.clear();
    }
    downloadHealthStatement(statement);
  });

  const preview = () => createHealthStatement(form, sigField, signature).preview(overlay);
  previewBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    preview();
    overlay.classList.add('overlay--visible');
  });

  document.body.addEventListener('click', (event) => {
    if (event.target.id !== 'overlay' && !overlay.contains(event.target) && overlay.classList.contains('overlay--visible')) {
      overlay.classList.remove('overlay--visible');
    }
  });
});
