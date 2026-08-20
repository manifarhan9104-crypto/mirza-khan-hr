"use strict";

/*
====================================================
 MIRZA KHAN HR
 نسخه اولیه سیستم ورود و پنل کارمند
====================================================
*/

const STORAGE_KEY = "mirzaKhanEmployees";
const SESSION_KEY = "mirzaKhanSession";


// ==================================================
// اطلاعات اولیه
// ==================================================

function getEmployees() {

    return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

}

function saveEmployees(employees) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(employees)
    );

}


// کاربر مدیر آزمایشی
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123456";


// ==================================================
// ابزارها
// ==================================================

function formatMoney(number) {

    return Number(number || 0).toLocaleString("fa-IR") + " تومان";

}

function showToast(message, title = "موفق") {

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    const toastTitle = document.getElementById("toastTitle");

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


function setSession(session) {

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );

}


function getSession() {

    return JSON.parse(
        localStorage.getItem(SESSION_KEY) || "null"
    );

}


function clearSession() {

    localStorage.removeItem(SESSION_KEY);

}


// ==================================================
// صفحات اصلی
// ==================================================

const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const employeePanel = document.getElementById("employeePanel");
const adminPanel = document.getElementById("adminPanel");


function hideAllMainPages() {

    loginPage.classList.add("hidden");
    registerPage.classList.add("hidden");
    employeePanel.classList.add("hidden");
    adminPanel.classList.add("hidden");

}


function showLogin() {

    hideAllMainPages();

    loginPage.classList.remove("hidden");

}


function showRegister() {

    hideAllMainPages();

    registerPage.classList.remove("hidden");

}


function showEmployeePanel() {

    hideAllMainPages();

    employeePanel.classList.remove("hidden");

}


function showAdminPanel() {

    hideAllMainPages();

    adminPanel.classList.remove("hidden");

}


// ==================================================
// ورود
// ==================================================

let loginMode = "employee";

const employeeLoginTab =
    document.getElementById("employeeLoginTab");

const adminLoginTab =
    document.getElementById("adminLoginTab");


employeeLoginTab.addEventListener("click", () => {

    loginMode = "employee";

    employeeLoginTab.classList.add("active");
    adminLoginTab.classList.remove("active");

});


adminLoginTab.addEventListener("click", () => {

    loginMode = "admin";

    adminLoginTab.classList.add("active");
    employeeLoginTab.classList.remove("active");

});


document
    .getElementById("loginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("loginUsername")
                .value
                .trim();

        const password =
            document.getElementById("loginPassword")
                .value;

        // ------------------------------
        // مدیر
        // ------------------------------

        if (loginMode === "admin") {

            if (
                username === ADMIN_USERNAME &&
                password === ADMIN_PASSWORD
            ) {

                setSession({
                    type: "admin",
                    username: username
                });

                showAdminPanel();

                renderAdmin();

                showToast(
                    "با موفقیت وارد پنل مدیریت شدید."
                );

                return;

            }

            showToast(
                "نام کاربری یا رمز مدیر اشتباه است.",
                "خطا"
            );

            return;
        }


        // ------------------------------
        // کارمند
        // ------------------------------

        const employees = getEmployees();

        const employee = employees.find(item =>
            item.username === username &&
            item.password === password
        );


        if (!employee) {

            showToast(
                "نام کاربری یا رمز عبور اشتباه است.",
                "خطا"
            );

            return;

        }


        setSession({
            type: "employee",
            employeeId: employee.id
        });


        showEmployeePanel();

        renderEmployee(employee);

        showToast(
            "خوش آمدید " + employee.name
        );

    });


// ==================================================
// ثبت نام
// ==================================================

document
    .getElementById("showRegisterBtn")
    .addEventListener("click", showRegister);


document
    .getElementById("backToLogin")
    .addEventListener("click", showLogin);


document
    .getElementById("registerForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const nationalId =
            document.getElementById("registerNationalId").value.trim();

        const personnelCode =
            document.getElementById("registerPersonnelCode").value.trim();

        const birthDate =
            document.getElementById("registerBirthDate").value;

        const phone =
            document.getElementById("registerPhone").value.trim();

        const username =
            document.getElementById("registerUsername").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const passwordConfirm =
            document.getElementById("registerPasswordConfirm").value;


        // بررسی رمز

        if (password.length < 6) {

            showToast(
                "رمز عبور باید حداقل ۶ کاراکتر باشد.",
                "خطا"
            );

            return;

        }


        if (password !== passwordConfirm) {

            showToast(
                "تکرار رمز عبور صحیح نیست.",
                "خطا"
            );

            return;

        }


        // بررسی کد ملی

        if (!/^\d{10}$/.test(nationalId)) {

            showToast(
                "کد ملی باید ۱۰ رقم باشد.",
                "خطا"
            );

            return;

        }


        let employees = getEmployees();


        // نام کاربری تکراری

        if (
            employees.some(
                employee => employee.username === username
            )
        ) {

            showToast(
                "این نام کاربری قبلاً استفاده شده است.",
                "خطا"
            );

            return;

        }


        // کد ملی تکراری

        if (
            employees.some(
                employee => employee.nationalId === nationalId
            )
        ) {

            showToast(
                "این کد ملی قبلاً ثبت شده است.",
                "خطا"
            );

            return;

        }


        // کد پرسنلی تکراری

        if (
            employees.some(
                employee => employee.personnelCode === personnelCode
            )
        ) {

            showToast(
                "این کد پرسنلی قبلاً ثبت شده است.",
                "خطا"
            );

            return;

        }


        // ساخت کارمند

        const newEmployee = {

            id: Date.now(),

            name: name,

            nationalId: nationalId,

            personnelCode: personnelCode,

            birthDate: birthDate,

            phone: phone,

            username: username,

            password: password,

            department: "تعیین نشده",

            position: "کارمند",

            hireDate: "",

            status: "active",

            salary: 0,

            payroll: {

                base: 0,

                overtime: 0,

                bonus: 0,

                insurance: 0,

                tax: 0,

                other: 0

            },

            attendance: {

                today: "ثبت نشده",

                history: []

            },

            leave: {

                balance: 0,

                pending: 0,

                approved: 0,

                requests: []

            }

        };


        employees.push(newEmployee);

        saveEmployees(employees);


        document
            .getElementById("registerForm")
            .reset();


        showLogin();

        document
            .getElementById("loginUsername")
            .value = username;


        showToast(
            "حساب کاربری با موفقیت ایجاد شد."
        );

    });


// ==================================================
// نمایش اطلاعات کارمند
// ==================================================

function renderEmployee(employee) {

    // Header

    document.getElementById("employeeHeaderName")
        .textContent = employee.name;

    document.getElementById("welcomeName")
        .textContent = employee.name;

    document.getElementById("employeeAvatar")
        .textContent =
        employee.name
            ? employee.name.charAt(0)
            : "م";


    // Home

    document.getElementById("homeSalary")
        .textContent =
        formatMoney(employee.salary);

    document.getElementById("homeLeave")
        .textContent =
        Number(employee.leave.balance || 0)
        .toLocaleString("fa-IR") + " روز";

    document.getElementById("homeAttendance")
        .textContent =
        employee.attendance.today || "ثبت نشده";


    document.getElementById("homePersonnelCode")
        .textContent =
        employee.personnelCode || "-";

    document.getElementById("homeDepartment")
        .textContent =
        employee.department || "-";

    document.getElementById("homePosition")
        .textContent =
        employee.position || "-";


    // Profile

    document.getElementById("profileName")
        .textContent = employee.name;

    document.getElementById("profileNationalId")
        .textContent = employee.nationalId;

    document.getElementById("profileBirthDate")
        .textContent = formatDate(employee.birthDate);

    document.getElementById("profilePhone")
        .textContent = employee.phone || "-";

    document.getElementById("profilePersonnelCode")
        .textContent = employee.personnelCode;

    document.getElementById("profileUsername")
        .textContent = employee.username;

    document.getElementById("profileDepartment")
        .textContent = employee.department;

    document.getElementById("profilePosition")
        .textContent = employee.position;

    document.getElementById("profileHireDate")
        .textContent =
        formatDate(employee.hireDate);


    // Payroll

    const payroll = employee.payroll || {};

    const base =
        Number(payroll.base || employee.salary || 0);

    const overtime =
        Number(payroll.overtime || 0);

    const bonus =
        Number(payroll.bonus || 0);

    const insurance =
        Number(payroll.insurance || 0);

    const tax =
        Number(payroll.tax || 0);

    const other =
        Number(payroll.other || 0);

    const deduction =
        insurance + tax + other;

    const net =
        base + overtime + bonus - deduction;


    document.getElementById("homeNetSalary")
        .textContent = formatMoney(net);

    document.getElementById("salaryBase")
        .textContent = formatMoney(base);

    document.getElementById("salaryOvertime")
        .textContent = formatMoney(overtime);

    document.getElementById("salaryBonus")
        .textContent = formatMoney(bonus);

    document.getElementById("salaryDeduction")
        .textContent = formatMoney(deduction);

    document.getElementById("salaryNet")
        .textContent = formatMoney(net);

    document.getElementById("insurance")
        .textContent = formatMoney(insurance);

    document.getElementById("tax")
        .textContent = formatMoney(tax);

    document.getElementById("otherDeduction")
        .textContent = formatMoney(other);


    // Attendance

    document.getElementById("attendanceStatus")
        .textContent =
        employee.attendance.today || "ثبت نشده";


    const history =
        employee.attendance.history || [];

    const historyElement =
        document.getElementById("attendanceHistory");


    if (history.length === 0) {

        historyElement.textContent =
            "هنوز سابقه‌ای ثبت نشده است.";

    } else {

        historyElement.innerHTML =
            history.map(item => `
                <div class="profile-info">
                    <span>${item.date}</span>
                    <strong>${item.status}</strong>
                </div>
            `).join("");

    }


    // Leave

    const leave = employee.leave || {};

    document.getElementById("leaveBalance")
        .textContent =
        Number(leave.balance || 0)
        .toLocaleString("fa-IR") + " روز";

    document.getElementById("leavePending")
        .textContent =
        Number(leave.pending || 0)
        .toLocaleString("fa-IR");

    document.getElementById("leaveApproved")
        .textContent =
        Number(leave.approved || 0)
        .toLocaleString("fa-IR");


    const leaveList =
        document.getElementById("employeeLeaveList");

    const requests =
        leave.requests || [];


    if (requests.length === 0) {

        leaveList.textContent =
            "هنوز درخواستی ثبت نشده است.";

    } else {

        leaveList.innerHTML =
            requests.map(request => `
                <div class="profile-info">
                    <span>
                        ${request.type || "مرخصی"}
                    </span>

                    <strong>
                        ${request.status || "در انتظار بررسی"}
                    </strong>
                </div>
            `).join("");

    }

}


// ==================================================
// تاریخ
// ==================================================

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
        return date;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


// ==================================================
// منوی کارمند
// ==================================================

document
    .querySelectorAll("#employeePanel .panel-menu")
    .forEach(button => {

        button.addEventListener("click", () => {

            const target =
                button.dataset.panel;

            document
                .querySelectorAll("#employeePanel .panel-menu")
                .forEach(item =>
                    item.classList.remove("active")
                );

            button.classList.add("active");

            document
                .querySelectorAll("#employeePanel .panel-page")
                .forEach(page =>
                    page.classList.remove("active")
                );

            document
                .getElementById(target)
                .classList.add("active");

            const title =
                button.textContent.trim();

            document
                .getElementById("employeePageTitle")
                .textContent = title;

        });

    });


// ==================================================
// منوی مدیر
// ==================================================

document
    .querySelectorAll("#adminPanel .panel-menu")
    .forEach(button => {

        button.addEventListener("click", () => {

            const target =
                button.dataset.panel;

            document
                .querySelectorAll("#adminPanel .panel-menu")
                .forEach(item =>
                    item.classList.remove("active")
                );

            button.classList.add("active");

            document
                .querySelectorAll("#adminPanel .panel-page")
                .forEach(page =>
                    page.classList.remove("active")
                );

            document
                .getElementById(target)
                .classList.add("active");

            document
                .getElementById("adminPageTitle")
                .textContent =
                button.textContent.trim();

        });

    });


// ==================================================
// پنل مدیر
// ==================================================

function renderAdmin() {

    const employees = getEmployees();


    document.getElementById("adminTotalEmployees")
        .textContent =
        employees.length.toLocaleString("fa-IR");


    document.getElementById("adminActiveEmployees")
        .textContent =
        employees
            .filter(employee =>
                employee.status === "active"
            )
            .length
            .toLocaleString("fa-IR");


    const totalSalary =
        employees.reduce(
            (total, employee) =>
                total +
                Number(
                    employee.salary ||
                    employee.payroll?.base ||
                    0
                ),
            0
        );


    document.getElementById("adminTotalSalary")
        .textContent =
        formatMoney(totalSalary);


    // Employees table

    const employeeTable =
        document.getElementById("adminEmployeesTable");


    if (employees.length === 0) {

        employeeTable.innerHTML = `
            <tr>
                <td colspan="6">
                    هنوز کارمندی ثبت نشده است.
                </td>
            </tr>
        `;

    } else {

        employeeTable.innerHTML =
            employees.map(employee => `
                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(employee.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(employee.nationalId)}
                    </td>

                    <td>
                        ${escapeHTML(employee.personnelCode)}
                    </td>

                    <td>
                        ${escapeHTML(employee.department)}
                    </td>

                    <td>
                        ${escapeHTML(employee.position)}
                    </td>

                    <td>
                        ${formatMoney(employee.salary)}
                    </td>

                </tr>
            `).join("");

    }


    // Payroll table

    const payrollTable =
        document.getElementById("adminPayrollTable");


    payrollTable.innerHTML =
        employees.map(employee => {

            const payroll =
                employee.payroll || {};

            const base =
                Number(payroll.base || employee.salary || 0);

            const overtime =
                Number(payroll.overtime || 0);

            const bonus =
                Number(payroll.bonus || 0);

            const deduction =
                Number(payroll.insurance || 0) +
                Number(payroll.tax || 0) +
                Number(payroll.other || 0);

            const net =
                base + overtime + bonus - deduction;


            return `
                <tr>

                    <td>
                        ${escapeHTML(employee.name)}
                    </td>

                    <td>
                        ${formatMoney(base)}
                    </td>

                    <td>
                        ${formatMoney(overtime)}
                    </td>

                    <td>
                        ${formatMoney(bonus)}
                    </td>

                    <td>
                        ${formatMoney(deduction)}
                    </td>

                    <td>
                        <strong>
                            ${formatMoney(net)}
                        </strong>
                    </td>

                </tr>
            `;

        }).join("");


    // Attendance table

    const attendanceTable =
        document.getElementById("adminAttendanceTable");


    attendanceTable.innerHTML =
        employees.map(employee => `

            <tr>

                <td>
                    ${escapeHTML(employee.name)}
                </td>

                <td>
                    ${escapeHTML(employee.personnelCode)}
                </td>

                <td>
                    ${escapeHTML(
                        employee.attendance?.today ||
                        "ثبت نشده"
                    )}
                </td>

            </tr>

        `).join("");

}


// ==================================================
// جلوگیری از HTML Injection در نام‌ها
// ==================================================

function escapeHTML(value) {

    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ==================================================
// خروج کارمند
// ==================================================

document
    .getElementById("employeeLogout")
    .addEventListener("click", () => {

        clearSession();

        showLogin();

        showToast("از حساب کاربری خارج شدید.");

    });


// ==================================================
// خروج مدیر
// ==================================================

document
    .getElementById("adminLogout")
    .addEventListener("click", () => {

        clearSession();

        showLogin();

        showToast("از حساب مدیر خارج شدید.");

    });


// ==================================================
// نمایش / مخفی کردن رمز
// ==================================================

document
    .getElementById("togglePassword")
    .addEventListener("click", () => {

        const input =
            document.getElementById("loginPassword");

        const icon =
            document.querySelector(
                "#togglePassword i"
            );


        if (input.type === "password") {

            input.type = "text";

            icon.className =
                "fa-solid fa-eye-slash";

        } else {

            input.type = "password";

            icon.className =
                "fa-solid fa-eye";

        }

    });


// ==================================================
// بازیابی جلسه قبلی
// ==================================================

function restoreSession() {

    const session = getSession();

    if (!session) {

        showLogin();

        return;

    }


    if (session.type === "admin") {

        showAdminPanel();

        renderAdmin();

        return;

    }


    if (session.type === "employee") {

        const employees = getEmployees();

        const employee =
            employees.find(
                item => item.id === session.employeeId
            );


        if (!employee) {

            clearSession();

            showLogin();

            return;

        }


        showEmployeePanel();

        renderEmployee(employee);

    }

}


// ==================================================
// شروع
// ==================================================

restoreSession();
