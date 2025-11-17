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
        // DOM + 画像のロード完了後に初期化
        waitForSlidesAndImages();
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

/* ---------- トップページ用初期化補助 ---------- */
function waitForSlidesAndImages() {
  const mainVisual = document.querySelector(".main-visual");
  if (!mainVisual) return;

  const images = mainVisual.querySelectorAll("img");
  let loadedCount = 0;

  if (images.length === 0) {
    // 画像なしならすぐ初期化
    if (typeof initTopVisual === "function") initTopVisual();
    return;
  }

  images.forEach((img) => {
    if (img.complete) loadedCount++;
    else
      img.addEventListener("load", () => {
        loadedCount++;
        if (loadedCount === images.length) {
          if (typeof initTopVisual === "function") initTopVisual();
        }
      });
  });

  if (loadedCount === images.length) {
    if (typeof initTopVisual === "function") initTopVisual();
  }
}
