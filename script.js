const students = [
  {
    id: 1,
    fullName: "Айдана Сәрсен",
    group: "Мех-101",
    completedWeeks: 15,
    totalWeeks: 15,
    score: 82,
    feedback: "Есептерді жақсы шығарады, бірақ теорияны толықтыру керек.",
    statusLabel: "Жақсы",
    statusKey: "good"
  },
  {
    id: 2,
    fullName: "Нұрбек Төлеу",
    group: "Мех-101",
    completedWeeks: 10,
    totalWeeks: 15,
    score: 61,
    feedback: "Тапсырмаларды уақытында тапсыруы керек.",
    statusLabel: "Орташа",
    statusKey: "average"
  },
  {
    id: 3,
    fullName: "Диана Дәулет",
    group: "Мех-102",
    completedWeeks: 7,
    totalWeeks: 15,
    score: 91,
    feedback: "Белсенді, шешу жолдарын дұрыс көрсетеді.",
    statusLabel: "Өте жақсы",
    statusKey: "excellent"
  },
  {
    id: 4,
    fullName: "Аслан Қайрат",
    group: "Мех-102",
    completedWeeks: 4,
    totalWeeks: 15,
    score: 48,
    feedback: "Қосымша жұмыс қажет, прогресс төмен.",
    statusLabel: "Төмен",
    statusKey: "low"
  }
];

const tableBody = document.getElementById("studentTableBody");
const totalStudentsEl = document.getElementById("totalStudents");
const avgScoreEl = document.getElementById("avgScore");
const certificateCountEl = document.getElementById("certificateCount");
const searchInput = document.getElementById("searchInput");
const groupFilter = document.getElementById("groupFilter");
const statusFilter = document.getElementById("statusFilter");

const certificateModal = document.getElementById("certificateModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

const certStudentName = document.getElementById("certStudentName");
const certGroup = document.getElementById("certGroup");
const certScore = document.getElementById("certScore");
const certWeeks = document.getElementById("certWeeks");
const certDate = document.getElementById("certDate");
const certificateText = document.getElementById("certificateText");

/* 15 апта бітпесе де сертификат ашылсын */
function canGetCertificate(student) {
  return true;
}

function fillGroupFilter() {
  const groups = [...new Set(students.map((student) => student.group))];

  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    groupFilter.appendChild(option);
  });
}

function updateStats(data) {
  totalStudentsEl.textContent = data.length;

  const avg =
    data.length > 0
      ? Math.round(
          data.reduce((sum, student) => sum + student.score, 0) / data.length
        )
      : 0;

  avgScoreEl.textContent = avg;

  const certCount = data.filter((student) => canGetCertificate(student)).length;
  certificateCountEl.textContent = certCount;
}

function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="empty">Мәлімет табылмады</td>
      </tr>
    `;
    updateStats(data);
    return;
  }

  data.forEach((student, index) => {
    const progress = Math.round(
      (student.completedWeeks / student.totalWeeks) * 100
    );

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.fullName}</td>
      <td>${student.group}</td>
      <td>${student.completedWeeks} / ${student.totalWeeks}</td>
      <td>
        <div class="progress-wrap">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progress}%"></div>
          </div>
          <span>${progress}%</span>
        </div>
      </td>
      <td>${student.score}</td>
      <td>
        <span class="badge ${student.statusKey}">
          ${student.statusLabel}
        </span>
      </td>
      <td>
        <textarea class="feedback-textarea" data-id="${student.id}">${student.feedback}</textarea>
      </td>
      <td>
        ${
          canGetCertificate(student)
            ? `<button class="btn blue cert-btn" data-id="${student.id}">Сертификатты алу</button>`
            : `<button class="btn gray" disabled>Дайын емес</button>`
        }
      </td>
    `;

    tableBody.appendChild(row);
  });

  attachFeedbackEvents();
  attachCertificateEvents();
  updateStats(data);
}

function attachFeedbackEvents() {
  const textareas = document.querySelectorAll(".feedback-textarea");

  textareas.forEach((textarea) => {
    textarea.addEventListener("input", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      const student = students.find((item) => item.id === id);

      if (student) {
        student.feedback = e.target.value;
      }
    });
  });
}

function openCertificate(student) {
  certStudentName.textContent = student.fullName;
  certGroup.textContent = student.group;
  certScore.textContent = `${student.score} балл`;
  certWeeks.textContent = `${student.completedWeeks}/${student.totalWeeks}`;
  certDate.textContent = new Date().toLocaleDateString("kk-KZ");

  certificateText.textContent =
    `«Механика» пәні бойынша онлайн курсқа қатысқаны үшін беріледі. Аяқталған апта саны: ${student.completedWeeks}/${student.totalWeeks}.`;

  certificateModal.classList.remove("hidden");
}

function closeCertificate() {
  certificateModal.classList.add("hidden");
}

function attachCertificateEvents() {
  const certButtons = document.querySelectorAll(".cert-btn");

  certButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.getAttribute("data-id"));
      const student = students.find((item) => item.id === id);

      if (student) {
        openCertificate(student);
      }
    });
  });
}

function getFilteredStudents() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const groupValue = groupFilter.value;
  const statusValue = statusFilter.value;

  return students.filter((student) => {
    const matchesSearch = student.fullName
      .toLowerCase()
      .includes(searchValue);

    const matchesGroup =
      groupValue === "Барлығы" || student.group === groupValue;

    const matchesStatus =
      statusValue === "Барлығы" || student.statusLabel === statusValue;

    return matchesSearch && matchesGroup && matchesStatus;
  });
}

function refresh() {
  const filtered = getFilteredStudents();
  renderTable(filtered);
}

searchInput.addEventListener("input", refresh);
groupFilter.addEventListener("change", refresh);
statusFilter.addEventListener("change", refresh);

closeModalBtn.addEventListener("click", closeCertificate);

downloadPdfBtn.addEventListener("click", () => {
  window.print();
});

certificateModal.addEventListener("click", (e) => {
  if (e.target === certificateModal) {
    closeCertificate();
  }
});

fillGroupFilter();
renderTable(students);
