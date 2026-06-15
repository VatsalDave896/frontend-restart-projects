const userFirstnameInput = document.querySelector("#firstNameInput");
const userLastnameInput = document.querySelector("#lastNameInput");
const userEmailInput = document.querySelector("#emailIdInput");
const userPhoneInput = document.querySelector("#phoneNumber");
const userLinkedInInput = document.querySelector("#linkedinUrl");
const profilePhotoInput = document.querySelector("#profilePhoto");
const profilePreview = document.querySelector("#profilePreview");

const degreeInput = document.querySelector("#degreeInput");
const collegeInput = document.querySelector("#collegeInput");
const cgpaInput = document.querySelector("#cgpaInput");
const graduationYearInput = document.querySelector("#graduationYearInput");

const companyInput = document.querySelector("#companyInput");
const roleInput = document.querySelector("#roleInput");
const startDateInput = document.querySelector("#startDate");
const endDateInput = document.querySelector("#endDate");
const descriptionInput = document.querySelector("#descriptionInput");
const currentlyWorkingInput = document.querySelector("#currentlyWorking");
const noExperienceInput = document.querySelector("#noExperience");

const certificateNameInput = document.querySelector("#certificateName");
const issuingOrganizationInput = document.querySelector("#issuingOrganization");
const issueDateInput = document.querySelector("#issueDate");
const certificateUrlInput = document.querySelector("#certificateUrl");

const projectNameInput = document.querySelector("#projectName");
const techStackInput = document.querySelector("#techStack");
const projectDescriptionInput = document.querySelector("#projectDescription");
const githubLinkInput = document.querySelector("#githubLink");
const liveLinkInput = document.querySelector("#liveLink");
const summaryInput = document.querySelector("#summaryInput");
const jobTitleInput = document.querySelector("#jobTitle");
const githubUrlInput = document.querySelector("#githubUrl");
const portfolioUrlInput = document.querySelector("#portfolioUrl");
const skillsInput = document.querySelector("#skillsInput");
const languagesInput = document.querySelector("#languagesInput");
const interestsInput = document.querySelector("#interestsInput");

const wholeForm = document.querySelector("#resumeForm");
const typingText = document.querySelector("#typingTxt");
const stepNavigatingBtns = document.querySelectorAll(".progress-labels span");
const allStepsCardsHeadings = document.querySelectorAll(".step-heading");
const allSteps = document.querySelectorAll(".form-step");
const nextBtn = document.querySelector("#nextBtn");
const previousBtn = document.querySelector("#prevBtn");
const generateBtn = document.querySelector("#generateBtn");
const addExperience = document.querySelector(".add-experience-btn");
const addCertificate = document.querySelector(".add-certificate-btn");
const addProject = document.querySelector(".add-project-btn");
const experienceFields = document.querySelector("#experienceFields");

const words = ["Resume", "Career", "Future"];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function toggleHidden(element, shouldHide) {
  if (element) {
    element.classList.toggle("hidden", shouldHide);
  }
}

function getPrimaryExperienceEndDateGroup() {
  return endDateInput?.closest(".input-group");
}

function updatePrimaryExperienceUI() {
  const noExperienceSelected = noExperienceInput.checked;
  const currentlyWorkingSelected = currentlyWorkingInput.checked;

  toggleHidden(experienceFields, noExperienceSelected);
  toggleHidden(addExperience, noExperienceSelected);
  toggleHidden(
    getPrimaryExperienceEndDateGroup(),
    noExperienceSelected || currentlyWorkingSelected,
  );

  document.querySelectorAll(".experience-card").forEach((card) => {
    toggleHidden(card, noExperienceSelected);
    updateExperienceCardUI(card);
  });
}

function updateExperienceCardUI(experienceCard) {
  const currentWorkingCheckbox = experienceCard.querySelector(
    ".experience-currently-working",
  );
  const endDateGroup = experienceCard.querySelector(".experience-end")?.closest(
    ".input-group",
  );

  toggleHidden(endDateGroup, Boolean(currentWorkingCheckbox?.checked));
}

function typeEffect() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    typingText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 70 : 120);
}

typeEffect();

stepNavigatingBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    stepNavigatingBtns.forEach((button) => {
      button.classList.remove("active-btn");
      btn.classList.add("active-btn");
    });
  });
});

let allCardsHeadingsArr = [];

allStepsCardsHeadings.forEach((stepCard) => {
  allCardsHeadingsArr.push(stepCard.textContent.trim());
});

let currentActiveCard;

nextBtn.addEventListener("click", () => {
  const currentStep = document.querySelector(".active-step");
  if (!currentStep) return;

  const stepHeading = currentStep.querySelector(".step-heading");
  const currentCardHeadingIdx = allCardsHeadingsArr.indexOf(
    stepHeading.textContent.trim(),
  );

  const nextCardHeading = allCardsHeadingsArr[currentCardHeadingIdx + 1];

  currentStep.classList.remove("active-step");
  currentStep.classList.add("hidden");

  stepNavigatingBtns.forEach((btn) => {
    btn.classList.remove("active-btn");

    if (btn.textContent.trim() === nextCardHeading.trim()) {
      btn.classList.add("active-btn");
    }
  });

  allStepsCardsHeadings.forEach((heading) => {
    if (heading.textContent.trim() === nextCardHeading.trim()) {
      const nextCard = heading.closest(".form-step");

      nextCard.classList.remove("hidden");
      nextCard.classList.add("active-step");

      localStorage.setItem("currentStep", currentCardHeadingIdx + 1);

      updatePreviousButton();
      updateGenerateButton();
    }
  });
});

previousBtn.addEventListener("click", () => {
  const currentStep = document.querySelector(".active-step");
  if (!currentStep) return;

  const stepHeading = currentStep.querySelector(".step-heading");
  const currentCardHeadingIdx = allCardsHeadingsArr.indexOf(
    stepHeading.textContent.trim(),
  );

  const prevCardHeadingIdx = currentCardHeadingIdx - 1;
  if (prevCardHeadingIdx < 0) {
    return;
  }

  const prevCardHeading = allCardsHeadingsArr[prevCardHeadingIdx];

  currentStep.classList.remove("active-step");
  currentStep.classList.add("hidden");

  stepNavigatingBtns.forEach((btn) => {
    btn.classList.remove("active-btn");

    if (btn.textContent.trim() === prevCardHeading.trim()) {
      btn.classList.add("active-btn");
    }
  });

  allStepsCardsHeadings.forEach((heading) => {
    if (heading.textContent.trim() === prevCardHeading.trim()) {
      const prevCard = heading.closest(".form-step");
      prevCard.classList.remove("hidden");
      prevCard.classList.add("active-step");

      localStorage.setItem("currentStep", prevCardHeadingIdx);

      updatePreviousButton();
      updateGenerateButton();
    }
  });
});

generateBtn.addEventListener("click", () => {
  const savedPhoto = localStorage.getItem("profilePhoto");

  if (!savedPhoto) {
    alert("Profile Photo is required");
    return;
  }
  
  const requiredInputs = document.querySelectorAll(
    "input[required], textarea[required]",
  );

  for (const input of requiredInputs) {
    if (input.value.trim() === "") {
      alert(`${input.name || input.id} is required`);
      input.focus();

      return;
    }
  }

  if (savedPhoto) {
    profilePreview.src = savedPhoto;
  }

  saveFormData();
  window.location.href = "./preview.html";
});

function saveFormData() {
  const certificates = [];

  certificates.push({
    name: certificateNameInput.value,
    organization: issuingOrganizationInput.value,
    issueDate: issueDateInput.value,
    url: certificateUrlInput.value,
  });

  document.querySelectorAll(".certificate-card").forEach((card) => {
    certificates.push({
      name: card.querySelector(".certificate-name").value,
      organization: card.querySelector(".certificate-org").value,
      issueDate: card.querySelector(".certificate-date").value,
      url: card.querySelector(".certificate-url").value,
    });
  });

  const projects = [
    {
      projectName: projectNameInput.value,
      techStack: techStackInput.value,
      description: projectDescriptionInput.value,
      github: githubLinkInput.value,
      live: liveLinkInput.value,
    },
  ];

  const { primaryExperience, experiences } = collectExperiencesFromForm();

  document.querySelectorAll(".project-card").forEach((card) => {
    projects.push({
      projectName: card.querySelector(".projectName").value,
      techStack: card.querySelector(".project-tech").value,
      description: card.querySelector(".project-description").value,
      github: card.querySelector(".project-github").value,
      live: card.querySelector(".project-live").value,
    });
  });

  const resumeData = {
    personalInfo: {
      firstName: userFirstnameInput.value,
      lastName: userLastnameInput.value,
      email: userEmailInput.value,
      phone: userPhoneInput.value,
      linkedin: userLinkedInInput.value,
      jobTitle: jobTitleInput.value,
      github: githubUrlInput.value,
      portfolio: portfolioUrlInput.value,
    },

    profilePhoto: localStorage.getItem("profilePhoto") || "",

    education: {
      degree: degreeInput.value,
      college: collegeInput.value,
      cgpa: cgpaInput.value,
      graduationYear: graduationYearInput.value,
    },

    experience:
      experiences[0] || primaryExperience,

    experiences,

    certificates,
    projects,

    summary: summaryInput.value,
    skills: skillsInput.value,
    languages: languagesInput.value,
    interests: interestsInput.value,
  };

  localStorage.setItem("resumeData", JSON.stringify(resumeData));
}

function updatePreviousButton() {
  const currentStep = document.querySelector(".active-step");
  if (!currentStep) return;

  const stepHeading = currentStep.querySelector(".step-heading");

  const currentCardHeadingIdx = allCardsHeadingsArr.indexOf(
    stepHeading.textContent.trim(),
  );

  previousBtn.disabled = currentCardHeadingIdx === 0;
}

function updateGenerateButton() {
  const currentStep = document.querySelector(".active-step");
  if (!currentStep) return;

  const stepHeading = currentStep.querySelector(".step-heading");
  const currentCardHeadingIdx = allCardsHeadingsArr.indexOf(
    stepHeading.textContent.trim(),
  );

  if (currentCardHeadingIdx === allCardsHeadingsArr.length - 1) {
    nextBtn.classList.add("hidden");
    generateBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    generateBtn.classList.add("hidden");
  }
}

function normalizeExperienceEntry(experience = {}) {
  return {
    company: experience.company || "",
    role: experience.role || "",
    startDate: experience.startDate || "",
    endDate: experience.endDate || "",
    description: experience.description || "",
    currentlyWorking: Boolean(experience.currentlyWorking),
    noExperience: Boolean(experience.noExperience),
  };
}

function hasExperienceContent(experience = {}) {
  return Boolean(
    experience.company ||
      experience.role ||
      experience.startDate ||
      experience.endDate ||
      experience.description ||
      experience.currentlyWorking,
  );
}

function createExperienceCard(experience = {}) {
  const exp = normalizeExperienceEntry(experience);
  const experienceCard = document.createElement("div");
  experienceCard.className = "experience-card";
  experienceCard.innerHTML = `
    <div class="input-group">
      <label>Company Name</label>
      <input
        type="text"
        class="experience-company"
        placeholder="Google"
        value="${exp.company}"
      />
    </div>
    <div class="input-group">
      <label>Role</label>
      <input
        type="text"
        class="experience-role"
        placeholder="Frontend Developer Intern"
        value="${exp.role}"
      />
    </div>
    <div class="input-group">
      <div class="duration-container">
        <div class="input-group">
          <label>Start Date</label>
          <input type="date" class="experience-start" value="${exp.startDate}" />
        </div>
        <div class="input-group">
          <label>End Date</label>
          <input type="date" class="experience-end" value="${exp.endDate}" />
        </div>
      </div>
    </div>
    <div class="input-group">
      <label>Description</label>
      <textarea
        class="experience-description"
        rows="5"
        placeholder="Describe your responsibilities and achievements..."
      >${exp.description}</textarea>
      <div class="checkbox-group">
        <input type="checkbox" class="experience-currently-working" ${
          exp.currentlyWorking ? "checked" : ""
        } />
        <label>I currently work here</label>
      </div>
      <button type="button" class="remove-experience-btn">
        Remove Experience
      </button>
    </div>
  `;

  updateExperienceCardUI(experienceCard);

  experienceCard.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", saveFormData);
    input.addEventListener("change", saveFormData);
  });

  const currentWorkingCheckbox = experienceCard.querySelector(
    ".experience-currently-working",
  );

  currentWorkingCheckbox.addEventListener("change", () => {
    updateExperienceCardUI(experienceCard);
  });

  const removeExperienceBtn = experienceCard.querySelector(
    ".remove-experience-btn",
  );

  removeExperienceBtn.addEventListener("click", () => {
    experienceCard.remove();
    saveFormData();
  });

  return experienceCard;
}

function collectExperiencesFromForm() {
  const experiences = [];

  const primaryExperience = normalizeExperienceEntry({
    company: companyInput.value,
    role: roleInput.value,
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    description: descriptionInput.value,
    currentlyWorking: currentlyWorkingInput.checked,
    noExperience: noExperienceInput.checked,
  });

  if (hasExperienceContent(primaryExperience)) {
    experiences.push(primaryExperience);
  }

  document.querySelectorAll(".experience-card").forEach((card) => {
    const experience = normalizeExperienceEntry({
      company: card.querySelector(".experience-company")?.value,
      role: card.querySelector(".experience-role")?.value,
      startDate: card.querySelector(".experience-start")?.value,
      endDate: card.querySelector(".experience-end")?.value,
      description: card.querySelector(".experience-description")?.value,
      currentlyWorking: card.querySelector(".experience-currently-working")?.checked,
    });

    if (hasExperienceContent(experience)) {
      experiences.push(experience);
    }
  });

  return {
    primaryExperience,
    experiences,
  };
}

stepNavigatingBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    stepNavigatingBtns.forEach((button) => {
      button.classList.remove("active-btn");
    });

    allSteps.forEach((step) => {
      step.classList.remove("active-step");
      step.classList.add("hidden");
    });

    btn.classList.add("active-btn");

    allSteps[index].classList.remove("hidden");
    allSteps[index].classList.add("active-step");

    localStorage.setItem("currentStep", index);

    updatePreviousButton();
    updateGenerateButton();
  });
});

addCertificate.addEventListener("click", () => {
  const anotherCertificate = document.createElement("div");
  anotherCertificate.className = "certificate-card";
  anotherCertificate.innerHTML = `
    <div class="input-group">
      <label>Certificate Name</label>
      <input
        type="text"
        class="certificate-name"
        placeholder="Meta Front-End Developer"
        required
      />
    </div>
    <div class="input-group">
      <label>Issuing Organization</label>
      <input
        type="text"
        class="certificate-org"
        placeholder="Coursera"
        required
      />
    </div>
    <div class="input-group">
      <label>Issue Date</label>
      <input type="date" class="certificate-date" required />
    </div>
    <div class="input-group">
      <label>Certificate URL (Optional)</label>
      <input type="url" placeholder="https://..."  class="certificate-url"/>
    </div>
    <button type="button" class="remove-certificate-btn">
      Remove Certificate
    </button>
  `;

  anotherCertificate.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", saveFormData);
  });

  const removeCertiBtn = anotherCertificate.querySelector(
    ".remove-certificate-btn",
  );

  removeCertiBtn.addEventListener("click", () => {
    anotherCertificate.remove();
    saveFormData();
  });

  addCertificate.before(anotherCertificate);
  saveFormData();
});

addExperience.addEventListener("click", () => {
  const anotherExperience = createExperienceCard();
  addExperience.before(anotherExperience);
  saveFormData();
});

addProject.addEventListener("click", () => {
  const anotherProject = document.createElement("div");

  anotherProject.className = "project-card";
  anotherProject.innerHTML = `
    <div class="input-group">
      <label for="projectName"> Project Name </label>
      <input type="text" class="projectName" placeholder="ResumePilot" />
    </div>
    <div class="input-group">
      <label for="techStack"> Tech Stack </label>
      <input
        type="text"
        class="project-tech"
        placeholder="HTML, CSS, JavaScript"
      />
    </div>
    <div class="input-group">
      <label for="projectDescription"> Description </label>
      <textarea
        class="project-description"
        rows="5"
        placeholder="Describe what your project does..."
        required
      ></textarea>
    </div>
    <div class="input-group">
      <label for="githubLink"> GitHub Repository </label>
      <input
        type="url"
        class="project-github"
        placeholder="https://github.com/..."
        required
      />
    </div>
    <div class="input-group">
      <label for="liveLink"> Live Demo (Optional) </label>
      <input type="url" class="project-live" placeholder="https://..." />
    </div>
    <button type="button" class="remove-project-btn">
      Remove Project
    </button>
  `;

  const removeProjectBtn = anotherProject.querySelector(".remove-project-btn");

  anotherProject.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", saveFormData);
  });

  removeProjectBtn.addEventListener("click", () => {
    anotherProject.remove();
    saveFormData();
  });

  addProject.before(anotherProject);
  saveFormData();
});

const savedData = JSON.parse(localStorage.getItem("resumeData"));
const savedPhoto = localStorage.getItem("profilePhoto");

if (savedPhoto) {
  profilePreview.src = savedPhoto;
}

if (savedData) {
  const savedExperiences =
    Array.isArray(savedData.experiences) && savedData.experiences.length > 0
      ? savedData.experiences
      : savedData.experience
        ? [savedData.experience]
        : [];

  if (savedData.certificates?.length > 0) {
    certificateNameInput.value = savedData.certificates[0].name || "";
    issuingOrganizationInput.value =
      savedData.certificates[0].organization || "";
    issueDateInput.value = savedData.certificates[0].issueDate || "";
    certificateUrlInput.value = savedData.certificates[0].url || "";
  }

  if (savedData.projects?.length > 0) {
    projectNameInput.value = savedData.projects[0].projectName || "";
    techStackInput.value = savedData.projects[0].techStack || "";
    projectDescriptionInput.value = savedData.projects[0].description || "";
    githubLinkInput.value = savedData.projects[0].github || "";
    liveLinkInput.value = savedData.projects[0].live || "";
  }

  userFirstnameInput.value = savedData.personalInfo?.firstName || "";
  userLastnameInput.value = savedData.personalInfo?.lastName || "";
  userEmailInput.value = savedData.personalInfo?.email || "";
  userPhoneInput.value = savedData.personalInfo?.phone || "";
  userLinkedInInput.value = savedData.personalInfo?.linkedin || "";
  jobTitleInput.value = savedData.personalInfo?.jobTitle || "";
  githubUrlInput.value = savedData.personalInfo?.github || "";
  portfolioUrlInput.value = savedData.personalInfo?.portfolio || "";

  degreeInput.value = savedData.education?.degree || "";
  collegeInput.value = savedData.education?.college || "";
  cgpaInput.value = savedData.education?.cgpa || "";
  graduationYearInput.value = savedData.education?.graduationYear || "";

  const primaryExperience = savedExperiences[0] || savedData.experience || {};
  companyInput.value = primaryExperience.company || "";
  roleInput.value = primaryExperience.role || "";
  startDateInput.value = primaryExperience.startDate || "";
  endDateInput.value = primaryExperience.endDate || "";
  descriptionInput.value = primaryExperience.description || "";

  currentlyWorkingInput.checked = primaryExperience.currentlyWorking || false;
  noExperienceInput.checked =
    primaryExperience.noExperience || savedData.experience?.noExperience || false;

  savedExperiences.slice(1).forEach((experience) => {
    const anotherExperience = createExperienceCard(experience);
    addExperience.before(anotherExperience);
  });

  updatePrimaryExperienceUI();

  summaryInput.value = savedData.summary || "";
  skillsInput.value = savedData.skills || "";
  languagesInput.value = savedData.languages || "";
  interestsInput.value = savedData.interests || "";
}

if (savedData?.certificates) {
  savedData.certificates.slice(1).forEach((cert) => {
    const anotherCertificate = document.createElement("div");
    anotherCertificate.className = "certificate-card";
    anotherCertificate.innerHTML = `
      <div class="input-group">
        <label>Certificate Name</label>
        <input
          type="text"
          class="certificate-name"
          value="${cert.name || ""}"
          required
        />
      </div>
      <div class="input-group">
        <label>Issuing Organization</label>
        <input
          type="text"
          class="certificate-org"
          value="${cert.organization || ""}"
          required
        />
      </div>
      <div class="input-group">
        <label>Issue Date</label>
        <input
          type="date"
          class="certificate-date"
          value="${cert.issueDate || ""}"
          required
        />
      </div>
      <div class="input-group">
        <label>Certificate URL</label>
        <input
          type="url"
          class="certificate-url"
          value="${cert.url || ""}"
        />
      </div>
      <button type="button" class="remove-certificate-btn">
        Remove Certificate
      </button>
    `;

    anotherCertificate
      .querySelector(".remove-certificate-btn")
      .addEventListener("click", () => {
        anotherCertificate.remove();
        saveFormData();
      });

    addCertificate.before(anotherCertificate);
  });
}

if (savedData?.projects) {
  savedData.projects.slice(1).forEach((project) => {
    const anotherProject = document.createElement("div");
    anotherProject.className = "project-card";
    anotherProject.innerHTML = `
      <div class="input-group">
        <label>Project Name</label>
        <input
          type="text"
          class="projectName"
          value="${project.projectName || ""}"
        />
      </div>
      <div class="input-group">
        <label>Tech Stack</label>
        <input
          type="text"
          class="project-tech"
          value="${project.techStack || ""}"
        />
      </div>
      <div class="input-group">
        <label>Description</label>
        <textarea
          class="project-description"
          rows="5"
        >${project.description || ""}</textarea>
      </div>
      <div class="input-group">
        <label>GitHub Repository</label>
        <input
          type="url"
          class="project-github"
          value="${project.github || ""}"
        />
      </div>
      <div class="input-group">
        <label>Live Demo</label>
        <input
          type="url"
          class="project-live"
          value="${project.live || ""}"
        />
      </div>
      <button type="button" class="remove-project-btn">
        Remove Project
      </button>
    `;

    anotherProject
      .querySelector(".remove-project-btn")
      .addEventListener("click", () => {
        anotherProject.remove();
        saveFormData();
      });

    addProject.before(anotherProject);
  });
}

if (savedData?.currentStep) {
  const stepIndex = allCardsHeadingsArr.indexOf(savedData.currentStep);

  if (stepIndex !== -1) {
    allSteps.forEach((step) => {
      step.classList.remove("active-step");
      step.classList.add("hidden");
    });

    stepNavigatingBtns.forEach((btn) => {
      btn.classList.remove("active-btn");
    });

    allSteps[stepIndex].classList.remove("hidden");
    allSteps[stepIndex].classList.add("active-step");

    stepNavigatingBtns[stepIndex].classList.add("active-btn");

    updatePreviousButton();
    updateGenerateButton();
  }
}

const savedStep = Number(localStorage.getItem("currentStep"));

if (!isNaN(savedStep)) {
  allSteps.forEach((step) => {
    step.classList.remove("active-step");
    step.classList.add("hidden");
  });

  stepNavigatingBtns.forEach((btn) => {
    btn.classList.remove("active-btn");
  });

  allSteps[savedStep].classList.remove("hidden");
  allSteps[savedStep].classList.add("active-step");

  stepNavigatingBtns[savedStep].classList.add("active-btn");
}

profilePhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function () {
      localStorage.setItem("profilePhoto", reader.result);
      profilePreview.src = reader.result;
    };

    reader.readAsDataURL(file);
  }
});

currentlyWorkingInput.addEventListener("change", () => {
  updatePrimaryExperienceUI();
});

noExperienceInput.addEventListener("change", () => {
  updatePrimaryExperienceUI();
});

wholeForm.addEventListener("input", saveFormData);
wholeForm.addEventListener("change", saveFormData);

updatePreviousButton();
updateGenerateButton();
