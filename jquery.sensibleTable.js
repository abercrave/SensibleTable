/*
 * Sensible Table
 * by Ben Evans
 *
 * Based on Responsive Tables by ZURB
 * https://github.com/zurb/responsive-tables
 *
 * Sensible Table "freezes" the first column of a table on small-screened devices while allowing the remaining columns to be scrolled left/right. The breakpoint is set to 640px but is configurable via the ST options.
 *
 * Usage:
 *
 *   var myTable = new $.sensibleTable($('#my-table'), {breakpoint: 767px});
 *
 * Unusage:
 *
 *   myTable.destroy();
 */

;(function($) {

  $.sensibleTable = function(element, options) {

    var ST = this,
        defaults = {
          tableClass: 'sensible-table',
          wrapperClass: 'sensible-table-wrapper',
          pinnedClass: 'sensible-table-pinned',
          scrollableClass: 'sensible-table-scrollable',
          breakPoint: 640,
          imagesCheckMethod: null
        },
        switched = false;

    ST.settings = {};

    var bindUI = function() {
      $(window).on('redraw resize', updateTables);
    };

    ST.destroy = function() {
      $(window).off('redraw resize', updateTables);
      if (ST.$_element.data('allTheImgs')) {
        ST.$_element.data('allTheImgs').destroy();
      }
    };

    var updateTables = function(event) {
      if (event !== undefined && event.type === 'redraw') {
        switched = false;
      }
      if (!switched && ($(window).width() < ST.settings.breakPoint)){
        switched = true;
        ST.$_element.each(function() {
          splitTable($(this));
        });
      } else if (switched && ($(window).width() >= ST.settings.breakPoint)) {
        switched = false;
        ST.$_element.each(function() {
          resetTable($(this));
        });
      }
    };

    var splitTable = function($_pinned) {
      var $_scrollable = $_pinned.clone(),
        $_wrapper;

      $_pinned
        .wrap('<div class="' + ST.settings.wrapperClass + '" />')
        .find('td:not(:first-child), th:not(:first-child)')
          .css('display', 'none');

      $_wrapper = $_pinned.closest('.' + ST.settings.wrapperClass);
      $_wrapper.append($_scrollable);

      $_pinned.wrap('<div class="' + ST.settings.pinnedClass + '" />');
      $_scrollable.removeClass(ST.settings.tableClass).wrap('<div class="' + ST.settings.scrollableClass + '" />');

      switch (ST.settings.imagesCheckMethod) {
        case 'allTheImgs':
          $_wrapper.allTheImgs(function() {
            setCellHeights($_pinned, $_scrollable);
          });
          break;
        case 'imagesLoaded':
          $_wrapper.imagesLoaded(function() {
            setCellHeights($_pinned, $_scrollable);
          });
          break;
        default:
          setCellHeights($_pinned, $_scrollable);
      }
    };

    var resetTable = function($_pinned) {
      $_pinned.removeClass(ST.settings.pinnedClass).find('tr').css('height', '').find('th, td').css('display', '');
      $_pinned.closest('.' + ST.settings.wrapperClass).find('.' + ST.settings.scrollableClass).remove();
      $_pinned.unwrap().unwrap();
    };

    var setCellHeights = function($_pinned, $_scrollable) {
      var $_pinnedRows = $_pinned.find('tr'),
        $_scrollableRows = $_scrollable.find('tr'),
        heights = [];

      $_scrollableRows.each(function(i) {
        var $_row = $(this),
          $_cells = $_row.find('th, td');

        $_cells.each(function() {
          var $_cell = $(this),
            height = $_cell.innerHeight(),
            colspan = $_cell.attr('colspan');
          if ($_cell.css('box-sizing') === 'border-box') {
            height += (parseInt($_cell.css('border-top-width'), 10) + parseInt($_cell.css('border-bottom-width'), 10));
          }
          if (colspan) {
            $_cell.attr('colspan', colspan - 1).html('&nbsp;');
          }
          heights[i] = heights[i] || 0;
          heights[i] = Math.max(heights[i], height);
        });

      });

      $_pinnedRows.each(function(i) {
        $(this).height(heights[i]);
      });
    };

    var init = function() {
      ST.settings = $.extend({}, defaults, options);
      ST.$_element = element;
      if (ST.settings.imagesCheckMethod && $.fn[ST.settings.imagesCheckMethod] === undefined) {
        ST.settings.imagesCheckMethod = null;
      }
      updateTables();
      bindUI();
    };

    init();
  };

}(jQuery));
