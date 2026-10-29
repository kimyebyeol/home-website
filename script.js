
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
