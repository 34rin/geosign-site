// トップページかどうか判定
const isTop =
  location.pathname === "/" || location.pathname.endsWith("index.html");

// 読み込むパーツを判定
const headerFile = isTop
  ? "components/header-top.html"
  : "components/header-lower-page.html";

document.getElementById("header").innerHTML = "Loading...";

// ヘッダー読み込み
fetch(headerFile)
  .then((resp) => resp.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;
  });

// フッター読み込み
fetch("components/footer.html")
  .then((resp) => resp.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });
