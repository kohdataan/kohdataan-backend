exports.sendImageToChannel = (req, res, next) => {
  res.status(501).send('send image to channel');
};

exports.sendAudioToChannel = (req, res, next) => {
  res.status(501).send('send audio to channel');
};

exports.leaveChannel = (req, res, next) => {
  res.status(501).send('leave channel');
};
