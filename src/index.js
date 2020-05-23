import $ from 'jquery';
import 'bootstrap-v4-rtl';
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

  if (formValues.rememberMe === 'yes') {
    Storage.save({
      ...formValues,
      signature: signaturePad.toData(),
    });
  } else {
    Storage.clear();
  }

  const statement = new HealthStatement(formValues);
  statement.addSignature(signature, date);

  statement
    .draw()
    .toBlob().then((blob) => {
      Util.downloadBlob(blob, `hatzhara-${date.format('YYYY-MM-DD')}.png`);
    });
}

$(() => {
  const sigField = document.getElementById('signature');
  const form = document.getElementById('declaration-form');
  const signature = new SignaturePad(sigField);

  $('#signature-clear').on('click', () => {
    signature.clear();
  });

  initHealthStatement(form, signature);

  $(form).on('submit', (event) => {
    event.preventDefault();
    if (signature.isEmpty()) {
      window.alert('יש לחתום על ההצהרה');
      return;
    }
    createHealthStatement(event.target, sigField, signature);
  });
});
