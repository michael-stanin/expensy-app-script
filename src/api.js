
function addExpense(entryInfo) {
  _add_entry_internal(entryInfo);
}

function fetchSheetUsers(link) {
  return _fetch_sheet_display_values(link, "A2:A");
}

function fetchSheetCategories(link) {
  var categories = _fetch_sheet_display_values(link, "J10:J");
  PropertiesService.getUserProperties().setProperty('categories', JSON.stringify(categories));
  return categories;
}

function fetchSheetCategoryColors(link) {
  var ss = SpreadsheetApp.openByUrl(link);
  if (ss === undefined || ss === null) { return; }
  
  var target = ss.getSheetByName(mylocale == "BG" ? "Промени" : "Changes");  
  var categoryColors = target.getRange('K10:K').getBackgrounds().map((value, index) => value[0]).filter(value => value != "#ffffff");
  PropertiesService.getUserProperties().setProperty('categoryColors', JSON.stringify(categoryColors));
}

function fetchSheetExpenses(link) {
  var ss = SpreadsheetApp.openByUrl(link);
  if (ss === undefined || ss === null) { return; }  
  
  var specialSheetNames = [
   mylocale == "BG" ? "Промени" : "Changes",
   mylocale == "BG" ? "Начални данни" : "Initial data",
   mylocale == "BG" ? "Настройки" : "Settings"
  ];

  var options = {};
  for (let s of ss.getSheets()) {
    var sheetName = s.getName();
    
    if (!specialSheetNames.includes(sheetName)) {  
      var data = s.getRange("A2:A").getValues().filter(String);
      options = data.reduce((a,x) => ({...a, [String(x)]: null}), options);      
    }
  }

  /*
  monthSheet.forEach(function(value, key, map) {
    var targetSheetName = value;
    var target = ss.getSheetByName(targetSheetName);
    
    if (target != null) {
      var data = target.getRange("A2:A").getValues().filter(String);
      data.forEach(function (v) {
        options[v[0]] = null;
      });
      
    }
  });
  */
  return JSON.stringify(options);
}

function fetchSheetLocale(link) {
  var ss = SpreadsheetApp.openByUrl(link);
  if (ss === undefined || ss === null) { return; }  

  var changesSheet = ss.getSheetByName("Промени");
  if (changesSheet != null)
    mylocale = "BG";
  else
    mylocale = "EN";
}

function fetchTableData(link) {
  var ss = SpreadsheetApp.openByUrl(link);
  if (ss === undefined || ss === null) { return; }  
  
  var data = [];
  
  var maximumYearDiff = 10;
  var currentyearDiff = 0;
  do
  {
    var desiredSheetName = new Date().getFullYear() - currentyearDiff;
    var s = ss.getSheetByName(desiredSheetName);
    if (s != null) {
      //data = s.getRange("A2:E").getValues().filter(String);
      data = s.getRange(2, 1, s.getLastRow() -1, 5).getValues().filter(String);
    }
    currentyearDiff++;
  } while (s == null && currentyearDiff <= maximumYearDiff);

  data.map(i => i[2] = Date.parse(i[2]));
  return data;
}