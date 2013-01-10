Handlebars.registerHelper('ifIsNull', function (value, options) {
  if (value === null) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('formatDate', function (value) {
  var localFormat = i18n.getDateFormat();
  return moment(value, facebook.fbDateFormats).format("HH:mm " + localFormat);
});

Handlebars.registerHelper('trans', function (value) {
  return i18n.translate(value);
});

/**
 * Convert new line (\n\r) to <br>
 * from http://phpjs.org/functions/nl2br:480
 */
// https://github.com/danharper/Handlebars-Helpers/blob/master/helpers.js
Handlebars.registerHelper('nl2br', function(text) {
  var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
  return new Handlebars.SafeString(nl2br);
});

$helpers = (function () {
  var isScrolledIntoView = function (selector, fully) {
    // http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(selector).offset().top;
    var elemBottom = elemTop + $(selector).height();

    var isVisible = (elemBottom <= docViewBottom) && (elemTop >= docViewTop);
    if (fully) {
      isVisible = isVisible && (elemBottom >= docViewTop) && (elemTop <= docViewBottom);
    }
    return isVisible;
  };

  var scrollTo = function (selector) {
    $('html, body').animate({
      scrollTop: $(selector).offset().top
    }, 500);
  };

  var scrollToIfHidden = function (selector, partially, destinationSelector) {
    if (!isScrolledIntoView(selector, partially)) {
      scrollTo(destinationSelector);
    }
  };

  var forceAllToSameHeight = function (selector) {
    if ($(".step-fluid").css("display") === "inline-block") {
      var heights = [];
      $(selector).each(function () {
        heights.push($(this).height());
      });
      var maxHeight = _.max(heights);
      $(selector).css("min-height", maxHeight);
    }
  };

  return {
    scrollTo: scrollTo,
    scrollToIfHidden: scrollToIfHidden,
    forceAllToSameHeight: forceAllToSameHeight
  };
}());
