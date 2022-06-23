const maxTables = 10;
const availableTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const getTable = () => {
  const table = Math.floor(Math.random() * availableTables.length) + 1;
  availableTables.splice(table, 1);
  return availableTables[table];
};

// const availableTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const getTable = () => {
//   const table = Math.floor(Math.random() * availableTables.length) + 1;
//   availableTables.splice(table, 1);
//   return availableTables[table];
// };
// restarting heroku

const noAuthPaths = ["/menu", "/price", "/login"];

const price = {
  perPersonCost: 126,
  table: getTable(),
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
