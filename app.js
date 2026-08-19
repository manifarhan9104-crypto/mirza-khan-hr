/* ==================================================
   MIRZA KHAN HR
   APP.JS - VERSION 1.2
   کارکنان + حضور و غیاب
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

/*
ساختار:

attendance = {
   "1405-05-28": {
       "employeeId": {
           status: "present",
           entry: "08:00",
           exit: "16:00",
           note: ""
       }
   }
}
*/

let attendanceData = loadJSON(
    "mirzaKhanAttendance",
    {}
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


            const employeesPage =
                document.getElementById(
                    "employeesPage"
                );


            if (page === "employees") {

                if (employeesPage) {
                    employeesPage.classList.add(
                        "active"
                    );
                }

                renderEmployees();

            } else {

                if (employeesPage) {
                    employeesPage.classList.remove(
                        "active"
                    );
                }

            }


            pageTitle.textContent =
                pageNames[page] ||
                "داشبورد";


            sidebar.classList.remove(
                "open"
            );


            if (page === "attendance") {

                initAttendance();

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
   SET TEXT
================================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


/* ==================================================
   OPEN EMPLOYEE MODAL
================================================== */

function openEmployeeModal(
    employee = null
) {

    if (!employeeModal) return;


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

    if (!employeeModal) return;

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
   RESTORE PROFILE VIEW
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


/* ==================================================
   MODAL BUTTONS
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


    if (!employee) return;


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


    if (!employee) return;


    const confirmed =
        confirm(
            `آیا از حذف «${employee.name}» مطمئن هستید؟`
        );


    if (!confirmed) return;


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
   VIEW EMPLOYEE PROFILE
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
   SEARCH EVENTS
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
   STATUS TEXT
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
   WORK HOURS
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

        difference += 24 * 60;

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

function updateAttendanceStats(
    records
) {

    let present = 0;
    let late = 0;
    let absent = 0;
    let leave = 0;


    records.forEach(record => {

        const status =
            record.status;


        if (status === "present") {
            present++;
        }

        else if (status === "late") {
            late++;
        }

        else if (status === "leave") {
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
                    .includes(search)

                ||

                employee.code
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                statusFilter === "all"

                ||

                record.status ===
                statusFilter;


            return (

                matchesSearch &&
                matchesStatus

            );

        });


    attendanceTableBody.innerHTML = "";


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


    filtered.forEach(item => {

        const employee =
            item.employee;


        const record =
            item.record;


        const statusText =
            getAttendanceStatusText(
                record.status
            );


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

                <span>
                    ${formatMinutes(
                        workMinutes
                    )}
                </span>

            </td>


            <td>

                ${
                    record.status === "late"
                        ? `<span class="attendance-late-text">
                            تأخیر
                           </span>`
                        : "-"
                }

            </td>


            <td>

                -

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

    });

}


/* ==================================================
   CHANGE STATUS
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
   CHANGE TIME
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

}


/* ==================================================
   SET EXIT
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
   ATTENDANCE SEARCH
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
   REGISTER ATTENDANCE BUTTON
================================================== */

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


// اگر بخش حضور و غیاب در صفحه فعال باشد
if (
    document
        .getElementById("attendancePage")
        ?.classList.contains(
            "active-page"
        )
) {

    initAttendance();

}
