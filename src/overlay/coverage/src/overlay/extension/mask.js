function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/overlay/extension/mask.js']) {
  _$jscoverage['/overlay/extension/mask.js'] = {};
  _$jscoverage['/overlay/extension/mask.js'].lineData = [];
  _$jscoverage['/overlay/extension/mask.js'].lineData[6] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[7] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[12] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[13] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[15] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[16] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[19] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[20] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[23] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[24] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[48] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[49] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[50] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[52] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[59] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[62] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[97] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[100] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[101] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[103] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[104] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[106] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[110] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[112] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[114] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[116] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[117] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[120] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[126] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[128] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[130] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[132] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[133] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[137] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[138] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[141] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[142] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[143] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[144] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[147] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[150] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[152] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[153] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[154] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[159] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[162] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[163] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[164] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[165] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[167] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[172] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[173] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[174] = 0;
  _$jscoverage['/overlay/extension/mask.js'].lineData[179] = 0;
}
if (! _$jscoverage['/overlay/extension/mask.js'].functionData) {
  _$jscoverage['/overlay/extension/mask.js'].functionData = [];
  _$jscoverage['/overlay/extension/mask.js'].functionData[0] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[1] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[2] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[3] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[4] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[5] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[6] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[7] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[8] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[9] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[10] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[11] = 0;
  _$jscoverage['/overlay/extension/mask.js'].functionData[12] = 0;
}
if (! _$jscoverage['/overlay/extension/mask.js'].branchData) {
  _$jscoverage['/overlay/extension/mask.js'].branchData = {};
  _$jscoverage['/overlay/extension/mask.js'].branchData['9'] = [];
  _$jscoverage['/overlay/extension/mask.js'].branchData['9'][1] = new BranchData();
  _$jscoverage['/overlay/extension/mask.js'].branchData['103'] = [];
  _$jscoverage['/overlay/extension/mask.js'].branchData['103'][1] = new BranchData();
  _$jscoverage['/overlay/extension/mask.js'].branchData['112'] = [];
  _$jscoverage['/overlay/extension/mask.js'].branchData['112'][1] = new BranchData();
  _$jscoverage['/overlay/extension/mask.js'].branchData['116'] = [];
  _$jscoverage['/overlay/extension/mask.js'].branchData['116'][1] = new BranchData();
  _$jscoverage['/overlay/extension/mask.js'].branchData['143'] = [];
  _$jscoverage['/overlay/extension/mask.js'].branchData['143'][1] = new BranchData();
  _$jscoverage['/overlay/extension/mask.js'].branchData['153'] = [];
  _$jscoverage['/overlay/extension/mask.js'].branchData['153'][1] = new BranchData();
  _$jscoverage['/overlay/extension/mask.js'].branchData['164'] = [];
  _$jscoverage['/overlay/extension/mask.js'].branchData['164'][1] = new BranchData();
}
_$jscoverage['/overlay/extension/mask.js'].branchData['164'][1].init(72, 17, 'mask.closeOnClick');
function visit26_164_1(result) {
  _$jscoverage['/overlay/extension/mask.js'].branchData['164'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/extension/mask.js'].branchData['153'][1].init(48, 16, 'self.get(\'mask\')');
function visit25_153_1(result) {
  _$jscoverage['/overlay/extension/mask.js'].branchData['153'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/extension/mask.js'].branchData['143'][1].init(79, 16, '!isNaN(elZIndex)');
function visit24_143_1(result) {
  _$jscoverage['/overlay/extension/mask.js'].branchData['143'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/extension/mask.js'].branchData['116'][1].init(100, 15, 'effect === NONE');
function visit23_116_1(result) {
  _$jscoverage['/overlay/extension/mask.js'].branchData['116'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/extension/mask.js'].branchData['112'][1].init(25, 19, 'mask.effect || NONE');
function visit22_112_1(result) {
  _$jscoverage['/overlay/extension/mask.js'].branchData['112'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/extension/mask.js'].branchData['103'][1].init(124, 5, 'shown');
function visit21_103_1(result) {
  _$jscoverage['/overlay/extension/mask.js'].branchData['103'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/extension/mask.js'].branchData['9'][1].init(72, 11, 'UA.ie === 6');
function visit20_9_1(result) {
  _$jscoverage['/overlay/extension/mask.js'].branchData['9'][1].ranCondition(result);
  return result;
}_$jscoverage['/overlay/extension/mask.js'].lineData[6]++;
KISSY.add(function(S, require) {
  _$jscoverage['/overlay/extension/mask.js'].functionData[0]++;
  _$jscoverage['/overlay/extension/mask.js'].lineData[7]++;
  var UA = require('ua'), Node = require('node'), ie6 = (visit20_9_1(UA.ie === 6)), $ = Node.all;
  _$jscoverage['/overlay/extension/mask.js'].lineData[12]++;
  var TapGesture = require('event/gesture/tap');
  _$jscoverage['/overlay/extension/mask.js'].lineData[13]++;
  var tap = TapGesture.TAP;
  _$jscoverage['/overlay/extension/mask.js'].lineData[15]++;
  function docWidth() {
    _$jscoverage['/overlay/extension/mask.js'].functionData[1]++;
    _$jscoverage['/overlay/extension/mask.js'].lineData[16]++;
    return ie6 ? ('expression(KISSY.DOM.docWidth())') : '100%';
  }
  _$jscoverage['/overlay/extension/mask.js'].lineData[19]++;
  function docHeight() {
    _$jscoverage['/overlay/extension/mask.js'].functionData[2]++;
    _$jscoverage['/overlay/extension/mask.js'].lineData[20]++;
    return ie6 ? ('expression(KISSY.DOM.docHeight())') : '100%';
  }
  _$jscoverage['/overlay/extension/mask.js'].lineData[23]++;
  function initMask(self, hiddenCls) {
    _$jscoverage['/overlay/extension/mask.js'].functionData[3]++;
    _$jscoverage['/overlay/extension/mask.js'].lineData[24]++;
    var maskCls = self.getBaseCssClasses('mask'), mask = $('<div ' + ' style="width:' + docWidth() + ';' + 'left:0;' + 'top:0;' + 'height:' + docHeight() + ';' + 'position:' + (ie6 ? 'absolute' : 'fixed') + ';"' + ' class="' + maskCls + ' ' + hiddenCls + '">' + (ie6 ? '<' + 'iframe ' + 'style="position:absolute;' + 'left:' + '0' + ';' + 'top:' + '0' + ';' + 'background:red;' + 'width: expression(this.parentNode.offsetWidth);' + 'height: expression(this.parentNode.offsetHeight);' + 'filter:alpha(opacity=0);' + 'z-index:-1;"></iframe>' : '') + '</div>').prependTo('body');
    _$jscoverage['/overlay/extension/mask.js'].lineData[48]++;
    mask.unselectable();
    _$jscoverage['/overlay/extension/mask.js'].lineData[49]++;
    mask.on('mousedown', function(e) {
  _$jscoverage['/overlay/extension/mask.js'].functionData[4]++;
  _$jscoverage['/overlay/extension/mask.js'].lineData[50]++;
  e.preventDefault();
});
    _$jscoverage['/overlay/extension/mask.js'].lineData[52]++;
    return mask;
  }
  _$jscoverage['/overlay/extension/mask.js'].lineData[59]++;
  function Mask() {
    _$jscoverage['/overlay/extension/mask.js'].functionData[5]++;
  }
  _$jscoverage['/overlay/extension/mask.js'].lineData[62]++;
  Mask.ATTRS = {
  mask: {
  value: false}, 
  maskNode: {}};
  _$jscoverage['/overlay/extension/mask.js'].lineData[97]++;
  var NONE = 'none', effects = {
  fade: ['Out', 'In'], 
  slide: ['Up', 'Down']};
  _$jscoverage['/overlay/extension/mask.js'].lineData[100]++;
  function setMaskVisible(self, shown) {
    _$jscoverage['/overlay/extension/mask.js'].functionData[6]++;
    _$jscoverage['/overlay/extension/mask.js'].lineData[101]++;
    var maskNode = self.get('maskNode'), hiddenCls = self.getBaseCssClasses('mask-hidden');
    _$jscoverage['/overlay/extension/mask.js'].lineData[103]++;
    if (visit21_103_1(shown)) {
      _$jscoverage['/overlay/extension/mask.js'].lineData[104]++;
      maskNode.removeClass(hiddenCls);
    } else {
      _$jscoverage['/overlay/extension/mask.js'].lineData[106]++;
      maskNode.addClass(hiddenCls);
    }
  }
  _$jscoverage['/overlay/extension/mask.js'].lineData[110]++;
  function processMask(mask, el, show, self) {
    _$jscoverage['/overlay/extension/mask.js'].functionData[7]++;
    _$jscoverage['/overlay/extension/mask.js'].lineData[112]++;
    var effect = visit22_112_1(mask.effect || NONE);
    _$jscoverage['/overlay/extension/mask.js'].lineData[114]++;
    setMaskVisible(self, show);
    _$jscoverage['/overlay/extension/mask.js'].lineData[116]++;
    if (visit23_116_1(effect === NONE)) {
      _$jscoverage['/overlay/extension/mask.js'].lineData[117]++;
      return;
    }
    _$jscoverage['/overlay/extension/mask.js'].lineData[120]++;
    var duration = mask.duration, easing = mask.easing, m, index = show ? 1 : 0;
    _$jscoverage['/overlay/extension/mask.js'].lineData[126]++;
    el.stop(1, 1);
    _$jscoverage['/overlay/extension/mask.js'].lineData[128]++;
    el.css('display', show ? NONE : 'block');
    _$jscoverage['/overlay/extension/mask.js'].lineData[130]++;
    m = effect + effects[effect][index];
    _$jscoverage['/overlay/extension/mask.js'].lineData[132]++;
    el[m](duration, function() {
  _$jscoverage['/overlay/extension/mask.js'].functionData[8]++;
  _$jscoverage['/overlay/extension/mask.js'].lineData[133]++;
  el.css('display', '');
}, easing);
  }
  _$jscoverage['/overlay/extension/mask.js'].lineData[137]++;
  function afterVisibleChange(e) {
    _$jscoverage['/overlay/extension/mask.js'].functionData[9]++;
    _$jscoverage['/overlay/extension/mask.js'].lineData[138]++;
    var v, self = this, maskNode = self.get('maskNode');
    _$jscoverage['/overlay/extension/mask.js'].lineData[141]++;
    if ((v = e.newVal)) {
      _$jscoverage['/overlay/extension/mask.js'].lineData[142]++;
      var elZIndex = Number(self.$el.css('z-index'));
      _$jscoverage['/overlay/extension/mask.js'].lineData[143]++;
      if (visit24_143_1(!isNaN(elZIndex))) {
        _$jscoverage['/overlay/extension/mask.js'].lineData[144]++;
        maskNode.css('z-index', elZIndex);
      }
    }
    _$jscoverage['/overlay/extension/mask.js'].lineData[147]++;
    processMask(self.get('mask'), maskNode, v, self);
  }
  _$jscoverage['/overlay/extension/mask.js'].lineData[150]++;
  Mask.prototype = {
  __renderUI: function() {
  _$jscoverage['/overlay/extension/mask.js'].functionData[10]++;
  _$jscoverage['/overlay/extension/mask.js'].lineData[152]++;
  var self = this;
  _$jscoverage['/overlay/extension/mask.js'].lineData[153]++;
  if (visit25_153_1(self.get('mask'))) {
    _$jscoverage['/overlay/extension/mask.js'].lineData[154]++;
    self.set('maskNode', initMask(self, self.get('visible') ? '' : self.getBaseCssClasses('mask-hidden')));
  }
}, 
  __bindUI: function() {
  _$jscoverage['/overlay/extension/mask.js'].functionData[11]++;
  _$jscoverage['/overlay/extension/mask.js'].lineData[159]++;
  var self = this, maskNode, mask;
  _$jscoverage['/overlay/extension/mask.js'].lineData[162]++;
  if ((mask = self.get('mask'))) {
    _$jscoverage['/overlay/extension/mask.js'].lineData[163]++;
    maskNode = self.get('maskNode');
    _$jscoverage['/overlay/extension/mask.js'].lineData[164]++;
    if (visit26_164_1(mask.closeOnClick)) {
      _$jscoverage['/overlay/extension/mask.js'].lineData[165]++;
      maskNode.on(tap, self.close, self);
    }
    _$jscoverage['/overlay/extension/mask.js'].lineData[167]++;
    self.on('afterVisibleChange', afterVisibleChange);
  }
}, 
  __destructor: function() {
  _$jscoverage['/overlay/extension/mask.js'].functionData[12]++;
  _$jscoverage['/overlay/extension/mask.js'].lineData[172]++;
  var mask;
  _$jscoverage['/overlay/extension/mask.js'].lineData[173]++;
  if ((mask = this.get('maskNode'))) {
    _$jscoverage['/overlay/extension/mask.js'].lineData[174]++;
    mask.remove();
  }
}};
  _$jscoverage['/overlay/extension/mask.js'].lineData[179]++;
  return Mask;
});
