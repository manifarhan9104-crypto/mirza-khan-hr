/* =========================================================
   MIRZA KHAN HR
   Complete Front-End HR System
========================================================= */


/* ================= DATABASE ================= */

let employees = JSON.parse(
    localStorage.getItem("mirzaEmployees")
) || [];

let users = JSON.parse(
    localStorage.getItem("mirzaUsers")
) || [
    {
        id: 1,
        username: "admin",
        password: "1234",
        role: "admin",
        employeeId: null
    }
];

let attendance = JSON.parse(
    localStorage.getItem("mirzaAttendance")
) || [];

let leaves = JSON.parse(
    localStorage.getItem("mirzaLeaves")
) || [];

let payrolls = JSON.parse(
    localStorage.getItem("mirzaPayrolls")
) || [];

let notifications = JSON.parse(
    localStorage.getItem("mirzaNotifications")
) || [];

let currentUser = null;


/* ================= SAVE ================= */

function saveAll(){

    localStorage.setItem(
        "mirzaEmployees",
        JSON.stringify(employees)
    );

    localStorage.setItem(
        "mirzaUsers",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "mirzaAttendance",
        JSON.stringify(attendance)
    );

    localStorage.setItem(
        "mirzaLeaves",
        JSON.stringify(leaves)
    );

    localStorage.setItem(
        "mirzaPayrolls",
        JSON.stringify(payrolls)
    );

    localStorage.setItem(
        "mirzaNotifications",
        JSON.stringify(notifications)
    );
}


/* ================= HELPERS ================= */

function money(number){

    return Number(number || 0).toLocaleString("fa-IR")
        + " تومان";
}

function today(){

    return new Date()
        .toISOString()
        .split("T")[0];
}

function generateId(){

    return Date.now() + Math.floor(Math.random() * 1000);
}

function getEmployee(id){

    return employees.find(
        e => Number(e.id) === Number(id)
    );
}

function getPayroll(employeeId){

    return payrolls.find(
        p => Number(p.employeeId) === Number(employeeId)
    );
}

function showToast(message, title="موفق"){

    const toast =
        document.getElementById("toast");

    document.getElementById("toastTitle")
        .textContent = title;

    document.getElementById("toastMessage")
        .textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* ================= AUTH ================= */

const loginPage =
    document.getElementById("loginPage");

const registerPage =
    document.getElementById("registerPage");

const application =
    document.getElementById("application");


document.getElementById("showRegisterBtn")
    .addEventListener("click", () => {

        loginPage.classList.add("hidden");
        registerPage.classList.remove("hidden");

    });


document.getElementById("backToLoginBtn")
    .addEventListener("click", () => {

        registerPage.classList.add("hidden");
        loginPage.classList.remove("hidden");

    });


/* LOGIN */

document.getElementById("loginBtn")
    .addEventListener("click", login);


document.getElementById("loginPassword")
    .addEventListener("keydown", e => {

        if(e.key === "Enter"){
            login();
        }

    });


function login(){

    const username =
        document.getElementById("loginUsername")
            .value.trim();

    const password =
        document.getElementById("loginPassword")
            .value.trim();

    const user = users.find(
        u =>
            u.username === username &&
            u.password === password
    );

    if(!user){

        showToast(
            "نام کاربری یا رمز عبور اشتباه است.",
            "خطا"
        );

        return;
    }

    if(user.role === "employee"){

        const employee =
            getEmployee(user.employeeId);

        if(!employee){

            showToast(
                "حساب کاربری به کارمند متصل نیست.",
                "خطا"
            );

            return;
        }

        if(employee.status === "inactive"){

            showToast(
                "حساب شما غیرفعال شده است.",
                "خطا"
            );

            return;
        }
    }

    currentUser = user;

    loginPage.classList.add("hidden");
    registerPage.classList.add("hidden");
    application.classList.remove("hidden");

    setupInterface();

    showToast("خوش آمدید");

}


/* LOGOUT */

document.getElementById("logoutBtn")
    .addEventListener("click", () => {

        currentUser = null;

        application.classList.add("hidden");
        loginPage.classList.remove("hidden");

        document.getElementById("loginUsername").value = "";
        document.getElementById("loginPassword").value = "";

    });


/* ================= REGISTER ================= */

document.getElementById("registerBtn")
    .addEventListener("click", registerEmployee);


function registerEmployee(){

    const name =
        document.getElementById("registerName")
            .value.trim();

    const nationalCode =
        document.getElementById("registerNationalCode")
            .value.trim();

    const birthDate =
        document.getElementById("registerBirthDate")
            .value;

    const phone =
        document.getElementById("registerPhone")
            .value.trim();

    const username =
        document.getElementById("registerUsername")
            .value.trim();

    const password =
        document.getElementById("registerPassword")
            .value.trim();


    if(
        !name ||
        !nationalCode ||
        !birthDate ||
        !username ||
        !password
    ){

        showToast(
            "لطفاً تمام اطلاعات ضروری را وارد کنید.",
            "خطا"
        );

        return;
    }


    if(nationalCode.length !== 10){

        showToast(
            "کد ملی باید ۱۰ رقم باشد.",
            "خطا"
        );

        return;
    }


    if(users.some(u => u.username === username)){

        showToast(
            "این نام کاربری قبلاً استفاده شده است.",
            "خطا"
        );

        return;
    }


    if(
        employees.some(
            e => e.nationalCode === nationalCode
        )
    ){

        showToast(
            "این کد ملی قبلاً ثبت شده است.",
            "خطا"
        );

        return;
    }


    const employeeId = generateId();

    const employee = {

        id: employeeId,

        name,

        code:
            "MK-" +
            String(employees.length + 1001),

        nationalCode,

        birthDate,

        phone,

        hireDate: today(),

        department: "تعیین نشده",

        position: "کارمند",

        salary: 0,

        status: "active"

    };


    employees.push(employee);


    users.push({

        id: generateId(),

        username,

        password,

        role: "employee",

        employeeId

    });


    saveAll();


    showToast(
        "ثبت نام با موفقیت انجام شد."
    );


    document.getElementById("registerName").value = "";
    document.getElementById("registerNationalCode").value = "";
    document.getElementById("registerBirthDate").value = "";
    document.getElementById("registerPhone").value = "";
    document.getElementById("registerUsername").value = "";
    document.getElementById("registerPassword").value = "";


    registerPage.classList.add("hidden");
    loginPage.classList.remove("hidden");

}


/* ================= INTERFACE ================= */

function setupInterface(){

    const adminMenu =
        document.getElementById("adminMenu");

    const employeeMenus =
        document.querySelectorAll(".employee-only-menu");


    if(currentUser.role === "admin"){

        adminMenu.classList.remove("hidden");

        employeeMenus.forEach(
            menu => menu.classList.add("hidden")
        );

        document.getElementById("page-dashboard")
            .classList.add("active-page");

        navigate("dashboard");

        updateAdminDashboard();

    }else{

        adminMenu.classList.add("hidden");

        employeeMenus.forEach(
            menu => menu.classList.remove("hidden")
        );

        navigate("employeeHome");

        updateEmployeePanel();

    }


    updateTopbar();

    updateBadges();

}


/* ================= TOPBAR ================= */

function updateTopbar(){

    const name =
        document.getElementById("topUserName");

    const role =
        document.getElementById("topUserRole");

    const avatar =
        document.getElementById("topUserAvatar");


    if(currentUser.role === "admin"){

        name.textContent = "مدیر سیستم";
        role.textContent = "مدیریت منابع انسانی";
        avatar.textContent = "م";

    }else{

        const employee =
            getEmployee(currentUser.employeeId);

        name.textContent =
            employee ? employee.name : "کارمند";

        role.textContent =
            employee ? employee.position : "کارمند";

        avatar.textContent =
            employee
                ? employee.name.charAt(0)
                : "ک";

    }

}


/* ================= NAVIGATION ================= */

document.addEventListener("click", e => {

    const target =
        e.target.closest("[data-page]");

    if(!target) return;

    const page =
        target.dataset.page;

    navigate(page);

});


function navigate(page){

    document.querySelectorAll(".page")
        .forEach(
            p => p.classList.remove("active-page")
        );


    const selected =
        document.getElementById(
            "page-" + page
        );

    if(!selected) return;

    selected.classList.add("active-page");


    document.querySelectorAll(".menu-item")
        .forEach(
            item => item.classList.remove("active")
        );


    document.querySelectorAll(
        `.menu-item[data-page="${page}"]`
    ).forEach(
        item => item.classList.add("active")
    );


    const titles = {

        dashboard: [
            "داشبورد",
            "مدیریت جامع منابع انسانی"
        ],

        employees: [
            "مدیریت کارکنان",
            "اطلاعات کارکنان"
        ],

        attendance: [
            "حضور و غیاب",
            "ثبت حضور کارکنان"
        ],

        leave: [
            "مدیریت مرخصی",
            "بررسی درخواست‌ها"
        ],

        payroll: [
            "حقوق و کسورات",
            "مدیریت پرداختی"
        ],

        reports: [
            "گزارش‌ها",
            "گزارش‌های مدیریتی"
        ],

        notifications: [
            "اعلان‌ها",
            "اطلاعیه‌های سامانه"
        ],

        profile: [
            "پروفایل",
            "اطلاعات حساب"
        ],

        employeeHome: [
            "صفحه اصلی",
            "پنل کارمند"
        ],

        myProfile: [
            "پروفایل من",
            "اطلاعات شخصی و شغلی"
        ],

        myAttendance: [
            "حضور و غیاب من",
            "سوابق حضور"
        ],

        myLeave: [
            "مرخصی من",
            "درخواست‌های مرخصی"
        ],

        myPayroll: [
            "حقوق من",
            "حقوق و کسورات"
        ]

    };


    if(titles[page]){

        document.getElementById("pageTitle")
            .textContent = titles[page][0];

        document.getElementById("pageSubtitle")
            .textContent = titles[page][1];

    }


    if(page === "employees")
        renderEmployees();

    if(page === "attendance")
        renderAttendance();

    if(page === "leave")
        renderLeaves();

    if(page === "payroll")
        renderPayroll();

    if(page === "reports")
        renderReports();

    if(page === "notifications")
        renderNotifications();

    if(page === "profile")
        renderProfile();

    if(page === "employeeHome")
        updateEmployeePanel();

    if(page === "myProfile")
        renderMyProfile();

    if(page === "myAttendance")
        renderMyAttendance();

    if(page === "myLeave")
        renderMyLeave();

    if(page === "myPayroll")
        renderMyPayroll();


    closeMobileMenu();

}


/* ================= DASHBOARD ================= */

function updateAdminDashboard(){

    const active =
        employees.filter(
            e => e.status === "active"
        );

    document.getElementById("totalEmployees")
        .textContent = active.length;


    const date = today();

    const records =
        attendance.filter(
            a => a.date === date
        );


    document.getElementById("presentEmployees")
        .textContent =
        records.filter(
            a => a.status === "present"
        ).length;


    document.getElementById("absentEmployees")
        .textContent =
        records.filter(
            a => a.status === "absent"
        ).length;


    document.getElementById("lateEmployees")
        .textContent =
        records.filter(
            a => a.status === "late"
        ).length;


    document.getElementById("employeeMenuBadge")
        .textContent = employees.length;


    renderRecentEmployees();
    renderActivities();

    updateBadges();

}


/* ================= RECENT EMPLOYEES ================= */

function renderRecentEmployees(){

    const container =
        document.getElementById("recentEmployees");

    if(!employees.length){

        container.innerHTML =
            `<div class="empty-state">
                هنوز کارمندی ثبت نشده است.
            </div>`;

        return;
    }


    container.innerHTML =
        employees
        .slice(-5)
        .reverse()
        .map(e => `

            <div class="recent-row">

                <div class="small-avatar">
                    ${e.name.charAt(0)}
                </div>

                <div>
                    <strong>${e.name}</strong>
                    <small>
                        ${e.position}
                    </small>
                </div>

                <span class="status-badge status-active">
                    ${e.department}
                </span>

            </div>

        `)
        .join("");

}


/* ================= ACTIVITIES ================= */

function renderActivities(){

    const container =
        document.getElementById("recentActivities");

    const items = [];


    employees.slice(-3).forEach(e => {

        items.push(
            `کارمند ${e.name} ثبت شد.`
        );

    });


    leaves.slice(-3).forEach(l => {

        const e =
            getEmployee(l.employeeId);

        if(e){

            items.push(
                `درخواست مرخصی ${e.name} ثبت شد.`
            );

        }

    });


    if(!items.length){

        container.innerHTML =
            `<div class="empty-state">
                فعالیتی وجود ندارد.
            </div>`;

        return;
    }


    container.innerHTML =
        items.reverse()
        .map(
            item => `
                <div class="activity-row">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>${item}</span>
                </div>
            `
        )
        .join("");

}


/* ================= EMPLOYEES ================= */

document.getElementById("addEmployeeBtn")
    .addEventListener(
        "click",
        () => openEmployeeModal()
    );


document.getElementById("employeeForm")
    .addEventListener(
        "submit",
        saveEmployee
    );


function openEmployeeModal(id=null){

    document.getElementById("employeeModal")
        .classList.add("show");


    if(id){

        const e =
            getEmployee(id);

        document.getElementById("employeeModalTitle")
            .textContent = "ویرایش کارمند";


        document.getElementById("employeeId")
            .value = e.id;

        document.getElementById("employeeName")
            .value = e.name;

        document.getElementById("employeeCode")
            .value = e.code || "";

        document.getElementById("employeeNationalCode")
            .value = e.nationalCode || "";

        document.getElementById("employeeBirthDate")
            .value = e.birthDate || "";

        document.getElementById("employeePhone")
            .value = e.phone || "";

        document.getElementById("employeeHireDate")
            .value = e.hireDate || "";

        document.getElementById("employeeDepartment")
            .value = e.department || "";

        document.getElementById("employeePosition")
            .value = e.position || "";

        document.getElementById("employeeSalary")
            .value = e.salary || 0;

        document.getElementById("employeeStatus")
            .value = e.status || "active";

    }else{

        document.getElementById("employeeModalTitle")
            .textContent = "افزودن کارمند";

        document.getElementById("employeeForm")
            .reset();

        document.getElementById("employeeId")
            .value = "";

    }

}


function saveEmployee(e){

    e.preventDefault();


    const id =
        document.getElementById("employeeId").value;


    const data = {

        name:
            document.getElementById("employeeName").value.trim(),

        code:
            document.getElementById("employeeCode").value.trim(),

        nationalCode:
            document.getElementById("employeeNationalCode").value.trim(),

        birthDate:
            document.getElementById("employeeBirthDate").value,

        phone:
            document.getElementById("employeePhone").value.trim(),

        hireDate:
            document.getElementById("employeeHireDate").value,

        department:
            document.getElementById("employeeDepartment").value,

        position:
            document.getElementById("employeePosition").value.trim(),

        salary:
            Number(
                document.getElementById("employeeSalary").value
            ) || 0,

        status:
            document.getElementById("employeeStatus").value

    };


    if(id){

        const employee =
            getEmployee(id);

        Object.assign(employee,data);

        showToast(
            "اطلاعات کارمند ویرایش شد."
        );

    }else{

        const employee = {

            id:generateId(),

            ...data

        };


        employees.push(employee);


        users.push({

            id:generateId(),

            username:data.code,

            password:"1234",

            role:"employee",

            employeeId:employee.id

        });


        showToast(
            `کارمند اضافه شد. نام کاربری: ${data.code} | رمز: 1234`
        );

    }


    saveAll();

    closeModal("employeeModal");

    renderEmployees();

    updateAdminDashboard();

}


/* ================= EMPLOYEE TABLE ================= */

function renderEmployees(){

    const body =
        document.getElementById("employeesTableBody");


    const search =
        document.getElementById("employeeSearch")
            .value
            .trim()
            .toLowerCase();


    const department =
        document.getElementById("employeeDepartmentFilter")
            .value;


    const filtered =
        employees.filter(e => {

            const text =
                `${e.name} ${e.code} ${e.position} ${e.nationalCode}`
                .toLowerCase();

            return (
                text.includes(search) &&
                (!department ||
                    e.department === department)
            );

        });


    if(!filtered.length){

        body.innerHTML =
            `<tr>
                <td colspan="8" class="empty-state">
                    کارمندی پیدا نشد.
                </td>
            </tr>`;

        return;
    }


    body.innerHTML =
        filtered.map(e => {

            const payroll =
                getPayroll(e.id);

            const net =
                payroll
                    ? calculateNet(payroll)
                    : e.salary || 0;


            return `

            <tr>

                <td>
                    <strong>${e.name}</strong>
                </td>

                <td>${e.code || "---"}</td>

                <td>${e.nationalCode || "---"}</td>

                <td>${e.department || "---"}</td>

                <td>${e.position || "---"}</td>

                <td>${money(net)}</td>

                <td>
                    <span class="status-badge ${
                        e.status === "active"
                            ? "status-active"
                            : "status-inactive"
                    }">
                        ${
                            e.status === "active"
                                ? "فعال"
                                : "غیرفعال"
                        }
                    </span>
                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="action-btn action-view"
                            title="مشاهده"
                            onclick="viewEmployee(${e.id})"
                        >
                            <i class="fa-solid fa-eye"></i>
                        </button>

                        <button
                            class="action-btn action-edit"
                            title="ویرایش"
                            onclick="openEmployeeModal(${e.id})"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button
                            class="action-btn action-attendance"
                            title="حضور و غیاب"
                            onclick="openAttendanceModal(${e.id})"
                        >
                            <i class="fa-solid fa-clock"></i>
                        </button>

                        <button
                            class="action-btn action-delete"
                            title="حذف"
                            onclick="deleteEmployee(${e.id})"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>

            </tr>

            `;

        }).join("");

}


/* SEARCH */

document.getElementById("employeeSearch")
    .addEventListener(
        "input",
        renderEmployees
    );


document.getElementById("employeeDepartmentFilter")
    .addEventListener(
        "change",
        renderEmployees
    );


/* ================= VIEW EMPLOYEE ================= */

function viewEmployee(id){

    const e =
        getEmployee(id);

    if(!e) return;

    alert(
        `نام: ${e.name}\n` +
        `کد پرسنلی: ${e.code}\n` +
        `کد ملی: ${e.nationalCode}\n` +
        `تاریخ تولد: ${e.birthDate}\n` +
        `واحد: ${e.department}\n` +
        `سمت: ${e.position}\n` +
        `حقوق: ${money(e.salary)}\n` +
        `تلفن: ${e.phone || "---"}`
    );

}


/* ================= DELETE ================= */

function deleteEmployee(id){

    const e =
        getEmployee(id);

    if(!e) return;


    if(!confirm(
        `آیا از حذف ${e.name} مطمئن هستید؟`
    )) return;


    employees =
        employees.filter(
            x => Number(x.id) !== Number(id)
        );


    users =
        users.filter(
            x => Number(x.employeeId) !== Number(id)
        );


    attendance =
        attendance.filter(
            x => Number(x.employeeId) !== Number(id)
        );


    leaves =
        leaves.filter(
            x => Number(x.employeeId) !== Number(id)
        );


    payrolls =
        payrolls.filter(
            x => Number(x.employeeId) !== Number(id)
        );


    saveAll();

    renderEmployees();

    updateAdminDashboard();

    showToast(
        "کارمند حذف شد."
    );

}


/* ================= ATTENDANCE ================= */

document.getElementById("attendanceDate")
    .value = today();


function openAttendanceModal(id){

    const record =
        attendance.find(
            a =>
                Number(a.employeeId) === Number(id) &&
                a.date ===
                    document.getElementById("attendanceDate").value
        );


    document.getElementById("attendanceEmployeeId")
        .value = id;


    document.getElementById("attendanceIn")
        .value = record?.in || "";

    document.getElementById("attendanceOut")
        .value = record?.out || "";

    document.getElementById("attendanceStatus")
        .value = record?.status || "present";


    document.getElementById("attendanceModal")
        .classList.add("show");

}


document.getElementById("attendanceForm")
    .addEventListener(
        "submit",
        saveAttendance
    );


function saveAttendance(e){

    e.preventDefault();


    const employeeId =
        Number(
            document.getElementById(
                "attendanceEmployeeId"
            ).value
        );


    const date =
        document.getElementById("attendanceDate")
            .value;


    const record = {

        id:generateId(),

        employeeId,

        date,

        in:
            document.getElementById("attendanceIn").value,

        out:
            document.getElementById("attendanceOut").value,

        status:
            document.getElementById("attendanceStatus").value

    };


    const index =
        attendance.findIndex(
            a =>
                Number(a.employeeId) === employeeId &&
                a.date === date
        );


    if(index >= 0){

        attendance[index] = record;

    }else{

        attendance.push(record);

    }


    saveAll();

    closeModal("attendanceModal");

    renderAttendance();

    updateAdminDashboard();

    showToast(
        "حضور و غیاب ثبت شد."
    );

}


function renderAttendance(){

    const body =
        document.getElementById("attendanceTableBody");


    const date =
        document.getElementById("attendanceDate")
            .value || today();


    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;


    body.innerHTML =
        employees.map(e => {

            const record =
                attendance.find(
                    a =>
                        Number(a.employeeId) === Number(e.id) &&
                        a.date === date
                );


            const status =
                record?.status || "absent";


            if(status === "present") present++;
            if(status === "absent") absent++;
            if(status === "late") late++;
            if(status === "leave") leave++;


            const labels = {

                present:"حاضر",
                absent:"غایب",
                late:"تأخیر",
                leave:"مرخصی"

            };


            return `

            <tr>

                <td>
                    <strong>${e.name}</strong>
                </td>

                <td>
                    ${record?.in || "---"}
                </td>

                <td>
                    ${record?.out || "---"}
                </td>

                <td>

                    <span class="status-badge status-${status}">
                        ${labels[status]}
                    </span>

                </td>

                <td>

                    <button
                        class="action-btn action-attendance"
                        title="ثبت حضور"
                        onclick="openAttendanceModal(${e.id})"
                    >
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                </td>

            </tr>

            `;

        }).join("");


    document.getElementById("attendancePresent")
        .textContent = present;

    document.getElementById("attendanceAbsent")
        .textContent = absent;

    document.getElementById("attendanceLate")
        .textContent = late;

    document.getElementById("attendanceLeave")
        .textContent = leave;

}


document.getElementById("attendanceDate")
    .addEventListener(
        "change",
        renderAttendance
    );


/* ================= LEAVE ================= */

document.getElementById("leaveForm")
    .addEventListener(
        "submit",
        saveLeave
    );


document.getElementById("employeeAddLeaveBtn")
    .addEventListener(
        "click",
        () => openLeaveModal(true)
    );


function openLeaveModal(forEmployee=false){

    const select =
        document.getElementById("leaveEmployee");

    select.innerHTML =
        employees.map(
            e =>
                `<option value="${e.id}">
                    ${e.name}
                </option>`
        ).join("");


    document.getElementById(
        "adminLeaveEmployeeGroup"
    ).classList.toggle(
        "hidden",
        forEmployee
    );


    if(forEmployee){

        select.value =
            currentUser.employeeId;

    }


    document.getElementById("leaveModal")
        .classList.add("show");

}


function saveLeave(e){

    e.preventDefault();


    let employeeId;


    if(currentUser.role === "employee"){

        employeeId =
            Number(currentUser.employeeId);

    }else{

        employeeId =
            Number(
                document.getElementById("leaveEmployee")
                    .value
            );

    }


    const start =
        document.getElementById("leaveStart")
            .value;

    const end =
        document.getElementById("leaveEnd")
            .value;


    if(end < start){

        showToast(
            "تاریخ پایان نمی‌تواند قبل از شروع باشد.",
            "خطا"
        );

        return;
    }


    const days =
        calculateDays(start,end);


    leaves.push({

        id:generateId(),

        employeeId,

        type:
            document.getElementById("leaveType").value,

        start,

        end,

        days,

        description:
            document.getElementById("leaveDescription").value,

        status:"pending",

        createdAt:new Date().toISOString()

    });


    notifications.push({

        id:generateId(),

        text:"درخواست مرخصی جدید ثبت شد.",

        read:false,

        date:new Date().toLocaleString("fa-IR")

    });


    saveAll();

    closeModal("leaveModal");

    showToast(
        "درخواست مرخصی ثبت شد."
    );


    if(currentUser.role === "admin"){

        renderLeaves();

    }else{

        renderMyLeave();

    }


    updateBadges();

}


function calculateDays(start,end){

    const a =
        new Date(start);

    const b =
        new Date(end);

    const diff =
        Math.abs(b-a);

    return Math.floor(
        diff / (1000*60*60*24)
    ) + 1;

}


/* LEAVE TABLE */

function renderLeaves(){

    const body =
        document.getElementById("leaveTableBody");


    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let totalDays = 0;


    if(!leaves.length){

        body.innerHTML =
            `<tr>
                <td colspan="7" class="empty-state">
                    درخواست مرخصی وجود ندارد.
                </td>
            </tr>`;

    }else{

        body.innerHTML =
            leaves.map(l => {

                const e =
                    getEmployee(l.employeeId);

                if(l.status === "pending") pending++;
                if(l.status === "approved") approved++;
                if(l.status === "rejected") rejected++;

                totalDays += Number(l.days || 0);


                const statusText = {

                    pending:"در انتظار بررسی",
                    approved:"تأیید شده",
                    rejected:"رد شده"

                };


                return `

                <tr>

                    <td>${e?.name || "---"}</td>

                    <td>${l.type}</td>

                    <td>${l.start}</td>

                    <td>${l.end}</td>

                    <td>${l.days}</td>

                    <td>

                        <span class="status-badge status-${l.status}">
                            ${statusText[l.status]}
                        </span>

                    </td>

                    <td>

                        <div class="action-buttons">

                            ${
                                l.status === "pending"
                                ? `

                                    <button
                                        class="action-btn action-approve"
                                        title="تأیید"
                                        onclick="approveLeave(${l.id})"
                                    >
                                        <i class="fa-solid fa-check"></i>
                                    </button>

                                    <button
                                        class="action-btn action-reject"
                                        title="رد"
                                        onclick="rejectLeave(${l.id})"
                                    >
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>

                                  `
                                : `
                                    <button
                                        class="action-btn action-view"
                                        title="مشاهده"
                                        onclick="viewLeave(${l.id})"
                                    >
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                  `
                            }

                        </div>

                    </td>

                </tr>

                `;

            }).join("");

    }


    document.getElementById("pendingLeaves")
        .textContent = pending;

    document.getElementById("approvedLeaves")
        .textContent = approved;

    document.getElementById("rejectedLeaves")
        .textContent = rejected;

    document.getElementById("totalLeaveDays")
        .textContent = totalDays;

    updateBadges();

}


function approveLeave(id){

    const leave =
        leaves.find(
            l => Number(l.id) === Number(id)
        );

    if(!leave) return;


    leave.status = "approved";

    notifications.push({

        id:generateId(),

        text:"یک درخواست مرخصی تأیید شد.",

        read:false,

        date:new Date().toLocaleString("fa-IR")

    });


    saveAll();

    renderLeaves();

    updateBadges();

    showToast(
        "درخواست مرخصی تأیید شد."
    );

}


function rejectLeave(id){

    const leave =
        leaves.find(
            l => Number(l.id) === Number(id)
        );

    if(!leave) return;


    leave.status = "rejected";


    saveAll();

    renderLeaves();

    updateBadges();

    showToast(
        "درخواست مرخصی رد شد."
    );

}


function viewLeave(id){

    const leave =
        leaves.find(
            l => Number(l.id) === Number(id)
        );

    const e =
        getEmployee(leave.employeeId);


    alert(
        `کارمند: ${e?.name}\n` +
        `نوع: ${leave.type}\n` +
        `شروع: ${leave.start}\n` +
        `پایان: ${leave.end}\n` +
        `روز: ${leave.days}\n` +
        `توضیحات: ${leave.description || "---"}`
    );

}


/* ================= PAYROLL ================= */

function calculateNet(p){

    return (
        Number(p.base || 0) +
        Number(p.overtime || 0) +
        Number(p.bonus || 0)
    )
    -
    (
        Number(p.insurance || 0) +
        Number(p.tax || 0) +
        Number(p.other || 0)
    );

}


function renderPayroll(){

    const body =
        document.getElementById("payrollTableBody");


    let gross = 0;
    let deductions = 0;
    let net = 0;


    body.innerHTML =
        employees.map(e => {

            let p =
                getPayroll(e.id);


            if(!p){

                p = {

                    employeeId:e.id,

                    base:e.salary || 0,

                    overtime:0,

                    bonus:0,

                    insurance:0,

                    tax:0,

                    other:0

                };

            }


            const benefit =
                Number(p.overtime) +
                Number(p.bonus);

            const deduction =
                Number(p.insurance) +
                Number(p.tax) +
                Number(p.other);

            const employeeNet =
                calculateNet(p);


            gross +=
                Number(p.base) + benefit;

            deductions +=
                deduction;

            net +=
                employeeNet;


            return `

            <tr>

                <td>${e.name}</td>

                <td>${money(p.base)}</td>

                <td>${money(p.overtime)}</td>

                <td>${money(p.bonus)}</td>

                <td>${money(deduction)}</td>

                <td>
                    <strong>${money(employeeNet)}</strong>
                </td>

                <td>

                    <button
                        class="action-btn action-edit"
                        title="ویرایش حقوق"
                        onclick="openPayrollModal(${e.id})"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>

                </td>

            </tr>

            `;

        }).join("");


    document.getElementById("grossPayroll")
        .textContent = money(gross);

    document.getElementById("deductionPayroll")
        .textContent = money(deductions);

    document.getElementById("netPayroll")
        .textContent = money(net);

}


function openPayrollModal(id){

    const e =
        getEmployee(id);

    let p =
        getPayroll(id);


    if(!p){

        p = {

            employeeId:id,

            base:e.salary || 0,

            overtime:0,

            bonus:0,

            insurance:0,

            tax:0,

            other:0

        };

    }


    document.getElementById("payrollEmployeeId")
        .value = id;

    document.getElementById("payrollBase")
        .value = p.base;

    document.getElementById("payrollOvertime")
        .value = p.overtime;

    document.getElementById("payrollBonus")
        .value = p.bonus;

    document.getElementById("payrollInsurance")
        .value = p.insurance;

    document.getElementById("payrollTax")
        .value = p.tax;

    document.getElementById("payrollOther")
        .value = p.other;


    updatePayrollPreview();

    document.getElementById("payrollModal")
        .classList.add("show");

}


function updatePayrollPreview(){

    const p = {

        base:
            Number(
                document.getElementById("payrollBase").value
            ) || 0,

        overtime:
            Number(
                document.getElementById("payrollOvertime").value
            ) || 0,

        bonus:
            Number(
                document.getElementById("payrollBonus").value
            ) || 0,

        insurance:
            Number(
                document.getElementById("payrollInsurance").value
            ) || 0,

        tax:
            Number(
                document.getElementById("payrollTax").value
            ) || 0,

        other:
            Number(
                document.getElementById("payrollOther").value
            ) || 0

    };


    document.getElementById("payrollNetPreview")
        .textContent =
        money(calculateNet(p));

}


document.querySelectorAll(
    "#payrollBase,#payrollOvertime,#payrollBonus,#payrollInsurance,#payrollTax,#payrollOther"
).forEach(
    input =>
        input.addEventListener(
            "input",
            updatePayrollPreview
        )
);


document.getElementById("payrollForm")
    .addEventListener(
        "submit",
        savePayroll
    );


function savePayroll(e){

    e.preventDefault();


    const employeeId =
        Number(
            document.getElementById(
                "payrollEmployeeId"
            ).value
        );


    const data = {

        employeeId,

        base:
            Number(
                document.getElementById("payrollBase").value
            ) || 0,

        overtime:
            Number(
                document.getElementById("payrollOvertime").value
            ) || 0,

        bonus:
            Number(
                document.getElementById("payrollBonus").value
            ) || 0,

        insurance:
            Number(
                document.getElementById("payrollInsurance").value
            ) || 0,

        tax:
            Number(
                document.getElementById("payrollTax").value
            ) || 0,

        other:
            Number(
                document.getElementById("payrollOther").value
            ) || 0

    };


    const index =
        payrolls.findIndex(
            p =>
                Number(p.employeeId) === employeeId
        );


    if(index >= 0){

        payrolls[index] = data;

    }else{

        payrolls.push(data);

    }


    const employee =
        getEmployee(employeeId);

    if(employee){

        employee.salary =
            data.base;

    }


    saveAll();

    closeModal("payrollModal");

    renderPayroll();

    renderEmployees();

    showToast(
        "حقوق و کسورات ذخیره شد."
    );

}


/* ================= EMPLOYEE PANEL ================= */

function updateEmployeePanel(){

    const e =
        getEmployee(currentUser.employeeId);

    if(!e) return;


    document.getElementById("employeeWelcomeName")
        .textContent = e.name;


    const p =
        getPayroll(e.id);


    const net =
        p
            ? calculateNet(p)
            : e.salary || 0;


    document.getElementById("employeeHomeSalary")
        .textContent =
        Number(net).toLocaleString("fa-IR");


    const myAttendance =
        attendance.filter(
            a =>
                Number(a.employeeId) === Number(e.id)
        );


    document.getElementById("employeeHomePresent")
        .textContent =
        myAttendance.filter(
            a => a.status === "present"
        ).length;


    document.getElementById("employeeHomeLate")
        .textContent =
        myAttendance.filter(
            a => a.status === "late"
        ).length;


    document.getElementById("employeeHomeLeave")
        .textContent =
        leaves.filter(
            l =>
                Number(l.employeeId) === Number(e.id)
        ).length;

}


/* ================= MY PROFILE ================= */

function renderMyProfile(){

    const e =
        getEmployee(currentUser.employeeId);

    if(!e) return;


    document.getElementById("myProfileName")
        .textContent = e.name;

    document.getElementById("myProfilePosition")
        .textContent = e.position;

    document.getElementById("myProfileAvatar")
        .textContent = e.name.charAt(0);


    document.getElementById("myName")
        .textContent = e.name;

    document.getElementById("myNationalCode")
        .textContent = e.nationalCode || "---";

    document.getElementById("myBirthDate")
        .textContent = e.birthDate || "---";

    document.getElementById("myPhone")
        .textContent = e.phone || "---";

    document.getElementById("myEmployeeCode")
        .textContent = e.code || "---";

    document.getElementById("myDepartment")
        .textContent = e.department || "---";

    document.getElementById("myPosition")
        .textContent = e.position || "---";

    document.getElementById("myHireDate")
        .textContent = e.hireDate || "---";

}


/* ================= MY ATTENDANCE ================= */

function renderMyAttendance(){

    const body =
        document.getElementById("myAttendanceBody");


    const records =
        attendance.filter(
            a =>
                Number(a.employeeId) ===
                Number(currentUser.employeeId)
        );


    if(!records.length){

        body.innerHTML =
            `<tr>
                <td colspan="4">
                    هنوز سابقه‌ای ثبت نشده است.
                </td>
            </tr>`;

        return;
    }


    const labels = {

        present:"حاضر",
        absent:"غایب",
        late:"تأخیر",
        leave:"مرخصی"

    };


    body.innerHTML =
        records
        .slice()
        .reverse()
        .map(
            r => `

            <tr>

                <td>${r.date}</td>

                <td>${r.in || "---"}</td>

                <td>${r.out || "---"}</td>

                <td>

                    <span class="status-badge status-${r.status}">
                        ${labels[r.status]}
                    </span>

                </td>

            </tr>

            `
        )
        .join("");

}


/* ================= MY LEAVE ================= */

function renderMyLeave(){

    const body =
        document.getElementById("myLeaveBody");


    const myLeaves =
        leaves.filter(
            l =>
                Number(l.employeeId) ===
                Number(currentUser.employeeId)
        );


    if(!myLeaves.length){

        body.innerHTML =
            `<tr>
                <td colspan="5">
                    هنوز درخواست مرخصی ثبت نکرده‌اید.
                </td>
            </tr>`;

        return;
    }


    const statusText = {

        pending:"در انتظار بررسی",
        approved:"تأیید شده",
        rejected:"رد شده"

    };


    body.innerHTML =
        myLeaves
        .slice()
        .reverse()
        .map(
            l => `

            <tr>

                <td>${l.type}</td>

                <td>${l.start}</td>

                <td>${l.end}</td>

                <td>${l.days}</td>

                <td>

                    <span class="status-badge status-${l.status}">
                        ${statusText[l.status]}
                    </span>

                </td>

            </tr>

            `
        )
        .join("");

}


/* ================= MY PAYROLL ================= */

function renderMyPayroll(){

    const e =
        getEmployee(currentUser.employeeId);

    if(!e) return;


    const p =
        getPayroll(e.id) || {

            base:e.salary || 0,

            overtime:0,

            bonus:0,

            insurance:0,

            tax:0,

            other:0

        };


    const benefits =
        Number(p.overtime) +
        Number(p.bonus);


    const deductions =
        Number(p.insurance) +
        Number(p.tax) +
        Number(p.other);


    const net =
        calculateNet(p);


    document.getElementById("myBaseSalary")
        .textContent =
        money(p.base);

    document.getElementById("myBenefits")
        .textContent =
        money(benefits);

    document.getElementById("myDeductions")
        .textContent =
        money(deductions);

    document.getElementById("myNetSalary")
        .textContent =
        money(net);

}


/* ================= PROFILE ADMIN ================= */

document.getElementById("profileButton")
    .addEventListener(
        "click",
        () => {

            if(currentUser.role === "admin"){

                navigate("profile");

                renderProfile();

            }else{

                navigate("myProfile");

                renderMyProfile();

            }

        }
    );


function renderProfile(){

    document.getElementById("profileUsername")
        .textContent =
        currentUser.username;

}


/* ================= REPORTS ================= */

function renderReports(){

    const active =
        employees.filter(
            e => e.status === "active"
        );


    document.getElementById("reportEmployees")
        .textContent = active.length;


    const total =
        attendance.length;

    const present =
        attendance.filter(
            a => a.status === "present"
        ).length;


    const rate =
        total
            ? Math.round(
                present / total * 100
            )
            : 0;


    document.getElementById("reportAttendance")
        .textContent =
        rate + "%";

    document.getElementById("attendancePercent")
        .textContent =
        rate + "%";

    document.getElementById("attendanceProgress")
        .style.width =
        rate + "%";


    document.getElementById("reportLeaves")
        .textContent =
        leaves.length;


    const totalPayroll =
        payrolls.reduce(
            (sum,p) =>
                sum + calculateNet(p),
            0
        );


    document.getElementById("reportPayroll")
        .textContent =
        Number(totalPayroll)
            .toLocaleString("fa-IR");


    const departmentReport =
        document.getElementById(
            "departmentReport"
        );


    const departments = {};


    employees.forEach(e => {

        const d =
            e.department || "تعیین نشده";

        departments[d] =
            (departments[d] || 0) + 1;

    });


    departmentReport.innerHTML =
        Object.entries(departments)
        .map(
            ([name,count]) =>
                `
                <div class="department-row">
                    <span>${name}</span>
                    <strong>${count}</strong>
                </div>
                `
        )
        .join("");

}


/* ================= NOTIFICATIONS ================= */

function renderNotifications(){

    const list =
        document.getElementById(
            "notificationsList"
        );


    if(!notifications.length){

        list.innerHTML =
            `<div class="empty-state">
                اعلان جدیدی وجود ندارد.
            </div>`;

        return;
    }


    list.innerHTML =
        notifications
        .slice()
        .reverse()
        .map(
            n => `

            <div class="notification-row">

                <div class="notification-icon">
                    <i class="fa-solid fa-bell"></i>
                </div>

                <div>
                    <strong>${n.text}</strong>
                    <small>${n.date}</small>
                </div>

            </div>

            `
        )
        .join("");

}


document.getElementById("markAllNotifications")
    .addEventListener(
        "click",
        () => {

            notifications.forEach(
                n => n.read = true
            );

            saveAll();

            updateBadges();

            renderNotifications();

            showToast(
                "همه اعلان‌ها خوانده شدند."
            );

        }
    );


/* ================= BADGES ================= */

function updateBadges(){

    const pending =
        leaves.filter(
            l => l.status === "pending"
        ).length;


    const unread =
        notifications.filter(
            n => !n.read
        ).length;


    document.getElementById(
        "leaveMenuBadge"
    ).textContent = pending;


    document.getElementById(
        "notificationMenuBadge"
    ).textContent = unread;


    document.getElementById(
        "notificationBadge"
    ).textContent = unread;

}


/* ================= MODALS ================= */

document.querySelectorAll("[data-close]")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        button.dataset.close
                    );

                }
            );

        }
    );


function closeModal(id){

    document.getElementById(id)
        .classList.remove("show");

}


document.querySelectorAll(".modal")
    .forEach(
        modal => {

            modal.addEventListener(
                "click",
                e => {

                    if(e.target === modal){

                        modal.classList.remove(
                            "show"
                        );

                    }

                }
            );

        }
    );


/* ================= MOBILE ================= */

document.getElementById("mobileMenuBtn")
    .addEventListener(
        "click",
        () => {

            document.getElementById("sidebar")
                .classList.add("open");

            document.getElementById("menuOverlay")
                .classList.add("show");

        }
    );


document.getElementById("menuOverlay")
    .addEventListener(
        "click",
        closeMobileMenu
    );


function closeMobileMenu(){

    document.getElementById("sidebar")
        .classList.remove("open");

    document.getElementById("menuOverlay")
        .classList.remove("show");

}


/* ================= PRINT ================= */

document.getElementById("printReportBtn")
    .addEventListener(
        "click",
        () => window.print()
    );


/* ================= INITIAL ================= */

saveAll();
