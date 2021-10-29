function exportPdf() {

    var currentContent = document.getElementById('barcodesContainer').innerHTML;
    window.sessionStorage.setItem('currentBarcodes', currentContent);

    var printPreview = window.open('export.html');

    printContainer.innerHTML = currentContent
    printPreview.print(); 

    return;

    var element = document.getElementById('barcodesContainer');
//        filename: `barcodes_${Date.now}.pdf`,
    var opt = {
        html2canvas: {
            dpi: 300,
            letterRendering: true,
            useCORS: true
        }
    };

    html2pdf().set(opt).from(element).save();
    return
}