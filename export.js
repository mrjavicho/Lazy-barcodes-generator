function exportPdf() {

    var currentContent = document.getElementById('barcodesContainer').innerHTML;
    window.sessionStorage.setItem('currentBarcodes', currentContent);

    const exportPath = 'https://mrjavicho.github.io/Lazy-barcodes-generator/export.html'
    //const exportPath = 'export.html'
    var printPreview = window.open(exportPath);

    printContainer.innerHTML = currentContent
    printPreview.print(); 

    return;
}
