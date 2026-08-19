/* ==================================================
   MIRZA KHAN HR
   APP.JS - VERSION 1.5
   کارکنان + حضور و غیاب + مرخصی و مأموریت + گزارش‌ها
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
   GENERAL FUNCTIONS
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


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

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


            this.classList.add(
                "active"
            );


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


            pageTitle.textContent =
                pageNames[page] ||
                "داشبورد";


            sidebar.classList.remove(
                "open"
            );


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
   OPEN EMPLOYEE MODAL
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

        modalTitle.textContent =
            "افزودن کارمند";


        employeeForm.reset();


        editingEmployeeId = null;

    }

}


/* ==================================================
   CLOSE EMPLOYEE MODAL
================================================== */

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
   RESTORE PROFILE
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


/* ==================================================
   ADD EMPLOYEE EVENTS
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

            const menu =
                document.querySelector(
                    '[data-page="employees"]'
                );


            if (menu) {
                menu.click();
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


/* ==================================================
   EMPLOYEE MODAL BACKDROP
================================================== */

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


    return attendanceData[date][employeeId];

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
   CALCULATE WORK
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

                    item.record.status ===
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
                        record.status ===
                        "late"

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
   LEAVE HELPERS
================================================== */

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


    return types[type] ||
        type;

}


function getLeaveStatusText(status) {

    const statuses = {

        pending: "در انتظار بررسی",

        approved: "تأیید شده",

        rejected: "رد شده"

    };


    return statuses[status] ||
        status;

}


/* ==================================================
   LEAVE EMPLOYEE OPTIONS
================================================== */

function populateLeaveEmployees() {

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

    populateLeaveEmployees();

    renderLeave();

}


/* ==================================================
   LEAVE STATS
================================================== */

function updateLeaveStats() {

    const total =
        leaveRequests.length;


    const pending =
        leaveRequests.filter(
            item =>
                item.status ===
                "pending"
        ).length;


    const approved =
        leaveRequests.filter(
            item =>
                item.status ===
                "approved"
        ).length;


    const rejected =
        leaveRequests.filter(
            item =>
                item.status ===
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
   LEAVE RENDER
================================================== */

function renderLeave() {

    if (!leaveTableBody) {
        return;
    }


    updateLeaveStats();


    const search =
        leaveSearch
            ? leaveSearch.value
                .trim()
                .toLowerCase()
            : "";


    const type =
        leaveTypeFilter
            ? leaveTypeFilter.value
            : "all";


    const status =
        leaveStatusFilter
            ? leaveStatusFilter.value
            : "all";


    const date =
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
                            Number(
                                request.employeeId
                            )
                    );


                const employeeName =
                    employee
                        ? employee.name
                        : request.employeeName;


                const employeeCode =
                    employee
                        ? employee.code
                        : request.employeeCode;


                const matchesSearch =

                    !search ||

                    String(
                        employeeName || ""
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        employeeCode || ""
                    )
                    .toLowerCase()
                    .includes(search);


                const matchesType =

                    type === "all" ||

                    request.type ===
                    type;


                const matchesStatus =

                    status === "all" ||

                    request.status ===
                    status;


                const matchesDate =

                    !date ||

                    (
                        request.startDate <=
                        date &&

                        request.endDate >=
                        date
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


    if (filtered.length === 0) {

        leaveTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-employees"
                >

                    هنوز درخواست مورد نظر پیدا نشد.

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
                        Number(
                            request.employeeId
                        )
                );


            const employeeName =
                employee
                    ? employee.name
                    : request.employeeName;


            const employeeCode =
                employee
                    ? employee.code
                    : request.employeeCode;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div class="employee-info">

                        <div class="employee-avatar">

                            ${escapeHTML(
                                String(
                                    employeeName || "م"
                                ).charAt(0)
                            )}

                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    employeeName || "-"
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    employeeCode || "-"
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
                    ${escapeHTML(
                        request.startDate
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        request.endDate
                    )}
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

                    <span
                        class="employee-status
                        ${request.status}"
                    >

                        ${escapeHTML(
                            getLeaveStatusText(
                                request.status
                            )
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
                                    onclick="
                                        updateLeaveStatus(
                                            ${request.id},
                                            'approved'
                                        )
                                    "
                                >
                                    ✅
                                </button>


                                <button
                                    class="action-btn delete"
                                    title="رد"
                                    onclick="
                                        updateLeaveStatus(
                                            ${request.id},
                                            'rejected'
                                        )
                                    "
                                >
                                    ❌
                                </button>

                            `

                            : ""

                        }


                        <button
                            class="action-btn delete"
                            title="حذف"
                            onclick="
                                deleteLeaveRequest(
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

}


/* ==================================================
   OPEN LEAVE MODAL
================================================== */

function openLeaveRequestModal() {

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

}


/* ==================================================
   CLOSE LEAVE MODAL
================================================== */

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
   ADD LEAVE EVENT
================================================== */

if (addLeaveBtn) {

    addLeaveBtn.addEventListener(
        "click",
        openLeaveRequestModal
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


            const startDate =
                document.getElementById(
                    "leaveStart"
                ).value;


            const endDate =
                document.getElementById(
                    "leaveEnd"
                ).value;


            const days =
                document.getElementById(
                    "leaveDays"
                ).value;


            const description =
                document.getElementById(
                    "leaveDescription"
                ).value.trim();


            if (
                !employeeId ||
                !type ||
                !startDate ||
                !endDate ||
                !days
            ) {

                alert(
                    "لطفاً تمام اطلاعات الزامی را وارد کنید."
                );

                return;

            }


            if (endDate < startDate) {

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

                alert(
                    "کارمند انتخاب‌شده پیدا نشد."
                );

                return;

            }


            leaveRequests.push({

                id: Date.now(),

                employeeId,

                employeeName:
                    employee.name,

                employeeCode:
                    employee.code,

                type,

                startDate,

                endDate,

                days:
                    Number(days),

                description,

                status:
                    "pending",

                createdAt:
                    new Date().toISOString()

            });


            saveLeaveRequests();

            renderLeave();

            closeLeaveRequestModal();


            alert(
                "درخواست با موفقیت ثبت شد و در انتظار بررسی است."
            );

        }
    );

}


/* ==================================================
   LEAVE STATUS
================================================== */

function updateLeaveStatus(
    id,
    status
) {

    const request =
        leaveRequests.find(
            item =>
                item.id === id
        );


    if (!request) {
        return;
    }


    request.status =
        status;


    saveLeaveRequests();

    renderLeave();


    alert(
        status === "approved"
            ? "درخواست تأیید شد."
            : "درخواست رد شد."
    );

}


/* ==================================================
   DELETE LEAVE
================================================== */

function deleteLeaveRequest(id) {

    const request =
        leaveRequests.find(
            item =>
                item.id === id
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
            item =>
                item.id !== id
        );


    saveLeaveRequests();

    renderLeave();

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
   REPORTS
================================================== */

function getAllAttendanceRecords() {

    const result = [];


    Object.keys(
        attendanceData
    ).forEach(
        date => {

            const daily =
                attendanceData[date];


            Object.keys(daily).forEach(
                employeeId => {

                    const record =
                        daily[employeeId];


                    result.push({

                        date,

                        employeeId:
                            Number(employeeId),

                        ...record

                    });

                }
            );

        }
    );


    return result;

}


/* ==================================================
   REPORT SUMMARY
================================================== */

function calculateReportData() {

    const totalEmployees =
        employees.length;


    const activeEmployees =
        employees.filter(
            employee =>
                employee.status ===
                "active"
        ).length;


    const inactiveEmployees =
        employees.filter(
            employee =>
                employee.status ===
                "inactive"
        ).length;


    const attendanceRecords =
        getAllAttendanceRecords();


    const present =
        attendanceRecords.filter(
            record =>
                record.status ===
                "present"
        ).length;


    const late =
        attendanceRecords.filter(
            record =>
                record.status ===
                "late"
        ).length;


    const absent =
        attendanceRecords.filter(
            record =>
                record.status ===
                "absent"
        ).length;


    const attendanceLeave =
        attendanceRecords.filter(
            record =>
                record.status ===
                "leave"
        ).length;


    const totalLeaveRequests =
        leaveRequests.length;


    const approvedLeaves =
        leaveRequests.filter(
            request =>
                request.status ===
                "approved"
        ).length;


    const pendingLeaves =
        leaveRequests.filter(
            request =>
                request.status ===
                "pending"
        ).length;


    const rejectedLeaves =
        leaveRequests.filter(
            request =>
                request.status ===
                "rejected"
        ).length;


    const missions =
        leaveRequests.filter(
            request =>
                request.type ===
                "mission"
        ).length;


    return {

        totalEmployees,

        activeEmployees,

        inactiveEmployees,

        present,

        late,

        absent,

        attendanceLeave,

        totalLeaveRequests,

        approvedLeaves,

        pendingLeaves,

        rejectedLeaves,

        missions

    };

}


/* ==================================================
   RENDER REPORTS
================================================== */

function renderReports() {

    const reportData =
        calculateReportData();


    setText(
        "reportTotalEmployees",
        reportData.totalEmployees
    );


    setText(
        "reportActiveEmployees",
        reportData.activeEmployees
    );


    setText(
        "reportInactiveEmployees",
        reportData.inactiveEmployees
    );


    setText(
        "reportPresent",
        reportData.present
    );


    setText(
        "reportLate",
        reportData.late
    );


    setText(
        "reportAbsent",
        reportData.absent
    );


    setText(
        "reportLeave",
        reportData.attendanceLeave
    );


    setText(
        "reportTotalLeave",
        reportData.totalLeaveRequests
    );


    setText(
        "reportApprovedLeave",
        reportData.approvedLeaves
    );


    setText(
        "reportPendingLeave",
        reportData.pendingLeaves
    );


    setText(
        "reportRejectedLeave",
        reportData.rejectedLeaves
    );


    setText(
        "reportMissions",
        reportData.missions
    );


    renderDepartmentReport();

}


/* ==================================================
   DEPARTMENT REPORT
================================================== */

function renderDepartmentReport() {

    const container =
        document.getElementById(
            "departmentReport"
        );


    if (!container) {
        return;
    }


    const departments = {};


    employees.forEach(
        employee => {

            const department =
                employee.department ||
                "بدون واحد";


            if (!departments[department]) {

                departments[department] = {

                    total: 0,

                    active: 0,

                    inactive: 0

                };

            }


            departments[
                department
            ].total++;


            if (
                employee.status ===
                "active"
            ) {

                departments[
                    department
                ].active++;

            } else {

                departments[
                    department
                ].inactive++;

            }

        }
    );


    container.innerHTML =
        "";


    Object.keys(
        departments
    ).forEach(
        department => {

            const data =
                departments[
                    department
                ];


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "report-department-row";


            row.innerHTML = `

                <strong>
                    ${escapeHTML(
                        department
                    )}
                </strong>

                <span>
                    کل: ${data.total}
                </span>

                <span>
                    فعال: ${data.active}
                </span>

                <span>
                    غیرفعال: ${data.inactive}
                </span>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/* ==================================================
   EXPORT REPORT
================================================== */

function exportReports() {

    const data =
        calculateReportData();


    const reportText = `

گزارش منابع انسانی شرکت میرزا کوچک خان
=====================================

تعداد کل کارکنان:
${data.totalEmployees}

کارکنان فعال:
${data.activeEmployees}

کارکنان غیرفعال:
${data.inactiveEmployees}

-------------------------------------

حضور:
${data.present}

تأخیر:
${data.late}

غیبت:
${data.absent}

مرخصی در حضور و غیاب:
${data.attendanceLeave}

-------------------------------------

کل درخواست‌های مرخصی و مأموریت:
${data.totalLeaveRequests}

تأیید شده:
${data.approvedLeaves}

در انتظار بررسی:
${data.pendingLeaves}

رد شده:
${data.rejectedLeaves}

تعداد مأموریت:
${data.missions}

-------------------------------------

تاریخ گزارش:
${new Date().toLocaleDateString("fa-IR")}

`;


    const blob =
        new Blob(
            [reportText],
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


    link.href =
        url;


    link.download =
        "گزارش-منابع-انسانی-میرزا-کوچک-خان.txt";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
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

initLeave();


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
            "reportsPage"
        )
        ?.classList.contains(
            "active-page"
        )
) {

    renderReports();

}


/* ==================================================
   GLOBAL EXPORTS
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

window.updateLeaveStatus =
    updateLeaveStatus;

window.deleteLeaveRequest =
    deleteLeaveRequest;

window.exportReports =
    exportReports;
