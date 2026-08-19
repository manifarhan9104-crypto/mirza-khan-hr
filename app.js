const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");
const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");
const todayDate = document.getElementById("todayDate");

const pageNames = {
    dashboard: "داشبورد",
    employees: "کارکنان",
    attendance: "حضور و غیاب",
    leave: "مرخصی و مأموریت",
    reports: "گزارش‌ها",
    notifications: "اعلان‌ها",
    settings: "تنظیمات"
};


// تاریخ امروز
function setDate() {

    const now = new Date();

    const formatter = new Intl.DateTimeFormat("fa-IR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    todayDate.textContent = formatter.format(now);
}

setDate();


// تغییر صفحات
menuItems.forEach(item => {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        const page = this.dataset.page;

        menuItems.forEach(menu => {
            menu.classList.remove("active");
        });

        this.classList.add("active");

        pages.forEach(pageElement => {
            pageElement.classList.remove("active-page");
        });

        const selectedPage = document.getElementById(`${page}Page`);

        if (selectedPage) {
            selectedPage.classList.add("active-page");
        }

        pageTitle.textContent = pageNames[page] || "داشبورد";

        sidebar.classList.remove("open");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});


// منوی موبایل
mobileMenu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});


// بستن منو با کلیک بیرون
document.addEventListener("click", event => {

    if (
        window.innerWidth <= 800 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !mobileMenu.contains(event.target)
    ) {
        sidebar.classList.remove("open");
    }

});


// دکمه افزودن کارمند
document.querySelectorAll(".primary-button").forEach(button => {

    button.addEventListener("click", () => {

        const employeeMenu = document.querySelector(
            '[data-page="employees"]'
        );

        if (employeeMenu) {
            employeeMenu.click();
        }

    });

});


// انتخاب بازه نمودار
const chartFilter = document.getElementById("chartFilter");

if (chartFilter) {

    chartFilter.addEventListener("change", function () {

        console.log(
            "بازه انتخاب شده:",
            this.value
        );

    });

}


// نمایش ساعت زنده
function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    document.title =
        `میرزا کوچک خان | ${time}`;

}

setInterval(updateClock, 1000);

updateClock();
