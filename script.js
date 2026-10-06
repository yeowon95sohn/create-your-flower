// ===============================
// 오프닝 화면 전환
// ===============================

const introScreen = document.getElementById("introScreen");
const introMessage = document.getElementById("introMessage");

const createScreen = document.getElementById("createScreen");

const startButton = document.getElementById("startButton");
const startArea = document.getElementById("startArea");
const startSound = new Audio("sounds/2.sparkleintro.mp3");
const petalSound = new Audio(
  "sounds/melancholy-ui-chime_slightly-higher-soft-tail.mp3"
);

petalSound.preload = "auto";
petalSound.volume = 0.45;
startSound.preload = "auto";
startSound.volume = 0.6;
const ambientSound = new Audio(
  "sounds/868373__bassimat__endless-ethereal-ambient-texture-with-glockenspiel-floating-pads-and-water.wav"
);
const completeSound = new Audio(
  "sounds/humordome-dream-chime-452820.mp3"
);

completeSound.preload = "auto";
completeSound.volume = 0.4;

ambientSound.preload = "auto";
ambientSound.loop = true;
ambientSound.volume = 0.08;

// 페이지가 열리고 잠깐 뒤 문장 등장
setTimeout(function() {
  introMessage.classList.add("show");
}, 1200);

// 문장 잠시 보여준 뒤 사라짐
setTimeout(function() {
  introMessage.classList.remove("show");
  introMessage.classList.add("hide");
}, 3600);

// 문장이 사라진 뒤 꽃 아이콘 등장
setTimeout(function() {
  startButton.classList.add("show");
  startArea.classList.add("show");
}, 4000);

// ===============================
// 꽃 아이콘 클릭 = 실제 START
// ===============================

startButton.addEventListener("click", function() {

  startSound.currentTime = 0;

  startSound.play().catch(function(error) {
    console.log("START 사운드 재생 오류:", error);
  });

  setTimeout(function() {

  ambientSound.currentTime = 0;

  ambientSound.play().catch(function(error) {
    console.log("배경음 재생 오류:", error);
  });

}, 1200);

  const buttonRect =
    startButton.getBoundingClientRect();

  const rippleX =
    buttonRect.left +
    buttonRect.width / 2;

  const rippleY =
    buttonRect.top +
    buttonRect.height / 2;

  createRipple(
    rippleX,
    rippleY
  );

  createScreen.style.display = "block";

  setTimeout(function() {
    createScreen.classList.add("show");
  }, 150);

  introScreen.classList.add("fade-out");

  setTimeout(function() {
    introScreen.style.display = "none";
  }, 1300);

});


// ===============================
// 서랍
// ===============================

const drawer = document.getElementById("drawer");
const drawerButton = document.getElementById("drawerButton");
const closeDrawer = document.getElementById("closeDrawer");
const drawerHint = document.getElementById("drawerHint");

drawerButton.addEventListener("click", function() {
  drawer.classList.add("open");
  createScreen.classList.add("drawer-open");

  drawerButton.style.display = "none";

  if (drawerHint) {
    drawerHint.classList.add("hide");

    setTimeout(function() {
      drawerHint.style.display = "none";
    }, 500);
  }
});

closeDrawer.addEventListener("click", function() {
  drawer.classList.remove("open");
  createScreen.classList.remove("drawer-open");

  drawerButton.style.display = "flex";
});


// ===============================
// 꽃 만들기
// ===============================

const petals = document.querySelectorAll(".petal-choice");
const flower = document.getElementById("flower");

const deleteButton = document.getElementById("deleteButton");
const resetButton = document.getElementById("resetButton");

const angles = [0, 52, 104, 156, 208, 260, 312];

let draggedImage = "";
let selectedPetal = null;

let slots = [
  null,
  null,
  null,
  null,
  null,
  null,
  null
];


// ===============================
// PC + 모바일 꽃잎 드래그
// ===============================

petals.forEach(function(petal) {

  // PC 드래그
  petal.addEventListener("dragstart", function(event) {
    draggedImage = event.target.dataset.image;
  });

  // 모바일 터치 드래그
  let touchClone = null;

  petal.addEventListener("touchstart", function(event) {

    event.preventDefault();

    draggedImage = petal.dataset.image;

    const touch = event.touches[0];

    touchClone = petal.cloneNode(true);
    touchClone.classList.add("touch-dragging");

    document.body.appendChild(touchClone);

    touchClone.style.left = touch.clientX + "px";
    touchClone.style.top = touch.clientY + "px";

  }, { passive: false });

  petal.addEventListener("touchmove", function(event) {

    event.preventDefault();

    const touch = event.touches[0];

    if (touchClone !== null) {
      touchClone.style.left = touch.clientX + "px";
      touchClone.style.top = touch.clientY + "px";
    }

  }, { passive: false });

  petal.addEventListener("touchend", function(event) {

    const touch = event.changedTouches[0];

    if (touchClone !== null) {
      touchClone.remove();
      touchClone = null;
    }

    const flowerRect = flower.getBoundingClientRect();

    const insideFlower =
      touch.clientX >= flowerRect.left &&
      touch.clientX <= flowerRect.right &&
      touch.clientY >= flowerRect.top &&
      touch.clientY <= flowerRect.bottom;

    if (insideFlower) {
      placePetal(
        touch.clientX,
        touch.clientY
      );
    }

  });

});


// ===============================
// PC에서 꽃 위 드롭 허용
// ===============================

flower.addEventListener("dragover", function(event) {
  event.preventDefault();
});

flower.addEventListener("drop", function(event) {

  event.preventDefault();

  placePetal(
    event.clientX,
    event.clientY
  );

});


// ===============================
// 꽃잎 실제 배치 함수
// ===============================

function placePetal(clientX, clientY) {

  const flowerRect = flower.getBoundingClientRect();

  const centerX = flowerRect.width / 2;
  const centerY = flowerRect.height / 2;

  const dropX = clientX - flowerRect.left;
  const dropY = clientY - flowerRect.top;

  let dropAngle =
    Math.atan2(
      dropY - centerY,
      dropX - centerX
    ) * 180 / Math.PI;

  dropAngle = dropAngle + 90;

  if (dropAngle < 0) {
    dropAngle += 360;
  }

  let closestSlot = -1;
  let smallestDifference = Infinity;

  for (let i = 0; i < angles.length; i++) {

    if (slots[i] !== null) {
      continue;
    }

    let difference =
      Math.abs(
        dropAngle - angles[i]
      );

    if (difference > 180) {
      difference = 360 - difference;
    }

    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestSlot = i;
    }
  }

  if (closestSlot === -1) {
    return;
  }

  const newPetal = document.createElement("img");

  newPetal.src = draggedImage;

 newPetal.style.transform =
  "rotate(" + angles[closestSlot] + "deg)";

  newPetal.dataset.slot = closestSlot;

  newPetal.style.zIndex = closestSlot + 1;

  newPetal.classList.add("petal-enter");

  newPetal.addEventListener("animationend", function() {
    newPetal.classList.remove("petal-enter");
  }, { once: true });

  newPetal.addEventListener("click", function() {

    if (selectedPetal === newPetal) {
      selectedPetal.style.opacity = "1";
      selectedPetal = null;
      return;
    }

    if (selectedPetal !== null) {
      selectedPetal.style.opacity = "1";
    }

    selectedPetal = newPetal;
    selectedPetal.style.opacity = "0.5";

  });

 flower.appendChild(newPetal);
slots[closestSlot] = newPetal;

// 꽃잎 착지 효과음
petalSound.currentTime = 0;

petalSound.play().catch(function(error) {
  console.log("꽃잎 효과음 재생 오류:", error);
});

updateCompleteButton(); 

  createRipple(
    flowerRect.left + flowerRect.width / 2,
    flowerRect.top + flowerRect.height * 0.625
  );
}


// ===============================
// 선택한 꽃잎 삭제
// ===============================

deleteButton.addEventListener("click", function() {

  if (selectedPetal !== null) {

    const petalToDelete = selectedPetal;

    const slotNumber =
      Number(petalToDelete.dataset.slot);

    slots[slotNumber] = null;

    petalToDelete.classList.add("petal-exit");

    setTimeout(function() {
      petalToDelete.remove();
    }, 350);

    selectedPetal = null;

    updateCompleteButton();
  }

});


// ===============================
// 전체 RESET
// ===============================

resetButton.addEventListener("click", function() {

  slots.forEach(function(petal) {
    if (petal !== null) {
      petal.remove();
    }
  });

  slots = [
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ];

  selectedPetal = null;

  updateCompleteButton();

});


// ===============================
// 꽃잎이 놓일 때 파문 생성
// ===============================

function createRipple(x, y) {

  const container = document.createElement("div");

  container.className = "ripple-container";

  container.style.left = x + "px";
  container.style.top = y + "px";

  const maxDistance = Math.max(
    Math.hypot(x, y),
    Math.hypot(window.innerWidth - x, y),
    Math.hypot(x, window.innerHeight - y),
    Math.hypot(
      window.innerWidth - x,
      window.innerHeight - y
    )
  );

  const scale = (maxDistance * 2.2) / 100;

  for (let i = 0; i < 2; i++) {

    const ripple = document.createElement("div");

    ripple.className = "ripple";

    ripple.style.setProperty(
      "--ripple-scale",
      scale
    );

    container.appendChild(ripple);
  }

  document.body.appendChild(container);

  setTimeout(function() {
    container.remove();
  }, 4000);

}


// ===============================
// COMPLETE
// ===============================

const completeButton = document.getElementById("completeButton");
const bookmark = document.getElementById("bookmark");
const controls = document.getElementById("controls");
const backButton = document.getElementById("backButton");

completeButton.addEventListener("click", function() {

  if (selectedPetal !== null) {
    selectedPetal.style.opacity = "1";
    selectedPetal = null;
  }

  drawer.classList.remove("open");
  createScreen.classList.remove("drawer-open");

  drawerButton.style.display = "none";

  if (drawerHint) {
    drawerHint.style.display = "none";
  }

  controls.style.opacity = "0";
  controls.style.pointerEvents = "none";

  completeButton.style.opacity = "0";
  completeButton.style.pointerEvents = "none";

  flower.classList.add("locked");

  setFlowerQuote();

  setTimeout(function() {

  const flowerRect = flower.getBoundingClientRect();

  createRipple(
    flowerRect.left + flowerRect.width / 2,
    flowerRect.top + flowerRect.height * 0.625
  );

  flower.classList.add("complete-flower");


  // 완성 사운드 시작
  completeSound.currentTime = 0;

  completeSound.play().catch(function(error) {
    console.log("COMPLETE 사운드 재생 오류:", error);
  });


  // 완성 사운드 끝나면 배경음 다시 복원
  completeSound.onended = function() {

    let volume = ambientSound.volume;

    const fadeBack = setInterval(function() {

      volume += 0.005;

      if (volume >= 0.08) {
        volume = 0.08;
        clearInterval(fadeBack);
      }

      ambientSound.volume = volume;

    }, 80);

  };


}, 350);

  setTimeout(function() {
    bookmark.classList.add("show");
    backButton.classList.add("show");
    flowerQuote.classList.add("show");
  }, 5150);

});


// ===============================
// COMPLETE 버튼 표시 조건
// ===============================

function updateCompleteButton() {

  const petalCount = slots.filter(function(slot) {
    return slot !== null;
  }).length;

  if (petalCount >= 3) {
    completeButton.classList.add("show");
  } else {
    completeButton.classList.remove("show");
  }

}


// ===============================
// 뒤로가기
// ===============================

backButton.addEventListener("click", function() {

  bookmark.classList.remove("show");
  backButton.classList.remove("show");
  flowerQuote.classList.remove("show");

  flower.classList.remove("complete-flower");
  flower.classList.remove("locked");

  controls.style.opacity = "1";
  controls.style.pointerEvents = "auto";

  drawerButton.style.display = "flex";

  completeButton.style.opacity = "";
  completeButton.style.pointerEvents = "";

  updateCompleteButton();

});


// ===============================
// 꽃 문구
// ===============================

const flowerQuote = document.getElementById("flowerQuote");

const completeQuotes = [
  "모든 꽃은 뿌리 깊은 곳에 빛을 간직하고 있다.",
  "흔들리지 않고 피는 꽃이 어디 있으랴.",
  "하나의 꽃에는 수많은 내가 함께 피어 있다.",
  "꽃들은 저마다 제 이름으로 피어난다.",
  "꽃을 보려는 사람에게는 언제나 꽃이 있다.",
  "모든 꽃은 흐트러진 채로, 제멋대로 자라면서도 아름답다."
];

const incompleteQuotes = [
  "아직 피지 않았다는 것은, 아직 끝나지 않았다는 뜻이다.",
  "꽃은 느리게 펼쳐지지만, 그 순간은 분명히 온다."
];

function setFlowerQuote() {

  const petalCount = slots.filter(function(slot) {
    return slot !== null;
  }).length;

  let quotes;

  if (petalCount === 7) {
    quotes = completeQuotes;
  } else {
    quotes = incompleteQuotes;
  }

  const randomIndex =
    Math.floor(Math.random() * quotes.length);

  flowerQuote.textContent = quotes[randomIndex];
}


// ===============================
// SAVE
// ===============================

const saveMenu = document.getElementById("saveMenu");
const saveDefault = document.getElementById("saveDefault");
const saveFlower = document.getElementById("saveFlower");


// ===============================
// PNG 다운로드
// ===============================

function downloadCanvas(canvas, fileName) {

  canvas.toBlob(function(blob) {

    if (!blob) {
      console.error("PNG 변환에 실패했습니다.");
      return;
    }

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(function() {
      URL.revokeObjectURL(url);
    }, 1000);

  }, "image/png");

}


// ===============================
// 꽃을 캔버스에 직접 그리기
// ===============================

function renderFlowerCanvas(scale = 3, padding = 40) {

  let placedPetals = Array.from(
    flower.querySelectorAll("#flower > img[data-slot]")
  );

  if (placedPetals.length === 0) {
    return null;
  }

  placedPetals.sort(function(a, b) {
    return Number(a.dataset.slot) - Number(b.dataset.slot);
  });

  const pieces = [];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  placedPetals.forEach(function(petal) {

    const slot = Number(petal.dataset.slot);

    if (
      !Number.isInteger(slot) ||
      angles[slot] === undefined
    ) {
      return;
    }

    const width = petal.offsetWidth;
    const height = petal.offsetHeight;

    const left = petal.offsetLeft;
    const top = petal.offsetTop;

    const pivotX = left + width / 2;
    const pivotY = top + height;

    const rad =
      angles[slot] * Math.PI / 180;

    const corners = [
      [-width / 2, -height],
      [ width / 2, -height],
      [ width / 2, 0],
      [-width / 2, 0]
    ];

    corners.forEach(function(point) {

      const x = point[0];
      const y = point[1];

      const rotatedX =
        pivotX +
        x * Math.cos(rad) -
        y * Math.sin(rad);

      const rotatedY =
        pivotY +
        x * Math.sin(rad) +
        y * Math.cos(rad);

      minX = Math.min(minX, rotatedX);
      minY = Math.min(minY, rotatedY);
      maxX = Math.max(maxX, rotatedX);
      maxY = Math.max(maxY, rotatedY);

    });

    pieces.push({
      image: petal,
      width: width,
      height: height,
      pivotX: pivotX,
      pivotY: pivotY,
      rad: rad
    });

  });

  if (pieces.length === 0) {
    return null;
  }

  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const cssWidth = maxX - minX;
  const cssHeight = maxY - minY;

  const canvas = document.createElement("canvas");

  canvas.width = Math.ceil(cssWidth * scale);
  canvas.height = Math.ceil(cssHeight * scale);

  const ctx = canvas.getContext("2d");

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.scale(scale, scale);

  pieces.forEach(function(piece) {

    ctx.save();

    ctx.translate(
      piece.pivotX - minX,
      piece.pivotY - minY
    );

    ctx.rotate(piece.rad);

    ctx.globalAlpha = 1;

    ctx.drawImage(
      piece.image,
      -piece.width / 2,
      -piece.height,
      piece.width,
      piece.height
    );

    ctx.restore();

  });

  return {
    canvas: canvas,
    left: minX,
    top: minY,
    cssWidth: cssWidth,
    cssHeight: cssHeight
  };

}


// ===============================
// 꽃 ONLY용 정사각형
// ===============================

function makeSquareCanvas(
  sourceCanvas,
  extraPadding = 0
) {

  const size =
    Math.max(
      sourceCanvas.width,
      sourceCanvas.height
    ) +
    extraPadding * 2;

  const canvas =
    document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const ctx =
    canvas.getContext("2d");

  ctx.clearRect(
    0,
    0,
    size,
    size
  );

  const x =
    (size - sourceCanvas.width) / 2;

  const y =
    (size - sourceCanvas.height) / 2;

  ctx.drawImage(
    sourceCanvas,
    x,
    y
  );

  return canvas;

}


// ===============================
// 꽃 ONLY 저장
// ===============================

saveFlower.addEventListener(
  "click",
  function() {

    try {

      const flowerResult =
        renderFlowerCanvas(
          3,
          40
        );

      if (!flowerResult) {
        return;
      }

      const squareCanvas =
        makeSquareCanvas(
          flowerResult.canvas,
          12
        );

      downloadCanvas(
        squareCanvas,
        "my-flower-only.png"
      );

    } catch (error) {

      console.error(
        "꽃 ONLY 저장 오류:",
        error
      );

    }

  }
);


// ===============================
// 기본 저장
// ===============================

saveDefault.addEventListener(
  "click",
  async function() {

    try {

      const bookmarkRect =
        bookmark.getBoundingClientRect();

      const flowerRect =
        flower.getBoundingClientRect();

      const baseCanvas =
        await html2canvas(
          bookmark,
          {

            scale: 2,

            backgroundColor:
              "#E5EBEF",

            useCORS: true,

            onclone: function(clonedDocument) {

              const clonedBookmark =
                clonedDocument.getElementById(
                  "bookmark"
                );

              const clonedSave =
                clonedDocument.getElementById(
                  "saveMenu"
                );

              if (clonedSave) {
                clonedSave.style.display =
                  "none";
              }

              if (clonedBookmark) {

                clonedBookmark.style.borderRadius =
                  "0";

                clonedBookmark.style.border =
                  "none";

                clonedBookmark.style.boxShadow =
                  "none";

                clonedBookmark.style.backdropFilter =
                  "none";

                clonedBookmark.style.webkitBackdropFilter =
                  "none";

                clonedBookmark.style.background =
                  "#E5EBEF";

              }

            }

          }
        );

      const flowerResult =
        renderFlowerCanvas(
          2,
          40
        );

      if (!flowerResult) {
        return;
      }

      const resultCanvas =
        document.createElement(
          "canvas"
        );

      resultCanvas.width =
        baseCanvas.width;

      resultCanvas.height =
        baseCanvas.height;

      const ctx =
        resultCanvas.getContext(
          "2d"
        );

      ctx.drawImage(
        baseCanvas,
        0,
        0
      );

      const flowerScreenLeft =
        flowerRect.left +
        flowerResult.left;

      const flowerScreenTop =
        flowerRect.top +
        flowerResult.top;

      const x =
        (
          flowerScreenLeft -
          bookmarkRect.left
        ) * 2;

      const y =
        (
          flowerScreenTop -
          bookmarkRect.top
        ) * 2;

      ctx.drawImage(
        flowerResult.canvas,
        x,
        y
      );

      downloadCanvas(
        resultCanvas,
        "my-flower-default.png"
      );

    } catch (error) {

      console.error(
        "기본 저장 오류:",
        error
      );

    }

  }
);

// =================================
// 서랍 꽃잎 성격 툴팁
// =================================

const petalMessages = {

  "자유.png": {
    title: "자유",
    text: "나답게 피어나는 데에는 정답이 없다"
  },

  "용기.png": {
    title: "용기",
    text: "두려워도 한 걸음 내딛는 용기"
  },

  "진심.png": {
    title: "진심",
    text: "진심은 언제나 통하는 법!"
  },

  "균형.png": {
    title: "균형",
    text: "어느 한쪽에 흔들리지 않는 마음의 자리"
  },

  "온기.png": {
    title: "온기",
    text: "오래 머문 따뜻함은 쉽게 떠나지 않는다."
  },

  "신뢰.png": {
    title: "신뢰",
    text: "믿음은 천천히 쌓여, 신뢰가 된다"
  },

  "열정.png": {
    title: "열정",
    text: "오래 바라본 것은 쉽게 식지 않는다"
  },

  "희망.png": {
    title: "희망",
    text: "모든 불은 희망의 빛"
  },

  "직관.png": {
    title: "직관",
    text: "때로는 머리보다 마음으로"
  },

  "호기심.png": {
    title: "호기심",
    text: "그 곳에 아직 열어보지 못한 문이 있다"
  },

  "사랑.png": {
    title: "사랑",
    text: "별이 뜬다 너를 본다"
  },

  "평온.png": {
    title: "평온",
    text: "고요함도 하나의 풍경이 된다"
  }

};


// =================================
// 툴팁 HTML 자동 생성
// =================================

const petalTooltip =
  document.createElement("div");

petalTooltip.id = "petalTooltip";

petalTooltip.innerHTML = `
  <div id="petalTooltipTitle"></div>

  <div id="petalTooltipLine"></div>

  <div id="petalTooltipText"></div>
`;

document.body.appendChild(petalTooltip);


const petalTooltipTitle =
  document.getElementById(
    "petalTooltipTitle"
  );

const petalTooltipText =
  document.getElementById(
    "petalTooltipText"
  );


// =================================
// 툴팁 위치
// =================================

function positionPetalTooltip(petal) {

  const petalRect =
    petal.getBoundingClientRect();

  const drawerRect =
    drawer.getBoundingClientRect();

  const tooltipWidth = 250;

  const gap = 16;


  /* 항상 서랍 오른쪽 바깥에 표시 */
  let left =
    drawerRect.right + gap;


  /* 꽃잎 세로 중앙 근처 */
  let top =
    petalRect.top +
    petalRect.height / 2 -
    47;


  /* 화면 오른쪽 밖으로 나가는 경우 */
  if (
    left + tooltipWidth >
    window.innerWidth - 15
  ) {

    left =
      drawerRect.left -
      tooltipWidth -
      gap;
  }


  /* 화면 위쪽 방지 */
  if (top < 15) {
    top = 15;
  }


  /* 화면 아래쪽 방지 */
  const tooltipHeight =
    petalTooltip.offsetHeight || 100;

  if (
    top + tooltipHeight >
    window.innerHeight - 15
  ) {

    top =
      window.innerHeight -
      tooltipHeight -
      15;
  }


  petalTooltip.style.left =
    left + "px";

  petalTooltip.style.top =
    top + "px";
}


// =================================
// 각 서랍 꽃잎에 HOVER 적용
// =================================

petals.forEach(function(petal) {

  petal.addEventListener(
    "mouseenter",
    function() {

      const fileName =
        decodeURIComponent(
          petal.src
            .split("/")
            .pop()
            .split("?")[0]
        );


      const info =
        petalMessages[fileName];


      if (!info) {
        return;
      }


      petalTooltipTitle.textContent =
        info.title;

      petalTooltipText.textContent =
        info.text;


      petalTooltip.classList.add(
        "show"
      );


      positionPetalTooltip(petal);
    }
  );


  petal.addEventListener(
    "mouseleave",
    function() {

      petalTooltip.classList.remove(
        "show"
      );
    }
  );

});


// 서랍 스크롤하면 툴팁 닫기
drawer.addEventListener(
  "scroll",
  function() {

    petalTooltip.classList.remove(
      "show"
    );
  }
);