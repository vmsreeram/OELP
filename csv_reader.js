const { ipcRenderer } = require('electron');
const Papa = require('papaparse');
const usb = require('usb');
const openCsvButton = document.getElementById('open-csv-button');
const csvContent = document.getElementById('csv-content');
const saveToUsbButton = document.getElementById('save-to-usb-button');

let csvFilePath = '';
function closeFn1() {
  ipcRenderer.send('close')
}
openCsvButton.addEventListener('click', async () => {
  try {
    const result = await ipcRenderer.invoke('open-csv-dialog');
    if (result) {
      csvContent.value = result;
      csvFilePath = result.filePath;
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
    const devices = usb.getDeviceList();
    const usbDrive = devices.find((device) => true || (device.deviceDescriptor.idVendor === 0x0781 && device.deviceDescriptor.idProduct === 0x558a));
    if (usbDrive) {
      usbDrive.open();
      const interface = usbDrive.interfaces[0];
      interface.claim();
      const endpoint = interface.endpoints[0];
      const csvData = await fs.promises.readFile(csvFilePath, { encoding: 'utf-8' });
      const csvFileName = path.basename(csvFilePath);
      endpoint.transfer(csvData, (error) => {
        if (error) {
          console.error(error);
          alert('Error saving CSV file to USB drive.');
        } else {
          alert(`CSV file saved to USB drive ${usbDrive.deviceDescriptor.iManufacturer} ${usbDrive.deviceDescriptor.iProduct}!`);
        }
        interface.release();
        usbDrive.close();
      });
    } else {
      alert('No suitable USB drives found.');
    }
  } catch (error) {
    console.error(error);
    alert('Error saving CSV file to USB drive.');
  }
});

ipcRenderer.on('csv-data', (event, csvData) => {
  if (csvData) {
    csvContent.value = csvData;
    saveToUsbButton.disabled = false;
  } else {
    csvContent.value = '';
    saveToUsbButton.disabled = true;
  }
});