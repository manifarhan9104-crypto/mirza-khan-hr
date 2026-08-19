/* ==================================================
   MIRZA KHAN HR
   APP.JS - VERSION 1.4

   امکانات:
   - داشبورد
   - مدیریت کارکنان
   - حضور و غیاب
   - مرخصی و مأموریت
   - جستجو و فیلتر
   - تأیید / رد درخواست
   - ویرایش / حذف
   - ذخیره دائمی در LocalStorage
================================================== */


/* ==================================================
   GLOBAL ELEMENTS
================================================== */

const menuItems =
    document.querySelectorAll(".menu-item");

const pages =
    document.querySelectorAll(".page");

const pageTitle =
    document.getElementById("pageTitle");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.getElementById("sidebar");

const todayDate =
    document.getElementById("todayDate");


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


let employees =
    loadJSON(
        "mirzaKhanEmployees",
        defaultEmployees
    );


/* ==================================================
   ATTENDANCE DATA
================================================== */

let attendanceData =
    loadJSON(
        "mirzaKhanAttendance",
        {}
    );


/* ==================================================
   LEAVE DATA
================================================== */

/*
leaveRequests = [

    {
        id: 123,
        employeeId: 1,
        type: "annual",
        start: "2026-08-20",
        end: "2026-08-22",
        days: 3,
        description: "...",
        status: "pending",
        createdAt: "..."
    }

]
*/

let leaveRequests =
    loadJSON(
        "mirzaKhanLeaveRequests",
        []
    );


/* ==================================================
   GENERAL FUNCTIONS
================================================== */

function loadJSON(
    key,
    fallback
) {

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


function saveJSON(
    key,
    data
) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


/* ==================================================
   DATE
================================================== */

function getTodayISO() {

    const now =
        new Date();

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


function setDate() {

    if (!todayDate) {

        return;

    }

    const now =
        new Date();

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

menuItems.forEach(
    item => {

        item.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                const page =
                    this.dataset.page;


                menuItems.forEach(
                    menu => {

                        menu.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


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


                pageTitle.textContent =
                    pageNames[page] ||
                    "داشبورد";


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

                    initLeave();

                }

            }

        );

    }
);


/* ==================================================
   MOBILE MENU
================================================== */

if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

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


let editingEmployeeId =
    null;


/* ==================================================
   SAVE EMPLOYEES
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


    employeesTableBody.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

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


    filtered.forEach(
        employee => {

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

                            ${escapeHTML(
                                firstLetter
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


            employeesTableBody.appendChild(
                row
            );

        }
    );


    updateSummary();

}


/* ==================================================
   ESCAPE HTML
================================================== */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ==================================================
   EMPLOYEE SUMMARY
================================================== */

function updateSummary() {

    const total =
        employees.length;


    const active =
        employees.filter(
            employee =>
                employee.status ===
                "active"
        ).length;


    const inactive =
        employees.filter(
            employee =>
                employee.status ===
                "inactive"
        ).length;


    const departments =
        new Set(
            employees.map(
                employee =>
                    employee.department
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
   SET TEXT
================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


/* ==================================================
   EMPLOYEE MODAL
================================================== */

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

        modalTitle.textContent =
            "ویرایش کارمند";


        setInput(
            "fullName",
            employee.name
        );

        setInput(
            "personnelCode",
            employee.code
        );

        setInput(
            "phone",
            employee.phone
        );

        setInput(
            "department",
            employee.department
        );

        setInput(
            "position",
            employee.position
        );

        setInput(
            "status",
            employee.status
        );

        setInput(
            "address",
            employee.address
        );


        editingEmployeeId =
            employee.id;

    } else {

        modalTitle.textContent =
            "افزودن کارمند";


        if (employeeForm) {

            employeeForm.reset();

        }


        editingEmployeeId =
            null;

    }

}


function setInput(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value || "";

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


    editingEmployeeId =
        null;

}


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


    if (modalTitle) {

        modalTitle.textContent =
            "افزودن کارمند";

    }

}


/* ==================================================
   EMPLOYEE BUTTONS
================================================== */

if (addEmployeeBtn) {

    addEmployeeBtn.addEventListener(
        "click",
        () => {

            openEmployeeModal();

        }
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
                () => {

                    openEmployeeModal();

                },
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


/* ==================================================
   SAVE EMPLOYEE
================================================== */

if (employeeForm) {

    employeeForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                getValue(
                    "fullName"
                ).trim();


            const code =
                getValue(
                    "personnelCode"
                ).trim();


            const phone =
                getValue(
                    "phone"
                ).trim();


            const department =
                getValue(
                    "department"
                );


            const position =
                getValue(
                    "position"
                ).trim();


            const status =
                getValue(
                    "status"
                );


            const address =
                getValue(
                    "address"
                ).trim();


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

            } else {

                employees.push({

                    id: Date.now(),

                    ...employeeData

                });

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
   GET VALUE
================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value
        : "";

}


/* ==================================================
   EDIT EMPLOYEE
================================================== */

function editEmployee(id) {

    const employee =
        employees.find(
            employee =>
                employee.id === id
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

}


/* ==================================================
   VIEW EMPLOYEE
================================================== */

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


    employeeModal.classList.add(
        "show"
    );


    if (employeeForm) {

        employeeForm.style.display =
            "none";

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

        profileView.classList.add(
            "show"
        );

    }


    setText(
        "profileAvatar",
        employee.name
            ? employee.name.charAt(0)
            : "م"
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


    return attendanceData[date][employeeId];

}


function saveAttendance() {

    saveJSON(
        "mirzaKhanAttendance",
        attendanceData
    );

}


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

        difference +=
            24 * 60;

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


function updateAttendanceStats(
    records
) {

    let present = 0;
    let late = 0;
    let absent = 0;
    let leave = 0;


    records.forEach(
        record => {

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

                leave++;

            }

            else {

                absent++;

            }

        }
    );


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
                employee.status ===
                "active"
        )
        .forEach(
            employee => {

                const record =
                    getAttendanceRecord(
                        employee.id,
                        date
                    );


                records.push({

                    employee,

                    record

                });

            }
        );


    updateAttendanceStats(
        records.map(
            item =>
                item.record
        )
    );


    const filtered =
        records.filter(
            item => {

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

                    statusFilter ===
                    "all"

                    ||

                    record.status ===
                    statusFilter;


                return (

                    matchesSearch &&
                    matchesStatus

                );

            }
        );


    attendanceTableBody.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

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


    filtered.forEach(
        item => {

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
                document.createElement(
                    "tr"
                );


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
                        onchange="
                            changeAttendanceStatus(
                                ${employee.id},
                                this.value
                            )
                        "
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
                        value="${record.exit || ""}"
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

                    ${formatMinutes(
                        workMinutes
                    )}

                </td>


                <td>

                    ${
                        record.status === "late"
                            ? `
                                <span
                                    class="attendance-late-text"
                                >
                                    تأخیر
                                </span>
                              `
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
                            onclick="
                                setCurrentEntry(
                                    ${employee.id}
                                )
                            "
                        >
                            🟢
                        </button>


                        <button
                            class="action-btn"
                            title="ثبت خروج"
                            onclick="
                                setCurrentExit(
                                    ${employee.id}
                                )
                            "
                        >
                            🔴
                        </button>


                        <button
                            class="action-btn"
                            title="پاک کردن"
                            onclick="
                                clearAttendance(
                                    ${employee.id}
                                )
                            "
                        >
                            ↺
                        </button>

                    </div>

                </td>

            `;


            attendanceTableBody.appendChild(
                row
            );

        }
    );

}


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

}


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
        record.status ===
        "absent"
    ) {

        record.status =
            "present";

    }


    saveAttendance();

    renderAttendance();

}


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
        record.status ===
        "absent"
    ) {

        record.status =
            "present";

    }


    saveAttendance();

    renderAttendance();

}


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

const addLeaveBtn =
    document.getElementById(
        "addLeaveBtn"
    );

const leaveModal =
    document.getElementById(
        "leaveModal"
    );

const closeLeaveModalBtn =
    document.getElementById(
        "closeLeaveModal"
    );

const cancelLeaveModal =
    document.getElementById(
        "cancelLeaveModal"
    );

const leaveForm =
    document.getElementById(
        "leaveForm"
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

const leaveTableBody =
    document.getElementById(
        "leaveTableBody"
    );


let editingLeaveId =
    null;


/* ==================================================
   LEAVE TEXT
================================================== */

function getLeaveTypeText(
    type
) {

    const types = {

        annual:
            "مرخصی استحقاقی",

        sick:
            "مرخصی استعلاجی",

        unpaid:
            "مرخصی بدون حقوق",

        mission:
            "مأموریت"

    };


    return types[type] ||
        "نامشخص";

}


function getLeaveStatusText(
    status
) {

    const statuses = {

        pending:
            "در انتظار بررسی",

        approved:
            "تأیید شده",

        rejected:
            "رد شده"

    };


    return statuses[status] ||
        "در انتظار بررسی";

}


/* ==================================================
   LEAVE DAYS CALCULATION
================================================== */

function calculateLeaveDays(
    start,
    end
) {

    if (!start || !end) {

        return 0;

    }


    const startDate =
        new Date(
            start + "T00:00:00"
        );

    const endDate =
        new Date(
            end + "T00:00:00"
        );


    if (
        Number.isNaN(
            startDate.getTime()
        ) ||
        Number.isNaN(
            endDate.getTime()
        )
    ) {

        return 0;

    }


    if (
        endDate < startDate
    ) {

        return 0;

    }


    const difference =
        endDate.getTime() -
        startDate.getTime();


    return (
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1
    );

}


/* ==================================================
   FORMAT DATE
================================================== */

function formatDate(
    date
) {

    if (!date) {

        return "-";

    }


    try {

        return new Intl.DateTimeFormat(
            "fa-IR"
        ).format(
            new Date(
                date + "T00:00:00"
            )
        );

    } catch {

        return date;

    }

}


/* ==================================================
   FIND EMPLOYEE
================================================== */

function getEmployeeById(
    id
) {

    return employees.find(
        employee =>
            employee.id === Number(id)
    );

}


/* ==================================================
   POPULATE EMPLOYEES
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
                employee.status ===
                "active"
        )
        .forEach(
            employee => {

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

            }
        );


    if (currentValue) {

        leaveEmployee.value =
            currentValue;

    }

}


/* ==================================================
   OPEN LEAVE MODAL
================================================== */

function openLeaveModal(
    request = null
) {

    if (!leaveModal) {

        return;

    }


    populateLeaveEmployees();


    leaveModal.classList.add(
        "show"
    );


    if (request) {

        editingLeaveId =
            request.id;


        const title =
            document.getElementById(
                "leaveModalTitle"
            );


        if (title) {

            title.textContent =
                "ویرایش درخواست";

        }


        setInput(
            "leaveEmployee",
            request.employeeId
        );

        setInput(
            "leaveType",
            request.type
        );

        setInput(
            "leaveStart",
            request.start
        );

        setInput(
            "leaveEnd",
            request.end
        );

        setInput(
            "leaveDays",
            request.days
        );

        setInput(
            "leaveDescription",
            request.description
        );

    } else {

        editingLeaveId =
            null;


        if (leaveForm) {

            leaveForm.reset();

        }


        const title =
            document.getElementById(
                "leaveModalTitle"
            );


        if (title) {

            title.textContent =
                "ثبت درخواست مرخصی";

        }

    }

}


/* ==================================================
   CLOSE LEAVE MODAL
================================================== */

function closeLeaveModal() {

    if (!leaveModal) {

        return;

    }


    leaveModal.classList.remove(
        "show"
    );


    if (leaveForm) {

        leaveForm.reset();

    }


    editingLeaveId =
        null;

}


/* ==================================================
   AUTO CALCULATE DAYS
================================================== */

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

        leaveDays.value =
            days;

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


/* ==================================================
   SAVE LEAVE
================================================== */

if (leaveForm) {

    leaveForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const employeeId =
                Number(
                    getValue(
                        "leaveEmployee"
                    )
                );


            const type =
                getValue(
                    "leaveType"
                );


            const start =
                getValue(
                    "leaveStart"
                );


            const end =
                getValue(
                    "leaveEnd"
                );


            const days =
                Number(
                    getValue(
                        "leaveDays"
                    )
                );


            const description =
                getValue(
                    "leaveDescription"
                ).trim();


            if (
                !employeeId ||
                !type ||
                !start ||
                !end ||
                !days
            ) {

                alert(
                    "لطفاً تمام اطلاعات الزامی را وارد کنید."
                );

                return;

            }


            if (end < start) {

                alert(
                    "تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد."
                );

                return;

            }


            if (days <= 0) {

                alert(
                    "تعداد روز باید بیشتر از صفر باشد."
                );

                return;

            }


            const employee =
                getEmployeeById(
                    employeeId
                );


            if (!employee) {

                alert(
                    "کارمند انتخاب‌شده پیدا نشد."
                );

                return;

            }


            const existing =
                leaveRequests.find(
                    request =>
                        request.id ===
                        editingLeaveId
                );


            const requestData = {

                employeeId,

                type,

                start,

                end,

                days,

                description

            };


            if (existing) {

                existing.employeeId =
                    requestData.employeeId;

                existing.type =
                    requestData.type;

                existing.start =
                    requestData.start;

                existing.end =
                    requestData.end;

                existing.days =
                    requestData.days;

                existing.description =
                    requestData.description;

            } else {

                leaveRequests.push({

                    id: Date.now(),

                    ...requestData,

                    status:
                        "pending",

                    createdAt:
                        new Date()
                            .toISOString()

                });

            }


            saveJSON(
                "mirzaKhanLeaveRequests",
                leaveRequests
            );


            renderLeave();

            updateLeaveSummary();

            closeLeaveModal();


            alert(
                existing
                    ? "درخواست با موفقیت ویرایش شد."
                    : "درخواست با موفقیت ثبت شد و در انتظار بررسی است."
            );

        }
    );

}


/* ==================================================
   RENDER LEAVE
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

                const employee =
                    getEmployeeById(
                        request.employeeId
                    );


                const employeeName =
                    employee
                        ? employee.name
                        : "کارمند حذف شده";


                const employeeCode =
                    employee
                        ? employee.code
                        : "";


                const matchesSearch =

                    employeeName
                        .toLowerCase()
                        .includes(search)

                    ||

                    employeeCode
                        .toLowerCase()
                        .includes(search);


                const matchesType =

                    typeFilter ===
                    "all"

                    ||

                    request.type ===
                    typeFilter;


                const matchesStatus =

                    statusFilter ===
                    "all"

                    ||

                    request.status ===
                    statusFilter;


                const matchesDate =

                    !dateFilter

                    ||

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


    leaveTableBody.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

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

        updateLeaveSummary();

        return;

    }


    filtered
        .sort(
            (a, b) =>
                b.id - a.id
        )
        .forEach(
            request => {

                const employee =
                    getEmployeeById(
                        request.employeeId
                    );


                const employeeName =
                    employee
                        ? employee.name
                        : "کارمند حذف شده";


                const employeeCode =
                    employee
                        ? employee.code
                        : "-";


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <div class="employee-info">

                            <div class="employee-avatar">

                                ${escapeHTML(
                                    employeeName.charAt(0)
                                )}

                            </div>

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        employeeName
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        employeeCode
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

                        ${formatDate(
                            request.start
                        )}

                    </td>


                    <td>

                        ${formatDate(
                            request.end
                        )}

                    </td>


                    <td>

                        ${request.days}
                        روز

                    </td>


                    <td>

                        ${escapeHTML(
                            request.description ||
                            "-"
                        )}

                    </td>


                    <td>

                        <span
                            class="employee-status
                            ${getLeaveStatusClass(
                                request.status
                            )}"
                        >

                            ${getLeaveStatusText(
                                request.status
                            )}

                        </span>

                    </td>


                    <td>

                        <div
                            class="action-buttons"
                        >

                            ${
                                request.status ===
                                "pending"
                                    ? `

                                        <button
                                            class="action-btn"
                                            title="تأیید"
                                            onclick="
                                                approveLeave(
                                                    ${request.id}
                                                )
                                            "
                                        >
                                            ✅
                                        </button>


                                        <button
                                            class="action-btn"
                                            title="رد"
                                            onclick="
                                                rejectLeave(
                                                    ${request.id}
                                                )
                                            "
                                        >
                                            ❌
                                        </button>

                                      `
                                    : ""
                            }


                            <button
                                class="action-btn"
                                title="ویرایش"
                                onclick="
                                    editLeave(
                                        ${request.id}
                                    )
                                "
                            >
                                ✏️
                            </button>


                            <button
                                class="action-btn delete"
                                title="حذف"
                                onclick="
                                    deleteLeave(
                                        ${request.id}
                                    )
                                "
                            >
                                🗑️
                            </button>

                        </div>

                    </td>

                `;


                leaveTableBody.appendChild(
                    row
                );

            }
        );


    updateLeaveSummary();

}


/* ==================================================
   LEAVE STATUS CLASS
================================================== */

function getLeaveStatusClass(
    status
) {

    if (
        status === "approved"
    ) {

        return "active";

    }


    if (
        status === "rejected"
    ) {

        return "inactive";

    }


    return "";

}


/* ==================================================
   LEAVE SUMMARY
================================================== */

function updateLeaveSummary() {

    const total =
        leaveRequests.length;


    const pending =
        leaveRequests.filter(
            request =>
                request.status ===
                "pending"
        ).length;


    const approved =
        leaveRequests.filter(
            request =>
                request.status ===
                "approved"
        ).length;


    const rejected =
        leaveRequests.filter(
            request =>
                request.status ===
                "rejected"
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

function approveLeave(
    id
) {

    const request =
        leaveRequests.find(
            item =>
                item.id === id
        );


    if (!request) {

        return;

    }


    const employee =
        getEmployeeById(
            request.employeeId
        );


    const name =
        employee
            ? employee.name
            : "این کارمند";


    const confirmed =
        confirm(
            `درخواست «${name}» تأیید شود؟`
        );


    if (!confirmed) {

        return;

    }


    request.status =
        "approved";


    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
    );


    renderLeave();


    alert(
        "درخواست با موفقیت تأیید شد."
    );

}


/* ==================================================
   REJECT LEAVE
================================================== */

function rejectLeave(
    id
) {

    const request =
        leaveRequests.find(
            item =>
                item.id === id
        );


    if (!request) {

        return;

    }


    const employee =
        getEmployeeById(
            request.employeeId
        );


    const name =
        employee
            ? employee.name
            : "این کارمند";


    const confirmed =
        confirm(
            `درخواست «${name}» رد شود؟`
        );


    if (!confirmed) {

        return;

    }


    request.status =
        "rejected";


    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
    );


    renderLeave();


    alert(
        "درخواست رد شد."
    );

}


/* ==================================================
   EDIT LEAVE
================================================== */

function editLeave(
    id
) {

    const request =
        leaveRequests.find(
            item =>
                item.id === id
        );


    if (!request) {

        return;

    }


    openLeaveModal(
        request
    );

}


/* ==================================================
   DELETE LEAVE
================================================== */

function deleteLeave(
    id
) {

    const request =
        leaveRequests.find(
            item =>
                item.id === id
        );


    if (!request) {

        return;

    }


    const employee =
        getEmployeeById(
            request.employeeId
        );


    const name =
        employee
            ? employee.name
            : "این درخواست";


    const confirmed =
        confirm(
            `آیا درخواست «${name}» حذف شود؟`
        );


    if (!confirmed) {

        return;

    }


    leaveRequests =
        leaveRequests.filter(
            item =>
                item.id !== id
        );


    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
    );


    renderLeave();

}


/* ==================================================
   LEAVE INIT
================================================== */

function initLeave() {

    populateLeaveEmployees();

    renderLeave();

    updateLeaveSummary();

}


/* ==================================================
   LEAVE EVENTS
================================================== */

if (addLeaveBtn) {

    addLeaveBtn.addEventListener(
        "click",
        () => {

            openLeaveModal();

        }
    );

}


if (closeLeaveModalBtn) {

    closeLeaveModalBtn.addEventListener(
        "click",
        closeLeaveModal
    );

}


if (cancelLeaveModal) {

    cancelLeaveModal.addEventListener(
        "click",
        closeLeaveModal
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

                closeLeaveModal();

            }

        }
    );

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

updateLeaveSummary();


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


if (
    document
        .getElementById(
            "leavePage"
        )
        ?.classList.contains(
            "active-page"
        )
) {

    initLeave();

}


/* ==================================================
   GLOBAL FUNCTIONS
   برای onclick های داخل جدول
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

window.editLeave =
    editLeave;

window.deleteLeave =
    deleteLeave;
