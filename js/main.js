// Ham menu 
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

const menuItems = document.querySelectorAll('.nav-menu > li');

menuItems.forEach(item => {
    const submenu = item.querySelector('.submenu');
    if (submenu) {
        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.nextElementSibling === submenu) {
                e.preventDefault();
            }

            item.classList.toggle('show-submenu');

            menuItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('show-submenu');
                }
            });
        });
    }
});
document.addEventListener('click', () => {
    menuItems.forEach(item => item.classList.remove('show-submenu'));
});
