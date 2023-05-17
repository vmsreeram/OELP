const { ipcRenderer } = require('electron');
const Papa = require('papaparse');
const usbDetect = require('usb-detection');
const openCsvButton = document.getElementById('open-csv-button');
const csvContent = document.getElementById('csv-content');
const saveToUsbButton = document.getElementById('save-to-usb-button');


openCsvButton.addEventListener('click', async () => {
  try {
    const result = await ipcRenderer.invoke('open-csv-dialog');
    if (result) {
      csvContent.value = result;
      saveToUsbButton.disabled = false;
    } else {
      csvContent.value = '';
      saveToUsbButton.disabled = true;
    }
  } catch (error) {
    console.error(error);
    csvContent.value = '';
    saveToUsbButton.disabled = true;
  }
});

saveToUsbButton.addEventListener('click', async () => {
    try {
      const usbDevices = await usbDetect.find();
      const usbDrive = usbDevices.find((device) => device.isUSB && !device.isMounted);
      if (usbDrive) {
        const csvData = await fs.promises.readFile(selectedFilePath, { encoding: 'utf-8' });
        const csvFileName = selectedFilePath.split(/[\\/]/).pop();
        const usbPath = usbDrive.mountpoints[0].path;
        const csvFilePath = `${usbPath}\\${csvFileName}`;
        await fs.promises.writeFile(csvFilePath, csvData, { encoding: 'utf-8' });
        alert(`CSV file saved to USB drive ${usbDrive.deviceName}!`);
      } else {
        alert('No unmounted USB drives found.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving CSV file to USB drive.');
    }
  });


ipcRenderer.on('csv-data', (event, csvData) => {
    console.log("aiofdf")
    if (csvData) {
        // console.log("here")
        // const columnNames = ['Column 1', 'Column 2', 'Column 3','Column 4']; // Replace with your column names
        // const parsedData = Papa.parse(csvData, { header: false, delimiter: ',', columns: columnNames });
        // console.log(parsedData)
        // const formattedData = JSON.stringify(parsedData.data, null, 2);
        csvContent.value = csvData;
      }
    else {
      csvContent.value = '';
    }
  });