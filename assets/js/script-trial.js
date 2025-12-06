/***** 利用規約 *****/

document.addEventListener("DOMContentLoaded", () => {
  const termsBox = document.getElementById("termsBox");
  const agreeCheckbox = document.getElementById("agree");
  const nextBtn = document.getElementById("nextBtn");

  // 最初は無効化
  agreeCheckbox.disabled = true;
  nextBtn.classList.add("disabled");

  // 利用規約を最後まで読んだら同意チェックを有効化
  termsBox.addEventListener("scroll", () => {
    const bottom = termsBox.scrollTop + termsBox.clientHeight;
    const height = termsBox.scrollHeight;

    if (bottom >= height - 5) {
      agreeCheckbox.disabled = false;
    }
  });

  // チェックされたら「次へ」ボタン有効化
  agreeCheckbox.addEventListener("change", () => {
    if (agreeCheckbox.checked) {
      nextBtn.classList.remove("disabled");
    } else {
      nextBtn.classList.add("disabled");
    }
  });
});
