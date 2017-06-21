
const Id = 'id', Company = 'Company', Cost = 'Cost';

const filterItems = [
  { text: 'Alfreds Futterkiste', value: 'Alfreds Futterkiste' },
  { text: 'Francisco Chang', value: 'Francisco Chang' },
  { text: 'Roland Mendel', value: 'Roland Mendel' },
];

function parseData(data) {
  if (!Array.isArray(data)) {
    data = [];
  }
  data.forEach((e, index) => {
    e[Id] = index + e[Company];

    const _cost = e[Cost];
    if (_cost) {
      let p = parseFloat(_cost);
      if (!isNaN(p)) {
        e[Cost] = p;
      }
    }
  });
  return data;
}

export {Id, Company, Cost, parseData, filterItems}