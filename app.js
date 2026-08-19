/* ==================================================
   MIRZA KHAN HR
   APP.JS - VERSION 2.0
   کارکنان + حضور و غیاب + مرخصی و مأموریت
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

/*
leaveRequests = [
    {
        id: 1,
        employeeId: 1,
        type: "annual",
        startDate: "2026-08-20",
        endDate: "2026-08-22",
        days: 3,
        reason: "امور شخصی",
        status: "pending",
        createdAt: "..."
    }
]
*/

let leaveRequests = loadJSON(
    "mirzaKhanLeaveRequests",
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


function setDate() {

    if (!todayDate) return;

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

            const page =
                this.dataset.page;

            menuItems.forEach(menu => {

                menu.classList.remove(
                    "active"
                );

            });

            this.classList.add("active");


            pages.forEach(pageElement => {

                pageElement.classList.remove(
                    "active-page"
                );

                pageElement.classList.remove(
                    "active"
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


            sidebar?.classList.remove(
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

            sidebar?.classList.toggle(
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

                <td colspan="6"
                    class="empty-employees">

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

                <span class="employee-status ${employee.status}">

                    ${statusText}

                </span>

            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn"
                        onclick="viewEmployee(${employee.id})">

                        👁

                    </button>


                    <button
                        class="action-btn"
                        onclick="editEmployee(${employee.id})">

                        ✏️

                    </button>


                    <button
                        class="action-btn delete"
                        onclick="deleteEmployee(${employee.id})">

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
   EMPLOYEE MODAL
================================================== */

function openEmployeeModal(employee = null) {

    if (!employeeModal) return;

    employeeModal.classList.add("show");

    restoreProfileView();


    if (employee) {

        modalTitle.textContent =
            "ویرایش کارمند";


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

        modalTitle.textContent =
            "افزودن کارمند";

        employeeForm?.reset();

        editingEmployeeId = null;

    }

}


function closeEmployeeModal() {

    if (!employeeModal) return;

    employeeModal.classList.remove("show");

    restoreProfileView();

    employeeForm?.reset();

    editingEmployeeId = null;

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


    profileView?.classList.remove("show");


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
   ADD EMPLOYEE
================================================== */

addEmployeeBtn?.addEventListener(
    "click",
    () => openEmployeeModal()
);


dashboardAddEmployee?.addEventListener(
    "click",
    () => {

        document
            .querySelector(
                '[data-page="employees"]'
            )
            ?.click();

        setTimeout(
            () => openEmployeeModal(),
            100
        );

    }
);


closeModal?.addEventListener(
    "click",
    closeEmployeeModal
);


cancelModal?.addEventListener(
    "click",
    closeEmployeeModal
);


/* ==================================================
   SAVE EMPLOYEE
================================================== */

employeeForm?.addEventListener(
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


/* ==================================================
   EDIT EMPLOYEE
================================================== */

function editEmployee(id) {

    const employee =
        employees.find(
            employee =>
                employee.id === id
        );


    if (!employee) return;

    openEmployeeModal(employee);

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


    if (!employee) return;


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


    employeeModal.classList.add("show");


    if (employeeForm) {

        employeeForm.style.display =
            "none";

    }


    document
        .querySelector(".modal-header h3")
        ?.replaceChildren(
            document.createTextNode(
                "پرونده پرسنلی"
            )
        );


    document
        .getElementById("profileView")
        ?.classList.add("show");


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

employeeSearch?.addEventListener(
    "input",
    renderEmployees
);

departmentFilter?.addEventListener(
    "change",
    renderEmployees
);

statusFilter?.addEventListener(
    "change",
    renderEmployees
);


employeeModal?.addEventListener(
    "click",
    event => {

        if (
            event.target === employeeModal
        ) {

            closeEmployeeModal();

        }

    }
);


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

    if (!attendanceDate) return;


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
   ATTENDANCE SAVE
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

function getAttendanceStatusText(status) {

    const statuses = {

        present: "حاضر",
        late: "تأخیر",
        absent: "غایب",
        leave: "مرخصی"

    };


    return statuses[status] || "غایب";

}


/* ==================================================
   CALCULATE WORK HOURS
================================================== */

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
        Math.floor(minutes / 60);


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

        } else if (record.status === "late") {

            late++;

        } else if (record.status === "leave") {

            leave++;

        } else {

            absent++;

        }

    });


    setText("presentCount", present);
    setText("lateCount", late);
    setText("absentCount", absent);
    setText("leaveCount", leave);

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
        records.map(
            item =>
                item.record
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

                statusFilter === "all" ||

                record.status ===
                statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    attendanceTableBody.innerHTML = "";


    if (!filtered.length) {

        attendanceTableBody.innerHTML = `

            <tr>

                <td colspan="8"
                    class="empty-employees">

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


        attendanceTableBody.appendChild(row);

    });

}


/* ==================================================
   CHANGE ATTENDANCE STATUS
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


/* ==================================================
   CHANGE ATTENDANCE TIME
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
   SET ENTRY
================================================== */

function setCurrentEntry(employeeId) {

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

}


/* ==================================================
   SET EXIT
================================================== */

function setCurrentExit(employeeId) {

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

}


/* ==================================================
   CLEAR ATTENDANCE
================================================== */

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


/* ==================================================
   ATTENDANCE EVENTS
================================================== */

attendanceSearch?.addEventListener(
    "input",
    renderAttendance
);

attendanceStatusFilter?.addEventListener(
    "change",
    renderAttendance
);

attendanceDate?.addEventListener(
    "change",
    renderAttendance
);


openAttendanceModal?.addEventListener(
    "click",
    () => {

        renderAttendance();

        alert(
            "وضعیت کارکنان از جدول حضور و غیاب قابل ثبت و ویرایش است."
        );

    }
);


/* ==================================================
   LEAVE ELEMENTS
================================================== */

const leaveTableBody =
    document.getElementById(
        "leaveTableBody"
    );

const leaveSearch =
    document.getElementById(
        "leaveSearch"
    );

const leaveStatusFilter =
    document.getElementById(
        "leaveStatusFilter"
    );

const leaveTypeFilter =
    document.getElementById(
        "leaveTypeFilter"
    );

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


/* ==================================================
   LEAVE TYPE TEXT
================================================== */

function getLeaveTypeText(type) {

    const types = {

        annual: "مرخصی سالانه",

        sick: "مرخصی استعلاجی",

        unpaid: "مرخصی بدون حقوق",

        mission: "مأموریت",

        hourly: "مرخصی ساعتی"

    };


    return types[type] || type;

}


/* ==================================================
   LEAVE STATUS TEXT
================================================== */

function getLeaveStatusText(status) {

    const statuses = {

        pending: "در انتظار بررسی",

        approved: "تأیید شده",

        rejected: "رد شده",

        cancelled: "لغو شده"

    };


    return statuses[status] || status;

}


/* ==================================================
   CALCULATE DAYS
================================================== */

function calculateLeaveDays(
    startDate,
    endDate
) {

    if (!startDate || !endDate) {
        return 0;
    }


    const start =
        new Date(
            startDate + "T00:00:00"
        );


    const end =
        new Date(
            endDate + "T00:00:00"
        );


    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
    ) {

        return 0;

    }


    if (end < start) {
        return 0;
    }


    const difference =
        end.getTime() -
        start.getTime();


    return (
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1
    );

}


/* ==================================================
   LEAVE INIT
================================================== */

function initLeave() {

    renderLeave();

    updateLeaveStats();

}


/* ==================================================
   LEAVE STATS
================================================== */

function updateLeaveStats() {

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


    const total =
        leaveRequests.length;


    setText(
        "pendingLeaveCount",
        pending
    );

    setText(
        "approvedLeaveCount",
        approved
    );

    setText(
        "rejectedLeaveCount",
        rejected
    );

    setText(
        "totalLeaveCount",
        total
    );

}


/* ==================================================
   SAVE LEAVE
================================================== */

function saveLeaveRequests() {

    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
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


    const statusFilter =
        leaveStatusFilter
            ? leaveStatusFilter.value
            : "all";


    const typeFilter =
        leaveTypeFilter
            ? leaveTypeFilter.value
            : "all";


    const filtered =
        leaveRequests.filter(request => {

            const employee =
                employees.find(
                    employee =>
                        employee.id ===
                        request.employeeId
                );


            const employeeName =
                employee?.name || "";


            const employeeCode =
                employee?.code || "";


            const matchesSearch =

                employeeName
                    .toLowerCase()
                    .includes(search)

                ||

                employeeCode
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                statusFilter === "all" ||

                request.status ===
                statusFilter;


            const matchesType =

                typeFilter === "all" ||

                request.type ===
                typeFilter;


            return (

                matchesSearch &&
                matchesStatus &&
                matchesType

            );

        });


    leaveTableBody.innerHTML = "";


    if (!filtered.length) {

        leaveTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-employees"
                >

                    هنوز درخواست مرخصی یا
                    مأموریتی ثبت نشده است.

                </td>

            </tr>

        `;

        updateLeaveStats();

        return;

    }


    filtered
        .slice()
        .sort(
            (a, b) =>
                b.id - a.id
        )
        .forEach(request => {

            const employee =
                employees.find(
                    employee =>
                        employee.id ===
                        request.employeeId
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="employee-info">

                        <div class="employee-avatar">

                            ${escapeHTML(
                                employee?.name
                                    ?.charAt(0) ||
                                "م"
                            )}

                        </div>

                        <div>

                            <strong>

                                ${escapeHTML(
                                    employee?.name ||
                                    "کارمند حذف‌شده"
                                )}

                            </strong>

                            <span>

                                ${escapeHTML(
                                    employee?.code ||
                                    "-"
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

                    ${request.days || 0}

                    روز

                </td>


                <td>

                    ${escapeHTML(
                        request.reason || "-"
                    )}

                </td>


                <td>

                    <span class="employee-status ${request.status}">

                        ${getLeaveStatusText(
                            request.status
                        )}

                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        ${
                            request.status === "pending"

                            ?

                            `

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
                                class="action-btn delete"
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

                            :

                            ""

                        }


                        <button
                            class="action-btn"
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


            leaveTableBody.appendChild(row);

        });


    updateLeaveStats();

}


/* ==================================================
   OPEN LEAVE MODAL
================================================== */

function openLeaveModal() {

    if (!leaveModal) return;

    leaveModal.classList.add("show");

    leaveForm?.reset();


    const startDate =
        document.getElementById(
            "leaveStartDate"
        );


    const endDate =
        document.getElementById(
            "leaveEndDate"
        );


    if (startDate) {

        startDate.value =
            getTodayISO();

    }


    if (endDate) {

        endDate.value =
            getTodayISO();

    }

}


/* ==================================================
   CLOSE LEAVE MODAL
================================================== */

function closeLeaveModalFunc() {

    leaveModal?.classList.remove(
        "show"
    );

    leaveForm?.reset();

}


addLeaveBtn?.addEventListener(
    "click",
    openLeaveModal
);


closeLeaveModalBtn?.addEventListener(
    "click",
    closeLeaveModalFunc
);


cancelLeaveModal?.addEventListener(
    "click",
    closeLeaveModalFunc
);


/* ==================================================
   LEAVE FORM
================================================== */

leaveForm?.addEventListener(
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
                "leaveStartDate"
            ).value;


        const endDate =
            document.getElementById(
                "leaveEndDate"
            ).value;


        const reason =
            document.getElementById(
                "leaveReason"
            ).value.trim();


        if (
            !employeeId ||
            !type ||
            !startDate ||
            !endDate
        ) {

            alert(
                "لطفاً تمام اطلاعات الزامی را وارد کنید."
            );

            return;

        }


        const days =
            calculateLeaveDays(
                startDate,
                endDate
            );


        if (days <= 0) {

            alert(
                "تاریخ پایان باید بعد از تاریخ شروع باشد."
            );

            return;

        }


        const employee =
            employees.find(
                employee =>
                    employee.id ===
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

            type,

            startDate,

            endDate,

            days,

            reason,

            status: "pending",

            createdAt:
                new Date().toISOString()

        });


        saveLeaveRequests();

        renderLeave();

        closeLeaveModalFunc();


        alert(
            "درخواست مرخصی با موفقیت ثبت شد و در انتظار بررسی است."
        );

    }
);


/* ==================================================
   APPROVE LEAVE
================================================== */

function approveLeave(id) {

    const request =
        leaveRequests.find(
            request =>
                request.id === id
        );


    if (!request) return;


    request.status =
        "approved";


    saveLeaveRequests();

    renderLeave();


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
            request =>
                request.id === id
        );


    if (!request) return;


    if (
        !confirm(
            "آیا می‌خواهید این درخواست را رد کنید؟"
        )
    ) {

        return;

    }


    request.status =
        "rejected";


    saveLeaveRequests();

    renderLeave();


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
            request =>
                request.id === id
        );


    if (!request) return;


    if (
        !confirm(
            "آیا این درخواست حذف شود؟"
        )
    ) {

        return;

    }


    leaveRequests =
        leaveRequests.filter(
            request =>
                request.id !== id
        );


    saveLeaveRequests();

    renderLeave();

}


/* ==================================================
   LEAVE SEARCH
================================================== */

leaveSearch?.addEventListener(
    "input",
    renderLeave
);


leaveStatusFilter?.addEventListener(
    "change",
    renderLeave
);


leaveTypeFilter?.addEventListener(
    "change",
    renderLeave
);


/* ==================================================
   LEAVE MODAL BACKDROP
================================================== */

leaveModal?.addEventListener(
    "click",
    event => {

        if (
            event.target === leaveModal
        ) {

            closeLeaveModalFunc();

        }

    }
);


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

updateLeaveStats();


if (
    document
        .getElementById("attendancePage")
        ?.classList.contains(
            "active-page"
        )
) {

    initAttendance();

}


if (
    document
        .getElementById("leavePage")
        ?.classList.contains(
            "active-page"
        )
) {

    initLeave();

}
