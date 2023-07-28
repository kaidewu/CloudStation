const path = "beke/Beke/pepe/caca"

const x = path.split("/")

let tmp_x = ""

x.map((i) => (
    tmp_x += (i + "/")
))

console.log(tmp_x)