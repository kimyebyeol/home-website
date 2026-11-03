
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // =====================================
  // 1. 신청 팝업
  // =====================================

  const modal = document.getElementById("applyDialog");
  const form = document.getElementById("applyForm");
  const message = document.getElementById("formMessage");

  const openButtons = document.querySelectorAll("[data-open]");
  const closeButton = document.getElementById("closeModal");

  function showMessage(text) {
    if (message) {
      message.textContent = text;
    }
  }

  if (modal) {
    openButtons.forEach(button => {
      button.addEventListener("click", () => {
        showMessage("");

        if (!modal.open) {
          modal.showModal();
        }
      });
    });

    closeButton?.addEventListener("click", () => {
      modal.close();
    });

    modal.addEventListener("click", event => {
      if (event.target !== modal) return;

      const rect = modal.getBoundingClientRect();

      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        modal.close();
      }
    });
  }

  // =====================================
  // 2. 지역 선택
  // =====================================

  const region = document.getElementById("region");
  const district = document.getElementById("district");
  const districtOther = document.getElementById("districtOther");

  const districtData = {
    "서울특별시": [
      "강남구", "강동구", "강북구", "강서구",
      "관악구", "광진구", "구로구", "금천구",
      "노원구", "도봉구", "동대문구", "동작구",
      "마포구", "서대문구", "서초구", "성동구",
      "성북구", "송파구", "양천구", "영등포구",
      "용산구", "은평구", "종로구", "중구", "중랑구"
    ],

    "경기도": [
      "고양시", "과천시", "광명시", "광주시",
      "구리시", "군포시", "김포시", "남양주시",
      "동두천시", "부천시", "성남시", "수원시",
      "시흥시", "안산시", "안성시", "안양시",
      "양주시", "여주시", "오산시", "용인시",
      "의왕시", "의정부시", "이천시", "파주시",
      "평택시", "포천시", "하남시", "화성시",
      "가평군", "양평군", "연천군"
    ],

    "인천광역시": [
      "강화군", "계양구", "남동구", "동구",
      "미추홀구", "부평구", "서구",
      "연수구", "옹진군", "중구"
    ],

    "부산광역시": [
      "강서구", "금정구", "기장군", "남구",
      "동구", "동래구", "부산진구", "북구",
      "사상구", "사하구", "서구", "수영구",
      "연제구", "영도구", "중구", "해운대구"
    ],

    "대구광역시": [
      "남구", "달서구", "달성군", "동구",
      "북구", "서구", "수성구", "중구", "군위군"
    ],

    "광주광역시": [
      "광산구", "남구", "동구", "북구", "서구"
    ],

    "대전광역시": [
      "대덕구", "동구", "서구", "유성구", "중구"
    ],

    "울산광역시": [
      "남구", "동구", "북구", "중구", "울주군"
    ],

    "세종특별자치시": ["세종시 전역"],

    "강원특별자치도": [
      "강릉시", "동해시", "삼척시", "속초시",
      "원주시", "춘천시", "태백시"
    ],

    "충청북도": ["제천시", "청주시", "충주시"],

    "충청남도": [
      "계룡시", "공주시", "논산시", "당진시",
      "보령시", "서산시", "아산시", "천안시"
    ],

    "전북특별자치도": [
      "군산시", "김제시", "남원시",
      "익산시", "전주시", "정읍시"
    ],

    "전라남도": [
      "광양시", "나주시", "목포시",
      "순천시", "여수시"
    ],

    "경상북도": [
      "경산시", "경주시", "구미시", "김천시",
      "문경시", "상주시", "안동시",
      "영주시", "영천시", "포항시"
    ],

    "경상남도": [
      "거제시", "김해시", "밀양시", "사천시",
      "양산시", "진주시", "창원시", "통영시"
    ],

    "제주특별자치도": ["서귀포시", "제주시"]
  };

  region?.addEventListener("change", () => {
    if (!district || !districtOther) return;

    district.replaceChildren(
      new Option("시/군/구", "")
    );

    district.disabled = !region.value;

    districtOther.hidden = true;
    districtOther.required = false;
    districtOther.value = "";

    if (!region.value) return;

    const items = districtData[region.value] || [];

    items.forEach(item => {
      district.add(new Option(item, item));
    });

    district.add(
      new Option("기타 지역 직접 입력", "other")
    );
  });

  district?.addEventListener("change", () => {
    if (!districtOther) return;

    const isOther = district.value === "other";

    districtOther.hidden = !isOther;
    districtOther.required = isOther;

    if (!isOther) {
      districtOther.value = "";
    }
  });

  // =====================================
  // 3. 휴대전화 자동 하이픈
  // =====================================

  const phone = document.getElementById("phone");

  phone?.addEventListener("input", () => {
    const digits = phone.value
      .replace(/\D/g, "")
      .slice(0, 11);

    if (digits.length <= 3) {
      phone.value = digits;
    } else if (digits.length <= 7) {
      phone.value =
        digits.slice(0, 3) + "-" +
        digits.slice(3);
    } else {
      phone.value =
        digits.slice(0, 3) + "-" +
        digits.slice(3, 7) + "-" +
        digits.slice(7);
    }
  });

  // =====================================
  // 4. 신청서 확인
  // =====================================

  form?.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name")
      ?.value.trim() || "";

    const digits = phone?.value
      .replace(/\D/g, "") || "";

    const regionValue = region?.value || "";
    const districtValue = district?.value || "";

    const districtCustom =
      districtOther?.value.trim() || "";

    const contact = document.getElementById("contact")
      ?.value || "";

    const privacy = document.querySelector(
      'input[name="privacyConsent"]:checked'
    )?.value;

    const marketing = document.querySelector(
      'input[name="marketingConsent"]:checked'
    )?.value || "no";

    const advertising = document.querySelector(
      'input[name="advertisingConsent"]:checked'
    )?.value || "no";

    if (!name) {
      showMessage("이름을 입력해 주세요.");
      return;
    }

    if (!/^01[016789]\d{7,8}$/.test(digits)) {
      showMessage("휴대전화번호를 확인해 주세요.");
      return;
    }

    if (!regionValue || !districtValue) {
      showMessage("활동 희망지역을 선택해 주세요.");
      return;
    }

    if (
      districtValue === "other" &&
      !districtCustom
    ) {
      showMessage("시/군/구를 입력해 주세요.");
      return;
    }

    if (!contact) {
      showMessage("상담 가능 시간을 선택해 주세요.");
      return;
    }

    if (privacy !== "yes") {
      showMessage(
        "필수 개인정보 수집·이용 동의가 필요합니다."
      );
      return;
    }

    if (
      advertising === "yes" &&
      marketing !== "yes"
    ) {
      showMessage(
        "광고성 정보 수신에 동의하려면 " +
        "마케팅 목적 개인정보 이용에도 동의해 주세요."
      );
      return;
    }

    // 실제 개인정보를 서버로 전송하지 않는 데모
    showMessage(
      "입력 내용이 확인되었습니다. " +
      "현재는 서버 미연결 상태로 실제 신청이 접수되지 않습니다."
    );
  });

  // =====================================
  // 5. 예상 수익 카드 A / B 선택
  // =====================================

  const examples = [
    { name: "A", value: "70만 원" },
    { name: "B", value: "182만 원" }
  ];

  document.querySelectorAll("[data-case]").forEach(button => {

    button.addEventListener("click", () => {
      const current =
        examples[Number(button.dataset.case)];

      if (!current) return;

      document.querySelectorAll("[data-case]").forEach(item => {
        const selected = item === button;

        item.classList.toggle("active", selected);
        item.setAttribute(
          "aria-pressed",
          String(selected)
        );
      });

      const incomeText =
        document.getElementById("selectedIncome");

      if (incomeText) {
        incomeText.textContent =
          `선택한 사례 ${current.name}의 예상 최대 수익은 약 ${current.value}입니다.`;
      }
    });
  });
  
// =====================================
// 약관 전체 동의 기능
// =====================================

const agreeAll = document.getElementById("agreeAll");

const consentNames = [
  "privacyConsent",
  "marketingConsent",
  "advertisingConsent"
];

// 전체 동의 선택/해제
agreeAll?.addEventListener("change", () => {
  consentNames.forEach((name) => {
    const target = document.querySelector(
      `input[name="${name}"][value="${agreeAll.checked ? "yes" : "no"}"]`
    );

    if (target) {
      target.checked = true;
    }
  });
});

// 개별 동의 변경 시 전체 동의 상태도 변경
document.querySelectorAll(
  'input[name="privacyConsent"],' +
  'input[name="marketingConsent"],' +
  'input[name="advertisingConsent"]'
).forEach((radio) => {
  radio.addEventListener("change", () => {
    if (!agreeAll) return;

    agreeAll.checked = consentNames.every((name) => {
      return document.querySelector(
        `input[name="${name}"][value="yes"]`
      )?.checked === true;
    });
  });
});

// =====================================
// 6. 예상 수익 팝업
// =====================================

const incomePopup = document.getElementById("incomePopup");
const incomePopupClose =
  document.getElementById("incomePopupClose");

const incomePopupCase =
  document.getElementById("incomePopupCase");

const incomePopupAmount =
  document.getElementById("incomePopupAmount");

const incomePopupReward =
  document.getElementById("incomePopupReward");

// 계약금액별 예상 수익
const incomePopupData = [
  {
    caseName: "A",
    amount: "500만 원",
    reward: "최대 약 70만 원"
  },
  {
    caseName: "B",
    amount: "1,300만 원",
    reward: "최대 약 182만 원"
  }
];

// 기존 예상 수익 카드 클릭 시 팝업 열기
document.querySelectorAll("#income [data-case]").forEach(card => {
  card.addEventListener("click", () => {
    if (!incomePopup) return;

    const index = Number(card.dataset.case);
    const data = incomePopupData[index];

    if (!data) return;

    incomePopupCase.textContent =
      `수익 예시 ${data.caseName}`;

    incomePopupAmount.textContent = data.amount;
    incomePopupReward.textContent = data.reward;

    if (!incomePopup.open) {
      incomePopup.showModal();
    }
  });
});

// 팝업 닫기
incomePopupClose?.addEventListener("click", () => {
  incomePopup.close();
});

// 팝업 바깥 클릭 시 닫기
incomePopup?.addEventListener("click", event => {
  if (event.target !== incomePopup) return;

  const rect = incomePopup.getBoundingClientRect();

  const outside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (outside) {
    incomePopup.close();
  }
});

// 수익 팝업에서 파트너 신청 버튼 클릭
incomePopup
  ?.querySelector(".income-popup-apply")
  ?.addEventListener("click", () => {
    incomePopup.close();

    const applyDialog = document.getElementById("applyDialog");

    if (applyDialog && !applyDialog.open) {
      applyDialog.showModal();
    }
  });


});

/* =====================================
   혜택 아이콘 애니메이션 한 번만 실행
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const benefitsSection = document.querySelector(".benefits");

  if (!benefitsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (!entry.isIntersecting) return;

      // 세 아이콘의 애니메이션 동시 시작
      benefitsSection.classList.add("animate-once");

      // 한 번 실행한 이후 다시 실행하지 않음
      observer.unobserve(benefitsSection);
    },
    {
      threshold: 0.25
    }
  );

  observer.observe(benefitsSection);
});

/* 예상 수익 카드 선택 */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".home-profit");
  if (!section) return;

  const result = section.querySelector(".home-profit__result");

  const profitData = {
    a: {
      name: "A",
      amount: "70만 원"
    },
    b: {
      name: "B",
      amount: "182만 원"
    }
  };

const cards = section.querySelectorAll(
  ".home-profit__card"
);

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.profit;
      const selected = profitData[key];

      if (!selected) return;

      cards.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });

      card.classList.add("is-active");
      card.setAttribute("aria-pressed", "true");

      if (!result) return;
      result.innerHTML = `
        선택한 사례 ${selected.name}의
        예상 최대 수익은 약
        <strong>${selected.amount}</strong>입니다.
      `;
    });
  });
});

/* 모바일 햄버거 메뉴 */

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("mobileMenuToggle");
  const nav = document.getElementById("primaryNav");

  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "메뉴 열기");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "메뉴 닫기" : "메뉴 열기"
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
});


/* 모바일 카드 가로 이동 - 터치는 브라우저 기본 스크롤, 마우스는 드래그 지원 */
document.addEventListener("DOMContentLoaded", () => {
 const sliders = document.querySelectorAll(
  "#benefits .three, #spaces .space-cards, #steps .steps-flow, #prepare .home-prepare__cards"
);
  const mobile = window.matchMedia("(max-width: 650px)");

  sliders.forEach((slider) => {
    slider.setAttribute("aria-label", "좌우로 넘겨 보는 카드 목록");
    slider.setAttribute("tabindex", "0");
    let down = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    // 휴대폰 터치는 기본 스와이프를 보존: preventDefault 호출하지 않음
    slider.addEventListener("pointerdown", (event) => {
      if (!(mobile.matches || (slider.matches("#spaces .space-cards") && window.matchMedia("(max-width: 1024px)").matches)) || event.pointerType !== "mouse" || event.button !== 0) return;
      down = true;
      moved = false;
      startX = event.clientX;
      startScroll = slider.scrollLeft;
      slider.classList.add("is-dragging");
    });
    slider.addEventListener("pointermove", (event) => {
      if (!down) return;
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 4) moved = true;
      slider.scrollLeft = startScroll - distance;
    });
    const finish = () => {
      down = false;
      slider.classList.remove("is-dragging");
    };
    slider.addEventListener("pointerup", finish);
    slider.addEventListener("pointercancel", finish);
    slider.addEventListener("pointerleave", finish);
    slider.addEventListener("click", (event) => {
      if (moved) { event.preventDefault(); moved = false; }
    }, true);

    slider.addEventListener("keydown", (event) => {
      if (!mobile.matches || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
    const card = slider.querySelector(
  ".feature, .space, .step, .home-prepare__card"
);
      const amount = card ? card.getBoundingClientRect().width + 14 : slider.clientWidth * .85;
      slider.scrollBy({left: (event.key === "ArrowRight" ? 1 : -1) * amount, behavior: "smooth"});
    });
  });
});

/* =====================================
   모바일 카드 스와이프 등장 애니메이션
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const sliders = [
    "#benefits .three",
    "#spaces .space-cards",
    "#steps .steps-flow"
  ];

  const mobile = window.matchMedia("(max-width: 650px)");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  sliders.forEach(selector => {
    const track = document.querySelector(selector);
    if (!track) return;

    const cards = Array.from(
      track.querySelectorAll(
        ".feature, .space, .step"
      )
    );

    if (!cards.length) return;

    let scheduled = false;

    function updateActive() {
      scheduled = false;

      if (!mobile.matches || reducedMotion.matches) {
        cards.forEach(card => {
          card.classList.add("is-current");
        });
        return;
      }

      const trackCenter =
        track.getBoundingClientRect().left +
        track.clientWidth / 2;

      let closestCard = cards[0];
      let closestDistance = Infinity;

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - trackCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestCard = card;
        }
      });

      cards.forEach(card => {
        card.classList.toggle(
          "is-current",
          card === closestCard
        );
      });
    }

    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateActive);
    }

    track.addEventListener("scroll", scheduleUpdate, {
      passive: true
    });

    window.addEventListener("resize", scheduleUpdate);
    mobile.addEventListener("change", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);

    updateActive();
  });
});

/* =====================================
   HOME 메인 자동 페이드 슬라이드
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const slides = Array.from(
    document.querySelectorAll(".hero-slide")
  );

  if (slides.length < 2) return;

  let currentIndex = 0;

  const slideDuration = 2000;

  function showSlide(nextIndex) {
    slides[currentIndex].classList.remove("is-active");

    currentIndex = nextIndex;

    slides[currentIndex].classList.add("is-active");
  }

  // 탭이 보이지 않을 때 불필요한 전환 방지
  const slideTimer = setInterval(() => {
    if (document.hidden) return;

    const nextIndex =
      (currentIndex + 1) % slides.length;

    showSlide(nextIndex);

  }, slideDuration);

});


/* 공통 가로 스와이프 - 좌우 이동 화살표 */
document.addEventListener("DOMContentLoaded", () => {
  const configs = [
    { id: "benefitsSlider", breakpoint: 1024 },
    { id: "spacesSlider", breakpoint: 1024 },
    { id: "stepsSlider", breakpoint: 650 },
    { id: "prepareSlider", breakpoint: 650 }
  ];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  configs.forEach(({ id, breakpoint }) => {
    const track = document.getElementById(id);
    const wrapper = track?.closest(".swipe-wrapper");
    const prev = wrapper?.querySelector(".swipe-prev");
    const next = wrapper?.querySelector(".swipe-next");
    if (!track || !wrapper || !prev || !next) return;

    const active = () => window.innerWidth <= breakpoint;
    const cards = () => [...track.children].filter(el =>
      el.matches(".feature, .space, .step, .home-prepare__card")
    );
    function positions() {
      const nodes = cards();
      if (!nodes.length) return [];
      const base = nodes[0].offsetLeft;
      return nodes.map(el => el.offsetLeft - base);
    }
    function updateButtons() {
      const enabled = active() && track.scrollWidth > track.clientWidth + 3;
      const atStart = track.scrollLeft <= 3;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 3;
      prev.hidden = !enabled || atStart;
      next.hidden = !enabled || atEnd;
      prev.disabled = atStart;
      next.disabled = atEnd;
    }
    function move(direction) {
      const x = track.scrollLeft;
      const stops = positions();
      const target = direction > 0
        ? stops.find(n => n > x + 5)
        : stops.slice().reverse().find(n => n < x - 5);
      const fallback = direction > 0 ? track.scrollWidth : 0;
      track.scrollTo({left: target ?? fallback,
        behavior: reduced.matches ? "instant" : "smooth"});
    }
    prev.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    track.addEventListener("scroll", updateButtons, {passive:true});
    window.addEventListener("resize", updateButtons);
    requestAnimationFrame(updateButtons);
  });
});

/* 브라우저 주소창 숨김 시 모바일 표지 재배치 방지 */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  let lastWidth = -1;
  const apply = () => {
    const width = document.documentElement.clientWidth;
    if (width > 650) {
      hero.style.removeProperty("--mobile-hero-height");
      lastWidth = width;
      return;
    }
    if (width === lastWidth) return;
    lastWidth = width;
    const headerHeight = document.querySelector(".top")?.getBoundingClientRect().height || 62;
    hero.style.setProperty("--mobile-hero-height", `${Math.max(420, window.innerHeight - headerHeight)}px`);
  };
  apply();
  window.addEventListener("resize", apply);
});


/* ============================================================
   스크롤 양방향 반복 등장 애니메이션
   화면에 진입할 때 재생, 완전히 벗어나면 다음 진입을 위해 초기화
   배경 페이드·가로 스와이프·고정 버튼에는 영향을 주지 않음
============================================================ */
(() => {
  const startReveal = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    const groups = [
      ['#prepare', ['.home-prepare__heading', '.home-prepare__slider']],
      ['#home-reason', ['.home-reason__left', '.home-reason__right']],
      ['#home-connect', ['.home-connect__left', '.home-connect__right']],
      ['.intro.intro-motion', ['.intro-copy', '.intro-logo-stage']],
      ['#benefits', ['.section-heading', '.swipe-wrapper']],
      ['#spaces', ['.section-heading', '.swipe-wrapper']],
      ['#steps', ['.steps-heading', '.swipe-wrapper']],
      ['#profit', ['.home-profit__left', '.home-profit__right']],
      ['#faq', ['.home-faq-heading', '.home-faq-list']],
      ['.closing', ['.closing-grid > *']]
    ];

    const entries = new Map();
    for (const [sectionSelector, selectors] of groups) {
      const section = document.querySelector(sectionSelector);
      if (!section) continue;
      const targets = [...new Set(selectors.flatMap(selector =>
        Array.from(section.querySelectorAll(selector))))];
      if (!targets.length) continue;
      targets.forEach((element, index) => {
        element.classList.add('home-reveal-item');
        element.style.setProperty('--home-reveal-delay', `${Math.min(index, 3) * 160}ms`);
      });
      entries.set(section, targets);
    }
    if (!entries.size) return;

    // 반복 진입/이탈을 모두 관찰. 화면 상·하단 10%는 전환 완충 영역.
    // completely exited 상태가 되어야 초기화되므로 경계에서 깜빡이지 않음.
    const observer = new IntersectionObserver(observations => {
      for (const observation of observations) {
        const targets = entries.get(observation.target);
        if (!targets) continue;
        for (const element of targets) {
          element.classList.toggle('is-revealed', observation.isIntersecting);
        }
      }
    }, {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0
    });

    // 초기 화면에 보이는 섹션이 갑자기 숨겨졌다 등장하지 않도록 미리 표시.
    for (const [section, targets] of entries) {
      const rect = section.getBoundingClientRect();
      const inset = window.innerHeight * 0.1;
      if (rect.top < window.innerHeight - inset && rect.bottom > inset) {
        targets.forEach(element => element.classList.add('is-revealed'));
      }
    }
    document.documentElement.classList.add('home-reveal-ready');
    entries.forEach((_, section) => observer.observe(section));
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startReveal, {once: true});
  } else {
    startReveal();
  }
})();
