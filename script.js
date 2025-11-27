async function convertPDF() {
document.getElementById("log").classList.add("loading");
    const fileInput = document.getElementById("file");
    const log = document.getElementById("log");
    log.textContent = "正在转换，请稍候…";

    if (!fileInput.files.length) {
        alert("请选择 PDF 文件");
        return;
    }

    const pdfData = await fileInput.files[0].arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        log.textContent = "解析第 " + i + " 页...";
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str).join(" ");
        fullText += strings + "\n\n";
    }

    log.textContent = "正在生成 DOCX 文件...";

    // 生成 DOCX (最简单文本版)
    const blob = new Blob([fullText], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "output.docx";
    a.click();

    log.textContent = "转换完成！";
}
document.getElementById("log").classList.remove("loading");
