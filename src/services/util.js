import mathjs from "mathjs";

/**图片放大预览start */
let previewImage = function(url) {
  this.$alert('<img src="' + url + '" style="max-width:90vw;max-height:85vh;"/>', {
    dangerouslyUseHTMLString: true,
    showConfirmButton: false,
    closeOnClickModal: true,
    showClose: true,
    center: true,
    customClass: "el-message-preview-box",
    callback: () => {
      console.log("关闭预览");
    }
  });
};
/**图片放大预览end */

/**文件下载 start*/
let downloadFile = function(sUrl) {
  //iOS devices do not support downloading. We have to inform user about this.
  if (/(iP)/g.test(navigator.userAgent)) {
    alert("Your device does not support files downloading. Please try again in desktop browser.");
    return false;
  }

  //If in Chrome or Safari - download via virtual link click
  if (downloadFile.isChrome || downloadFile.isSafari || downloadFile.isFirefox) {
    //Creating new link node.
    var link = document.createElement("a");
    // var fileName = sUrl.substring(sUrl.lastIndexOf("/") + 1, sUrl.length);
    // var filePath = sUrl.substring(0, sUrl.lastIndexOf("/") + 1);
    link.href = encodeURI(sUrl);
    // link.href = encodeURIComponent(sUrl);
    // link.href = sUrl;
    // link.href = encodeURI(filePath) + encodeURIComponent(fileName);
    link.target = "_blank";

    if (link.download !== undefined) {
      //Set HTML5 download attribute. This will prevent file from opening if supported.
      var fileName = sUrl.substring(sUrl.lastIndexOf("/") + 1, sUrl.length);
      link.download = fileName;
    }

    //Dispatching click event.
    if (document.createEvent) {
      var e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      link.dispatchEvent(e);
      return true;
    }
  }

  // Force file download (whether supported by server).
  if (sUrl.indexOf("?") === -1) {
    sUrl += "?download";
  }

  window.open(sUrl, "_self");
  return true;
};
downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf("safari") > -1;
downloadFile.isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
/**文件下载 end*/

/**金额格式化、千分位、包括保留指定小数
 * @param {*} number 数字
 * @param {*} places 小数后几位
 * @param {*} symbol 货币符号  $
 * @param {*} thousand 千分位符号   ,
 * @param {*} decimal 小数点符号   .
 */
let formatNumber = function(number, places, symbol, thousand, decimal) {
  // console.log('number',number)
  number = number || 0;
  places = !isNaN((places = Math.abs(places))) ? places : 2;
  symbol = symbol !== undefined ? symbol : "¥";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var negative = number < 0 ? "-" : "",
    i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + thousand : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
    (places
      ? decimal +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : "")
  );
};

let getImageWH = file => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    let url = "";
    if (typeof file == "string") {
      url = file;
    } else {
      url = URL.createObjectURL(file);
    }
    img.src = url;
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = err => {
      reject(err);
    };
  });
};

/**常用正则表达式 */
let constReg = {
  //电子邮箱
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  //手机号码 11位
  phone: /^((1[358][0-9])|(14[57])|(17[0678])|(19[7]))\d{8}$/,
  //中文、英文、数字、空白字符
  cnenName: /^[\u4e00-\u9fa5a-zA-Z0-9\s+]+$/,
  //中文、英文、数字、_-
  cnenName1: /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/,
  cnenName2: /^[\u4e00-\u9fa5a-zA-Z0-9][\u4e00-\u9fa5a-zA-Z0-9_-]{1,19}$/,
  cnenName3: /^[\u4e00-\u9fa5a-zA-Z&]+$/,
  cnenName4: /^[\u4e00-\u9fa5a-zA-Z0-9\_\-\(\)\（\）\.\/\、\&\s+]+$/,
  //支持英文、数字、下划线、中划线，首位必须是字母，长度最少2位最多20位
  name: /^[a-zA-Z][a-z0-9A-Z_-]{1,}$/,
  //大写英文字母
  uppercaseEn: /^[A-Z]+$/,
  //英文字母、数字、特殊字符(!-+*@#$.)，中的至少2种组合。8位到20位
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![!_\-+*@#$.]+$)[0-9A-Za-z!_\-+*@#$.]{8,20}$/,

  name1: /^[a-zA-Z0-9\u4E00-\u9FA5_\(\)（）\.。，,$-—]{1,150}$/, //名称为数字、英文、中文、下划线 150个字符以内
  name2: /^[\u4E00-\u9FA5A-Za-z0-9\_\-\(\)\（\）\.\/\、\&\s+]{1,50}$/, //数字，英文，中文、中划线、下划线、括号、空格、.、/ 30个字符以内
  num: /^([1-9][0-9]*)(\.[0-9]{1,2})?$/, //正整数、最多保留2位小数。
  num4: /^([1-9][0-9]*)(\.[0-9]{1,4})?$/, //正整数、最多保留2位小数。
  num23: /^(0|([1-9][0-9]*))(\.[0-9]{1,3})?$/, //正整数、最多保留3位小数。
  num2: /^(0|-?([1-9][0-9]*))(\.[0-9]{1,2})?$/, //负整数,正整数、最多保留2位小数。
  num3: /^(0(\.\d{1,4})?|1(\.0{1,4})?)$/, //0到1之间的小数，最多4位小数，包括0和1
  
  positiveInt: /^[1-9]\d*$/, //匹配正整数
  nonnegativeInt: /^([1-9][0-9]*|0)$/, //非负整数
  chinese: /^[\u4e00-\u9fa5]+$/,
  english: /^[A-Za-z]+$/,
  //  /^\+?[1-9][0-9]*$/

  //URL规则：
  //(1)、地址必须以http/https/ftp/ftps开头；
  //(2) 、地址不能包含双字节符号或非链接特殊字符
  url: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/ //
};

/**使用mathjs 重写toFixed方法 */
Number.prototype.toFixed = function(d) {
  return mathjs.format(this, { notation: "fixed", precision: d });
};

//日期插件快捷键
let datePickerShortcuts = [
  {
    text: "昨天",
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "近三天",
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
      end.setTime(end.getTime());
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "近七天",
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      end.setTime(end.getTime());
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "近一个月",
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      end.setTime(end.getTime());
      picker.$emit("pick", [start, end]);
    }
  }
];
//后代组件  对父组件发送事件
let dispatch = function(componentName, eventName, params) {
  var parent = this.$parent || this.$root;
  var name = parent.$options.componentName;

  //寻找父级，如果父级不是符合的组件名，则循环向上查找
  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;

    if (parent) {
      name = parent.$options.componentName;
    }
  }
  //找到符合组件名称的父级后，触发其事件。整体流程类似jQuery的closest方法
  if (parent) {
    parent.$emit.apply(parent, [eventName].concat(params));
  }
};

//事件广播  父组件向 后代组件 
let broadcast = function(componentName, eventName, params) {
  broadcast.call(this, componentName, eventName, params);
  function broadcast(componentName, eventName, params) {
    //遍历所有子组件
    this.$children.forEach(child => {
      var name = child.$options.componentName;
      //寻找符合指定名称的子组件
      if (name === componentName) {
        //在符合的自组件上触发的事件，但是不会再继续寻找符合名称的组件的子集，原因？
        child.$emit.apply(child, [eventName].concat(params));
      } else {
        //不符合继续寻找他的子集（即孙子组件）
        broadcast.apply(child, [componentName, eventName].concat([params]));
      }
    });
  }
};
let encodeB64 = function ( str ) {
  return window.btoa(unescape(encodeURIComponent( str )));
}
let decodeB64 = function ( str ) {
  return decodeURIComponent(escape(window.atob( str )));
}
//作为插件必须定义公开的 install 方法
export default function install(Vue, options) {
  Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue();
  Vue.encodeB64 = Vue.prototype.$encodeB64 = encodeB64;
  Vue.decodeB64 = Vue.prototype.$decodeB64 = decodeB64;
  Vue.getImageWH = Vue.prototype.$getImageWH = getImageWH;
  Vue.dispatch = Vue.prototype.$dispatch = dispatch;
  Vue.broadcast = Vue.prototype.$broadcast = broadcast;
  Vue.previewImage = Vue.prototype.$previewImage = previewImage;
  Vue.downloadFile = Vue.prototype.$downloadFile = downloadFile;
  Vue.formatNumber = Vue.prototype.$formatNumber = formatNumber;
  Vue.constReg = Vue.prototype.$constReg = constReg;
  Vue.datePickerShortcuts = Vue.prototype.$datePickerShortcuts = datePickerShortcuts;
  Vue.directive("focus", {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function(el) {
      el.focus();
    },
    update: function(el, { value }) {
      if (value) {
        el.focus();
      }
    }
  });
}
