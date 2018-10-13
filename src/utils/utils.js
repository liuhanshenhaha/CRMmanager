/*
 *@title 工具方法
 *@list
 *	getCookie(name)	name: String 需要的cookie名
 *	setCookie(c_name, value, expiredays)	c_name:需要设置的cookie名,value:需要设置的cookie值,expiredays:需要设置的cookie有效期(单位天)
 *	delCookie(name)	name: String 需要删除的cookie名
 */

export function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return (arr[2]);
	else
		return null;
}

export function setCookie(c_name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

export function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};