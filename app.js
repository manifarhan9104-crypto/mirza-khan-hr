/* ==================================================
   MIRZA KHAN HR
   APP.JS - VERSION 1.6
   کارکنان + حضور و غیاب + مرخصی و مأموریت
   + گزارش‌ها + اعلان‌ها
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

    if (!todayDate) return;

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


let employees =
    loadJSON(
        "mirzaKhanEmployees",
        defaultEmployees
    );


function saveEmployees() {

    saveJSON(
        "mirzaKhanEmployees",
        employees
    );

}


/* ==================================================
   ATTENDANCE DATA
================================================== */

let attendanceData =
    loadJSON(
        "mirzaKhanAttendance",
        {}
    );


function saveAttendance() {

    saveJSON(
        "mirzaKhanAttendance",
        attendanceData
    );

}


/* ==================================================
   LEAVE DATA
================================================== */

let leaveRequests =
    loadJSON(
        "mirzaKhanLeaveRequests",
        []
    );


function saveLeaveRequests() {

    saveJSON(
        "mirzaKhanLeaveRequests",
        leaveRequests
    );

}


/* ==================================================
   NOTIFICATION DATA
================================================== */

let notifications =
    loadJSON(
        "mirzaKhanNotifications",
        []
    );


function saveNotifications() {

    saveJSON(
        "mirzaKhanNotifications",
        notifications
    );

}


/* ==================================================
   NOTIFICATION TYPES
================================================== */

const notificationTypes = {

    leave: {
        icon: "🏖️",
        title: "درخواست مرخصی"
    },

    mission: {
        icon: "🚗",
        title: "درخواست مأموریت"
    },

    approved: {
        icon: "✅",
        title: "درخواست تأیید شد"
    },

    rejected: {
        icon: "❌",
        title: "درخواست رد شد"
    },

    attendance: {
        icon: "🕐",
        title: "حضور و غیاب"
    },

    system: {
        icon: "⚙️",
        title: "اعلان سیستم"
    }

};


/* ==================================================
   ADD NOTIFICATION
================================================== */

function addNotification(
    type,
    title,
    message
) {

    const notification = {

        id: Date.now(),

        type,

        title,

        message,

        date:
            new Date().toISOString(),

        read: false

    };


    notifications.unshift(
        notification
    );


    saveNotifications();

    renderNotifications();

    updateNotificationBadge();

}


/* ==================================================
   NOTIFICATION TIME
================================================== */

function formatNotificationTime(
    date
) {

    if (!date) {
        return "";
    }


    const notificationDate =
        new Date(date);


    const now =
        new Date();


    const difference =
        now - notificationDate;


    const minutes =
        Math.floor(
            difference / 60000
        );


    if (minutes < 1) {

        return "همین الان";

    }


    if (minutes < 60) {

        return `${minutes} دقیقه پیش`;

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return `${hours} ساعت پیش`;

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 7) {

        return `${days} روز پیش`;

    }


    return notificationDate.toLocaleDateString(
        "fa-IR"
    );

}


/* ==================================================
   NOTIFICATION BADGE
================================================== */

function updateNotificationBadge() {

    const unreadCount =
        notifications.filter(
            notification =>
                !notification.read
        ).length;


    const menuItem =
        document.querySelector(
            '[data-page="notifications"]'
        );


    if (!menuItem) {
        return;
    }


    let badge =
        menuItem.querySelector(
            ".notification-badge"
        );


    if (
        unreadCount === 0
    ) {

        if (badge) {
            badge.remove();
        }

        return;

    }


    if (!badge) {

        badge =
            document.createElement(
                "span"
            );

        badge.className =
            "notification-badge";


        menuItem.appendChild(
            badge
        );

    }


    badge.textContent =
        unreadCount > 99
            ? "99+"
            : unreadCount;

}


/* ==================================================
   RENDER NOTIFICATIONS
================================================== */

function renderNotifications() {

    const container =
        document.getElementById(
            "notificationsContainer"
        );


    if (!container) {
        updateNotificationBadge();
        return;
    }


    container.innerHTML = "";


    if (
        notifications.length === 0
    ) {

        container.innerHTML = `

            <div class="notification-empty">

                <div class="notification-empty-icon">
                    🔔
                </div>

                <h3>
                    اعلان جدیدی وجود ندارد
                </h3>

                <p>
                    در حال حاضر هیچ اعلان جدیدی برای شما ثبت نشده است.
                </p>

            </div>

        `;

        updateNotificationBadge();

        return;

    }


    notifications.forEach(
        notification => {

            const type =
                notificationTypes[
                    notification.type
                ] || notificationTypes.system;


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

                    ${
                        type.icon
                    }

                </div>


                <div class="notification-content">

                    <div class="notification-title">

                        <strong>

                            ${escapeHTML(
                                notification.title ||
                                type.title
                            )}

                        </strong>

                        ${
                            notification.read
                                ? ""
                                : `<span class="notification-new">
                                    جدید
                                   </span>`
                        }

                    </div>


                    <p>

                        ${escapeHTML(
                            notification.message
                        )}

                    </p>


                    <small>

                        ${formatNotificationTime(
                            notification.date
                        )}

                    </small>

                </div>


                <div class="notification-actions">

                    ${
                        !notification.read
                            ? `
                                <button
                                    class="action-btn"
                                    title="خوانده شد"
                                    onclick="markNotificationRead(${notification.id})"
                                >
                                    ✓
                                </button>
                              `
                            : ""
                    }


                    <button
                        class="action-btn delete"
                        title="حذف اعلان"
                        onclick="deleteNotification(${notification.id})"
                    >
                        🗑️
                    </button>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );


    updateNotificationBadge();

}


/* ==================================================
   MARK NOTIFICATION READ
================================================== */

function markNotificationRead(
    id
) {

    const notification =
        notifications.find(
            item =>
                item.id === id
        );


    if (!notification) {
        return;
    }


    notification.read =
        true;


    saveNotifications();

    renderNotifications();

}


/* ==================================================
   MARK ALL READ
================================================== */

function markAllNotificationsRead() {

    notifications.forEach(
        notification => {

            notification.read =
                true;

        }
    );


    saveNotifications();

    renderNotifications();

}


/* ==================================================
   DELETE NOTIFICATION
================================================== */

function deleteNotification(
    id
) {

    notifications =
        notifications.filter(
            notification =>
                notification.id !== id
        );


    saveNotifications();

    renderNotifications();

}


/* ==================================================
   DELETE ALL NOTIFICATIONS
================================================== */

function deleteAllNotifications() {

    if (
        notifications.length === 0
    ) {

        alert(
            "اعلانی برای حذف وجود ندارد."
        );

        return;

    }


    const confirmed =
        confirm(
            "آیا می‌خواهید تمام اعلان‌ها حذف شوند؟"
        );


    if (!confirmed) {
        return;
    }


    notifications = [];

    saveNotifications();

    renderNotifications();

}


/* ==================================================
   NOTIFICATION BUTTONS
================================================== */

const markAllReadBtn =
    document.getElementById(
        "markAllNotificationsRead"
    );


const deleteAllNotificationsBtn =
    document.getElementById(
        "deleteAllNotifications"
    );


if (markAllReadBtn) {

    markAllReadBtn.addEventListener(
        "click",
        markAllNotificationsRead
    );

}


if (deleteAllNotificationsBtn) {

    deleteAllNotificationsBtn.addEventListener(
        "click",
        deleteAllNotifications
    );

}


/* ==================================================
   PAGE NAVIGATION
================================================== */

menuItems.forEach(
    item => {

        item.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const page =
                    this.dataset.page;


                menuItems.forEach(
                    menu => {

                        menu.classList.remove(
                            "active"
                        );

                    }
                );


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


                pageTitle.textContent =
                    pageNames[page] ||
                    "داشبورد";


                sidebar.classList.remove(
                    "open"
                );


                if (
                    page === "employees"
                ) {

                    renderEmployees();

                }


                if (
                    page === "attendance"
                ) {

                    initAttendance();

                }


                if (
                    page === "leave"
                ) {

                    initLeave();

                }


                if (
                    page === "reports"
                ) {

                    renderReports();

                }


                if (
                    page === "notifications"
                ) {

                    renderNotifications();

                }

            }

        );

    }
);


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


let editingEmployeeId =
    null;


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


    if (
        filtered.length === 0
    ) {

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


    filtered.forEach(
        employee => {

            const firstLetter =
                employee.name
                    ? employee.name.charAt(0)
                    : "م";


            const statusText =
                employee.status === "active"
                    ? "فعال"
                    : "غیرفعال";


            const row =
                document.createElement(
                    "tr"
                );


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
                        class="employee-status ${employee.status}"
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


        editingEmployeeId =
            null;

    }

}


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


    editingEmployeeId =
        null;

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
   EMPLOYEE MODAL BUTTONS
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


            addNotification(
                "system",
                wasEditing
                    ? "ویرایش اطلاعات کارمند"
                    : "ثبت کارمند جدید",
                wasEditing
                    ? `اطلاعات ${name} با موفقیت ویرایش شد.`
                    : `کارمند ${name} با موفقیت ثبت شد.`
            );


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


    addNotification(
        "system",
        "حذف کارمند",
        `کارمند ${employee.name} از سیستم حذف شد.`
    );

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
   ATTENDANCE
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
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    return `${hours} ساعت و ${mins} دقیقه`;

}


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

            }
        );


    attendanceTableBody.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

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
                        onchange="changeAttendanceStatus(
                            ${employee.id},
                            this.value
                        )"
                    >

                        <option
                            value="present"
                            ${
                                record.status ===
                                "present"
                                    ? "selected"
                                    : ""
                            }
                        >
                            حاضر
                        </option>


                        <option
                            value="late"
                            ${
                                record.status ===
                                "late"
                                    ? "selected"
                                    : ""
                            }
                        >
                            تأخیر
                        </option>


                        <option
                            value="absent"
                            ${
                                record.status ===
                                "absent"
                                    ? "selected"
                                    : ""
                            }
                        >
                            غایب
                        </option>


                        <option
                            value="leave"
                            ${
                                record.status ===
                                "leave"
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
                            onclick="setCurrentEntry(
                                ${employee.id}
                            )"
                        >
                            🟢
                        </button>


                        <button
                            class="action-btn"
                            title="ثبت خروج"
                            onclick="setCurrentExit(
                                ${employee.id}
                            )"
                        >
                            🔴
                        </button>


                        <button
                            class="action-btn"
                            title="پاک کردن"
                            onclick="clearAttendance(
                                ${employee.id}
                            )"
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


function changeAttendanceStatus(
    employeeId,
    status
) {

    const record =
        getAttendanceRecord(
            employeeId
        );


    const oldStatus =
        record.status;


    record.status =
        status;


    saveAttendance();

    renderAttendance();


    if (
        oldStatus !== status
    ) {

        const employee =
            employees.find(
                item =>
                    item.id ===
                    employeeId
            );


        if (employee) {

            addNotification(
                "attendance",
                "تغییر وضعیت حضور",
                `وضعیت حضور ${employee.name} به «${getAttendanceStatusText(status)}» تغییر کرد.`
            );

        }

    }

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


    const employee =
        employees.find(
            item =>
                item.id ===
                employeeId
        );


    if (employee) {

        addNotification(
            "attendance",
            "ثبت ورود",
            `ورود ${employee.name} در ساعت ${record.entry} ثبت شد.`
        );

    }

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


    const employee =
        employees.find(
            item =>
                item.id ===
                employeeId
        );


    if (employee) {

        addNotification(
            "attendance",
            "ثبت خروج",
            `خروج ${employee.name} در ساعت ${record.exit} ثبت شد.`
        );

    }

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


const leaveTableBody =
    document.getElementById(
        "leaveTableBody"
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

function getLeaveTypeText(
    type
) {

    const types = {

        annual: "مرخصی استحقاقی",
        sick: "مرخصی استعلاجی",
        unpaid: "مرخصی بدون حقوق",
        mission: "مأموریت"

    };


    return types[type] ||
        "-";

}


function getLeaveStatusText(
    status
) {

    const statuses = {

        pending: "در انتظار بررسی",
        approved: "تأیید شده",
        rejected: "رد شده"

    };


    return statuses[status] ||
        "-";

}


/* ==================================================
   LEAVE INIT
================================================== */

function initLeave() {

    populateLeaveEmployees();

    renderLeaveRequests();

    updateLeaveStats();

}


function populateLeaveEmployees() {

    const select =
        document.getElementById(
            "leaveEmployee"
        );


    if (!select) {
        return;
    }


    const currentValue =
        select.value;


    select.innerHTML = `

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


                select.appendChild(
                    option
                );

            }
        );


    if (currentValue) {

        select.value =
            currentValue;

    }

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
   SAVE LEAVE
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
                !end ||
                !days
            ) {

                alert(
                    "لطفاً تمام اطلاعات الزامی را وارد کنید."
                );

                return;

            }


            if (end < start) {

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


            const request = {

                id: Date.now(),

                employeeId,

                employeeName:
                    employee.name,

                employeeCode:
                    employee.code,

                type,

                start,

                end,

                days,

                description,

                status: "pending",

                createdAt:
                    new Date().toISOString()

            };


            leaveRequests.unshift(
                request
            );


            saveLeaveRequests();

            renderLeaveRequests();

            updateLeaveStats();

            closeLeaveRequestModal();


            addNotification(
                type === "mission"
                    ? "mission"
                    : "leave",
                type === "mission"
                    ? "درخواست مأموریت جدید"
                    : "درخواست مرخصی جدید",
                `${employee.name} یک درخواست ${getLeaveTypeText(type)} ثبت کرده است.`
            );


            alert(
                "درخواست با موفقیت ثبت شد."
            );

        }
    );

}


/* ==================================================
   LEAVE STATS
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
   RENDER LEAVE
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


    const dateFilter =
        leaveDateFilter
            ? leaveDateFilter.value
            : "";


    const filtered =
        leaveRequests.filter(
            request => {

                const matchesSearch =

                    request.employeeName
                        .toLowerCase()
                        .includes(search)

                    ||

                    request.employeeCode
                        .toLowerCase()
                        .includes(search);


                const matchesType =

                    typeFilter ===
                    "all"

                    ||

                    request.type ===
                    typeFilter;


                const matchesStatus =

                    statusFilter ===
                    "all"

                    ||

                    request.status ===
                    statusFilter;


                const matchesDate =

                    !dateFilter

                    ||

                    (
                        request.start <=
                        dateFilter &&

                        request.end >=
                        dateFilter
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


    if (
        filtered.length === 0
    ) {

        leaveTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-employees"
                >

                    هنوز درخواست مرخصی یا مأموریتی ثبت نشده است.

                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(
        request => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div class="employee-info">

                        <div class="employee-avatar">

                            ${escapeHTML(
                                request.employeeName
                                    .charAt(0)
                            )}

                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    request.employeeName
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    request.employeeCode
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
                    ${request.start}
                </td>


                <td>
                    ${request.end}
                </td>


                <td>
                    ${request.days} روز
                </td>


                <td>

                    ${escapeHTML(
                        request.description ||
                        "-"
                    )}

                </td>


                <td>

                    <span class="leave-status ${request.status}">

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
                                        onclick="approveLeave(${request.id})"
                                    >
                                        ✅
                                    </button>


                                    <button
                                        class="action-btn delete"
                                        title="رد"
                                        onclick="rejectLeave(${request.id})"
                                    >
                                        ❌
                                    </button>

                                  `
                                : ""
                        }


                        <button
                            class="action-btn delete"
                            title="حذف"
                            onclick="deleteLeave(${request.id})"
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
   APPROVE LEAVE
================================================== */

function approveLeave(id) {

    const request =
        leaveRequests.find(
            item =>
                item.id === id
        );


    if (!request) {
        return;
    }


    request.status =
        "approved";


    saveLeaveRequests();

    renderLeaveRequests();

    updateLeaveStats();


    addNotification(
        "approved",
        "درخواست تأیید شد",
        `درخواست ${getLeaveTypeText(request.type)} برای ${request.employeeName} تأیید شد.`
    );


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
            item =>
                item.id === id
        );


    if (!request) {
        return;
    }


    request.status =
        "rejected";


    saveLeaveRequests();

    renderLeaveRequests();

    updateLeaveStats();


    addNotification(
        "rejected",
        "درخواست رد شد",
        `درخواست ${getLeaveTypeText(request.type)} برای ${request.employeeName} رد شد.`
    );


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

    renderLeaveRequests();

    updateLeaveStats();

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


if (leaveDateFilter) {

    leaveDateFilter.addEventListener(
        "change",
        renderLeaveRequests
    );

}


/* ==================================================
   REPORTS
================================================== */

function renderReports() {

    const totalEmployees =
        employees.length;


    const activeEmployees =
        employees.filter(
            employee =>
                employee.status ===
                "active"
        ).length;


    const totalRequests =
        leaveRequests.length;


    const pendingRequests =
        leaveRequests.filter(
            request =>
                request.status ===
                "pending"
        ).length;


    const approvedRequests =
        leaveRequests.filter(
            request =>
                request.status ===
                "approved"
        ).length;


    const rejectedRequests =
        leaveRequests.filter(
            request =>
                request.status ===
                "rejected"
        ).length;


    setText(
        "reportTotalEmployees",
        totalEmployees
    );


    setText(
        "reportActiveEmployees",
        activeEmployees
    );


    setText(
        "reportTotalLeave",
        totalRequests
    );


    setText(
        "reportPendingLeave",
        pendingRequests
    );


    setText(
        "reportApprovedLeave",
        approvedRequests
    );


    setText(
        "reportRejectedLeave",
        rejectedRequests
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

renderReports();

renderNotifications();

updateNotificationBadge();


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


/* ==================================================
   GLOBAL EXPORT
   برای onclick داخل HTML
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

window.markAllNotificationsRead =
    markAllNotificationsRead;

window.deleteAllNotifications =
    deleteAllNotifications;


/* ==================================================
   END
================================================== */

console.log(
    "MIRZA KHAN HR - APP.JS VERSION 1.6"
);

console.log(
    "سیستم اعلان‌ها فعال شد."
);
