/* ==================================================
   MIRZA KHAN HR
   APP.JS - VERSION 1.6

   امکانات:
   کارکنان
   حضور و غیاب
   مرخصی و مأموریت
   گزارش‌ها
   اعلان‌ها
   ذخیره اطلاعات در LocalStorage
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
    "mirzaKhanEmployees",
    defaultEmployees
);


/* ==================================================
   ATTENDANCE
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
   NOTIFICATIONS
================================================== */

let notifications = loadJSON(
    "mirzaKhanNotifications",
    []
);


/* ==================================================
   GENERAL STORAGE
================================================== */

function loadJSON(key, fallback) {

    try {

        const data =
            localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        return JSON.parse(data);

    } catch (error) {

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


function formatDate(date) {

    if (!date) {
        return "-";
    }

    try {

        return new Intl.DateTimeFormat(
            "fa-IR"
        ).format(
            new Date(date + "T00:00:00")
        );

    } catch {

        return date;

    }

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
   TEXT
================================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value;
    }

}


/* ==================================================
   ESCAPE HTML
================================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ==================================================
   PAGE NAVIGATION
================================================== */

menuItems.forEach(item => {

    item.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            const page =
                this.dataset.page;


            menuItems.forEach(menu => {

                menu.classList.remove(
                    "active"
                );

            });


            this.classList.add("active");


            pages.forEach(
                pageElement => {

                    pageElement.classList.remove(
                        "active-page"
                    );

                }
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

                sidebar.classList.remove(
                    "open"
                );

            }


            if (page === "employees") {
                renderEmployees();
            }


            if (page === "attendance") {
                initAttendance();
            }


            if (page === "leave") {
                renderLeave();
                populateLeaveEmployees();
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

                sidebar.classList.toggle(
                    "open"
                );

            }

        }
    );

}


/* ==================================================
   EMPLOYEE ELEMENTS
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


/* ==================================================
   EMPLOYEE SAVE
================================================== */

function saveEmployees() {

    saveJSON(
        "mirzaKhanEmployees",
        employees
    );

}


/* ==================================================
   EMPLOYEE FILTER
================================================== */

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


    return employees.filter(
        employee => {

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

                employee.department ===
                department;


            const matchesStatus =

                status === "all" ||

                employee.status ===
                status;


            return (

                matchesSearch &&
                matchesDepartment &&
                matchesStatus

            );

        }
    );

}


/* ==================================================
   RENDER EMPLOYEES
================================================== */

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
                    کارمندی با این مشخصات
                    پیدا نشد.
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
                ${escapeHTML(
                    employee.department || "-"
                )}
            </td>


            <td>
                ${escapeHTML(
                    employee.position || "-"
                )}
            </td>


            <td>
                ${escapeHTML(
                    employee.phone || "-"
                )}
            </td>


            <td>

                <span
                    class="employee-status
                    ${employee.status}"
                >
                    ${statusText}
                </span>

            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn"
                        onclick="viewEmployee(${employee.id})"
                    >
                        👁
                    </button>

                    <button
                        class="action-btn"
                        onclick="editEmployee(${employee.id})"
                    >
                        ✏️
                    </button>

                    <button
                        class="action-btn delete"
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


/* ==================================================
   EMPLOYEE SUMMARY
================================================== */

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
            employees.map(
                e => e.department
            )
        ).size;


    setText(
        "totalEmployees",
        total
    );

    setText(
        "activeEmployees",
        active
    );

    setText(
        "inactiveEmployees",
        inactive
    );

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

}


/* ==================================================
   EMPLOYEE MODAL
================================================== */

function restoreProfileView() {

    if (employeeForm) {

        employeeForm.style.display =
            "grid";

    }


    const profileView =
        document.getElementById(
            "profileView"
        );


    if (profileView) {

        profileView.classList.remove(
            "show"
        );

    }

}


function openEmployeeModal(
    employee = null
) {

    if (!employeeModal) {
        return;
    }


    employeeModal.classList.add(
        "show"
    );


    restoreProfileView();


    if (employee) {

        if (modalTitle) {

            modalTitle.textContent =
                "ویرایش کارمند";

        }


        document.getElementById(
            "fullName"
        ).value =
            employee.name || "";


        document.getElementById(
            "personnelCode"
        ).value =
            employee.code || "";


        document.getElementById(
            "phone"
        ).value =
            employee.phone || "";


        document.getElementById(
            "department"
        ).value =
            employee.department || "";


        document.getElementById(
            "position"
        ).value =
            employee.position || "";


        document.getElementById(
            "status"
        ).value =
            employee.status || "active";


        document.getElementById(
            "address"
        ).value =
            employee.address || "";


        editingEmployeeId =
            employee.id;

    } else {

        if (modalTitle) {

            modalTitle.textContent =
                "افزودن کارمند";

        }


        employeeForm.reset();

        editingEmployeeId = null;

    }

}


function closeEmployeeModal() {

    if (!employeeModal) {
        return;
    }


    employeeModal.classList.remove(
        "show"
    );


    restoreProfileView();


    if (employeeForm) {
        employeeForm.reset();
    }


    editingEmployeeId = null;

}


/* ==================================================
   ADD EMPLOYEE
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


/* ==================================================
   EMPLOYEE MODAL BUTTONS
================================================== */

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
                event.target ===
                employeeModal
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


            if (!name || !code || !department) {

                alert(
                    "لطفاً اطلاعات الزامی را وارد کنید."
                );

                return;

            }


            const duplicate =
                employees.find(
                    employee =>

                        employee.code === code &&

                        employee.id !==
                        editingEmployeeId
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
                    employees.map(
                        employee => {

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

                        }
                    );


                addNotification(
                    "employee",
                    "اطلاعات کارمند ویرایش شد",
                    `اطلاعات ${name} با موفقیت ویرایش شد.`,
                    "info"
                );


            } else {

                const newEmployee = {

                    id: Date.now(),

                    ...employeeData

                };


                employees.push(
                    newEmployee
                );


                addNotification(
                    "employee",
                    "کارمند جدید ثبت شد",
                    `${name} با کد ${code} به کارکنان اضافه شد.`,
                    "success"
                );

            }


            saveEmployees();

            renderEmployees();

            updateSummary();

            closeEmployeeModal();


            alert(
                wasEditing
                    ? "اطلاعات کارمند با موفقیت ویرایش شد."
                    : "کارمند جدید با موفقیت ثبت شد."
            );

        }
    );

}


/* ==================================================
   EDIT EMPLOYEE
================================================== */

function editEmployee(id) {

    const employee =
        employees.find(
            e => e.id === id
        );


    if (!employee) {
        return;
    }


    openEmployeeModal(
        employee
    );

}


/* ==================================================
   DELETE EMPLOYEE
================================================== */

function deleteEmployee(id) {

    const employee =
        employees.find(
            e => e.id === id
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
            e => e.id !== id
        );


    saveEmployees();

    renderEmployees();

    updateSummary();


    addNotification(
        "employee",
        "کارمند حذف شد",
        `${employee.name} از فهرست کارکنان حذف شد.`,
        "warning"
    );

}


/* ==================================================
   VIEW EMPLOYEE
================================================== */

function viewEmployee(id) {

    const employee =
        employees.find(
            e => e.id === id
        );


    if (!employee || !employeeModal) {
        return;
    }


    employeeModal.classList.add(
        "show"
    );


    if (employeeForm) {

        employeeForm.style.display =
            "none";

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

        profileView.classList.add(
            "show"
        );

    }


    setText(
        "profileAvatar",
        employee.name?.charAt(0) || "م"
    );

    setText(
        "profileName",
        employee.name
    );

    setText(
        "profilePosition",
        employee.position || "-"
    );

    setText(
        "profileCode",
        employee.code
    );

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
   EMPLOYEE SEARCH
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


/* ==================================================
   ATTENDANCE ELEMENTS
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


/* ==================================================
   ATTENDANCE DATE
================================================== */

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


/* ==================================================
   ATTENDANCE RECORD
================================================== */

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


/* ==================================================
   SAVE ATTENDANCE
================================================== */

function saveAttendance() {

    saveJSON(
        "mirzaKhanAttendance",
        attendanceData
    );

}


/* ==================================================
   ATTENDANCE STATUS
================================================== */

function getAttendanceStatusText(
    status
) {

    const statuses = {

        present: "حاضر",
        late: "تأخیر",
        absent: "غایب",
        leave: "مرخصی"

    };


    return statuses[status] ||
        "غایب";

}


/* ==================================================
   MINUTES
================================================== */

function calculateMinutes(
    start,
    end
) {

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
        endMinutes -
        startMinutes;


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
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    return `${hours} ساعت و ${mins} دقیقه`;

}


/* ==================================================
   ATTENDANCE STATS
================================================== */

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


    setText(
        "presentCount",
        present
    );

    setText(
        "lateCount",
        late
    );

    setText(
        "absentCount",
        absent
    );

    setText(
        "leaveCount",
        leave
    );

}


/* ==================================================
   RENDER ATTENDANCE
================================================== */

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


    const statusFilterValue =
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
                    .includes(search)

                ||

                employee.code
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                statusFilterValue === "all"

                ||

                record.status ===
                statusFilterValue;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    attendanceTableBody.innerHTML = "";


    if (!filtered.length) {

        attendanceTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-employees"
                >
                    موردی برای نمایش وجود ندارد.
                </td>

            </tr>

        `;

        return;

    }


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
                            ${escapeHTML(
                                employee.name
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                employee.code
                            )}
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

                    <option
                        value="present"
                        ${record.status === "present"
                            ? "selected"
                            : ""}
                    >
                        حاضر
                    </option>

                    <option
                        value="late"
                        ${record.status === "late"
                            ? "selected"
                            : ""}
                    >
                        تأخیر
                    </option>

                    <option
                        value="absent"
                        ${record.status === "absent"
                            ? "selected"
                            : ""}
                    >
                        غایب
                    </option>

                    <option
                        value="leave"
                        ${record.status === "leave"
                            ? "selected"
                            : ""}
                    >
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
                ${formatMinutes(
                    workMinutes
                )}
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
                        onclick="setCurrentEntry(
                            ${employee.id}
                        )"
                    >
                        🟢
                    </button>


                    <button
                        class="action-btn"
                        title="ثبت خروج"
                        onclick="setCurrentExit(
                            ${employee.id}
                        )"
                    >
                        🔴
                    </button>


                    <button
                        class="action-btn"
                        title="پاک کردن"
                        onclick="clearAttendance(
                            ${employee.id}
                        )"
                    >
                        ↺
                    </button>

                </div>

            </td>

        `;


        attendanceTableBody.appendChild(
            row
        );

    });

}


/* ==================================================
   ATTENDANCE STATUS
================================================== */

function changeAttendanceStatus(
    employeeId,
    status
) {

    const record =
        getAttendanceRecord(
            employeeId
        );


    record.status =
        status;


    saveAttendance();

    renderAttendance();


    const employee =
        employees.find(
            e => e.id === employeeId
        );


    if (employee) {

        addNotification(
            "attendance",
            "وضعیت حضور تغییر کرد",
            `وضعیت حضور ${employee.name} به «${getAttendanceStatusText(status)}» تغییر کرد.`,
            "info"
        );

    }

}


/* ==================================================
   ATTENDANCE TIME
================================================== */

function changeAttendanceTime(
    employeeId,
    type,
    value
) {

    const record =
        getAttendanceRecord(
            employeeId
        );


    record[type] =
        value;


    saveAttendance();

    renderAttendance();

}


/* ==================================================
   CURRENT TIME
================================================== */

function getCurrentTime() {

    const now =
        new Date();


    return (

        String(
            now.getHours()
        ).padStart(2, "0")

        +

        ":"

        +

        String(
            now.getMinutes()
        ).padStart(2, "0")

    );

}


/* ==================================================
   ENTRY
================================================== */

function setCurrentEntry(
    employeeId
) {

    const record =
        getAttendanceRecord(
            employeeId
        );


    record.entry =
        getCurrentTime();


    if (
        record.status === "absent"
    ) {

        record.status =
            "present";

    }


    saveAttendance();

    renderAttendance();


    const employee =
        employees.find(
            e => e.id === employeeId
        );


    if (employee) {

        addNotification(
            "attendance",
            "ورود ثبت شد",
            `ورود ${employee.name} در ساعت ${record.entry} ثبت شد.`,
            "success"
        );

    }

}


/* ==================================================
   EXIT
================================================== */

function setCurrentExit(
    employeeId
) {

    const record =
        getAttendanceRecord(
            employeeId
        );


    record.exit =
        getCurrentTime();


    if (
        record.status === "absent"
    ) {

        record.status =
            "present";

    }


    saveAttendance();

    renderAttendance();


    const employee =
        employees.find(
            e => e.id === employeeId
        );


    if (employee) {

        addNotification(
            "attendance",
            "خروج ثبت شد",
            `خروج ${employee.name} در ساعت ${record.exit} ثبت شد.`,
            "info"
        );

    }

}


/* ==================================================
   CLEAR ATTENDANCE
================================================== */

function clearAttendance(
    employeeId
) {

    const confirmed =
        confirm(
            "اطلاعات حضور این کارمند برای این روز پاک شود؟"
        );


    if (!confirmed) {
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


/* ==================================================
   ATTENDANCE EVENTS
================================================== */

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
   LEAVE ELEMENTS
================================================== */

const leaveTableBody =
    document.getElementById(
        "leaveTableBody"
    );

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


/* ==================================================
   LEAVE TYPE TEXT
================================================== */

function getLeaveTypeText(type) {

    const types = {

        annual: "مرخصی استحقاقی",
        sick: "مرخصی استعلاجی",
        unpaid: "مرخصی بدون حقوق",
        mission: "مأموریت"

    };


    return types[type] || "-";

}


/* ==================================================
   LEAVE STATUS TEXT
================================================== */

function getLeaveStatusText(status) {

    const statuses = {

        pending: "در انتظار بررسی",
        approved: "تأیید شده",
        rejected: "رد شده"

    };


    return statuses[status] || "-";

}


/* ==================================================
   POPULATE LEAVE EMPLOYEES
================================================== */

function populateLeaveEmployees() {

    if (!leaveEmployee) {
        return;
    }


    const currentValue =
        leaveEmployee.value;


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
                document.createElement(
                    "option"
                );


            option.value =
                employee.id;


            option.textContent =
                `${employee.name} - ${employee.code}`;


            leaveEmployee.appendChild(
                option
            );

        });


    if (currentValue) {

        leaveEmployee.value =
            currentValue;

    }

}


/* ==================================================
   LEAVE MODAL
================================================== */

function openLeaveModal() {

    if (!leaveModal) {
        return;
    }


    populateLeaveEmployees();


    if (leaveForm) {
        leaveForm.reset();
    }


    leaveModal.classList.add(
        "show"
    );


    const today =
        getTodayISO();


    const start =
        document.getElementById(
            "leaveStart"
        );


    const end =
        document.getElementById(
            "leaveEnd"
        );


    if (start) {
        start.value = today;
    }


    if (end) {
        end.value = today;
    }

}


function closeLeaveRequestModal() {

    if (!leaveModal) {
        return;
    }


    leaveModal.classList.remove(
        "show"
    );


    if (leaveForm) {
        leaveForm.reset();
    }

}


/* ==================================================
   LEAVE ADD
================================================== */

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


/* ==================================================
   LEAVE FORM
================================================== */

if (leaveForm) {

    leaveForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const employeeId =
                Number(
                    document.getElementById(
                        "leaveEmployee"
                    ).value
                );


            const type =
                document.getElementById(
                    "leaveType"
                ).value;


            const start =
                document.getElementById(
                    "leaveStart"
                ).value;


            const end =
                document.getElementById(
                    "leaveEnd"
                ).value;


            const days =
                Number(
                    document.getElementById(
                        "leaveDays"
                    ).value
                );


            const description =
                document.getElementById(
                    "leaveDescription"
                ).value.trim();


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
                    e => e.id === employeeId
                );


            if (!employee) {
                return;
            }


            const request = {

                id: Date.now(),

                employeeId,

                employeeName:
                    employee.name,

                employeeCode:
                    employee.code,

                type,

                start,

                end,

                days,

                description,

                status: "pending",

                createdAt:
                    new Date().toISOString()

            };


            leaveRequests.unshift(
                request
            );


            saveJSON(
                "mirzaKhanLeaveRequests",
                leaveRequests
            );


            addNotification(
                "leave",
                "درخواست جدید ثبت شد",
                `${employee.name} درخواست ${getLeaveTypeText(type)} به مدت ${days} روز ثبت کرد.`,
                "info"
            );


            renderLeave();

            renderReports();

            closeLeaveRequestModal();


            alert(
                "درخواست با موفقیت ثبت شد."
            );

        }
    );

}


/* ==================================================
   LEAVE RENDER
================================================== */

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
        leaveRequests.filter(
            request => {

                const matchesSearch =

                    request.employeeName
                        .toLowerCase()
                        .includes(search)

                    ||

                    request.employeeCode
                        .toLowerCase()
                        .includes(search);


                const matchesType =

                    typeFilter === "all" ||

                    request.type ===
                    typeFilter;


                const matchesStatus =

                    statusFilter === "all" ||

                    request.status ===
                    statusFilter;


                const matchesDate =

                    !dateFilter ||

                    (
                        request.start <=
                        dateFilter &&

                        request.end >=
                        dateFilter
                    );


                return (

                    matchesSearch &&
                    matchesType &&
                    matchesStatus &&
                    matchesDate

                );

            }
        );


    updateLeaveStats();


    leaveTableBody.innerHTML = "";


    if (!filtered.length) {

        leaveTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-employees"
                >
                    هنوز درخواست مرخصی یا مأموریتی
                    برای نمایش وجود ندارد.
                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(request => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="employee-info">

                    <div class="employee-avatar">
                        ${escapeHTML(
                            request.employeeName
                                .charAt(0)
                        )}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                request.employeeName
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                request.employeeCode
                            )}
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${escapeHTML(
                    getLeaveTypeText(
                        request.type
                    )
                )}
            </td>


            <td>
                ${formatDate(request.start)}
            </td>


            <td>
                ${formatDate(request.end)}
            </td>


            <td>
                ${escapeHTML(
                    request.days
                )} روز
            </td>


            <td>
                ${escapeHTML(
                    request.description || "-"
                )}
            </td>


            <td>

                <span class="employee-status
                    ${
                        request.status === "approved"
                            ? "active"
                            : request.status === "rejected"
                                ? "inactive"
                                : ""
                    }"
                >

                    ${getLeaveStatusText(
                        request.status
                    )}

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
                                    class="action-btn"
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


        leaveTableBody.appendChild(
            row
        );

    });

}


/* ==================================================
   LEAVE STATS
================================================== */

function updateLeaveStats() {

    const total =
        leaveRequests.length;


    const pending =
        leaveRequests.filter(
            r => r.status === "pending"
        ).length;


    const approved =
        leaveRequests.filter(
            r => r.status === "approved"
        ).length;


    const rejected =
        leaveRequests.filter(
            r => r.status === "rejected"
        ).length;


    setText(
        "totalLeave",
        total
    );

    setText(
        "pendingLeave",
        pending
    );

    setText(
        "approvedLeave",
        approved
    );

    setText(
        "rejectedLeave",
        rejected
    );

}


/* ==================================================
   APPROVE LEAVE
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


    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
    );


    addNotification(
        "leave",
        "درخواست تأیید شد",
        `درخواست ${getLeaveTypeText(request.type)} برای ${request.employeeName} تأیید شد.`,
        "success"
    );


    renderLeave();

    renderReports();

}


/* ==================================================
   REJECT LEAVE
================================================== */

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


    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
    );


    addNotification(
        "leave",
        "درخواست رد شد",
        `درخواست ${getLeaveTypeText(request.type)} برای ${request.employeeName} رد شد.`,
        "warning"
    );


    renderLeave();

    renderReports();

}


/* ==================================================
   DELETE LEAVE
================================================== */

function deleteLeave(id) {

    const request =
        leaveRequests.find(
            r => r.id === id
        );


    if (!request) {
        return;
    }


    const confirmed =
        confirm(
            "آیا از حذف این درخواست مطمئن هستید؟"
        );


    if (!confirmed) {
        return;
    }


    leaveRequests =
        leaveRequests.filter(
            r => r.id !== id
        );


    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
    );


    renderLeave();

    renderReports();


    addNotification(
        "leave",
        "درخواست حذف شد",
        `درخواست ${request.employeeName} حذف شد.`,
        "warning"
    );

}


/* ==================================================
   LEAVE FILTER EVENTS
================================================== */

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
   REPORTS
================================================== */

function getReportData() {

    const totalEmployees =
        employees.length;


    const activeEmployees =
        employees.filter(
            e => e.status === "active"
        ).length;


    const inactiveEmployees =
        employees.filter(
            e => e.status === "inactive"
        ).length;


    const totalRequests =
        leaveRequests.length;


    const approvedRequests =
        leaveRequests.filter(
            r => r.status === "approved"
        ).length;


    const pendingRequests =
        leaveRequests.filter(
            r => r.status === "pending"
        ).length;


    const rejectedRequests =
        leaveRequests.filter(
            r => r.status === "rejected"
        ).length;


    return {

        totalEmployees,
        activeEmployees,
        inactiveEmployees,

        totalRequests,
        approvedRequests,
        pendingRequests,
        rejectedRequests

    };

}


function renderReports() {

    const data =
        getReportData();


    const reportIds = {

        reportTotalEmployees:
            data.totalEmployees,

        reportActiveEmployees:
            data.activeEmployees,

        reportInactiveEmployees:
            data.inactiveEmployees,

        reportTotalLeave:
            data.totalRequests,

        reportApprovedLeave:
            data.approvedRequests,

        reportPendingLeave:
            data.pendingRequests,

        reportRejectedLeave:
            data.rejectedRequests

    };


    Object.entries(
        reportIds
    ).forEach(
        ([id, value]) => {

            setText(
                id,
                value
            );

        }
    );

}


/* ==================================================
   REPORT EXPORT
================================================== */

function exportReport() {

    const data =
        getReportData();


    const lines = [

        "گزارش منابع انسانی شرکت میرزا کوچک خان",

        "================================",

        `تاریخ گزارش: ${formatDate(
            getTodayISO()
        )}`,

        "",

        "کارکنان",

        `کل کارکنان: ${data.totalEmployees}`,

        `کارکنان فعال: ${data.activeEmployees}`,

        `کارکنان غیرفعال: ${data.inactiveEmployees}`,

        "",

        "مرخصی و مأموریت",

        `کل درخواست‌ها: ${data.totalRequests}`,

        `در انتظار بررسی: ${data.pendingRequests}`,

        `تأیید شده: ${data.approvedRequests}`,

        `رد شده: ${data.rejectedRequests}`,

        "",

        "پایان گزارش"

    ];


    const blob =
        new Blob(
            [
                "\uFEFF" +
                lines.join("\n")
            ],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;


    link.download =
        `گزارش-منابع-انسانی-${getTodayISO()}.txt`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    addNotification(
        "report",
        "گزارش صادر شد",
        "گزارش منابع انسانی با موفقیت ایجاد شد.",
        "success"
    );

}


/* ==================================================
   REPORT BUTTON
================================================== */

const exportReportBtn =
    document.getElementById(
        "exportReportBtn"
    );


if (exportReportBtn) {

    exportReportBtn.addEventListener(
        "click",
        exportReport
    );

}


/* ==================================================
   NOTIFICATIONS
================================================== */

function addNotification(
    type,
    title,
    message,
    level = "info"
) {

    const notification = {

        id: Date.now() +
            Math.floor(
                Math.random() * 1000
            ),

        type,

        title,

        message,

        level,

        read: false,

        createdAt:
            new Date().toISOString()

    };


    notifications.unshift(
        notification
    );


    if (
        notifications.length >
        100
    ) {

        notifications =
            notifications.slice(
                0,
                100
            );

    }


    saveJSON(
        "mirzaKhanNotifications",
        notifications
    );


    updateNotificationBadge();


    if (
        document
            .getElementById(
                "notificationsPage"
            )
            ?.classList.contains(
                "active-page"
            )
    ) {

        renderNotifications();

    }

}


/* ==================================================
   NOTIFICATION ICON
================================================== */

function getNotificationIcon(
    type
) {

    const icons = {

        employee: "👤",
        attendance: "🕐",
        leave: "🏖️",
        report: "📊",
        system: "⚙️"

    };


    return icons[type] ||
        "🔔";

}


/* ==================================================
   NOTIFICATION DATE
================================================== */

function formatNotificationDate(
    date
) {

    if (!date) {
        return "";
    }


    const d =
        new Date(date);


    return d.toLocaleString(
        "fa-IR",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* ==================================================
   NOTIFICATION BADGE
================================================== */

function updateNotificationBadge() {

    const unread =
        notifications.filter(
            n => !n.read
        ).length;


    const menu =
        document.querySelector(
            '[data-page="notifications"]'
        );


    if (!menu) {
        return;
    }


    let badge =
        menu.querySelector(
            ".notification-badge"
        );


    if (unread === 0) {

        if (badge) {
            badge.remove();
        }

        return;

    }


    if (!badge) {

        badge =
            document.createElement(
                "span"
            );

        badge.className =
            "notification-badge";


        menu.appendChild(
            badge
        );

    }


    badge.textContent =
        unread > 99
            ? "99+"
            : unread;

}


/* ==================================================
   RENDER NOTIFICATIONS
================================================== */

function renderNotifications() {

    const page =
        document.getElementById(
            "notificationsPage"
        );


    if (!page) {
        return;
    }


    let container =
        document.getElementById(
            "notificationsList"
        );


    if (!container) {

        const panel =
            page.querySelector(
                ".dashboard-panel"
            );


        if (!panel) {
            return;
        }


        container =
            document.createElement(
                "div"
            );


        container.id =
            "notificationsList";


        panel.appendChild(
            container
        );

    }


    container.innerHTML = "";


    if (!notifications.length) {

        container.innerHTML = `

            <div class="notification-empty">

                🔔

                <h3>
                    اعلان جدیدی وجود ندارد
                </h3>

                <p>
                    اعلان‌های سیستم در این قسمت نمایش داده می‌شوند.
                </p>

            </div>

        `;

        updateNotificationBadge();

        return;

    }


    const controls =
        document.createElement(
            "div"
        );


    controls.className =
        "notification-controls";


    controls.innerHTML = `

        <button
            class="secondary-btn"
            onclick="markAllNotificationsRead()"
        >
            ✓ خواندن همه
        </button>

        <button
            class="secondary-btn"
            onclick="clearAllNotifications()"
        >
            🗑️ حذف همه
        </button>

    `;


    container.appendChild(
        controls
    );


    notifications.forEach(
        notification => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "notification-item" +

                (
                    notification.read
                        ? ""
                        : " unread"
                );


            item.innerHTML = `

                <div class="notification-icon">
                    ${getNotificationIcon(
                        notification.type
                    )}
                </div>


                <div class="notification-content">

                    <strong>
                        ${escapeHTML(
                            notification.title
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            notification.message
                        )}
                    </p>

                    <small>
                        ${formatNotificationDate(
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
                                    onclick="markNotificationRead(
                                        ${notification.id}
                                    )"
                                >
                                    ✓
                                </button>
                              `
                            : ""
                    }


                    <button
                        class="action-btn delete"
                        title="حذف"
                        onclick="deleteNotification(
                            ${notification.id}
                        )"
                    >
                        🗑️
                    </button>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );


    updateNotificationBadge();

}


/* ==================================================
   MARK NOTIFICATION READ
================================================== */

function markNotificationRead(id) {

    const notification =
        notifications.find(
            n => n.id === id
        );


    if (!notification) {
        return;
    }


    notification.read =
        true;


    saveJSON(
        "mirzaKhanNotifications",
        notifications
    );


    renderNotifications();

}


/* ==================================================
   MARK ALL READ
================================================== */

function markAllNotificationsRead() {

    notifications.forEach(
        notification => {

            notification.read =
                true;

        }
    );


    saveJSON(
        "mirzaKhanNotifications",
        notifications
    );


    renderNotifications();

}


/* ==================================================
   DELETE NOTIFICATION
================================================== */

function deleteNotification(id) {

    notifications =
        notifications.filter(
            n => n.id !== id
        );


    saveJSON(
        "mirzaKhanNotifications",
        notifications
    );


    renderNotifications();

}


/* ==================================================
   CLEAR NOTIFICATIONS
================================================== */

function clearAllNotifications() {

    if (!notifications.length) {
        return;
    }


    const confirmed =
        confirm(
            "آیا می‌خواهید همه اعلان‌ها حذف شوند؟"
        );


    if (!confirmed) {
        return;
    }


    notifications = [];


    saveJSON(
        "mirzaKhanNotifications",
        notifications
    );


    renderNotifications();

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

renderLeave();

renderReports();

updateNotificationBadge();


if (
    document
        .getElementById(
            "attendancePage"
        )
        ?.classList.contains(
            "active-page"
        )
) {

    initAttendance();

}


/* ==================================================
   GLOBAL FUNCTIONS
   برای onclick های داخل HTML
================================================== */

window.editEmployee =
    editEmployee;

window.deleteEmployee =
    deleteEmployee;

window.viewEmployee =
    viewEmployee;

window.changeAttendanceStatus =
    changeAttendanceStatus;

window.changeAttendanceTime =
    changeAttendanceTime;

window.setCurrentEntry =
    setCurrentEntry;

window.setCurrentExit =
    setCurrentExit;

window.clearAttendance =
    clearAttendance;

window.approveLeave =
    approveLeave;

window.rejectLeave =
    rejectLeave;

window.deleteLeave =
    deleteLeave;

window.markNotificationRead =
    markNotificationRead;

window.markAllNotificationsRead =
    markAllNotificationsRead;

window.deleteNotification =
    deleteNotification;

window.clearAllNotifications =
    clearAllNotifications;

window.exportReport =
    exportReport;


/* ==================================================
   END
================================================== */

console.log(
    "MIRZA KHAN HR | APP.JS VERSION 1.6 LOADED"
);
