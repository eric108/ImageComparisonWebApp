/**
 * Created by zjiang4 on 10/27/14.
 */

function catalogPrimaryImageByUPC(url, method, upc, dim, type) {


    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( method, url +"?upc="+upc+"&dim=" + dim + "&type=" + type, false );
    xmlHttp.send(null);

    return  xmlHttp.responseText;

}

function catalogPrimaryImageByPOBU(url, method, pobu, dim, type) {
    return catalogPrimaryImageByUPC(url, method, pobu, dim, type);
}


function pangeaPrimaryImageByWPID(url, method, WPID) {
    var xmlHttp = null;
    var assetURL = null;

    xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var myArr = JSON.parse(xmlHttp.responseText);

            assetURL = parseJsonFromAsset(myArr);
        }
    }
    xmlHttp.open( method, url + "/" + WPID, false );
    xmlHttp.setRequestHeader("Content-Type", "application/json");

    xmlHttp.send(null);

    return assetURL;
}



function parseJsonFromAsset(response) {

    var assetURL =null;
    var entityList = response.payload.entityAssetList;
    var i;
    for(i = 0; i< entityList.length; i++) {
        if(entityList[i].assetType == "PRIMARY") {
            assetURL = entityList[i].assetUrl;
            break;
        }
    }
    return assetURL;
}