module.exports = (req, res, next) => {
  process.__client = {
    origin: req.apiGateway.event.headers.origin || req.apiGateway.event.headers.Origin,
  };

  const afterResponse = () => {
    res.removeListener('finish', afterResponse);
    res.removeListener('close', afterResponse);
  };

  res.on('finish', afterResponse);
  res.on('close', afterResponse);
  if (next) next();
};
