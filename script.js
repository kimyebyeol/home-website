alert("새 script.js가 연결됐어요");
(() => {
  // 실제 신청 저장 API 주소를 입력하세요.
  const APPLY_API_URL = "https://script.google.com/macros/s/AKfycbyuxcKXjMxL16gHen3yV3BWBBWZTZeEFsqsfrktsaK1MKss6OgclgUJ0sYgcBp09n6BYw/exec";

  function initApplyForm() {
    const dialog = document.getElementById("applyDialog");
    const form = document.getElementById("partnerForm");
    const statusEl = document.getElementById("formStatus");
    const closeButton = document.getElementById("closeDialog");

    if (!dialog || !form || !statusEl || !closeButton) return;

    const nameInput = document.getElementById("applicantName");
    const phoneInput = document.getElementById("applicantPhone");
    const regionInput = document.getElementById("applicantRegion");
    const contactTimeInput = document.getElementById(
      "applicantContactTime"
    );
    const submitButton = form.querySelector('[type="submit"]');

    if (!nameInput || !phoneInput || !submitButton) return;
    // 휴대전화번호 하이픈 자동 입력
phoneInput.addEventListener("input", () => {
  const digits = phoneInput.value
    .replace(/\D/g, "")
    .slice(0, 11);

  if (digits.length <= 3) {
    phoneInput.value = digits;
  } else if (digits.length <= 7) {
    phoneInput.value =
      digits.slice(0, 3) + "-" + digits.slice(3);
  } else {
    phoneInput.value =
      digits.slice(0, 3) + "-" +
      digits.slice(3, 7) + "-" +
      digits.slice(7);
  }
});

    let lastFocusedElement = null;
    let isSubmitting = false;
    let isCompleted = false;

    // 응답이 끊긴 뒤 재시도할 때 중복 저장 방지에 사용합니다.
    let pendingRequest = null;

    function getChoice(name) {
      return form.querySelector(
        `input[name="${name}"]:checked`
      )?.value || "no";
    }

    function setStatus(message, isError = false) {
      statusEl.textContent = message;
      statusEl.style.color = isError ? "#b33d32" : "#70583f";
    }

    function showError(message, target) {
      setStatus(message, true);
      target?.focus();
    }

    // 브라우저 기본 검사는 submit 처리 안에서 실행합니다.
    form.noValidate = true;

    form.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.setCustomValidity("");
    });

    // 팝업 열기
    document.querySelectorAll("[data-open-apply]").forEach((button) => {
      button.addEventListener("click", () => {
        lastFocusedElement = document.activeElement;

        if (isCompleted) {
          form.reset();
          isCompleted = false;
          pendingRequest = null;
          submitButton.disabled = false;
          submitButton.textContent = "신청 완료";
          setStatus("");
        } else if (!isSubmitting) {
          setStatus("");
        }

        if (!dialog.open) {
          dialog.showModal();
        }
      });
    });

    // 팝업 닫기
    closeButton.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const outside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (outside) dialog.close();
    });

    dialog.addEventListener("close", () => {
      lastFocusedElement?.focus();
    });

    function clearStatus() {
      if (!isSubmitting && !isCompleted) setStatus("");
    }

    form.addEventListener("input", clearStatus);
    form.addEventListener("change", clearStatus);

    // 신청 전송
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (isSubmitting || isCompleted) return;

      setStatus("");

      if (!form.reportValidity()) return;

      const applicantName = nameInput.value.trim();
      const phone = phoneInput.value.replace(/[\s-]/g, "");
      const region = regionInput?.value.trim() || "";
      const contactTime = contactTimeInput?.value.trim() || "";

    if (!/^[가-힣]{2,20}$/.test(applicantName)) {
  showError(
    "이름은 한글로 2~20자 입력해 주세요. 숫자, 영문, 특수문자는 사용할 수 없습니다.",
    nameInput
  );
  return;
}

      if (!/^01[016789]\d{7,8}$/.test(phone)) {
        showError(
          "휴대전화번호를 확인해 주세요. 예: 010-1234-5678",
          phoneInput
        );
        return;
      }

      if (getChoice("privacy") !== "yes") {
        showError(
          "필수 개인정보 수집·이용에 동의해야 신청할 수 있습니다.",
          form.querySelector('input[name="privacy"][value="yes"]')
        );
        return;
      }

      const optionalPrivacy = getChoice("optionalPrivacy") === "yes";

  

      if (!APPLY_API_URL.trim()) {
        setStatus(
          "현재 신청 접수 기능을 준비 중입니다. 입력한 정보는 전송·저장되지 않았습니다.",
          true
        );
        return;
      }

      const payload = {
        name: applicantName,
        phone,
       region,
contactTime,
        privacy: true,
        optionalPrivacy,
        marketing: getChoice("marketing") === "yes",
        advertising: getChoice("advertising") === "yes"
      };

      const fingerprint = JSON.stringify(payload);

      if (!pendingRequest || pendingRequest.fingerprint !== fingerprint) {
        pendingRequest = {
          fingerprint,
          requestId: crypto.randomUUID()
        };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      // 전송 중 입력값 변경·중복 클릭 방지
      const controls = Array.from(form.elements);
      const previousDisabled = controls.map((control) => control.disabled);

      isSubmitting = true;
      form.setAttribute("aria-busy", "true");
      controls.forEach((control) => {
        control.disabled = true;
      });

      submitButton.textContent = "신청 중…";
      setStatus("신청 정보를 전송하고 있습니다.");

      try {
        const response = await fetch(APPLY_API_URL, {
          method: "POST",
          headers: {
           "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({
            ...payload,
            requestId: pendingRequest.requestId
          }),
          signal: controller.signal
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          setStatus(
            "신청 처리가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.",
            true
          );
          return;
        }

        // 서버가 실제 저장 후 반환한 결과인지 확인
        if (
          result?.success !== true ||
          typeof result?.applicationId !== "string" ||
          !result.applicationId.trim()
        ) {
          setStatus(
            "접수 결과를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
            true
          );
          return;
        }

        isCompleted = true;
        pendingRequest = null;
        form.reset();

        setStatus(
          "신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다."
        );
      } catch (error) {
        setStatus(
          error.name === "AbortError"
            ? "응답 시간이 초과되어 접수 여부를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요."
            : "서버 응답을 받지 못해 접수 여부를 확인하지 못했습니다. 연결 상태를 확인한 후 다시 시도해 주세요.",
          true
        );
      } finally {
        clearTimeout(timeoutId);
        isSubmitting = false;
        form.removeAttribute("aria-busy");

        controls.forEach((control, index) => {
          control.disabled = previousDisabled[index];
        });

        submitButton.disabled = isCompleted;
        submitButton.textContent = isCompleted
          ? "신청 접수 완료"
          : "신청 완료";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApplyForm, {
      once: true
    });
  } else {
    initApplyForm();
  }
})();