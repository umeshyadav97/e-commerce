import jsCookie from "js-cookie"
export const setSession = (key, value) => {
  jsCookie.set(key, JSON.stringify(value))
}
export const getSession = (key) => {
  return jsCookie.get(key)
}
export const removeSession = (key) => {
  jsCookie.remove(key);
}
export const setFilterData= (key, value) => {
  jsCookie.set(key, JSON.stringify(value))
}
export const getFilterData = (key) => {
  return jsCookie.get(key)
}