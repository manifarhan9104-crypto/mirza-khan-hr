"use strict";

/* =========================================================
   MIRZA KHAN HR
   Human Resources & Attendance Management
   Version 2.0
========================================================= */

const STORAGE_KEYS = {
    employees: "mirza_khan_employees",
    attendance: "mirza_khan_attendance",
    leaves: "mirza_khan_leaves",
    notifications: "mirza_khan_notifications",
    activities: "mirza_khan_activities"
};


/* =========================================================
   STATE
========================================================= */

let employees = [];
let attendanceRecords = [];
let leaveRequests = [];
let notifications = [];
let activities = [];

let editingEmployeeId = null;


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadData();

    initializeDate();

    bindNavigation();

    bindHeader();

    bindEmployeeEvents();

    bindAttendanceEvents();

    bindLeaveEvents();

    bindNotificationEvents();

    bindReportEvents();

    renderAll();

});


/* =========================================================
   STORAGE
========================================================= */

function loadData() {

    employees = getStorage(STORAGE_KEYS.employees, []);

    attendanceRecords = getStorage(
        STORAGE_KEYS.attendance,
        []
    );

    leaveRequests = getStorage(
        STORAGE_KEYS.leaves,
        []
    );

    notifications = getStorage(
        STORAGE_KEYS.notifications,
        []
    );

    activities = getStorage(
        STORAGE_KEYS.activities,
        []
    );

}


function saveData() {

    localStorage.setItem(
        STORAGE_KEYS.employees,
        JSON.stringify(employees)
    );

    localStorage.setItem(
        STORAGE_KEYS.attendance,
        JSON.stringify(attendanceRecords)
    );

    localStorage.setItem(
        STORAGE_KEYS.leaves,
        JSON.stringify(leaveRequests)
    );

    localStorage.setItem(
        STORAGE_KEYS.notifications,
        JSON.stringify(notifications)
    );

    localStorage.setItem(
        STORAGE_KEYS.activities,
        JSON.stringify(activities)
    );

}


function getStorage(key, fallback) {

    try {

        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "Storage error:",
            error
        );

        return fallback;
    }

}


/* =========================================================
   HELPERS
========================================================= */

function generateId(prefix = "id") {

    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("fa-IR");

}


function todayISO() {

    const date = new Date();

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function showToast(message, type = "success") {

    let toast = document.getElementById(
        "systemToast"
    );

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "systemToast";

        toast.style.position = "fixed";
        toast.style.bottom = "25px";
        toast.style.left = "25px";
        toast.style.zIndex = "99999";
        toast.style.padding = "14px 20px";
        toast.style.borderRadius = "12px";
        toast.style.color = "#fff";
        toast.style.fontFamily = "Vazirmatn, sans-serif";
        toast.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.2)";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.style.background =
        type === "error"
            ? "#dc2626"
            : type === "warning"
                ? "#d97706"
                : "#0f766e";

    toast.style.display = "block";

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {

        toast.style.display = "none";

    }, 3000);

}


/* =========================================================
   DATE
========================================================= */

function initializeDate() {

    const todayDate = document.getElementById(
        "todayDate"
    );

    const attendanceDate =
        document.getElementById(
            "attendanceDate"
        );

    if (todayDate) {

        todayDate.textContent =
            new Date().toLocaleDateString(
                "fa-IR",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

    }

    if (attendanceDate) {
        attendanceDate.value = todayISO();
    }

}


/* =========================================================
   NAVIGATION
========================================================= */

const pageTitles = {

    dashboard: "داشبورد",
    employees: "کارکنان",
    attendance: "حضور و غیاب",
    leave: "مرخصی و مأموریت",
    reports: "گزارش‌ها",
    notifications: "اعلان‌ها",
    settings: "تنظیمات"

};


function bindNavigation() {

    document
        .querySelectorAll(".menu-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const page =
                        item.dataset.page;

                    navigateToPage(page);

                    closeMobileSidebar();

                }
            );

        });

}


function navigateToPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove(
                "active-page"
            );

        });


    const target =
        document.getElementById(
            `${page}Page`
        );


    if (!target) {
        return;
    }


    target.classList.add(
        "active-page"
    );


    document
        .querySelectorAll(".menu-item")
        .forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.page === page
            );

        });


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );

    if (pageTitle) {

        pageTitle.textContent =
            pageTitles[page] ||
            "سامانه منابع انسانی";

    }


    if (page === "dashboard") {
        renderDashboard();
    }

    if (page === "employees") {
        renderEmployees();
    }

    if (page === "attendance") {
        renderAttendance();
    }

    if (page === "leave") {
        renderLeaves();
    }

    if (page === "reports") {
        renderReports();
    }

    if (page === "notifications") {
        renderNotifications();
    }

}


/* =========================================================
   HEADER / MOBILE
========================================================= */

function bindHeader() {

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    const sidebarOverlay =
        document.getElementById(
            "sidebarOverlay"
        );

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );

    const dashboardNotificationsButton =
        document.getElementById(
            "dashboardNotificationsButton"
        );


    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            openMobileSidebar
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeMobileSidebar
        );

    }


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => navigateToPage(
                "notifications"
            )
        );

    }


    if (dashboardNotificationsButton) {

        dashboardNotificationsButton.addEventListener(
            "click",
            () => navigateToPage(
                "notifications"
            )
        );

    }

}


function openMobileSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );

    if (sidebar) {
        sidebar.classList.add("open");
    }

    if (overlay) {
        overlay.classList.add("active");
    }

}


function closeMobileSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );

    if (sidebar) {
        sidebar.classList.remove("open");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

}


/* =========================================================
   EMPLOYEES
========================================================= */

function bindEmployeeEvents() {

    const addButton =
        document.getElementById(
            "addEmployeeBtn"
        );

    const dashboardAdd =
        document.getElementById(
            "dashboardAddEmployee"
        );

    const closeButton =
        document.getElementById(
            "closeModal"
        );

    const cancelButton =
        document.getElementById(
            "cancelModal"
        );

    const profileClose =
        document.getElementById(
            "closeProfileBtn"
        );

    const form =
        document.getElementById(
            "employeeForm"
        );

    const search =
        document.getElementById(
            "employeeSearch"
        );

    const department =
        document.getElementById(
            "departmentFilter"
        );

    const status =
        document.getElementById(
            "statusFilter"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            () => openEmployeeModal()
        );

    }


    if (dashboardAdd) {

        dashboardAdd.addEventListener(
            "click",
            () => openEmployeeModal()
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeEmployeeModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeEmployeeModal
        );

    }


    if (profileClose) {

        profileClose.addEventListener(
            "click",
            closeEmployeeModal
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            saveEmployee
        );

    }


    [search, department, status]
        .forEach(element => {

            if (element) {

                element.addEventListener(
                    "input",
                    renderEmployees
                );

                element.addEventListener(
                    "change",
                    renderEmployees
                );

            }

        });

}


function openEmployeeModal(
    employeeId = null
) {

    const modal =
        document.getElementById(
            "employeeModal"
        );

    const form =
        document.getElementById(
            "employeeForm"
        );

    const profile =
        document.getElementById(
            "profileView"
        );

    const title =
        document.getElementById(
            "modalTitle"
        );


    if (!modal) {
        return;
    }


    editingEmployeeId =
        employeeId;


    if (employeeId) {

        const employee =
            employees.find(
                item =>
                    item.id === employeeId
            );

        if (!employee) {
            return;
        }


        title.textContent =
            "ویرایش کارمند";


        setInputValue(
            "fullName",
            employee.fullName
        );

        setInputValue(
            "personnelCode",
            employee.personnelCode
        );

        setInputValue(
            "phone",
            employee.phone
        );

        setInputValue(
            "department",
            employee.department
        );

        setInputValue(
            "position",
            employee.position
        );

        setInputValue(
            "status",
            employee.status
        );

        setInputValue(
            "address",
            employee.address
        );


    } else {

        title.textContent =
            "افزودن کارمند";

        form.reset();

        setInputValue(
            "status",
            "active"
        );

    }


    form.style.display = "grid";
    profile.style.display = "none";

    modal.classList.add("active");

}


function closeEmployeeModal() {

    const modal =
        document.getElementById(
            "employeeModal"
        );

    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

    editingEmployeeId = null;

}


function setInputValue(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {
        element.value =
            value ?? "";
    }

}


function saveEmployee(event) {

    event.preventDefault();


    const fullName =
        document.getElementById(
            "fullName"
        ).value.trim();

    const personnelCode =
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


    if (!fullName ||
        !personnelCode ||
        !department) {

        showToast(
            "لطفاً اطلاعات ضروری را تکمیل کنید.",
            "error"
        );

        return;
    }


    const duplicate =
        employees.some(
            employee =>
                employee.personnelCode === personnelCode &&
                employee.id !== editingEmployeeId
        );


    if (duplicate) {

        showToast(
            "این کد پرسنلی قبلاً ثبت شده است.",
            "error"
        );

        return;
    }


    if (editingEmployeeId) {

        const employee =
            employees.find(
                item =>
                    item.id === editingEmployeeId
            );

        if (employee) {

            employee.fullName =
                fullName;

            employee.personnelCode =
                personnelCode;

            employee.phone =
                phone;

            employee.department =
                department;

            employee.position =
                position;

            employee.status =
                status;

            employee.address =
                address;

            employee.updatedAt =
                new Date().toISOString();

        }


        addActivity(
            `اطلاعات کارمند «${fullName}» ویرایش شد.`
        );

        addNotification(
            "ویرایش کارمند",
            `اطلاعات ${fullName} با موفقیت ویرایش شد.`,
            "info"
        );


        showToast(
            "اطلاعات کارمند با موفقیت ویرایش شد."
        );


    } else {

        const employee = {

            id: generateId("emp"),

            fullName,

            personnelCode,

            phone,

            department,

            position,

            status,

            address,

            createdAt:
                new Date().toISOString()

        };


        employees.push(employee);


        addActivity(
            `کارمند جدید «${fullName}» ثبت شد.`
        );

        addNotification(
            "کارمند جدید",
            `کارمند ${fullName} به سامانه اضافه شد.`,
            "success"
        );


        showToast(
            "کارمند با موفقیت ثبت شد."
        );

    }


    saveData();

    closeEmployeeModal();

    renderAll();

}


function renderEmployees() {

    const body =
        document.getElementById(
            "employeesTableBody"
        );

    if (!body) {
        return;
    }


    const search =
        document.getElementById(
            "employeeSearch"
        )?.value
            .trim()
            .toLowerCase() || "";


    const department =
        document.getElementById(
            "departmentFilter"
        )?.value || "all";


    const status =
        document.getElementById(
            "statusFilter"
        )?.value || "all";


    const filtered =
        employees.filter(employee => {

            const matchesSearch =
                !search ||
                employee.fullName
                    .toLowerCase()
                    .includes(search) ||
                employee.personnelCode
                    .toLowerCase()
                    .includes(search) ||
                (employee.phone || "")
                    .includes(search);


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


    body.innerHTML = "";


    if (!filtered.length) {

        body.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:30px;">
                    هیچ کارمندی پیدا نشد.
                </td>
            </tr>
        `;

        updateEmployeeSummary();

        return;
    }


    filtered.forEach(employee => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(employee.fullName)}
                </strong>

                <small>
                    ${escapeHTML(employee.personnelCode)}
                </small>
            </td>

            <td>
                ${escapeHTML(employee.department)}
            </td>

            <td>
                ${escapeHTML(employee.position || "-")}
            </td>

            <td>
                ${escapeHTML(employee.phone || "-")}
            </td>

            <td>
                <span class="status-badge ${employee.status}">
                    ${
                        employee.status === "active"
                            ? "فعال"
                            : "غیرفعال"
                    }
                </span>
            </td>

            <td>

                <button
                    class="secondary-btn"
                    type="button"
                    onclick="viewEmployee('${employee.id}')"
                >
                    👁️
                </button>

                <button
                    class="secondary-btn"
                    type="button"
                    onclick="editEmployee('${employee.id}')"
                >
                    ✏️
                </button>

                <button
                    class="danger-btn"
                    type="button"
                    onclick="deleteEmployee('${employee.id}')"
                >
                    🗑️
                </button>

            </td>
        `;


        body.appendChild(row);

    });


    updateEmployeeSummary();

}


function updateEmployeeSummary() {

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

}


function viewEmployee(id) {

    const employee =
        employees.find(
            item => item.id === id
        );

    if (!employee) {
        return;
    }


    const modal =
        document.getElementById(
            "employeeModal"
        );

    const form =
        document.getElementById(
            "employeeForm"
        );

    const profile =
        document.getElementById(
            "profileView"
        );


    form.style.display = "none";
    profile.style.display = "block";


    setText(
        "profileAvatar",
        employee.fullName
            ? employee.fullName.charAt(0)
            : "م"
    );

    setText(
        "profileName",
        employee.fullName
    );

    setText(
        "profilePosition",
        employee.position || "-"
    );

    setText(
        "profileCode",
        employee.personnelCode
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


    modal.classList.add("active");

}


function editEmployee(id) {

    openEmployeeModal(id);

}


function deleteEmployee(id) {

    const employee =
        employees.find(
            item => item.id === id
        );

    if (!employee) {
        return;
    }


    const confirmed =
        confirm(
            `آیا از حذف «${employee.fullName}» مطمئن هستید؟`
        );


    if (!confirmed) {
        return;
    }


    employees =
        employees.filter(
            item => item.id !== id
        );


    attendanceRecords =
        attendanceRecords.filter(
            record =>
                record.employeeId !== id
        );


    leaveRequests =
        leaveRequests.filter(
            leave =>
                leave.employeeId !== id
        );


    addActivity(
        `کارمند «${employee.fullName}» حذف شد.`
    );


    addNotification(
        "حذف کارمند",
        `کارمند ${employee.fullName} حذف شد.`,
        "warning"
    );


    saveData();

    renderAll();

    showToast(
        "کارمند حذف شد."
    );

}


/* =========================================================
   ATTENDANCE
========================================================= */

function bindAttendanceEvents() {

    const date =
        document.getElementById(
            "attendanceDate"
        );

    const search =
        document.getElementById(
            "attendanceSearch"
        );

    const filter =
        document.getElementById(
            "attendanceStatusFilter"
        );

    const refresh =
        document.getElementById(
            "openAttendanceModal"
        );


    if (date) {

        date.addEventListener(
            "change",
            renderAttendance
        );

    }


    if (search) {

        search.addEventListener(
            "input",
            renderAttendance
        );

    }


    if (filter) {

        filter.addEventListener(
            "change",
            renderAttendance
        );

    }


    if (refresh) {

        refresh.addEventListener(
            "click",
            () => {

                renderAttendance();

                showToast(
                    "اطلاعات حضور و غیاب بروزرسانی شد."
                );

            }
        );

    }

}


function getAttendance(
    employeeId,
    date
) {

    return attendanceRecords.find(
        record =>
            record.employeeId === employeeId &&
            record.date === date
    );

}


function renderAttendance() {

    const body =
        document.getElementById(
            "attendanceTableBody"
        );

    if (!body) {
        return;
    }


    const date =
        document.getElementById(
            "attendanceDate"
        )?.value || todayISO();


    const search =
        document.getElementById(
            "attendanceSearch"
        )?.value
            .trim()
            .toLowerCase() || "";


    const filter =
        document.getElementById(
            "attendanceStatusFilter"
        )?.value || "all";


    const activeEmployees =
        employees.filter(
            employee =>
                employee.status === "active"
        );


    const records =
        activeEmployees.map(employee => {

            let record =
                getAttendance(
                    employee.id,
                    date
                );


            if (!record) {

                record = {

                    id: generateId("att"),

                    employeeId:
                        employee.id,

                    date,

                    status: "absent",

                    entryTime: "",

                    exitTime: "",

                    notes: "",

                    delay: 0

                };

            }


            return {
                employee,
                record
            };

        });


    const filtered =
        records.filter(item => {

            const name =
                item.employee.fullName
                    .toLowerCase();


            const matchesSearch =
                !search ||
                name.includes(search);


            const matchesStatus =
                filter === "all" ||
                item.record.status === filter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    body.innerHTML = "";


    filtered.forEach(
        ({
            employee,
            record
        }) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            employee.fullName
                        )}
                    </strong>
                </td>

                <td>

                    <select
                        onchange="changeAttendanceStatus(
                            '${employee.id}',
                            '${date}',
                            this.value
                        )"
                    >

                        <option
                            value="present"
                            ${
                                record.status === "present"
                                    ? "selected"
                                    : ""
                            }
                        >
                            حاضر
                        </option>

                        <option
                            value="late"
                            ${
                                record.status === "late"
                                    ? "selected"
                                    : ""
                            }
                        >
                            تأخیر
                        </option>

                        <option
                            value="absent"
                            ${
                                record.status === "absent"
                                    ? "selected"
                                    : ""
                            }
                        >
                            غایب
                        </option>

                        <option
                            value="leave"
                            ${
                                record.status === "leave"
                                    ? "selected"
                                    : ""
                            }
                        >
                            مرخصی
                        </option>

                    </select>

                </td>

                <td>
                    <input
                        type="time"
                        value="${escapeHTML(
                            record.entryTime || ""
                        )}"
                        onchange="updateAttendanceTime(
                            '${employee.id}',
                            '${date}',
                            'entryTime',
                            this.value
                        )"
                    >
                </td>

                <td>
                    <input
                        type="time"
                        value="${escapeHTML(
                            record.exitTime || ""
                        )}"
                        onchange="updateAttendanceTime(
                            '${employee.id}',
                            '${date}',
                            'exitTime',
                            this.value
                        )"
                    >
                </td>

                <td>
                    ${calculateWorkDuration(record)}
                </td>

                <td>
                    ${Number(record.delay || 0)} دقیقه
                </td>

                <td>
                    <input
                        type="text"
                        value="${escapeHTML(
                            record.notes || ""
                        )}"
                        placeholder="توضیحات"
                        onchange="updateAttendanceNotes(
                            '${employee.id}',
                            '${date}',
                            this.value
                        )"
                    >
                </td>

                <td>

                    <button
                        class="primary-btn"
                        type="button"
                        onclick="saveAttendance(
                            '${employee.id}',
                            '${date}'
                        )"
                    >
                        💾 ذخیره
                    </button>

                </td>

            `;


            body.appendChild(row);

        });


    updateAttendanceSummary(
        date
    );

}


function updateAttendanceSummary(
    date
) {

    const records =
        employees
            .filter(
                e => e.status === "active"
            )
            .map(
                employee =>
                    getAttendance(
                        employee.id,
                        date
                    )
            )
            .filter(Boolean);


    const present =
        records.filter(
            r => r.status === "present"
        ).length;


    const late =
        records.filter(
            r => r.status === "late"
        ).length;


    const absent =
        records.filter(
            r => r.status === "absent"
        ).length;


    const leave =
        records.filter(
            r => r.status === "leave"
        ).length;


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


function ensureAttendanceRecord(
    employeeId,
    date
) {

    let record =
        getAttendance(
            employeeId,
            date
        );


    if (!record) {

        record = {

            id: generateId("att"),

            employeeId,

            date,

            status: "absent",

            entryTime: "",

            exitTime: "",

            notes: "",

            delay: 0

        };


        attendanceRecords.push(
            record
        );

    }


    return record;

}


function changeAttendanceStatus(
    employeeId,
    date,
    status
) {

    const record =
        ensureAttendanceRecord(
            employeeId,
            date
        );


    record.status =
        status;


    if (status === "late") {

        if (!record.delay) {
            record.delay = 15;
        }

    } else {

        record.delay = 0;

    }


    saveData();

    renderAttendance();

}


function updateAttendanceTime(
    employeeId,
    date,
    field,
    value
) {

    const record =
        ensureAttendanceRecord(
            employeeId,
            date
        );


    record[field] =
        value;


    if (
        record.entryTime &&
        record.exitTime
    ) {

        if (
            record.status === "absent"
        ) {

            record.status =
                "present";

        }

    }


    saveData();

    renderAttendance();

}


function updateAttendanceNotes(
    employeeId,
    date,
    notes
) {

    const record =
        ensureAttendanceRecord(
            employeeId,
            date
        );


    record.notes =
        notes;


    saveData();

}


function saveAttendance(
    employeeId,
    date
) {

    ensureAttendanceRecord(
        employeeId,
        date
    );

    saveData();

    renderAll();

    showToast(
        "اطلاعات حضور ذخیره شد."
    );

}


function calculateWorkDuration(
    record
) {

    if (
        !record.entryTime ||
        !record.exitTime
    ) {
        return "-";
    }


    const start =
        record.entryTime
            .split(":")
            .map(Number);


    const end =
        record.exitTime
            .split(":")
            .map(Number);


    let startMinutes =
        start[0] * 60 +
        start[1];


    let endMinutes =
        end[0] * 60 +
        end[1];


    if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
    }


    const duration =
        endMinutes -
        startMinutes;


    const hours =
        Math.floor(
            duration / 60
        );


    const minutes =
        duration % 60;


    return `${hours} ساعت و ${minutes} دقیقه`;

}


/* =========================================================
   LEAVE
========================================================= */

function bindLeaveEvents() {

    const addButton =
        document.getElementById(
            "addLeaveBtn"
        );

    const closeButton =
        document.getElementById(
            "closeLeaveModal"
        );

    const cancelButton =
        document.getElementById(
            "cancelLeaveModal"
        );

    const form =
        document.getElementById(
            "leaveForm"
        );


    const start =
        document.getElementById(
            "leaveStart"
        );

    const end =
        document.getElementById(
            "leaveEnd"
        );


    const search =
        document.getElementById(
            "leaveSearch"
        );

    const type =
        document.getElementById(
            "leaveTypeFilter"
        );

    const status =
        document.getElementById(
            "leaveStatusFilter"
        );

    const date =
        document.getElementById(
            "leaveDateFilter"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            openLeaveModal
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeLeaveModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeLeaveModal
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            saveLeave
        );

    }


    if (start) {

        start.addEventListener(
            "change",
            updateLeaveDays
        );

    }


    if (end) {

        end.addEventListener(
            "change",
            updateLeaveDays
        );

    }


    [search, type, status, date]
        .forEach(element => {

            if (element) {

                element.addEventListener(
                    "input",
                    renderLeaves
                );

                element.addEventListener(
                    "change",
                    renderLeaves
                );

            }

        });

}


function openLeaveModal() {

    populateLeaveEmployees();

    const modal =
        document.getElementById(
            "leaveModal"
        );

    const form =
        document.getElementById(
            "leaveForm"
        );


    form.reset();

    document.getElementById(
        "leaveDays"
    ).value = 1;


    modal.classList.add(
        "active"
    );

}


function closeLeaveModal() {

    const modal =
        document.getElementById(
            "leaveModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


function populateLeaveEmployees() {

    const select =
        document.getElementById(
            "leaveEmployee"
        );


    if (!select) {
        return;
    }


    select.innerHTML =
        `<option value="">انتخاب کارمند</option>`;


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
                `${employee.fullName} — ${employee.personnelCode}`;

            select.appendChild(
                option
            );

        });

}


function updateLeaveDays() {

    const start =
        document.getElementById(
            "leaveStart"
        ).value;


    const end =
        document.getElementById(
            "leaveEnd"
        ).value;


    if (!start || !end) {
        return;
    }


    const startDate =
        new Date(start);

    const endDate =
        new Date(end);


    if (endDate < startDate) {

        document.getElementById(
            "leaveDays"
        ).value = 1;

        return;
    }


    const difference =
        endDate.getTime() -
        startDate.getTime();


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1;


    document.getElementById(
        "leaveDays"
    ).value = days;

}


function saveLeave(event) {

    event.preventDefault();


    const employeeId =
        document.getElementById(
            "leaveEmployee"
        ).value;


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
        !end
    ) {

        showToast(
            "لطفاً اطلاعات درخواست را کامل کنید.",
            "error"
        );

        return;
    }


    if (end < start) {

        showToast(
            "تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.",
            "error"
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


    const leave = {

        id: generateId("leave"),

        employeeId,

        employeeName:
            employee.fullName,

        type,

        startDate: start,

        endDate: end,

        days,

        description,

        status: "pending",

        createdAt:
            new Date().toISOString()

    };


    leaveRequests.push(
        leave
    );


    addActivity(
        `درخواست ${getLeaveTypeName(type)} برای ${employee.fullName} ثبت شد.`
    );


    addNotification(
        "درخواست جدید",
        `${employee.fullName} یک درخواست ${getLeaveTypeName(type)} ثبت کرد.`,
        "info"
    );


    saveData();

    closeLeaveModal();

    renderAll();


    showToast(
        "درخواست با موفقیت ثبت شد."
    );

}


function renderLeaves() {

    const body =
        document.getElementById(
            "leaveTableBody"
        );


    if (!body) {
        return;
    }


    const search =
        document.getElementById(
            "leaveSearch"
        )?.value
            .trim()
            .toLowerCase() || "";


    const type =
        document.getElementById(
            "leaveTypeFilter"
        )?.value || "all";


    const status =
        document.getElementById(
            "leaveStatusFilter"
        )?.value || "all";


    const date =
        document.getElementById(
            "leaveDateFilter"
        )?.value || "";


    const filtered =
        leaveRequests.filter(
            leave => {

                const name =
                    leave.employeeName
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    name.includes(search);


                const matchesType =
                    type === "all" ||
                    leave.type === type;


                const matchesStatus =
                    status === "all" ||
                    leave.status === status;


                const matchesDate =
                    !date ||
                    (
                        date >= leave.startDate &&
                        date <= leave.endDate
                    );


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesStatus &&
                    matchesDate
                );

            }
        );


    body.innerHTML = "";


    if (!filtered.length) {

        body.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;padding:30px;">
                    هیچ درخواستی پیدا نشد.
                </td>
            </tr>
        `;

        updateLeaveSummary();

        return;
    }


    filtered.forEach(leave => {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(
                        leave.employeeName
                    )}
                </strong>
            </td>

            <td>
                ${getLeaveTypeName(
                    leave.type
                )}
            </td>

            <td>
                ${formatDate(
                    leave.startDate
                )}
            </td>

            <td>
                ${formatDate(
                    leave.endDate
                )}
            </td>

            <td>
                ${leave.days} روز
            </td>

            <td>
                ${escapeHTML(
                    leave.description || "-"
                )}
            </td>

            <td>
                <span class="status-badge ${leave.status}">
                    ${getLeaveStatusName(
                        leave.status
                    )}
                </span>
            </td>

            <td>

                ${
                    leave.status === "pending"
                        ? `
                            <button
                                class="primary-btn"
                                type="button"
                                onclick="approveLeave('${leave.id}')"
                            >
                                ✓
                            </button>

                            <button
                                class="danger-btn"
                                type="button"
                                onclick="rejectLeave('${leave.id}')"
                            >
                                ✕
                            </button>
                        `
                        : `
                            <button
                                class="danger-btn"
                                type="button"
                                onclick="deleteLeave('${leave.id}')"
                            >
                                🗑️
                            </button>
                        `
                }

            </td>
        `;


        body.appendChild(row);

    });


    updateLeaveSummary();

}


function getLeaveTypeName(type) {

    const names = {

        annual: "مرخصی استحقاقی",
        sick: "مرخصی استعلاجی",
        unpaid: "مرخصی بدون حقوق",
        mission: "مأموریت"

    };


    return names[type] || type;

}


function getLeaveStatusName(status) {

    const names = {

        pending: "در انتظار بررسی",
        approved: "تأیید شده",
        rejected: "رد شده"

    };


    return names[status] || status;

}


function updateLeaveSummary() {

    const total =
        leaveRequests.length;


    const pending =
        leaveRequests.filter(
            leave =>
                leave.status === "pending"
        ).length;


    const approved =
        leaveRequests.filter(
            leave =>
                leave.status === "approved"
        ).length;


    const rejected =
        leaveRequests.filter(
            leave =>
                leave.status === "rejected"
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


function approveLeave(id) {

    const leave =
        leaveRequests.find(
            item => item.id === id
        );


    if (!leave) {
        return;
    }


    leave.status =
        "approved";


    addActivity(
        `درخواست ${leave.employeeName} تأیید شد.`
    );


    addNotification(
        "درخواست تأیید شد",
        `درخواست ${leave.employeeName} تأیید شد.`,
        "success"
    );


    saveData();

    renderAll();

    showToast(
        "درخواست تأیید شد."
    );

}


function rejectLeave(id) {

    const leave =
        leaveRequests.find(
            item => item.id === id
        );


    if (!leave) {
        return;
    }


    leave.status =
        "rejected";


    addActivity(
        `درخواست ${leave.employeeName} رد شد.`
    );


    addNotification(
        "درخواست رد شد",
        `درخواست ${leave.employeeName} رد شد.`,
        "warning"
    );


    saveData();

    renderAll();

    showToast(
        "درخواست رد شد."
    );

}


function deleteLeave(id) {

    const leave =
        leaveRequests.find(
            item => item.id === id
        );


    if (!leave) {
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
            item => item.id !== id
        );


    saveData();

    renderAll();

    showToast(
        "درخواست حذف شد."
    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function bindNotificationEvents() {

    const markAll =
        document.getElementById(
            "markAllNotifications"
        );

    const clearAll =
        document.getElementById(
            "clearAllNotifications"
        );


    if (markAll) {

        markAll.addEventListener(
            "click",
            markAllNotifications
        );

    }


    if (clearAll) {

        clearAll.addEventListener(
            "click",
            clearAllNotifications
        );

    }

}


function addNotification(
    title,
    message,
    type = "info"
) {

    notifications.unshift({

        id: generateId("notif"),

        title,

        message,

        type,

        read: false,

        createdAt:
            new Date().toISOString()

    });


    notifications =
        notifications.slice(
            0,
            100
        );

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
        return;
    }


    container.innerHTML = "";


    if (!notifications.length) {

        empty.style.display =
            "block";

        updateNotificationCount();

        return;
    }


    empty.style.display =
        "none";


    notifications.forEach(notification => {

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
                🔔
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
                    ${formatDateTime(
                        notification.createdAt
                    )}
                </small>

            </div>

            <div class="notification-actions">

                ${
                    !notification.read
                        ? `
                            <button
                                class="secondary-btn"
                                type="button"
                                onclick="markNotificationRead('${notification.id}')"
                            >
                                ✓
                            </button>
                        `
                        : ""
                }

                <button
                    class="danger-btn"
                    type="button"
                    onclick="deleteNotification('${notification.id}')"
                >
                    🗑️
                </button>

            </div>
        `;


        container.appendChild(
            item
        );

    });


    updateNotificationCount();

}


function formatDateTime(
    iso
) {

    if (!iso) {
        return "";
    }


    const date =
        new Date(iso);


    return date.toLocaleString(
        "fa-IR"
    );

}


function markNotificationRead(id) {

    const notification =
        notifications.find(
            item => item.id === id
        );


    if (!notification) {
        return;
    }


    notification.read =
        true;


    saveData();

    renderNotifications();

    renderDashboard();

}


function markAllNotifications() {

    notifications.forEach(
        notification => {
            notification.read = true;
        }
    );


    saveData();

    renderNotifications();

    renderDashboard();

    showToast(
        "همه اعلان‌ها خوانده شدند."
    );

}


function deleteNotification(id) {

    notifications =
        notifications.filter(
            item => item.id !== id
        );


    saveData();

    renderNotifications();

    renderDashboard();

}


function clearAllNotifications() {

    if (!notifications.length) {
        return;
    }


    if (
        !confirm(
            "آیا می‌خواهید همه اعلان‌ها حذف شوند؟"
        )
    ) {
        return;
    }


    notifications = [];


    saveData();

    renderNotifications();

    renderDashboard();


    showToast(
        "همه اعلان‌ها حذف شدند."
    );

}


function updateNotificationCount() {

    const count =
        notifications.filter(
            notification =>
                !notification.read
        ).length;


    setText(
        "notificationCount",
        count
    );

    setText(
        "notificationBadge",
        count
    );

}


/* =========================================================
   REPORTS
========================================================= */

function bindReportEvents() {

    const exportButton =
        document.getElementById(
            "exportReportsBtn"
        );

    const downloadButton =
        document.getElementById(
            "downloadReportBtn"
        );


    if (exportButton) {

        exportButton.addEventListener(
            "click",
            exportReport
        );

    }


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            exportReport
        );

    }

}


function renderReports() {

    const total =
        employees.length;


    const active =
        employees.filter(
            employee =>
                employee.status === "active"
        ).length;


    const pending =
        leaveRequests.filter(
            leave =>
                leave.status === "pending"
        ).length;


    const approved =
        leaveRequests.filter(
            leave =>
                leave.status === "approved"
        ).length;


    const rejected =
        leaveRequests.filter(
            leave =>
                leave.status === "rejected"
        ).length;


    setText(
        "reportTotalEmployees",
        total
    );

    setText(
        "reportActiveEmployees",
        active
    );

    setText(
        "reportTotalLeaves",
        leaveRequests.length
    );

    setText(
        "reportPendingLeaves",
        pending
    );

    setText(
        "reportApprovedLeaves",
        approved
    );

    setText(
        "reportRejectedLeaves",
        rejected
    );

}


function exportReport() {

    const data = {

        organization:
            "کشت و صنعت میرزا کوچک خان",

        generatedAt:
            new Date().toLocaleString(
                "fa-IR"
            ),

        employees: employees,

        leaveRequests:
            leaveRequests,

        attendance:
            attendanceRecords

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
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


    link.href = url;

    link.download =
        `mirza-khan-hr-report-${todayISO()}.json`;


    document.body.appendChild(
        link
    );

    link.click();

    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "گزارش با موفقیت آماده شد."
    );

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

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


    const today =
        todayISO();


    const todayRecords =
        employees
            .filter(
                employee =>
                    employee.status === "active"
            )
            .map(
                employee =>
                    getAttendance(
                        employee.id,
                        today
                    )
            )
            .filter(Boolean);


    const present =
        todayRecords.filter(
            record =>
                record.status === "present"
        ).length;


    const late =
        todayRecords.filter(
            record =>
                record.status === "late"
        ).length;


    const absent =
        todayRecords.filter(
            record =>
                record.status === "absent"
        ).length;


    const leave =
        todayRecords.filter(
            record =>
                record.status === "leave"
        ).length;


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


    const rate =
        active > 0
            ? Math.round(
                ((present + late) /
                    active) *
                100
            )
            : 0;


    setText(
        "dashboardAttendanceRate",
        `${rate}%`
    );


    const progress =
        document.getElementById(
            "dashboardProgress"
        );


    if (progress) {

        progress.style.width =
            `${rate}%`;

    }


    const pending =
        leaveRequests.filter(
            leave =>
                leave.status === "pending"
        ).length;


    const approved =
        leaveRequests.filter(
            leave =>
                leave.status === "approved"
        ).length;


    setText(
        "dashboardPendingLeave",
        pending
    );

    setText(
        "dashboardApprovedLeave",
        approved
    );


    const unread =
        notifications.filter(
            notification =>
                !notification.read
        ).length;


    setText(
        "dashboardNotifications",
        unread
    );


    renderRecentActivity();

}


function renderRecentActivity() {

    const container =
        document.getElementById(
            "dashboardRecentActivity"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!activities.length) {

        container.innerHTML = `
            <div style="padding:20px;text-align:center;">
                هنوز فعالیتی ثبت نشده است.
            </div>
        `;

        return;
    }


    activities
        .slice(0, 10)
        .forEach(activity => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "activity-item";


            item.innerHTML = `

                <div class="activity-icon">
                    📌
                </div>

                <div>

                    <strong>
                        ${escapeHTML(
                            activity.message
                        )}
                    </strong>

                    <small>
                        ${formatDateTime(
                            activity.createdAt
                        )}
                    </small>

                </div>

            `;


            container.appendChild(
                item
            );

        });

}


function addActivity(message) {

    activities.unshift({

        id: generateId("activity"),

        message,

        createdAt:
            new Date().toISOString()

    });


    activities =
        activities.slice(
            0,
            100
        );

}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

    renderDashboard();

    renderEmployees();

    renderAttendance();

    renderLeaves();

    renderNotifications();

    renderReports();

    updateEmployeeSummary();

    updateLeaveSummary();

    updateNotificationCount();

}


/* =========================================================
   DOM HELPERS
========================================================= */

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


/* =========================================================
   GLOBAL FUNCTIONS
   برای onclick های جدول
========================================================= */

window.navigateToPage =
    navigateToPage;

window.openEmployeeModal =
    openEmployeeModal;

window.closeEmployeeModal =
    closeEmployeeModal;

window.viewEmployee =
    viewEmployee;

window.editEmployee =
    editEmployee;

window.deleteEmployee =
    deleteEmployee;

window.changeAttendanceStatus =
    changeAttendanceStatus;

window.updateAttendanceTime =
    updateAttendanceTime;

window.updateAttendanceNotes =
    updateAttendanceNotes;

window.saveAttendance =
    saveAttendance;

window.approveLeave =
    approveLeave;

window.rejectLeave =
    rejectLeave;

window.deleteLeave =
    deleteLeave;

window.markNotificationRead =
    markNotificationRead;

window.deleteNotification =
    deleteNotification;


/* =========================================================
   BACKUP / DEBUG
========================================================= */

window.MirzaKhanHR = {

    getEmployees: () =>
        [...employees],

    getAttendance: () =>
        [...attendanceRecords],

    getLeaves: () =>
        [...leaveRequests],

    getNotifications: () =>
        [...notifications],

    clearData: () => {

        if (
            !confirm(
                "همه اطلاعات سامانه حذف شود؟"
            )
        ) {
            return;
        }


        localStorage.removeItem(
            STORAGE_KEYS.employees
        );

        localStorage.removeItem(
            STORAGE_KEYS.attendance
        );

        localStorage.removeItem(
            STORAGE_KEYS.leaves
        );

        localStorage.removeItem(
            STORAGE_KEYS.notifications
        );

        localStorage.removeItem(
            STORAGE_KEYS.activities
        );


        location.reload();

    }

};
