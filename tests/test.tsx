
const path = "beke/Beke/pepe/caca"
const x = path.split("/")
let tmp_x:string[] = []
let currentPath = ""

x.map((i: string) => {
  currentPath += i
  tmp_x.push(currentPath)
  currentPath += "/"
});

console.log(tmp_x)
