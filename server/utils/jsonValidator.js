const validateJson = (req, res, next) => {

  const { body } = req.body;

  if (!body) {
    return next();
  }

  if (typeof body === "object") {
    return next();
  }

  try {

    JSON.parse(body);

    next();

  } catch {

    return res.status(400).json({
      success: false,
      message: "Invalid JSON Body",
    });

  }

};

export default validateJson;