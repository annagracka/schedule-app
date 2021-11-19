const errorName = 'at least 3 characters and  only letters';
const errorPhone = 'use format +12 345 678 910';
const errorEmail = 'use format name@email.com';

function displayError(inputArea, errorText) {
    formData.querySelector(`div[for=${inputArea.name}]`).className = 'errorText';
    formData.querySelector(`div[for=${inputArea.name}]`).innerHTML = `${errorText}`;
  
    formData.querySelector(`input[name=${inputArea.name}]`).style.borderStyle = 'solid';
    formData.querySelector(`input[name=${inputArea.name}]`).style.borderColor = '#D4392F';
  }

  function hideError(inputArea) {
    formData.querySelector(`div[for=${inputArea.name}]`).className = '';
    formData.querySelector(`div[for=${inputArea.name}]`).innerHTML = '';
  
    formData.querySelector(`input[name=${inputArea.name}]`).style.borderStyle = '';
    formData.querySelector(`input[name=${inputArea.name}]`).style.borderColor = '';
  }

  module.exports = {
      displayError,
      hideError
  };
