; (function (window, undefined) {

  var _forEach = [].forEach;

  // 浅复制
  function _extend(target, source) {
    var result = target;
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        result[key] = source[key];
      }
    }
    return result;
  }

  // 格式化索引
  function _parseIndex(index, length) {
    return (length + index) % length;
  }

  function _removeStyle(dom, style) {
    Object.keys(style).forEach(function (key) {
      dom.style[key] = "";
    });
  }

  function _addStyle(dom, style) {
    Object.keys(style).forEach(function (key) {
      dom.style[key] = style[key];
    });
  }

  var _nameSpace = 'film-';
  var _defaultOptions = {
    wrap: 'wrap',
    item: 'item',
    speed: 1000,
    init: 0,
    mainFrame: 0,
    unstyle: {
      display: "none",
    }
  }

  /**
   * @constructor
   * @param {Object} options 
   */
  function Film(options) {
    this._options = _options = _extend(_defaultOptions, options);

    this._wrap = document.getElementsByClassName(_nameSpace + _options.wrap)[0];
    this._items = this._wrap.getElementsByClassName(_nameSpace + _options.item);

    this._frames = _options.frames;
    this._unstyle = _options.unstyle;

    this._activeIndex = _options.init;
    this._mainFrame = _options.mainFrame;

    this._length = this._items.length;
    this.length = this._length;
    this.init();
  }

  Film.prototype.init = function () {
    var self = this;
    // 元素数需要大于帧数，否则clone填充
    var _styleLen = self._frames.length;
    if (self._length < _styleLen + 1) {
      var i = Math.ceil(_styleLen / self._length);
      while (i--) {
        _forEach.call(self._items, function (item) {
          self._wrap.appendChild(item.cloneNode(true));
        });
      }
      self._length = self._items.length;
    }
    self.goto(self._activeIndex);
  }

  Film.prototype.activeIndex = function() {
    return _parseIndex(this._activeIndex, this.length);
  }

  Film.prototype.move = function (dt) {

  }

  Film.prototype.go = function (detalIndex) {
    var self = this;
    var oldIndex = self._activeIndex;
    var newIndex = _parseIndex(self._activeIndex + detalIndex, self._length);
    self._activeIndex = newIndex;

    var oldStyle, newStyle;
    _forEach.call(self._items, function (item, i) {
      oldStyle = self._frames[_parseIndex(i - oldIndex + self._mainFrame, self._length)];
      newStyle = self._frames[_parseIndex(i - newIndex + self._mainFrame, self._length)];
      _removeStyle(item, oldStyle || self._unstyle);
      _addStyle(item, newStyle || self._unstyle);
    });
  }

  Film.prototype.goto = function (index) {
    this.go(index - this._activeIndex);
  }

  Film.prototype.next = function () {
    this.go(1);
  }

  Film.prototype.prev = function () {
    this.go(-1);
  }

  Film.prototype.on = function () {

  }

  Film.prototype.autoPlay = function (interval) {
    var self = this;
    if (self._timer) clearInterval(self._timer);
    self._timer = setInterval(function () {
      self.next();
    }, interval || self._options.speed);
  }


  Film.createFrame = function (count, iteratee) {
    var i = 0, style = [];
    while (i < count) {
      style.push(iteratee(i++));
    }
    return style;
  }

  window.Film = Film;
})(window, undefined);



