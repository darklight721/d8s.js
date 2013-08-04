/*
 * d8s.js - a simple js date formatter
 * Usage:
 *  d8s().print('MM-DD-YY hh:mm:ss');                        // outputs: 07-21-13 10:25:01
 *  d8s('2013/7/21' ,'YYYY/M/D').print('DDD of MMMM, YYYY'); // outputs: 21st of July, 2013
 *  d8s('Sep. 5, 2013 13:30', 'MMM. D, YYYY HH:mm').date();  // returns the Date object with the set date
 *  d8s(new Date(1995,11,17)).print('DD.MM.YYYY');           // outputs: 17.11.1995
*/
window.d8s = window.d8s || (function(){

  // private member
  var _date = new Date();

  // formats definition
  var ordinals = ['th', 'st', 'nd', 'rd'],
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      mons = months.map(function(m){ return m.substr(0, 3); }),
      formats = {
        // day
        'D'  : {
          get: function() { return _date.getDate(); },
          set: function(day) { _date.setDate(day); },
          rgx: '(\\d{1,2})'
        },
        'DD' : {
          get: function() { return to2Digits(formats.D.get()); },
          set: function(day) { formats.D.set(day); },
          rgx: '(\\d{2})'
        },
        'DDD' : {
          get: function() { var date = formats.D.get(); return date + (ordinals[date % 10] || ordinals[0]); },
          set: function(day) { formats.D.set(day); },
          rgx: '(\\d{1,2})(?:'+ ordinals.join('|') +')'
        },
        // month
        'M'   : {
          get: function() { return _date.getMonth() + 1; },
          set: function(month) { _date.setMonth(month - 1); },
          rgx: '(\\d{1,2})'
        },
        'MM'  : {
          get: function() { return to2Digits(formats.M.get()); },
          set: function(month) { formats.M.set(month); },
          rgx: '(\\d{2})'
        },
        'MMM' : {
          get: function() { return mons[formats.M.get() - 1]; },
          set: function(month) { formats.M.set(mons.indexOf(month) + 1); },
          rgx: '('+ mons.join('|') +')'
        },
        'MMMM': {
          get: function() { return months[formats.M.get() - 1]; },
          set: function(month) { formats.M.set(months.indexOf(month) + 1); },
          rgx: '('+ months.join('|') +')'
        },
        // year
        'YY'  : {
          get: function() { return to2Digits(formats.YYYY.get() % 100); },
          set: function(year) { formats.YYYY.set('20' + year); },
          rgx: '(\\d{2})'
        },
        'YYYY': {
          get: function() { return _date.getFullYear(); },
          set: function(year) { _date.setFullYear(year); },
          rgx: '(\\d{4})'
        },
        // hour
        'h'   : {
          get: function() { return formats.H.get() % 12; },
          set: function(hour) { formats.H.set(hour); },
          rgx: '(\\d{1,2})'
        },
        'hh'  : {
          get: function() { return to2Digits(formats.h.get()); },
          set: function(hour) { formats.H.set(hour); },
          rgx: '(\\d{2})'
        },
        'H'   : {
          get: function() { return _date.getHours(); },
          set: function(hour) { _date.setHours(hour); },
          rgx: '(\\d{1,2})'
        },
        'HH'  : {
          get: function() { return to2Digits(formats.H.get()); },
          set: function(hour) { formats.H.set(hour); },
          rgx: '(\\d{2})'
        },
        // minute
        'm'   : {
          get: function() { return _date.getMinutes(); },
          set: function(min) { _date.setMinutes(min); },
          rgx: '(\\d{1,2})'
        },
        'mm'  : {
          get: function() { return to2Digits(formats.m.get()); },
          set: function(min) { formats.m.set(min); },
          rgx: '(\\d{2})'
        },
        // second
        's'   : {
          get: function() { return _date.getSeconds(); },
          set: function(sec) { _date.setSeconds(sec); },
          rgx: '(\\d{1,2})'
        },
        'ss'  : {
          get: function() { return to2Digits(formats.s.get()); },
          set: function(sec) { formats.s.set(sec); },
          rgx: '(\\d{2})'
        },
        // dividers
        '/'   : {
          rgx: '\\/'
        },
        '.'   : {
          rgx: '\\.'
        }
      };

  // internal functions
  function scan(date, format) {
    var tokens = tokenize(format),
        regexp = tokens.reduce(function(regexp, token){
          var format = formats[token];
          return regexp + (format && format.rgx ? format.rgx : token);
        }, '^'),
        matches = date.match(new RegExp(regexp)),
        index = 1;

    matches && tokens.forEach(function(token) {
      var format = formats[token];
      format && format.set && format.set(matches[index++]);
    });
  }

  function tokenize(string) {
    var tokens = [], token = '';
    for (var i = 0; i < string.length; ++i) {
      var newToken = string[i];
      if (token[0] === newToken) {
        token += newToken;
      }
      else {
        tokens.push(token);
        token = newToken;
      }
    }
    tokens.push(token);
    return tokens;
  }

  function to2Digits(num) {
    return num < 10 ? '0' + num : num;
  }

  // api's
  var api = {
    print: function(format) {
      return tokenize(format).reduce(function(formattedDate, token){
        var format = formats[token];
        return formattedDate + (format && format.get ? format.get() : token);
      }, '');
    },
    date: function() {
      return new Date(_date.getTime());
    }
  };

  // constructor function
  return function(date, format) {
    if (typeof date === 'string' && typeof format === 'string') {
      scan(date, format);
    }
    else if (date instanceof Date) {
      _date.setTime(date.getTime());
    }
    else {
      _date.setTime(Date.now());
    }

    return api;
  };

})();
