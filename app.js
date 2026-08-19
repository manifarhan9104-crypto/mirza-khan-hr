/* ==================================================
   MIRZA KHAN HR
   EMPLOYEE MANAGEMENT - VERSION 1.1
================================================== */


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
    JSON.parse(
        localStorage.getItem("mirzaKhanEmployees")
    ) || defaultEmployees;


/* ==================================================
   ELEMENTS
================================================== */


const employeesTableBody =
    document.getElementById("employeesTableBody");

const employeeSearch =
    document.getElementById("employeeSearch");

const departmentFilter =
    document.getElementById("departmentFilter");

const statusFilter =
    document.getElementById("statusFilter");

const employeeModal =
    document.getElementById("employeeModal");

const employeeForm =
    document.getElementById("employeeForm");

const modalTitle =
    document.getElementById("modalTitle");

const addEmployeeBtn =
    document.getElementById("addEmployeeBtn");

const dashboardAddEmployee =
    document.getElementById("dashboardAddEmployee");

const closeModal =
    document.getElementById("closeModal");

const cancelModal =
    document.getElementById("cancelModal");


let editingEmployeeId = null;


/* ==================================================
   SAVE DATA
================================================== */


function saveEmployees() {

    localStorage.setItem(
        "mirzaKhanEmployees",
        JSON.stringify(employees)
    );

}


/* ==================================================
   DATE
================================================== */


function setDate() {

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
   PAGE NAVIGATION
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


            const employeesPage =
                document.getElementById(
                    "employeesPage"
                );


            if (page === "employees") {

                employeesPage.classList.add(
                    "active"
                );

            }
            else {

                employeesPage.classList.remove(
                    "active"
                );

            }


            pageTitle.textContent =
                pageNames[page] ||
                "داشبورد";


            sidebar.classList.remove(
                "open"
            );


            if (page === "employees") {

                renderEmployees();

            }

        }
    );

});


/* ==================================================
   MOBILE MENU
================================================== */


mobileMenu.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "open"
        );

    }
);


/* ==================================================
   EMPLOYEE FILTER
================================================== */


function getFilteredEmployees() {

    const search =
        employeeSearch.value
            .trim()
            .toLowerCase();


    const department =
        departmentFilter.value;


    const status =
        statusFilter.value;


    return employees.filter(employee => {

        const matchesSearch =

            employee.name
                .toLowerCase()
                .includes(search)

            ||

            employee.code
                .toLowerCase()
                .includes(search)

            ||

            employee.phone
                .includes(search);


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

    const filtered =
        getFilteredEmployees();


    employeesTableBody.innerHTML =
        "";


    if (filtered.length === 0) {

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


    filtered.forEach(employee => {

        const firstLetter =
            employee.name.charAt(0);


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
                        ${firstLetter}
                    </div>

                    <div>

                        <strong>
                            ${employee.name}
                        </strong>

                        <span>
                            ${employee.code}
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${employee.department}
            </td>


            <td>
                ${employee.position || "-"}
            </td>


            <td>
                ${employee.phone || "-"}
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
   SUMMARY
================================================== */


function updateSummary() {

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


    const departments =
        new Set(
            employees.map(
                e => e.department
            )
        ).size;


    document.getElementById(
        "totalEmployees"
    ).textContent = total;


    document.getElementById(
        "activeEmployees"
    ).textContent = active;


    document.getElementById(
        "inactiveEmployees"
    ).textContent = inactive;


    document.getElementById(
        "dashboardTotal"
    ).textContent = total;


    document.getElementById(
        "dashboardActive"
    ).textContent = active;


    document.getElementById(
        "dashboardInactive"
    ).textContent = inactive;


    document.getElementById(
        "dashboardDepartments"
    ).textContent = departments;

}


/* ==================================================
   OPEN MODAL
================================================== */


function openEmployeeModal(employee = null) {

    employeeModal.classList.add(
        "show"
    );


    if (employee) {

        modalTitle.textContent =
            "ویرایش کارمند";


        document.getElementById(
            "fullName"
        ).value = employee.name;


        document.getElementById(
            "personnelCode"
        ).value = employee.code;


        document.getElementById(
            "phone"
        ).value = employee.phone;


        document.getElementById(
            "department"
        ).value = employee.department;


        document.getElementById(
            "position"
        ).value = employee.position;


        document.getElementById(
            "status"
        ).value = employee.status;


        document.getElementById(
            "address"
        ).value = employee.address;


        editingEmployeeId =
            employee.id;

    }

    else {

        modalTitle.textContent =
            "افزودن کارمند";


        employeeForm.reset();


        editingEmployeeId =
            null;

    }

}


/* ==================================================
   CLOSE MODAL
================================================== */


function closeEmployeeModal() {

    employeeModal.classList.remove(
        "show"
    );

    employeeForm.reset();

    editingEmployeeId =
        null;

}


/* ==================================================
   ADD EMPLOYEE
================================================== */


addEmployeeBtn.addEventListener(
    "click",
    () => {

        openEmployeeModal();

    }
);


dashboardAddEmployee.addEventListener(
    "click",
    () => {

        document.querySelector(
            '[data-page="employees"]'
        ).click();


        setTimeout(
            () => openEmployeeModal(),
            100
        );

    }
);


closeModal.addEventListener(
    "click",
    closeEmployeeModal
);


cancelModal.addEventListener(
    "click",
    closeEmployeeModal
);


/* ==================================================
   SAVE EMPLOYEE
================================================== */


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


        if (!name || !code || !department) {

            alert(
                "لطفاً اطلاعات الزامی را وارد کنید."
            );

            return;

        }


        const duplicate =
            employees.find(
                employee =>
                    employee.code === code &&
                    employee.id !== editingEmployeeId
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


        if (editingEmployeeId) {

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

        }

        else {

            employees.push({

                id:
                    Date.now(),

                ...employeeData

            });

        }


        saveEmployees();

        renderEmployees();

        updateSummary();

        closeEmployeeModal();

        alert(
            editingEmployeeId
                ? "اطلاعات کارمند با موفقیت ویرایش شد."
                : "کارمند جدید با موفقیت ثبت شد."
        );

    }
);


/* ==================================================
   EDIT
================================================== */


function editEmployee(id) {

    const employee =
        employees.find(
            e => e.id === id
        );


    if (!employee) return;


    openEmployeeModal(
        employee
    );

}


/* ==================================================
   DELETE
================================================== */


function deleteEmployee(id) {

    const employee =
        employees.find(
            e => e.id === id
        );


    if (!employee) return;


    const confirmed =
        confirm(
            `آیا از حذف «${employee.name}» مطمئن هستید؟`
        );


    if (!confirmed) return;


    employees =
        employees.filter(
            e => e.id !== id
        );


    saveEmployees();

    renderEmployees();

    updateSummary();

}


/* ==================================================
   VIEW PROFILE
================================================== */


function viewEmployee(id) {

    const employee =
        employees.find(
            e => e.id === id
        );


    if (!employee) return;


    employeeModal.classList.add(
        "show"
    );


    employeeForm.style.display =
        "none";


    document.querySelector(
        ".modal-header h3"
    ).textContent =
        "پرونده پرسنلی";


    document.getElementById(
        "profileView"
    ).classList.add(
        "show"
    );


    document.getElementById(
        "profileAvatar"
    ).textContent =
        employee.name.charAt(0);


    document.getElementById(
        "profileName"
    ).textContent =
        employee.name;


    document.getElementById(
        "profilePosition"
    ).textContent =
        employee.position || "-";


    document.getElementById(
        "profileCode"
    ).textContent =
        employee.code;


    document.getElementById(
        "profileDepartment"
    ).textContent =
        employee.department;


    document.getElementById(
        "profilePhone"
    ).textContent =
        employee.phone || "-";


    document.getElementById(
        "profileStatus"
    ).textContent =
        employee.status === "active"
            ? "فعال"
            : "غیرفعال";


    document.getElementById(
        "profileAddress"
    ).textContent =
        employee.address || "-";

}


/* ==================================================
   RESTORE FORM WHEN MODAL CLOSES
================================================== */


function restoreModal() {

    employeeForm.style.display =
        "grid";


    document.getElementById(
        "profileView"
    ).classList.remove(
        "show"
    );


    document.querySelector(
        ".modal-header h3"
    ).textContent =
        "افزودن کارمند";

}


closeModal.addEventListener(
    "click",
    restoreModal
);

cancelModal.addEventListener(
    "click",
    restoreModal
);


/* ==================================================
   SEARCH / FILTER EVENTS
================================================== */


employeeSearch.addEventListener(
    "input",
    renderEmployees
);


departmentFilter.addEventListener(
    "change",
    renderEmployees
);


statusFilter.addEventListener(
    "change",
    renderEmployees
);


/* ==================================================
   CLOSE MODAL WITH BACKDROP
================================================== */


employeeModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            employeeModal
        ) {

            closeEmployeeModal();

            restoreModal();

        }

    }
);


/* ==================================================
   INITIALIZE
================================================== */


renderEmployees();

updateSummary();


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
