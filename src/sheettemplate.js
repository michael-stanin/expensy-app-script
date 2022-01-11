var CATEGORIES_STARTING_INDEX = 10;

function _fill_sheet_data(ss, targetSheet) {
    var settingsSheet = ss.getSheetByName(mylocale == "BG" ? "Настройки" : "Settings");
    if (!settingsSheet) {
        return;
    }

    var targetRange = _copy_category_range(settingsSheet, 'B2:B', targetSheet, 'J10:J');

    var targetTotalRangeFormula = "=SUM(K10:K)";
    var targetTotalRange = targetSheet.getRange('K9');
    targetTotalRange.setFormula(targetTotalRangeFormula);

    var numberOfCatergories = targetRange.getDisplayValues().map((value, index) => value[0]).filter(String).length;
    for (var i = 0; i < numberOfCatergories; i++) {
        var currentRow = i + CATEGORIES_STARTING_INDEX;
        var formula = "=SUMIF(E:E;J" + currentRow + ";B:B)"
        var targetFormulaRange = targetSheet.getRange('K' + currentRow.toString());
        targetFormulaRange.setFormula(formula);
    }

    var usersRangeEnd = settingsSheet.getRange('A2:A').getDisplayValues().map((value, index) => value[0]).filter(String).length;
    var usersRange = settingsSheet.getRange('A2:A' + (1 + usersRangeEnd).toString()); // + 1 because we start from A2... and want to take all
    var usersTargetStartingRange = 13;
    var targetUserRange = targetSheet.getRange('M' + usersTargetStartingRange + ':M' + (usersTargetStartingRange + usersRangeEnd).toString())
    usersRange.copyTo(targetUserRange);

    var usersSalaryRangeEnd = settingsSheet.getRange('E2:E').getDisplayValues().map((value, index) => value[0]).filter(String).length;
    var usersSalaryRange = settingsSheet.getRange('E2:E' + (1 + usersSalaryRangeEnd).toString()); // + 1 because we start from E2... and want to take all
    var usersSalaryTargetStartingRange = 3;
    var targetUserSalaryRange = targetSheet.getRange('H' + usersSalaryTargetStartingRange + ':H' + (usersSalaryTargetStartingRange + usersSalaryRangeEnd).toString())
    usersSalaryRange.copyTo(targetUserSalaryRange);

    // Copy user range salaries
    for (var i = 0; i < usersRangeEnd; i++) {
        var targetTotalPerPersonRangeFormula = "=SUMIF(D:D;" + 'M' + (usersTargetStartingRange + i).toString() + ";B:B)";
        targetSheet.getRange('N' + (usersTargetStartingRange + i).toString()).setFormula(targetTotalPerPersonRangeFormula);      
    }

    _set_sheet_formatting(ss, targetSheet);
  
    // Fill other values such as 1st line with Expense, Prices, etc..
    // as well as Income, Total expenses, balance
    // Income for each of the people
    // total for each of the person
    // Sort button below total of each person
    _add_sheet_essentials(targetSheet);

    _createChart(targetSheet);
}

// returns the targetRange
function _copy_category_range(sourceSheet, sourceA1Notation, targetSheet, targetA1Notation)
{
  var sourceRangeEnd = sourceSheet.getRange(sourceA1Notation).getDisplayValues().map((value, index) => value[0]).filter(String).length;
  var sourceRange = sourceSheet.getRange(sourceA1Notation + (1 + sourceRangeEnd).toString()); // + 1 because we start from B2... and want to take all
  
  var targetRange = targetSheet.getRange(targetA1Notation + (CATEGORIES_STARTING_INDEX + sourceRangeEnd).toString()); // take the real target range of values from start to end, because we need it to set the formulas for each each of them
  sourceRange.copyTo(targetRange);
  
  return targetRange;
}

function _set_sheet_formatting(ss, targetSheet)
{
  // Set currency number format
  var priceRange = targetSheet.getRange('B:B')
   .setNumberFormat(mylocale == "BG" ? '#.00 лв' : '$ #.00')
   .setHorizontalAlignment("center");
  
  var dateRange = targetSheet.getRange('C:C')
   .setNumberFormat('dd mmmm')
   .setHorizontalAlignment("center");
  
  var nameRange = targetSheet.getRange('D:D')
   .setHorizontalAlignment("center");
  
  var categoryRange = targetSheet.getRange('E:E')
   .setHorizontalAlignment("center");
  
  var settingsSheet = ss.getSheetByName(mylocale == "BG" ? "Настройки" : "Settings");
  var range = settingsSheet.getRange('B2:B');
  var categoriesRule = SpreadsheetApp.newDataValidation().requireValueInRange(range).build();
  targetSheet.getRange('E2:E').setDataValidation(categoriesRule);
  
  range = settingsSheet.getRange('A2:A');
  var usersRule = SpreadsheetApp.newDataValidation().requireValueInRange(range).build();
  targetSheet.getRange('D2:D').setDataValidation(usersRule);
}

function _add_sheet_essentials(target)
{
  target.setFrozenRows(1);
  
  var expensesHeaderRange = target.getRange('A1:E1');
  var totalMonthIncome = target.getRange('H1');
  var totalMonthExpenses = target.getRange('J1');
  var totalMonthLeftOver = target.getRange('L1');
  var totalMonthIncomeFormula = target.getRange('H2');
  var totalMonthExpensesFormula = target.getRange('J2');
  var totalMonthLeftOverFormula = target.getRange('L2');
  
  _set_fonts_and_style_header_row(expensesHeaderRange, '#007272');
  _set_fonts_and_style_header_row(totalMonthIncome, '#730000');
  _set_fonts_and_style_header_row(totalMonthExpenses, '#730000');
  _set_fonts_and_style_header_row(totalMonthLeftOver, '#730000');
  _set_fonts_and_style_header_row(totalMonthIncomeFormula, '#733900');
  _set_fonts_and_style_header_row(totalMonthExpensesFormula, '#733900');
  _set_fonts_and_style_header_row(totalMonthLeftOverFormula, '#733900');

  _set_header_texts(target);
  _set_formulas(target);
}

function _set_fonts_and_style_header_row(targetRange, bgColor)
{
  targetRange
  .setFontSize(12)
  .setFontWeight('bold')
  .setHorizontalAlignment("center")
  .setFontColor('#ffffff')
  .setBackgroundColor(bgColor)
  .setBorder(
    true, true, true, true, null, null,
    null,
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function _set_header_texts(target)
{
  target.getRange('A1').setValue(mylocale == "BG" ? 'Разход' : "Expense name");
  target.getRange('B1').setValue(mylocale == "BG" ? 'Цена' : "Price");
  target.getRange('C1').setValue(mylocale == "BG" ? 'Дата' : "Date");
  target.getRange('D1').setValue(mylocale == "BG" ? 'Закупил' : "Paid by");
  target.getRange('E1').setValue(mylocale == "BG" ? 'Категория' : "Category");
  
  target.getRange('H1').setValue(mylocale == "BG" ? 'Приходи' : "Income");
  target.getRange('J1').setValue(mylocale == "BG" ? 'Разходи' : "Expenses");
  target.getRange('L1').setValue(mylocale == "BG" ? 'Остатък' : "Leftover");
}

function _set_formulas(target)
{
  var totalMonthIncomeFormula = target.getRange('H2').setNumberFormat(mylocale == "BG" ? '#.00 лв' : '$ #.00');
  totalMonthIncomeFormula.setFormula("=SUM(H3:H)");
  
  var totalMonthExpensesFormula = target.getRange('J2');
  totalMonthExpensesFormula.setFormula("=SUM(B:B)");
  
  var totalMonthLeftOverFormula = target.getRange('L2');  
  totalMonthLeftOverFormula.setFormula("=MINUS(H2;J2)");
}

function _createChart(target)
{
  var targetRange = target.getRange('J10:K');
    
    var chart = target.newChart()
        .setChartType(Charts.ChartType.PIE)
        .addRange(targetRange)
        .setPosition(5, 6, 0, 0)
        .setOption("title", mylocale == "BG" ? "Разходи за месеца" : "Monthly expenses")
        .setOption("pieSliceText", "percentage")
        .setOption("pieSliceTextStyle", "Montserrat")
        .setOption("legend.textStyle", "Montserrat")
        .setOption("titleTextStyle", "Montserrat")  
        .setOption("height", 240)
        .setOption("width", 240)
        .build();
    target.insertChart(chart);
}