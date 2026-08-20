/* =========================================================
   MIRZA KHAN HR
   Complete Front-End HR Management System
   ========================================================= */


/* ================= STORAGE ================= */

const STORAGE_KEYS = {
    employees: "mirza_hr_employees",
    attendance: "mirza_hr_attendance",
    leaves: "mirza_hr_leaves",
    notifications: "mirza_hr_notifications",
    activities: "mirza_hr_activities",
    session: "mirza_hr_session"
};


/* ================= HELPERS ================= */

const $ = id => document.getElementById(id);

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch {
        return fallback;
    }
}

function today() {
    const d = new Date();
    return d.toISOString().split("T")[0];
}

function formatMoney(value) {
    return Number(value || 0).toLocaleString("fa-IR") + " تومان";
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function initials(name) {
    if (!name) return "؟";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].slice(0, 1);
    }

    return parts[0].slice(0, 1) + parts[1].slice(0, 1);
}

function calculateDays(start, end) {

    if (!start || !end) return 0;

    const a = new Date(start);
    const b = new Date(end);

    const diff = Math.floor(
        (b - a) / (1000 * 60 * 60 * 24)
    );

    return diff >= 0 ? diff + 1 : 0;
}

function statusText(status) {

    const map = {
        active: "فعال",
        inactive: "غیرفعال",
        present: "حاضر",
        absent: "غایب",
        late: "تأخیر",
        leave: "مرخصی",
        pending: "در انتظار",
        approved: "تأیید شده",
        rejected: "رد شده"
    };

    return map[status] || status;
}

function showToast(title, message, type = "success") {

    const toast = $("toast");
    const icon = $("toastIcon");

    $("toastTitle").textContent = title;
    $("toastMessage").textContent = message;

    if (type === "error") {
        icon.style.background = "#fee2e2";
        icon.style.color = "#dc2626";
        icon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
        icon.style.background = "#dcfce7";
        icon.style.color = "#166534";
        icon.innerHTML = '<i class="fa-solid fa-check"></i>';
    }

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}


/* ================= INITIAL DATA ================= */

function initializeData() {

    let employees = load(STORAGE_KEYS.employees, null);

    if (!employees) {

        employees = [
            {
                id: "emp-1",
                name: "علی احمدی",
                nationalId: "0012345678",
                birthDate: "1990-05-15",
                phone: "09121234567",
                code: "MK-1001",
                department: "منابع انسانی",
                position: "کارشناس منابع انسانی",
                hireDate: "2020-03-10",
                salary: 25000000,
                status: "active",
                username: "ali",
                password: "1234",
                payroll: {
                    base: 25000000,
                    overtime: 3000000,
                    bonus: 1500000,
                    insurance: 2500000,
                    tax: 1000000,
                    other: 300000
                }
            },
            {
                id: "emp-2",
                name: "رضا محمدی",
                nationalId: "0023456789",
                birthDate: "1988-08-20",
                phone: "09129876543",
                code: "MK-1002",
                department: "تولید",
                position: "سرپرست تولید",
                hireDate: "2019-06-01",
                salary: 32000000,
                status: "active",
                username: "reza",
                password: "1234",
                payroll: {
                    base: 32000000,
                    overtime: 4500000,
                    bonus: 2000000,
                    insurance: 3200000,
                    tax: 1500000,
                    other: 400000
                }
            }
        ];

        save(STORAGE_KEYS.employees, employees);
    }


    if (!localStorage.getItem(STORAGE_KEYS.attendance)) {

        const attendance = employees.map(emp => ({
            id: "att-" + emp.id,
            employeeId: emp.id,
            date: today(),
            entry: "08:00",
            exit: "16:00",
            status: "present"
        }));

        save(STORAGE_KEYS.attendance, attendance);
    }


    if (!localStorage.getItem(STORAGE_KEYS.leaves)) {
        save(STORAGE_KEYS.leaves, []);
    }


    if (!localStorage.getItem(STORAGE_KEYS.notifications)) {
        save(STORAGE_KEYS.notifications, []);
    }


    if (!localStorage.getItem(STORAGE_KEYS.activities)) {

        save(STORAGE_KEYS.activities, [
            {
                text: "سامانه با موفقیت راه‌اندازی شد",
                date: new Date().toLocaleString("fa-IR")
            }
        ]);

    }
}


/* ================= SESSION ================= */

let session = load(STORAGE_KEYS.session, null);

let authMode = "employee";


function setSession(data) {

    session = data;

    if (data) {
        save(STORAGE_KEYS.session, data);
    } else {
        localStorage.removeItem(STORAGE_KEYS.session);
    }

}


function currentEmployee() {

    if (!session || session.role !== "employee") {
        return null;
    }

    const employees = load(STORAGE_KEYS.employees);

    return employees.find(
        e => e.id === session.employeeId
    ) || null;
}


/* ================= AUTH ================= */

function setupAuth() {

    document.querySelectorAll(".auth-tab").forEach(tab => {

        tab.addEventListener("click", () => {

            document.querySelectorAll(".auth-tab")
                .forEach(t => t.classList.remove("active"));

            tab.classList.add("active");

            authMode = tab.dataset.auth;

        });

    });


    $("togglePassword").addEventListener("click", () => {

        const input = $("loginPassword");
        const icon = $("togglePassword i");

        if (input.type === "password") {
            input.type = "text";
            icon.className = "fa-solid fa-eye-slash";
        } else {
            input.type = "password";
            icon.className = "fa-solid fa-eye";
        }

    });


    $("loginForm").addEventListener("submit", e => {

        e.preventDefault();

        const username = $("loginUsername").value.trim();
        const password = $("loginPassword").value;

        if (authMode === "manager") {

            if (
                username === "admin" &&
                password === "123456"
            ) {

                setSession({
                    role: "manager",
                    username: "admin"
                });

                openMainApp();

                showToast(
                    "خوش آمدید",
                    "با حساب مدیر وارد شدید."
                );

                return;
            }

            showToast(
                "ورود ناموفق",
                "نام کاربری یا رمز مدیر صحیح نیست.",
                "error"
            );

            return;
        }


        const employees = load(STORAGE_KEYS.employees);

        const employee = employees.find(
            e =>
                e.username === username &&
                e.password === password &&
                e.status === "active"
        );


        if (!employee) {

            showToast(
                "ورود ناموفق",
                "اطلاعات ورود کارمند صحیح نیست.",
                "error"
            );

            return;
        }


        setSession({
            role: "employee",
            employeeId: employee.id,
            username: employee.username
        });


        openMainApp();

        showToast(
            "خوش آمدید",
            `${employee.name} عزیز، ورود شما موفق بود.`
        );

    });


    $("showRegister").addEventListener("click", () => {

        $("loginBox").classList.add("hidden");
        $("registerBox").classList.remove("hidden");

    });


    $("backToLogin").addEventListener("click", () => {

        $("registerBox").classList.add("hidden");
        $("loginBox").classList.remove("hidden");

    });


    $("registerForm").addEventListener("submit", e => {

        e.preventDefault();

        const employees = load(STORAGE_KEYS.employees);

        const username = $("registerUsername").value.trim();
        const nationalId = $("registerNationalId").value.trim();

        if (employees.some(e => e.username === username)) {

            showToast(
                "خطا",
                "این نام کاربری قبلاً استفاده شده است.",
                "error"
            );

            return;
        }


        if (employees.some(e => e.nationalId === nationalId)) {

            showToast(
                "خطا",
                "این کد ملی قبلاً ثبت شده است.",
                "error"
            );

            return;
        }


        const employee = {

            id: "emp-" + Date.now(),

            name: $("registerName").value.trim(),

            nationalId,

            birthDate: $("registerBirthDate").value,

            phone: $("registerPhone").value.trim(),

            code: "MK-" + Math.floor(1000 + Math.random() * 9000),

            department: "تعیین نشده",

            position: "کارمند",

            hireDate: today(),

            salary: 0,

            status: "active",

            username,

            password: $("registerPassword").value,

            payroll: {
                base: 0,
                overtime: 0,
                bonus: 0,
                insurance: 0,
                tax: 0,
                other: 0
            }

        };


        employees.push(employee);

        save(STORAGE_KEYS.employees, employees);

        addActivity(
            `ثبت‌نام کارمند جدید: ${employee.name}`
        );


        $("registerForm").reset();

        $("registerBox").classList.add("hidden");
        $("loginBox").classList.remove("hidden");

        showToast(
            "ثبت‌نام موفق",
            "حساب کاربری شما ساخته شد. اکنون وارد شوید."
        );

    });

}


/* ================= OPEN APP ================= */

function openMainApp() {

    $("authPage").classList.add("hidden");
    $("mainApp").classList.remove("hidden");

    if (session.role === "manager") {
        setupManagerUI();
    } else {
        setupEmployeeUI();
    }

    updateTopUser();

}


function setupManagerUI() {

    $("managerMenu").classList.remove("hidden");
    $("employeeMenu").classList.add("hidden");

    navigate("dashboard");

    renderAllManager();

}


function setupEmployeeUI() {

    $("managerMenu").classList.add("hidden");
    $("employeeMenu").classList.remove("hidden");

    navigate("employeeProfile");

    renderAllEmployee();

}


function updateTopUser() {

    if (session.role === "manager") {

        $("topUserName").textContent = "مدیر سیستم";
        $("topUserRole").textContent = "مدیریت منابع انسانی";
        $("topUserAvatar").textContent = "م";

    } else {

        const emp = currentEmployee();

        if (!emp) return;

        $("topUserName").textContent = emp.name;
        $("topUserRole").textContent = emp.position;
        $("topUserAvatar").textContent = initials(emp.name);

    }

}


/* ================= NAVIGATION ================= */

const pageInfo = {

    dashboard: ["داشبورد", "مدیریت جامع منابع انسانی"],
    employees: ["کارکنان", "مدیریت اطلاعات کارکنان"],
    attendance: ["حضور و غیاب", "مدیریت وضعیت حضور کارکنان"],
    leave: ["مرخصی", "درخواست‌ها و سوابق مرخصی"],
    payroll: ["حقوق و کسورات", "مدیریت حقوق و پرداختی"],
    reports: ["گزارش‌ها", "گزارش‌های مدیریتی سامانه"],
    notifications: ["اعلان‌ها", "اطلاعیه‌ها و رویدادها"],

    employeeProfile: ["پروفایل من", "اطلاعات شخصی و شغلی"],
    employeePayroll: ["حقوق و کسورات من", "مشاهده جزئیات پرداختی"],
    employeeAttendance: ["حضور و غیاب من", "سوابق ورود و خروج"],
    employeeLeave: ["مرخصی من", "درخواست و پیگیری مرخصی"]

};


function navigate(page) {

    document.querySelectorAll(".page")
        .forEach(p => p.classList.remove("active-page"));

    const target = $("page-" + page);

    if (!target) return;

    target.classList.add("active-page");


    document.querySelectorAll(".menu-item")
        .forEach(btn => {

            btn.classList.toggle(
                "active",
                btn.dataset.page === page
            );

        });


    if (pageInfo[page]) {

        $("pageTitle").textContent = pageInfo[page][0];
        $("pageSubtitle").textContent = pageInfo[page][1];

    }


    $("sidebar").classList.remove("open");
    $("menuOverlay").classList.remove("show");

}


/* ================= NAV BUTTONS ================= */

function setupNavigation() {

    document.addEventListener("click", e => {

        const button = e.target.closest("[data-page]");

        if (!button) return;

        const page = button.dataset.page;

        if (
            session &&
            session.role === "manager" &&
            [
                "dashboard",
                "employees",
                "attendance",
                "leave",
                "payroll",
                "reports",
                "notifications"
            ].includes(page)
        ) {

            navigate(page);
            return;

        }


        if (
            session &&
            session.role === "employee" &&
            [
                "employeeProfile",
                "employeePayroll",
                "employeeAttendance",
                "employeeLeave"
            ].includes(page)
        ) {

            navigate(page);
            return;

        }

    });


    $("mobileMenuBtn").addEventListener("click", () => {

        $("sidebar").classList.add("open");
        $("menuOverlay").classList.add("show");

    });


    $("menuOverlay").addEventListener("click", () => {

        $("sidebar").classList.remove("open");
        $("menuOverlay").classList.remove("show");

    });

}


/* ================= LOGOUT ================= */

function setupLogout() {

    $("logoutButton").addEventListener("click", () => {

        setSession(null);

        $("mainApp").classList.add("hidden");
        $("authPage").classList.remove("hidden");

        $("loginForm").reset();

        showToast(
            "خروج",
            "با موفقیت از سامانه خارج شدید."
        );

    });

}


/* ================= PROFILE BUTTON ================= */

function setupProfile() {

    $("profileButton").addEventListener("click", () => {

        if (session.role === "manager") {

            $("modalProfileName").textContent = "مدیر سیستم";
            $("modalProfileRole").textContent = "مدیریت منابع انسانی";
            $("modalProfileUsername").textContent = "admin";
            $("modalProfileRole2").textContent = "مدیر";

        } else {

            const emp = currentEmployee();

            if (!emp) return;

            $("modalProfileName").textContent = emp.name;
            $("modalProfileRole").textContent = emp.position;
            $("modalProfileUsername").textContent = emp.username;
            $("modalProfileRole2").textContent = "کارمند";

            $("modalProfileAvatar").textContent =
                initials(emp.name);

        }

        openModal("profileModal");

    });


    $("notificationButton").addEventListener("click", () => {

        if (session.role === "manager") {
            navigate("notifications");
        } else {
            navigate("employeeLeave");
        }

    });

}


/* ================= MODALS ================= */

function openModal(id) {
    $(id).classList.add("open");
}

function closeModal(id) {
    $(id).classList.remove("open");
}

function setupModals() {

    document.addEventListener("click", e => {

        const close = e.target.closest("[data-close]");

        if (close) {
            closeModal(close.dataset.close);
        }

    });


    document.querySelectorAll(".modal").forEach(modal => {

        modal.addEventListener("click", e => {

            if (e.target === modal) {
                modal.classList.remove("open");
            }

        });

    });

}


/* ================= ACTIVITIES ================= */

function addActivity(text) {

    const activities = load(
        STORAGE_KEYS.activities,
        []
    );

    activities.unshift({
        text,
        date: new Date().toLocaleString("fa-IR")
    });

    save(
        STORAGE_KEYS.activities,
        activities.slice(0, 30)
    );

}


/* ================= EMPLOYEE CRUD ================= */

function setupEmployeeManagement() {

    $("addEmployeeBtn").addEventListener("click", () => {

        $("employeeModalTitle").textContent =
            "افزودن کارمند";

        $("employeeForm").reset();
        $("employeeId").value = "";

        openModal("employeeModal");

    });


    $("employeeForm").addEventListener("submit", e => {

        e.preventDefault();

        const employees = load(STORAGE_KEYS.employees);

        const id = $("employeeId").value;


        const data = {

            name: $("employeeName").value.trim(),

            nationalId:
                $("employeeNationalId").value.trim(),

            birthDate:
                $("employeeBirthDate").value,

            phone:
                $("employeePhone").value.trim(),

            code:
                $("employeeCode").value.trim(),

            department:
                $("employeeDepartment").value,

            position:
                $("employeePosition").value.trim(),

            hireDate:
                $("employeeHireDate").value,

            salary:
                Number($("employeeSalary").value || 0),

            username:
                $("employeeUsername").value.trim(),

            password:
                $("employeePassword").value,

            status:
                $("employeeStatus").value

        };


        if (!data.username) {

            showToast(
                "خطا",
                "نام کاربری را وارد کنید.",
                "error"
            );

            return;
        }


        if (id) {

            const index = employees.findIndex(
                e => e.id === id
            );

            if (index === -1) return;


            employees[index] = {

                ...employees[index],

                ...data,

                payroll: employees[index].payroll || {
                    base: data.salary,
                    overtime: 0,
                    bonus: 0,
                    insurance: 0,
                    tax: 0,
                    other: 0
                }

            };


            if (
                !employees[index].payroll.base ||
                employees[index].payroll.base === 0
            ) {
                employees[index].payroll.base = data.salary;
            }


            addActivity(
                `ویرایش اطلاعات ${data.name}`
            );


            showToast(
                "ذخیره شد",
                "اطلاعات کارمند به‌روزرسانی شد."
            );

        } else {

            if (
                employees.some(
                    e => e.username === data.username
                )
            ) {

                showToast(
                    "خطا",
                    "این نام کاربری قبلاً وجود دارد.",
                    "error"
                );

                return;
            }


            const employee = {

                id: "emp-" + Date.now(),

                ...data,

                payroll: {
                    base: data.salary,
                    overtime: 0,
                    bonus: 0,
                    insurance: 0,
                    tax: 0,
                    other: 0
                }

            };


            employees.push(employee);

            addActivity(
                `افزودن کارمند جدید: ${data.name}`
            );


            showToast(
                "کارمند اضافه شد",
                "اطلاعات کارمند با موفقیت ثبت شد."
            );

        }


        save(
            STORAGE_KEYS.employees,
            employees
        );

        closeModal("employeeModal");

        renderAllManager();

    });

}


/* ================= EMPLOYEE TABLE ================= */

function renderEmployeesTable() {

    const employees = load(STORAGE_KEYS.employees);

    const search =
        $("employeeSearch").value.trim().toLowerCase();

    const department =
        $("employeeDepartmentFilter").value;


    const filtered = employees.filter(emp => {

        const matchesSearch =
            !search ||
            emp.name.toLowerCase().includes(search) ||
            emp.nationalId.includes(search) ||
            emp.code.toLowerCase().includes(search) ||
            emp.position.toLowerCase().includes(search);

        const matchesDepartment =
            !department ||
            emp.department === department;

        return matchesSearch && matchesDepartment;

    });


    const body = $("employeesTableBody");

    if (!filtered.length) {

        body.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fa-solid fa-users-slash"></i>
                        <div>کارمندی پیدا نشد.</div>
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML = filtered.map(emp => `

        <tr>

            <td>

                <div class="employee-cell">

                    <span class="table-avatar">
                        ${escapeHTML(initials(emp.name))}
                    </span>

                    <div>
                        <strong>
                            ${escapeHTML(emp.name)}
                        </strong>

                        <small>
                            ${escapeHTML(emp.phone || "-")}
                        </small>
                    </div>

                </div>

            </td>

            <td>
                ${escapeHTML(emp.code)}
            </td>

            <td>
                ${escapeHTML(emp.department)}
            </td>

            <td>
                ${escapeHTML(emp.position)}
            </td>

            <td>

                <span class="status ${emp.status}">
                    ${statusText(emp.status)}
                </span>

            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn edit"
                        title="ویرایش"
                        data-action="editEmployee"
                        data-id="${emp.id}"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="action-btn view"
                        title="مشاهده"
                        data-action="viewEmployee"
                        data-id="${emp.id}"
                    >
                        <i class="fa-solid fa-eye"></i>
                    </button>

                    <button
                        class="action-btn delete"
                        title="حذف"
                        data-action="deleteEmployee"
                        data-id="${emp.id}"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </td>

        </tr>

    `).join("");

}


function editEmployee(id) {

    const employees = load(STORAGE_KEYS.employees);

    const emp = employees.find(
        e => e.id === id
    );

    if (!emp) return;


    $("employeeModalTitle").textContent =
        "ویرایش کارمند";

    $("employeeId").value = emp.id;

    $("employeeName").value = emp.name;
    $("employeeNationalId").value = emp.nationalId || "";
    $("employeeBirthDate").value = emp.birthDate || "";
    $("employeePhone").value = emp.phone || "";
    $("employeeCode").value = emp.code || "";
    $("employeeDepartment").value = emp.department || "";
    $("employeePosition").value = emp.position || "";
    $("employeeHireDate").value = emp.hireDate || "";
    $("employeeSalary").value = emp.salary || 0;
    $("employeeUsername").value = emp.username || "";
    $("employeePassword").value = emp.password || "";
    $("employeeStatus").value = emp.status || "active";

    openModal("employeeModal");

}


function deleteEmployee(id) {

    const employees = load(STORAGE_KEYS.employees);

    const emp = employees.find(
        e => e.id === id
    );

    if (!emp) return;


    if (
        !confirm(
            `آیا از حذف ${emp.name} مطمئن هستید؟`
        )
    ) {
        return;
    }


    save(
        STORAGE_KEYS.employees,
        employees.filter(e => e.id !== id)
    );


    save(
        STORAGE_KEYS.attendance,
        load(STORAGE_KEYS.attendance)
            .filter(a => a.employeeId !== id)
    );


    addActivity(
        `حذف کارمند: ${emp.name}`
    );


    showToast(
        "حذف شد",
        "کارمند از سامانه حذف شد."
    );


    renderAllManager();

}


function viewEmployee(id) {

    const employees = load(STORAGE_KEYS.employees);

    const emp = employees.find(
        e => e.id === id
    );

    if (!emp) return;


    $("modalProfileName").textContent = emp.name;
    $("modalProfileRole").textContent =
        `${emp.position} - ${emp.department}`;

    $("modalProfileUsername").textContent =
        emp.username || "-";

    $("modalProfileRole2").textContent =
        formatMoney(emp.salary);

    $("modalProfileAvatar").textContent =
        initials(emp.name);


    openModal("profileModal");

}


/* ================= EMPLOYEE TABLE EVENTS ================= */

function setupEmployeeTableActions() {

    document.addEventListener("click", e => {

        const btn =
            e.target.closest("[data-action]");

        if (!btn) return;

        const id = btn.dataset.id;

        if (btn.dataset.action === "editEmployee") {
            editEmployee(id);
        }

        if (btn.dataset.action === "deleteEmployee") {
            deleteEmployee(id);
        }

        if (btn.dataset.action === "viewEmployee") {
            viewEmployee(id);
        }

        if (btn.dataset.action === "editPayroll") {
            editPayroll(id);
        }

        if (btn.dataset.action === "attendance") {
            changeAttendance(id);
        }

        if (btn.dataset.action === "approveLeave") {
            updateLeaveStatus(id, "approved");
        }

        if (btn.dataset.action === "rejectLeave") {
            updateLeaveStatus(id, "rejected");
        }

    });


    $("employeeSearch").addEventListener(
        "input",
        renderEmployeesTable
    );


    $("employeeDepartmentFilter").addEventListener(
        "change",
        renderEmployeesTable
    );

}


/* ================= ATTENDANCE ================= */

function setupAttendance() {

    $("attendanceDate").value = today();

    $("attendanceDate").addEventListener(
        "change",
        renderAttendance
    );

}


function renderAttendance() {

    const employees = load(STORAGE_KEYS.employees);

    const allAttendance =
        load(STORAGE_KEYS.attendance);

    const date =
        $("attendanceDate").value || today();


    const body = $("attendanceTableBody");


    const rows = employees.map(emp => {

        let record = allAttendance.find(
            a =>
                a.employeeId === emp.id &&
                a.date === date
        );


        if (!record) {

            record = {
                id: "att-" + emp.id + "-" + date,
                employeeId: emp.id,
                date,
                entry: "",
                exit: "",
                status: "absent"
            };

            allAttendance.push(record);

        }


        return {
            emp,
            record
        };

    });


    save(
        STORAGE_KEYS.attendance,
        allAttendance
    );


    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;


    body.innerHTML = rows.map(({ emp, record }) => {

        if (record.status === "present") present++;
        if (record.status === "absent") absent++;
        if (record.status === "late") late++;
        if (record.status === "leave") leave++;


        return `

            <tr>

                <td>

                    <div class="employee-cell">

                        <span class="table-avatar">
                            ${escapeHTML(initials(emp.name))}
                        </span>

                        <strong>
                            ${escapeHTML(emp.name)}
                        </strong>

                    </div>

                </td>

                <td>
                    ${record.entry || "-"}
                </td>

                <td>
                    ${record.exit || "-"}
                </td>

                <td>
                    <span class="status ${record.status}">
                        ${statusText(record.status)}
                    </span>
                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="action-btn success"
                            title="حاضر"
                            data-action="attendance"
                            data-id="${emp.id}"
                            data-status="present"
                        >
                            <i class="fa-solid fa-check"></i>
                        </button>

                        <button
                            class="action-btn warning"
                            title="تأخیر"
                            data-action="attendance"
                            data-id="${emp.id}"
                            data-status="late"
                        >
                            <i class="fa-solid fa-clock"></i>
                        </button>

                        <button
                            class="action-btn delete"
                            title="غایب"
                            data-action="attendance"
                            data-id="${emp.id}"
                            data-status="absent"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>

                        <button
                            class="action-btn view"
                            title="مرخصی"
                            data-action="attendance"
                            data-id="${emp.id}"
                            data-status="leave"
                        >
                            <i class="fa-solid fa-calendar"></i>
                        </button>

                    </div>

                </td>

            </tr>

        `;

    }).join("");


    $("attendancePresent").textContent = present;
    $("attendanceAbsent").textContent = absent;
    $("attendanceLate").textContent = late;
    $("attendanceLeave").textContent = leave;

}


function changeAttendance(id) {

    const event =
        window.event;

    if (!event) return;

    const button =
        event.target.closest("[data-action='attendance']");

    if (!button) return;

    const status =
        button.dataset.status;

    const date =
        $("attendanceDate").value || today();

    const attendance =
        load(STORAGE_KEYS.attendance);

    let record =
        attendance.find(
            a =>
                a.employeeId === id &&
                a.date === date
        );


    if (!record) {

        record = {
            id: "att-" + Date.now(),
            employeeId: id,
            date,
            entry: "",
            exit: "",
            status
        };

        attendance.push(record);

    } else {

        record.status = status;

    }


    if (status === "present") {

        record.entry =
            record.entry || "08:00";

        record.exit =
            record.exit || "16:00";

    }

    if (status === "late") {

        record.entry =
            record.entry || "08:35";

        record.exit =
            record.exit || "16:00";

    }

    if (status === "absent") {

        record.entry = "";
        record.exit = "";

    }


    save(
        STORAGE_KEYS.attendance,
        attendance
    );


    const employees =
        load(STORAGE_KEYS.employees);

    const emp =
        employees.find(e => e.id === id);


    addActivity(
        `وضعیت حضور ${emp?.name || ""} به ${statusText(status)} تغییر کرد`
    );


    showToast(
        "ثبت شد",
        `وضعیت ${emp?.name || "کارمند"} ثبت شد.`
    );


    renderAttendance();

}


/* ================= PAYROLL ================= */

function renderPayroll() {

    const employees =
        load(STORAGE_KEYS.employees);

    let gross = 0;
    let deductions = 0;
    let net = 0;


    const body = $("payrollTableBody");


    body.innerHTML = employees.map(emp => {

        const p = emp.payroll || {
            base: emp.salary || 0,
            overtime: 0,
            bonus: 0,
            insurance: 0,
            tax: 0,
            other: 0
        };


        const grossEmp =
            Number(p.base || 0) +
            Number(p.overtime || 0) +
            Number(p.bonus || 0);


        const ded =
            Number(p.insurance || 0) +
            Number(p.tax || 0) +
            Number(p.other || 0);


        const netEmp =
            grossEmp - ded;


        gross += grossEmp;
        deductions += ded;
        net += netEmp;


        return `

            <tr>

                <td>
                    <div class="employee-cell">
                        <span class="table-avatar">
                            ${escapeHTML(initials(emp.name))}
                        </span>
                        <strong>
                            ${escapeHTML(emp.name)}
                        </strong>
                    </div>
                </td>

                <td>${formatMoney(p.base)}</td>

                <td>${formatMoney(p.overtime)}</td>

                <td>${formatMoney(p.bonus)}</td>

                <td>${formatMoney(ded)}</td>

                <td>
                    <strong>
                        ${formatMoney(netEmp)}
                    </strong>
                </td>

                <td>

                    <button
                        class="action-btn edit"
                        data-action="editPayroll"
                        data-id="${emp.id}"
                        title="ویرایش حقوق"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>

                </td>

            </tr>

        `;

    }).join("");


    $("grossPayroll").textContent =
        formatMoney(gross);

    $("deductionPayroll").textContent =
        formatMoney(deductions);

    $("netPayroll").textContent =
        formatMoney(net);

}


function editPayroll(id) {

    const employees =
        load(STORAGE_KEYS.employees);

    const emp =
        employees.find(e => e.id === id);

    if (!emp) return;


    const p = emp.payroll || {
        base: emp.salary || 0,
        overtime: 0,
        bonus: 0,
        insurance: 0,
        tax: 0,
        other: 0
    };


    $("payrollEmployeeId").value = emp.id;

    $("payrollBase").value = p.base || 0;
    $("payrollOvertime").value = p.overtime || 0;
    $("payrollBonus").value = p.bonus || 0;
    $("payrollInsurance").value = p.insurance || 0;
    $("payrollTax").value = p.tax || 0;
    $("payrollOther").value = p.other || 0;


    updatePayrollPreview();

    openModal("payrollModal");

}


function updatePayrollPreview() {

    const base =
        Number($("payrollBase").value || 0);

    const overtime =
        Number($("payrollOvertime").value || 0);

    const bonus =
        Number($("payrollBonus").value || 0);

    const insurance =
        Number($("payrollInsurance").value || 0);

    const tax =
        Number($("payrollTax").value || 0);

    const other =
        Number($("payrollOther").value || 0);


    const net =
        base +
        overtime +
        bonus -
        insurance -
        tax -
        other;


    $("payrollNetPreview").textContent =
        formatMoney(net);

}


function setupPayroll() {

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


    $("payrollForm").addEventListener(
        "submit",
        e => {

            e.preventDefault();

            const employees =
                load(STORAGE_KEYS.employees);

            const id =
                $("payrollEmployeeId").value;

            const emp =
                employees.find(e => e.id === id);

            if (!emp) return;


            emp.salary =
                Number($("payrollBase").value || 0);


            emp.payroll = {

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


            save(
                STORAGE_KEYS.employees,
                employees
            );


            addActivity(
                `حقوق ${emp.name} به‌روزرسانی شد`
            );


            closeModal("payrollModal");

            showToast(
                "ذخیره شد",
                "اطلاعات حقوق با موفقیت ثبت شد."
            );


            renderPayroll();
            renderEmployeePayroll();

        }
    );

}


/* ================= LEAVE ================= */

function setupLeave() {

    $("addLeaveBtn").addEventListener(
        "click",
        () => openLeaveModal(true)
    );


    $("employeeAddLeaveBtn").addEventListener(
        "click",
        () => openLeaveModal(false)
    );


    $("leaveForm").addEventListener(
        "submit",
        e => {

            e.preventDefault();

            const leaves =
                load(STORAGE_KEYS.leaves);

            let employeeId;

            if (session.role === "manager") {

                employeeId =
                    $("leaveEmployee").value;

            } else {

                employeeId =
                    session.employeeId;

            }


            const start =
                $("leaveStart").value;

            const end =
                $("leaveEnd").value;


            if (
                !employeeId ||
                !start ||
                !end
            ) {

                showToast(
                    "خطا",
                    "اطلاعات درخواست را کامل کنید.",
                    "error"
                );

                return;
            }


            const days =
                calculateDays(start, end);


            if (days <= 0) {

                showToast(
                    "خطا",
                    "تاریخ پایان باید بعد از شروع باشد.",
                    "error"
                );

                return;
            }


            const leave = {

                id: "leave-" + Date.now(),

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


            leaves.push(leave);

            save(
                STORAGE_KEYS.leaves,
                leaves
            );


            const employees =
                load(STORAGE_KEYS.employees);

            const emp =
                employees.find(e => e.id === employeeId);


            addActivity(
                `درخواست مرخصی ${emp?.name || ""} ثبت شد`
            );


            closeModal("leaveModal");

            $("leaveForm").reset();


            showToast(
                "درخواست ثبت شد",
                "درخواست مرخصی برای بررسی ارسال شد."
            );


            renderAllManager();
            renderAllEmployee();

        }
    );

}


function openLeaveModal(managerMode) {

    $("leaveForm").reset();


    if (managerMode) {

        $("leaveEmployeeGroup").classList.remove("hidden");

        const employees =
            load(STORAGE_KEYS.employees);

        $("leaveEmployee").innerHTML =
            employees.map(emp => `
                <option value="${emp.id}">
                    ${escapeHTML(emp.name)}
                </option>
            `).join("");

    } else {

        $("leaveEmployeeGroup").classList.add("hidden");

    }


    openModal("leaveModal");

}


function renderLeaves() {

    const leaves =
        load(STORAGE_KEYS.leaves);

    const employees =
        load(STORAGE_KEYS.employees);


    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let totalDays = 0;


    leaves.forEach(leave => {

        totalDays += Number(leave.days || 0);

        if (leave.status === "pending") pending++;
        if (leave.status === "approved") approved++;
        if (leave.status === "rejected") rejected++;

    });


    $("pendingLeaves").textContent = pending;
    $("approvedLeaves").textContent = approved;
    $("rejectedLeaves").textContent = rejected;
    $("totalLeaveDays").textContent = totalDays;


    const body =
        $("leaveTableBody");


    if (!leaves.length) {

        body.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <i class="fa-solid fa-calendar-xmark"></i>
                        <div>درخواستی ثبت نشده است.</div>
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML =
        leaves.map(leave => {

            const emp =
                employees.find(
                    e => e.id === leave.employeeId
                );


            return `

                <tr>

                    <td>
                        ${escapeHTML(emp?.name || "-")}
                    </td>

                    <td>
                        ${escapeHTML(leave.type)}
                    </td>

                    <td>
                        ${escapeHTML(leave.start)}
                    </td>

                    <td>
                        ${escapeHTML(leave.end)}
                    </td>

                    <td>
                        ${leave.days}
                    </td>

                    <td>
                        <span class="status ${leave.status}">
                            ${statusText(leave.status)}
                        </span>
                    </td>

                    <td>

                        ${
                            leave.status === "pending"
                            ?
                            `
                            <div class="action-buttons">

                                <button
                                    class="action-btn success"
                                    data-action="approveLeave"
                                    data-id="${leave.id}"
                                    title="تأیید"
                                >
                                    <i class="fa-solid fa-check"></i>
                                </button>

                                <button
                                    class="action-btn delete"
                                    data-action="rejectLeave"
                                    data-id="${leave.id}"
                                    title="رد"
                                >
                                    <i class="fa-solid fa-xmark"></i>
                                </button>

                            </div>
                            `
                            :
                            "-"
                        }

                    </td>

                </tr>

            `;

        }).join("");

}


function updateLeaveStatus(id, status) {

    const leaves =
        load(STORAGE_KEYS.leaves);

    const leave =
        leaves.find(l => l.id === id);

    if (!leave) return;


    leave.status = status;

    save(
        STORAGE_KEYS.leaves,
        leaves
    );


    const employees =
        load(STORAGE_KEYS.employees);

    const emp =
        employees.find(
            e => e.id === leave.employeeId
        );


    addNotification(
        leave.employeeId,
        status === "approved"
            ? "درخواست مرخصی شما تأیید شد."
            : "درخواست مرخصی شما رد شد."
    );


    addActivity(
        `درخواست مرخصی ${emp?.name || ""} ${statusText(status)} شد`
    );


    showToast(
        "ثبت شد",
        `درخواست ${statusText(status)} شد.`
    );


    renderLeaves();
    renderNotifications();

}


/* ================= EMPLOYEE PAGES ================= */

function renderEmployeeProfile() {

    const emp =
        currentEmployee();

    if (!emp) return;


    $("employeeProfileAvatar").textContent =
        initials(emp.name);

    $("employeeProfileName").textContent =
        emp.name;

    $("employeeProfilePosition").textContent =
        `${emp.position} - ${emp.department}`;


    $("myName").textContent =
        emp.name;

    $("myNationalId").textContent =
        emp.nationalId || "-";

    $("myBirthDate").textContent =
        emp.birthDate || "-";

    $("myPhone").textContent =
        emp.phone || "-";

    $("myEmployeeCode").textContent =
        emp.code || "-";

    $("myDepartment").textContent =
        emp.department || "-";

    $("myPosition").textContent =
        emp.position || "-";

    $("myHireDate").textContent =
        emp.hireDate || "-";

}


function renderEmployeePayroll() {

    const emp =
        currentEmployee();

    if (!emp) return;


    const p =
        emp.payroll || {
            base: emp.salary || 0,
            overtime: 0,
            bonus: 0,
            insurance: 0,
            tax: 0,
            other: 0
        };


    const deductions =
        Number(p.insurance || 0) +
        Number(p.tax || 0) +
        Number(p.other || 0);


    const net =
        Number(p.base || 0) +
        Number(p.overtime || 0) +
        Number(p.bonus || 0) -
        deductions;


    $("myBaseSalary").textContent =
        formatMoney(p.base);

    $("myOvertime").textContent =
        formatMoney(p.overtime);

    $("myBonus").textContent =
        formatMoney(p.bonus);

    $("myDeductions").textContent =
        formatMoney(deductions);

    $("myNetSalary").textContent =
        formatMoney(net);

}


function renderEmployeeAttendance() {

    const emp =
        currentEmployee();

    if (!emp) return;


    const attendance =
        load(STORAGE_KEYS.attendance)
            .filter(a => a.employeeId === emp.id)
            .sort(
                (a, b) =>
                    b.date.localeCompare(a.date)
            );


    const body =
        $("myAttendanceBody");


    if (!attendance.length) {

        body.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="empty-state">
                        <i class="fa-solid fa-clock"></i>
                        <div>سابقه‌ای ثبت نشده است.</div>
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML =
        attendance.map(a => `

            <tr>

                <td>${escapeHTML(a.date)}</td>

                <td>${a.entry || "-"}</td>

                <td>${a.exit || "-"}</td>

                <td>
                    <span class="status ${a.status}">
                        ${statusText(a.status)}
                    </span>
                </td>

            </tr>

        `).join("");

}


function renderEmployeeLeaves() {

    const emp =
        currentEmployee();

    if (!emp) return;


    const leaves =
        load(STORAGE_KEYS.leaves)
            .filter(
                l => l.employeeId === emp.id
            )
            .sort(
                (a, b) =>
                    b.createdAt.localeCompare(a.createdAt)
            );


    const body =
        $("myLeaveBody");


    $("employeeLeaveBadge").textContent =
        leaves.filter(
            l => l.status === "pending"
        ).length;


    if (!leaves.length) {

        body.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fa-solid fa-calendar-days"></i>
                        <div>هنوز درخواست مرخصی ثبت نکرده‌اید.</div>
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML =
        leaves.map(leave => `

            <tr>

                <td>
                    ${escapeHTML(leave.type)}
                </td>

                <td>
                    ${escapeHTML(leave.start)}
                </td>

                <td>
                    ${escapeHTML(leave.end)}
                </td>

                <td>
                    ${leave.days}
                </td>

                <td>
                    ${escapeHTML(
                        leave.description || "-"
                    )}
                </td>

                <td>
                    <span class="status ${leave.status}">
                        ${statusText(leave.status)}
                    </span>
                </td>

            </tr>

        `).join("");

}


/* ================= DASHBOARD ================= */

function renderDashboard() {

    const employees =
        load(STORAGE_KEYS.employees);

    const attendance =
        load(STORAGE_KEYS.attendance);

    const todayRecords =
        attendance.filter(
            a => a.date === today()
        );


    const total =
        employees.filter(
            e => e.status === "active"
        ).length;


    const present =
        todayRecords.filter(
            a => a.status === "present"
        ).length;


    const absent =
        todayRecords.filter(
            a => a.status === "absent"
        ).length;


    const late =
        todayRecords.filter(
            a => a.status === "late"
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
        employees.length;


    $("recentEmployees").innerHTML =
        employees.slice(-5).reverse().map(emp => `

            <div class="employee-cell" style="margin-bottom:12px">

                <span class="table-avatar">
                    ${escapeHTML(initials(emp.name))}
                </span>

                <div>
                    <strong>
                        ${escapeHTML(emp.name)}
                    </strong>

                    <small>
                        ${escapeHTML(emp.position)}
                    </small>
                </div>

            </div>

        `).join("") ||
        `
            <div class="empty-state">
                کارمندی ثبت نشده است.
            </div>
        `;


    const activities =
        load(STORAGE_KEYS.activities, []);


    $("recentActivities").innerHTML =
        activities.slice(0, 6).map(a => `

            <div style="
                padding:12px 0;
                border-bottom:1px solid #eef2ef;
            ">

                <strong style="font-size:12px">
                    ${escapeHTML(a.text)}
                </strong>

                <div style="
                    color:#8a978f;
                    font-size:10px;
                    margin-top:4px;
                ">
                    ${escapeHTML(a.date)}
                </div>

            </div>

        `).join("") ||
        `
            <div class="empty-state">
                فعالیتی وجود ندارد.
            </div>
        `;

}


/* ================= REPORTS ================= */

function renderReports() {

    const employees =
        load(STORAGE_KEYS.employees);

    const attendance =
        load(STORAGE_KEYS.attendance)
            .filter(a => a.date === today());

    const leaves =
        load(STORAGE_KEYS.leaves);


    const activeEmployees =
        employees.filter(
            e => e.status === "active"
        );


    const present =
        attendance.filter(
            a =>
                a.status === "present" ||
                a.status === "late"
        ).length;


    const attendanceRate =
        activeEmployees.length
            ? Math.round(
                (present / activeEmployees.length) * 100
            )
            : 0;


    let totalPayroll = 0;

    employees.forEach(emp => {

        const p = emp.payroll || {};

        totalPayroll +=
            Number(p.base || 0) +
            Number(p.overtime || 0) +
            Number(p.bonus || 0) -
            Number(p.insurance || 0) -
            Number(p.tax || 0) -
            Number(p.other || 0);

    });


    $("reportEmployees").textContent =
        activeEmployees.length;

    $("reportAttendance").textContent =
        attendanceRate + "%";

    $("reportLeaves").textContent =
        leaves.length;

    $("reportPayroll").textContent =
        Number(totalPayroll).toLocaleString("fa-IR");


    $("attendancePercent").textContent =
        attendanceRate + "%";

    $("attendanceProgress").style.width =
        attendanceRate + "%";


    const departments = {};

    employees.forEach(emp => {

        departments[emp.department] =
            (departments[emp.department] || 0) + 1;

    });


    const max =
        Math.max(
            1,
            ...Object.values(departments)
        );


    $("departmentReport").innerHTML =
        Object.entries(departments).map(
            ([department, count]) => `

                <div class="department-row">

                    <div class="department-label">

                        <span>
                            ${escapeHTML(department)}
                        </span>

                        <strong>
                            ${count}
                        </strong>

                    </div>

                    <div class="department-line">

                        <div
                            class="department-fill"
                            style="width:${(count / max) * 100}%"
                        ></div>

                    </div>

                </div>

            `
        ).join("");

}


/* ================= NOTIFICATIONS ================= */

function addNotification(employeeId, message) {

    const notifications =
        load(STORAGE_KEYS.notifications, []);


    notifications.unshift({

        id: "notification-" + Date.now(),

        employeeId,

        message,

        read: false,

        date:
            new Date().toLocaleString("fa-IR")

    });


    save(
        STORAGE_KEYS.notifications,
        notifications.slice(0, 100)
    );

}


function renderNotifications() {

    const notifications =
        load(STORAGE_KEYS.notifications, []);


    let visible = notifications;


    if (
        session.role === "employee"
    ) {

        visible =
            notifications.filter(
                n =>
                    n.employeeId ===
                    session.employeeId
            );

    }


    const unread =
        visible.filter(
            n => !n.read
        ).length;


    $("notificationBadge").textContent =
        unread;

    $("notificationMenuBadge").textContent =
        unread;


    const body =
        $("notificationsList");


    if (!visible.length) {

        body.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-bell"></i>
                <div>اعلانی وجود ندارد.</div>
            </div>
        `;

        return;
    }


    body.innerHTML =
        visible.map(n => `

            <div style="
                padding:18px;
                border-bottom:1px solid #eef2ef;
                display:flex;
                gap:14px;
                align-items:flex-start;
            ">

                <div class="large-avatar"
                    style="
                        width:45px;
                        height:45px;
                        border-radius:13px;
                        font-size:18px;
                    "
                >
                    <i class="fa-solid fa-bell"></i>
                </div>

                <div>

                    <strong>
                        ${escapeHTML(n.message)}
                    </strong>

                    <div style="
                        color:#8a978f;
                        font-size:10px;
                        margin-top:5px;
                    ">
                        ${escapeHTML(n.date)}
                    </div>

                </div>

            </div>

        `).join("");

}


/* ================= MANAGER RENDER ================= */

function renderAllManager() {

    if (!session || session.role !== "manager") {
        return;
    }

    renderDashboard();
    renderEmployeesTable();
    renderAttendance();
    renderLeaves();
    renderPayroll();
    renderReports();
    renderNotifications();

}


/* ================= EMPLOYEE RENDER ================= */

function renderAllEmployee() {

    if (!session || session.role !== "employee") {
        return;
    }

    renderEmployeeProfile();
    renderEmployeePayroll();
    renderEmployeeAttendance();
    renderEmployeeLeaves();
    renderNotifications();

}


/* ================= CALCULATE PAYROLL ================= */

function setupCalculateButton() {

    $("calculatePayrollBtn").addEventListener(
        "click",
        () => {

            renderPayroll();
            showToast(
                "محاسبه انجام شد",
                "حقوق و کسورات کارکنان به‌روزرسانی شد."
            );

        }
    );

}


/* ================= MARK NOTIFICATIONS ================= */

function setupNotifications() {

    $("markAllNotifications").addEventListener(
        "click",
        () => {

            const notifications =
                load(STORAGE_KEYS.notifications, []);


            notifications.forEach(n => {

                if (
                    session.role === "manager" ||
                    n.employeeId === session.employeeId
                ) {
                    n.read = true;
                }

            });


            save(
                STORAGE_KEYS.notifications,
                notifications
            );


            renderNotifications();

            showToast(
                "انجام شد",
                "همه اعلان‌ها خوانده شدند."
            );

        }
    );

}


/* ================= PRINT ================= */

function setupPrint() {

    $("printReportBtn").addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


/* ================= START ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeData();

        setupAuth();
        setupNavigation();
        setupLogout();
        setupProfile();
        setupModals();

        setupEmployeeManagement();
        setupEmployeeTableActions();

        setupAttendance();

        setupPayroll();

        setupLeave();

        setupCalculateButton();

        setupNotifications();

        setupPrint();


        if (session) {
            openMainApp();
        }

    }
);
