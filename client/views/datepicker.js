/*
 * Rendering of the datepicker that allows changing SelectedDate.
 */
Template.datepicker.rendered = function () {
  var $datepicker = $('#datepicker');
  var $datepickerInput = $('#datepicker input');
  var $datepickerDropdown = $('.datepicker-dropdown');

  /*
   * If datepicker related objects already exist in the DOM, we must delete them
   * and add them again in order to avoid obsolete objects.
   */
  if ($datepickerDropdown.length !== 0) {
    $datepicker.datepicker("remove");
    $datepickerDropdown.remove();
  }

  /*
   * Every time the datepicker is rendered, it is created again, and
   * this code sets its language and format to current I18N language/locale.
   */
  $datepicker.datepicker({
    format: I18N.getDatepickerFormat(),
    language: I18N.getLanguage(),
    autoclose: true,
    todayBtn: "linked",
    todayHighlight: true
  });

  /*
   * This event guarantees the whole datepicker is visible
   * during date selection (after click on input),
   * scrolling to show it entirely only if necessary.
   */
  $datepicker.on('show', function (ev) {
    $helpers.scrollToIfHidden(".datepicker-dropdown", true, this);
  });

  /*
   * Always shows the datepicker,
   * even after clicking on its input again (when it is already visible).
   */
  $datepickerInput.click(function (ev) {
    $datepicker.datepicker("show");
  });

  /*
   * Sets datepicker value to current SelectedDate.
   */
  $datepickerInput.val(SelectedDate.getFormatted());

  /*
   * Updates SelectedDate when datepicker date is changed.
   */
  $datepicker.on('changeDate', function (ev) {
    SelectedDate.setAsMoment(moment.utc(ev.date.valueOf()));
  });
};
