const inputBox = document.querySelector(".display-box");
const copyBtn = document.querySelector(".copy-btn");
const generatePassBtn = document.querySelector(".generate-pass-btn");
const passConditions = document.querySelectorAll(".list-parent li");
const allCheckBoxes = document.querySelectorAll(".input-parent input");
const passLength = document.querySelector("#lengthValue");
const passStrength = document.querySelector("#passStrength");
const slider = document.querySelector("#pass-slider");
const errorStatement = document.querySelector("#error-statement");

const allNumbers = "0123456789";
const allSymbols = "!@#$%^&*()[]}{";
const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";

slider.addEventListener("input", () => {
  passLength.textContent = slider.value;
});

generatePassBtn.addEventListener("click", () => {
  let conditions = [];
  let allowedChars = "";

  allCheckBoxes.forEach((checkBox) => {
    if (checkBox.checked) {
      conditions.push(checkBox.name);
    }
  });

  if (conditions.length === 0) {
    alert("Select atleast one checkbox !!");
    return;
  }

  for (let condition of conditions) {
    if (condition === "uppercase") {
      allowedChars += uppercaseChars;
    } else if (condition === "lowercase") {
      allowedChars += lowercaseChars;
    } else if (condition === "numbers") {
      allowedChars += allNumbers;
    } else if (condition === "symbols") {
      allowedChars += allSymbols;
    }
  }

  let generatedPass = "";

  for (let i = 0; i < slider.value; i++) {
    let index = Math.floor(Math.random() * allowedChars.length);
    generatedPass += allowedChars[index];
  }

  inputBox.value = generatedPass;

  let strength = conditions.length + Number(slider.value);

  if(strength > 0 && strength <= 10) {
    passStrength.textContent = "Weak";
    passStrength.style.color = "#eb5252";
  }else if(strength > 10 && strength <= 15) {
    passStrength.textContent = "Medium";
    passStrength.style.color = "#F59E0B";
  }else {
    passStrength.textContent = "Strong";
    passStrength.style.color = "#22C55E";
  }

});

copyBtn.addEventListener("click",() => {
    if(inputBox.value.length === 0) {
        alert("There's nothing to copy !!");
        return;
    }

    navigator.clipboard.writeText(inputBox.value) 
      .then(() => {
        alert("Text Copied !!");
      })  
      .catch(err => {
        console.error("Failed to Copy text", err);
      });
});

