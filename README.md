SensibleTable
=============

Sensible Table* "freezes" the first column of a table on small-screened devices while allowing the remaining columns to be scrolled left/right. The breakpoint is set to 640px by default but that and its classnames are configurable via the options.

Usage:
  
  var myTable = new $.sensibleTable($('#my-table'), {breakpoint: 767px});

Unusage:

  myTable.destroy();
  
*Based on Responsive Tables by ZURB [https://github.com/zurb/responsive-tables]
