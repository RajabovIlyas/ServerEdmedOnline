import { IMailUser } from '../interfaces/mail-user.interface';

export const htmlMessageAuthorization = (url: string, user: IMailUser) => {
  return (
    `<div style="text-align: center">` +
    `<p>Здравствуйте, ${user.firstName + ' ' + user.lastName}<br/>` +
    'Благодарим Вас за регистрацию на сайте <a href="https://edmed.online">edmed.online</a><br/>' +
    'Чтобы завершить регистрацию, перейдите по ссылке:<br/>' +
    `${url}/auth/check_key/${user._id}</p></div>`
  );
};
