import * as uData from '$utils/userData';

window.Webflow ||= [];
window.Webflow.push(() => {
  const uEmail = document.querySelector('userdata')?.getAttribute('uemail');
  if (!uEmail) return;
  const data = uData.retrieveData('oocUser', uEmail);
  console.log(data);
});
