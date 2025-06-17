String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

function createBarcodeGrid(entries) {
    let html = [];
    html.push('<div class="grid-container">');
  
    for (let i = 0; i < entries.length; i++) {
      const id = `barcode_image_${i}`;
      html.push(`<div class="barcode-container"><img id="${id}" class="barcode-image"></div>`);
    }
  
    html.push('</div>');
    return html.join('');
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
        
        let gridHtml = createBarcodeGrid(entries);
        document.getElementById("barcodesContainer").innerHTML = gridHtml;

        
        const symbology = document.getElementById("symbologySelector").value
        localStorage.setItem('lastSymbology', symbology);
        const addText = document.getElementById("addTextCheck").checked
        let canvas = document.createElement('canvas');

        for (let i = 0; i < entries.length; i++) {
            const barcodeValue = entries[i].trim();
            const id = `barcode_image_${i}`;//this is the value used when creating the grid

            var options = {
                bcid: symbology,       // Barcode type
                text: barcodeValue,    // Text to encode
                scale: 3,               // 3x scaling factor
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
