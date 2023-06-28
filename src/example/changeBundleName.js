class computeBundleSize {
  constructor(filename) {
    this.filename = filename;
  }
  apply(outputInfo) {
    outputInfo.filename = this.filename;
  }
}

export default computeBundleSize;
