/* =========================================================
   MIRZA KHAN HR
   Complete Front-End Application
========================================================= */


/* =========================================================
   DATABASE
========================================================= */

const STORAGE_KEY = "mirza_khan_hr_database";

const defaultDatabase = {

    users: [
        {
            id: "admin",
            username: "admin",
            password: "1234",
            role: "admin",
            employeeId: null
        }
    ],

    employees: [],

    attendance: [],

    leaves: [],

    activities: []

};


let db = loadDatabase();

let currentUser = null;


/* =========================================================
   STORAGE
========================================================= */

function loadDatabase() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultDatabase)
        );

        return JSON.parse(
            JSON.stringify(defaultDatabase)
        );
    }

    try {

        const data = JSON.parse(saved);

        data.users ||= [];
        data.employees ||= [];
        data.attendance ||= [];
        data.leaves ||= [];
        data.activities ||= [];

        return data;

    } catch (error) {

        console.error(error);

        return JSON.parse(
            JSON.stringify(defaultDatabase)
        );

    }

}


function saveDatabase() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(db)
    );

}


/* =========================================================
   HELPERS
========================================================= */

function $(id) {
    return document.getElementById(id);
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

    const d = new Date();

    return d.toISOString().split("T")[0];

}


function formatMoney(value) {

    return Number(value || 0)
        .toLocaleString("fa-IR") + " تومان";

}


function formatDate(date) {

    if (!date) {
        return "-";
    }

    try {

        return new Date(date).toLocaleDateString(
            "fa-IR"
        );

    } catch {

        return date;

    }

}


function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function getEmployee(id) {

    return db.employees.find(
        employee => employee.id === id
    );

}


function getCurrentEmployee() {

    if (!currentUser?.employeeId) {
        return null;
    }

    return getEmployee(currentUser.employeeId);

}


function addActivity(text) {

    db.activities.unshift({
        id: uid("activity"),
        text,
        date: new Date().toISOString()
    });

    db.activities = db.activities.slice(0, 30);

    saveDatabase();

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    title = "موفق",
    type = "success"
) {

    const toast = $("toast");

    if (!toast) {
        return;
    }

    $("toastTitle").textContent = title;

    $("toastMessage").textContent = message;

    const icon = $("toastIcon");

    if (type === "error") {

        icon.style.background = "#fee2e2";
        icon.style.color = "#dc2626";

        icon.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';

    } else {

        icon.style.background = "#dcfce7";
        icon.style.color = "#166534";

        icon.innerHTML =
            '<i class="fa-solid fa-check"></i>';

    }

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================================
   AUTH
========================================================= */

function showLogin() {

    $("loginBox").classList.remove("hidden");

    $("registerBox").classList.add("hidden");

}


function showRegister() {

    $("loginBox").classList.add("hidden");

    $("registerBox").classList.remove("hidden");

}


$("showRegisterBtn").addEventListener(
    "click",
    showRegister
);


$("showLoginBtn").addEventListener(
    "click",
    showLogin
);


/* PASSWORD TOGGLE */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(".password-toggle");

        if (!button) {
            return;
        }

        const input =
            $(button.dataset.target);

        if (!input) {
            return;
        }

        if (input.type === "password") {

            input.type = "text";

            button.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            input.type = "password";

            button.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    }
);


/* LOGIN */

$("loginForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const username =
            $("loginUsername").value.trim();

        const password =
            $("loginPassword").value;

        const user = db.users.find(
            item =>
                item.username === username &&
                item.password === password
        );

        if (!user) {

            showToast(
                "نام کاربری یا رمز عبور اشتباه است.",
                "خطا",
                "error"
            );

            return;
        }

        currentUser = user;

        sessionStorage.setItem(
            "mirza_current_user",
            user.id
        );

        openApplication();

    }
);


/* REGISTER */

$("registerForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const name =
            $("registerName").value.trim();

        const nationalCode =
            $("registerNationalCode").value.trim();

        const username =
            $("registerUsername").value.trim();

        const password =
            $("registerPassword").value;

        if (
            db.users.some(
                user =>
                    user.username.toLowerCase() ===
                    username.toLowerCase()
            )
        ) {

            showToast(
                "این نام کاربری قبلاً استفاده شده است.",
                "خطا",
                "error"
            );

            return;
        }


        if (
            db.employees.some(
                employee =>
                    employee.nationalCode === nationalCode
            )
        ) {

            showToast(
                "این کد ملی قبلاً ثبت شده است.",
                "خطا",
                "error"
            );

            return;
        }


        const employee = {

            id: uid("employee"),

            name,

            nationalCode,

            code: "MK-" +
                Math.floor(
                    1000 +
                    Math.random() * 9000
                ),

            birthDate: "",

            department: "اداری",

            position: "کارمند",

            phone: "",

            hireDate: today(),

            salary: 0,

            status: "active",

            payroll: {

                base: 0,
                overtime: 0,
                bonus: 0,
                insurance: 0,
                tax: 0,
                other: 0

            }

        };


        db.employees.push(employee);


        const user = {

            id: uid("user"),

            username,

            password,

            role: "employee",

            employeeId: employee.id

        };


        db.users.push(user);


        addActivity(
            `کارمند جدید ${name} ثبت‌نام کرد.`
        );


        saveDatabase();


        $("registerForm").reset();

        showLogin();


        showToast(
            "ثبت‌نام با موفقیت انجام شد. اکنون وارد شوید."
        );

    }
);


/* =========================================================
   APPLICATION OPEN
========================================================= */

function openApplication() {

    $("authPage").classList.add("hidden");

    $("app").classList.remove("hidden");

    setupUserInterface();

    renderAll();

}


function setupUserInterface() {

    if (!currentUser) {
        return;
    }

    const isAdmin =
        currentUser.role === "admin";


    $("adminMenu")
        .classList.toggle(
            "hidden",
            !isAdmin
        );


    $("employeeMenu")
        .classList.toggle(
            "hidden",
            isAdmin
        );


    if (isAdmin) {

        $("topUserName").textContent =
            "مدیر سیستم";

        $("topUserRole").textContent =
            "مدیریت منابع انسانی";

        $("topAvatar").textContent = "م";

        navigateTo("dashboard");

    } else {

        const employee =
            getCurrentEmployee();

        $("topUserName").textContent =
            employee?.name || "کارمند";

        $("topUserRole").textContent =
            employee?.position || "کارمند";

        $("topAvatar").textContent =
            employee?.name?.charAt(0) || "ک";

        navigateTo("myProfile");

    }

}


/* LOGOUT */

$("logoutBtn").addEventListener(
    "click",
    function () {

        currentUser = null;

        sessionStorage.removeItem(
            "mirza_current_user"
        );

        $("app").classList.add("hidden");

        $("authPage").classList.remove("hidden");

        $("loginForm").reset();

        showLogin();

        showToast("با موفقیت خارج شدید.");

    }
);


/* =========================================================
   NAVIGATION
========================================================= */

function navigateTo(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove(
                "active-page"
            );

        });


    const target =
        $("page-" + page);

    if (!target) {
        return;
    }

    target.classList.add(
        "active-page"
    );


    document
        .querySelectorAll(".menu-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        });


    const titles = {

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
            "مدیریت حضور کارکنان"
        ],

        leave: [
            "مدیریت مرخصی",
            "بررسی درخواست‌های مرخصی"
        ],

        payroll: [
            "حقوق و کسورات",
            "مدیریت پرداختی کارکنان"
        ],

        reports: [
            "گزارش‌ها",
            "گزارش مدیریتی سامانه"
        ],

        myProfile: [
            "پروفایل من",
            "اطلاعات شخصی و شغلی"
        ],

        myAttendance: [
            "حضور و غیاب من",
            "سوابق حضور و غیاب"
        ],

        myLeave: [
            "مرخصی من",
            "درخواست و پیگیری مرخصی"
        ],

        myPayroll: [
            "حقوق من",
            "مشاهده حقوق و کسورات"
        ]

    };


    if (titles[page]) {

        $("pageTitle").textContent =
            titles[page][0];

        $("pageSubtitle").textContent =
            titles[page][1];

    }


    if (window.innerWidth <= 1000) {

        $("sidebar").classList.remove("open");

        $("menuOverlay").classList.remove("show");

    }


    renderPage(page);

}


document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("[data-page]");

        if (!button) {
            return;
        }

        const page =
            button.dataset.page;

        if (!page) {
            return;
        }

        navigateTo(page);

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

$("mobileMenuBtn").addEventListener(
    "click",
    function () {

        $("sidebar").classList.add("open");

        $("menuOverlay").classList.add("show");

    }
);


$("menuOverlay").addEventListener(
    "click",
    function () {

        $("sidebar").classList.remove("open");

        $("menuOverlay").classList.remove("show");

    }
);


/* =========================================================
   EMPLOYEES
========================================================= */

$("addEmployeeBtn").addEventListener(
    "click",
    function () {

        $("employeeModalTitle").textContent =
            "افزودن کارمند";

        $("employeeForm").reset();

        $("employeeId").value = "";

        openModal("employeeModal");

    }
);


$("employeeForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const id =
            $("employeeId").value;

        const employeeData = {

            name:
                $("employeeName").value.trim(),

            nationalCode:
                $("employeeNationalCode").value.trim(),

            code:
                $("employeeCode").value.trim(),

            birthDate:
                $("employeeBirthDate").value,

            department:
                $("employeeDepartment").value,

            position:
                $("employeePosition").value.trim(),

            phone:
                $("employeePhone").value.trim(),

            hireDate:
                $("employeeHireDate").value,

            salary:
                Number(
                    $("employeeSalary").value || 0
                ),

            status:
                $("employeeStatus").value

        };


        if (id) {

            const employee =
                getEmployee(id);

            if (!employee) {
                return;
            }

            Object.assign(
                employee,
                employeeData
            );

            addActivity(
                `اطلاعات ${employee.name} ویرایش شد.`
            );

            showToast(
                "اطلاعات کارمند ویرایش شد."
            );

        } else {

            const employee = {

                id: uid("employee"),

                ...employeeData,

                payroll: {

                    base: employeeData.salary,
                    overtime: 0,
                    bonus: 0,
                    insurance: 0,
                    tax: 0,
                    other: 0

                }

            };


            db.employees.push(employee);


            addActivity(
                `کارمند ${employee.name} اضافه شد.`
            );


            showToast(
                "کارمند با موفقیت اضافه شد."
            );

        }


        saveDatabase();

        closeModal("employeeModal");

        renderAll();

    }
);


/* EMPLOYEE SEARCH */

$("employeeSearch").addEventListener(
    "input",
    renderEmployees
);

$("employeeDepartmentFilter").addEventListener(
    "change",
    renderEmployees
);


/* =========================================================
   RENDER EMPLOYEES
========================================================= */

function renderEmployees() {

    const body =
        $("employeesTableBody");

    if (!body) {
        return;
    }


    const search =
        $("employeeSearch")
            .value
            .trim()
            .toLowerCase();


    const department =
        $("employeeDepartmentFilter")
            .value;


    const employees =
        db.employees.filter(employee => {

            const matchesSearch =
                !search ||
                employee.name.toLowerCase().includes(search) ||
                employee.nationalCode.includes(search) ||
                employee.code.toLowerCase().includes(search);


            const matchesDepartment =
                !department ||
                employee.department === department;


            return (
                matchesSearch &&
                matchesDepartment
            );

        });


    if (!employees.length) {

        body.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        هنوز کارمندی ثبت نشده است.
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML =
        employees.map(employee => `

            <tr>

                <td>

                    <div class="employee-cell">

                        <div class="employee-avatar">
                            ${escapeHtml(
                                employee.name.charAt(0)
                            )}
                        </div>

                        <div>

                            <strong>
                                ${escapeHtml(employee.name)}
                            </strong>

                            <small>
                                کد ملی:
                                ${escapeHtml(employee.nationalCode)}
                            </small>

                        </div>

                    </div>

                </td>


                <td>
                    ${escapeHtml(employee.code)}
                </td>


                <td>
                    ${escapeHtml(employee.department)}
                </td>


                <td>
                    ${escapeHtml(employee.position)}
                </td>


                <td>

                    <span
                        class="status ${
                            employee.status === "active"
                                ? "active"
                                : "inactive"
                        }"
                    >
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
                            class="action-btn edit"
                            title="ویرایش"
                            onclick="editEmployee('${employee.id}')"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>


                        <button
                            class="action-btn attendance"
                            title="ثبت حضور"
                            onclick="openAttendance('${employee.id}')"
                        >
                            <i class="fa-solid fa-clock"></i>
                        </button>


                        <button
                            class="action-btn delete"
                            title="حذف"
                            onclick="deleteEmployee('${employee.id}')"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>

            </tr>

        `).join("");

}


/* EDIT EMPLOYEE */

function editEmployee(id) {

    const employee =
        getEmployee(id);

    if (!employee) {
        return;
    }


    $("employeeModalTitle").textContent =
        "ویرایش اطلاعات کارمند";


    $("employeeId").value =
        employee.id;

    $("employeeName").value =
        employee.name || "";

    $("employeeNationalCode").value =
        employee.nationalCode || "";

    $("employeeCode").value =
        employee.code || "";

    $("employeeBirthDate").value =
        employee.birthDate || "";

    $("employeeDepartment").value =
        employee.department || "";

    $("employeePosition").value =
        employee.position || "";

    $("employeePhone").value =
        employee.phone || "";

    $("employeeHireDate").value =
        employee.hireDate || "";

    $("employeeSalary").value =
        employee.salary || 0;

    $("employeeStatus").value =
        employee.status || "active";


    openModal("employeeModal");

}


window.editEmployee = editEmployee;


/* DELETE */

function deleteEmployee(id) {

    const employee =
        getEmployee(id);

    if (!employee) {
        return;
    }


    if (
        !confirm(
            `آیا از حذف ${employee.name} مطمئن هستید؟`
        )
    ) {
        return;
    }


    db.employees =
        db.employees.filter(
            item => item.id !== id
        );


    db.users =
        db.users.filter(
            user => user.employeeId !== id
        );


    db.attendance =
        db.attendance.filter(
            item => item.employeeId !== id
        );


    db.leaves =
        db.leaves.filter(
            item => item.employeeId !== id
        );


    addActivity(
        `کارمند ${employee.name} حذف شد.`
    );


    saveDatabase();

    renderAll();

    showToast(
        "کارمند حذف شد."
    );

}


window.deleteEmployee = deleteEmployee;


/* =========================================================
   ATTENDANCE
========================================================= */

$("attendanceDate").value =
    today();


$("attendanceDate").addEventListener(
    "change",
    renderAttendance
);


function openAttendance(id) {

    $("attendanceEmployeeId").value =
        id;

    const record =
        db.attendance.find(
            item =>
                item.employeeId === id &&
                item.date === $("attendanceDate").value
        );


    if (record) {

        $("attendanceStatus").value =
            record.status;

        $("attendanceIn").value =
            record.inTime || "";

        $("attendanceOut").value =
            record.outTime || "";

    } else {

        $("attendanceStatus").value =
            "present";

        $("attendanceIn").value = "";

        $("attendanceOut").value = "";

    }


    openModal("attendanceModal");

}


window.openAttendance = openAttendance;


$("attendanceForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const employeeId =
            $("attendanceEmployeeId").value;

        const date =
            $("attendanceDate").value ||
            today();

        const status =
            $("attendanceStatus").value;


        let record =
            db.attendance.find(
                item =>
                    item.employeeId === employeeId &&
                    item.date === date
            );


        if (!record) {

            record = {

                id: uid("attendance"),

                employeeId,

                date,

                status,

                inTime:
                    $("attendanceIn").value,

                outTime:
                    $("attendanceOut").value

            };

            db.attendance.push(record);

        } else {

            record.status = status;

            record.inTime =
                $("attendanceIn").value;

            record.outTime =
                $("attendanceOut").value;

        }


        const employee =
            getEmployee(employeeId);


        addActivity(
            `وضعیت حضور ${employee?.name || "کارمند"} ثبت شد.`
        );


        saveDatabase();

        closeModal("attendanceModal");

        renderAll();

        showToast(
            "حضور و غیاب ثبت شد."
        );

    }
);


/* RENDER ATTENDANCE */

function renderAttendance() {

    const body =
        $("attendanceTableBody");

    if (!body) {
        return;
    }


    const date =
        $("attendanceDate").value ||
        today();


    const employees =
        db.employees;


    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;


    body.innerHTML =
        employees.map(employee => {

            const record =
                db.attendance.find(
                    item =>
                        item.employeeId === employee.id &&
                        item.date === date
                );


            const status =
                record?.status || "absent";


            if (status === "present") {
                present++;
            }

            if (status === "absent") {
                absent++;
            }

            if (status === "late") {
                late++;
            }

            if (status === "leave") {
                leave++;
            }


            const labels = {

                present: "حاضر",
                absent: "غایب",
                late: "تأخیر",
                leave: "مرخصی"

            };


            return `

                <tr>

                    <td>
                        <div class="employee-cell">

                            <div class="employee-avatar">
                                ${escapeHtml(
                                    employee.name.charAt(0)
                                )}
                            </div>

                            <strong>
                                ${escapeHtml(employee.name)}
                            </strong>

                        </div>
                    </td>


                    <td>
                        ${record?.inTime || "-"}
                    </td>


                    <td>
                        ${record?.outTime || "-"}
                    </td>


                    <td>

                        <span class="status ${status}">
                            ${labels[status]}
                        </span>

                    </td>


                    <td>

                        <button
                            class="action-btn attendance"
                            title="ویرایش حضور"
                            onclick="openAttendance('${employee.id}')"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                    </td>

                </tr>

            `;

        }).join("");


    $("attendancePresent").textContent =
        present;

    $("attendanceAbsent").textContent =
        absent;

    $("attendanceLate").textContent =
        late;

    $("attendanceLeave").textContent =
        leave;

}


/* =========================================================
   LEAVE
========================================================= */

$("addLeaveBtn").addEventListener(
    "click",
    function () {

        prepareLeaveModal();

        openModal("leaveModal");

    }
);


$("employeeRequestLeaveBtn").addEventListener(
    "click",
    function () {

        prepareLeaveModal(
            getCurrentEmployee()?.id
        );

        openModal("leaveModal");

    }
);


function prepareLeaveModal(employeeId = "") {

    const select =
        $("leaveEmployee");


    select.innerHTML =
        db.employees
            .map(
                employee =>
                    `<option value="${employee.id}">
                        ${escapeHtml(employee.name)}
                    </option>`
            )
            .join("");


    if (employeeId) {

        select.value =
            employeeId;

        select.disabled = true;

    } else {

        select.disabled = false;

    }


    $("leaveForm").reset();

    if (employeeId) {
        select.value = employeeId;
        select.disabled = true;
    }

}


$("leaveForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const employeeId =
            $("leaveEmployee").value;


        const start =
            $("leaveStart").value;

        const end =
            $("leaveEnd").value;


        if (end < start) {

            showToast(
                "تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.",
                "خطا",
                "error"
            );

            return;
        }


        const startDate =
            new Date(start);

        const endDate =
            new Date(end);


        const days =
            Math.floor(
                (
                    endDate - startDate
                ) /
                (1000 * 60 * 60 * 24)
            ) + 1;


        const leave = {

            id: uid("leave"),

            employeeId,

            type:
                $("leaveType").value,

            start,

            end,

            days,

            description:
                $("leaveDescription").value.trim(),

            status:
                "pending",

            createdAt:
                new Date().toISOString()

        };


        db.leaves.push(leave);


        const employee =
            getEmployee(employeeId);


        addActivity(
            `درخواست مرخصی ${employee?.name || ""} ثبت شد.`
        );


        saveDatabase();

        closeModal("leaveModal");

        renderAll();

        showToast(
            "درخواست مرخصی ثبت شد."
        );

    }
);


/* RENDER LEAVE */

function renderLeaves() {

    const body =
        $("leaveTableBody");

    if (!body) {
        return;
    }


    const labels = {

        pending: "در انتظار بررسی",
        approved: "تأیید شده",
        rejected: "رد شده"

    };


    body.innerHTML =
        db.leaves.map(leave => {

            const employee =
                getEmployee(
                    leave.employeeId
                );


            return `

                <tr>

                    <td>
                        ${escapeHtml(
                            employee?.name || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(leave.type)}
                    </td>

                    <td>
                        ${formatDate(leave.start)}
                    </td>

                    <td>
                        ${formatDate(leave.end)}
                    </td>

                    <td>
                        ${leave.days}
                    </td>

                    <td>
                        <span class="status ${leave.status}">
                            ${labels[leave.status]}
                        </span>
                    </td>

                    <td>

                        ${
                            leave.status === "pending"
                                ? `
                                    <div class="action-buttons">

                                        <button
                                            class="action-btn approve"
                                            title="تأیید"
                                            onclick="approveLeave('${leave.id}')"
                                        >
                                            <i class="fa-solid fa-check"></i>
                                        </button>

                                        <button
                                            class="action-btn reject"
                                            title="رد"
                                            onclick="rejectLeave('${leave.id}')"
                                        >
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>

                                    </div>
                                `
                                : "-"
                        }

                    </td>

                </tr>

            `;

        }).join("");


    const pending =
        db.leaves.filter(
            item => item.status === "pending"
        ).length;


    const approved =
        db.leaves.filter(
            item => item.status === "approved"
        ).length;


    const rejected =
        db.leaves.filter(
            item => item.status === "rejected"
        ).length;


    const totalDays =
        db.leaves
            .filter(
                item =>
                    item.status === "approved"
            )
            .reduce(
                (sum, item) =>
                    sum + Number(item.days || 0),
                0
            );


    $("pendingLeaves").textContent =
        pending;

    $("approvedLeaves").textContent =
        approved;

    $("rejectedLeaves").textContent =
        rejected;

    $("totalLeaveDays").textContent =
        totalDays;

}


function approveLeave(id) {

    const leave =
        db.leaves.find(
            item => item.id === id
        );

    if (!leave) {
        return;
    }


    leave.status =
        "approved";


    const employee =
        getEmployee(leave.employeeId);


    addActivity(
        `مرخصی ${employee?.name || ""} تأیید شد.`
    );


    saveDatabase();

    renderAll();

    showToast(
        "درخواست مرخصی تأیید شد."
    );

}


window.approveLeave = approveLeave;


function rejectLeave(id) {

    const leave =
        db.leaves.find(
            item => item.id === id
        );

    if (!leave) {
        return;
    }


    leave.status =
        "rejected";


    const employee =
        getEmployee(leave.employeeId);


    addActivity(
        `مرخصی ${employee?.name || ""} رد شد.`
    );


    saveDatabase();

    renderAll();

    showToast(
        "درخواست مرخصی رد شد."
    );

}


window.rejectLeave = rejectLeave;


/* =========================================================
   PAYROLL
========================================================= */

$("calculatePayrollBtn").addEventListener(
    "click",
    function () {

        renderPayroll();

        showToast(
            "اطلاعات حقوق محاسبه و به‌روزرسانی شد."
        );

    }
);


function getPayroll(employee) {

    if (!employee.payroll) {

        employee.payroll = {

            base:
                Number(employee.salary || 0),

            overtime: 0,
            bonus: 0,
            insurance: 0,
            tax: 0,
            other: 0

        };

    }

    return employee.payroll;

}


function calculateNet(employee) {

    const p =
        getPayroll(employee);


    const gross =
        Number(p.base || 0) +
        Number(p.overtime || 0) +
        Number(p.bonus || 0);


    const deductions =
        Number(p.insurance || 0) +
        Number(p.tax || 0) +
        Number(p.other || 0);


    return {
        gross,
        deductions,
        net: gross - deductions
    };

}


function renderPayroll() {

    const body =
        $("payrollTableBody");

    if (!body) {
        return;
    }


    let grossTotal = 0;
    let deductionTotal = 0;
    let netTotal = 0;


    body.innerHTML =
        db.employees.map(employee => {

            const result =
                calculateNet(employee);


            grossTotal += result.gross;

            deductionTotal +=
                result.deductions;

            netTotal += result.net;


            return `

                <tr>

                    <td>
                        ${escapeHtml(employee.name)}
                    </td>

                    <td>
                        ${formatMoney(
                            employee.payroll?.base || 0
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            employee.payroll?.overtime || 0
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            employee.payroll?.bonus || 0
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            result.deductions
                        )}
                    </td>

                    <td>
                        <strong>
                            ${formatMoney(result.net)}
                        </strong>
                    </td>

                    <td>

                        <button
                            class="action-btn edit"
                            title="ویرایش حقوق"
                            onclick="editPayroll('${employee.id}')"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                    </td>

                </tr>

            `;

        }).join("");


    $("grossPayroll").textContent =
        formatMoney(grossTotal);

    $("deductionPayroll").textContent =
        formatMoney(deductionTotal);

    $("netPayroll").textContent =
        formatMoney(netTotal);


    saveDatabase();

}


function editPayroll(id) {

    const employee =
        getEmployee(id);

    if (!employee) {
        return;
    }


    const p =
        getPayroll(employee);


    $("payrollEmployeeId").value =
        id;

    $("payrollBase").value =
        p.base || 0;

    $("payrollOvertime").value =
        p.overtime || 0;

    $("payrollBonus").value =
        p.bonus || 0;

    $("payrollInsurance").value =
        p.insurance || 0;

    $("payrollTax").value =
        p.tax || 0;

    $("payrollOther").value =
        p.other || 0;


    updatePayrollPreview();

    openModal("payrollModal");

}


window.editPayroll = editPayroll;


[
    "payrollBase",
    "payrollOvertime",
    "payrollBonus",
    "payrollInsurance",
    "payrollTax",
    "payrollOther"
].forEach(id => {

    $(id).addEventListener(
        "input",
        updatePayrollPreview
    );

});


function updatePayrollPreview() {

    const gross =
        Number($("payrollBase").value || 0) +
        Number($("payrollOvertime").value || 0) +
        Number($("payrollBonus").value || 0);


    const deductions =
        Number($("payrollInsurance").value || 0) +
        Number($("payrollTax").value || 0) +
        Number($("payrollOther").value || 0);


    $("payrollNetPreview").textContent =
        formatMoney(
            gross - deductions
        );

}


$("payrollForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const employee =
            getEmployee(
                $("payrollEmployeeId").value
            );


        if (!employee) {
            return;
        }


        employee.payroll = {

            base:
                Number($("payrollBase").value || 0),

            overtime:
                Number($("payrollOvertime").value || 0),

            bonus:
                Number($("payrollBonus").value || 0),

            insurance:
                Number($("payrollInsurance").value || 0),

            tax:
                Number($("payrollTax").value || 0),

            other:
                Number($("payrollOther").value || 0)

        };


        employee.salary =
            employee.payroll.base;


        addActivity(
            `حقوق ${employee.name} ویرایش شد.`
        );


        saveDatabase();

        closeModal("payrollModal");

        renderAll();

        showToast(
            "اطلاعات حقوق ذخیره شد."
        );

    }
);


/* =========================================================
   MY PROFILE
========================================================= */

function renderMyProfile() {

    const employee =
        getCurrentEmployee();

    const container =
        $("myProfileContent");

    if (!container) {
        return;
    }


    if (!employee) {

        container.innerHTML = `
            <div class="card">
                <div style="padding:30px">
                    اطلاعات کارمند پیدا نشد.
                </div>
            </div>
        `;

        return;
    }


    container.innerHTML = `

        <div class="profile-card">

            <div class="profile-cover"></div>

            <div class="profile-main">

                <div class="big-avatar">
                    ${escapeHtml(
                        employee.name.charAt(0)
                    )}
                </div>


                <div class="profile-heading">

                    <h2>
                        ${escapeHtml(employee.name)}
                    </h2>

                    <p>
                        ${escapeHtml(employee.position)}
                        -
                        ${escapeHtml(employee.department)}
                    </p>

                </div>


                <div class="profile-info-grid">

                    <div class="profile-info">
                        <span>نام و نام خانوادگی</span>
                        <strong>${escapeHtml(employee.name)}</strong>
                    </div>

                    <div class="profile-info">
                        <span>کد ملی</span>
                        <strong>${escapeHtml(employee.nationalCode)}</strong>
                    </div>

                    <div class="profile-info">
                        <span>کد پرسنلی</span>
                        <strong>${escapeHtml(employee.code)}</strong>
                    </div>

                    <div class="profile-info">
                        <span>تاریخ تولد</span>
                        <strong>${formatDate(employee.birthDate)}</strong>
                    </div>

                    <div class="profile-info">
                        <span>واحد سازمانی</span>
                        <strong>${escapeHtml(employee.department)}</strong>
                    </div>

                    <div class="profile-info">
                        <span>سمت</span>
                        <strong>${escapeHtml(employee.position)}</strong>
                    </div>

                    <div class="profile-info">
                        <span>شماره تماس</span>
                        <strong>${escapeHtml(employee.phone || "-")}</strong>
                    </div>

                    <div class="profile-info">
                        <span>تاریخ استخدام</span>
                        <strong>${formatDate(employee.hireDate)}</strong>
                    </div>

                    <div class="profile-info">
                        <span>وضعیت</span>
                        <strong>
                            ${
                                employee.status === "active"
                                    ? "فعال"
                                    : "غیرفعال"
                            }
                        </strong>
                    </div>

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   MY ATTENDANCE
========================================================= */

function renderMyAttendance() {

    const body =
        $("myAttendanceBody");

    const employee =
        getCurrentEmployee();

    if (!body || !employee) {
        return;
    }


    const records =
        db.attendance
            .filter(
                item =>
                    item.employeeId === employee.id
            )
            .sort(
                (a, b) =>
                    b.date.localeCompare(a.date)
            );


    const labels = {

        present: "حاضر",
        absent: "غایب",
        late: "تأخیر",
        leave: "مرخصی"

    };


    if (!records.length) {

        body.innerHTML = `
            <tr>
                <td colspan="4">
                    هنوز سابقه‌ای ثبت نشده است.
                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML =
        records.map(record => `

            <tr>

                <td>
                    ${formatDate(record.date)}
                </td>

                <td>
                    ${record.inTime || "-"}
                </td>

                <td>
                    ${record.outTime || "-"}
                </td>

                <td>
                    <span class="status ${record.status}">
                        ${labels[record.status]}
                    </span>
                </td>

            </tr>

        `).join("");

}


/* =========================================================
   MY LEAVE
========================================================= */

function renderMyLeave() {

    const body =
        $("myLeaveBody");

    const employee =
        getCurrentEmployee();

    if (!body || !employee) {
        return;
    }


    const records =
        db.leaves
            .filter(
                item =>
                    item.employeeId === employee.id
            )
            .sort(
                (a, b) =>
                    b.createdAt.localeCompare(
                        a.createdAt
                    )
            );


    const labels = {

        pending: "در انتظار بررسی",
        approved: "تأیید شده",
        rejected: "رد شده"

    };


    if (!records.length) {

        body.innerHTML = `
            <tr>
                <td colspan="5">
                    هنوز درخواست مرخصی ثبت نکرده‌اید.
                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML =
        records.map(leave => `

            <tr>

                <td>
                    ${escapeHtml(leave.type)}
                </td>

                <td>
                    ${formatDate(leave.start)}
                </td>

                <td>
                    ${formatDate(leave.end)}
                </td>

                <td>
                    ${leave.days}
                </td>

                <td>
                    <span class="status ${leave.status}">
                        ${labels[leave.status]}
                    </span>
                </td>

            </tr>

        `).join("");

}


/* =========================================================
   MY PAYROLL
========================================================= */

function renderMyPayroll() {

    const container =
        $("myPayrollContent");

    const employee =
        getCurrentEmployee();

    if (!container || !employee) {
        return;
    }


    const result =
        calculateNet(employee);


    const p =
        getPayroll(employee);


    container.innerHTML = `

        <div class="payroll-summary">

            <div class="payroll-summary-card">
                <span>حقوق پایه</span>
                <strong>
                    ${formatMoney(p.base)}
                </strong>
            </div>

            <div class="payroll-summary-card">
                <span>اضافه‌کاری</span>
                <strong>
                    ${formatMoney(p.overtime)}
                </strong>
            </div>

            <div class="payroll-summary-card">
                <span>پاداش</span>
                <strong>
                    ${formatMoney(p.bonus)}
                </strong>
            </div>

        </div>


        <div class="card">

            <div class="section-card-header">
                <h3>
                    جزئیات حقوق
                </h3>
            </div>


            <div style="padding:20px">

                <div class="department-row">
                    <span>حقوق پایه</span>
                    <strong>
                        ${formatMoney(p.base)}
                    </strong>
                </div>

                <div class="department-row">
                    <span>اضافه‌کاری</span>
                    <strong>
                        ${formatMoney(p.overtime)}
                    </strong>
                </div>

                <div class="department-row">
                    <span>پاداش</span>
                    <strong>
                        ${formatMoney(p.bonus)}
                    </strong>
                </div>

                <div class="department-row">
                    <span>بیمه</span>
                    <strong>
                        ${formatMoney(p.insurance)}
                    </strong>
                </div>

                <div class="department-row">
                    <span>مالیات</span>
                    <strong>
                        ${formatMoney(p.tax)}
                    </strong>
                </div>

                <div class="department-row">
                    <span>سایر کسورات</span>
                    <strong>
                        ${formatMoney(p.other)}
                    </strong>
                </div>

                <div
                    class="department-row"
                    style="font-size:17px;color:#166534"
                >
                    <strong>حقوق خالص</strong>

                    <strong>
                        ${formatMoney(result.net)}
                    </strong>
                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const total =
        db.employees.length;


    const date =
        today();


    const records =
        db.attendance.filter(
            item => item.date === date
        );


    const present =
        records.filter(
            item => item.status === "present"
        ).length;


    const absent =
        records.filter(
            item => item.status === "absent"
        ).length;


    const late =
        records.filter(
            item => item.status === "late"
        ).length;


    $("totalEmployees").textContent =
        total;

    $("presentEmployees").textContent =
        present;

    $("absentEmployees").textContent =
        absent;

    $("lateEmployees").textContent =
        late;


    $("employeeMenuBadge").textContent =
        total;


    const pendingLeaves =
        db.leaves.filter(
            item =>
                item.status === "pending"
        ).length;


    $("leaveMenuBadge").textContent =
        pendingLeaves;


    $("recentEmployees").innerHTML =
        db.employees
            .slice(-5)
            .reverse()
            .map(employee => `

                <div class="department-row">

                    <div class="employee-cell">

                        <div class="employee-avatar">
                            ${escapeHtml(
                                employee.name.charAt(0)
                            )}
                        </div>

                        <div>

                            <strong>
                                ${escapeHtml(employee.name)}
                            </strong>

                            <small>
                                ${escapeHtml(employee.position)}
                            </small>

                        </div>

                    </div>

                    <span>
                        ${escapeHtml(employee.department)}
                    </span>

                </div>

            `)
            .join("");


    if (!db.employees.length) {

        $("recentEmployees").innerHTML = `
            <div style="padding:25px;color:#6b7280">
                هنوز کارمندی ثبت نشده است.
            </div>
        `;

    }


    $("recentActivities").innerHTML =
        db.activities
            .slice(0, 7)
            .map(activity => `

                <div class="department-row">

                    <div>

                        <strong>
                            ${escapeHtml(activity.text)}
                        </strong>

                        <small
                            style="
                                display:block;
                                color:#6b7280;
                                margin-top:4px
                            "
                        >
                            ${formatDate(
                                activity.date
                            )}
                        </small>

                    </div>

                </div>

            `)
            .join("");


    if (!db.activities.length) {

        $("recentActivities").innerHTML = `
            <div style="padding:25px;color:#6b7280">
                فعالیتی ثبت نشده است.
            </div>
        `;

    }

}


/* =========================================================
   REPORTS
========================================================= */

function renderReports() {

    const activeEmployees =
        db.employees.filter(
            employee =>
                employee.status === "active"
        ).length;


    const records =
        db.attendance;


    const attendanceRate =
        records.length
            ? Math.round(
                (
                    records.filter(
                        item =>
                            item.status === "present" ||
                            item.status === "late"
                    ).length /
                    records.length
                ) * 100
            )
            : 0;


    let payrollTotal = 0;

    db.employees.forEach(employee => {

        payrollTotal +=
            calculateNet(employee).net;

    });


    $("reportEmployees").textContent =
        activeEmployees;

    $("reportAttendance").textContent =
        attendanceRate + "%";

    $("reportLeaves").textContent =
        db.leaves.length;

    $("reportPayroll").textContent =
        Number(payrollTotal)
            .toLocaleString("fa-IR");


    $("attendancePercent").textContent =
        attendanceRate + "%";


    $("attendanceProgress").style.width =
        attendanceRate + "%";


    const departments = {};


    db.employees.forEach(employee => {

        departments[employee.department] =
            (departments[employee.department] || 0) + 1;

    });


    $("departmentReport").innerHTML =
        Object.entries(departments)
            .map(
                ([name, count]) => `

                    <div class="department-row">

                        <span>
                            ${escapeHtml(name)}
                        </span>

                        <strong>
                            ${count} نفر
                        </strong>

                    </div>

                `
            )
            .join("");


    if (!Object.keys(departments).length) {

        $("departmentReport").innerHTML = `
            <div style="padding:20px;color:#6b7280">
                اطلاعاتی وجود ندارد.
            </div>
        `;

    }

}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    const modal =
        $(id);

    if (modal) {
        modal.classList.add("show");
    }

}


function closeModal(id) {

    const modal =
        $(id);

    if (modal) {
        modal.classList.remove("show");
    }

}


document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-close]"
            );

        if (!button) {
            return;
        }

        closeModal(
            button.dataset.close
        );

    }
);


document.querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === modal) {

                    modal.classList.remove(
                        "show"
                    );

                }

            }
        );

    });


/* =========================================================
   PROFILE BUTTON
========================================================= */

$("profileButton").addEventListener(
    "click",
    function () {

        if (currentUser?.role === "admin") {

            showToast(
                "پروفایل مدیر سیستم"
            );

        } else {

            navigateTo("myProfile");

        }

    }
);


/* =========================================================
   NOTIFICATION
========================================================= */

$("notificationButton").addEventListener(
    "click",
    function () {

        const pending =
            db.leaves.filter(
                item =>
                    item.status === "pending"
            ).length;


        if (currentUser?.role === "admin") {

            if (pending) {

                showToast(
                    `${pending} درخواست مرخصی در انتظار بررسی است.`
                );

            } else {

                showToast(
                    "اعلان جدیدی ندارید."
                );

            }

        } else {

            const employee =
                getCurrentEmployee();

            const requests =
                db.leaves.filter(
                    item =>
                        item.employeeId === employee?.id &&
                        item.status !== "pending"
                );


            if (requests.length) {

                showToast(
                    "وضعیت درخواست‌های مرخصی خود را در بخش مرخصی ببینید."
                );

            } else {

                showToast(
                    "اعلان جدیدی ندارید."
                );

            }

        }

    }
);


/* =========================================================
   PRINT REPORT
========================================================= */

$("printReportBtn").addEventListener(
    "click",
    function () {

        window.print();

    }
);


/* =========================================================
   RENDER PAGE
========================================================= */

function renderPage(page) {

    switch (page) {

        case "dashboard":
            renderDashboard();
            break;

        case "employees":
            renderEmployees();
            break;

        case "attendance":
            renderAttendance();
            break;

        case "leave":
            renderLeaves();
            break;

        case "payroll":
            renderPayroll();
            break;

        case "reports":
            renderReports();
            break;

        case "myProfile":
            renderMyProfile();
            break;

        case "myAttendance":
            renderMyAttendance();
            break;

        case "myLeave":
            renderMyLeave();
            break;

        case "myPayroll":
            renderMyPayroll();
            break;

    }

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

    renderDashboard();

    renderEmployees();

    renderAttendance();

    renderLeaves();

    renderPayroll();

    renderReports();

    renderMyProfile();

    renderMyAttendance();

    renderMyLeave();

    renderMyPayroll();


    const pending =
        db.leaves.filter(
            item =>
                item.status === "pending"
        ).length;


    $("notificationBadge").textContent =
        pending;

}


/* =========================================================
   SESSION RECOVERY
========================================================= */

const savedUserId =
    sessionStorage.getItem(
        "mirza_current_user"
    );


if (savedUserId) {

    const user =
        db.users.find(
            item =>
                item.id === savedUserId
        );


    if (user) {

        currentUser = user;

        openApplication();

    }

           }
