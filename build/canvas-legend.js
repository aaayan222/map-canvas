(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Legend = factory());
}(this, (function () { 'use strict';

/**
 * 新建canvas
 * 
 * @param {number} width 宽
 * @param {number} height 高
 */
function Canvas(width, height) {
    var canvas;
    if (typeof document === 'undefined') {
        // var Canvas = require('canvas');
        // canvas = new Canvas(width, height);
    } else {
        var canvas = document.createElement('canvas');
        if (width) {
            canvas.width = canvas.style.width = width;
        }
        if (height) {
            canvas.height = canvas.style.height = height;
        }
    }
    return canvas;
}

/**
 * 颜色工具类
 * @date 2017-06-28
 */
function ColorUtil() {
    this.startColor = '#ffffff';
    this.endColor = '#4CE35B';
    this.step = 5;
}

/**
 * @description 将rgb表示方式转换为hex表示方式("rgb(21,12,150)")或者（[21,12,150])
 * @param {string} 返回rgb颜色值 
 * @returns 返回hex颜色值
 */
ColorUtil.prototype.rgb2hex = function (rgb) {
    var _this = rgb;
    var strHex = "#";
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (Object.prototype.toString.call(_this) === '[object Array]') {
        for (var i = 0; i < _this.length; i++) {
            var hex = Number(_this[i]).toString(16);
            hex = hex < 10 ? 0 + '' + hex : hex; // 保证每个rgb的值为2位
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = _this;
        }
        return strHex;
    } else if (/^(rgb|RGB)/.test(_this)) {
        var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, "").split(",");
        strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            hex = hex < 10 ? 0 + '' + hex : hex; // 保证每个rgb的值为2位
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = _this;
        }
        return strHex;
    } else if (reg.test(_this)) {
        var aNum = _this.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return _this;
        } else if (aNum.length === 3) {
            strHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += aNum[i] + aNum[i];
            }
            return numHex;
        }
    } else {
        return _this;
    }
};

/**
 * @description 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
 * @param {string} hex 颜色值
 * @returns 返回rgb数组模式
 */
ColorUtil.prototype.hex2rgb = function (hex) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var hex = hex.toLowerCase();
    if (hex && reg.test(hex)) {
        if (hex.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += hex.slice(i, i + 1).concat(hex.slice(i, i + 1));
            }
            hex = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + hex.slice(i, i + 2)));
        }
        return sColorChange;
    } else {
        return hex;
    }
};

/**
 * @description 获取一组渐变色('#1abc9c','#333fff',5)
 * @param {string} startColor 起始颜色
 * @param {string} endColor   结束颜色
 * @param {number} step       分段数
 * @returns 返回渐变颜色数组
 */
ColorUtil.prototype.getGradientColor = function (startColor, endColor, step) {
    startColor = startColor || this.startColor;
    endColor = endColor || this.endColor;
    step = step || this.step;

    var startRGB = this.hex2rgb(startColor); //转换为rgb数组模式
    var startR = startRGB[0];
    var startG = startRGB[1];
    var startB = startRGB[2];

    var endRGB = this.hex2rgb(endColor);
    var endR = endRGB[0];
    var endG = endRGB[1];
    var endB = endRGB[2];

    var sR = (endR - startR) / step; //总差值
    var sG = (endG - startG) / step;
    var sB = (endB - startB) / step;

    var colorArr = [];
    for (var i = 0; i < step; i++) {
        //计算每一步的hex值
        var hex = this.rgb2hex([parseInt(sR * i + startR), parseInt(sG * i + startG), parseInt(sB * i + startB)]);
        colorArr.push(hex);
    }
    return colorArr;
};

var Legend = function Legend(id, options) {
    var width = window.innerWidth,
        height = window.innerHeight,
        canvas = new Canvas(width, height),
        context = canvas.getContext('2d');

    document.getElementById(id).appendChild(canvas);

    function Rect(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 10;
        this.color = color;

        this.clickEvent = this.clickEvent.bind(this);
        this.bindEvent();
    }

    Rect.prototype.clickEvent = function (e) {
        if (e.x >= this.x && e.x <= this.x + this.width && e.y >= this.y && e.y <= this.y + this.height) {
            alert('你点中了');
        }
    };

    Rect.prototype.bindEvent = function (e) {
        canvas.addEventListener('click', this.clickEvent);
    };

    var colorUtil = new ColorUtil();

    var colorArr = colorUtil.getGradientColor(options.startColor, options.endColor, options.step);

    for (var i = 0, len = colorArr.length; i < len; i++) {
        var color = colorArr[i];
        var gap = 15;
        var rect = new Rect(width / 2, height / 2 + 15 * i, color);
        drawRect(rect);
    }

    function drawRect(rect) {
        context.save();
        context.beginPath();
        context.fillStyle = rect.color;
        context.fillRect(rect.x, rect.y, 20, 10);
        context.closePath();
        context.restore();
    }
};

return Legend;

})));
