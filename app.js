/* ==================================================
   MIRZA KHAN HR
   APP.JS - VERSION 1.7
   کارکنان + حضور و غیاب + مرخصی و مأموریت
   گزارش‌ها + اعلان‌ها + گزارش‌گیری پیشرفته
================================================== */


/* ==================================================
   GLOBAL ELEMENTS
================================================== */

const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");
const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");
const todayDate = document.getElementById("todayDate");


/* ==================================================
   PAGE NAMES
================================================== */

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
   EMPLOYEE DATA
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
    "mirzaKhanEmployees",
    defaultEmployees
);


/* ==================================================
   ATTENDANCE DATA
================================================== */

let attendanceData = loadJSON(
    "mirzaKhanAttendance",
    {}
);


/* ==================================================
   LEAVE DATA
================================================== */

let leaveRequests = loadJSON(
    "mirzaKhanLeaveRequests",
    []
);


/* ==================================================
   NOTIFICATION DATA
================================================== */

let notifications = loadJSON(
    "mirzaKhanNotifications",
    []
);


/* ==================================================
   GENERAL FUNCTIONS
================================================== */

function loadJSON(key, fallback) {
    try {
        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        return JSON.parse(data);
    }

    catch (error) {
        console.error(
            `خطا در خواندن ${key}:`,
            error
        );

        return fallback;
    }
}


function saveJSON(key, data) {
    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}


/* ==================================================
   DATE
================================================== */

function getTodayISO() {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function setDate() {
    if (!todayDate) {
        return;
    }

    const now = new Date();

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
        formatter.format(now);
}

setDate();


/* ==================================================
   PAGE NAVIGATION
================================================== */

menuItems.forEach(item => {

    item.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            const page = this.dataset.page;

            menuItems.forEach(menu => {
                menu.classList.remove("active");
            });

            this.classList.add("active");

            pages.forEach(pageElement => {
                pageElement.classList.remove(
                    "active-page"
                );
            });

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

            if (page === "employees") {
                renderEmployees();
            }

            if (page === "attendance") {
                initAttendance();
            }

            if (page === "leave") {
                initLeave();
            }

            if (page === "reports") {
                renderReports();
            }

            if (page === "notifications") {
                renderNotifications();
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
                sidebar.classList.toggle("open");
            }

        }
    );

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
        "mirzaKhanEmployees",
        employees
    );

}


function getFilteredEmployees() {

    if (!employeeSearch) {
        return employees;
    }

    const search =
        employeeSearch.value
            .trim()
            .toLowerCase();

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

    if (filtered.length === 0) {

        employeesTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-employees">
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
                        title="مشاهده پرونده"
                        onclick="viewEmployee(${employee.id})"
                    >
                        👁
                    </button>

                    <button
                        class="action-btn"
                        title="ویرایش"
                        onclick="editEmployee(${employee.id})"
                    >
                        ✏️
                    </button>

                    <button
                        class="action-btn delete"
                        title="حذف"
                        onclick="deleteEmployee(${employee.id})"
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
            employee =>
                employee.status === "active"
        ).length;

    const inactive =
        employees.filter(
            employee =>
                employee.status === "inactive"
        ).length;

    const departments =
        new Set(
            employees.map(
                employee =>
                    employee.department
            )
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

        modalTitle.textContent =
            "ویرایش کارمند";

        document.getElementById(
            "fullName"
        ).value = employee.name || "";

        document.getElementById(
            "personnelCode"
        ).value = employee.code || "";

        document.getElementById(
            "phone"
        ).value = employee.phone || "";

        document.getElementById(
            "department"
        ).value = employee.department || "";

        document.getElementById(
            "position"
        ).value = employee.position || "";

        document.getElementById(
            "status"
        ).value = employee.status || "active";

        document.getElementById(
            "address"
        ).value = employee.address || "";

        editingEmployeeId =
            employee.id;

    }

    else {

        modalTitle.textContent =
            "افزودن کارمند";

        employeeForm.reset();

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

    const header =
        document.querySelector(
            ".modal-header h3"
        );

    if (header) {
        header.textContent =
            "افزودن کارمند";
    }

}


/* ==================================================
   ADD / EDIT / DELETE EMPLOYEE
================================================== */

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

            const employeesMenu =
                document.querySelector(
                    '[data-page="employees"]'
                );

            if (employeesMenu) {
                employeesMenu.click();
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


if (employeeForm) {

    employeeForm.addEventListener(
        "submit",
        function(event) {

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
                    employees.map(employee => {

                        if (
                            employee.id ===
                            editingEmployeeId
                        ) {

                            return {
                                ...employee,
                                ...employeeData
                            };

                        }

                        return employee;

                    });

            }

            else {

                employees.push({
                    id: Date.now(),
                    ...employeeData
                });

            }

            saveEmployees();

            renderEmployees();
            updateSummary();
            closeEmployeeModal();

            addNotification({
                type: "employee",
                title:
                    wasEditing
                        ? "ویرایش اطلاعات کارمند"
                        : "ثبت کارمند جدید",
                message:
                    wasEditing
                        ? `اطلاعات ${name} ویرایش شد.`
                        : `کارمند ${name} با موفقیت ثبت شد.`,
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


function editEmployee(id) {

    const employee =
        employees.find(
            employee =>
                employee.id === id
        );

    if (!employee) {
        return;
    }

    openEmployeeModal(employee);

}


function deleteEmployee(id) {

    const employee =
        employees.find(
            employee =>
                employee.id === id
        );

    if (!employee) {
        return;
    }

    const confirmed =
        confirm(
            `آیا از حذف «${employee.name}» مطمئن هستید؟`
        );

    if (!confirmed) {
        return;
    }

    employees =
        employees.filter(
            employee =>
                employee.id !== id
        );

    saveEmployees();

    renderEmployees();
    updateSummary();

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
            employee =>
                employee.id === id
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

    const header =
        document.querySelector(
            ".modal-header h3"
        );

    if (header) {
        header.textContent =
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
        employee.name
            ? employee.name.charAt(0)
            : "م"
    );

    setText("profileName", employee.name);
    setText(
        "profilePosition",
        employee.position || "-"
    );
    setText("profileCode", employee.code);
    setText(
        "profileDepartment",
        employee.department
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


/* ==================================================
   EMPLOYEE FILTERS
================================================== */

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

if (employeeModal) {

    employeeModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                employeeModal
            ) {
                closeEmployeeModal();
            }

        }
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

    if (
        attendanceDate &&
        attendanceDate.value
    ) {
        return attendanceDate.value;
    }

    return getTodayISO();
}


function initAttendance() {

    if (!attendanceDate) {
        return;
    }

    if (!attendanceDate.value) {
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

    if (
        !attendanceData[date][employeeId]
    ) {

        attendanceData[date][employeeId] = {
            status: "absent",
            entry: "",
            exit: "",
            note: ""
        };

    }

    return attendanceData[
        date
    ][employeeId];

}


function saveAttendance() {

    saveJSON(
        "mirzaKhanAttendance",
        attendanceData
    );

}


function calculateMinutes(start, end) {

    if (!start || !end) {
        return 0;
    }

    const startParts =
        start.split(":").map(Number);

    const endParts =
        end.split(":").map(Number);

    if (
        startParts.length !== 2 ||
        endParts.length !== 2
    ) {
        return 0;
    }

    const startMinutes =
        startParts[0] * 60 +
        startParts[1];

    const endMinutes =
        endParts[0] * 60 +
        endParts[1];

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

    const statusFilter =
        attendanceStatusFilter
            ? attendanceStatusFilter.value
            : "all";

    const records = [];

    employees
        .filter(
            employee =>
                employee.status === "active"
        )
        .forEach(employee => {

            const record =
                getAttendanceRecord(
                    employee.id,
                    date
                );

            records.push({
                employee,
                record
            });

        });

    updateAttendanceStats(
        records.map(
            item => item.record
        )
    );

    const filtered =
        records.filter(item => {

            const employee =
                item.employee;

            const record =
                item.record;

            const matchesSearch =
                employee.name
                    .toLowerCase()
                    .includes(search) ||
                employee.code
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "all" ||
                record.status === statusFilter;

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
                    onchange="changeAttendanceStatus(
                        ${employee.id},
                        this.value
                    )"
                >
                    <option value="present"
                        ${record.status === "present"
                            ? "selected"
                            : ""}>
                        حاضر
                    </option>

                    <option value="late"
                        ${record.status === "late"
                            ? "selected"
                            : ""}>
                        تأخیر
                    </option>

                    <option value="absent"
                        ${record.status === "absent"
                            ? "selected"
                            : ""}>
                        غایب
                    </option>

                    <option value="leave"
                        ${record.status === "leave"
                            ? "selected"
                            : ""}>
                        مرخصی
                    </option>
                </select>
            </td>

            <td>
                <input
                    type="time"
                    value="${record.entry || ""}"
                    onchange="changeAttendanceTime(
                        ${employee.id},
                        'entry',
                        this.value
                    )"
                >
            </td>

            <td>
                <input
                    type="time"
                    value="${record.exit || ""}"
                    onchange="changeAttendanceTime(
                        ${employee.id},
                        'exit',
                        this.value
                    )"
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
                        title="ثبت ورود"
                        onclick="setCurrentEntry(${employee.id})"
                    >
                        🟢
                    </button>

                    <button
                        class="action-btn"
                        title="ثبت خروج"
                        onclick="setCurrentExit(${employee.id})"
                    >
                        🔴
                    </button>

                    <button
                        class="action-btn"
                        title="پاک کردن"
                        onclick="clearAttendance(${employee.id})"
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

    addNotification({
        type: "attendance",
        title: "تغییر وضعیت حضور",
        message:
            "وضعیت حضور کارمند تغییر کرد.",
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

    saveAttendance();
    renderAttendance();

}


function getCurrentTime() {

    const now = new Date();

    return (
        String(now.getHours())
            .padStart(2, "0") +
        ":" +
        String(now.getMinutes())
            .padStart(2, "0")
    );

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

        delete attendanceData[
            date
        ][employeeId];

    }

    saveAttendance();
    renderAttendance();

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
        () => {

            renderAttendance();

            alert(
                "وضعیت کارکنان از جدول حضور و غیاب قابل ثبت و ویرایش است."
            );

        }
    );

}


/* ==================================================
   LEAVE & MISSION
================================================== */

const addLeaveBtn =
    document.getElementById(
        "addLeaveBtn"
    );

const leaveModal =
    document.getElementById(
        "leaveModal"
    );

const leaveForm =
    document.getElementById(
        "leaveForm"
    );

const closeLeaveModal =
    document.getElementById(
        "closeLeaveModal"
    );

const cancelLeaveModal =
    document.getElementById(
        "cancelLeaveModal"
    );

const leaveEmployee =
    document.getElementById(
        "leaveEmployee"
    );

const leaveType =
    document.getElementById(
        "leaveType"
    );

const leaveStart =
    document.getElementById(
        "leaveStart"
    );

const leaveEnd =
    document.getElementById(
        "leaveEnd"
    );

const leaveDays =
    document.getElementById(
        "leaveDays"
    );

const leaveDescription =
    document.getElementById(
        "leaveDescription"
    );

const leaveTableBody =
    document.getElementById(
        "leaveTableBody"
    );

const leaveSearch =
    document.getElementById(
        "leaveSearch"
    );

const leaveTypeFilter =
    document.getElementById(
        "leaveTypeFilter"
    );

const leaveStatusFilter =
    document.getElementById(
        "leaveStatusFilter"
    );

const leaveDateFilter =
    document.getElementById(
        "leaveDateFilter"
    );


function saveLeaveRequests() {

    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
    );

}


function getLeaveTypeText(type) {

    const types = {
        annual: "مرخصی استحقاقی",
        sick: "مرخصی استعلاجی",
        unpaid: "مرخصی بدون حقوق",
        mission: "مأموریت"
    };

    return types[type] || "-";
}


function getLeaveStatusText(status) {

    const statuses = {
        pending: "در انتظار بررسی",
        approved: "تأیید شده",
        rejected: "رد شده"
    };

    return statuses[status] || "-";
}


function calculateLeaveDays(start, end) {

    if (!start || !end) {
        return 0;
    }

    const startDate =
        new Date(start + "T00:00:00");

    const endDate =
        new Date(end + "T00:00:00");

    const difference =
        endDate - startDate;

    if (difference < 0) {
        return 0;
    }

    return (
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
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
        .filter(
            employee =>
                employee.status === "active"
        )
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
                    item =>
                        item.id ===
                        request.employeeId
                );

            if (!employee) {
                return false;
            }

            const matchesSearch =
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

    if (filtered.length === 0) {

        leaveTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-employees">
                    هنوز درخواست مرخصی یا مأموریتی ثبت نشده است.
                </td>
            </tr>
        `;

        return;
    }

    filtered.forEach(request => {

        const employee =
            employees.find(
                item =>
                    item.id ===
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
                ${escapeHTML(String(request.days))} روز
            </td>

            <td>
                ${escapeHTML(
                    request.description || "-"
                )}
            </td>

            <td>
                <span class="employee-status ${request.status}">
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
                                    title="تأیید"
                                    onclick="approveLeave(${request.id})"
                                >
                                    ✅
                                </button>

                                <button
                                    class="action-btn delete"
                                    title="رد"
                                    onclick="rejectLeave(${request.id})"
                                >
                                    ❌
                                </button>
                            `
                            : ""
                    }

                    <button
                        class="action-btn delete"
                        title="حذف"
                        onclick="deleteLeave(${request.id})"
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

    const total =
        leaveRequests.length;

    const pending =
        leaveRequests.filter(
            request =>
                request.status === "pending"
        ).length;

    const approved =
        leaveRequests.filter(
            request =>
                request.status === "approved"
        ).length;

    const rejected =
        leaveRequests.filter(
            request =>
                request.status === "rejected"
        ).length;

    setText("totalLeave", total);
    setText("pendingLeave", pending);
    setText("approvedLeave", approved);
    setText("rejectedLeave", rejected);

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
                event.target ===
                leaveModal
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

    const days =
        calculateLeaveDays(
            leaveStart.value,
            leaveEnd.value
        );

    if (days > 0) {
        leaveDays.value = days;
    }

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


if (leaveForm) {

    leaveForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const employeeId =
                Number(
                    leaveEmployee.value
                );

            const type =
                leaveType.value;

            const start =
                leaveStart.value;

            const end =
                leaveEnd.value;

            const days =
                Number(
                    leaveDays.value
                );

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
                    item =>
                        item.id === employeeId
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
                "درخواست با موفقیت ثبت شد و برای بررسی ارسال گردید."
            );

        }
    );

}


function approveLeave(id) {

    const request =
        leaveRequests.find(
            item =>
                item.id === id
        );

    if (!request) {
        return;
    }

    const employee =
        employees.find(
            item =>
                item.id ===
                request.employeeId
        );

    request.status =
        "approved";

    saveLeaveRequests();

    renderLeave();

    addNotification({

        type: "leave",

        title: "درخواست تأیید شد",

        message:
            `${employee ? employee.name : "کارمند"} - ${getLeaveTypeText(request.type)} تأیید شد.`,

        icon: "✅"

    });

    alert(
        "درخواست با موفقیت تأیید شد."
    );

}


function rejectLeave(id) {

    const request =
        leaveRequests.find(
            item =>
                item.id === id
        );

    if (!request) {
        return;
    }

    const employee =
        employees.find(
            item =>
                item.id ===
                request.employeeId
        );

    request.status =
        "rejected";

    saveLeaveRequests();

    renderLeave();

    addNotification({

        type: "leave",

        title: "درخواست رد شد",

        message:
            `${employee ? employee.name : "کارمند"} - ${getLeaveTypeText(request.type)} رد شد.`,

        icon: "❌"

    });

    alert(
        "درخواست رد شد."
    );

}


function deleteLeave(id) {

    const request =
        leaveRequests.find(
            item =>
                item.id === id
        );

    if (!request) {
        return;
    }

    if (
        !confirm(
            "آیا از حذف این درخواست مطمئن هستید؟"
        )
    ) {
        return;
    }

    leaveRequests =
        leaveRequests.filter(
            item =>
                item.id !== id
        );

    saveLeaveRequests();

    renderLeave();

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
}


/* ==================================================
   NOTIFICATIONS
================================================== */

function saveNotifications() {

    saveJSON(
        "mirzaKhanNotifications",
        notifications
    );

}


function addNotification(data) {

    const notification = {

        id: Date.now(),

        type:
            data.type ||
            "system",

        title:
            data.title ||
            "اعلان سیستم",

        message:
            data.message ||
            "",

        icon:
            data.icon ||
            "🔔",

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

    const now =
        new Date();

    const difference =
        Math.floor(
            (now - created) / 1000
        );

    if (difference < 60) {
        return "همین الان";
    }

    if (difference < 3600) {
        return `${Math.floor(
            difference / 60
        )} دقیقه پیش`;
    }

    if (difference < 86400) {
        return `${Math.floor(
            difference / 3600
        )} ساعت پیش`;
    }

    return created.toLocaleDateString(
        "fa-IR"
    );

}


function updateNotificationBadge() {

    const unread =
        notifications.filter(
            notification =>
                !notification.read
        ).length;

    const badge =
        document.getElementById(
            "notificationBadge"
        );

    if (badge) {

        badge.textContent =
            unread;

        badge.style.display =
            unread > 0
                ? "inline-flex"
                : "none";

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

    const unreadCount =
        notifications.filter(
            notification =>
                !notification.read
        ).length;

    setText(
        "notificationCount",
        unreadCount
    );

    if (!container) {
        updateNotificationBadge();
        return;
    }

    container.innerHTML = "";

    if (notifications.length === 0) {

        if (empty) {
            empty.style.display = "block";
        }

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
                                title="خوانده شد"
                                onclick="markNotificationRead(${notification.id})"
                            >
                                ✓
                            </button>
                        `
                        : ""
                }

                <button
                    class="action-btn delete"
                    title="حذف"
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
            item =>
                item.id === id
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
            notification =>
                notification.id !== id
        );

    saveNotifications();

    renderNotifications();

}


function clearAllNotifications() {

    if (notifications.length === 0) {
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
   REPORT ENGINE - VERSION 1.7
================================================== */


/*
   ساخت گزارش کلی
*/

function getReportData() {

    const totalEmployees =
        employees.length;

    const activeEmployees =
        employees.filter(
            employee =>
                employee.status === "active"
        ).length;

    const inactiveEmployees =
        employees.filter(
            employee =>
                employee.status === "inactive"
        ).length;

    const departments =
        new Set(
            employees
                .map(
                    employee =>
                        employee.department
                )
                .filter(Boolean)
        ).size;

    const totalRequests =
        leaveRequests.length;

    const pendingRequests =
        leaveRequests.filter(
            request =>
                request.status === "pending"
        ).length;

    const approvedRequests =
        leaveRequests.filter(
            request =>
                request.status === "approved"
        ).length;

    const rejectedRequests =
        leaveRequests.filter(
            request =>
                request.status === "rejected"
        ).length;

    let present = 0;
    let late = 0;
    let absent = 0;
    let attendanceLeave = 0;

    Object.values(attendanceData)
        .forEach(day => {

            Object.values(day)
                .forEach(record => {

                    if (
                        record.status ===
                        "present"
                    ) {
                        present++;
                    }

                    else if (
                        record.status ===
                        "late"
                    ) {
                        late++;
                    }

                    else if (
                        record.status ===
                        "leave"
                    ) {
                        attendanceLeave++;
                    }

                    else {
                        absent++;
                    }

                });

        });

    let totalWorkMinutes = 0;

    Object.values(attendanceData)
        .forEach(day => {

            Object.values(day)
                .forEach(record => {

                    totalWorkMinutes +=
                        calculateMinutes(
                            record.entry,
                            record.exit
                        );

                });

        });

    return {

        totalEmployees,

        activeEmployees,

        inactiveEmployees,

        departments,

        totalRequests,

        pendingRequests,

        approvedRequests,

        rejectedRequests,

        present,

        late,

        absent,

        attendanceLeave,

        totalWorkMinutes

    };

}


/*
   نمایش گزارش
*/

function renderReports() {

    const data =
        getReportData();

    setText(
        "reportTotalEmployees",
        data.totalEmployees
    );

    setText(
        "reportActiveEmployees",
        data.activeEmployees
    );

    setText(
        "reportTotalLeaves",
        data.totalRequests
    );

    setText(
        "reportPendingLeaves",
        data.pendingRequests
    );

    setText(
        "reportApprovedLeaves",
        data.approvedRequests
    );

    setText(
        "reportRejectedLeaves",
        data.rejectedRequests
    );

    /*
       اگر کارت‌های جدید در HTML وجود داشته باشند،
       خودکار مقداردهی می‌شوند.
    */

    setText(
        "reportInactiveEmployees",
        data.inactiveEmployees
    );

    setText(
        "reportDepartments",
        data.departments
    );

    setText(
        "reportPresent",
        data.present
    );

    setText(
        "reportLate",
        data.late
    );

    setText(
        "reportAbsent",
        data.absent
    );

    setText(
        "reportAttendanceLeave",
        data.attendanceLeave
    );

    setText(
        "reportTotalWorkMinutes",
        formatMinutes(
            data.totalWorkMinutes
        )
    );

}


/* ==================================================
   REPORT SUMMARY
================================================== */

function generateReportSummary() {

    const data =
        getReportData();

    const attendanceTotal =
        data.present +
        data.late +
        data.absent +
        data.attendanceLeave;

    const attendanceRate =
        attendanceTotal > 0
            ? Math.round(
                (
                    (
                        data.present +
                        data.late
                    ) /
                    attendanceTotal
                ) * 100
            )
            : 0;

    const approvalRate =
        data.totalRequests > 0
            ? Math.round(
                (
                    data.approvedRequests /
                    data.totalRequests
                ) * 100
            )
            : 0;

    return {

        ...data,

        attendanceTotal,

        attendanceRate,

        approvalRate

    };

}


/* ==================================================
   REPORT EXPORT - CSV
================================================== */

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

    link.download =
        filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}


function convertToCSV(rows) {

    return rows
        .map(row =>
            row
                .map(value => {

                    const text =
                        String(
                            value ?? ""
                        );

                    return `"${text.replaceAll(
                        '"',
                        '""'
                    )}"`;

                })
                .join(",")
        )
        .join("\n");

}


function exportEmployeesReport() {

    const rows = [

        [
            "نام کارمند",
            "کد پرسنلی",
            "واحد",
            "سمت",
            "شماره تماس",
            "وضعیت"
        ]

    ];

    employees.forEach(employee => {

        rows.push([

            employee.name,

            employee.code,

            employee.department,

            employee.position,

            employee.phone,

            employee.status === "active"
                ? "فعال"
                : "غیرفعال"

        ]);

    });

    const csv =
        "\uFEFF" +
        convertToCSV(rows);

    downloadFile(
        csv,
        `گزارش-کارکنان-${getTodayISO()}.csv`,
        "text/csv;charset=utf-8"
    );

}


function exportLeaveReport() {

    const rows = [

        [
            "کارمند",
            "کد پرسنلی",
            "نوع درخواست",
            "شروع",
            "پایان",
            "تعداد روز",
            "وضعیت",
            "توضیحات"
        ]

    ];

    leaveRequests.forEach(request => {

        const employee =
            employees.find(
                employee =>
                    employee.id ===
                    request.employeeId
            );

        if (!employee) {
            return;
        }

        rows.push([

            employee.name,

            employee.code,

            getLeaveTypeText(
                request.type
            ),

            request.start,

            request.end,

            request.days,

            getLeaveStatusText(
                request.status
            ),

            request.description || ""

        ]);

    });

    const csv =
        "\uFEFF" +
        convertToCSV(rows);

    downloadFile(
        csv,
        `گزارش-مرخصی-${getTodayISO()}.csv`,
        "text/csv;charset=utf-8"
    );

}


function exportAttendanceReport() {

    const rows = [

        [
            "تاریخ",
            "کارمند",
            "کد پرسنلی",
            "وضعیت",
            "ورود",
            "خروج",
            "مدت کار"
        ]

    ];

    Object.keys(attendanceData)
        .sort()
        .forEach(date => {

            Object.keys(
                attendanceData[date]
            ).forEach(employeeId => {

                const record =
                    attendanceData[
                        date
                    ][employeeId];

                const employee =
                    employees.find(
                        employee =>
                            employee.id ===
                            Number(employeeId)
                    );

                if (!employee) {
                    return;
                }

                rows.push([

                    date,

                    employee.name,

                    employee.code,

                    record.status === "present"
                        ? "حاضر"
                        : record.status === "late"
                            ? "تأخیر"
                            : record.status === "leave"
                                ? "مرخصی"
                                : "غایب",

                    record.entry || "",

                    record.exit || "",

                    formatMinutes(
                        calculateMinutes(
                            record.entry,
                            record.exit
                        )
                    )

                ]);

            });

        });

    const csv =
        "\uFEFF" +
        convertToCSV(rows);

    downloadFile(
        csv,
        `گزارش-حضور-و-غیاب-${getTodayISO()}.csv`,
        "text/csv;charset=utf-8"
    );

}


/* ==================================================
   FULL REPORT EXPORT
================================================== */

function exportFullReport() {

    const data =
        generateReportSummary();

    const rows = [

        [
            "گزارش جامع منابع انسانی",
            ""
        ],

        [
            "تاریخ گزارش",
            new Date().toLocaleDateString(
                "fa-IR"
            )
        ],

        [],

        [
            "شاخص",
            "مقدار"
        ],

        [
            "کل کارکنان",
            data.totalEmployees
        ],

        [
            "کارکنان فعال",
            data.activeEmployees
        ],

        [
            "کارکنان غیرفعال",
            data.inactiveEmployees
        ],

        [
            "تعداد واحدها",
            data.departments
        ],

        [
            "کل درخواست‌های مرخصی/مأموریت",
            data.totalRequests
        ],

        [
            "در انتظار بررسی",
            data.pendingRequests
        ],

        [
            "تأیید شده",
            data.approvedRequests
        ],

        [
            "رد شده",
            data.rejectedRequests
        ],

        [
            "حاضر",
            data.present
        ],

        [
            "تأخیر",
            data.late
        ],

        [
            "غایب",
            data.absent
        ],

        [
            "مرخصی ثبت‌شده در حضور و غیاب",
            data.attendanceLeave
        ],

        [
            "نرخ حضور",
            `${data.attendanceRate}%`
        ],

        [
            "نرخ تأیید درخواست‌ها",
            `${data.approvalRate}%`
        ],

        [
            "مجموع زمان کار",
            formatMinutes(
                data.totalWorkMinutes
            )
        ]

    ];

    const csv =
        "\uFEFF" +
        convertToCSV(rows);

    downloadFile(
        csv,
        `گزارش-جامع-میرزا-کوچک-خان-${getTodayISO()}.csv`,
        "text/csv;charset=utf-8"
    );

}


/* ==================================================
   PRINT REPORT
================================================== */

function printReport() {

    renderReports();

    window.print();

}


/* ==================================================
   AUTO-DETECT REPORT BUTTONS
================================================== */

function setupReportButtons() {

    const exportFull =
        document.getElementById(
            "exportReportBtn"
        );

    const exportEmployees =
        document.getElementById(
            "exportEmployeesReport"
        );

    const exportAttendance =
        document.getElementById(
            "exportAttendanceReport"
        );

    const exportLeave =
        document.getElementById(
            "exportLeaveReport"
        );

    const printBtn =
        document.getElementById(
            "printReportBtn"
        );

    if (exportFull) {

        exportFull.addEventListener(
            "click",
            exportFullReport
        );

    }

    if (exportEmployees) {

        exportEmployees.addEventListener(
            "click",
            exportEmployeesReport
        );

    }

    if (exportAttendance) {

        exportAttendance.addEventListener(
            "click",
            exportAttendanceReport
        );

    }

    if (exportLeave) {

        exportLeave.addEventListener(
            "click",
            exportLeaveReport
        );

    }

    if (printBtn) {

        printBtn.addEventListener(
            "click",
            printReport
        );

    }

}


/* ==================================================
   REFRESH REPORT
================================================== */

function refreshReports() {

    renderReports();

    alert(
        "گزارش‌ها با موفقیت بروزرسانی شدند."
    );

}


const refreshReportBtn =
    document.getElementById(
        "refreshReportBtn"
    );

if (refreshReportBtn) {

    refreshReportBtn.addEventListener(
        "click",
        refreshReports
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
                minute: "2-digit"
            }
        );

    document.title =
        `میرزا کوچک خان | ${time}`;

}

setInterval(
    updateClock,
    1000
);

updateClock();


/* ==================================================
   INITIALIZE
================================================== */

renderEmployees();

updateSummary();

initAttendance();

initLeave();

renderReports();

setupReportButtons();

updateNotificationBadge();

renderNotifications();


/* ==================================================
   DEFAULT SYSTEM NOTIFICATION
================================================== */

if (notifications.length === 0) {

    addNotification({

        type: "system",

        title: "خوش آمدید",

        message:
            "به سامانه جامع منابع انسانی میرزا کوچک خان خوش آمدید.",

        icon: "👋"

    });

       }
