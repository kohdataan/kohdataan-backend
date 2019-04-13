exports.getQuestions = (req, res, next) => {
  res.status(501).send('get all questions');
};

exports.getQuestion = (req, res, next) => {
  res.status(501).send('get question');
};

exports.addQuestion = (req, res, next) => {
  res.status(501).send('add question');
};

exports.updateQuestion = (req, res, next) => {
  res.status(501).send('put question');
};

exports.deleteQuestion = (req, res, next) => {
  res.status(501).send('delete question');
};
