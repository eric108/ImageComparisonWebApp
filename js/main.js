var data;
var size;
var productIdList = [];
var itemIdList = [];
var sizePerPage = 25;
var pin;
var reportWrapper = {};
var flag = false;
var catalogURL = "http://vwsback.walmart.com/servlet/imageurlbyupcservlet";
var pangeaURL = "http://itemasset.prod.itemasset.catdev.glb.prod.walmart.com/itemasset-setup-app/services/assetgroupsetup/get/PRODUCT";
var methed = "GET";
var dim = 500;
var imgType = "b";
var pagePin = 1;
var totalPage = 0;


function clearContents(element) {
    element.value = '';
    element.style.backgroundColor = "white";
    element.style.color = "black";
}

goToResult = function() {
    data = document.getElementById("inputText").value;
    if(!isNaN(parseInt(document.getElementById("sizePerPage").value))) {
        sizePerPage=parseInt(document.getElementById("sizePerPage").value);
    }
    parseData(data);
    pin = 0;
    totalPage =  Math.ceil(productIdList.length/sizePerPage);
    output(pin, Math.min(sizePerPage, productIdList.length));
};

function parseData(data) {
    var all = data.split(/[\s,]+/);
    size = all.length/2;
    for (i = 0; i < all.length; i = i+2) {
        productIdList[i/2] = all[i];
        itemIdList[i/2] = all[i+1];
    }
}

function output(start, end){

    if(flag) {
        removeDummy('wholeTable');
        removeDummy('botDiv');
    }else {
        removeDummy('leftInputBox');
        removeDummy('rightInputBox');
    }
    flag = true;
    // Create table.
    var table = document.createElement('table');
    table.setAttribute('class', 'resultTable');
    table.setAttribute('id', 'wholeTable');

    var wholeTitle = document.getElementById("wholeTitle");
    wholeTitle.innerHTML = "Primary Images Comparison (left: New Site; right: Old Site)";

    for(i = start; i< end; i++) {
        var row = table.insertRow(i-start);
        row.setAttribute('class', 'resultRow');



        var rowCol1 = row.insertCell(0);
        rowCol1.setAttribute('class', 'resultCol');
        var img = document.createElement('img');
        var WPIDURL = pangeaPrimaryImageByWPID(pangeaURL, methed, productIdList[i]);
        img.src = WPIDURL;
        rowCol1.appendChild(img);
        var WPID = document.createElement('p');
        WPID.innerHTML = productIdList[i];
        rowCol1.appendChild(WPID);
        var WPIDURL_P = document.createElement('p');
        WPIDURL_P.innerHTML =WPIDURL;
        WPIDURL_P.setAttribute('id', 'WPIDURL_P' + i);
        rowCol1.appendChild(WPIDURL_P);

        var rowCol2 = row.insertCell(1);
        rowCol2.setAttribute('class', 'resultCol');
        img = document.createElement('img');
        var POBUURL = catalogPrimaryImageByPOBU(catalogURL, methed, itemIdList[i], dim, imgType);
        img.src = POBUURL;
        rowCol2.appendChild(img);
        var POBUID = document.createElement('p');
        POBUID.innerHTML = itemIdList[i];
        rowCol2.appendChild(POBUID);
        var POBUURL_P = document.createElement('p');
        POBUURL_P.innerHTML =POBUURL;
        POBUURL_P.setAttribute('id', 'POBUURL_P' + i);
        rowCol2.appendChild(POBUURL_P);


        var rowCol3 = row.insertCell(2);
        rowCol3.setAttribute('class', 'checkBox');

        var checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.name = 'checkBox';
        checkBox.setAttribute('id', 'index' + i);
        checkBox.setAttribute('class', 'realCheckBox');
        if(reportWrapper[i]!=null) {
            checkBox.checked = true;
        }
        rowCol3.appendChild(checkBox);
    }

    // Append Table to existing tag.
    var div = document.getElementById('resultPage');
    div.appendChild(table);

    var pageCount = document.createElement('p');
    pageCount.setAttribute('id', 'pagePin');
    pageCount.innerHTML = "Page: "  + pagePin + "/" + totalPage + ", " + sizePerPage + "/page";

    var previousPage = document.createElement('button');
    previousPage.setAttribute('id', 'previousPage');
    previousPage.innerHTML = "<<";

    var nextPage = document.createElement('button');
    nextPage.setAttribute('id', 'nextPage');
    nextPage.innerHTML = ">>";

    var generateReport = document.createElement('button');
    generateReport.setAttribute('id', 'generateReport');
    generateReport.innerHTML = "Report";


    var botDiv = document.createElement('div');
    botDiv.setAttribute('id', 'botDiv');
    botDiv.appendChild(pageCount);
    botDiv.appendChild(previousPage);
    botDiv.appendChild(generateReport);
    botDiv.appendChild(nextPage);

    div.appendChild(botDiv);
    document.getElementById('previousPage').onclick = function(){goToPrePage();};
    document.getElementById('generateReport').onclick = function(){reportGeneration();};
    document.getElementById('nextPage').onclick = function(){goToNextPage();};

    window.scrollTo(0, 0);
    //   document.getElementById('reportGeneration').addEventListener('click',reportGeneration(),true);

}

function goToPrePage() {

    if(pin - sizePerPage>=0) {
        pagePin--;
        reportProgress();
        pin = pin - sizePerPage;
        output(pin, Math.min(sizePerPage + pin, size));
    }
}

function goToNextPage() {
    if(pin + sizePerPage<size) {
        pagePin++;
        reportProgress();
        pin = pin + sizePerPage;
        output(pin, Math.min(sizePerPage + pin, size));
    }
}

function reportProgress() {
    var list = document.getElementsByName("checkBox");
    var i ;
    for (i = 0; i < list.length; i++) {
        if (list[i].checked == true) {
            var box = document.getElementById(list[i].id);

            var cell = box.parentNode;

            var row = cell.parentNode;


            var rowIndex = row.rowIndex;
            var totalIndex = rowIndex + pin;

            if (!(totalIndex in reportWrapper)) {

                var report = new ComparisonObject(totalIndex, productIdList[totalIndex], row.getElementsByTagName('TD')[0].getElementsByTagName("P")[1].innerHTML, itemIdList[totalIndex], row.getElementsByTagName('TD')[1].getElementsByTagName("P")[1].innerHTML);
                reportWrapper[totalIndex] = report;
            }
        }
    }
}
function reportGeneration() {
    reportProgress();

    alert('Thanks for picking the problematic images');

    document.body.innerHTML = '';

    var resultSize = reportWrapper.length;
    var A = [['index', 'WPID', 'WPID_URL', 'POBU', 'POBU_URL']];
//    var A = [['n','sqrt(n)']];  // initialize array of rows with header row as 1st item

//    for(var j=1;j<resultSize;j++){ A.push([reportWrapper[], Math.sqrt(j)]) }
    for(var j in reportWrapper) {
        A.push([reportWrapper[j].totalIndex, reportWrapper[j].productId,
            reportWrapper[j].productIdURL, reportWrapper[j].itemId, reportWrapper[j].itemIdURL])
    }
    var csvRows = [];
    for(var i=0,l= A.length; i<l; i++){
        csvRows.push(A[i].join(','));   // unquoted CSV row
    }
    var csvString = csvRows.join("\r\n");

    var a = document.createElement('a');
    a.href     = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvString);
    a.target   ='_blank';
    a.download = 'myFile.csv,' + encodeURIComponent(csvString);
    a.innerHTML = "Click me to download the file.";
    document.body.appendChild(a);
//.........................................
//    var paper="";
//    for(var key in reportWrapper) {
//        paper +="<p>" + reportWrapper[key].output() + "</p>";
//    }
//    document.write(paper);

    for(var key in reportWrapper) {
        var resultBox = document.createElement('p');
        resultBox.innerHTML = reportWrapper[key].output();
        document.body.appendChild(resultBox);
    }
}


function removeDummy(elementId) {
    var elem = document.getElementById(elementId);
    elem.parentNode.removeChild(elem);
}
//
//function fakeService(id) {
//    switch (id) {
//        case 0:
//            return "blue";
//        case 1:
//            return "red"
//        case 2:
//            return "green"
//        case 3:
//            return "yellow"
//        default:
//            return "black"
//    }
//}


function ComparisonObject(totalIndex, productId, productIdURL, itemId, itemIdURL) {
    this.totalIndex = totalIndex;
    this.productId = productId;
    this.productIdURL = productIdURL;
    this.itemId = itemId;
    this.itemIdURL = itemIdURL;
}

ComparisonObject.prototype.output = function() {
    return "index: " + this.totalIndex + ", WPID: " + this.productId + ", WPID_URL: "+ this.productIdURL
        + ", POBU: " + this.itemId + ", POBU_URL: " + this.itemIdURL;
};
















