let element = null;

function initialize () {
  element = document.createElement('INPUT');
  element.style.position = 'absolute';
  element.style.left = '-1000px';
  element.style.top = '-1000px';
  element.setAttribute('readonly', 'true');
  document.body.appendChild(element);
}

export default function copyToClipboard (text) {
  if (element === null) {
    initialize();
  }

  const scrollTop = window.scrollY || window.pageYOffset;
  element.value = text;
  element.focus();
  element.setSelectionRange(0, element.value.length);
  document.execCommand('copy');
  window.scrollTo(0, scrollTop);
}