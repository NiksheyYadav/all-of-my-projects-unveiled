// Type declarations to help TS/IDE resolve `@/*` imports
declare module "@/*" {
  const value: any
  export default value
}

declare module "@/lib/*" {
  const value: any
  export default value
}
