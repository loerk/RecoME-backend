export const globalErrorHandler = (err, req, res, next) => {
  console.log("global error handler", err);
  res.status(err.status || 500).json({
    message: "something went wrong",
    error: err.message || "check global error handler",
  });
};
