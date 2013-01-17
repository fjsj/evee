/*
 * ifIsNull template helper.
 * Template equivalent of if (value === null).
 */
Handlebars.registerHelper('ifIsNull', function (value, options) {
  if (value === null) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

/*
 * formatDate template helper.
 * Converts from Facebook date formats to local (current language) time and date format.
 */
Handlebars.registerHelper('formatDate', function (value) {
  var localFormat = I18N.getDateFormat();
  return moment(value, Facebook.fbDateFormats).format("HH:mm " + localFormat);
});

/*
 * formatDateAsKey template helper.
 * Converts from Facebook date formats to SelectedDate.keyFormat,
 * which is compatible with Facebook.getEventsByDate function.
 */
Handlebars.registerHelper('formatDateAsKey', function (value) {
  return moment(value, Facebook.fbDateFormats).format(SelectedDate.getKeyFormat());
});

/*
 * Translation template helper.
 * Translate the given message to the current language (if necessary).
 */
Handlebars.registerHelper('trans', function (value) {
  return I18N.translate(value);
});

/*
 * Convert new line (\n\r) to <br>.
 * See: https://github.com/danharper/Handlebars-Helpers/blob/master/helpers.js
 */
Handlebars.registerHelper('nl2br', function(text) {
  var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
  return new Handlebars.SafeString(nl2br);
});

/**
 * jQuery-based helpers.
 * scrollTo and scrollToIfHidden provide smooth scrolling functionality.
 * forceAllToSameHeight forces .step-fluid content columns to have the same height.
 */
$helpers = (function () {
  var isScrolledIntoView = function (selector, fully) {
    // See: http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
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
