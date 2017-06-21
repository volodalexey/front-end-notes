function getData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { "Company": "Alfreds Futterkiste", "Cost": "0.25632" },
        { "Company": "Francisco Chang", "Cost": "44.5347645745" },
        { "Company": "Ernst Handel", "Cost": "100.0" },
        { "Company": "Roland Mendel", "Cost": "0.456676" },
        { "Company": "Island Trading Island Trading Island Trading Island Trading Island Trading", "Cost": "0.5" },
      ])
    }, 2000)
  })
}

export { getData }