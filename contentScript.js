const FORM_SAVE_KEY = "form_saver_" + location.pathname;

window.addEventListener("load", () => {
  if (shouldShowRestoreButton()) {
    createRestoreButton();
  }

  document.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('input', () => {
      saveFormData();
    });
    if (field.type === 'checkbox' || field.type === 'radio') {
      field.addEventListener('change', () => {
        saveFormData();
      });
    }
  });

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', () => {
      clearFormData();
    });
  });
});

function shouldShowRestoreButton() {
  const savedData = localStorage.getItem(FORM_SAVE_KEY);
  if (!savedData) return false;

  const data = JSON.parse(savedData);
  if (Object.keys(data).length === 0) return false;

  const hasInputs = document.querySelector('input, textarea, select');
  return !!hasInputs;
}

function saveFormData() {
  const data = {};

  document.querySelectorAll('input, textarea, select').forEach((field) => {
    if (field.name || field.id) {
      const key = field.name || field.id;
      
      if (field.type === 'checkbox' || field.type === 'radio') {
        data[key] = field.checked;
      } else {
        data[key] = field.value;
      }
    }
  });

  localStorage.setItem(FORM_SAVE_KEY, JSON.stringify(data));
  console.log("✅ Form data saved.");
}

function restoreFormData() {
  const savedData = localStorage.getItem(FORM_SAVE_KEY);
  if (!savedData) return;

  const data = JSON.parse(savedData);

  document.querySelectorAll('input, textarea, select').forEach((field) => {
    const key = field.name || field.id;
    if (data[key] !== undefined) {
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.checked = data[key];
      } else {
        field.value = data[key];
      }
    }
  });

  console.log("✅ Form data restored.");
}

function clearFormData() {
  localStorage.removeItem(FORM_SAVE_KEY);
  console.log("🧹 Form data cleared after submission.");

  const btn = document.getElementById('form-saver-restore-btn');
  if (btn) btn.remove();
}

function createRestoreButton() {
  const button = document.createElement('button');
  button.id = 'form-saver-restore-btn';
  button.innerText = '🛟 Restore Form';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.left = '20px';
  button.style.zIndex = '10000';
  button.style.padding = '10px 15px';
  button.style.fontSize = '14px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '6px';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  button.style.opacity = '0.8';
  
  button.addEventListener('click', () => {
    restoreFormData();
    button.remove();
  });

  document.body.appendChild(button);
}
