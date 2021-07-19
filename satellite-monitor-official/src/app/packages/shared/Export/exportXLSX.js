
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const ExportXLSX = ({ csvData, fileName, text }) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <span type='text' onClick={(e) => exportToCSV(csvData, fileName)}>{text}</span>
    )
}

export default ExportXLSX;