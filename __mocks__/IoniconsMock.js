const React = require("react");

function IoniconsMock({ name, color, size }) {
  return React.createElement(
    "Icon",
    {
      color,
      name,
      size,
    },
  );
}

module.exports = IoniconsMock;
