export const printerFleet = [
  {
    id: 'x1-carbon',
    name: 'Bambu Lab X1 Carbon',
    status: 'Available',
    progress: 0,
    eta: '-',
    nozzleTemp: '26°C',
    bedTemp: '28°C',
    lastJob: 'Idle',
    connection: 'Local Network',
  },
  {
    id: 'p1s-combo',
    name: 'Bambu Lab P1S Combo',
    status: 'Printing',
    progress: 47,
    eta: '1h 28m',
    nozzleTemp: '215°C',
    bedTemp: '60°C',
    lastJob: 'Enclosure revision',
    connection: 'Moonraker API',
  },
  {
    id: 'a1-multi',
    name: 'Bambu Lab A1 Multi-Color',
    status: 'Paused',
    progress: 34,
    eta: '2h 56m',
    nozzleTemp: '185°C',
    bedTemp: '55°C',
    lastJob: 'Color test print',
    connection: 'Local Network',
  },
];

export const printerLiveState = {
  'x1-carbon': {
    status: 'Available',
    progress: 0,
    nozzleTemp: '26°C',
    bedTemp: '28°C',
    timeRemaining: '-',
    currentFile: '-',
    estimatedTime: '-',
    cameraStream: 'https://via.placeholder.com/720x405?text=Live+Camera+Feed',
    statusMessage: 'Ready for new job',
    fileInfo: 'No active file',
  },
  'p1s-combo': {
    status: 'Printing',
    progress: 47,
    nozzleTemp: '215°C',
    bedTemp: '60°C',
    timeRemaining: '1h 28m',
    currentFile: 'R100462 Bambu Lab P1S Combo 3D Printer.stl',
    estimatedTime: '1h 28m',
    cameraStream: 'https://via.placeholder.com/720x405?text=Live+Camera+Feed',
    statusMessage: 'Print in progress',
    fileInfo: 'Layer 152 / 340',
  },
  'a1-multi': {
    status: 'Paused',
    progress: 34,
    nozzleTemp: '185°C',
    bedTemp: '55°C',
    timeRemaining: '2h 56m',
    currentFile: 'R132781 Bambu Lab A1 3D Printer.stl',
    estimatedTime: '2h 56m',
    cameraStream: 'https://via.placeholder.com/720x405?text=Live+Camera+Feed',
    statusMessage: 'Paused for filament swap',
    fileInfo: 'Layer 98 / 210',
  },
};

export function getPrinterById(printerId) {
  return printerFleet.find((printer) => printer.id === printerId);
}

export function getLiveState(printerId) {
  return printerLiveState[printerId];
}

export function updateLiveState(printerId, changes) {
  if (!printerLiveState[printerId]) {
    printerLiveState[printerId] = {
      status: 'Available',
      progress: 0,
      nozzleTemp: '25°C',
      bedTemp: '25°C',
      timeRemaining: '-',
      currentFile: '-',
      estimatedTime: '-',
      cameraStream: 'https://via.placeholder.com/720x405?text=Live+Camera+Feed',
      statusMessage: 'Ready for new job',
      fileInfo: 'No active file',
    };
  }

  printerLiveState[printerId] = {
    ...printerLiveState[printerId],
    ...changes,
  };

  return printerLiveState[printerId];
}
