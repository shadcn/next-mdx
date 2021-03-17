const fs = require("fs")
const path = require("path")

console.info(`Generating ${process.env.NUM_POSTS} posts for benchmarks...`)

const directory = path.resolve("./content/posts")
fs.rmdirSync(directory, { recursive: true })
fs.mkdirSync(directory)

for (let count = 1; count <= process.env.NUM_POSTS; count++) {
  const dest = path.resolve(`./content/posts/post-${count}.mdx`)
  fs.copyFileSync(path.resolve("./stubs/post.mdx"), dest)
  fs.appendFileSync(dest, `End of file post-${count}.mdx`)
}
