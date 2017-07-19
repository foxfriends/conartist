/// <reference types="mocha" />
/// <reference path="../../conartist.d.ts" />

declare module '*.html' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}
