// include.js

// トップページかどうか判定
const isTop = location.pathname === "/" || location.pathname.endsWith("index.html");

// 読み込むヘッダーファイルを判定
const headerFile = isTop ? "components/header-top.html" : "components/header-lower-page.html";

// ヘッダーに「Loading...」表示
document.getElementById("header").innerHTML = "Loading...";

/* ---------- ヘッダー読み込み ---------- */
function loadHeader() {
  fetch(headerFile)
    .then(resp => resp.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;

      // 共通スクリプト読み込み
      const script = document.createElement("script");
      script.src = "assets/js/script.js";
      document.body.appendChild(script);

      // トップページならトップ用スクリプトを読み込み & 初期化
      if (isTop) {
        const topScript = document.createElement("script");
        topScript.src = "assets/js/top-script.js";
        topScript.onload = () => {
          if (typeof initTopVisual === "function") initTopVisual();
        };
        document.body.appendChild(topScript);
      }
    });
}

/* ---------- フッター読み込み ---------- */
function loadFooter() {
  fetch("components/footer.html")
    .then(resp => resp.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });
}

// 初期ロード
loadHeader();
loadFooter();

/* ---------- ページ遷移ボタン対策 ---------- */
// SPA 的に DOM を書き換えた場合も再初期化
document.addEventListener("click", (e) => {
  const target = e.target.closest("a");
  if (!target) return;

  // 自リンクや外部リンクは無視
  if (target.hostname !== location.hostname) return;

  // 遷移先がトップページならトップ用初期化を呼ぶ
  const href = target.getAttribute("href");
  if (href === "/" || href.endsWith("index.html")) {
    setTimeout(() => {
      if (typeof initTopVisual === "function") initTopVisual();
    }, 50); // DOM 書き換え後に呼ぶ
  }
});
