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
if (! _$jscoverage['/runtime/linked-buffer.js']) {
  _$jscoverage['/runtime/linked-buffer.js'] = {};
  _$jscoverage['/runtime/linked-buffer.js'].lineData = [];
  _$jscoverage['/runtime/linked-buffer.js'].lineData[5] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[6] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[8] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[9] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[10] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[13] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[19] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[20] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[22] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[26] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[27] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[28] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[29] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[30] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[31] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[32] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[33] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[34] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[35] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[39] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[40] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[41] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[42] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[47] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[48] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[49] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[50] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[51] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[53] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[57] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[58] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[59] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[60] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[61] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[64] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[68] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[69] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[70] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[71] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[72] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[74] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[76] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[77] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[79] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[83] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[85] = 0;
}
if (! _$jscoverage['/runtime/linked-buffer.js'].functionData) {
  _$jscoverage['/runtime/linked-buffer.js'].functionData = [];
  _$jscoverage['/runtime/linked-buffer.js'].functionData[0] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].functionData[1] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].functionData[2] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].functionData[3] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].functionData[4] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].functionData[5] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].functionData[6] = 0;
  _$jscoverage['/runtime/linked-buffer.js'].functionData[7] = 0;
}
if (! _$jscoverage['/runtime/linked-buffer.js'].branchData) {
  _$jscoverage['/runtime/linked-buffer.js'].branchData = {};
  _$jscoverage['/runtime/linked-buffer.js'].branchData['19'] = [];
  _$jscoverage['/runtime/linked-buffer.js'].branchData['19'][1] = new BranchData();
  _$jscoverage['/runtime/linked-buffer.js'].branchData['19'][2] = new BranchData();
  _$jscoverage['/runtime/linked-buffer.js'].branchData['40'] = [];
  _$jscoverage['/runtime/linked-buffer.js'].branchData['40'][1] = new BranchData();
  _$jscoverage['/runtime/linked-buffer.js'].branchData['48'] = [];
  _$jscoverage['/runtime/linked-buffer.js'].branchData['48'][1] = new BranchData();
  _$jscoverage['/runtime/linked-buffer.js'].branchData['71'] = [];
  _$jscoverage['/runtime/linked-buffer.js'].branchData['71'][1] = new BranchData();
}
_$jscoverage['/runtime/linked-buffer.js'].branchData['71'][1].init(22, 14, 'fragment.ready');
function visit32_71_1(result) {
  _$jscoverage['/runtime/linked-buffer.js'].branchData['71'][1].ranCondition(result);
  return result;
}_$jscoverage['/runtime/linked-buffer.js'].branchData['48'][1].init(48, 18, 'self.list.callback');
function visit31_48_1(result) {
  _$jscoverage['/runtime/linked-buffer.js'].branchData['48'][1].ranCondition(result);
  return result;
}_$jscoverage['/runtime/linked-buffer.js'].branchData['40'][1].init(66, 8, 'callback');
function visit30_40_1(result) {
  _$jscoverage['/runtime/linked-buffer.js'].branchData['40'][1].ranCondition(result);
  return result;
}_$jscoverage['/runtime/linked-buffer.js'].branchData['19'][2].init(26, 10, 'data === 0');
function visit29_19_2(result) {
  _$jscoverage['/runtime/linked-buffer.js'].branchData['19'][2].ranCondition(result);
  return result;
}_$jscoverage['/runtime/linked-buffer.js'].branchData['19'][1].init(18, 18, 'data || data === 0');
function visit28_19_1(result) {
  _$jscoverage['/runtime/linked-buffer.js'].branchData['19'][1].ranCondition(result);
  return result;
}_$jscoverage['/runtime/linked-buffer.js'].lineData[5]++;
KISSY.add(function(S) {
  _$jscoverage['/runtime/linked-buffer.js'].functionData[0]++;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[6]++;
  var undef;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[8]++;
  function Buffer(list) {
    _$jscoverage['/runtime/linked-buffer.js'].functionData[1]++;
    _$jscoverage['/runtime/linked-buffer.js'].lineData[9]++;
    this.list = list;
    _$jscoverage['/runtime/linked-buffer.js'].lineData[10]++;
    this.data = '';
  }
  _$jscoverage['/runtime/linked-buffer.js'].lineData[13]++;
  Buffer.prototype = {
  constructor: Buffer, 
  isBuffer: 1, 
  write: function(data, escape) {
  _$jscoverage['/runtime/linked-buffer.js'].functionData[2]++;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[19]++;
  if (visit28_19_1(data || visit29_19_2(data === 0))) {
    _$jscoverage['/runtime/linked-buffer.js'].lineData[20]++;
    this.data += escape ? S.escapeHtml(data) : data;
  }
  _$jscoverage['/runtime/linked-buffer.js'].lineData[22]++;
  return this;
}, 
  async: function(fn) {
  _$jscoverage['/runtime/linked-buffer.js'].functionData[3]++;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[26]++;
  var self = this;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[27]++;
  var list = self.list;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[28]++;
  var asyncFragment = new Buffer(list);
  _$jscoverage['/runtime/linked-buffer.js'].lineData[29]++;
  var nextFragment = new Buffer(list);
  _$jscoverage['/runtime/linked-buffer.js'].lineData[30]++;
  nextFragment.next = self.next;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[31]++;
  asyncFragment.next = nextFragment;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[32]++;
  self.next = asyncFragment;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[33]++;
  self.ready = true;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[34]++;
  fn(asyncFragment);
  _$jscoverage['/runtime/linked-buffer.js'].lineData[35]++;
  return nextFragment;
}, 
  error: function(reason) {
  _$jscoverage['/runtime/linked-buffer.js'].functionData[4]++;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[39]++;
  var callback = this.list.callback;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[40]++;
  if (visit30_40_1(callback)) {
    _$jscoverage['/runtime/linked-buffer.js'].lineData[41]++;
    callback(reason, undef);
    _$jscoverage['/runtime/linked-buffer.js'].lineData[42]++;
    this.list.callback = null;
  }
}, 
  end: function(data, escape) {
  _$jscoverage['/runtime/linked-buffer.js'].functionData[5]++;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[47]++;
  var self = this;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[48]++;
  if (visit31_48_1(self.list.callback)) {
    _$jscoverage['/runtime/linked-buffer.js'].lineData[49]++;
    self.write(data, escape);
    _$jscoverage['/runtime/linked-buffer.js'].lineData[50]++;
    self.ready = true;
    _$jscoverage['/runtime/linked-buffer.js'].lineData[51]++;
    self.list.flush();
  }
  _$jscoverage['/runtime/linked-buffer.js'].lineData[53]++;
  return self;
}};
  _$jscoverage['/runtime/linked-buffer.js'].lineData[57]++;
  function LinkedBuffer(callback) {
    _$jscoverage['/runtime/linked-buffer.js'].functionData[6]++;
    _$jscoverage['/runtime/linked-buffer.js'].lineData[58]++;
    var self = this;
    _$jscoverage['/runtime/linked-buffer.js'].lineData[59]++;
    self.head = new Buffer(self);
    _$jscoverage['/runtime/linked-buffer.js'].lineData[60]++;
    self.callback = callback;
    _$jscoverage['/runtime/linked-buffer.js'].lineData[61]++;
    self.data = '';
  }
  _$jscoverage['/runtime/linked-buffer.js'].lineData[64]++;
  LinkedBuffer.prototype = {
  constructor: LinkedBuffer, 
  flush: function() {
  _$jscoverage['/runtime/linked-buffer.js'].functionData[7]++;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[68]++;
  var self = this;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[69]++;
  var fragment = self.head;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[70]++;
  while (fragment) {
    _$jscoverage['/runtime/linked-buffer.js'].lineData[71]++;
    if (visit32_71_1(fragment.ready)) {
      _$jscoverage['/runtime/linked-buffer.js'].lineData[72]++;
      self.data += fragment.data;
    } else {
      _$jscoverage['/runtime/linked-buffer.js'].lineData[74]++;
      return;
    }
    _$jscoverage['/runtime/linked-buffer.js'].lineData[76]++;
    fragment = fragment.next;
    _$jscoverage['/runtime/linked-buffer.js'].lineData[77]++;
    self.head = fragment;
  }
  _$jscoverage['/runtime/linked-buffer.js'].lineData[79]++;
  self.callback(null, self.data);
}};
  _$jscoverage['/runtime/linked-buffer.js'].lineData[83]++;
  LinkedBuffer.Buffer = Buffer;
  _$jscoverage['/runtime/linked-buffer.js'].lineData[85]++;
  return LinkedBuffer;
});
