/* ハンバーガーメニュー */
const hamburgermenu = document.getElementById("hamburgermenu");
const hamburgermenunav = document.getElementById("hamburgermenunav");

hamburgermenu.addEventListener("click", () => {
  hamburgermenu.classList.toggle("active");
  hamburgermenunav.classList.toggle("active");
});

/* プルダウンメニュー */
document.querySelectorAll(".pull-down-menu").forEach((menu) => {
  menu.addEventListener("click", (e) => {
    e.stopPropagation();

    const nextLi = menu.nextElementSibling; // 次の<li>を取得
    const submenu = nextLi?.querySelector(".sub-menu");

    if (!submenu) return; // sub-menuが存在しなければ何もしない

    const isOpen = menu.classList.toggle("open");
    submenu.style.display = isOpen ? "inline-block" : "none";
  });
});

document.querySelectorAll(".afi-nav-pdm > span").forEach((menu) => {
  menu.addEventListener("click", (e) => {
    e.stopPropagation();

    const submenu = menu.parentElement.querySelector(".afi-nav-sm"); // 同じ<li>内の<ul>を取得
    if (!submenu) return;

    const isOpen = menu.classList.toggle("open"); //spanにopen付ける
    submenu.style.display = isOpen ? "inline-block" : "none";
  });
});
