export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("AUTHORIZE HIT");
    console.log("USER:", req.user);
    console.log("ROLE:", req.user?.role);

    // check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // check role permission
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    console.log("AUTHORIZE PASSED ");

    // allow request to continue
    next();
  };
};
