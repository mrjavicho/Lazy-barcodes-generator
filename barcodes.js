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
        if (str == '') {
            document.getElementById("barcodesContainer").innerText = '';
            return
        }

        localStorage.setItem('lastRequest', str);

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
        var ids = [];

        for (i = 0; i < rows; i++) {
            html.push("<div class=\"row\">");
            for (j = 0; j < columnsPerRow; j++) {
                const index = (i * columnsPerRow) + j;
                if (index >= entries.length) {
                    break;
                }
                const newId = String.format("barcode_image_{0}{1}", i, j);
                ids.push(newId);
                const imageFormat = "<img id=\"{0}\">";

                const imageValue = String.format(imageFormat, newId);

                html.push("<div class=\"column bg-light\">");           
                html.push(imageValue);
                html.push("</div>");
            }
            html.push("</div>");
        }

        document.getElementById("barcodesContainer").innerHTML = html.join("");
        
        const symbology = document.getElementById("symbologySelector").value
        localStorage.setItem('lastSymbology', symbology);
        const addText = document.getElementById("addTextCheck").checked
        let canvas = document.createElement('canvas');

        for (let i = 0; i < entries.length; i++) {
            const barcodeValue = entries[i].trim();
            const id = ids[i];

            var options = {
                bcid: symbology,       // Barcode type
                text: barcodeValue,    // Text to encode
                scale: 3,               // 3x scaling factor
                height: 10,              // Bar height, in millimeters
                includetext: addText,            // Show human-readable text
                textxalign: 'center',        // Always good to set this
            };
            try {

                bwipjs.toCanvas(canvas, options);
                var img = document.getElementById(id);
                if (img != null) {
                    img.src = canvas.toDataURL('image/png');
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
    catch (error) {
        document.getElementById("barcodesContainer").innerText = error;
    }
}