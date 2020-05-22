import $ from 'jquery';

function serializeForm(form) {
  const formData = $(form).serializeArray();

  /* eslint-disable no-param-reassign */
  return formData.reduce((fields, field) => {
    fields[field.name] = field.value;
    return fields;
  }, {});
}

function loadFormValues(form, data) {
  let field;

  Object.keys(data).forEach((key) => {
    field = form[key];
    if (field) {
      if (field.type === 'checkbox' && field.value === data[key]) {
        field.checked = 'checked';
      } else {
        field.value = data[key];
      }
    }
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename || 'download';

  const clickHandler = (event) => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      event.target.removeEventListener('click', clickHandler);
    }, 150);
  };

  a.addEventListener('click', clickHandler, false);
  a.click();

  return a;
}

export default {
  serializeForm,
  loadFormValues,
  downloadBlob,
};
