var Route = {};
Route.path = function(route, callback) {
  Route[route] = callback;
};

function doGet(e) {
  /*
  Route.path("settings", loadSettings);
  Route.path("charts", loadCharts);
  
  var view = e.parameter.v;
  Logger.log(view);
  if (Route[view]) {
    return Route[view]();
  }
  */
  return render('index');
}

function loadSettings() {
  return render("settings");
}

function loadCharts() {
  return render("charts");
}

/*
//@return Base Url
function getUrl() {
  return ScriptApp.getService().getUrl()
}
//@return Html page raw content string
function getHtml(hash) {
  return HtmlService.createHtmlOutputFromFile(hash).getContent()
}

//@return provided page in the urlquery '?page=[PAGEID]' or main index page
function doGet(e) {
  var page = e.parameter.page
  return HtmlService.createHtmlOutputFromFile(page || 'index')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('Expensy')
}
*/