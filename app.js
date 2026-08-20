/* =========================================================
   MIRZA KHAN HR
   APP.JS
   COMPLETE HR MANAGEMENT SYSTEM
========================================================= */

"use strict";


/* =========================================================
   STORAGE
========================================================= */

const STORAGE = {

    employees: "mirza_khan_employees",

    attendance: "mirza_khan_attendance",

    leaves: "mirza_khan_leaves",

    payroll: "mirza_khan_payroll",

    notifications: "mirza_khan_notifications",

    activities: "mirza_khan_activities"

};


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) =>
    document.querySelector(selector);


const $$ = (selector) =>
    document.querySelectorAll(selector);


function save(key, value) {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}


function load(key, fallback = []) {

    try {

        const data =
            localStorage.getItem(key);

        return data
            ? JSON.parse(data)
            : fallback;

    } catch (error) {

        console.error(error);

        return fallback;

    }

}


function uid(prefix = "id") {

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


function today() {

    const date = new Date();

    const y =
        date.getFullYear();

    const m =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const d =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${y}-${m}-${d}`;

}


function formatNumber(number) {

    return Number(
        number || 0
    ).toLocaleString("fa-IR");

}


function toman(number) {

    return (
        formatNumber(number) +
        " تومان"
    );

}


function initials(name) {

    if (!name)
        return "?";

    const parts =
        name.trim().split(/\s+/);

    if (parts.length === 1)
        return parts[0].substring(0, 1);

    return (
        parts[0].substring(0, 1) +
        parts[1].substring(0, 1)
    );

}


function escapeHTML(value) {

    if (value === undefined || value === null)
        return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   DEFAULT DATA
========================================================= */

function createDefaultData() {

    let employees =
        load(STORAGE.employees, null);

    if (!employees) {

        employees = [

            {
                id: uid("emp"),
                name: "علی احمدی",
                code: "MK-1001",
                department: "منابع انسانی",
                position: "کارشناس منابع انسانی",
                phone: "09120000001",
                hireDate: "2025-03-10",
                salary: 18000000,
                status: "active"
            },

            {
                id: uid("emp"),
                name: "رضا محمدی",
                code: "MK-1002",
                department: "تولید",
                position: "سرپرست تولید",
                phone: "09120000002",
                hireDate: "2024-08-15",
                salary: 24000000,
                status: "active"
            },

            {
                id: uid("emp"),
                name: "مریم کریمی",
                code: "MK-1003",
                department: "مالی",
                position: "حسابدار",
                phone: "09120000003",
                hireDate: "2025-01-20",
                salary: 21000000,
                status: "active"
            },

            {
                id: uid("emp"),
                name: "حسین رضایی",
                code: "MK-1004",
                department: "فنی",
                position: "کارشناس فنی",
                phone: "09120000004",
                hireDate: "2023-11-12",
                salary: 23000000,
                status: "active"
            },

            {
                id: uid("emp"),
                name: "سارا موسوی",
                code: "MK-1005",
                department: "اداری",
                position: "کارشناس اداری",
                phone: "09120000005",
                hireDate: "2025-04-05",
                salary: 17000000,
                status: "active"
            }

        ];

        save(
            STORAGE.employees,
            employees
        );

    }


    let attendance =
        load(
            STORAGE.attendance,
            null
        );

    if (!attendance) {

        attendance = employees.map(
            employee => ({

                id: uid("att"),

                employeeId:
                    employee.id,

                date: today(),

                checkIn: "07:58",

                checkOut: "16:00",

                status: "present"

            })
        );

        if (attendance.length > 1) {

            attendance[1].checkIn = "08:21";
            attendance[1].status = "late";

        }

        if (attendance.length > 2) {

            attendance[2].status =
                "present";

        }

        if (attendance.length > 3) {

            attendance[3].status =
                "absent";

            attendance[3].checkIn = "";
            attendance[3].checkOut = "";

        }

        if (attendance.length > 4) {

            attendance[4].status =
                "leave";

            attendance[4].checkIn = "";
            attendance[4].checkOut = "";

        }

        save(
            STORAGE.attendance,
            attendance
        );

    }


    let leaves =
        load(
            STORAGE.leaves,
            null
        );

    if (!leaves) {

        leaves = [

            {
                id: uid("leave"),
                employeeId: employees[2]?.id,
                type: "استحقاقی",
                start: today(),
                end: today(),
                days: 1,
                description: "مرخصی شخصی",
                status: "pending"
            }

        ];

        save(
            STORAGE.leaves,
            leaves
        );

    }


    let payroll =
        load(
            STORAGE.payroll,
            null
        );

    if (!payroll) {

        payroll = employees.map(
            employee => ({

                id: uid("pay"),

                employeeId:
                    employee.id,

                base:
                    Number(employee.salary || 0),

                overtime: 0,

                bonus: 0,

                insurance:
                    Math.round(
                        Number(employee.salary || 0) *
                        .07
                    ),

                tax: 0,

                other: 0

            })
        );

        save(
            STORAGE.payroll,
            payroll
        );

    }


    let notifications =
        load(
            STORAGE.notifications,
            null
        );

    if (!notifications) {

        notifications = [

            {
                id: uid("not"),
                title: "سامانه آماده است",
                message:
                    "سامانه منابع انسانی میرزا کوچک خان با موفقیت راه‌اندازی شد.",
                time: "امروز",
                unread: true,
                icon: "fa-solid fa-leaf"
            },

            {
                id: uid("not"),
                title: "درخواست مرخصی جدید",
                message:
                    "یک درخواست مرخصی در انتظار بررسی قرار دارد.",
                time: "امروز",
                unread: true,
                icon: "fa-solid fa-calendar"
            }

        ];

        save(
            STORAGE.notifications,
            notifications
        );

    }


    let activities =
        load(
            STORAGE.activities,
            null
        );

    if (!activities) {

        activities = [

            {
                id: uid("activity"),
                title: "ثبت سامانه",
                message: "سامانه منابع انسانی راه‌اندازی شد.",
                time: "امروز"
            },

            {
                id: uid("activity"),
                title: "حضور و غیاب",
                message: "اطلاعات حضور امروز بارگذاری شد.",
                time: "امروز"
            }

        ];

        save(
            STORAGE.activities,
            activities
        );

    }

}


/* =========================================================
   GET DATA
========================================================= */

function getEmployees() {

    return load(
        STORAGE.employees,
        []
    );

}


function getAttendance() {

    return load(
        STORAGE.attendance,
        []
    );

}


function getLeaves() {

    return load(
        STORAGE.leaves,
        []
    );

}


function getPayroll() {

    return load(
        STORAGE.payroll,
        []
    );

}


function getNotifications() {

    return load(
        STORAGE.notifications,
        []
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(
    message,
    title = "موفق",
    type = "success"
) {

    const toast =
        $("#toast");

    const icon =
        $("#toastIcon");

    $("#toastTitle").textContent =
        title;

    $("#toastMessage").textContent =
        message;


    if (type === "error") {

        icon.style.background =
            "#dc2626";

        icon.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';

    } else if (type === "warning") {

        icon.style.background =
            "#d97706";

        icon.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i>';

    } else {

        icon.style.background =
            "#16a34a";

        icon.innerHTML =
            '<i class="fa-solid fa-check"></i>';

    }


    toast.classList.add("show");


    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


/* =========================================================
   NAVIGATION
========================================================= */

const pageTitles = {

    dashboard: [
        "داشبورد",
        "مدیریت جامع منابع انسانی"
    ],

    employees: [
        "مدیریت کارکنان",
        "ثبت و مدیریت اطلاعات کارکنان"
    ],

    attendance: [
        "حضور و غیاب",
        "مدیریت وضعیت حضور کارکنان"
    ],

    leave: [
        "مدیریت مرخصی",
        "درخواست‌ها و سوابق مرخصی"
    ],

    payroll: [
        "حقوق و کسورات",
        "مدیریت حقوق، مزایا و کسورات"
    ],

    reports: [
        "گزارش‌ها",
        "گزارش‌های مدیریتی سامانه"
    ],

    notifications: [
        "اعلان‌ها",
        "اطلاعیه‌ها و رویدادهای سامانه"
    ]

};


function showPage(page) {

    $$(".page").forEach(
        element => {

            element.classList.remove(
                "active-page"
            );

        }
    );


    const target =
        $(`#page-${page}`);

    if (!target)
        return;


    target.classList.add(
        "active-page"
    );


    $$(".menu-item").forEach(
        item => {

            item.classList.toggle(
                "active",
                item.dataset.page === page
            );

        }
    );


    if (pageTitles[page]) {

        $("#pageTitle").textContent =
            pageTitles[page][0];

        $("#pageSubtitle").textContent =
            pageTitles[page][1];

    }


    if (window.innerWidth <= 991) {

        closeMobileMenu();

    }


    if (page === "dashboard")
        renderDashboard();

    if (page === "employees")
        renderEmployees();

    if (page === "attendance")
        renderAttendance();

    if (page === "leave")
        renderLeaves();

    if (page === "payroll")
        renderPayroll();

    if (page === "reports")
        renderReports();

    if (page === "notifications")
        renderNotifications();

}


/* =========================================================
   MOBILE MENU
========================================================= */

function openMobileMenu() {

    $("#sidebar")
        .classList.add("open");

    $("#menuOverlay")
        .classList.add("show");

}


function closeMobileMenu() {

    $("#sidebar")
        .classList.remove("open");

    $("#menuOverlay")
        .classList.remove("show");

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const employees =
        getEmployees();

    const attendance =
        getAttendance();

    const todayAttendance =
        attendance.filter(
            item =>
                item.date === today()
        );


    const activeEmployees =
        employees.filter(
            employee =>
                employee.status === "active"
        );


    const present =
        todayAttendance.filter(
            item =>
                item.status === "present"
        ).length;


    const absent =
        todayAttendance.filter(
            item =>
                item.status === "absent"
        ).length;


    const late =
        todayAttendance.filter(
            item =>
                item.status === "late"
        ).length;


    $("#totalEmployees").textContent =
        formatNumber(
            activeEmployees.length
        );

    $("#presentEmployees").textContent =
        formatNumber(present);

    $("#absentEmployees").textContent =
        formatNumber(absent);

    $("#lateEmployees").textContent =
        formatNumber(late);


    $("#employeeMenuBadge").textContent =
        formatNumber(
            activeEmployees.length
        );


    renderRecentEmployees(
        employees
    );

    renderRecentActivities();

    updateBadges();

}


/* RECENT EMPLOYEES */

function renderRecentEmployees(
    employees
) {

    const container =
        $("#recentEmployees");

    const recent =
        employees.slice(-5).reverse();


    if (!recent.length) {

        container.innerHTML =
            '<div class="empty-state">هنوز کارمندی ثبت نشده است.</div>';

        return;

    }


    container.innerHTML =
        recent.map(
            employee => `

            <div class="recent-employee">

                <div class="employee-avatar">
                    ${escapeHTML(
                        initials(employee.name)
                    )}
                </div>

                <div class="recent-employee-info">

                    <strong>
                        ${escapeHTML(
                            employee.name
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            employee.position
                        )}
                    </span>

                </div>

            </div>

        `
        ).join("");

}


/* ACTIVITIES */

function renderRecentActivities() {

    const container =
        $("#recentActivities");

    const activities =
        load(
            STORAGE.activities,
            []
        ).slice(-5).reverse();


    if (!activities.length) {

        container.innerHTML =
            '<div class="empty-state">فعالیتی ثبت نشده است.</div>';

        return;

    }


    container.innerHTML =
        activities.map(
            activity => `

            <div class="dashboard-activity-item">

                <div class="activity-icon">

                    <i class="fa-solid fa-leaf"></i>

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
                        ${escapeHTML(
                            activity.time
                        )}
                    </small>

                </div>

            </div>

        `
        ).join("");

}


/* ACTIVITY */

function addActivity(
    title,
    message
) {

    const activities =
        load(
            STORAGE.activities,
            []
        );


    activities.push({

        id: uid("activity"),

        title,

        message,

        time: "همین الان"

    });


    save(
        STORAGE.activities,
        activities.slice(-30)
    );

}


/* =========================================================
   EMPLOYEES
========================================================= */

function renderEmployees() {

    const employees =
        getEmployees();


    const search =
        ($("#employeeSearch")?.value || "")
            .trim()
            .toLowerCase();


    const department =
        $("#employeeDepartmentFilter")?.value || "";


    const filtered =
        employees.filter(
            employee => {

                const text =
                    `${employee.name}
                    ${employee.code}
                    ${employee.position}
                    ${employee.department}`
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    text.includes(search);


                const matchesDepartment =
                    !department ||
                    employee.department === department;


                return (
                    matchesSearch &&
                    matchesDepartment
                );

            }
        );


    const tbody =
        $("#employeesTableBody");


    if (!filtered.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="empty-state">

                        کارمندی با این مشخصات پیدا نشد.

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        filtered.map(
            employee => `

            <tr>

                <td>

                    <div class="employee-info">

                        <div class="employee-avatar">

                            ${escapeHTML(
                                initials(employee.name)
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
                                    employee.phone || "-"
                                )}
                            </span>

                        </div>

                    </div>

                </td>


                <td>
                    ${escapeHTML(
                        employee.code
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        employee.department
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        employee.position
                    )}
                </td>


                <td>

                    <span class="employee-status ${
                        employee.status === "active"
                            ? "active"
                            : "inactive"
                    }">

                        ${
                            employee.status === "active"
                                ? "فعال"
                                : "غیرفعال"
                        }

                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="action-btn"
                            data-action="editEmployee"
                            data-id="${employee.id}"
                            title="ویرایش"
                            type="button"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>


                        <button
                            class="action-btn"
                            data-action="viewEmployee"
                            data-id="${employee.id}"
                            title="مشاهده"
                            type="button"
                        >
                            <i class="fa-solid fa-eye"></i>
                        </button>


                        <button
                            class="action-btn delete"
                            data-action="deleteEmployee"
                            data-id="${employee.id}"
                            title="حذف"
                            type="button"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>

            </tr>

        `
        ).join("");

}


/* OPEN EMPLOYEE MODAL */

function openEmployeeModal(
    employee = null
) {

    $("#employeeForm").reset();

    $("#employeeId").value =
        employee?.id || "";

    $("#employeeModalTitle").textContent =
        employee
            ? "ویرایش کارمند"
            : "افزودن کارمند";


    if (employee) {

        $("#employeeName").value =
            employee.name || "";

        $("#employeeCode").value =
            employee.code || "";

        $("#employeeDepartment").value =
            employee.department || "";

        $("#employeePosition").value =
            employee.position || "";

        $("#employeePhone").value =
            employee.phone || "";

        $("#employeeHireDate").value =
            employee.hireDate || "";

        $("#employeeSalary").value =
            employee.salary || "";

        $("#employeeStatus").value =
            employee.status || "active";

    }


    openModal("employeeModal");

}


/* SAVE EMPLOYEE */

function saveEmployee(
    event
) {

    event.preventDefault();


    const employees =
        getEmployees();


    const id =
        $("#employeeId").value;


    const employee = {

        id:
            id || uid("emp"),

        name:
            $("#employeeName").value.trim(),

        code:
            $("#employeeCode").value.trim(),

        department:
            $("#employeeDepartment").value,

        position:
            $("#employeePosition").value.trim(),

        phone:
            $("#employeePhone").value.trim(),

        hireDate:
            $("#employeeHireDate").value,

        salary:
            Number(
                $("#employeeSalary").value || 0
            ),

        status:
            $("#employeeStatus").value

    };


    if (!employee.name) {

        showToast(
            "نام کارمند را وارد کنید.",
            "خطا",
            "error"
        );

        return;

    }


    if (id) {

        const index =
            employees.findIndex(
                item =>
                    item.id === id
            );


        if (index !== -1) {

            employees[index] =
                employee;

        }

        addActivity(
            "ویرایش کارمند",
            `اطلاعات ${employee.name} ویرایش شد.`
        );

        showToast(
            "اطلاعات کارمند ویرایش شد."
        );

    } else {

        employees.push(
            employee
        );

        addActivity(
            "افزودن کارمند",
            `${employee.name} به کارکنان اضافه شد.`
        );

        showToast(
            "کارمند جدید با موفقیت اضافه شد."
        );

    }


    save(
        STORAGE.employees,
        employees
    );


    ensurePayrollForEmployee(
        employee
    );


    ensureAttendanceForEmployee(
        employee
    );


    closeModal("employeeModal");

    renderAll();

}


/* EDIT */

function editEmployee(id) {

    const employee =
        getEmployees()
            .find(
                item =>
                    item.id === id
            );


    if (!employee)
        return;


    openEmployeeModal(
        employee
    );

}


/* VIEW */

function viewEmployee(id) {

    const employee =
        getEmployees()
            .find(
                item =>
                    item.id === id
            );


    if (!employee)
        return;


    showToast(
        `${employee.name} | ${employee.position} | ${employee.department}`,
        "پروفایل کارمند"
    );

}


/* DELETE */

function deleteEmployee(id) {

    const employees =
        getEmployees();


    const employee =
        employees.find(
            item =>
                item.id === id
        );


    if (!employee)
        return;


    const confirmed =
        confirm(
            `آیا از حذف «${employee.name}» مطمئن هستید؟`
        );


    if (!confirmed)
        return;


    save(
        STORAGE.employees,
        employees.filter(
            item =>
                item.id !== id
        )
    );


    save(
        STORAGE.attendance,
        getAttendance().filter(
            item =>
                item.employeeId !== id
        )
    );


    save(
        STORAGE.leaves,
        getLeaves().filter(
            item =>
                item.employeeId !== id
        )
    );


    save(
        STORAGE.payroll,
        getPayroll().filter(
            item =>
                item.employeeId !== id
        )
    );


    addActivity(
        "حذف کارمند",
        `${employee.name} حذف شد.`
    );


    showToast(
        "کارمند حذف شد."
    );


    renderAll();

}


/* =========================================================
   ATTENDANCE
========================================================= */

function ensureAttendanceForEmployee(
    employee
) {

    const attendance =
        getAttendance();


    const exists =
        attendance.some(
            item =>
                item.employeeId === employee.id &&
                item.date === today()
        );


    if (!exists) {

        attendance.push({

            id: uid("att"),

            employeeId:
                employee.id,

            date: today(),

            checkIn: "",

            checkOut: "",

            status: "absent"

        });


        save(
            STORAGE.attendance,
            attendance
        );

    }

}


function renderAttendance() {

    const date =
        $("#attendanceDate").value ||
        today();


    const employees =
        getEmployees();


    const attendance =
        getAttendance();


    const tbody =
        $("#attendanceTableBody");


    const rows =
        employees.map(
            employee => {

                let record =
                    attendance.find(
                        item =>
                            item.employeeId === employee.id &&
                            item.date === date
                    );


                if (!record) {

                    record = {

                        id:
                            uid("att"),

                        employeeId:
                            employee.id,

                        date,

                        checkIn: "",

                        checkOut: "",

                        status: "absent"

                    };

                }


                return {
                    employee,
                    record
                };

            }
        );


    if (!rows.length) {

        tbody.innerHTML = `

            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        کارمندی ثبت نشده است.
                    </div>
                </td>
            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        rows.map(
            ({employee, record}) => `

            <tr>

                <td>

                    <div class="employee-info">

                        <div class="employee-avatar">
                            ${escapeHTML(
                                initials(employee.name)
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

                    <input
                        class="attendance-time"
                        data-id="${record.id}"
                        data-employee="${employee.id}"
                        data-field="checkIn"
                        type="time"
                        value="${record.checkIn || ""}"
                    >

                </td>


                <td>

                    <input
                        class="attendance-time"
                        data-id="${record.id}"
                        data-employee="${employee.id}"
                        data-field="checkOut"
                        type="time"
                        value="${record.checkOut || ""}"
                    >

                </td>


                <td>

                    <select
                        class="attendance-status"
                        data-id="${record.id}"
                        data-employee="${employee.id}"
                    >

                        <option
                            value="present"
                            ${record.status === "present" ? "selected" : ""}
                        >
                            حاضر
                        </option>

                        <option
                            value="late"
                            ${record.status === "late" ? "selected" : ""}
                        >
                            تأخیر
                        </option>

                        <option
                            value="absent"
                            ${record.status === "absent" ? "selected" : ""}
                        >
                            غایب
                        </option>

                        <option
                            value="leave"
                            ${record.status === "leave" ? "selected" : ""}
                        >
                            مرخصی
                        </option>

                    </select>

                </td>


                <td>

                    <button
                        class="action-btn save-attendance"
                        data-id="${record.id}"
                        data-employee="${employee.id}"
                        type="button"
                        title="ذخیره"
                    >
                        <i class="fa-solid fa-floppy-disk"></i>
                    </button>

                </td>

            </tr>

        `
        ).join("");


    updateAttendanceStats(
        date
    );

}


function updateAttendanceStats(
    date
) {

    const attendance =
        getAttendance();


    const records =
        attendance.filter(
            item =>
                item.date === date
        );


    const count =
        status =>
            records.filter(
                item =>
                    item.status === status
            ).length;


    $("#attendancePresent").textContent =
        formatNumber(
            count("present")
        );

    $("#attendanceAbsent").textContent =
        formatNumber(
            count("absent")
        );

    $("#attendanceLate").textContent =
        formatNumber(
            count("late")
        );

    $("#attendanceLeave").textContent =
        formatNumber(
            count("leave")
        );

}


function saveAttendance(
    employeeId
) {

    const date =
        $("#attendanceDate").value ||
        today();


    const row =
        document.querySelector(
            `.attendance-status[data-employee="${employeeId}"]`
        );


    if (!row)
        return;


    const status =
        row.value;


    const checkInInput =
        document.querySelector(
            `.attendance-time[data-employee="${employeeId}"][data-field="checkIn"]`
        );


    const checkOutInput =
        document.querySelector(
            `.attendance-time[data-employee="${employeeId}"][data-field="checkOut"]`
        );


    const attendance =
        getAttendance();


    let record =
        attendance.find(
            item =>
                item.employeeId === employeeId &&
                item.date === date
        );


    if (!record) {

        record = {

            id: uid("att"),

            employeeId,

            date,

            checkIn: "",

            checkOut: "",

            status

        };

        attendance.push(
            record
        );

    }


    record.status =
        status;

    record.checkIn =
        checkInInput?.value || "";

    record.checkOut =
        checkOutInput?.value || "";


    save(
        STORAGE.attendance,
        attendance
    );


    addActivity(
        "ثبت حضور و غیاب",
        "وضعیت حضور یک کارمند ثبت شد."
    );


    showToast(
        "اطلاعات حضور و غیاب ذخیره شد."
    );


    renderDashboard();

    updateAttendanceStats(
        date
    );

}


/* =========================================================
   LEAVE
========================================================= */

function calculateDays(
    start,
    end
) {

    if (!start || !end)
        return 0;


    const startDate =
        new Date(start);

    const endDate =
        new Date(end);


    const diff =
        endDate.getTime() -
        startDate.getTime();


    if (diff < 0)
        return 0;


    return (
        Math.floor(
            diff /
            (1000 * 60 * 60 * 24)
        ) + 1
    );

}


function populateLeaveEmployees() {

    const select =
        $("#leaveEmployee");


    const employees =
        getEmployees()
            .filter(
                employee =>
                    employee.status === "active"
            );


    select.innerHTML = `

        <option value="">
            انتخاب کارمند
        </option>

        ${
            employees.map(
                employee => `

                <option value="${employee.id}">
                    ${escapeHTML(
                        employee.name
                    )}
                    -
                    ${escapeHTML(
                        employee.code
                    )}
                </option>

            `
            ).join("")
        }

    `;

}


function renderLeaves() {

    const employees =
        getEmployees();


    const leaves =
        getLeaves();


    const tbody =
        $("#leaveTableBody");


    $("#pendingLeaves").textContent =
        formatNumber(
            leaves.filter(
                item =>
                    item.status === "pending"
            ).length
        );


    $("#approvedLeaves").textContent =
        formatNumber(
            leaves.filter(
                item =>
                    item.status === "approved"
            ).length
        );


    $("#rejectedLeaves").textContent =
        formatNumber(
            leaves.filter(
                item =>
                    item.status === "rejected"
            ).length
        );


    $("#totalLeaveDays").textContent =
        formatNumber(
            leaves
                .filter(
                    item =>
                        item.status === "approved"
                )
                .reduce(
                    (sum, item) =>
                        sum +
                        Number(item.days || 0),
                    0
                )
        );


    if (!leaves.length) {

        tbody.innerHTML = `

            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        درخواست مرخصی ثبت نشده است.
                    </div>
                </td>
            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        leaves.slice().reverse().map(
            leave => {

                const employee =
                    employees.find(
                        item =>
                            item.id ===
                            leave.employeeId
                    );


                return `

                    <tr>

                        <td>

                            <div class="employee-info">

                                <div class="employee-avatar">
                                    ${escapeHTML(
                                        initials(
                                            employee?.name
                                        )
                                    )}
                                </div>

                                <div>

                                    <strong>
                                        ${escapeHTML(
                                            employee?.name ||
                                            "نامشخص"
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
                                leave.type
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                leave.start
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                leave.end
                            )}
                        </td>


                        <td>
                            ${formatNumber(
                                leave.days
                            )}
                        </td>


                        <td>

                            <span class="employee-status ${
                                leave.status
                            }">

                                ${
                                    leave.status === "pending"
                                        ? "در انتظار"
                                        : leave.status === "approved"
                                            ? "تأیید شده"
                                            : "رد شده"
                                }

                            </span>

                        </td>


                        <td>

                            <div class="action-buttons">

                                ${
                                    leave.status === "pending"
                                    ? `

                                        <button
                                            class="action-btn"
                                            data-action="approveLeave"
                                            data-id="${leave.id}"
                                            title="تأیید"
                                            type="button"
                                        >
                                            <i class="fa-solid fa-check"></i>
                                        </button>


                                        <button
                                            class="action-btn delete"
                                            data-action="rejectLeave"
                                            data-id="${leave.id}"
                                            title="رد"
                                            type="button"
                                        >
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>

                                    `
                                    : ""
                                }

                            </div>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


function saveLeave(
    event
) {

    event.preventDefault();


    const start =
        $("#leaveStart").value;

    const end =
        $("#leaveEnd").value;


    const days =
        calculateDays(
            start,
            end
        );


    if (!days) {

        showToast(
            "تاریخ پایان باید بعد از تاریخ شروع باشد.",
            "خطا",
            "error"
        );

        return;

    }


    const leaves =
        getLeaves();


    const leave = {

        id: uid("leave"),

        employeeId:
            $("#leaveEmployee").value,

        type:
            $("#leaveType").value,

        start,

        end,

        days,

        description:
            $("#leaveDescription").value.trim(),

        status:
            "pending"

    };


    leaves.push(
        leave
    );


    save(
        STORAGE.leaves,
        leaves
    );


    addNotification(
        "درخواست مرخصی جدید",
        "یک درخواست مرخصی جدید برای بررسی ثبت شد.",
        "fa-solid fa-calendar-days"
    );


    addActivity(
        "ثبت مرخصی",
        "درخواست مرخصی جدید ثبت شد."
    );


    closeModal("leaveModal");


    $("#leaveForm").reset();


    showToast(
        "درخواست مرخصی ثبت شد."
    );


    renderLeaves();

    updateBadges();

}


function updateLeaveStatus(
    id,
    status
) {

    const leaves =
        getLeaves();


    const leave =
        leaves.find(
            item =>
                item.id === id
        );


    if (!leave)
        return;


    leave.status =
        status;


    save(
        STORAGE.leaves,
        leaves
    );


    addActivity(
        status === "approved"
            ? "تأیید مرخصی"
            : "رد مرخصی",
        "وضعیت درخواست مرخصی تغییر کرد."
    );


    showToast(
        status === "approved"
            ? "درخواست مرخصی تأیید شد."
            : "درخواست مرخصی رد شد."
    );


    renderLeaves();

    updateBadges();

}


/* =========================================================
   PAYROLL
========================================================= */

function ensurePayrollForEmployee(
    employee
) {

    const payroll =
        getPayroll();


    const exists =
        payroll.some(
            item =>
                item.employeeId === employee.id
        );


    if (!exists) {

        payroll.push({

            id: uid("pay"),

            employeeId:
                employee.id,

            base:
                Number(employee.salary || 0),

            overtime: 0,

            bonus: 0,

            insurance:
                Math.round(
                    Number(employee.salary || 0) *
                    .07
                ),

            tax: 0,

            other: 0

        });


        save(
            STORAGE.payroll,
            payroll
        );

    }

}


function payrollNet(
    payroll
) {

    const gross =
        Number(payroll.base || 0) +
        Number(payroll.overtime || 0) +
        Number(payroll.bonus || 0);


    const deductions =
        Number(payroll.insurance || 0) +
        Number(payroll.tax || 0) +
        Number(payroll.other || 0);


    return (
        gross -
        deductions
    );

}


function renderPayroll() {

    const employees =
        getEmployees();


    const payroll =
        getPayroll();


    let grossTotal = 0;

    let deductionTotal = 0;

    let netTotal = 0;


    const tbody =
        $("#payrollTableBody");


    tbody.innerHTML =
        employees.map(
            employee => {

                ensurePayrollForEmployee(
                    employee
                );

                const data =
                    getPayroll()
                        .find(
                            item =>
                                item.employeeId ===
                                employee.id
                        ) || {

                            base: 0,
                            overtime: 0,
                            bonus: 0,
                            insurance: 0,
                            tax: 0,
                            other: 0

                        };


                const gross =
                    Number(data.base || 0) +
                    Number(data.overtime || 0) +
                    Number(data.bonus || 0);


                const deductions =
                    Number(data.insurance || 0) +
                    Number(data.tax || 0) +
                    Number(data.other || 0);


                const net =
                    gross -
                    deductions;


                grossTotal +=
                    gross;

                deductionTotal +=
                    deductions;

                netTotal +=
                    net;


                return `

                    <tr>

                        <td>

                            <div class="employee-info">

                                <div class="employee-avatar">
                                    ${escapeHTML(
                                        initials(
                                            employee.name
                                        )
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
                                            employee.position
                                        )}
                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>
                            ${toman(data.base)}
                        </td>


                        <td>
                            ${toman(data.overtime)}
                        </td>


                        <td>
                            ${toman(data.bonus)}
                        </td>


                        <td>
                            ${toman(deductions)}
                        </td>


                        <td>

                            <strong style="color:#15803d">
                                ${toman(net)}
                            </strong>

                        </td>


                        <td>

                            <button
                                class="action-btn"
                                data-action="editPayroll"
                                data-id="${employee.id}"
                                title="ویرایش حقوق"
                                type="button"
                            >
                                <i class="fa-solid fa-pen"></i>
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    $("#grossPayroll").textContent =
        toman(grossTotal);

    $("#deductionPayroll").textContent =
        toman(deductionTotal);

    $("#netPayroll").textContent =
        toman(netTotal);

}


function openPayrollModal(
    employeeId
) {

    const employee =
        getEmployees()
            .find(
                item =>
                    item.id === employeeId
            );


    if (!employee)
        return;


    ensurePayrollForEmployee(
        employee
    );


    const data =
        getPayroll()
            .find(
                item =>
                    item.employeeId ===
                    employeeId
            );


    $("#payrollEmployeeId").value =
        employeeId;


    $("#payrollBase").value =
        data.base || 0;

    $("#payrollOvertime").value =
        data.overtime || 0;

    $("#payrollBonus").value =
        data.bonus || 0;

    $("#payrollInsurance").value =
        data.insurance || 0;

    $("#payrollTax").value =
        data.tax || 0;

    $("#payrollOther").value =
        data.other || 0;


    updatePayrollPreview();


    openModal(
        "payrollModal"
    );

}


function updatePayrollPreview() {

    const base =
        Number(
            $("#payrollBase").value || 0
        );

    const overtime =
        Number(
            $("#payrollOvertime").value || 0
        );

    const bonus =
        Number(
            $("#payrollBonus").value || 0
        );

    const insurance =
        Number(
            $("#payrollInsurance").value || 0
        );

    const tax =
        Number(
            $("#payrollTax").value || 0
        );

    const other =
        Number(
            $("#payrollOther").value || 0
        );


    const net =
        base +
        overtime +
        bonus -
        insurance -
        tax -
        other;


    $("#payrollNetPreview").textContent =
        toman(net);

}


function savePayroll(
    event
) {

    event.preventDefault();


    const employeeId =
        $("#payrollEmployeeId").value;


    const payroll =
        getPayroll();


    let data =
        payroll.find(
            item =>
                item.employeeId === employeeId
        );


    if (!data) {

        data = {

            id: uid("pay"),

            employeeId

        };

        payroll.push(
            data
        );

    }


    data.base =
        Number(
            $("#payrollBase").value || 0
        );

    data.overtime =
        Number(
            $("#payrollOvertime").value || 0
        );

    data.bonus =
        Number(
            $("#payrollBonus").value || 0
        );

    data.insurance =
        Number(
            $("#payrollInsurance").value || 0
        );

    data.tax =
        Number(
            $("#payrollTax").value || 0
        );

    data.other =
        Number(
            $("#payrollOther").value || 0
        );


    save(
        STORAGE.payroll,
        payroll
    );


    addActivity(
        "ویرایش حقوق",
        "اطلاعات حقوق و کسورات به‌روزرسانی شد."
    );


    closeModal(
        "payrollModal"
    );


    showToast(
        "اطلاعات حقوق ذخیره شد."
    );


    renderPayroll();

}


/* =========================================================
   REPORTS
========================================================= */

function renderReports() {

    const employees =
        getEmployees();


    const attendance =
        getAttendance()
            .filter(
                item =>
                    item.date === today()
            );


    const leaves =
        getLeaves();


    const payroll =
        getPayroll();


    const activeEmployees =
        employees.filter(
            employee =>
                employee.status === "active"
        ).length;


    const present =
        attendance.filter(
            item =>
                item.status === "present" ||
                item.status === "late"
        ).length;


    const attendancePercent =
        activeEmployees
            ? Math.round(
                (
                    present /
                    activeEmployees
                ) * 100
            )
            : 0;


    const totalNet =
        payroll.reduce(
            (sum, item) =>
                sum +
                payrollNet(item),
            0
        );


    $("#reportEmployees").textContent =
        formatNumber(
            activeEmployees
        );


    $("#reportAttendance").textContent =
        `${formatNumber(attendancePercent)}%`;


    $("#reportLeaves").textContent =
        formatNumber(
            leaves.length
        );


    $("#reportPayroll").textContent =
        formatNumber(
            totalNet
        );


    $("#attendancePercent").textContent =
        `${formatNumber(attendancePercent)}%`;


    $("#attendanceProgress").style.width =
        `${attendancePercent}%`;


    renderDepartmentReport(
        employees
    );

}


function renderDepartmentReport(
    employees
) {

    const container =
        $("#departmentReport");


    const departments = {};


    employees.forEach(
        employee => {

            departments[
                employee.department
            ] =
                (
                    departments[
                        employee.department
                    ] || 0
                ) + 1;

        }
    );


    const values =
        Object.entries(
            departments
        );


    if (!values.length) {

        container.innerHTML =
            '<div class="empty-state">اطلاعاتی وجود ندارد.</div>';

        return;

    }


    const max =
        Math.max(
            ...values.map(
                item =>
                    item[1]
            )
        );


    container.innerHTML =
        values.map(
            ([name,count]) => {

                const percent =
                    Math.round(
                        (
                            count /
                            max
                        ) * 100
                    );


                return `

                    <div class="department-row">

                        <span class="department-name">
                            ${escapeHTML(name)}
                        </span>

                        <div class="department-progress">

                            <div class="progress">

                                <div
                                    class="progress-bar"
                                    style="width:${percent}%"
                                ></div>

                            </div>

                        </div>

                        <span class="department-count">
                            ${formatNumber(count)}
                        </span>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function addNotification(
    title,
    message,
    icon = "fa-solid fa-bell"
) {

    const notifications =
        getNotifications();


    notifications.push({

        id: uid("not"),

        title,

        message,

        time: "همین الان",

        unread: true,

        icon

    });


    save(
        STORAGE.notifications,
        notifications.slice(-50)
    );


    updateBadges();

}


function renderNotifications() {

    const notifications =
        getNotifications()
            .slice()
            .reverse();


    const container =
        $("#notificationsList");


    if (!notifications.length) {

        container.innerHTML =
            '<div class="empty-state">اعلانی وجود ندارد.</div>';

        return;

    }


    container.innerHTML =
        notifications.map(
            notification => `

                <div
                    class="notification-item ${
                        notification.unread
                            ? "unread"
                            : ""
                    }"
                    data-id="${notification.id}"
                >

                    <div class="notification-icon">

                        <i class="${escapeHTML(
                            notification.icon ||
                            "fa-solid fa-bell"
                        )}"></i>

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
                            ${escapeHTML(
                                notification.time
                            )}
                        </small>

                    </div>


                    ${
                        notification.unread
                        ? `

                            <button
                                class="action-btn"
                                data-action="readNotification"
                                data-id="${notification.id}"
                                title="خوانده شد"
                                type="button"
                            >
                                <i class="fa-solid fa-check"></i>
                            </button>

                        `
                        : ""
                    }

                </div>

            `
        ).join("");

}


function markNotificationRead(
    id
) {

    const notifications =
        getNotifications();


    const item =
        notifications.find(
            notification =>
                notification.id === id
        );


    if (!item)
        return;


    item.unread =
        false;


    save(
        STORAGE.notifications,
        notifications
    );


    renderNotifications();

    updateBadges();

}


function markAllNotificationsRead() {

    const notifications =
        getNotifications();


    notifications.forEach(
        item =>
            item.unread = false
    );


    save(
        STORAGE.notifications,
        notifications
    );


    renderNotifications();

    updateBadges();


    showToast(
        "همه اعلان‌ها خوانده شدند."
    );

}


/* BADGES */

function updateBadges() {

    const leaves =
        getLeaves();


    const notifications =
        getNotifications();


    const pending =
        leaves.filter(
            item =>
                item.status === "pending"
        ).length;


    const unread =
        notifications.filter(
            item =>
                item.unread
        ).length;


    $("#leaveMenuBadge").textContent =
        formatNumber(pending);


    $("#notificationMenuBadge").textContent =
        formatNumber(unread);


    $("#notificationBadge").textContent =
        formatNumber(unread);


    $("#notificationBadge").style.display =
        unread > 0
            ? "flex"
            : "none";

}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    const modal =
        $(`#${id}`);


    if (modal)
        modal.classList.add("show");

}


function closeModal(id) {

    const modal =
        $(`#${id}`);


    if (modal)
        modal.classList.remove("show");

}


function closeAllModals() {

    $$(".modal").forEach(
        modal =>
            modal.classList.remove("show")
    );

}


/* =========================================================
   EVENT HANDLERS
========================================================= */

function setupEvents() {


    /* NAVIGATION */

    document.addEventListener(
        "click",
        event => {

            const pageButton =
                event.target.closest(
                    "[data-page]"
                );


            if (pageButton) {

                const page =
                    pageButton.dataset.page;


                showPage(page);

            }

        }
    );


    /* MENU */

    $("#mobileMenuBtn")
        .addEventListener(
            "click",
            () => {

                const sidebar =
                    $("#sidebar");


                if (
                    sidebar.classList.contains(
                        "open"
                    )
                ) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );


    $("#menuOverlay")
        .addEventListener(
            "click",
            closeMobileMenu
        );


    /* ADD EMPLOYEE */

    $("#addEmployeeBtn")
        .addEventListener(
            "click",
            () =>
                openEmployeeModal()
        );


    /* EMPLOYEE FORM */

    $("#employeeForm")
        .addEventListener(
            "submit",
            saveEmployee
        );


    /* SEARCH */

    $("#employeeSearch")
        .addEventListener(
            "input",
            renderEmployees
        );


    $("#employeeDepartmentFilter")
        .addEventListener(
            "change",
            renderEmployees
        );


    /* ATTENDANCE DATE */

    $("#attendanceDate").value =
        today();


    $("#attendanceDate")
        .addEventListener(
            "change",
            renderAttendance
        );


    /* LEAVE */

    $("#addLeaveBtn")
        .addEventListener(
            "click",
            () => {

                populateLeaveEmployees();

                openModal(
                    "leaveModal"
                );

            }
        );


    $("#leaveForm")
        .addEventListener(
            "submit",
            saveLeave
        );


    $("#leaveStart")
        .addEventListener(
            "change",
            () => {

                const start =
                    $("#leaveStart").value;


                const end =
                    $("#leaveEnd").value;


                if (
                    start &&
                    end &&
                    end < start
                ) {

                    $("#leaveEnd").value =
                        start;

                }

            }
        );


    /* PAYROLL */

    $("#payrollForm")
        .addEventListener(
            "submit",
            savePayroll
        );


    [
        "#payrollBase",
        "#payrollOvertime",
        "#payrollBonus",
        "#payrollInsurance",
        "#payrollTax",
        "#payrollOther"
    ].forEach(
        selector => {

            $(selector)
                .addEventListener(
                    "input",
                    updatePayrollPreview
                );

        }
    );


    $("#calculatePayrollBtn")
        .addEventListener(
            "click",
            () => {

                renderPayroll();

                showToast(
                    "حقوق کارکنان محاسبه شد."
                );

            }
        );


    /* NOTIFICATIONS */

    $("#notificationButton")
        .addEventListener(
            "click",
            () =>
                showPage(
                    "notifications"
                )
        );


    $("#markAllNotifications")
        .addEventListener(
            "click",
            markAllNotificationsRead
        );


    /* PROFILE */

    $("#profileButton")
        .addEventListener(
            "click",
            () => {

                $$(".page").forEach(
                    page =>
                        page.classList.remove(
                            "active-page"
                        )
                );


                $("#profileView")
                    .classList.add("show");

                $("#pageTitle").textContent =
                    "پروفایل مدیر";

                $("#pageSubtitle").textContent =
                    "اطلاعات حساب کاربری";

            }
        );


    /* PRINT */

    $("#printReportBtn")
        .addEventListener(
            "click",
            () =>
                window.print()
        );


    /* CLOSE MODALS */

    document.addEventListener(
        "click",
        event => {

            const closeButton =
                event.target.closest(
                    "[data-close]"
                );


            if (closeButton) {

                closeModal(
                    closeButton.dataset.close
                );

            }

        }
    );


    /* CLICK OUTSIDE MODAL */

    $$(".modal").forEach(
        modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        modal
                    ) {

                        closeModal(
                            modal.id
                        );

                    }

                }
            );

        }
    );


    /* ESC */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeAllModals();

                closeMobileMenu();

            }

        }
    );


    /* TABLE ACTIONS */

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button)
                return;


            const action =
                button.dataset.action;

            const id =
                button.dataset.id;


            switch (action) {

                case "editEmployee":

                    editEmployee(id);

                    break;


                case "viewEmployee":

                    viewEmployee(id);

                    break;


                case "deleteEmployee":

                    deleteEmployee(id);

                    break;


                case "approveLeave":

                    updateLeaveStatus(
                        id,
                        "approved"
                    );

                    break;


                case "rejectLeave":

                    updateLeaveStatus(
                        id,
                        "rejected"
                    );

                    break;


                case "editPayroll":

                    openPayrollModal(id);

                    break;


                case "readNotification":

                    markNotificationRead(id);

                    break;

            }

        }
    );


    /* ATTENDANCE SAVE */

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".save-attendance"
                );


            if (!button)
                return;


            saveAttendance(
                button.dataset.employee
            );

        }
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

    renderPayroll();

    renderReports();

    renderNotifications();

    updateBadges();

}


/* =========================================================
   INIT
========================================================= */

function init() {

    createDefaultData();

    setupEvents();

    renderAll();

    showPage(
        "dashboard"
    );

}


document.addEventListener(
    "DOMContentLoaded",
    init
);
