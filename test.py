svg = '<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297">'
svg += '<rect x="0" y="0" width="210" height="297" style="fill: #ffffff; stroke: #000000;"/>'
svg += '<g id="ruler" stroke="#000000">'

# Minor ticks
svg += '<g stroke-width="0.3">\n'
for i in range(11, 290):
    svg += f'<line x1="0" y1="{i}" x2="5" y2="{i}"/>'
svg += '</g>'

# Major ticks
svg += '<g stroke-width="0.5">'
for i in range(10, 300, 10):
    svg += f'<line x1="0" y1="{i}" x2="10" y2="{i}"/>'
svg += '</g>'

svg += '</g>'
svg += '</svg>'

# Write SVG string to a file
with open('ruler.svg', 'w') as f:
    f.write(svg)
