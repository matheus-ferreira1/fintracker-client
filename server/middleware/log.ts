export default defineEventHandler((event) => {
  const date = new Date()
  console.log(`${date.getDate} [${event.method}] ${getRequestURL(event)}`)
})
