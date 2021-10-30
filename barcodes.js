String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

function generateBarcodes() {
    try {
        let str = document.getElementById("barcodesEntry").value;
        if(str == ''){
            document.getElementById("barcodesContainer").innerText = '';
            return
        }
        var separator;
        if (str.includes('\n')) {
            separator = '\n'
        }
        else if (str.includes(' ')) {
            separator = ' '
        }
        else if (str.includes(';')) {
            separator = ';'
        }
        else if (str.includes(',')) {
            separator = ','
        }
        let entries = str.split(separator)
        const entriesCount = entries.length
        const columnsPerRow = 4
        var rows = 1
        if (entriesCount > columnsPerRow) {
            let mod = entriesCount % columnsPerRow
            if (mod > 0) {
                rows = entriesCount / columnsPerRow
            }
            else {
                rows = (entriesCount / columnsPerRow) + 1
            }
        }

        var html = [];

        for (i = 0; i < rows; i++) {
            html.push("<div class=\"row\">");
            for (j = 0; j < columnsPerRow; j++) {
                const index = (i * columnsPerRow) + j;
                if (index >= entries.length) {
                    break;
                }
                const barcodeValue = entries[index].trim()

                const imageFormat = "<img src=\"{0}\"style=\"width:100%\">";
                const symbology = document.getElementById("symbologySelector").value
                const barcodeUrlFormat = "http://bwipjs-api.metafloor.com/?bcid={0}&text={1}";

                const barcodeUrl = String.format(barcodeUrlFormat, symbology, barcodeValue);
                const imageValue = String.format(imageFormat, barcodeUrl);

                const labelFormat = "<label class=\"text-center font-monospace fs-6\" style=\"width:100%\" >{0}</label>";
                const labelValue = String.format(labelFormat, barcodeValue);

                const addText = document.getElementById("addTextCheck").checked


                html.push("<div class=\"column\">");
                html.push(imageValue);

                if(addText){
                    html.push(labelValue);
                }
                
                html.push("</div>");
            }
            html.push("</div>");
        }

        document.getElementById("barcodesContainer").innerHTML = html.join("");
    }
    catch (error) {
        document.getElementById("barcodesContainer").innerText = error;
    }
}