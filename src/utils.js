function render(file, argsObject)
{
  Logger.log(file);
  var tmp = HtmlService.createTemplateFromFile(file)  
  //var tmp = HtmlService.createHtmlOutputFromFile(file)
    //.setTitle('Expensy');
  if (argsObject) {
    var keys = Object.keys(argsObject);
    keys.forEach(function(key) {
      tmp[key] = argsObject[key];
    });
  }
  return tmp.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

//@return Base Url
function getScriptUrl() {
  /*
  Logger.log("script url: "+ScriptApp.getService().getUrl());
  Logger.log("Script is accessible as a web app: " + ScriptApp.getService().isEnabled());
  Logger.log("script id: "+ScriptApp.getScriptId());
  */
  return ScriptApp.getService().getUrl();
}

//@return Html page raw content string
function getHtml(hash) {
  return HtmlService.createHtmlOutputFromFile(hash).getContent()
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function _add_entry_internal(entryInfo) {
  var ss = SpreadsheetApp.openByUrl(entryInfo.link);  
  if (ss === undefined || ss === null) { return; }
  
  if (entryInfo.username && entryInfo.username != "" && entryInfo.category && entryInfo.category != "" && entryInfo.expense && entryInfo.expense != "" && entryInfo.price && entryInfo.price != "") {

    Logger.log("Using date: " + entryInfo.date);
    var targetSheetName = new Date(entryInfo.date.split("/")[2]).getFullYear().toString();
    Logger.log("Sheet name deduced: " + targetSheetName);
    var target = ss.getSheetByName(targetSheetName);
    if (target === null) {
      target = ss.insertSheet(targetSheetName);
      var rowMinmimumCount = 40;
      var columnMinimumCount = 14
      var lastRow = target.getMaxRows();
      var lastColumn = target.getMaxColumns()
      target.deleteRows(rowMinmimumCount, lastRow - rowMinmimumCount);
      target.deleteColumns(columnMinimumCount, lastColumn - columnMinimumCount);
      _fill_sheet_data(ss, target);
    }
    if (target != null) {
      Logger.log("Found sheet: " + targetSheetName);
      
      entryInfo.price = entryInfo.price.toString().replace('.',',');
      var rowData = [entryInfo.expense, entryInfo.price, entryInfo.date, entryInfo.username, entryInfo.category];
      var newRow = _insert_Row(target, rowData);
      var color = _fetch_sheet_category_color(entryInfo.category);
      newRow.setBackground(color)
            .setFontFamily('Montserrat');
      
      target.autoResizeColumn(1)
            .autoResizeColumn(2)
            .autoResizeColumn(3)
            .autoResizeColumn(4)
            .autoResizeColumn(5);
    }
  }
}

function _fetch_sheet_display_values(link, a1Notation) {
  var ss = SpreadsheetApp.openByUrl(link);
  if (ss === undefined || ss === null) { return; }
  Logger.log("mylocale: " + mylocale);
  var target = ss.getSheetByName(mylocale == "BG" ? "Промени" : "Changes");  
  Logger.log("Sheet name deduced: " + target.getName());
  var valuesRange = target.getRange(a1Notation);
  var values = valuesRange.getDisplayValues().map((value, index) => value[0]).filter(String);
  return values;
}

function _insert_Row(sheet, rowData) {
  Logger.log(rowData);
  var index = sheet.getRange("A1").getDataRegion().getLastRow();
  var newRowRange = sheet.getRange(index + 1, 1, 1, 5).setValues([rowData]);
  return newRowRange;
}

function _fetch_sheet_category_color(category) {
  var categories_and_colors = _fetch_sheet_categories_and_colors();
  return categories_and_colors[1][categories_and_colors[0].indexOf(category)];
}

function _fetch_sheet_categories_and_colors() {
  var categories = JSON.parse(PropertiesService.getUserProperties().getProperty('categories'));
  var categoryColors = JSON.parse(PropertiesService.getUserProperties().getProperty('categoryColors'));
  return [categories, categoryColors];
}
