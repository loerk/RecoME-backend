export const globalErrorHandler = (error, req, res, next) => {
  console.log("global error handler", error);
  res.status(error.status || 500).json({
    message: "something went wrong",
    error: error.message || "check global error handler",
  });
};
