/* ==================================================
   MIRZA KHAN HR
   APP.JS - VERSION 1.8
   سامانه جامع منابع انسانی و حضور و غیاب
================================================== */


/* ==================================================
   GLOBAL
================================================== */

const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");
const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");
const todayDate = document.getElementById("todayDate");


const pageNames = {
    dashboard: "داشبورد",
    employees: "کارکنان",
    attendance: "حضور و غیاب",
    leave: "مرخصی و مأموریت",
    reports: "گزارش‌ها",
    notifications: "اعلان‌ها",
    settings: "تنظیمات"
};


/* ==================================================
   STORAGE KEYS
================================================== */

const STORAGE = {
    employees: "mirzaKhanEmployees",
    attendance: "mirzaKhanAttendance",
    leave: "mirzaKhanLeaveRequests",
    notifications: "mirzaKhanNotifications"
};


/* ==================================================
   DEFAULT EMPLOYEES
================================================== */

const defaultEmployees = [
    {
        id: 1,
        name: "علی رضایی",
        code: "PR-1024",
        phone: "09121234567",
        department: "تولید",
        position: "کارشناس تولید",
        status: "active",
        address: "اهواز"
    },
    {
        id: 2,
        name: "محمد احمدی",
        code: "PR-1031",
        phone: "09121112233",
        department: "مالی",
        position: "حسابدار",
        status: "active",
        address: "اهواز"
    },
    {
        id: 3,
        name: "سارا کریمی",
        code: "PR-1045",
        phone: "09123334455",
        department: "منابع انسانی",
        position: "کارشناس منابع انسانی",
        status: "active",
        address: "اهواز"
    },
    {
        id: 4,
        name: "حسین مرادی",
        code: "PR-1052",
        phone: "09125556677",
        department: "فنی",
        position: "تکنسین فنی",
        status: "inactive",
        address: "آبادان"
    }
];


let employees = loadJSON(
    STORAGE.employees,
    defaultEmployees
);

let attendanceData = loadJSON(
    STORAGE.attendance,
    {}
);

let leaveRequests = loadJSON(
    STORAGE.leave,
    []
);

let notifications = loadJSON(
    STORAGE.notifications,
    []
);


/* ==================================================
   STORAGE
================================================== */

function loadJSON(key, fallback) {

    try {

        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        const parsed = JSON.parse(data);

        return parsed ?? fallback;

    } catch (error) {

        console.error(
            "Storage error:",
            key,
            error
        );

        return fallback;
    }
}


function saveJSON(key, data) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        return true;

    } catch (error) {

        console.error(
            "Save error:",
            key,
            error
        );

        alert(
            "ذخیره اطلاعات انجام نشد."
        );

        return false;
    }
}


/* ==================================================
   HELPERS
================================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function getTodayISO() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getCurrentTime() {

    const now = new Date();

    return (
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0")
    );
}


function downloadFile(
    content,
    filename,
    type = "text/plain;charset=utf-8"
) {

    const blob =
        new Blob(
            [content],
            { type }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
}


/* ==================================================
   DATE
================================================== */

function setDate() {

    if (!todayDate) {
        return;
    }

    const formatter =
        new Intl.DateTimeFormat(
            "fa-IR",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    todayDate.textContent =
        formatter.format(new Date());
}

setDate();


/* ==================================================
   NAVIGATION
================================================== */

menuItems.forEach(item => {

    item.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            const page =
                this.dataset.page;

            menuItems.forEach(menu =>
                menu.classList.remove("active")
            );

            this.classList.add("active");

            pages.forEach(pageElement =>
                pageElement.classList.remove(
                    "active-page"
                )
            );

            const selectedPage =
                document.getElementById(
                    `${page}Page`
                );

            if (selectedPage) {

                selectedPage.classList.add(
                    "active-page"
                );
            }

            if (pageTitle) {

                pageTitle.textContent =
                    pageNames[page] ||
                    "داشبورد";
            }

            if (sidebar) {
                sidebar.classList.remove("open");
            }

            switch (page) {

                case "dashboard":
                    renderDashboard();
                    break;

                case "employees":
                    renderEmployees();
                    break;

                case "attendance":
                    initAttendance();
                    break;

                case "leave":
                    initLeave();
                    break;

                case "reports":
                    renderReports();
                    break;

                case "notifications":
                    renderNotifications();
                    break;
            }

        }
    );

});


/* ==================================================
   MOBILE MENU
================================================== */

if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        () => {

            if (sidebar) {

                sidebar.classList.toggle(
                    "open"
                );
            }
        }
    );
}


/* ==================================================
   EMPLOYEES
================================================== */

const employeesTableBody =
    document.getElementById(
        "employeesTableBody"
    );

const employeeSearch =
    document.getElementById(
        "employeeSearch"
    );

const departmentFilter =
    document.getElementById(
        "departmentFilter"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const employeeModal =
    document.getElementById(
        "employeeModal"
    );

const employeeForm =
    document.getElementById(
        "employeeForm"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const addEmployeeBtn =
    document.getElementById(
        "addEmployeeBtn"
    );

const dashboardAddEmployee =
    document.getElementById(
        "dashboardAddEmployee"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const cancelModal =
    document.getElementById(
        "cancelModal"
    );

let editingEmployeeId = null;


function saveEmployees() {

    saveJSON(
        STORAGE.employees,
        employees
    );
}


function getFilteredEmployees() {

    const search =
        employeeSearch
            ? employeeSearch.value
                .trim()
                .toLowerCase()
            : "";

    const department =
        departmentFilter
            ? departmentFilter.value
            : "all";

    const status =
        statusFilter
            ? statusFilter.value
            : "all";

    return employees.filter(employee => {

        const name =
            String(
                employee.name || ""
            ).toLowerCase();

        const code =
            String(
                employee.code || ""
            ).toLowerCase();

        const phone =
            String(
                employee.phone || ""
            );

        const matchesSearch =
            !search ||
            name.includes(search) ||
            code.includes(search) ||
            phone.includes(search);

        const matchesDepartment =
            department === "all" ||
            employee.department === department;

        const matchesStatus =
            status === "all" ||
            employee.status === status;

        return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
        );
    });
}


function renderEmployees() {

    if (!employeesTableBody) {
        return;
    }

    const filtered =
        getFilteredEmployees();

    employeesTableBody.innerHTML = "";

    if (!filtered.length) {

        employeesTableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty-employees"
                >
                    کارمندی با این مشخصات پیدا نشد.
                </td>
            </tr>
        `;

        updateSummary();

        return;
    }

    filtered.forEach(employee => {

        const firstLetter =
            employee.name
                ? employee.name.charAt(0)
                : "م";

        const statusText =
            employee.status === "active"
                ? "فعال"
                : "غیرفعال";

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>

                <div class="employee-info">

                    <div class="employee-avatar">
                        ${escapeHTML(firstLetter)}
                    </div>

                    <div>
                        <strong>
                            ${escapeHTML(employee.name)}
                        </strong>

                        <span>
                            ${escapeHTML(employee.code)}
                        </span>
                    </div>

                </div>

            </td>

            <td>
                ${escapeHTML(employee.department || "-")}
            </td>

            <td>
                ${escapeHTML(employee.position || "-")}
            </td>

            <td>
                ${escapeHTML(employee.phone || "-")}
            </td>

            <td>

                <span class="employee-status ${employee.status}">
                    ${statusText}
                </span>

            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn"
                        onclick="viewEmployee(${employee.id})"
                        title="مشاهده"
                    >
                        👁
                    </button>

                    <button
                        class="action-btn"
                        onclick="editEmployee(${employee.id})"
                        title="ویرایش"
                    >
                        ✏️
                    </button>

                    <button
                        class="action-btn delete"
                        onclick="deleteEmployee(${employee.id})"
                        title="حذف"
                    >
                        🗑️
                    </button>

                </div>

            </td>
        `;

        employeesTableBody.appendChild(row);
    });

    updateSummary();
}


function updateSummary() {

    const total =
        employees.length;

    const active =
        employees.filter(
            e => e.status === "active"
        ).length;

    const inactive =
        employees.filter(
            e => e.status === "inactive"
        ).length;

    const departments =
        new Set(
            employees
                .map(e => e.department)
                .filter(Boolean)
        ).size;

    setText("totalEmployees", total);
    setText("activeEmployees", active);
    setText("inactiveEmployees", inactive);

    setText("dashboardTotal", total);
    setText("dashboardActive", active);
    setText("dashboardInactive", inactive);
    setText("dashboardDepartments", departments);
}


/* ==================================================
   EMPLOYEE MODAL
================================================== */

function openEmployeeModal(employee = null) {

    if (!employeeModal) {
        return;
    }

    employeeModal.classList.add("show");

    restoreProfileView();

    if (employee) {

        if (modalTitle) {
            modalTitle.textContent =
                "ویرایش کارمند";
        }

        document.getElementById("fullName").value =
            employee.name || "";

        document.getElementById("personnelCode").value =
            employee.code || "";

        document.getElementById("phone").value =
            employee.phone || "";

        document.getElementById("department").value =
            employee.department || "";

        document.getElementById("position").value =
            employee.position || "";

        document.getElementById("status").value =
            employee.status || "active";

        document.getElementById("address").value =
            employee.address || "";

        editingEmployeeId =
            employee.id;

    } else {

        if (modalTitle) {
            modalTitle.textContent =
                "افزودن کارمند";
        }

        if (employeeForm) {
            employeeForm.reset();
        }

        editingEmployeeId = null;
    }
}


function closeEmployeeModal() {

    if (!employeeModal) {
        return;
    }

    employeeModal.classList.remove("show");

    restoreProfileView();

    if (employeeForm) {
        employeeForm.reset();
    }

    editingEmployeeId = null;
}


function restoreProfileView() {

    if (employeeForm) {
        employeeForm.style.display = "grid";
    }

    const profileView =
        document.getElementById(
            "profileView"
        );

    if (profileView) {
        profileView.classList.remove("show");
    }

    if (modalTitle) {
        modalTitle.textContent =
            "افزودن کارمند";
    }
}


if (addEmployeeBtn) {

    addEmployeeBtn.addEventListener(
        "click",
        () => openEmployeeModal()
    );
}


if (dashboardAddEmployee) {

    dashboardAddEmployee.addEventListener(
        "click",
        () => {

            const menu =
                document.querySelector(
                    '[data-page="employees"]'
                );

            if (menu) {
                menu.click();
            }

            setTimeout(
                () => openEmployeeModal(),
                100
            );
        }
    );
}


if (closeModal) {
    closeModal.addEventListener(
        "click",
        closeEmployeeModal
    );
}


if (cancelModal) {
    cancelModal.addEventListener(
        "click",
        closeEmployeeModal
    );
}


if (employeeModal) {

    employeeModal.addEventListener(
        "click",
        event => {

            if (
                event.target === employeeModal
            ) {
                closeEmployeeModal();
            }
        }
    );
}


/* ==================================================
   SAVE EMPLOYEE
================================================== */

if (employeeForm) {

    employeeForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const name =
                document.getElementById(
                    "fullName"
                ).value.trim();

            const code =
                document.getElementById(
                    "personnelCode"
                ).value.trim();

            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();

            const department =
                document.getElementById(
                    "department"
                ).value;

            const position =
                document.getElementById(
                    "position"
                ).value.trim();

            const status =
                document.getElementById(
                    "status"
                ).value;

            const address =
                document.getElementById(
                    "address"
                ).value.trim();

            if (
                !name ||
                !code ||
                !department
            ) {

                alert(
                    "لطفاً اطلاعات الزامی را وارد کنید."
                );

                return;
            }

            const duplicate =
                employees.find(
                    employee =>
                        employee.code === code &&
                        employee.id !== editingEmployeeId
                );

            if (duplicate) {

                alert(
                    "این کد پرسنلی قبلاً ثبت شده است."
                );

                return;
            }

            const employeeData = {
                name,
                code,
                phone,
                department,
                position,
                status,
                address
            };

            const wasEditing =
                editingEmployeeId !== null;

            if (wasEditing) {

                employees =
                    employees.map(employee =>
                        employee.id === editingEmployeeId
                            ? {
                                ...employee,
                                ...employeeData
                            }
                            : employee
                    );

            } else {

                employees.push({
                    id: Date.now(),
                    ...employeeData
                });
            }

            saveEmployees();

            renderEmployees();
            updateSummary();
            renderDashboard();

            closeEmployeeModal();

            addNotification({
                type: "employee",
                title:
                    wasEditing
                        ? "ویرایش کارمند"
                        : "کارمند جدید",
                message:
                    wasEditing
                        ? `اطلاعات ${name} ویرایش شد.`
                        : `کارمند ${name} ثبت شد.`,
                icon:
                    wasEditing
                        ? "✏️"
                        : "👤"
            });

            alert(
                wasEditing
                    ? "اطلاعات کارمند با موفقیت ویرایش شد."
                    : "کارمند جدید با موفقیت ثبت شد."
            );
        }
    );
}


/* ==================================================
   EDIT / DELETE / VIEW
================================================== */

function editEmployee(id) {

    const employee =
        employees.find(
            e => e.id === id
        );

    if (employee) {
        openEmployeeModal(employee);
    }
}


function deleteEmployee(id) {

    const employee =
        employees.find(
            e => e.id === id
        );

    if (!employee) {
        return;
    }

    if (
        !confirm(
            `آیا از حذف «${employee.name}» مطمئن هستید؟`
        )
    ) {
        return;
    }

    employees =
        employees.filter(
            e => e.id !== id
        );

    saveEmployees();

    renderEmployees();
    updateSummary();
    renderDashboard();

    addNotification({
        type: "employee",
        title: "حذف کارمند",
        message:
            `کارمند ${employee.name} حذف شد.`,
        icon: "🗑️"
    });
}


function viewEmployee(id) {

    const employee =
        employees.find(
            e => e.id === id
        );

    if (
        !employee ||
        !employeeModal
    ) {
        return;
    }

    employeeModal.classList.add("show");

    if (employeeForm) {
        employeeForm.style.display = "none";
    }

    if (modalTitle) {
        modalTitle.textContent =
            "پرونده پرسنلی";
    }

    const profileView =
        document.getElementById(
            "profileView"
        );

    if (profileView) {
        profileView.classList.add("show");
    }

    setText(
        "profileAvatar",
        employee.name?.charAt(0) || "م"
    );

    setText("profileName", employee.name);
    setText(
        "profilePosition",
        employee.position || "-"
    );
    setText("profileCode", employee.code);
    setText(
        "profileDepartment",
        employee.department || "-"
    );
    setText(
        "profilePhone",
        employee.phone || "-"
    );
    setText(
        "profileStatus",
        employee.status === "active"
            ? "فعال"
            : "غیرفعال"
    );
    setText(
        "profileAddress",
        employee.address || "-"
    );
}


if (employeeSearch) {
    employeeSearch.addEventListener(
        "input",
        renderEmployees
    );
}

if (departmentFilter) {
    departmentFilter.addEventListener(
        "change",
        renderEmployees
    );
}

if (statusFilter) {
    statusFilter.addEventListener(
        "change",
        renderEmployees
    );
}


/* ==================================================
   ATTENDANCE
================================================== */

const attendanceDate =
    document.getElementById(
        "attendanceDate"
    );

const attendanceSearch =
    document.getElementById(
        "attendanceSearch"
    );

const attendanceStatusFilter =
    document.getElementById(
        "attendanceStatusFilter"
    );

const attendanceTableBody =
    document.getElementById(
        "attendanceTableBody"
    );

const openAttendanceModal =
    document.getElementById(
        "openAttendanceModal"
    );


function getSelectedAttendanceDate() {

    return (
        attendanceDate?.value ||
        getTodayISO()
    );
}


function initAttendance() {

    if (attendanceDate &&
        !attendanceDate.value) {

        attendanceDate.value =
            getTodayISO();
    }

    renderAttendance();
}


function getAttendanceRecord(
    employeeId,
    date = getSelectedAttendanceDate()
) {

    if (!attendanceData[date]) {
        attendanceData[date] = {};
    }

    if (!attendanceData[date][employeeId]) {

        attendanceData[date][employeeId] = {
            status: "absent",
            entry: "",
            exit: "",
            note: ""
        };
    }

    return attendanceData[date][employeeId];
}


function saveAttendance() {

    saveJSON(
        STORAGE.attendance,
        attendanceData
    );
}


function calculateMinutes(start, end) {

    if (!start || !end) {
        return 0;
    }

    const a =
        start.split(":").map(Number);

    const b =
        end.split(":").map(Number);

    if (
        a.length !== 2 ||
        b.length !== 2
    ) {
        return 0;
    }

    let startMinutes =
        a[0] * 60 + a[1];

    let endMinutes =
        b[0] * 60 + b[1];

    let difference =
        endMinutes - startMinutes;

    if (difference < 0) {
        difference += 1440;
    }

    return difference;
}


function formatMinutes(minutes) {

    if (!minutes) {
        return "-";
    }

    const hours =
        Math.floor(minutes / 60);

    const mins =
        minutes % 60;

    return `${hours} ساعت و ${mins} دقیقه`;
}


function updateAttendanceStats(records) {

    let present = 0;
    let late = 0;
    let absent = 0;
    let leave = 0;

    records.forEach(record => {

        switch (record.status) {

            case "present":
                present++;
                break;

            case "late":
                late++;
                break;

            case "leave":
                leave++;
                break;

            default:
                absent++;
        }
    });

    setText("presentCount", present);
    setText("lateCount", late);
    setText("absentCount", absent);
    setText("leaveCount", leave);
}


function renderAttendance() {

    if (!attendanceTableBody) {
        return;
    }

    const date =
        getSelectedAttendanceDate();

    const search =
        attendanceSearch
            ? attendanceSearch.value
                .trim()
                .toLowerCase()
            : "";

    const filter =
        attendanceStatusFilter
            ? attendanceStatusFilter.value
            : "all";

    const records = [];

    employees
        .filter(e => e.status === "active")
        .forEach(employee => {

            records.push({
                employee,
                record:
                    getAttendanceRecord(
                        employee.id,
                        date
                    )
            });
        });

    updateAttendanceStats(
        records.map(item => item.record)
    );

    const filtered =
        records.filter(item => {

            const employee =
                item.employee;

            const record =
                item.record;

            const matchesSearch =
                !search ||
                employee.name
                    .toLowerCase()
                    .includes(search) ||
                employee.code
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                filter === "all" ||
                record.status === filter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    attendanceTableBody.innerHTML = "";

    filtered.forEach(item => {

        const employee =
            item.employee;

        const record =
            item.record;

        const workMinutes =
            calculateMinutes(
                record.entry,
                record.exit
            );

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>

                <div class="employee-info">

                    <div class="employee-avatar">
                        ${escapeHTML(
                            employee.name.charAt(0)
                        )}
                    </div>

                    <div>
                        <strong>
                            ${escapeHTML(employee.name)}
                        </strong>

                        <span>
                            ${escapeHTML(employee.code)}
                        </span>
                    </div>

                </div>

            </td>

            <td>

                <select
                    class="attendance-status-select"
                    onchange="
                        changeAttendanceStatus(
                            ${employee.id},
                            this.value
                        )
                    "
                >

                    <option value="present"
                        ${record.status === "present"
                            ? "selected" : ""}>
                        حاضر
                    </option>

                    <option value="late"
                        ${record.status === "late"
                            ? "selected" : ""}>
                        تأخیر
                    </option>

                    <option value="absent"
                        ${record.status === "absent"
                            ? "selected" : ""}>
                        غایب
                    </option>

                    <option value="leave"
                        ${record.status === "leave"
                            ? "selected" : ""}>
                        مرخصی
                    </option>

                </select>

            </td>

            <td>

                <input
                    type="time"
                    value="${escapeHTML(record.entry)}"
                    onchange="
                        changeAttendanceTime(
                            ${employee.id},
                            'entry',
                            this.value
                        )
                    "
                >

            </td>

            <td>

                <input
                    type="time"
                    value="${escapeHTML(record.exit)}"
                    onchange="
                        changeAttendanceTime(
                            ${employee.id},
                            'exit',
                            this.value
                        )
                    "
                >

            </td>

            <td>
                ${formatMinutes(workMinutes)}
            </td>

            <td>
                ${
                    record.status === "late"
                        ? "تأخیر"
                        : "-"
                }
            </td>

            <td>
                ${escapeHTML(
                    record.note || "-"
                )}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn"
                        onclick="setCurrentEntry(${employee.id})"
                        title="ثبت ورود"
                    >
                        🟢
                    </button>

                    <button
                        class="action-btn"
                        onclick="setCurrentExit(${employee.id})"
                        title="ثبت خروج"
                    >
                        🔴
                    </button>

                    <button
                        class="action-btn"
                        onclick="addAttendanceNote(${employee.id})"
                        title="یادداشت"
                    >
                        📝
                    </button>

                    <button
                        class="action-btn"
                        onclick="clearAttendance(${employee.id})"
                        title="پاک کردن"
                    >
                        ↺
                    </button>

                </div>

            </td>
        `;

        attendanceTableBody.appendChild(row);
    });
}


function changeAttendanceStatus(
    employeeId,
    status
) {

    const record =
        getAttendanceRecord(employeeId);

    record.status = status;

    saveAttendance();

    renderAttendance();
    renderDashboard();

    addNotification({
        type: "attendance",
        title: "تغییر وضعیت حضور",
        message:
            "وضعیت حضور یک کارمند تغییر کرد.",
        icon:
            status === "present"
                ? "🟢"
                : status === "late"
                    ? "🟠"
                    : status === "leave"
                        ? "🏖️"
                        : "🔴"
    });
}


function changeAttendanceTime(
    employeeId,
    type,
    value
) {

    const record =
        getAttendanceRecord(employeeId);

    record[type] = value;

    if (
        type === "entry" &&
        value &&
        record.status === "absent"
    ) {
        record.status = "present";
    }

    saveAttendance();

    renderAttendance();
    renderDashboard();
}


function setCurrentEntry(employeeId) {

    const record =
        getAttendanceRecord(employeeId);

    record.entry =
        getCurrentTime();

    if (record.status === "absent") {
        record.status = "present";
    }

    saveAttendance();

    renderAttendance();
    renderDashboard();
}


function setCurrentExit(employeeId) {

    const record =
        getAttendanceRecord(employeeId);

    record.exit =
        getCurrentTime();

    if (record.status === "absent") {
        record.status = "present";
    }

    saveAttendance();

    renderAttendance();
    renderDashboard();
}


function addAttendanceNote(employeeId) {

    const record =
        getAttendanceRecord(employeeId);

    const note =
        prompt(
            "یادداشت حضور این کارمند:",
            record.note || ""
        );

    if (note === null) {
        return;
    }

    record.note = note.trim();

    saveAttendance();

    renderAttendance();
}


function clearAttendance(employeeId) {

    if (
        !confirm(
            "اطلاعات حضور این کارمند برای این روز پاک شود؟"
        )
    ) {
        return;
    }

    const date =
        getSelectedAttendanceDate();

    if (
        attendanceData[date] &&
        attendanceData[date][employeeId]
    ) {

        delete attendanceData[date][employeeId];
    }

    saveAttendance();

    renderAttendance();
    renderDashboard();
}


if (attendanceSearch) {
    attendanceSearch.addEventListener(
        "input",
        renderAttendance
    );
}

if (attendanceStatusFilter) {
    attendanceStatusFilter.addEventListener(
        "change",
        renderAttendance
    );
}

if (attendanceDate) {
    attendanceDate.addEventListener(
        "change",
        renderAttendance
    );
}

if (openAttendanceModal) {

    openAttendanceModal.addEventListener(
        "click",
        () => renderAttendance()
    );
}


/* ==================================================
   LEAVE
================================================== */

const addLeaveBtn =
    document.getElementById("addLeaveBtn");

const leaveModal =
    document.getElementById("leaveModal");

const leaveForm =
    document.getElementById("leaveForm");

const closeLeaveModal =
    document.getElementById("closeLeaveModal");

const cancelLeaveModal =
    document.getElementById("cancelLeaveModal");

const leaveEmployee =
    document.getElementById("leaveEmployee");

const leaveType =
    document.getElementById("leaveType");

const leaveStart =
    document.getElementById("leaveStart");

const leaveEnd =
    document.getElementById("leaveEnd");

const leaveDays =
    document.getElementById("leaveDays");

const leaveDescription =
    document.getElementById("leaveDescription");

const leaveTableBody =
    document.getElementById("leaveTableBody");

const leaveSearch =
    document.getElementById("leaveSearch");

const leaveTypeFilter =
    document.getElementById("leaveTypeFilter");

const leaveStatusFilter =
    document.getElementById("leaveStatusFilter");

const leaveDateFilter =
    document.getElementById("leaveDateFilter");


function saveLeaveRequests() {

    saveJSON(
        STORAGE.leave,
        leaveRequests
    );
}


function getLeaveTypeText(type) {

    return {
        annual: "مرخصی استحقاقی",
        sick: "مرخصی استعلاجی",
        unpaid: "مرخصی بدون حقوق",
        mission: "مأموریت"
    }[type] || "-";
}


function getLeaveStatusText(status) {

    return {
        pending: "در انتظار بررسی",
        approved: "تأیید شده",
        rejected: "رد شده"
    }[status] || "-";
}


function calculateLeaveDays(
    start,
    end
) {

    if (!start || !end) {
        return 0;
    }

    const startDate =
        new Date(
            `${start}T00:00:00`
        );

    const endDate =
        new Date(
            `${end}T00:00:00`
        );

    const difference =
        endDate - startDate;

    if (difference < 0) {
        return 0;
    }

    return (
        Math.floor(
            difference /
            86400000
        ) + 1
    );
}


function fillLeaveEmployees() {

    if (!leaveEmployee) {
        return;
    }

    leaveEmployee.innerHTML = `
        <option value="">
            انتخاب کارمند
        </option>
    `;

    employees
        .filter(e => e.status === "active")
        .forEach(employee => {

            const option =
                document.createElement("option");

            option.value =
                employee.id;

            option.textContent =
                `${employee.name} - ${employee.code}`;

            leaveEmployee.appendChild(option);
        });
}


function initLeave() {

    fillLeaveEmployees();
    renderLeave();
}


function openLeaveModal() {

    if (!leaveModal) {
        return;
    }

    fillLeaveEmployees();

    leaveModal.classList.add("show");

    if (leaveForm) {
        leaveForm.reset();
    }

    if (leaveStart) {
        leaveStart.value =
            getTodayISO();
    }

    if (leaveEnd) {
        leaveEnd.value =
            getTodayISO();
    }

    if (leaveDays) {
        leaveDays.value = "1";
    }
}


function closeLeaveRequestModal() {

    if (!leaveModal) {
        return;
    }

    leaveModal.classList.remove("show");

    if (leaveForm) {
        leaveForm.reset();
    }
}


function renderLeave() {

    if (!leaveTableBody) {
        return;
    }

    const search =
        leaveSearch
            ? leaveSearch.value
                .trim()
                .toLowerCase()
            : "";

    const typeFilter =
        leaveTypeFilter
            ? leaveTypeFilter.value
            : "all";

    const statusFilter =
        leaveStatusFilter
            ? leaveStatusFilter.value
            : "all";

    const dateFilter =
        leaveDateFilter
            ? leaveDateFilter.value
            : "";

    const filtered =
        leaveRequests.filter(request => {

            const employee =
                employees.find(
                    e =>
                        e.id ===
                        request.employeeId
                );

            if (!employee) {
                return false;
            }

            const matchesSearch =
                !search ||
                employee.name
                    .toLowerCase()
                    .includes(search) ||
                employee.code
                    .toLowerCase()
                    .includes(search);

            const matchesType =
                typeFilter === "all" ||
                request.type === typeFilter;

            const matchesStatus =
                statusFilter === "all" ||
                request.status === statusFilter;

            const matchesDate =
                !dateFilter ||
                (
                    request.start <= dateFilter &&
                    request.end >= dateFilter
                );

            return (
                matchesSearch &&
                matchesType &&
                matchesStatus &&
                matchesDate
            );
        });

    updateLeaveStats();

    leaveTableBody.innerHTML = "";

    if (!filtered.length) {

        leaveTableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="empty-employees"
                >
                    هنوز درخواست مرخصی یا مأموریتی ثبت نشده است.
                </td>
            </tr>
        `;

        return;
    }

    filtered.forEach(request => {

        const employee =
            employees.find(
                e =>
                    e.id ===
                    request.employeeId
            );

        if (!employee) {
            return;
        }

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>

                <div class="employee-info">

                    <div class="employee-avatar">
                        ${escapeHTML(
                            employee.name.charAt(0)
                        )}
                    </div>

                    <div>
                        <strong>
                            ${escapeHTML(employee.name)}
                        </strong>

                        <span>
                            ${escapeHTML(employee.code)}
                        </span>
                    </div>

                </div>

            </td>

            <td>
                ${getLeaveTypeText(request.type)}
            </td>

            <td>
                ${escapeHTML(request.start)}
            </td>

            <td>
                ${escapeHTML(request.end)}
            </td>

            <td>
                ${escapeHTML(request.days)} روز
            </td>

            <td>
                ${escapeHTML(
                    request.description || "-"
                )}
            </td>

            <td>

                <span
                    class="employee-status ${request.status}"
                >
                    ${getLeaveStatusText(request.status)}
                </span>

            </td>

            <td>

                <div class="action-buttons">

                    ${
                        request.status === "pending"
                            ? `
                                <button
                                    class="action-btn"
                                    onclick="approveLeave(${request.id})"
                                    title="تأیید"
                                >
                                    ✅
                                </button>

                                <button
                                    class="action-btn delete"
                                    onclick="rejectLeave(${request.id})"
                                    title="رد"
                                >
                                    ❌
                                </button>
                            `
                            : ""
                    }

                    <button
                        class="action-btn delete"
                        onclick="deleteLeave(${request.id})"
                        title="حذف"
                    >
                        🗑️
                    </button>

                </div>

            </td>
        `;

        leaveTableBody.appendChild(row);
    });
}


function updateLeaveStats() {

    setText(
        "totalLeave",
        leaveRequests.length
    );

    setText(
        "pendingLeave",
        leaveRequests.filter(
            r => r.status === "pending"
        ).length
    );

    setText(
        "approvedLeave",
        leaveRequests.filter(
            r => r.status === "approved"
        ).length
    );

    setText(
        "rejectedLeave",
        leaveRequests.filter(
            r => r.status === "rejected"
        ).length
    );
}


if (addLeaveBtn) {
    addLeaveBtn.addEventListener(
        "click",
        openLeaveModal
    );
}

if (closeLeaveModal) {
    closeLeaveModal.addEventListener(
        "click",
        closeLeaveRequestModal
    );
}

if (cancelLeaveModal) {
    cancelLeaveModal.addEventListener(
        "click",
        closeLeaveRequestModal
    );
}

if (leaveModal) {

    leaveModal.addEventListener(
        "click",
        event => {

            if (
                event.target === leaveModal
            ) {
                closeLeaveRequestModal();
            }
        }
    );
}


function updateLeaveDays() {

    if (
        !leaveStart ||
        !leaveEnd ||
        !leaveDays
    ) {
        return;
    }

    leaveDays.value =
        calculateLeaveDays(
            leaveStart.value,
            leaveEnd.value
        );
}


if (leaveStart) {
    leaveStart.addEventListener(
        "change",
        updateLeaveDays
    );
}

if (leaveEnd) {
    leaveEnd.addEventListener(
        "change",
        updateLeaveDays
    );
}


/* ==================================================
   SAVE LEAVE
================================================== */

if (leaveForm) {

    leaveForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const employeeId =
                Number(leaveEmployee.value);

            const type =
                leaveType.value;

            const start =
                leaveStart.value;

            const end =
                leaveEnd.value;

            const days =
                Number(leaveDays.value);

            const description =
                leaveDescription.value.trim();

            if (
                !employeeId ||
                !type ||
                !start ||
                !end ||
                !days
            ) {

                alert(
                    "لطفاً اطلاعات درخواست را کامل کنید."
                );

                return;
            }

            if (end < start) {

                alert(
                    "تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد."
                );

                return;
            }

            const employee =
                employees.find(
                    e =>
                        e.id === employeeId
                );

            if (!employee) {
                return;
            }

            const request = {

                id: Date.now(),

                employeeId,

                type,

                start,

                end,

                days,

                description,

                status: "pending",

                createdAt:
                    new Date().toISOString()
            };

            leaveRequests.unshift(request);

            saveLeaveRequests();

            renderLeave();
            renderDashboard();

            closeLeaveRequestModal();

            addNotification({

                type: "leave",

                title: "درخواست جدید",

                message:
                    `${employee.name} یک درخواست ${getLeaveTypeText(type)} ثبت کرد.`,

                icon:
                    type === "mission"
                        ? "🚗"
                        : "🏖️"
            });

            alert(
                "درخواست با موفقیت ثبت شد."
            );
        }
    );
}


/* ==================================================
   LEAVE ACTIONS
================================================== */

function approveLeave(id) {

    const request =
        leaveRequests.find(
            r => r.id === id
        );

    if (!request) {
        return;
    }

    request.status =
        "approved";

    saveLeaveRequests();

    renderLeave();
    renderDashboard();

    addNotification({

        type: "leave",

        title: "درخواست تأیید شد",

        message:
            `${getLeaveTypeText(request.type)} تأیید شد.`,

        icon: "✅"
    });
}


function rejectLeave(id) {

    const request =
        leaveRequests.find(
            r => r.id === id
        );

    if (!request) {
        return;
    }

    request.status =
        "rejected";

    saveLeaveRequests();

    renderLeave();
    renderDashboard();

    addNotification({

        type: "leave",

        title: "درخواست رد شد",

        message:
            `${getLeaveTypeText(request.type)} رد شد.`,

        icon: "❌"
    });
}


function deleteLeave(id) {

    if (
        !confirm(
            "آیا از حذف این درخواست مطمئن هستید؟"
        )
    ) {
        return;
    }

    leaveRequests =
        leaveRequests.filter(
            r => r.id !== id
        );

    saveLeaveRequests();

    renderLeave();
    renderDashboard();
}


if (leaveSearch) {
    leaveSearch.addEventListener(
        "input",
        renderLeave
    );
}

if (leaveTypeFilter) {
    leaveTypeFilter.addEventListener(
        "change",
        renderLeave
    );
}

if (leaveStatusFilter) {
    leaveStatusFilter.addEventListener(
        "change",
        renderLeave
    );
}

if (leaveDateFilter) {
    leaveDateFilter.addEventListener(
        "change",
        renderLeave
    );


/* ==================================================
   NOTIFICATIONS
================================================== */

function saveNotifications() {

    saveJSON(
        STORAGE.notifications,
        notifications
    );
}


function addNotification(data) {

    const notification = {

        id: Date.now(),

        type:
            data.type || "system",

        title:
            data.title || "اعلان سیستم",

        message:
            data.message || "",

        icon:
            data.icon || "🔔",

        read: false,

        createdAt:
            new Date().toISOString()
    };

    notifications.unshift(notification);

    if (notifications.length > 100) {

        notifications =
            notifications.slice(0, 100);
    }

    saveNotifications();

    updateNotificationBadge();
}


function getNotificationTime(date) {

    if (!date) {
        return "";
    }

    const created =
        new Date(date);

    const seconds =
        Math.floor(
            (
                new Date() - created
            ) / 1000
        );

    if (seconds < 60) {
        return "همین الان";
    }

    if (seconds < 3600) {

        return `${Math.floor(
            seconds / 60
        )} دقیقه پیش`;
    }

    if (seconds < 86400) {

        return `${Math.floor(
            seconds / 3600
        )} ساعت پیش`;
    }

    return created.toLocaleDateString(
        "fa-IR"
    );
}


function updateNotificationBadge() {

    const unread =
        notifications.filter(
            n => !n.read
        ).length;

    const badge =
        document.getElementById(
            "notificationBadge"
        );

    if (badge) {

        badge.textContent =
            unread;

        badge.style.display =
            unread
                ? "inline-flex"
                : "none";
    }

    const menu =
        document.querySelector(
            '[data-page="notifications"]'
        );

    if (!menu) {
        return;
    }

    let menuBadge =
        menu.querySelector(
            ".notification-menu-badge"
        );

    if (unread) {

        if (!menuBadge) {

            menuBadge =
                document.createElement("span");

            menuBadge.className =
                "notification-menu-badge";

            menu.appendChild(menuBadge);
        }

        menuBadge.textContent =
            unread;

    } else if (menuBadge) {

        menuBadge.remove();
    }
}


function renderNotifications() {

    const container =
        document.getElementById(
            "notificationsContainer"
        );

    const empty =
        document.getElementById(
            "notificationsEmpty"
        );

    if (!container) {

        updateNotificationBadge();

        return;
    }

    const unread =
        notifications.filter(
            n => !n.read
        ).length;

    setText(
        "notificationCount",
        unread
    );

    container.innerHTML = "";

    if (!notifications.length) {

        if (empty) {
            empty.style.display = "block";
        }

        updateNotificationBadge();

        return;
    }

    if (empty) {
        empty.style.display = "none";
    }

    notifications.forEach(notification => {

        const item =
            document.createElement("div");

        item.className =
            `notification-item ${
                notification.read
                    ? "read"
                    : "unread"
            }`;

        item.innerHTML = `

            <div class="notification-icon">
                ${escapeHTML(notification.icon)}
            </div>

            <div class="notification-content">

                <strong>
                    ${escapeHTML(notification.title)}
                </strong>

                <p>
                    ${escapeHTML(notification.message)}
                </p>

                <small>
                    ${getNotificationTime(
                        notification.createdAt
                    )}
                </small>

            </div>

            <div class="notification-actions">

                ${
                    !notification.read
                        ? `
                            <button
                                class="action-btn"
                                onclick="markNotificationRead(${notification.id})"
                            >
                                ✓
                            </button>
                        `
                        : ""
                }

                <button
                    class="action-btn delete"
                    onclick="deleteNotification(${notification.id})"
                >
                    🗑️
                </button>

            </div>
        `;

        container.appendChild(item);
    });

    updateNotificationBadge();
}


function markNotificationRead(id) {

    const notification =
        notifications.find(
            n => n.id === id
        );

    if (!notification) {
        return;
    }

    notification.read = true;

    saveNotifications();

    renderNotifications();
}


function markAllNotificationsRead() {

    notifications.forEach(
        notification => {
            notification.read = true;
        }
    );

    saveNotifications();

    renderNotifications();
}


function deleteNotification(id) {

    notifications =
        notifications.filter(
            n => n.id !== id
        );

    saveNotifications();

    renderNotifications();
}


function clearAllNotifications() {

    if (!notifications.length) {
        return;
    }

    if (
        !confirm(
            "همه اعلان‌ها حذف شوند؟"
        )
    ) {
        return;
    }

    notifications = [];

    saveNotifications();

    renderNotifications();
}


const markAllNotificationsBtn =
    document.getElementById(
        "markAllNotifications"
    );

const clearAllNotificationsBtn =
    document.getElementById(
        "clearAllNotifications"
    );

if (markAllNotificationsBtn) {

    markAllNotificationsBtn.addEventListener(
        "click",
        markAllNotificationsRead
    );
}

if (clearAllNotificationsBtn) {

    clearAllNotificationsBtn.addEventListener(
        "click",
        clearAllNotifications
    );
}


/* ==================================================
   DASHBOARD
================================================== */

function getTodayAttendanceStats() {

    const date =
        getTodayISO();

    let present = 0;
    let late = 0;
    let absent = 0;
    let leave = 0;

    employees
        .filter(e => e.status === "active")
        .forEach(employee => {

            const record =
                getAttendanceRecord(
                    employee.id,
                    date
                );

            if (record.status === "present") {
                present++;
            }

            else if (record.status === "late") {
                late++;
            }

            else if (record.status === "leave") {
                leave++;
            }

            else {
                absent++;
            }
        });

    return {
        present,
        late,
        absent,
        leave
    };
}


function renderDashboard() {

    const total =
        employees.length;

    const active =
        employees.filter(
            e => e.status === "active"
        ).length;

    const inactive =
        employees.filter(
            e => e.status === "inactive"
        ).length;

    const departments =
        new Set(
            employees
                .map(e => e.department)
                .filter(Boolean)
        ).size;

    const attendance =
        getTodayAttendanceStats();

    const attendanceRate =
        active
            ? Math.round(
                (
                    (
                        attendance.present +
                        attendance.late
                    ) /
                    active
                ) * 100
            )
            : 0;

    const pending =
        leaveRequests.filter(
            r => r.status === "pending"
        ).length;

    const approved =
        leaveRequests.filter(
            r => r.status === "approved"
        ).length;

    const unread =
        notifications.filter(
            n => !n.read
        ).length;


    setText(
        "dashboardTotal",
        total
    );

    setText(
        "dashboardActive",
        active
    );

    setText(
        "dashboardInactive",
        inactive
    );

    setText(
        "dashboardDepartments",
        departments
    );

    setText(
        "dashboardPresent",
        attendance.present
    );

    setText(
        "dashboardLate",
        attendance.late
    );

    setText(
        "dashboardAbsent",
        attendance.absent
    );

    setText(
        "dashboardLeave",
        attendance.leave
    );

    setText(
        "dashboardAttendanceRate",
        `${attendanceRate}%`
    );

    setText(
        "dashboardPendingLeave",
        pending
    );

    setText(
        "dashboardApprovedLeave",
        approved
    );

    setText(
        "dashboardNotifications",
        unread
    );


    document
        .querySelectorAll(
            "[data-dashboard-progress]"
        )
        .forEach(bar => {

            const type =
                bar.dataset.dashboardProgress;

            if (type === "attendance") {

                bar.style.width =
                    `${attendanceRate}%`;
            }

            if (type === "active") {

                const rate =
                    total
                        ? Math.round(
                            active /
                            total *
                            100
                        )
                        : 0;

                bar.style.width =
                    `${rate}%`;
            }
        });


    renderDashboardRecentActivity();
}


function renderDashboardRecentActivity() {

    const container =
        document.getElementById(
            "dashboardRecentActivity"
        );

    if (!container) {
        return;
    }

    const activities =
        notifications
            .slice(0, 8)
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

    container.innerHTML = "";

    if (!activities.length) {

        container.innerHTML = `
            <div class="empty-employees">
                هنوز فعالیتی ثبت نشده است.
            </div>
        `;

        return;
    }

    activities
        .slice(0, 5)
        .forEach(activity => {

            const item =
                document.createElement("div");

            item.className =
                "dashboard-activity-item";

            item.innerHTML = `

                <div class="notification-icon">
                    ${escapeHTML(activity.icon)}
                </div>

                <div>

                    <strong>
                        ${escapeHTML(activity.title)}
                    </strong>

                    <p>
                        ${escapeHTML(activity.message)}
                    </p>

                    <small>
                        ${getNotificationTime(
                            activity.createdAt
                        )}
                    </small>

                </div>
            `;

            container.appendChild(item);
        });
}


/* ==================================================
   REPORTS
================================================== */

function renderReports() {

    const attendance =
        getTodayAttendanceStats();

    setText(
        "reportTotalEmployees",
        employees.length
    );

    setText(
        "reportActiveEmployees",
        employees.filter(
            e => e.status === "active"
        ).length
    );

    setText(
        "reportTotalLeaves",
        leaveRequests.length
    );

    setText(
        "reportPendingLeaves",
        leaveRequests.filter(
            r => r.status === "pending"
        ).length
    );

    setText(
        "reportApprovedLeaves",
        leaveRequests.filter(
            r => r.status === "approved"
        ).length
    );

    setText(
        "reportRejectedLeaves",
        leaveRequests.filter(
            r => r.status === "rejected"
        ).length
    );

    setText(
        "reportPresent",
        attendance.present
    );

    setText(
        "reportLate",
        attendance.late
    );

    setText(
        "reportAbsent",
        attendance.absent
    );

    setText(
        "reportLeave",
        attendance.leave
    );
}


/* ==================================================
   EXPORT JSON REPORT
================================================== */

function exportHRReport() {

    const report = {

        system:
            "سامانه جامع منابع انسانی میرزا کوچک خان",

        version:
            "1.8",

        generatedAt:
            new Date().toISOString(),

        employees,

        attendance:
            attendanceData,

        leaveRequests,

        notifications
    };

    downloadFile(

        JSON.stringify(
            report,
            null,
            4
        ),

        `mirza-khan-hr-backup-${getTodayISO()}.json`,

        "application/json;charset=utf-8"
    );

    addNotification({

        type: "report",

        title: "پشتیبان‌گیری",

        message:
            "نسخه پشتیبان کامل سامانه ایجاد شد.",

        icon: "💾"
    });
}


/* ==================================================
   CSV EXPORT
================================================== */

function exportEmployeesCSV() {

    if (!employees.length) {

        alert(
            "هیچ کارمندی برای خروجی وجود ندارد."
        );

        return;
    }

    const header = [
        "نام",
        "کد پرسنلی",
        "شماره تماس",
        "واحد",
        "سمت",
        "وضعیت",
        "آدرس"
    ];

    const rows =
        employees.map(employee => [

            employee.name,
            employee.code,
            employee.phone,
            employee.department,
            employee.position,
            employee.status === "active"
                ? "فعال"
                : "غیرفعال",
            employee.address

        ]);

    const csv = [
        header,
        ...rows
    ]
        .map(row =>
            row
                .map(value =>
                    `"${String(
                        value ?? ""
                    ).replaceAll(
                        '"',
                        '""'
                    )}"`
                )
                .join(",")
        )
        .join("\n");

    downloadFile(

        "\uFEFF" + csv,

        `employees-${getTodayISO()}.csv`,

        "text/csv;charset=utf-8"
    );

    addNotification({

        type: "report",

        title: "خروجی کارکنان",

        message:
            "فهرست کارکنان به صورت CSV ذخیره شد.",

        icon: "📄"
    });
}


/* ==================================================
   FULL BACKUP
================================================== */

function createBackup() {

    const backup = {

        app:
            "MIRZA KHAN HR",

        version:
            "1.8",

        date:
            new Date().toISOString(),

        data: {

            employees:
                employees,

            attendance:
                attendanceData,

            leaveRequests:
                leaveRequests,

            notifications:
                notifications
        }
    };

    downloadFile(

        JSON.stringify(
            backup,
            null,
            4
        ),

        `mirza-khan-full-backup-${getTodayISO()}.json`,

        "application/json;charset=utf-8"
    );

    alert(
        "پشتیبان کامل با موفقیت ایجاد شد."
    );
}


/* ==================================================
   RESTORE BACKUP
================================================== */

function restoreBackupFromFile(file) {

    if (!file) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload = event => {

        try {

            const backup =
                JSON.parse(
                    event.target.result
                );

            const data =
                backup.data ||
                backup;

            if (
                !data.employees ||
                !data.attendance ||
                !data.leaveRequests
            ) {

                throw new Error(
                    "Invalid backup"
                );
            }

            if (
                !confirm(
                    "با بازیابی نسخه پشتیبان، اطلاعات فعلی جایگزین می‌شود. ادامه می‌دهید؟"
                )
            ) {
                return;
            }

            employees =
                data.employees;

            attendanceData =
                data.attendance;

            leaveRequests =
                data.leaveRequests;

            notifications =
                data.notifications || [];

            saveJSON(
                STORAGE.employees,
                employees
            );

            saveJSON(
                STORAGE.attendance,
                attendanceData
            );

            saveJSON(
                STORAGE.leave,
                leaveRequests
            );

            saveJSON(
                STORAGE.notifications,
                notifications
            );

            renderEmployees();
            renderAttendance();
            renderLeave();
            renderNotifications();
            renderReports();
            renderDashboard();

            alert(
                "نسخه پشتیبان با موفقیت بازیابی شد."
            );

        } catch (error) {

            console.error(error);

            alert(
                "فایل پشتیبان معتبر نیست."
            );
        }
    };

    reader.readAsText(file);
}


/* ==================================================
   RESET SYSTEM
================================================== */

function resetHRSystem() {

    const firstConfirm =
        confirm(
            "⚠️ تمام اطلاعات سامانه حذف خواهد شد. ادامه می‌دهید؟"
        );

    if (!firstConfirm) {
        return;
    }

    const secondConfirm =
        confirm(
            "این عملیات قابل بازگشت نیست. مطمئن هستید؟"
        );

    if (!secondConfirm) {
        return;
    }

    localStorage.removeItem(
        STORAGE.employees
    );

    localStorage.removeItem(
        STORAGE.attendance
    );

    localStorage.removeItem(
        STORAGE.leave
    );

    localStorage.removeItem(
        STORAGE.notifications
    );

    employees =
        [...defaultEmployees];

    attendanceData = {};

    leaveRequests = [];

    notifications = [];

    saveEmployees();
    saveAttendance();
    saveLeaveRequests();
    saveNotifications();

    renderEmployees();
    renderAttendance();
    renderLeave();
    renderNotifications();
    renderReports();
    renderDashboard();

    alert(
        "سامانه به حالت اولیه بازگردانده شد."
    );
}


/* ==================================================
   CONNECT OPTIONAL BUTTONS
================================================== */

const exportReportBtn =
    document.getElementById(
        "exportReportBtn"
    );

const exportReportsBtn =
    document.getElementById(
        "exportReportsBtn"
    );

const downloadReportBtn =
    document.getElementById(
        "downloadReportBtn"
    );

const exportEmployeesBtn =
    document.getElementById(
        "exportEmployeesBtn"
    );

const backupBtn =
    document.getElementById(
        "backupBtn"
    );

const restoreBackupBtn =
    document.getElementById(
        "restoreBackupBtn"
    );

const restoreFileInput =
    document.getElementById(
        "restoreFileInput"
    );

const resetSystemBtn =
    document.getElementById(
        "resetSystemBtn"
    );


if (exportReportBtn) {
    exportReportBtn.addEventListener(
        "click",
        exportHRReport
    );
}

if (exportReportsBtn) {
    exportReportsBtn.addEventListener(
        "click",
        exportHRReport
    );
}

if (downloadReportBtn) {
    downloadReportBtn.addEventListener(
        "click",
        exportHRReport
    );
}

if (exportEmployeesBtn) {
    exportEmployeesBtn.addEventListener(
        "click",
        exportEmployeesCSV
    );
}

if (backupBtn) {
    backupBtn.addEventListener(
        "click",
        createBackup
    );
}

if (restoreBackupBtn &&
    restoreFileInput) {

    restoreBackupBtn.addEventListener(
        "click",
        () => restoreFileInput.click()
    );
}

if (restoreFileInput) {

    restoreFileInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            restoreBackupFromFile(file);

            event.target.value = "";
        }
    );
}

if (resetSystemBtn) {

    resetSystemBtn.addEventListener(
        "click",
        resetHRSystem
    );
}


/* ==================================================
   CLOCK
================================================== */

function updateClock() {

    const now =
        new Date();

    const time =
        now.toLocaleTimeString(
            "fa-IR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    document.title =
        `میرزا کوچک خان | ${time}`;
}

updateClock();

setInterval(
    updateClock,
    1000
);


/* ==================================================
   AUTO REFRESH
================================================== */

setInterval(
    () => {

        renderDashboard();

        updateSummary();

        updateNotificationBadge();

    },
    30000
);


/* ==================================================
   STORAGE SYNC
================================================== */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            STORAGE.employees
        ) {

            employees =
                loadJSON(
                    STORAGE.employees,
                    defaultEmployees
                );

            renderEmployees();
            renderDashboard();
        }

        if (
            event.key ===
            STORAGE.attendance
        ) {

            attendanceData =
                loadJSON(
                    STORAGE.attendance,
                    {}
                );

            renderAttendance();
            renderDashboard();
        }

        if (
            event.key ===
            STORAGE.leave
        ) {

            leaveRequests =
                loadJSON(
                    STORAGE.leave,
                    []
                );

            renderLeave();
            renderReports();
            renderDashboard();
        }

        if (
            event.key ===
            STORAGE.notifications
        ) {

            notifications =
                loadJSON(
                    STORAGE.notifications,
                    []
                );

            renderNotifications();
            renderDashboard();
        }
    }
);


/* ==================================================
   INITIALIZE
================================================== */

renderEmployees();

updateSummary();

initAttendance();

initLeave();

renderReports();

renderNotifications();

updateNotificationBadge();

renderDashboard();


/* ==================================================
   FIRST RUN
================================================== */

if (!notifications.length) {

    addNotification({

        type: "system",

        title: "خوش آمدید",

        message:
            "به نسخه 1.8 سامانه جامع منابع انسانی میرزا کوچک خان خوش آمدید.",

        icon: "👋"
    });

    renderNotifications();
    renderDashboard();
}


/* ==================================================
   VERSION
================================================== */

console.log(
    "===================================="
);

console.log(
    "MIRZA KHAN HR"
);

console.log(
    "APP.JS VERSION 1.8"
);

console.log(
    "Employee System: ACTIVE"
);

console.log(
    "Attendance System: ACTIVE"
);

console.log(
    "Leave & Mission: ACTIVE"
);

console.log(
    "Notifications: ACTIVE"
);

console.log(
    "Reports: ACTIVE"
);

console.log(
    "Backup & Restore: ACTIVE"
);

console.log(
    "CSV Export: ACTIVE"
);

console.log(
    "Attendance Notes: ACTIVE"
);

console.log(
    "===================================="
);
