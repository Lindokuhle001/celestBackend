const maxTables = 10;
const getTable = (max) => {
  return Math.floor(Math.random() * max) + 1;
};

const noAuthPaths = ["/menu", "/price", "/login"];

const price = {
  perPersonCost: 126,
  table: getTable(maxTables),
  maxNumberOfPeople: 4,
};

const orders = [];

const menu = [
  {
    meal: "Glazed oysters with zucchini pearls and sevruga caviar",
    drink: "Wine pairing: kleine zalze brut rose",
  },
  {
    meal: "Seared anhi tuna with provincial vegetables and tapenade croutons",
    drink: "Wine pairing: bizoe semillon",
  },
  {
    meal: "Bream with asparagus, tempura mussels and a lime velouté",
    drink: "Wine pairing:  red city blend",
  },

  {
    meal: "Aged gouda with espresso, hazelnut and onion",
    drink: "Wine pairing: thelema early harvest",
  },
  {
    meal: "Dark chocolate panna cotta with a rhubarb and cherry compote",
    drink: "Wine pairing: clarington sauvignon blanc",
  },
];

module.exports = { menu, price, orders, noAuthPaths };
