/* ==================================================
   MIRZA KHAN HR
   APP.JS - VERSION 1.8
   سامانه جامع منابع انسانی و حضور و غیاب
   کارکنان + حضور و غیاب + مرخصی + مأموریت
   گزارش‌ها + اعلان‌ها + داشبورد حرفه‌ای
   آمار زنده + جستجو + فیلتر + ذخیره‌سازی
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
   VERSION
================================================== */

const APP_VERSION = "1.8";


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
   STORAGE DATA
================================================== */

let attendanceData = loadJSON(
    "mirzaKhanAttendance",
    {}
);

let leaveRequests = loadJSON(
    "mirzaKhanLeaveRequests",
    []
);

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

        const parsed =
            JSON.parse(data);

        return parsed ?? fallback;

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

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        return true;

    }

    catch (error) {

        console.error(
            `خطا در ذخیره ${key}:`,
            error
        );

        return false;

    }

}


/* ==================================================
   TEXT HELPERS
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
   DATE HELPERS
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


function formatDate(date) {

    if (!date) {
        return "-";
    }

    try {

        return new Date(date)
            .toLocaleDateString(
                "fa-IR"
            );

    }

    catch {
        return date;
    }

}


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
        formatter.format(
            new Date()
        );

}


setDate();


/* ==================================================
   PAGE NAVIGATION
================================================== */

function activatePage(page) {

    menuItems.forEach(menu => {

        menu.classList.toggle(
            "active",
            menu.dataset.page === page
        );

    });


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

        sidebar.classList.remove(
            "open"
        );

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


menuItems.forEach(item => {

    item.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            activatePage(
                this.dataset.page
            );

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
   EMPLOYEE STORAGE
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
                ).toLowerCase();


            const matchesSearch =
                !search ||
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


    if (filtered.length === 0) {

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
                        class="employee-status ${employee.status}"
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
   EMPLOYEE SUMMARY
================================================== */

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
            employees
                .map(
                    employee =>
                        employee.department
                )
                .filter(Boolean)
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

function openEmployeeModal(employee = null) {

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


        const fields = {

            fullName: employee.name,
            personnelCode: employee.code,
            phone: employee.phone,
            department: employee.department,
            position: employee.position,
            status: employee.status,
            address: employee.address

        };


        Object.entries(fields)
            .forEach(
                ([id, value]) => {

                    const input =
                        document.getElementById(
                            id
                        );

                    if (input) {
                        input.value =
                            value || "";
                    }

                }
            );


        editingEmployeeId =
            employee.id;

    }

    else {

        if (employeeForm) {
            employeeForm.reset();
        }


        if (modalTitle) {

            modalTitle.textContent =
                "افزودن کارمند";

        }


        editingEmployeeId =
            null;

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

            activatePage(
                "employees"
            );


            setTimeout(
                () => openEmployeeModal(),
                100
            );

        }
    );

}


/* ==================================================
   MODAL EVENTS
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
        event => {

            event.preventDefault();


            const getValue =
                id => {

                    const element =
                        document.getElementById(
                            id
                        );

                    return element
                        ? element.value.trim()
                        : "";

                };


            const name =
                getValue("fullName");

            const code =
                getValue("personnelCode");

            const phone =
                getValue("phone");

            const department =
                getValue("department");

            const position =
                getValue("position");

            const statusElement =
                document.getElementById(
                    "status"
                );

            const status =
                statusElement
                    ? statusElement.value
                    : "active";

            const address =
                getValue("address");


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

            }

            else {

                employees.push({

                    id:
                        Date.now(),

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


    if (
        !confirm(
            `آیا از حذف «${employee.name}» مطمئن هستید؟`
        )
    ) {

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

    renderDashboard();


    addNotification({

        type: "employee",

        title: "حذف کارمند",

        message:
            `کارمند ${employee.name} حذف شد.`,

        icon: "🗑️"

    });

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
   EMPLOYEE FILTER EVENTS
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

    if (attendanceDate) {

        if (!attendanceDate.value) {

            attendanceDate.value =
                getTodayISO();

        }

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


/* ==================================================
   TIME CALCULATIONS
================================================== */

function calculateMinutes(
    start,
    end
) {

    if (!start || !end) {
        return 0;
    }


    const startParts =
        start.split(":")
            .map(Number);


    const endParts =
        end.split(":")
            .map(Number);


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


/* ==================================================
   ATTENDANCE STATS
================================================== */

function updateAttendanceStats(
    records
) {

    let present = 0;
    let late = 0;
    let absent = 0;
    let leave = 0;


    records.forEach(
        record => {

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


                const name =
                    String(
                        employee.name || ""
                    ).toLowerCase();


                const code =
                    String(
                        employee.code || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    name.includes(search) ||
                    code.includes(search);


                const matchesStatus =
                    statusFilter === "all" ||
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


    if (filtered.length === 0) {

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
                        value="${escapeHTML(
                            record.entry || ""
                        )}"
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
                        value="${escapeHTML(
                            record.exit || ""
                        )}"
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


            attendanceTableBody.appendChild(
                row
            );

        }
    );

}


/* ==================================================
   ATTENDANCE ACTIONS
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

    renderDashboard();


    addNotification({

        type: "attendance",

        title:
            "تغییر وضعیت حضور",

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
        getAttendanceRecord(
            employeeId
        );


    record[type] =
        value;


    saveAttendance();

    renderAttendance();

    renderDashboard();

}


function getCurrentTime() {

    const now =
        new Date();


    return (

        String(
            now.getHours()
        ).padStart(2, "0") +

        ":" +

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

    renderDashboard();

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

    renderDashboard();

}


function clearAttendance(
    employeeId
) {

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

    renderDashboard();

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


/* ==================================================
   LEAVE STORAGE
================================================== */

function saveLeaveRequests() {

    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
    );

}


/* ==================================================
   LEAVE TEXT
================================================== */

function getLeaveTypeText(type) {

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


    return (
        types[type] ||
        "-"
    );

}


function getLeaveStatusText(status) {

    const statuses = {

        pending:
            "در انتظار بررسی",

        approved:
            "تأیید شده",

        rejected:
            "رد شده"

    };


    return (
        statuses[status] ||
        "-"
    );

}


/* ==================================================
   LEAVE CALCULATIONS
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
            `${start}T00:00:00`
        );


    const endDate =
        new Date(
            `${end}T00:00:00`
        );


    const difference =
        endDate -
        startDate;


    if (difference < 0) {
        return 0;
    }


    return (
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        ) + 1
    );

}


/* ==================================================
   LEAVE EMPLOYEES
================================================== */

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

}


/* ==================================================
   LEAVE INIT
================================================== */

function initLeave() {

    fillLeaveEmployees();

    renderLeave();

}


/* ==================================================
   OPEN LEAVE MODAL
================================================== */

function openLeaveModal() {

    if (!leaveModal) {
        return;
    }


    fillLeaveEmployees();


    leaveModal.classList.add(
        "show"
    );


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

        leaveDays.value =
            "1";

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
                    employees.find(
                        item =>
                            item.id ===
                            request.employeeId
                    );


                if (!employee) {
                    return false;
                }


                const name =
                    String(
                        employee.name || ""
                    ).toLowerCase();


                const code =
                    String(
                        employee.code || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    name.includes(search) ||
                    code.includes(search);


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


    leaveTableBody.innerHTML =
        "";


    if (filtered.length === 0) {

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


    filtered.forEach(
        request => {

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
                    ${getLeaveTypeText(
                        request.type
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        request.start
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        request.end
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        String(
                            request.days
                        )
                    )} روز
                </td>


                <td>
                    ${escapeHTML(
                        request.description ||
                        "-"
                    )}
                </td>


                <td>

                    <span
                        class="employee-status ${request.status}"
                    >
                        ${getLeaveStatusText(
                            request.status
                        )}
                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        ${
                            request.status ===
                            "pending"

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


            leaveTableBody.appendChild(
                row
            );

        }
    );

}


/* ==================================================
   LEAVE STATS
================================================== */

function updateLeaveStats() {

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
   LEAVE EVENTS
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
   LEAVE DAYS
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
                leaveDescription.value
                    .trim();


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
                        item.id ===
                        employeeId
                );


            if (!employee) {
                return;
            }


            const request = {

                id:
                    Date.now(),

                employeeId,

                type,

                start,

                end,

                days,

                description,

                status:
                    "pending",

                createdAt:
                    new Date()
                        .toISOString()

            };


            leaveRequests.unshift(
                request
            );


            saveLeaveRequests();

            renderLeave();

            renderDashboard();

            closeLeaveRequestModal();


            addNotification({

                type:
                    "leave",

                title:
                    "درخواست جدید",

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


/* ==================================================
   APPROVE LEAVE
================================================== */

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

    renderDashboard();


    addNotification({

        type:
            "leave",

        title:
            "درخواست تأیید شد",

        message:
            `${employee ? employee.name : "کارمند"} - ${getLeaveTypeText(request.type)} تأیید شد.`,

        icon:
            "✅"

    });


    alert(
        "درخواست با موفقیت تأیید شد."
    );

}


/* ==================================================
   REJECT LEAVE
================================================== */

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

    renderDashboard();


    addNotification({

        type:
            "leave",

        title:
            "درخواست رد شد",

        message:
            `${employee ? employee.name : "کارمند"} - ${getLeaveTypeText(request.type)} رد شد.`,

        icon:
            "❌"

    });


    alert(
        "درخواست رد شد."
    );

}


/* ==================================================
   DELETE LEAVE
================================================== */

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

    renderDashboard();

}


/* ==================================================
   LEAVE FILTERS
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

        id:
            Date.now() +
            Math.floor(
                Math.random() * 1000
            ),

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

        read:
            false,

        createdAt:
            new Date()
                .toISOString()

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


    saveNotifications();

    updateNotificationBadge();

}


/* ==================================================
   NOTIFICATION TIME
================================================== */

function getNotificationTime(
    date
) {

    if (!date) {
        return "";
    }


    const created =
        new Date(date);


    const now =
        new Date();


    const difference =
        Math.floor(
            (
                now -
                created
            ) / 1000
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


/* ==================================================
   NOTIFICATION BADGE
================================================== */

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


    const notificationMenu =
        document.querySelector(
            '[data-page="notifications"]'
        );


    if (!notificationMenu) {
        return;
    }


    let menuBadge =
        notificationMenu.querySelector(
            ".notification-menu-badge"
        );


    if (unread > 0) {

        if (!menuBadge) {

            menuBadge =
                document.createElement(
                    "span"
                );


            menuBadge.className =
                "notification-menu-badge";


            notificationMenu.appendChild(
                menuBadge
            );

        }


        menuBadge.textContent =
            unread;

    }

    else {

        if (menuBadge) {
            menuBadge.remove();
        }

    }

}


/* ==================================================
   RENDER NOTIFICATIONS
================================================== */

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


    container.innerHTML =
        "";


    if (notifications.length === 0) {

        if (empty) {
            empty.style.display =
                "block";
        }


        updateNotificationBadge();

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    notifications.forEach(
        notification => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                `notification-item ${
                    notification.read
                        ? "read"
                        : "unread"
                }`;


            item.innerHTML = `

                <div class="notification-icon">
                    ${escapeHTML(
                        notification.icon
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


            container.appendChild(
                item
            );

        }
    );


    updateNotificationBadge();

}


/* ==================================================
   NOTIFICATION ACTIONS
================================================== */

function markNotificationRead(id) {

    const notification =
        notifications.find(
            item =>
                item.id === id
        );


    if (!notification) {
        return;
    }


    notification.read =
        true;


    saveNotifications();

    renderNotifications();

    renderDashboard();

}


function markAllNotificationsRead() {

    notifications.forEach(
        notification => {

            notification.read =
                true;

        }
    );


    saveNotifications();

    renderNotifications();

    renderDashboard();

}


function deleteNotification(id) {

    notifications =
        notifications.filter(
            notification =>
                notification.id !== id
        );


    saveNotifications();

    renderNotifications();

    renderDashboard();

}


function clearAllNotifications() {

    if (
        notifications.length ===
        0
    ) {

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

    renderDashboard();

}


/* ==================================================
   NOTIFICATION BUTTONS
================================================== */

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
   REPORTS
================================================== */

function getTodayAttendanceStats() {

    const date =
        getTodayISO();


    let present = 0;
    let late = 0;
    let absent = 0;
    let leave = 0;


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


    return {

        present,

        late,

        absent,

        leave

    };

}


/* ==================================================
   RENDER REPORTS
================================================== */

function renderReports() {

    const totalEmployees =
        employees.length;


    const activeEmployees =
        employees.filter(
            employee =>
                employee.status ===
                "active"
        ).length;


    const totalRequests =
        leaveRequests.length;


    const pendingRequests =
        leaveRequests.filter(
            request =>
                request.status ===
                "pending"
        ).length;


    const approvedRequests =
        leaveRequests.filter(
            request =>
                request.status ===
                "approved"
        ).length;


    const rejectedRequests =
        leaveRequests.filter(
            request =>
                request.status ===
                "rejected"
        ).length;


    setText(
        "reportTotalEmployees",
        totalEmployees
    );


    setText(
        "reportActiveEmployees",
        activeEmployees
    );


    setText(
        "reportTotalLeaves",
        totalRequests
    );


    setText(
        "reportPendingLeaves",
        pendingRequests
    );


    setText(
        "reportApprovedLeaves",
        approvedRequests
    );


    setText(
        "reportRejectedLeaves",
        rejectedRequests
    );

}


/* ==================================================
   DASHBOARD
================================================== */

function renderDashboard() {

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
            employees
                .map(
                    employee =>
                        employee.department
                )
                .filter(Boolean)
        ).size;


    const attendance =
        getTodayAttendanceStats();


    const present =
        attendance.present;


    const late =
        attendance.late;


    const absent =
        attendance.absent;


    const leave =
        attendance.leave;


    const attendanceRate =
        active > 0

            ? Math.round(
                (
                    (
                        present +
                        late
                    ) /
                    active
                ) * 100
            )

            : 0;


    const pendingLeave =
        leaveRequests.filter(
            request =>
                request.status ===
                "pending"
        ).length;


    const approvedLeave =
        leaveRequests.filter(
            request =>
                request.status ===
                "approved"
        ).length;


    const unreadNotifications =
        notifications.filter(
            notification =>
                !notification.read
        ).length;


    /* ------------------------------------------
       MAIN
    ------------------------------------------ */

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


    /* ------------------------------------------
       ATTENDANCE
    ------------------------------------------ */

    setText(
        "dashboardPresent",
        present
    );


    setText(
        "dashboardLate",
        late
    );


    setText(
        "dashboardAbsent",
        absent
    );


    setText(
        "dashboardLeave",
        leave
    );


    setText(
        "dashboardAttendanceRate",
        `${attendanceRate}%`
    );


    /* ------------------------------------------
       LEAVE
    ------------------------------------------ */

    setText(
        "dashboardPendingLeave",
        pendingLeave
    );


    setText(
        "dashboardApprovedLeave",
        approvedLeave
    );


    /* ------------------------------------------
       NOTIFICATIONS
    ------------------------------------------ */

    setText(
        "dashboardNotifications",
        unreadNotifications
    );


    /* ------------------------------------------
       PROGRESS
    ------------------------------------------ */

    document
        .querySelectorAll(
            "[data-dashboard-progress]"
        )
        .forEach(
            bar => {

                const target =
                    bar.dataset
                        .dashboardProgress;


                if (
                    target ===
                    "attendance"
                ) {

                    bar.style.width =
                        `${attendanceRate}%`;

                }


                if (
                    target ===
                    "active"
                ) {

                    const activeRate =
                        total > 0
                            ? Math.round(
                                (
                                    active /
                                    total
                                ) * 100
                            )
                            : 0;


                    bar.style.width =
                        `${activeRate}%`;

                }

            }
        );


    renderDashboardRecentActivity();

}


/* ==================================================
   DASHBOARD ACTIVITY
================================================== */

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
            .slice(0, 10)
            .map(
                notification => ({

                    type:
                        notification.type,

                    title:
                        notification.title,

                    message:
                        notification.message,

                    icon:
                        notification.icon,

                    date:
                        notification.createdAt

                })
            );


    activities.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    container.innerHTML =
        "";


    if (activities.length === 0) {

        container.innerHTML = `

            <div class="empty-employees">
                هنوز فعالیتی ثبت نشده است.
            </div>

        `;

        return;

    }


    activities
        .slice(0, 5)
        .forEach(
            activity => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "dashboard-activity-item";


                item.innerHTML = `

                    <div class="notification-icon">

                        ${escapeHTML(
                            activity.icon
                        )}

                    </div>


                    <div>

                        <strong>
                            ${escapeHTML(
                                activity.title
                            )}
                        </strong>


                        <p>
                            ${escapeHTML(
                                activity.message
                            )}
                        </p>


                        <small>
                            ${getNotificationTime(
                                activity.date
                            )}
                        </small>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

}


/* ==================================================
   EXPORT HR REPORT
================================================== */

function exportHRReport() {

    const attendance =
        getTodayAttendanceStats();


    const report = {

        system:
            "سامانه جامع منابع انسانی میرزا کوچک خان",

        version:
            APP_VERSION,

        generatedAt:
            new Date()
                .toLocaleString(
                    "fa-IR"
                ),


        employees: {

            total:
                employees.length,

            active:
                employees.filter(
                    employee =>
                        employee.status ===
                        "active"
                ).length,

            inactive:
                employees.filter(
                    employee =>
                        employee.status ===
                        "inactive"
                ).length

        },


        todayAttendance: {

            date:
                getTodayISO(),

            present:
                attendance.present,

            late:
                attendance.late,

            absent:
                attendance.absent,

            leave:
                attendance.leave

        },


        leaveRequests: {

            total:
                leaveRequests.length,

            pending:
                leaveRequests.filter(
                    request =>
                        request.status ===
                        "pending"
                ).length,

            approved:
                leaveRequests.filter(
                    request =>
                        request.status ===
                        "approved"
                ).length,

            rejected:
                leaveRequests.filter(
                    request =>
                        request.status ===
                        "rejected"
                ).length

        }

    };


    const json =
        JSON.stringify(
            report,
            null,
            4
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json;charset=utf-8"
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


    link.href =
        url;


    link.download =
        `mirza-khan-hr-report-${getTodayISO()}.json`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    addNotification({

        type:
            "report",

        title:
            "گزارش خروجی گرفته شد",

        message:
            "گزارش آماری سامانه با موفقیت ایجاد شد.",

        icon:
            "📊"

    });

}


/* ==================================================
   REPORT BUTTONS
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


/* ==================================================
   SETTINGS - VERSION 1.8
================================================== */

function initializeSettings() {

    const versionElement =
        document.getElementById(
            "appVersion"
        );


    if (versionElement) {

        versionElement.textContent =
            `نسخه ${APP_VERSION}`;

    }

}


initializeSettings();


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
                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit"
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
   AUTO REFRESH
================================================== */

setInterval(
    () => {

        renderDashboard();

        updateSummary();

        updateNotificationBadge();

        setDate();

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
            "mirzaKhanEmployees"
        ) {

            employees =
                loadJSON(
                    "mirzaKhanEmployees",
                    defaultEmployees
                );


            renderEmployees();

            updateSummary();

            renderDashboard();

        }


        if (
            event.key ===
            "mirzaKhanAttendance"
        ) {

            attendanceData =
                loadJSON(
                    "mirzaKhanAttendance",
                    {}
                );


            renderAttendance();

            renderDashboard();

        }


        if (
            event.key ===
            "mirzaKhanLeaveRequests"
        ) {

            leaveRequests =
                loadJSON(
                    "mirzaKhanLeaveRequests",
                    []
                );


            renderLeave();

            renderDashboard();

            renderReports();

        }


        if (
            event.key ===
            "mirzaKhanNotifications"
        ) {

            notifications =
                loadJSON(
                    "mirzaKhanNotifications",
                    []
                );


            renderNotifications();

            renderDashboard();

        }

    }
);


/* ==================================================
   KEYBOARD SHORTCUTS - VERSION 1.8
================================================== */

document.addEventListener(
    "keydown",
    event => {

        /*
         Ctrl + K
         باز کردن جستجوی کارکنان
        */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();


            activatePage(
                "employees"
            );


            if (employeeSearch) {

                employeeSearch.focus();

            }

        }


        /*
         Escape
         بستن مودال‌ها
        */

        if (
            event.key ===
            "Escape"
        ) {

            closeEmployeeModal();

            closeLeaveRequestModal();

        }

    }
);


/* ==================================================
   INITIALIZE APPLICATION
================================================== */

renderEmployees();

updateSummary();

initAttendance();

initLeave();

renderReports();

updateNotificationBadge();

renderNotifications();

renderDashboard();


/* ==================================================
   DEFAULT SYSTEM NOTIFICATION
================================================== */

if (
    notifications.length ===
    0
) {

    addNotification({

        type:
            "system",

        title:
            "خوش آمدید",

        message:
            "به سامانه جامع منابع انسانی میرزا کوچک خان خوش آمدید.",

        icon:
            "👋"

    });


    renderNotifications();

    renderDashboard();

}


/* ==================================================
   VERSION INFO
================================================== */

console.log(
    "========================================"
);

console.log(
    "MIRZA KHAN HR"
);

console.log(
    `APP.JS VERSION ${APP_VERSION}`
);

console.log(
    "Dashboard: ACTIVE"
);

console.log(
    "Employees: ACTIVE"
);

console.log(
    "Attendance: ACTIVE"
);

console.log(
    "Leave & Mission: ACTIVE"
);

console.log(
    "Reports: ACTIVE"
);

console.log(
    "Notifications: ACTIVE"
);

console.log(
    "Keyboard Shortcuts: ACTIVE"
);

console.log(
    "Responsive UI Support: ACTIVE"
);

console.log(
    "========================================"
);
