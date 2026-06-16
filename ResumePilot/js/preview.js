document.addEventListener("DOMContentLoaded", () => {
  const resumeData = JSON.parse(localStorage.getItem("resumeData"));
  const resumeSheet = document.getElementById("resumeSheet");
  const resumeSheetInner = document.getElementById("resumeSheetInner");
  const printBtn = document.getElementById("printBtn");
  const MIN_RESUME_SCALE = 0.72;
  const RESUME_SCALE_STEP = 0.02;
  const MAX_PDF_HEIGHT_MM = 297;
  let fitRafId = null;

  if (!resumeData) {
    alert("No resume data found. Redirecting to form builder.");
    window.location.href = "form.html";
    return;
  }

  function mmToPx(mm) {
    return (mm * 96) / 25.4;
  }

  function applyResumeScale(scale) {
    if (!resumeSheet || !resumeSheetInner) return 1;

    const safeScale = Math.max(MIN_RESUME_SCALE, Math.min(1, scale));
    resumeSheetInner.style.setProperty("--resume-scale", safeScale.toFixed(3));
    resumeSheet.style.height = "auto";

    const renderedHeight = Math.ceil(
      resumeSheetInner.getBoundingClientRect().height,
    );
    resumeSheet.style.height = `${renderedHeight}px`;

    return safeScale;
  }

  function fitResumeToPage() {
    if (!resumeSheet || !resumeSheetInner) return;

    resumeSheetInner.style.setProperty("--resume-scale", "1");
    resumeSheet.style.height = "auto";

    const maxHeightPx = mmToPx(MAX_PDF_HEIGHT_MM);
    const startingHeight = resumeSheetInner.getBoundingClientRect().height;

    if (startingHeight <= maxHeightPx) {
      applyResumeScale(1);
      return;
    }

    let chosenScale = 1;

    for (
      let candidateScale = 1 - RESUME_SCALE_STEP;
      candidateScale >= MIN_RESUME_SCALE;
      candidateScale -= RESUME_SCALE_STEP
    ) {
      resumeSheetInner.style.setProperty(
        "--resume-scale",
        candidateScale.toFixed(3),
      );
      resumeSheet.style.height = "auto";

      const candidateHeight = resumeSheetInner.getBoundingClientRect().height;
      chosenScale = candidateScale;

      if (candidateHeight <= maxHeightPx) {
        break;
      }
    }

    applyResumeScale(chosenScale);
  }

  function scheduleResumeFit() {
    if (!resumeSheet || !resumeSheetInner) return;

    if (fitRafId) {
      cancelAnimationFrame(fitRafId);
    }

    fitRafId = requestAnimationFrame(() => {
      fitRafId = null;
      fitResumeToPage();
    });
  }

  function setElementText(selector, text, fallback = "", parentSelector = null) {
    const el = document.querySelector(selector);
    if (!el) return;

    const targetVal = text ? text.trim() : "";
    if (targetVal) {
      el.textContent = targetVal;
      if (parentSelector) {
        document.querySelector(parentSelector).classList.remove("hidden");
      }
    } else {
      if (fallback) {
        el.textContent = fallback;
      } else if (parentSelector) {
        document.querySelector(parentSelector).classList.add("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
  }

  const fullName = `${resumeData.personalInfo?.firstName || ""} ${resumeData.personalInfo?.lastName || ""}`.trim();
  setElementText("#resumeFullName", fullName, "Your Name");
  setElementText("#resumeJobTitle", resumeData.personalInfo?.jobTitle, "Professional Title");

  const photoImg = document.getElementById("resumePhoto");
  const avatarPlaceholder = document.getElementById("avatarPlaceholder");
  if (photoImg) {
    photoImg.addEventListener("load", scheduleResumeFit);
  }
  if (resumeData.profilePhoto && resumeData.profilePhoto.startsWith("data:image")) {
    photoImg.src = resumeData.profilePhoto;
    photoImg.classList.remove("hidden");
    avatarPlaceholder.classList.add("hidden");
  } else {
    photoImg.classList.add("hidden");
    avatarPlaceholder.classList.remove("hidden");
  }

  const contact = resumeData.personalInfo || {};

  const emailLi = document.getElementById("infoEmail");
  if (contact.email) {
    const emailLink = emailLi.querySelector("a");
    emailLink.href = `mailto:${contact.email}`;
    emailLink.textContent = contact.email;
    emailLi.classList.remove("hidden");
  } else {
    emailLi.classList.add("hidden");
  }

  const phoneLi = document.getElementById("infoPhone");
  if (contact.phone) {
    phoneLi.querySelector("span").textContent = contact.phone;
    phoneLi.classList.remove("hidden");
  } else {
    phoneLi.classList.add("hidden");
  }

  const linkedinLi = document.getElementById("infoLinkedIn");
  if (contact.linkedin) {
    const lnLink = linkedinLi.querySelector("a");
    lnLink.href = contact.linkedin;
    let username = "LinkedIn";
    try {
      const urlObj = new URL(contact.linkedin);
      const parts = urlObj.pathname.split("/").filter(p => p.length > 0);
      if (parts.length > 1 && parts[0] === "in") {
        username = parts[1];
      } else if (parts.length > 0) {
        username = parts[parts.length - 1];
      }
    } catch (e) {
      if (contact.linkedin.includes("linkedin.com/in/")) {
        username = contact.linkedin.split("linkedin.com/in/")[1].split("/")[0];
      }
    }
    lnLink.textContent = username;
    linkedinLi.classList.remove("hidden");
  } else {
    linkedinLi.classList.add("hidden");
  }

  const githubLi = document.getElementById("infoGitHub");
  if (contact.github) {
    const ghLink = githubLi.querySelector("a");
    ghLink.href = contact.github;
    let username = "GitHub";
    try {
      const urlObj = new URL(contact.github);
      const parts = urlObj.pathname.split("/").filter(p => p.length > 0);
      if (parts.length > 0) {
        username = parts[0];
      }
    } catch (e) {
      if (contact.github.includes("github.com/")) {
        username = contact.github.split("github.com/")[1].split("/")[0];
      }
    }
    ghLink.textContent = username;
    githubLi.classList.remove("hidden");
  } else {
    githubLi.classList.add("hidden");
  }

  const portfolioLi = document.getElementById("infoPortfolio");
  if (contact.portfolio) {
    const pfLink = portfolioLi.querySelector("a");
    pfLink.href = contact.portfolio;
    let cleanUrl = contact.portfolio
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "");
    if (cleanUrl.endsWith("/")) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    pfLink.textContent = cleanUrl.length > 20 ? "Portfolio Website" : cleanUrl;
    portfolioLi.classList.remove("hidden");
  } else {
    portfolioLi.classList.add("hidden");
  }

  const skillsContainer = document.getElementById("skillsContainer");
  skillsContainer.innerHTML = "";
  if (resumeData.skills) {
    const skillsList = resumeData.skills.split(",").map(s => s.trim()).filter(s => s.length > 0);
    skillsList.forEach(skill => {
      const span = document.createElement("span");
      span.className = "skill-badge";
      span.textContent = skill;
      skillsContainer.appendChild(span);
    });
  }

  function populateCommaList(listId, rawString, sectionId = null) {
    const listEl = document.getElementById(listId);
    if (!listEl) return;
    listEl.innerHTML = "";

    const items = rawString ? rawString.split(",").map(i => i.trim()).filter(i => i.length > 0) : [];
    if (items.length > 0) {
      items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        listEl.appendChild(li);
      });
      if (sectionId) {
        document.getElementById(sectionId).classList.remove("hidden");
      }
    } else {
      if (sectionId) {
        document.getElementById(sectionId).classList.add("hidden");
      }
    }
  }

  populateCommaList("languagesList", resumeData.languages);
  populateCommaList("interestsList", resumeData.interests, "interestsSection");

  const certsList = document.getElementById("certificationsList");
  const certsSection = document.getElementById("certificationsSection");
  certsList.innerHTML = "";

  const validCerts = resumeData.certificates?.filter(c => c.name && c.name.trim().length > 0) || [];
  if (validCerts.length > 0) {
    certsSection.classList.remove("hidden");
    validCerts.forEach(cert => {
      const div = document.createElement("div");
      div.className = "cert-item";
      
      let dateStr = "";
      if (cert.issueDate) {
        const dateObj = new Date(cert.issueDate);
        if (!isNaN(dateObj)) {
          dateStr = dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        }
      }

      div.innerHTML = `
        <div class="cert-name">${cert.name}</div>
        <div class="cert-org-date">
          <span>${cert.organization || ""}</span>
          <span>${dateStr}</span>
        </div>
        ${cert.url ? `<a href="${cert.url}" target="_blank" class="cert-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> View Credential</a>` : ""}
      `;
      certsList.appendChild(div);
    });
  } else {
    certsSection.classList.add("hidden");
  }

  setElementText("#resumeSummary", resumeData.summary, "Professional Summary details go here...");

  function getBulletHtml(desc) {
    if (!desc) return "";
    const lines = desc.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return "";
    return `
      <div class="timeline-details">
        ${lines.map(line => `<div class="timeline-detail-line">${line}</div>`).join("")}
      </div>
    `;
  }

  const expContainer = document.getElementById("experienceList");
  const expSection = document.getElementById("experienceSection");
  expContainer.innerHTML = "";

  const exp = resumeData.experience || {};
  const hasExpData = exp.company || exp.role || exp.description;
  if (!exp.noExperience && hasExpData) {
    expSection.classList.remove("hidden");
    
    let startStr = "";
    if (exp.startDate) {
      const d = new Date(exp.startDate);
      if (!isNaN(d)) startStr = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
    let endStr = "Present";
    if (!exp.currentlyWorking && exp.endDate) {
      const d = new Date(exp.endDate);
      if (!isNaN(d)) endStr = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
    
    const dateRange = startStr ? `${startStr} — ${endStr}` : "";

    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `
      <div class="timeline-header">
        <div class="timeline-title">${exp.role || "Job Role"}</div>
        <div class="timeline-date">${dateRange}</div>
      </div>
      <div class="timeline-company">${exp.company || "Company Name"}</div>
      ${getBulletHtml(exp.description)}
    `;
    expContainer.appendChild(div);
  } else {
    expSection.classList.add("hidden");
  }

  const experienceEntries =
    Array.isArray(resumeData.experiences) && resumeData.experiences.length > 0
      ? resumeData.experiences
      : resumeData.experience
        ? [resumeData.experience]
        : [];
  const validExperiences = experienceEntries.filter((exp) =>
    Boolean(
      exp.company ||
        exp.role ||
        exp.description ||
        exp.startDate ||
        exp.endDate ||
        exp.currentlyWorking,
    ),
  );
  expContainer.innerHTML = "";
  if (validExperiences.length > 0) {
    expSection.classList.remove("hidden");

    validExperiences.forEach((exp) => {
      let startStr = "";
      if (exp.startDate) {
        const d = new Date(exp.startDate);
        if (!isNaN(d)) {
          startStr = d.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
        }
      }

      let endStr = "Present";
      if (!exp.currentlyWorking && exp.endDate) {
        const d = new Date(exp.endDate);
        if (!isNaN(d)) {
          endStr = d.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
        }
      }

      const dateRange = startStr ? `${startStr} — ${endStr}` : "";

      const div = document.createElement("div");
      div.className = "timeline-item";
      div.innerHTML = `
        <div class="timeline-header">
          <div class="timeline-title">${exp.role || "Job Role"}</div>
          <div class="timeline-date">${dateRange}</div>
        </div>
        <div class="timeline-company">${exp.company || "Company Name"}</div>
        ${getBulletHtml(exp.description)}
      `;
      expContainer.appendChild(div);
    });
  } else {
    expSection.classList.add("hidden");
  }

  const projectsContainer = document.getElementById("projectsList");
  const projectsSection = document.getElementById("projectsSection");
  projectsContainer.innerHTML = "";

  const validProjects = resumeData.projects?.filter(p => p.projectName && p.projectName.trim().length > 0) || [];
  if (validProjects.length > 0) {
    projectsSection.classList.remove("hidden");
    validProjects.forEach(proj => {
      const div = document.createElement("div");
      div.className = "timeline-item";

      let techHtml = "";
      if (proj.techStack) {
        const techs = proj.techStack.split(",").map(t => t.trim()).filter(t => t.length > 0);
        if (techs.length > 0) {
          techHtml = `
            <div class="timeline-tech-stack">
              ${techs.map(t => `<span class="tech-tag">${t}</span>`).join("")}
            </div>
          `;
        }
      }

      let linksHtml = "";
      if (proj.github || proj.live) {
        linksHtml = `
          <div class="timeline-links">
            ${proj.github ? `<a href="${proj.github}" target="_blank" class="timeline-link"><i class="fa-brands fa-github"></i> GitHub</a>` : ""}
            ${proj.live ? `<a href="${proj.live}" target="_blank" class="timeline-link"><i class="fa-solid fa-link"></i> Live Demo</a>` : ""}
          </div>
        `;
      }

      div.innerHTML = `
        <div class="timeline-header">
          <div class="timeline-title">${proj.projectName}</div>
        </div>
        ${techHtml}
        ${getBulletHtml(proj.description)}
        ${linksHtml}
      `;
      projectsContainer.appendChild(div);
    });
  } else {
    projectsSection.classList.add("hidden");
  }

  const eduContainer = document.getElementById("educationList");
  eduContainer.innerHTML = "";
  const edu = resumeData.education || {};
  if (edu.college || edu.degree) {
    const div = document.createElement("div");
    div.className = "timeline-item";
    
    let gpaText = "";
    if (edu.cgpa) {
      const numericGpa = parseFloat(edu.cgpa);
      if (!isNaN(numericGpa)) {
        if (numericGpa <= 10.0 && numericGpa > 4.0) {
          gpaText = `CGPA: ${numericGpa.toFixed(2)} / 10.0`;
        } else {
          gpaText = `GPA: ${numericGpa.toFixed(2)} / 4.0`;
        }
      } else {
        gpaText = `CGPA: ${edu.cgpa}`;
      }
    }

    div.innerHTML = `
      <div class="timeline-header">
        <div class="timeline-title">${edu.degree || "Degree Name"}</div>
        <div class="timeline-date">${edu.graduationYear || ""}</div>
      </div>
      <div class="timeline-college">${edu.college || "College / University Name"}</div>
      ${gpaText ? `<div class="timeline-gpa">${gpaText}</div>` : ""}
    `;
    eduContainer.appendChild(div);
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      scheduleResumeFit();
    });
  }

  window.addEventListener("resize", scheduleResumeFit);
  window.addEventListener("load", scheduleResumeFit);
  scheduleResumeFit();

  async function downloadResumePdf() {
    fitResumeToPage();

    if (!window.html2pdf || !resumeSheet) {
      window.print();
      return;
    }

    const exportName =
      `${(resumeData.personalInfo?.firstName || fullName || "resume")}`
        .trim()
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_+|_+$/g, "")
        .toLowerCase() || "resume";

    const options = {
      margin: 0,
      filename: `${exportName}_resume.pdf`,
      image: {
        type: "jpeg",
        quality: 1,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          clonedDoc.documentElement.classList.add("pdf-export");

          const clonedSheet = clonedDoc.getElementById("resumeSheet");
          const clonedInner = clonedDoc.getElementById("resumeSheetInner");

          if (clonedSheet && clonedInner) {
            clonedSheet.style.height = "auto";
            clonedSheet.style.overflow = "visible";
          }

          const clonedBody = clonedDoc.querySelector(".resume-body");
          if (clonedBody) {
            clonedBody.style.flexGrow = "0";
            clonedBody.style.minHeight = "auto";
          }

          clonedDoc
            .querySelectorAll(
              ".sidebar-section, .main-section, .timeline-item, .cert-item",
            )
            .forEach((el) => {
              el.style.breakInside = "auto";
              el.style.pageBreakInside = "auto";
            });
        },
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css", "legacy"],
      },
    };

    await html2pdf().set(options).from(resumeSheet).save();
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      downloadResumePdf();
    });
  }
});
