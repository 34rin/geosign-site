const isTop =
  location.pathname === "/" || location.pathname.endsWith("index.html");
const headerFile = isTop
  ? "components/header-top.html"
  : "components/header-lower-page.html";

document.getElementById("header").innerHTML = "Loading...";

fetch(headerFile)
  .then((resp) => resp.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;

    const script = document.createElement("script");
    script.src = "assets/js/script.js";
    document.body.appendChild(script);

    if (isTop) {
      const topScript = document.createElement("script");
      topScript.src = "assets/js/top-script.js";
      topScript.onload = () => {
        if (typeof initTopVisual === "function") initTopVisual();
      };
      document.body.appendChild(topScript);
    }
  });

fetch("components/footer.html")
  .then((resp) => resp.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });
