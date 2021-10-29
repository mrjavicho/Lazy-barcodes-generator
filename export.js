function exportPdf() {

    var currentContent = document.getElementById('barcodesContainer').innerHTML;
    window.sessionStorage.setItem('currentBarcodes', currentContent);

    var printPreview = window.open('export.html');

    printContainer.innerHTML = currentContent
    printPreview.print(); 

    return;
}