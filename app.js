/* ==================================================
   MIRZA KHAN HR
   APP.JS - VERSION 1.4
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
   LEAVE / MISSION DATA
================================================== */

let leaveRequests =
    loadJSON(
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

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    } catch (error) {

        console.error(
            `خطا در ذخیره ${key}:`,
            error
        );

    }

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

                initLeave();

            }

        }
    );

});


/* ==================================================
   MOBILE MENU
================================================== */

if (
    mobileMenu &&
    sidebar
) {

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
   SET TEXT
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
   ==================================================
   EMPLOYEES
   ==================================================
================================================== */


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
   FILTER EMPLOYEES
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
                    کارمندی پیدا نشد.
                </td>

            </tr>

        `;

        updateSummary();

        return;
    }


    filtered.forEach(
        employee => {

            const row =
                document.createElement(
                    "tr"
                );


            const firstLetter =
                employee.name
                    ? employee.name.charAt(0)
                    : "م";


            const statusText =
                employee.status ===
                "active"
                    ? "فعال"
                    : "غیرفعال";


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

        if (modalTitle) {

            modalTitle.textContent =
                "ویرایش کارمند";

        }


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


    if (employeeForm) {

        employeeForm.reset();

    }


    editingEmployeeId = null;


    restoreProfileView();

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

            const menu =
                document.querySelector(
                    '[data-page="employees"]'
                );


            if (menu) {

                menu.click();

            }


            setTimeout(
                openEmployeeModal,
                100
            );

        }
    );

}


/* ==================================================
   EMPLOYEE FORM
================================================== */

if (employeeForm) {

    employeeForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                getInputValue(
                    "fullName"
                );


            const code =
                getInputValue(
                    "personnelCode"
                );


            const phone =
                getInputValue(
                    "phone"
                );


            const department =
                getInputValue(
                    "department"
                );


            const position =
                getInputValue(
                    "position"
                );


            const status =
                getInputValue(
                    "status"
                );


            const address =
                getInputValue(
                    "address"
                );


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

                        employee.code ===
                        code &&

                        employee.id !==
                        editingEmployeeId
                );


            if (duplicate) {

                alert(
                    "این کد پرسنلی قبلاً ثبت شده است."
                );

                return;

            }


            const data = {

                name,
                code,
                phone,
                department,
                position,
                status,
                address

            };


            if (
                editingEmployeeId !== null
            ) {

                employees =
                    employees.map(
                        employee =>

                            employee.id ===
                            editingEmployeeId

                                ? {
                                    ...employee,
                                    ...data
                                  }

                                : employee
                    );

                alert(
                    "اطلاعات کارمند ویرایش شد."
                );

            } else {

                employees.push({

                    id: Date.now(),

                    ...data

                });

                alert(
                    "کارمند جدید ثبت شد."
                );

            }


            saveEmployees();

            renderEmployees();

            updateSummary();

            closeEmployeeModal();

        }
    );

}


/* ==================================================
   EMPLOYEE ACTIONS
================================================== */

function getInputValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";

}


function editEmployee(id) {

    const employee =
        employees.find(
            employee =>
                employee.id === id
        );


    if (employee) {

        openEmployeeModal(
            employee
        );

    }

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


    const profileView =
        document.getElementById(
            "profileView"
        );


    if (profileView) {

        profileView.classList.add(
            "show"
        );

    }


    const header =
        document.querySelector(
            ".modal-header h3"
        );


    if (header) {

        header.textContent =
            "پرونده پرسنلی";

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
   EMPLOYEE EVENTS
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
   ==================================================
   ATTENDANCE
   ==================================================
================================================== */


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

    if (
        attendanceDate &&
        !attendanceDate.value
    ) {

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


    const id =
        String(employeeId);


    if (
        !attendanceData[date][id]
    ) {

        attendanceData[date][id] = {

            status: "absent",

            entry: "",

            exit: "",

            note: ""

        };


        saveAttendance();

    }


    return attendanceData[date][id];

}


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

    const list = {

        present: "حاضر",

        late: "تأخیر",

        absent: "غایب",

        leave: "مرخصی"

    };


    return (
        list[status] ||
        "غایب"
    );

}


/* ==================================================
   CALCULATE HOURS
================================================== */

function calculateMinutes(
    start,
    end
) {

    if (
        !start ||
        !end
    ) {

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
        a[0] * 60 +
        a[1];


    let endMinutes =
        b[0] * 60 +
        b[1];


    let result =
        endMinutes -
        startMinutes;


    if (result < 0) {

        result +=
            24 * 60;

    }


    return result;

}


function formatMinutes(
    minutes
) {

    if (!minutes) {
        return "-";
    }


    const hours =
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    return mins
        ? `${hours} ساعت و ${mins} دقیقه`
        : `${hours} ساعت`;

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


    const filter =
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

                const name =
                    String(
                        item.employee.name ||
                        ""
                    ).toLowerCase();


                const code =
                    String(
                        item.employee.code ||
                        ""
                    ).toLowerCase();


                const searchMatch =

                    name.includes(search) ||

                    code.includes(search);


                const statusMatch =

                    filter === "all" ||

                    item.record.status ===
                    filter;


                return (
                    searchMatch &&
                    statusMatch
                );

            }
        );


    attendanceTableBody.innerHTML =
        "";


    filtered.forEach(
        item => {

            const employee =
                item.employee;


            const record =
                item.record;


            const row =
                document.createElement(
                    "tr"
                );


            const minutes =
                calculateMinutes(
                    record.entry,
                    record.exit
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
                        minutes
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

                    ${getAttendanceStatusText(
                        record.status
                    )}

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="action-btn"
                            onclick="
                                setCurrentEntry(
                                    ${employee.id}
                                )
                            "
                            title="ثبت ورود"
                        >
                            🟢
                        </button>


                        <button
                            class="action-btn"
                            onclick="
                                setCurrentExit(
                                    ${employee.id}
                                )
                            "
                            title="ثبت خروج"
                        >
                            🔴
                        </button>


                        <button
                            class="action-btn"
                            onclick="
                                clearAttendance(
                                    ${employee.id}
                                )
                            "
                            title="پاک کردن"
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


    if (
        type !== "entry" &&
        type !== "exit"
    ) {

        return;

    }


    record[type] =
        value || "";


    if (
        value &&
        record.status ===
        "absent"
    ) {

        record.status =
            "present";

    }


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

    if (
        !confirm(
            "اطلاعات حضور این کارمند برای این روز پاک شود؟"
        )
    ) {

        return;

    }


    const date =
        getSelectedAttendanceDate();


    const id =
        String(employeeId);


    if (
        attendanceData[date]
    ) {

        delete attendanceData[
            date
        ][id];

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
        renderAttendance
    );

}


/* ==================================================
   ==================================================
   LEAVE & MISSION
   ==================================================
================================================== */


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


const leaveEmployee =
    document.getElementById(
        "leaveEmployee"
    );


const leaveRequestType =
    document.getElementById(
        "leaveRequestType"
    );


const leaveKind =
    document.getElementById(
        "leaveKind"
    );


const leaveKindWrapper =
    document.getElementById(
        "leaveKindWrapper"
    );


const leaveStartDate =
    document.getElementById(
        "leaveStartDate"
    );


const leaveEndDate =
    document.getElementById(
        "leaveEndDate"
    );


const leaveHoursWrapper =
    document.getElementById(
        "leaveHoursWrapper"
    );


const leaveStartTime =
    document.getElementById(
        "leaveStartTime"
    );


const leaveEndTime =
    document.getElementById(
        "leaveEndTime"
    );


const missionDestinationWrapper =
    document.getElementById(
        "missionDestinationWrapper"
    );


const missionDestination =
    document.getElementById(
        "missionDestination"
    );


const leaveDescription =
    document.getElementById(
        "leaveDescription"
    );


let editingLeaveId = null;


/* ==================================================
   SAVE LEAVE REQUESTS
================================================== */

function saveLeaveRequests() {

    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
    );

}


/* ==================================================
   INITIALIZE LEAVE
================================================== */

function initLeave() {

    populateLeaveEmployees();

    renderLeaveRequests();

    updateLeaveStats();

}


/* ==================================================
   EMPLOYEE SELECT
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

function openLeaveRequestModal(
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
            "leaveRequestType",
            request.type
        );


        setInput(
            "leaveKind",
            request.leaveKind
        );


        setInput(
            "leaveStartDate",
            request.startDate
        );


        setInput(
            "leaveEndDate",
            request.endDate
        );


        setInput(
            "leaveStartTime",
            request.startTime
        );


        setInput(
            "leaveEndTime",
            request.endTime
        );


        setInput(
            "missionDestination",
            request.destination
        );


        setInput(
            "leaveDescription",
            request.description
        );


        updateLeaveFormVisibility();

    } else {

        editingLeaveId =
            null;


        const title =
            document.getElementById(
                "leaveModalTitle"
            );


        if (title) {

            title.textContent =
                "ثبت درخواست";

        }


        if (leaveForm) {

            leaveForm.reset();

        }


        if (leaveStartDate) {

            leaveStartDate.value =
                getTodayISO();

        }


        if (leaveEndDate) {

            leaveEndDate.value =
                getTodayISO();

        }


        updateLeaveFormVisibility();

    }

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


    editingLeaveId =
        null;


    updateLeaveFormVisibility();

}


/* ==================================================
   FORM VISIBILITY
================================================== */

function updateLeaveFormVisibility() {

    const type =
        leaveRequestType
            ? leaveRequestType.value
            : "";


    const kind =
        leaveKind
            ? leaveKind.value
            : "daily";


    if (leaveKindWrapper) {

        leaveKindWrapper.style.display =
            type === "leave"
                ? ""
                : "none";

    }


    if (missionDestinationWrapper) {

        missionDestinationWrapper.style.display =
            type === "mission"
                ? ""
                : "none";

    }


    if (leaveHoursWrapper) {

        leaveHoursWrapper.style.display =

            type === "leave" &&
            kind === "hourly"

                ? "grid"

                : "none";

    }

}


/* ==================================================
   REQUEST TYPE EVENTS
================================================== */

if (leaveRequestType) {

    leaveRequestType.addEventListener(
        "change",
        updateLeaveFormVisibility
    );

}


if (leaveKind) {

    leaveKind.addEventListener(
        "change",
        updateLeaveFormVisibility
    );

}


/* ==================================================
   CALCULATE DAYS
================================================== */

function calculateLeaveDays(
    startDate,
    endDate
) {

    if (
        !startDate ||
        !endDate
    ) {

        return 0;

    }


    const start =
        new Date(
            `${startDate}T00:00:00`
        );


    const end =
        new Date(
            `${endDate}T00:00:00`
        );


    if (
        isNaN(start) ||
        isNaN(end)
    ) {

        return 0;

    }


    const difference =
        end.getTime() -
        start.getTime();


    if (
        difference < 0
    ) {

        return 0;

    }


    return (
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1
    );

}


/* ==================================================
   FORMAT REQUEST DURATION
================================================== */

function getRequestDuration(
    request
) {

    if (
        request.type ===
        "leave" &&
        request.leaveKind ===
        "hourly"
    ) {

        if (
            !request.startTime ||
            !request.endTime
        ) {

            return "-";

        }


        const minutes =
            calculateMinutes(
                request.startTime,
                request.endTime
            );


        if (!minutes) {
            return "-";
        }


        const hours =
            Math.floor(
                minutes / 60
            );


        const mins =
            minutes % 60;


        return mins
            ? `${hours} ساعت و ${mins} دقیقه`
            : `${hours} ساعت`;

    }


    const days =
        calculateLeaveDays(
            request.startDate,
            request.endDate
        );


    return days
        ? `${days} روز`
        : "-";

}


/* ==================================================
   REQUEST TYPE TEXT
================================================== */

function getRequestTypeText(
    type
) {

    return type === "mission"
        ? "مأموریت"
        : "مرخصی";

}


function getLeaveKindText(
    kind
) {

    const list = {

        daily: "روزانه",

        hourly: "ساعتی",

        medical: "استعلاجی",

        unpaid: "بدون حقوق"

    };


    return (
        list[kind] ||
        "-"
    );

}


/* ==================================================
   STATUS TEXT
================================================== */

function getLeaveStatusText(
    status
) {

    const list = {

        pending: "در انتظار",

        approved: "تأیید شده",

        rejected: "رد شده"

    };


    return (
        list[status] ||
        "در انتظار"
    );

}


/* ==================================================
   UPDATE LEAVE STATS
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
        "totalLeaveRequests",
        total
    );


    setText(
        "pendingLeaveRequests",
        pending
    );


    setText(
        "approvedLeaveRequests",
        approved
    );


    setText(
        "rejectedLeaveRequests",
        rejected
    );

}


/* ==================================================
   RENDER LEAVE REQUESTS
================================================== */

function renderLeaveRequests() {

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


    const filtered =
        leaveRequests.filter(
            request => {

                const employee =
                    employees.find(
                        employee =>
                            employee.id ==
                            request.employeeId
                    );


                const employeeName =
                    employee
                        ? String(
                            employee.name
                          ).toLowerCase()
                        : "";


                const employeeCode =
                    employee
                        ? String(
                            employee.code
                          ).toLowerCase()
                        : "";


                const matchesSearch =

                    employeeName.includes(
                        search
                    )

                    ||

                    employeeCode.includes(
                        search
                    );


                const matchesType =

                    typeFilter === "all" ||

                    request.type ===
                    typeFilter;


                const matchesStatus =

                    statusFilter === "all" ||

                    request.status ===
                    statusFilter;


                return (

                    matchesSearch &&
                    matchesType &&
                    matchesStatus

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

                    درخواستی برای نمایش وجود ندارد.

                </td>

            </tr>

        `;

        updateLeaveStats();

        return;

    }


    filtered.forEach(
        request => {

            const employee =
                employees.find(
                    employee =>
                        employee.id ==
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

                    <span>

                        ${getRequestTypeText(
                            request.type
                        )}

                    </span>

                </td>


                <td>

                    ${
                        request.type === "leave"

                            ? getLeaveKindText(
                                request.leaveKind
                              )

                            : "-"
                    }

                </td>


                <td>
                    ${escapeHTML(
                        request.startDate || "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        request.endDate || "-"
                    )}
                </td>


                <td>

                    ${getRequestDuration(
                        request
                    )}

                </td>


                <td>

                    <span
                        class="
                            leave-status
                            ${request.status}
                        "
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
                                        onclick="
                                            approveLeaveRequest(
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
                                            rejectLeaveRequest(
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
                                editLeaveRequest(
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


    updateLeaveStats();

}


/* ==================================================
   SAVE LEAVE FORM
================================================== */

if (leaveForm) {

    leaveForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const employeeId =
                leaveEmployee
                    ? leaveEmployee.value
                    : "";


            const type =
                leaveRequestType
                    ? leaveRequestType.value
                    : "";


            const kind =
                leaveKind
                    ? leaveKind.value
                    : "daily";


            const startDate =
                leaveStartDate
                    ? leaveStartDate.value
                    : "";


            const endDate =
                leaveEndDate
                    ? leaveEndDate.value
                    : "";


            const startTime =
                leaveStartTime
                    ? leaveStartTime.value
                    : "";


            const endTime =
                leaveEndTime
                    ? leaveEndTime.value
                    : "";


            const destination =
                missionDestination
                    ? missionDestination.value.trim()
                    : "";


            const description =
                leaveDescription
                    ? leaveDescription.value.trim()
                    : "";


            if (
                !employeeId ||
                !type ||
                !startDate ||
                !endDate
            ) {

                alert(
                    "لطفاً اطلاعات الزامی را تکمیل کنید."
                );

                return;

            }


            if (
                endDate <
                startDate
            ) {

                alert(
                    "تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد."
                );

                return;

            }


            if (
                type === "leave" &&
                kind === "hourly"
            ) {

                if (
                    !startTime ||
                    !endTime
                ) {

                    alert(
                        "برای مرخصی ساعتی، ساعت شروع و پایان را وارد کنید."
                    );

                    return;

                }


                if (
                    calculateMinutes(
                        startTime,
                        endTime
                    ) <= 0
                ) {

                    alert(
                        "ساعت پایان باید بعد از ساعت شروع باشد."
                    );

                    return;

                }

            }


            if (
                type === "mission" &&
                !destination
            ) {

                alert(
                    "لطفاً مقصد مأموریت را وارد کنید."
                );

                return;

            }


            const employee =
                employees.find(
                    item =>
                        item.id ==
                        employeeId
                );


            if (!employee) {

                alert(
                    "کارمند انتخاب شده پیدا نشد."
                );

                return;

            }


            const requestData = {

                employeeId:
                    Number(employeeId),

                type,

                leaveKind:
                    type === "leave"
                        ? kind
                        : "",

                startDate,

                endDate,

                startTime:
                    type === "leave" &&
                    kind === "hourly"
                        ? startTime
                        : "",

                endTime:
                    type === "leave" &&
                    kind === "hourly"
                        ? endTime
                        : "",

                destination:
                    type === "mission"
                        ? destination
                        : "",

                description,

                status: "pending"

            };


            if (
                editingLeaveId !==
                null
            ) {

                leaveRequests =
                    leaveRequests.map(
                        request => {

                            if (
                                request.id ===
                                editingLeaveId
                            ) {

                                return {

                                    ...request,

                                    ...requestData

                                };

                            }


                            return request;

                        }
                    );


                alert(
                    "درخواست با موفقیت ویرایش شد."
                );

            } else {

                leaveRequests.push({

                    id: Date.now(),

                    createdAt:
                        new Date()
                            .toISOString(),

                    ...requestData

                });


                alert(
                    "درخواست با موفقیت ثبت شد."
                );

            }


            saveLeaveRequests();

            renderLeaveRequests();

            updateLeaveStats();

            closeLeaveRequestModal();

        }
    );

}


/* ==================================================
   APPROVE REQUEST
================================================== */

function approveLeaveRequest(
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


    if (
        !confirm(
            "این درخواست تأیید شود؟"
        )
    ) {

        return;

    }


    request.status =
        "approved";


    request.updatedAt =
        new Date()
            .toISOString();


    saveLeaveRequests();

    renderLeaveRequests();

    updateLeaveStats();

}


/* ==================================================
   REJECT REQUEST
================================================== */

function rejectLeaveRequest(
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


    if (
        !confirm(
            "این درخواست رد شود؟"
        )
    ) {

        return;

    }


    request.status =
        "rejected";


    request.updatedAt =
        new Date()
            .toISOString();


    saveLeaveRequests();

    renderLeaveRequests();

    updateLeaveStats();

}


/* ==================================================
   EDIT REQUEST
================================================== */

function editLeaveRequest(
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


    openLeaveRequestModal(
        request
    );

}


/* ==================================================
   DELETE REQUEST
================================================== */

function deleteLeaveRequest(
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

    renderLeaveRequests();

    updateLeaveStats();

}


/* ==================================================
   LEAVE EVENTS
================================================== */

if (addLeaveBtn) {

    addLeaveBtn.addEventListener(
        "click",
        () => {

            openLeaveRequestModal();

        }
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


if (leaveSearch) {

    leaveSearch.addEventListener(
        "input",
        renderLeaveRequests
    );

}


if (leaveTypeFilter) {

    leaveTypeFilter.addEventListener(
        "change",
        renderLeaveRequests
    );

}


if (leaveStatusFilter) {

    leaveStatusFilter.addEventListener(
        "change",
        renderLeaveRequests
    );

}


/* ==================================================
   ==================================================
   CLOCK
   ==================================================
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


console.log(
    "MIRZA KHAN HR v1.4 loaded successfully."
);
