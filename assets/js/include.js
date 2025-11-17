// トップページかどうか判定
const isTop =
  location.pathname === "/" || location.pathname.endsWith("index.html");

// 読み込むパーツを判定
const headerFile = isTop
  ? "components/header-top.html"
  : "components/header-lower-page.html";

document.getElementById("header").innerHTML = "Loading...";

/* ---------- ヘッダー読み込み ---------- */
fetch(headerFile)
  .then((resp) => resp.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;

    // 共通スクリプトを読み込む
    const script = document.createElement("script");
    script.src = "assets/js/script.js";
    document.body.appendChild(script);

    // トップページならトップ用スクリプトを追加
    if (isTop) {
      const topScript = document.createElement("script");
      topScript.src = "assets/js/top-script.js";
      topScript.onload = () => {
        if (typeof initTopVisual === "function") initTopVisual();
      };
      document.body.appendChild(topScript);
    }
  });

/* ---------- フッター読み込み ---------- */
fetch("components/footer.html")
  .then((resp) => resp.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });
