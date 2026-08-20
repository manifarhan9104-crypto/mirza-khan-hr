/* =========================================================
   MIRZA KHAN HR
   APP.JS - VERSION 2.0
   سامانه جامع منابع انسانی و حضور و غیاب
   کارکنان + حضور و غیاب + مرخصی + مأموریت
   گزارش‌ها + اعلان‌ها + داشبورد
   جستجو + فیلتر + LocalStorage
========================================================= */

"use strict";

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       GLOBAL ELEMENTS
    ===================================================== */

    const menuItems =
        document.querySelectorAll(".menu-item");

    const pages =
        document.querySelectorAll(".page");

    const pageTitle =
        document.getElementById("pageTitle");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const sidebar =
        document.getElementById("sidebar");

    const todayDate =
        document.getElementById("todayDate");


    /* =====================================================
       PAGE NAMES
    ===================================================== */

    const pageNames = {
        dashboard: "داشبورد",
        employees: "کارکنان",
        attendance: "حضور و غیاب",
        leave: "مرخصی و مأموریت",
        reports: "گزارش‌ها",
        notifications: "اعلان‌ها",
        settings: "تنظیمات"
    };


    /* =====================================================
       STORAGE HELPERS
    ===================================================== */

    function loadJSON(key, fallback) {

        try {

            const data =
                localStorage.getItem(key);

            if (!data) {
                return fallback;
            }

            const parsed =
                JSON.parse(data);

            return parsed ?? fallback;

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


    /* =====================================================
       DEFAULT EMPLOYEES
    ===================================================== */

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


    /* =====================================================
       GLOBAL DATA
    ===================================================== */

    let employees =
        loadJSON(
            "mirzaKhanEmployees",
            defaultEmployees
        );

    let attendanceData =
        loadJSON(
            "mirzaKhanAttendance",
            {}
        );

    let leaveRequests =
        loadJSON(
            "mirzaKhanLeaveRequests",
            []
        );

    let notifications =
        loadJSON(
            "mirzaKhanNotifications",
            []
        );


    /* =====================================================
       HELPERS
    ===================================================== */

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


    function getCurrentTime() {

        const now =
            new Date();

        return (
            String(
                now.getHours()
            ).padStart(2, "0") +
            ":" +
            String(
                now.getMinutes()
            ).padStart(2, "0")
        );
    }


    function generateId() {

        return (
            Date.now() +
            Math.floor(
                Math.random() * 1000
            )
        );
    }


    function setTodayDate() {

        if (!todayDate) {
            return;
        }

        try {

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

        } catch {

            todayDate.textContent =
                new Date().toLocaleDateString(
                    "fa-IR"
                );
        }
    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    function navigateToPage(page) {

        menuItems.forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.page === page
            );

        });


        pages.forEach(element => {

            element.classList.remove(
                "active-page"
            );

        });


        const selected =
            document.getElementById(
                `${page}Page`
            );


        if (selected) {

            selected.classList.add(
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


        switch (page) {

            case "dashboard":
                renderDashboard();
                break;

            case "employees":
                renderEmployees();
                break;

            case "attendance":
                initAttendance();
                break;

            case "leave":
                initLeave();
                break;

            case "reports":
                renderReports();
                break;

            case "notifications":
                renderNotifications();
                break;
        }
    }


    menuItems.forEach(item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();

                navigateToPage(
                    item.dataset.page
                );
            }
        );
    });


    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            () => {

                if (sidebar) {

                    sidebar.classList.toggle(
                        "open"
                    );
                }
            }
        );
    }


    /* =====================================================
       EMPLOYEES ELEMENTS
    ===================================================== */

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

    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    let editingEmployeeId = null;


    /* =====================================================
       EMPLOYEES STORAGE
    ===================================================== */

    function saveEmployees() {

        saveJSON(
            "mirzaKhanEmployees",
            employees
        );
    }


    /* =====================================================
       EMPLOYEE FILTER
    ===================================================== */

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
                    !search ||
                    name.includes(search) ||
                    code.includes(search) ||
                    phone.includes(search);


                const matchesDepartment =
                    department === "all" ||
                    !department ||
                    employee.department ===
                        department;


                const matchesStatus =
                    status === "all" ||
                    !status ||
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


    /* =====================================================
       SUMMARY
    ===================================================== */

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
                employees
                    .map(
                        employee =>
                            employee.department
                    )
                    .filter(Boolean)
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


    /* =====================================================
       RENDER EMPLOYEES
    ===================================================== */

    function renderEmployees() {

        if (!employeesTableBody) {
            return;
        }


        const filtered =
            getFilteredEmployees();


        employeesTableBody.innerHTML =
            "";


        if (filtered.length === 0) {

            employeesTableBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        class="empty-employees">
                        کارمندی با این مشخصات پیدا نشد.
                    </td>
                </tr>
            `;

            updateSummary();

            return;
        }


        filtered.forEach(employee => {

            const row =
                document.createElement(
                    "tr"
                );


            const firstLetter =
                employee.name
                    ? employee.name.charAt(0)
                    : "م";


            const statusText =
                employee.status === "active"
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
                        employee.department ||
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        employee.position ||
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        employee.phone ||
                        "-"
                    )}
                </td>


                <td>

                    <span class="employee-status ${escapeHTML(
                        employee.status
                    )}">
                        ${statusText}
                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="action-btn"
                            title="مشاهده پرونده"
                            onclick="viewEmployee(${employee.id})">
                            👁️
                        </button>


                        <button
                            class="action-btn"
                            title="ویرایش"
                            onclick="editEmployee(${employee.id})">
                            ✏️
                        </button>


                        <button
                            class="action-btn delete"
                            title="حذف"
                            onclick="deleteEmployee(${employee.id})">
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


    /* =====================================================
       EMPLOYEE MODAL
    ===================================================== */

    function setInputValue(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value =
                value ?? "";
        }
    }


    function openEmployeeModal(
        employee = null
    ) {

        if (!employeeModal) {
            return;
        }


        employeeModal.classList.add(
            "show"
        );


        const profileView =
            document.getElementById(
                "profileView"
            );


        if (profileView) {

            profileView.classList.remove(
                "show"
            );
        }


        if (employeeForm) {

            employeeForm.style.display =
                "grid";
        }


        if (employee) {

            if (modalTitle) {

                modalTitle.textContent =
                    "ویرایش کارمند";
            }


            setInputValue(
                "fullName",
                employee.name
            );

            setInputValue(
                "personnelCode",
                employee.code
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


            editingEmployeeId =
                employee.id;

        } else {

            if (employeeForm) {

                employeeForm.reset();
            }


            if (modalTitle) {

                modalTitle.textContent =
                    "افزودن کارمند";
            }


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


        if (employeeForm) {

            employeeForm.reset();

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


        if (modalTitle) {

            modalTitle.textContent =
                "افزودن کارمند";
        }


        editingEmployeeId =
            null;
    }


    /* =====================================================
       ADD EMPLOYEE
    ===================================================== */

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

                navigateToPage(
                    "employees"
                );

                setTimeout(
                    () => {
                        openEmployeeModal();
                    },
                    50
                );
            }
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


    /* =====================================================
       SAVE EMPLOYEE
    ===================================================== */

    if (employeeForm) {

        employeeForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "fullName"
                    )?.value.trim();


                const code =
                    document.getElementById(
                        "personnelCode"
                    )?.value.trim();


                const phone =
                    document.getElementById(
                        "phone"
                    )?.value.trim();


                const department =
                    document.getElementById(
                        "department"
                    )?.value;


                const position =
                    document.getElementById(
                        "position"
                    )?.value.trim();


                const status =
                    document.getElementById(
                        "status"
                    )?.value ||
                    "active";


                const address =
                    document.getElementById(
                        "address"
                    )?.value.trim();


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


                const employeeData = {

                    name,
                    code,
                    phone,
                    department,
                    position,
                    status,
                    address

                };


                const editing =
                    editingEmployeeId !== null;


                if (editing) {

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

                        id: generateId(),

                        ...employeeData

                    });
                }


                saveEmployees();

                renderEmployees();

                updateSummary();

                renderDashboard();


                closeEmployeeModal();


                addNotification({

                    type: "employee",

                    title:
                        editing
                            ? "ویرایش کارمند"
                            : "کارمند جدید",

                    message:
                        editing
                            ? `اطلاعات ${name} ویرایش شد.`
                            : `کارمند ${name} ثبت شد.`,

                    icon:
                        editing
                            ? "✏️"
                            : "👤"
                });


                alert(
                    editing
                        ? "اطلاعات کارمند با موفقیت ویرایش شد."
                        : "کارمند جدید با موفقیت ثبت شد."
                );

            }
        );
    }


    /* =====================================================
       EDIT EMPLOYEE
    ===================================================== */

    function editEmployee(id) {

        const employee =
            employees.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (employee) {

            openEmployeeModal(
                employee
            );
        }
    }


    /* =====================================================
       DELETE EMPLOYEE
    ===================================================== */

    function deleteEmployee(id) {

        const employee =
            employees.find(
                item =>
                    Number(item.id) ===
                    Number(id)
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
                item =>
                    Number(item.id) !==
                    Number(id)
            );


        saveEmployees();

        renderEmployees();

        updateSummary();

        renderDashboard();


        addNotification({

            type: "employee",

            title:
                "حذف کارمند",

            message:
                `کارمند ${employee.name} حذف شد.`,

            icon:
                "🗑️"
        });
    }


    /* =====================================================
       VIEW EMPLOYEE
    ===================================================== */

    function viewEmployee(id) {

        const employee =
            employees.find(
                item =>
                    Number(item.id) ===
                    Number(id)
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


        if (modalTitle) {

            modalTitle.textContent =
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
            employee.code || "-"
        );


        setText(
            "profileDepartment",
            employee.department || "-"
        );


        setText(
            "profilePhone",
            employee.phone || "-"
        );


        setText(
            "profileStatus",
            employee.status ===
                "active"
                ? "فعال"
                : "غیرفعال"
        );


        setText(
            "profileAddress",
            employee.address || "-"
        );
    }


    /* =====================================================
       EMPLOYEE FILTER EVENTS
    ===================================================== */

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


    /* =====================================================
       ATTENDANCE
    ===================================================== */

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


    function saveAttendance() {

        saveJSON(
            "mirzaKhanAttendance",
            attendanceData
        );
    }


    function getSelectedAttendanceDate() {

        if (
            attendanceDate &&
            attendanceDate.value
        ) {

            return attendanceDate.value;
        }


        return getTodayISO();
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


        let startTotal =
            startParts[0] * 60 +
            startParts[1];


        let endTotal =
            endParts[0] * 60 +
            endParts[1];


        if (endTotal < startTotal) {

            endTotal += 1440;
        }


        return endTotal - startTotal;
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


        if (hours === 0) {

            return `${mins} دقیقه`;
        }


        if (mins === 0) {

            return `${hours} ساعت`;
        }


        return `${hours} ساعت و ${mins} دقیقه`;
    }


    function updateAttendanceStats(
        records
    ) {

        let present = 0;
        let late = 0;
        let absent = 0;
        let leave = 0;


        records.forEach(record => {

            switch (record.status) {

                case "present":
                    present++;
                    break;

                case "late":
                    late++;
                    break;

                case "leave":
                    leave++;
                    break;

                default:
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


        const status =
            attendanceStatusFilter
                ? attendanceStatusFilter.value
                : "all";


        const activeEmployees =
            employees.filter(
                employee =>
                    employee.status ===
                    "active"
            );


        const records =
            activeEmployees.map(
                employee => ({

                    employee,

                    record:
                        getAttendanceRecord(
                            employee.id,
                            date
                        )

                })
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


                    const name =
                        String(
                            employee.name || ""
                        ).toLowerCase();


                    const code =
                        String(
                            employee.code || ""
                        ).toLowerCase();


                    const matchesSearch =
                        !search ||
                        name.includes(search) ||
                        code.includes(search);


                    const matchesStatus =
                        status === "all" ||
                        record.status ===
                            status;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );


        attendanceTableBody.innerHTML =
            "";


        if (filtered.length === 0) {

            attendanceTableBody.innerHTML = `
                <tr>
                    <td colspan="8"
                        class="empty-employees">
                        اطلاعاتی برای نمایش وجود ندارد.
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
                                    employee.name
                                        ? employee.name.charAt(0)
                                        : "م"
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
                            onchange="changeAttendanceStatus(${employee.id}, this.value)">

                            <option value="present"
                                ${
                                    record.status ===
                                    "present"
                                        ? "selected"
                                        : ""
                                }>
                                حاضر
                            </option>

                            <option value="late"
                                ${
                                    record.status ===
                                    "late"
                                        ? "selected"
                                        : ""
                                }>
                                تأخیر
                            </option>

                            <option value="absent"
                                ${
                                    record.status ===
                                    "absent"
                                        ? "selected"
                                        : ""
                                }>
                                غایب
                            </option>

                            <option value="leave"
                                ${
                                    record.status ===
                                    "leave"
                                        ? "selected"
                                        : ""
                                }>
                                مرخصی
                            </option>

                        </select>

                    </td>


                    <td>

                        <input
                            type="time"
                            value="${escapeHTML(
                                record.entry || ""
                            )}"
                            onchange="changeAttendanceTime(${employee.id}, 'entry', this.value)">

                    </td>


                    <td>

                        <input
                            type="time"
                            value="${escapeHTML(
                                record.exit || ""
                            )}"
                            onchange="changeAttendanceTime(${employee.id}, 'exit', this.value)">

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
                                onclick="setCurrentEntry(${employee.id})">
                                🟢
                            </button>


                            <button
                                class="action-btn"
                                title="ثبت خروج"
                                onclick="setCurrentExit(${employee.id})">
                                🔴
                            </button>


                            <button
                                class="action-btn"
                                title="پاک کردن"
                                onclick="clearAttendance(${employee.id})">
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

        renderDashboard();
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
            value;


        saveAttendance();

        renderAttendance();

        renderDashboard();
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

        renderDashboard();


        addNotification({

            type:
                "attendance",

            title:
                "ثبت ورود",

            message:
                "ورود کارمند ثبت شد.",

            icon:
                "🟢"
        });
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

        renderDashboard();


        addNotification({

            type:
                "attendance",

            title:
                "ثبت خروج",

            message:
                "خروج کارمند ثبت شد.",

            icon:
                "🔴"
        });
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


        if (
            attendanceData[date] &&
            attendanceData[date][employeeId]
        ) {

            delete attendanceData[
                date
            ][employeeId];


            saveAttendance();

            renderAttendance();

            renderDashboard();
        }
    }


    if (attendanceDate) {

        attendanceDate.addEventListener(
            "change",
            renderAttendance
        );
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


    /* =====================================================
       LEAVE / MISSION
    ===================================================== */

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

    const leaveEmployee =
        document.getElementById(
            "leaveEmployee"
        );

    const leaveType =
        document.getElementById(
            "leaveType"
        );

    const leaveStart =
        document.getElementById(
            "leaveStart"
        );

    const leaveEnd =
        document.getElementById(
            "leaveEnd"
        );

    const leaveDays =
        document.getElementById(
            "leaveDays"
        );

    const leaveDescription =
        document.getElementById(
            "leaveDescription"
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

    const closeLeaveModal =
        document.getElementById(
            "closeLeaveModal"
        );

    const cancelLeaveModal =
        document.getElementById(
            "cancelLeaveModal"
        );


    function saveLeaveRequests() {

        saveJSON(
            "mirzaKhanLeaveRequests",
            leaveRequests
        );
    }


    function getLeaveTypeText(type) {

        const types = {

            annual:
                "مرخصی استحقاقی",

            sick:
                "مرخصی استعلاجی",

            unpaid:
                "مرخصی بدون حقوق",

            mission:
                "مأموریت"
        };


        return (
            types[type] ||
            "-"
        );
    }


    function getLeaveStatusText(
        status
    ) {

        const statuses = {

            pending:
                "در انتظار بررسی",

            approved:
                "تأیید شده",

            rejected:
                "رد شده"
        };


        return (
            statuses[status] ||
            "-"
        );
    }


    function calculateLeaveDays(
        start,
        end
    ) {

        if (
            !start ||
            !end
        ) {

            return 0;
        }


        const startDate =
            new Date(
                `${start}T00:00:00`
            );


        const endDate =
            new Date(
                `${end}T00:00:00`
            );


        const difference =
            endDate -
            startDate;


        if (difference < 0) {
            return 0;
        }


        return (
            Math.floor(
                difference /
                86400000
            ) + 1
        );
    }


    function fillLeaveEmployees() {

        if (!leaveEmployee) {
            return;
        }


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
    }


    function updateLeaveDays() {

        if (
            !leaveStart ||
            !leaveEnd ||
            !leaveDays
        ) {

            return;
        }


        const days =
            calculateLeaveDays(
                leaveStart.value,
                leaveEnd.value
            );


        leaveDays.value =
            days > 0
                ? days
                : "";
    }


    function updateLeaveStats() {

        setText(
            "totalLeave",
            leaveRequests.length
        );


        setText(
            "pendingLeave",
            leaveRequests.filter(
                request =>
                    request.status ===
                    "pending"
            ).length
        );


        setText(
            "approvedLeave",
            leaveRequests.filter(
                request =>
                    request.status ===
                    "approved"
            ).length
        );


        setText(
            "rejectedLeave",
            leaveRequests.filter(
                request =>
                    request.status ===
                    "rejected"
            ).length
        );
    }


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

                    const employee =
                        employees.find(
                            item =>
                                Number(
                                    item.id
                                ) ===
                                Number(
                                    request.employeeId
                                )
                        );


                    if (!employee) {
                        return false;
                    }


                    const employeeName =
                        String(
                            employee.name || ""
                        ).toLowerCase();


                    const employeeCode =
                        String(
                            employee.code || ""
                        ).toLowerCase();


                    const matchesSearch =
                        !search ||
                        employeeName.includes(
                            search
                        ) ||
                        employeeCode.includes(
                            search
                        );


                    const matchesType =
                        typeFilter ===
                            "all" ||
                        request.type ===
                            typeFilter;


                    const matchesStatus =
                        statusFilter ===
                            "all" ||
                        request.status ===
                            statusFilter;


                    const matchesDate =
                        !dateFilter ||
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


        updateLeaveStats();


        leaveTableBody.innerHTML =
            "";


        if (filtered.length === 0) {

            leaveTableBody.innerHTML = `
                <tr>
                    <td colspan="8"
                        class="empty-employees">
                        هنوز درخواست مرخصی یا مأموریتی ثبت نشده است.
                    </td>
                </tr>
            `;

            return;
        }


        filtered.forEach(
            request => {

                const employee =
                    employees.find(
                        item =>
                            Number(
                                item.id
                            ) ===
                            Number(
                                request.employeeId
                            )
                    );


                if (!employee) {
                    return;
                }


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <div class="employee-info">

                            <div class="employee-avatar">
                                ${escapeHTML(
                                    employee.name
                                        ? employee.name.charAt(0)
                                        : "م"
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
                            getLeaveTypeText(
                                request.type
                            )
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            request.start
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            request.end
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            request.days
                        )} روز
                    </td>


                    <td>
                        ${escapeHTML(
                            request.description ||
                            "-"
                        )}
                    </td>


                    <td>

                        <span class="employee-status ${escapeHTML(
                            request.status
                        )}">

                            ${escapeHTML(
                                getLeaveStatusText(
                                    request.status
                                )
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
                                            onclick="approveLeave(${request.id})">
                                            ✅
                                        </button>


                                        <button
                                            class="action-btn delete"
                                            title="رد"
                                            onclick="rejectLeave(${request.id})">
                                            ❌
                                        </button>

                                    `
                                    : ""
                            }


                            <button
                                class="action-btn delete"
                                title="حذف"
                                onclick="deleteLeave(${request.id})">
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


    function initLeave() {

        fillLeaveEmployees();

        renderLeave();
    }


    function openLeaveRequestModal() {

        if (!leaveModal) {
            return;
        }


        fillLeaveEmployees();


        leaveModal.classList.add(
            "show"
        );


        if (leaveForm) {
            leaveForm.reset();
        }


        if (leaveStart) {

            leaveStart.value =
                getTodayISO();
        }


        if (leaveEnd) {

            leaveEnd.value =
                getTodayISO();
        }


        if (leaveDays) {

            leaveDays.value =
                "1";
        }
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


    if (leaveStart) {

        leaveStart.addEventListener(
            "change",
            updateLeaveDays
        );
    }


    if (leaveEnd) {

        leaveEnd.addEventListener(
            "change",
            updateLeaveDays
        );
    }


    /* =====================================================
       SAVE LEAVE
    ===================================================== */

    if (leaveForm) {

        leaveForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const employeeId =
                    Number(
                        leaveEmployee?.value
                    );


                const type =
                    leaveType?.value;


                const start =
                    leaveStart?.value;


                const end =
                    leaveEnd?.value;


                const days =
                    Number(
                        leaveDays?.value
                    );


                const description =
                    leaveDescription?.value
                        .trim() ||
                    "";


                if (
                    !employeeId ||
                    !type ||
                    !start ||
                    !end ||
                    !days
                ) {

                    alert(
                        "لطفاً اطلاعات درخواست را کامل کنید."
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
                            Number(
                                item.id
                            ) ===
                            employeeId
                    );


                if (!employee) {

                    alert(
                        "کارمند انتخاب‌شده پیدا نشد."
                    );

                    return;
                }


                leaveRequests.unshift({

                    id:
                        generateId(),

                    employeeId,

                    type,

                    start,

                    end,

                    days,

                    description,

                    status:
                        "pending",

                    createdAt:
                        new Date().toISOString()

                });


                saveLeaveRequests();

                renderLeave();

                renderDashboard();

                closeLeaveRequestModal();


                addNotification({

                    type:
                        "leave",

                    title:
                        "درخواست جدید",

                    message:
                        `${employee.name} یک درخواست ${getLeaveTypeText(type)} ثبت کرد.`,

                    icon:
                        type ===
                        "mission"
                            ? "🚗"
                            : "🏖️"
                });


                alert(
                    "درخواست با موفقیت ثبت شد."
                );

            }
        );
    }


    /* =====================================================
       APPROVE LEAVE
    ===================================================== */

    function approveLeave(id) {

        const request =
            leaveRequests.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!request) {
            return;
        }


        request.status =
            "approved";


        saveLeaveRequests();

        renderLeave();

        renderDashboard();


        addNotification({

            type:
                "leave",

            title:
                "درخواست تأیید شد",

            message:
                `${getLeaveTypeText(
                    request.type
                )} تأیید شد.`,

            icon:
                "✅"
        });
    }


    /* =====================================================
       REJECT LEAVE
    ===================================================== */

    function rejectLeave(id) {

        const request =
            leaveRequests.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!request) {
            return;
        }


        request.status =
            "rejected";


        saveLeaveRequests();

        renderLeave();

        renderDashboard();


        addNotification({

            type:
                "leave",

            title:
                "درخواست رد شد",

            message:
                `${getLeaveTypeText(
                    request.type
                )} رد شد.`,

            icon:
                "❌"
        });
    }


    /* =====================================================
       DELETE LEAVE
    ===================================================== */

    function deleteLeave(id) {

        const request =
            leaveRequests.find(
                item =>
                    Number(item.id) ===
                    Number(id)
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
                    Number(item.id) !==
                    Number(id)
            );


        saveLeaveRequests();

        renderLeave();

        renderDashboard();
    }


    if (leaveSearch) {

        leaveSearch.addEventListener(
            "input",
            renderLeave
        );
    }


    if (leaveTypeFilter) {

        leaveTypeFilter.addEventListener(
            "change",
            renderLeave
        );
    }


    if (leaveStatusFilter) {

        leaveStatusFilter.addEventListener(
            "change",
            renderLeave
        );
    }


    if (leaveDateFilter) {

        leaveDateFilter.addEventListener(
            "change",
            renderLeave
        );
    }


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    function saveNotifications() {

        saveJSON(
            "mirzaKhanNotifications",
            notifications
        );
    }


    function addNotification(
        data = {}
    ) {

        const notification = {

            id:
                generateId(),

            type:
                data.type ||
                "system",

            title:
                data.title ||
                "اعلان سیستم",

            message:
                data.message ||
                "",

            icon:
                data.icon ||
                "🔔",

            read:
                false,

            createdAt:
                new Date().toISOString()
        };


        notifications.unshift(
            notification
        );


        if (
            notifications.length >
            100
        ) {

            notifications =
                notifications.slice(
                    0,
                    100
                );
        }


        saveNotifications();

        updateNotificationBadge();
    }


    function getNotificationTime(
        date
    ) {

        if (!date) {
            return "";
        }


        const created =
            new Date(date);


        if (
            Number.isNaN(
                created.getTime()
            )
        ) {

            return "";
        }


        const now =
            new Date();


        const seconds =
            Math.floor(
                (
                    now -
                    created
                ) / 1000
            );


        if (seconds < 60) {
            return "همین الان";
        }


        if (seconds < 3600) {

            return `${Math.floor(
                seconds / 60
            )} دقیقه پیش`;
        }


        if (seconds < 86400) {

            return `${Math.floor(
                seconds / 3600
            )} ساعت پیش`;
        }


        return created.toLocaleDateString(
            "fa-IR"
        );
    }


    function updateNotificationBadge() {

        const unread =
            notifications.filter(
                item =>
                    !item.read
            ).length;


        const badge =
            document.getElementById(
                "notificationBadge"
            );


        if (badge) {

            badge.textContent =
                unread;


            badge.style.display =
                unread > 0
                    ? "inline-flex"
                    : "none";
        }


        const menu =
            document.querySelector(
                '[data-page="notifications"]'
            );


        if (!menu) {
            return;
        }


        let menuBadge =
            menu.querySelector(
                ".notification-menu-badge"
            );


        if (unread > 0) {

            if (!menuBadge) {

                menuBadge =
                    document.createElement(
                        "span"
                    );


                menuBadge.className =
                    "notification-menu-badge";


                menu.appendChild(
                    menuBadge
                );
            }


            menuBadge.textContent =
                unread;

        } else {

            if (menuBadge) {

                menuBadge.remove();
            }
        }
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


        const unread =
            notifications.filter(
                item =>
                    !item.read
            ).length;


        setText(
            "notificationCount",
            unread
        );


        if (!container) {

            updateNotificationBadge();

            return;
        }


        container.innerHTML =
            "";


        if (
            notifications.length ===
            0
        ) {

            if (empty) {

                empty.style.display =
                    "block";
            }


            updateNotificationBadge();

            return;
        }


        if (empty) {

            empty.style.display =
                "none";
        }


        notifications.forEach(
            notification => {

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
                        ${escapeHTML(
                            notification.icon
                        )}
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
                            ${getNotificationTime(
                                notification.createdAt
                            )}
                        </small>

                    </div>


                    <div class="notification-actions">

                        ${
                            !notification.read
                                ? `

                                    <button
                                        class="action-btn"
                                        onclick="markNotificationRead(${notification.id})">
                                        ✓
                                    </button>

                                `
                                : ""
                        }


                        <button
                            class="action-btn delete"
                            onclick="deleteNotification(${notification.id})">
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


    function markNotificationRead(id) {

        const notification =
            notifications.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!notification) {
            return;
        }


        notification.read =
            true;


        saveNotifications();

        renderNotifications();

        renderDashboard();
    }


    function markAllNotificationsRead() {

        notifications.forEach(
            notification => {

                notification.read =
                    true;
            }
        );


        saveNotifications();

        renderNotifications();

        renderDashboard();
    }


    function deleteNotification(id) {

        notifications =
            notifications.filter(
                item =>
                    Number(item.id) !==
                    Number(id)
            );


        saveNotifications();

        renderNotifications();

        renderDashboard();
    }


    function clearAllNotifications() {

        if (
            notifications.length ===
            0
        ) {

            return;
        }


        if (
            !confirm(
                "همه اعلان‌ها حذف شوند؟"
            )
        ) {

            return;
        }


        notifications = [];


        saveNotifications();

        renderNotifications();

        renderDashboard();
    }


    const markAllNotificationsBtn =
        document.getElementById(
            "markAllNotifications"
        );


    const clearAllNotificationsBtn =
        document.getElementById(
            "clearAllNotifications"
        );


    if (markAllNotificationsBtn) {

        markAllNotificationsBtn.addEventListener(
            "click",
            markAllNotificationsRead
        );
    }


    if (clearAllNotificationsBtn) {

        clearAllNotificationsBtn.addEventListener(
            "click",
            clearAllNotifications
        );
    }


    /* =====================================================
       REPORTS
    ===================================================== */

    function getTodayAttendanceStats() {

        const date =
            getTodayISO();


        let present = 0;
        let late = 0;
        let absent = 0;
        let leave = 0;


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


                    switch (
                        record.status
                    ) {

                        case "present":
                            present++;
                            break;

                        case "late":
                            late++;
                            break;

                        case "leave":
                            leave++;
                            break;

                        default:
                            absent++;
                    }
                }
            );


        return {

            present,

            late,

            absent,

            leave
        };
    }


    function renderReports() {

        const attendance =
            getTodayAttendanceStats();


        const total =
            employees.length;


        const active =
            employees.filter(
                employee =>
                    employee.status ===
                    "active"
            ).length;


        const totalLeave =
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
            "reportTotalEmployees",
            total
        );

        setText(
            "reportActiveEmployees",
            active
        );

        setText(
            "reportTotalLeaves",
            totalLeave
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

        setText(
            "reportPresent",
            attendance.present
        );

        setText(
            "reportLate",
            attendance.late
        );

        setText(
            "reportAbsent",
            attendance.absent
        );

        setText(
            "reportLeave",
            attendance.leave
        );
    }


    /* =====================================================
       DASHBOARD
    ===================================================== */

    function renderDashboard() {

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
                employees
                    .map(
                        employee =>
                            employee.department
                    )
                    .filter(Boolean)
            ).size;


        const attendance =
            getTodayAttendanceStats();


        const attendanceRate =
            active > 0
                ? Math.round(
                    (
                        (
                            attendance.present +
                            attendance.late
                        ) /
                        active
                    ) * 100
                )
                : 0;


        const pendingLeave =
            leaveRequests.filter(
                request =>
                    request.status ===
                    "pending"
            ).length;


        const approvedLeave =
            leaveRequests.filter(
                request =>
                    request.status ===
                    "approved"
            ).length;


        const unread =
            notifications.filter(
                notification =>
                    !notification.read
            ).length;


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

        setText(
            "dashboardPresent",
            attendance.present
        );

        setText(
            "dashboardLate",
            attendance.late
        );

        setText(
            "dashboardAbsent",
            attendance.absent
        );

        setText(
            "dashboardLeave",
            attendance.leave
        );

        setText(
            "dashboardAttendanceRate",
            `${attendanceRate}%`
        );

        setText(
            "dashboardPendingLeave",
            pendingLeave
        );

        setText(
            "dashboardApprovedLeave",
            approvedLeave
        );

        setText(
            "dashboardNotifications",
            unread
        );


        document
            .querySelectorAll(
                "[data-dashboard-progress]"
            )
            .forEach(
                bar => {

                    const type =
                        bar.dataset
                            .dashboardProgress;


                    if (
                        type ===
                        "attendance"
                    ) {

                        bar.style.width =
                            `${attendanceRate}%`;
                    }


                    if (
                        type ===
                        "active"
                    ) {

                        const rate =
                            total > 0
                                ? Math.round(
                                    (
                                        active /
                                        total
                                    ) * 100
                                )
                                : 0;


                        bar.style.width =
                            `${rate}%`;
                    }
                }
            );


        renderDashboardRecentActivity();
    }


    function renderDashboardRecentActivity() {

        const container =
            document.getElementById(
                "dashboardRecentActivity"
            );


        if (!container) {
            return;
        }


        const activities =
            notifications.slice(0, 5);


        container.innerHTML =
            "";


        if (
            activities.length ===
            0
        ) {

            container.innerHTML = `
                <div class="empty-employees">
                    هنوز فعالیتی ثبت نشده است.
                </div>
            `;

            return;
        }


        activities.forEach(
            activity => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "dashboard-activity-item";


                item.innerHTML = `

                    <div class="notification-icon">
                        ${escapeHTML(
                            activity.icon
                        )}
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
                            ${getNotificationTime(
                                activity.createdAt
                            )}
                        </small>

                    </div>
                `;


                container.appendChild(
                    item
                );
            }
        );
    }


    /* =====================================================
       EXPORT REPORT
    ===================================================== */

    function exportHRReport() {

        const attendance =
            getTodayAttendanceStats();


        const report = {

            system:
                "سامانه جامع منابع انسانی میرزا کوچک خان",

            version:
                "2.0",

            generatedAt:
                new Date().toLocaleString(
                    "fa-IR"
                ),


            employees: {

                total:
                    employees.length,

                active:
                    employees.filter(
                        employee =>
                            employee.status ===
                            "active"
                    ).length,

                inactive:
                    employees.filter(
                        employee =>
                            employee.status ===
                            "inactive"
                    ).length
            },


            todayAttendance: {

                present:
                    attendance.present,

                late:
                    attendance.late,

                absent:
                    attendance.absent,

                leave:
                    attendance.leave
            },


            leaveRequests: {

                total:
                    leaveRequests.length,

                pending:
                    leaveRequests.filter(
                        request =>
                            request.status ===
                            "pending"
                    ).length,

                approved:
                    leaveRequests.filter(
                        request =>
                            request.status ===
                            "approved"
                    ).length,

                rejected:
                    leaveRequests.filter(
                        request =>
                            request.status ===
                            "rejected"
                    ).length
            }
        };


        const blob =
            new Blob(
                [
                    JSON.stringify(
                        report,
                        null,
                        4
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


        link.href =
            url;


        link.download =
            `mirza-khan-hr-report-${getTodayISO()}.json`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        addNotification({

            type:
                "report",

            title:
                "گزارش ایجاد شد",

            message:
                "گزارش سامانه با موفقیت خروجی گرفته شد.",

            icon:
                "📊"
        });
    }


    [
        "exportReportBtn",
        "exportReportsBtn",
        "downloadReportBtn"
    ].forEach(id => {

        const button =
            document.getElementById(
                id
            );


        if (button) {

            button.addEventListener(
                "click",
                exportHRReport
            );
        }
    });


    /* =====================================================
       GLOBAL FUNCTIONS
       مهم:
       چون در HTML از onclick استفاده شده،
       توابع باید روی window باشند.
    ===================================================== */

    window.navigateToPage =
        navigateToPage;

    window.openEmployeeModal =
        openEmployeeModal;

    window.closeEmployeeModal =
        closeEmployeeModal;

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

    window.exportHRReport =
        exportHRReport;


    /* =====================================================
       CLOCK
    ===================================================== */

    function updateClock() {

        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                "fa-IR",
                {
                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit"
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


    /* =====================================================
       AUTO REFRESH
    ===================================================== */

    setInterval(
        () => {

            setTodayDate();

            renderDashboard();

            updateSummary();

            updateNotificationBadge();

        },
        30000
    );


    /* =====================================================
       STORAGE SYNC
    ===================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                "mirzaKhanEmployees"
            ) {

                employees =
                    loadJSON(
                        "mirzaKhanEmployees",
                        defaultEmployees
                    );


                renderEmployees();

                updateSummary();

                fillLeaveEmployees();

                renderDashboard();
            }


            if (
                event.key ===
                "mirzaKhanAttendance"
            ) {

                attendanceData =
                    loadJSON(
                        "mirzaKhanAttendance",
                        {}
                    );


                renderAttendance();

                renderDashboard();
            }


            if (
                event.key ===
                "mirzaKhanLeaveRequests"
            ) {

                leaveRequests =
                    loadJSON(
                        "mirzaKhanLeaveRequests",
                        []
                    );


                renderLeave();

                renderReports();

                renderDashboard();
            }


            if (
                event.key ===
                "mirzaKhanNotifications"
            ) {

                notifications =
                    loadJSON(
                        "mirzaKhanNotifications",
                        []
                    );


                renderNotifications();

                renderDashboard();
            }

        }
    );


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;
            }


            if (
                employeeModal &&
                employeeModal.classList.contains(
                    "show"
                )
            ) {

                closeEmployeeModal();
            }


            if (
                leaveModal &&
                leaveModal.classList.contains(
                    "show"
                )
            ) {

                closeLeaveRequestModal();
            }

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    setTodayDate();

    renderEmployees();

    updateSummary();

    initAttendance();

    initLeave();

    renderReports();

    updateNotificationBadge();

    renderNotifications();

    renderDashboard();


    /* =====================================================
       WELCOME NOTIFICATION
    ===================================================== */

    if (
        notifications.length ===
        0
    ) {

        addNotification({

            type:
                "system",

            title:
                "خوش آمدید 👋",

            message:
                "به سامانه جامع منابع انسانی میرزا کوچک خان خوش آمدید.",

            icon:
                "👋"
        });


        renderNotifications();

        renderDashboard();
    }


    /* =====================================================
       VERSION
    ===================================================== */

    console.log(
        "=========================================="
    );

    console.log(
        "MIRZA KHAN HR - APP.JS VERSION 2.0"
    );

    console.log(
        "Dashboard: ACTIVE"
    );

    console.log(
        "Employees: ACTIVE"
    );

    console.log(
        "Attendance: ACTIVE"
    );

    console.log(
        "Leave & Mission: ACTIVE"
    );

    console.log(
        "Reports: ACTIVE"
    );

    console.log(
        "Notifications: ACTIVE"
    );

    console.log(
        "LocalStorage: ACTIVE"
    );

    console.log(
        "DOM READY: ACTIVE"
    );

    console.log(
        "Global Functions: ACTIVE"
    );

    console.log(
        "=========================================="
    );

});
