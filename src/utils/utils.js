/*
 *@title 工具方法
 *@list
 *	getCookie(name)	name: String 需要的cookie名
 *	setCookie(c_name, value, expiredays)	c_name:需要设置的cookie名,value:需要设置的cookie值,expiredays:需要设置的cookie有效期(单位天)
 *	delCookie(name)	name: String 需要删除的cookie名
 *	getQueryStringByName(name)	name: String 需要获取的url参数名
 *	dateFormat(date, pattern) 格式化日期 date:日期对象，pattern:格式化模板 默认 yyyy-MM-dd
 */
import {accountQuest} from "../api/api"

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

export function getQueryStringByName(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
};

let SIGN_REGEXP = /([yMdhsm])(\1*)/g;
let DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};
export function dateFormat(date, pattern) {
    pattern = pattern || DEFAULT_PATTERN;
    return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
            case 'y': return padding(date.getFullYear(), $0.length);
            case 'M': return padding(date.getMonth() + 1, $0.length);
            case 'd': return padding(date.getDate(), $0.length);
            case 'w': return date.getDay() + 1;
            case 'h': return padding(date.getHours(), $0.length);
            case 'm': return padding(date.getMinutes(), $0.length);
            case 's': return padding(date.getSeconds(), $0.length);
        }
    });
}

export function formatters(type,value){
    let dictionary = localStorage.dictionary && JSON.parse(localStorage.dictionary);
    switch(type){
        case "date": return dateFormat(value);
        default: return dictionary[type] ? dictionary[type][value] : value;
    }
}

export function buildOptions(type,hasAll){
    let dictionary = localStorage.dictionary && JSON.parse(localStorage.dictionary),
        options = Object.keys(dictionary[type]).map(item => ({value:isNaN(Number(item)) ? item : Number(item),label:dictionary[type][item]}))
    if(hasAll){
        options.unshift({value:"",label:"全部"})
    }
    return options;
}

export function getAgentOptions(_this,id,value){
    id = id ? id : id === 0 ? id : ""
    value = value || []
    value.map((item,index) => {
        _this.options.map((itm,idx) => {
            if(item === itm.value){
                _this.cascade[index] = idx;
            }
        })
    })
    let pushChild = (oldOptions,newOptions) => {
        for(let i = 0;i < oldOptions.length;i++){
            if(value[value.length - 1] === oldOptions[i].value){
                oldOptions[i].children = newOptions;
                break;
            }
            if(oldOptions[i].children && oldOptions[i].children.length > 1){
                pushChild(newOptions)
            }
        }
    }
    accountQuest.selectAgentOptionByParent({
        superiorUserId: id
    }).then(res => {
        let tempOptions = [];
        tempOptions = res.content.map(item => {
            return {
                label: item.name,
                value: item.id,
                children: [{
                    label: "直属",
                    value: "straight"
                }]
            }
        })
        tempOptions.unshift({
            label: "直属",
            value: "straight"
        })
        if(_this.cascade.length === 0){
            _this.options = tempOptions
        }else{
            pushChild(_this.options,tempOptions)
        }
    }).catch(error => 
        console.error("获取代理级联信息失败",error)
    )
}