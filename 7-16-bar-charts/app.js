async function draw() {
  // Data
  const dataset = await d3.csv('data.csv', (d) => {
    d3.autoType(d)
    return d
  })
  
  // Dimensions
  let dimensions = {
    width: 1000,
    height: 600,
    margins: 20,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g")
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  // Scales
  const stackGenerator = d3.stack()
    .keys(dataset.columns.slice(1))
  const stackData = stackGenerator(dataset).map((ageGroup) => {
    ageGroup.forEach((state) => {
      state.key = ageGroup.key
    })
    return ageGroup
  })
  
  const yScale = d3.scaleLiner()
    .domain([
      0, d3.max(stackData, (ag) => {
        return d3.max(ag, state => state[1])
      })
    ])
    .rangeRound([dimensions.ctrHeight, dimensions.margins])

  const xScale = d3.scaleBand()
    .domain(dataset.map(state => state.name))
    .range([dimensions.margins, dimensions.ctrWidth])
}

draw()