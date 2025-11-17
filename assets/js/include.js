// ------------------------
// include.js (SPA対応版)
// ------------------------

// トップページ判定
const isTop =
  location.pathname === "/" || location.pathname.endsWith("index.html");

// ヘッダーとフッターの読み込み関数
function loadHeaderFooter(callback) {
  const headerFile = isTop
    ? "components/header-top.html"
    : "components/header-lower-page.html";

  // ヘッダー読み込み
  fetch(headerFile)
    .then((resp) => resp.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;

      // 共通スクリプト読み込み
      const script = document.createElement("script");
      script.src = "assets/js/script.js";
      document.body.appendChild(script);

      // トップページスクリプト
      if (isTop) {
        const topScript = document.createElement("script");
        topScript.src = "assets/js/top-script.js";
        topScript.onload = () => {
          if (typeof initTopVisual === "function") initTopVisual();
        };
        document.body.appendChild(topScript);
      }

      if (callback) callback();
    });

  // フッター読み込み
  fetch("components/footer.html")
    .then((resp) => resp.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    });
}

// 初期ロード時
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
});

// ------------------------
// 内部リンククリックでページ差し替え（SPA対応）
// ------------------------

// もし内部リンクをSPA風に差し替えたい場合
document.body.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("http") || href.startsWith("#")) return;

  // 内部リンクの場合
  e.preventDefault();

  fetch(href)
    .then((resp) => resp.text())
    .then((html) => {
      // ページ全体を置き換えるのではなく、main部分だけ置換
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const newMain = tempDiv.querySelector("main");
      if (newMain) {
        const main = document.querySelector("main");
        main.innerHTML = newMain.innerHTML;
      }

      // トップページか判定を更新
      const wasTop = isTop;
      const newPath = new URL(href, location.origin).pathname;
      window.history.pushState({}, "", newPath);

      // SPA遷移後のトップページ判定
      if (newPath === "/" || newPath.endsWith("index.html")) {
        if (typeof initTopVisual === "function") initTopVisual();
      }
    });
});

// popstate対応（ブラウザの戻る/進む）
window.addEventListener("popstate", () => {
  // ページの再読み込み時にトップページならスライドショーを初期化
  if (location.pathname === "/" || location.pathname.endsWith("index.html")) {
    if (typeof initTopVisual === "function") initTopVisual();
  }
});
