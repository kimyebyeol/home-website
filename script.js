// 지원 버튼 → 개인정보 동의 팝업. 실제 저장 API는 아직 연결되지 않았습니다.
const dialog = document.getElementById('applyDialog');
const form = document.getElementById('partnerForm');
const statusEl = document.getElementById('formStatus');
const openButtons = document.querySelectorAll('[data-open-apply]');
const closeButton = document.getElementById('closeDialog');
let lastFocusedElement = null;

openButtons.forEach(button => button.addEventListener('click', () => {
  lastFocusedElement = document.activeElement;
  statusEl.textContent = '';
  dialog.showModal();
}));
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => lastFocusedElement?.focus());

form.addEventListener('submit', async event => {
  event.preventDefault();
  statusEl.textContent = '';
  const choice = form.elements.privacy.value;
  if (choice !== 'yes') {
    statusEl.textContent = '필수 개인정보 수집·이용에 동의해야 신청할 수 있습니다.';
    return;
  }
  const phone = document.getElementById('applicantPhone').value.replace(/[\s-]/g, '');
  const name = document.getElementById('applicantName').value.trim();
  if (name.length < 2 || !/^01[016789]\d{7,8}$/.test(phone)) {
    statusEl.textContent = '성명과 휴대전화번호를 확인해 주세요.';
    return;
  }
  // 보안상의 이유로 현재는 개인정보를 다른 곳으로 전송하지 않습니다.
  // 실제 운영 시 HTTPS 서버 API, CAPTCHA/요청 제한, 서버 측 검증을 추가해야 합니다.
  // API가 준비된 뒤 POST 연동을 수행하고 서버가 성공했다고 응답할 때만 완료 문구를 표시하세요.
  statusEl.textContent = '신청 화면은 준비되었지만 서버가 아직 연결되지 않았습니다. 개인정보는 전송·저장되지 않았습니다.';
});
